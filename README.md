# Log Book App

A REST API built with **Next.js (App Router)** for managing student assignments. Supports full CRUD operations with in-memory storage, input validation, and Swagger API documentation.

## Getting Started

```bash
npm install
npm run dev
```

- **App**: [http://localhost:3000](http://localhost:3000)
- **Swagger Docs**: [http://localhost:3000/docs](http://localhost:3000/docs)

## API Design Table

| Method   | Endpoint                  | Description              | Success Code | Error Code(s)     |
|----------|---------------------------|--------------------------|--------------|-------------------|
| `GET`    | `/api/assignments`        | Get all assignments      | `200`        | —                 |
| `POST`   | `/api/assignments`        | Create a new assignment  | `201`        | `400` (validation)|
| `GET`    | `/api/assignments/{id}`   | Get assignment by ID     | `200`        | `404` (not found) |
| `PUT`    | `/api/assignments/{id}`   | Update an assignment     | `200`        | `400` / `404`     |
| `DELETE` | `/api/assignments/{id}`   | Delete an assignment     | `200`        | `404` (not found) |

## Assignment Data Model

| Field            | Type     | Required | Description                                        |
|------------------|----------|----------|----------------------------------------------------|
| `id`             | string   | auto     | Unique ID (auto-generated)                         |
| `title`          | string   | ✅       | Assignment title                                   |
| `description`    | string   | ✅       | Assignment description                             |
| `status`         | string   | ❌       | `Created` / `On Process` / `Submitted` (default: `Created`) |
| `assignmentDate` | string   | auto     | Automatically set by the system when created       |
| `dueDate`        | string   | ✅       | Due date (use calendar, ISO 8601 format)           |

## Endpoint Testing — Success & Error Scenarios

---

### 1. GET `/api/assignments` — Get All Assignments

**✅ Success (200)**
```
GET http://localhost:3000/api/assignments
```
Response:
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 1,
      "title": "Next.js REST API Assignment",
      "description": "Build a REST API using Next.js with CRUD operations and Swagger documentation.",
      "status": "On Process",
      "assignmentDate": "2026-03-01T08:00:00.000Z",
      "dueDate": "2026-03-10T23:59:00.000Z"
    }
  ]
}
```

---

### 2. POST `/api/assignments` — Create Assignment

**✅ Success (201)** — all required fields provided
```
POST http://localhost:3000/api/assignments
Content-Type: application/json

{
  "title": "React Hooks Essay",
  "description": "Write about useState, useEffect, and custom hooks.",
  "dueDate": "2026-03-20T23:59:00.000Z"
}
```
Response:
```json
{
  "success": true,
  "message": "Assignment created successfully",
  "data": {
    "id": 4,
    "title": "React Hooks Essay",
    "description": "Write about useState, useEffect, and custom hooks.",
    "status": "Created",
    "assignmentDate": "2026-03-05T04:00:00.000Z",
    "dueDate": "2026-03-20T23:59:00.000Z"
  }
}
```

**❌ Error (400)** — missing required field `title`
```
POST http://localhost:3000/api/assignments
Content-Type: application/json

{
  "description": "No title provided",
  "dueDate": "2026-03-20T23:59:00.000Z"
}
```
Response:
```json
{
  "success": false,
  "message": "Field 'title' is required and must be a non-empty string."
}
```

---

### 3. GET `/api/assignments/{id}` — Get Assignment by ID

**✅ Success (200)** — valid ID
```
GET http://localhost:3000/api/assignments/1
```
Response:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Next.js REST API Assignment",
    "description": "Build a REST API using Next.js with CRUD operations and Swagger documentation.",
    "status": "On Process",
    "assignmentDate": "2026-03-01T08:00:00.000Z",
    "dueDate": "2026-03-10T23:59:00.000Z"
  }
}
```

**❌ Error (404)** — ID does not exist
```
GET http://localhost:3000/api/assignments/999
```
Response:
```json
{
  "success": false,
  "message": "Assignment with id '999' not found"
}
```

---

### 4. PUT `/api/assignments/{id}` — Update Assignment

**✅ Success (200)** — valid ID and body
```
PUT http://localhost:3000/api/assignments/1
Content-Type: application/json

{
  "status": "Submitted"
}
```
Response:
```json
{
  "success": true,
  "message": "Assignment updated successfully",
  "data": {
    "id": 1,
    "title": "Next.js REST API Assignment",
    "description": "Build a REST API using Next.js with CRUD operations and Swagger documentation.",
    "status": "Submitted",
    "assignmentDate": "2026-03-01T08:00:00.000Z",
    "dueDate": "2026-03-10T23:59:00.000Z"
  }
}
```

**❌ Error (404)** — ID does not exist
```
PUT http://localhost:3000/api/assignments/999
Content-Type: application/json

{
  "status": "Submitted"
}
```
Response:
```json
{
  "success": false,
  "message": "Assignment with id '999' not found"
}
```

**❌ Error (400)** — invalid status value
```
PUT http://localhost:3000/api/assignments/1
Content-Type: application/json

{
  "status": "InvalidStatus"
}
```
Response:
```json
{
  "success": false,
  "message": "Field 'status' must be one of: Created, On Process, Submitted."
}
```

---

### 5. DELETE `/api/assignments/{id}` — Delete Assignment

**✅ Success (200)** — valid ID
```
DELETE http://localhost:3000/api/assignments/1
```
Response:
```json
{
  "success": true,
  "message": "Assignment '1' deleted successfully"
}
```

**❌ Error (404)** — ID does not exist
```
DELETE http://localhost:3000/api/assignments/999
```
Response:
```json
{
  "success": false,
  "message": "Assignment with id '999' not found"
}
```


## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **API Docs**: Swagger UI (`swagger-ui-react`)
- **Auth**: Firebase Authentication
- **Styling**: Tailwind CSS + shadcn/ui
- **Testing**: Jest + React Testing Library
