# ArdMarket Backend — ArdMarket

Backend MVP du projet **ArdMarket / ArdMarket** pour l'Oriental Hack 2e édition  
(thème: _IA & Innovation au service de la compétitivité des entreprises et organisations de l'Économie Sociale et Solidaire_).

Plateforme de **location / vente de terres agricoles** entre paysans et investisseurs — type "Airbnb des terres", avec IA pour:

- analyse automatique des documents fonciers (titre, note de renseignement, plan d'aménagement)
- score légal / trust-score affiché sur chaque fiche
- matching IA investisseur ↔ terre
- simulateur de rendement / ROI par culture
- ingestion WhatsApp en Darija (pour les paysans non-digitalisés)
- débblocage de contacts via crédits (modèle freemium / premium)

## Stack

- **Node.js + Express**
- **SQLite** (`better-sqlite3`) — zéro infra pour la démo
- **JWT** pour l'auth
- **Multer** pour l'upload d'images et documents
- **Zod** pour la validation

## Installation

```bash
cd backend
cp .env.example .env
npm install
npm run seed    # crée la base + données de démo
npm run dev     # démarre sur http://localhost:4000
```

Réinitialiser la base: `npm run reset`.

## Comptes de démo (mot de passe: `password123`)

| Email                         | Rôle         | Notes                                |
| ----------------------------- | ------------ | ------------------------------------ |
| `admin@ardmarket.ma`          | admin        | plan enterprise (1000 crédits)       |
| `ahmed@ardmarket.ma`          | agriculteur  | Taroudant, 2 terres                  |
| `fatima@ardmarket.ma`         | agriculteur  | Meknès, 2 terres (oliveraie boostée) |
| `mohamed@ardmarket.ma`        | agriculteur  | Gharb, 2 terres                      |
| `karim@ardmarket.ma`          | investisseur | **premium**, 50 crédits              |
| `sara@ardmarket.ma`           | investisseur | free, 0 crédits                      |
| `hassan.notaire@ardmarket.ma` | notaire      | **boosté**                           |
| `nadia.notaire@ardmarket.ma`  | notaire      | standard                             |
| `agrisupply@ardmarket.ma`     | fournisseur  | 3 ads actives                        |

## Endpoints

Base URL: `http://localhost:4000/api`

### Auth

```
POST /auth/register       { role, nom, email, password, phone?, whatsapp?, region? }
POST /auth/login          { email, password } -> { token, user }
GET  /auth/me             Bearer <token>
```

### Terres (Lands)

```
GET  /lands                          # recherche + filtres (q, region, crop_type, mode, has_water, surface_min/max, price_min/max, sort)
GET  /lands/:id                      # détail. Contact owner masqué sauf si unlocké
GET  /lands/recommendations          # matching IA pour l'investisseur connecté
POST /lands                          # agriculteur: créer une terre
PATCH /lands/:id
DELETE /lands/:id
POST /lands/:id/images               # multipart images[]
POST /lands/:id/documents            # multipart document + type=titre|note_renseignement|plan_amenagement|moulkia
GET  /lands/:id/score                # score légal IA (sur 100)
POST /lands/:id/simulate             # simulateur rendement/ROI
POST /lands/:id/unlock-contact       # investisseur dépense 10 crédits pour révéler contact
POST /lands/:id/offers               # investisseur fait une offre
```

### Offres

```
GET   /offers/mine                   # investisseur = siennes, agriculteur = reçues
PATCH /offers/:id/status             { status: 'accepted' | 'rejected' | 'pending' }
```

### Plans / Crédits / Boost

```
GET  /plans                          # free, premium, enterprise
POST /me/subscribe                   { plan: 'premium' | 'enterprise' }
GET  /me/credits
POST /me/credits/purchase            { pack: 'S' | 'M' | 'L' | 'XL' }
POST /me/boost                       { target: 'profile' | 'land', land_id?, days }
```

### Ads & Notaires

```
GET  /ads?category=intrants|machines|engrais|semences|notaire
POST /ads                            { category, title, description, image_url?, target_url?, boost_level? }
GET  /notaries?region=Meknès
```

### IA & WhatsApp

```
POST /ai/simulate-yield              { crop_type, surface_ha, has_water, region }
POST /ai/analyze-document            { filename, type, landHint? }
POST /ai/voice-to-land               { audio_url?, transcript?, user_whatsapp? }
POST /whatsapp/webhook               { user_whatsapp, audio_url?, transcript?, documents?[] }
```

Le webhook WhatsApp est le **point d'entrée pour le chatbot de ton pote**: il envoie le transcript Darija, le backend extrait les infos (région, surface, culture, eau, intention location/vente), crée le compte agriculteur s'il n'existe pas, et ouvre une fiche terrain en statut `pending`.

## Exemple curl — workflow complet

```bash
BASE=http://localhost:4000/api

# 1. Login investisseur
TOKEN=$(curl -s -X POST $BASE/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"karim@ardmarket.ma","password":"password123"}' \
  | jq -r .token)

# 2. Chercher terres de Meknès
curl -sG $BASE/lands --data-urlencode "region=Meknès"

# 3. Recommandations IA
curl -s -H "Authorization: Bearer $TOKEN" "$BASE/lands/recommendations?crop_type=oliviers"

# 4. Simuler ROI d'une terre
curl -s -X POST $BASE/lands/3/simulate -H 'Content-Type: application/json' -d '{}'

# 5. Débloquer contact (consomme 10 crédits)
curl -s -X POST $BASE/lands/1/unlock-contact -H "Authorization: Bearer $TOKEN"

# 6. Faire une offre
curl -s -X POST $BASE/lands/1/offers \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"price":500000,"duration_years":7,"message":"Offre sérieuse"}'

# 7. Webhook WhatsApp Darija (simulation chatbot)
curl -s -X POST $BASE/whatsapp/webhook \
  -H 'Content-Type: application/json' \
  -d '{"user_whatsapp":"+212691111111","transcript":"3andi wa7ed lard f Taroudant 5 hectares feha lma w zaytoun bghit nkriha"}'
```

## Architecture IA

Par défaut le backend tourne **sans clé API** (stubs intelligents) pour que le jury puisse lancer la démo en local. Les fonctions dans `src/ai/service.js` exposent une interface identique à une intégration LLM réelle:

- `analyzeDocument()` → remplace par un appel OCR (Tesseract/GCP Vision) + LLM extraction JSON
- `parseVoiceToLand()` → remplace par Whisper pour la transcription + LLM pour le parsing
- `simulateYield()` → modèle analytique calibré sur données publiques marocaines
- `rankLandsForInvestor()` → embeddings + similarité cosinus pour la V2
- `computeLegalScore()` → rule-based, évolue vers un modèle entraîné sur corpus notarial

Pour brancher OpenAI, ajoutez `OPENAI_API_KEY` dans `.env` et complétez les TODO dans `ai/service.js`.

## Sécurité & modèle de monétisation

| Source de revenus                              | Endpoint                         | Implémentation               |
| ---------------------------------------------- | -------------------------------- | ---------------------------- |
| Abonnement Premium (investisseurs)             | `POST /me/subscribe`             | ajoute crédits + marque plan |
| Achat de crédits à la demande                  | `POST /me/credits/purchase`      | 4 packs S/M/L/XL             |
| Déblocage contact paysan                       | `POST /lands/:id/unlock-contact` | 10 crédits/déblocage         |
| Boost terrain agriculteur / profil notaire     | `POST /me/boost`                 | remonté dans les tris        |
| Ads fournisseurs (intrants, machines, engrais) | `POST /ads` + `GET /ads`         | boost_level pour priorité    |

Les contacts (téléphone, WhatsApp) sont **toujours masqués** dans la réponse `GET /lands/:id` sauf si:

- le viewer est le propriétaire de la terre, OU
- le viewer a une entrée dans `contact_unlocks` pour cette terre.

## Intégration front

Le frontend React peut consommer l'API via un service `src/services/api.js`. Exemple minimal:

```js
const API = "http://localhost:4000/api";
export async function login(email, password) {
  const r = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return r.json();
}
```
