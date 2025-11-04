# TODO Tracker API

Minimal REST API with Express.js to manage a TODO list, using file persistence (JSON), basic routing, middlewares, validation, filters, and pagination.

## Quick Start

- Requirements: Node 18+
- Install deps:

```bash
npm install
```

- Configure environment (optional):

```bash
cp .env.example .env
# then edit PORT_APP=3000
```

- Run dev server:

```bash
npm start
```

Server runs at: http://localhost:3000 (or PORT_APP)

## Project Structure

```
.
├─ server.js
├─ routes/
│  └─ todos.routes.js
├─ controllers/
│  └─ todos.controller.js
├─ services/
│  └─ todos.service.js
├─ middlewares/
│  ├─ logger.js
│  └─ errorHandler.js
└─ data/
   └─ todos.json
```

## Data Model (todo)

```json
{
  "id": "string|number",
  "title": "string",
  "completed": false,
  "priority": "low|medium|high",
  "dueDate": "YYYY-MM-DD|null",
  "createdAt": "ISO string",
  "updatedAt": "ISO string"
}
```

## Endpoints

Base URL: `/api/todos`

- GET `/` — list with filters
  - Query params:
    - `status=all|active|completed` (default: all)
    - `priority=low|medium|high`
    - `q=<substring>` (search in title)
    - `page=1&limit=10`
  - Response:

```json
{ "data": [ ... ], "total": 42, "page": 1, "pages": 5 }
```

- GET `/:id` — get by id
- POST `/` — create
  - Body: `{ "title": "...", "priority?": "low|medium|high", "dueDate?": "YYYY-MM-DD", "completed?": boolean }`
  - Response: 201 with created todo
- PATCH `/:id` — partial update
  - Allowed fields: `title`, `completed`, `priority`, `dueDate`
- DELETE `/:id` — delete
  - Response: 204
- PATCH `/:id/toggle` — invert `completed`

## Curl Examples

- Create

```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"bonus mini projet","priority":"high","dueDate":"2025-11-02"}'
```

- List with filters

```bash
curl "http://localhost:3000/api/todos?status=active&priority=high&q=cours&page=1&limit=5"
```

- Toggle

```bash
curl -X PATCH http://localhost:3000/api/todos/1/toggle
```

- Patch

```bash
curl -X PATCH http://localhost:3000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

- Delete

```bash
curl -X DELETE http://localhost:3000/api/todos/1
```

## Middlewares

- JSON parser: `express.json()`
- Logger: `morgan` — format `"[ISO] METHOD URL -> status durationMs"`
- Error handler: returns

```json
{ "status": "error", "message": "string", "code": 400, "timestamp": "ISO" }
```

## Notes

- Persistence uses `data/todos.json` via `fs.promises`.
- Default sorting: `createdAt` desc.
- Defaults: `priority=medium`, `completed=false`, `dueDate=null`.
