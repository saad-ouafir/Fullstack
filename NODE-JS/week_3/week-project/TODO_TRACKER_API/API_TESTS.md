# Tests API - TODO Tracker

Ce document contient des exemples de requêtes pour tester l'API.

## 🔐 Authentification

### 1. Inscription d'un utilisateur

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Dupont",
    "email": "alice@example.com",
    "password": "password123"
  }'
```

**Réponse attendue (201) :**
```json
{
  "status": "success",
  "message": "Utilisateur créé avec succès",
  "data": {
    "id": "...",
    "name": "Alice Dupont",
    "email": "alice@example.com",
    "role": "user",
    "createdAt": "..."
  }
}
```

### 2. Inscription d'un admin

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "admin123",
    "role": "admin"
  }'
```

### 3. Connexion

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "password123"
  }'
```

**Réponse attendue (200) :**
```json
{
  "status": "success",
  "message": "Connexion réussie",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "...",
      "name": "Alice Dupont",
      "email": "alice@example.com",
      "role": "user"
    }
  }
}
```

**⚠️ IMPORTANT : Copiez le token pour les requêtes suivantes !**

### 4. Récupérer son profil

```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI"
```

## 📝 Gestion des Todos

**Note :** Remplacez `VOTRE_TOKEN_ICI` par le token obtenu lors de la connexion.

### 5. Créer un todo

```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI" \
  -d '{
    "title": "Apprendre MongoDB",
    "priority": "high",
    "dueDate": "2025-11-15"
  }'
```

**Réponse attendue (201) :**
```json
{
  "status": "success",
  "message": "Todo created successfully",
  "data": {
    "_id": "...",
    "title": "Apprendre MongoDB",
    "completed": false,
    "priority": "high",
    "dueDate": "2025-11-15T00:00:00.000Z",
    "user": {
      "_id": "...",
      "name": "Alice Dupont",
      "email": "alice@example.com"
    },
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### 6. Créer plusieurs todos

```bash
# Todo 2
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI" \
  -d '{
    "title": "Réviser JWT",
    "priority": "medium",
    "completed": false
  }'

# Todo 3
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI" \
  -d '{
    "title": "Faire les courses",
    "priority": "low",
    "dueDate": "2025-11-10"
  }'
```

### 7. Lister tous les todos

```bash
curl http://localhost:3000/api/todos \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI"
```

### 8. Lister avec filtres

```bash
# Todos actifs uniquement
curl "http://localhost:3000/api/todos?status=active" \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI"

# Todos de priorité haute
curl "http://localhost:3000/api/todos?priority=high" \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI"

# Recherche dans le titre
curl "http://localhost:3000/api/todos?q=MongoDB" \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI"

# Pagination
curl "http://localhost:3000/api/todos?page=1&limit=5" \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI"

# Combinaison de filtres
curl "http://localhost:3000/api/todos?status=active&priority=high&page=1&limit=10" \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI"
```

### 9. Récupérer un todo spécifique

```bash
# Remplacez TODO_ID par l'ID d'un todo
curl http://localhost:3000/api/todos/TODO_ID \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI"
```

### 10. Mettre à jour un todo

```bash
curl -X PATCH http://localhost:3000/api/todos/TODO_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI" \
  -d '{
    "completed": true,
    "priority": "low"
  }'
```

### 11. Basculer le statut completed

```bash
curl -X PATCH http://localhost:3000/api/todos/TODO_ID/toggle \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI"
```

### 12. Supprimer un todo

```bash
curl -X DELETE http://localhost:3000/api/todos/TODO_ID \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI"
```

**Réponse attendue (204) :** Pas de contenu

## 🔒 Tests d'Autorisation

### 13. Tester l'accès sans token (doit échouer)

```bash
curl http://localhost:3000/api/todos
```

**Réponse attendue (401) :**
```json
{
  "status": "error",
  "message": "Token d'authentification manquant",
  "code": 401,
  "timestamp": "..."
}
```

### 14. Tester avec un token invalide (doit échouer)

```bash
curl http://localhost:3000/api/todos \
  -H "Authorization: Bearer token-invalide"
```

**Réponse attendue (401) :**
```json
{
  "status": "error",
  "message": "Token invalide ou expiré",
  "code": 401,
  "timestamp": "..."
}
```

### 15. Tester l'isolation des utilisateurs

1. Créer un deuxième utilisateur :
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bob Martin",
    "email": "bob@example.com",
    "password": "password123"
  }'
```

2. Se connecter avec Bob :
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "bob@example.com",
    "password": "password123"
  }'
```

3. Lister les todos de Bob (doit être vide) :
```bash
curl http://localhost:3000/api/todos \
  -H "Authorization: Bearer TOKEN_DE_BOB"
```

4. Essayer d'accéder à un todo d'Alice avec le token de Bob (doit échouer) :
```bash
curl http://localhost:3000/api/todos/TODO_ID_DALICE \
  -H "Authorization: Bearer TOKEN_DE_BOB"
```

**Réponse attendue (404) :** Todo not found

### 16. Tester les privilèges admin

1. Se connecter en tant qu'admin :
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

2. Lister tous les todos (admin voit tout) :
```bash
curl http://localhost:3000/api/todos \
  -H "Authorization: Bearer TOKEN_ADMIN"
```

**Résultat attendu :** L'admin voit les todos de tous les utilisateurs.

## 🧪 Tests de Validation

### 17. Créer un todo sans titre (doit échouer)

```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI" \
  -d '{
    "priority": "high"
  }'
```

**Réponse attendue (400) :**
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": ["Title is required and cannot be empty"],
  "code": 400,
  "timestamp": "..."
}
```

### 18. Créer un todo avec une priorité invalide (doit échouer)

```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI" \
  -d '{
    "title": "Test",
    "priority": "urgent"
  }'
```

### 19. Inscription avec un email déjà utilisé (doit échouer)

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "alice@example.com",
    "password": "password123"
  }'
```

**Réponse attendue (400) :**
```json
{
  "status": "error",
  "message": "Cet email est déjà enregistré",
  "code": 400,
  "timestamp": "..."
}
```

### 20. Connexion avec un mauvais mot de passe (doit échouer)

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "mauvais-password"
  }'
```

**Réponse attendue (401) :**
```json
{
  "status": "error",
  "message": "Email ou mot de passe incorrect",
  "code": 401,
  "timestamp": "..."
}
```

## 📊 Vérification dans MongoDB Compass

1. Ouvrir MongoDB Compass
2. Se connecter à `mongodb://localhost:27017`
3. Sélectionner la base `todo-tracker`
4. Explorer les collections :
   - `users` : Vérifier que les mots de passe sont hachés
   - `todos` : Vérifier que chaque todo a un champ `user`

## ✅ Checklist de Tests

- [ ] Inscription d'un utilisateur normal
- [ ] Inscription d'un admin
- [ ] Connexion réussie
- [ ] Connexion échouée (mauvais mot de passe)
- [ ] Récupération du profil
- [ ] Création de todos
- [ ] Listage des todos avec filtres
- [ ] Mise à jour d'un todo
- [ ] Basculement du statut
- [ ] Suppression d'un todo
- [ ] Accès refusé sans token
- [ ] Accès refusé avec token invalide
- [ ] Isolation des todos entre utilisateurs
- [ ] Admin peut voir tous les todos
- [ ] Validation des champs requis
- [ ] Validation des formats de données
- [ ] Vérification dans MongoDB Compass

## 🎯 Scénario Complet

```bash
# 1. Créer un utilisateur
TOKEN_ALICE=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@test.com","password":"pass123"}' \
  | jq -r '.data.token')

# 2. Se connecter
TOKEN_ALICE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@test.com","password":"pass123"}' \
  | jq -r '.data.token')

# 3. Créer un todo
TODO_ID=$(curl -s -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN_ALICE" \
  -d '{"title":"Test Todo","priority":"high"}' \
  | jq -r '.data._id')

# 4. Lister les todos
curl http://localhost:3000/api/todos \
  -H "Authorization: Bearer $TOKEN_ALICE"

# 5. Marquer comme complété
curl -X PATCH http://localhost:3000/api/todos/$TODO_ID/toggle \
  -H "Authorization: Bearer $TOKEN_ALICE"

# 6. Supprimer
curl -X DELETE http://localhost:3000/api/todos/$TODO_ID \
  -H "Authorization: Bearer $TOKEN_ALICE"
```

**Note :** Ce script nécessite `jq` pour parser le JSON.
