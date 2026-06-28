# CodeForge AI - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the `Authorization` header:
```
Authorization: Bearer <access_token>
```

---

## 🔐 Authentication Endpoints

### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "role": "Developer" // Optional: Admin | Manager | Developer
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "64abc123...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "Developer",
      "avatar": null,
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Validation Rules:**
- Name: 2-50 characters, letters/spaces/hyphens only
- Email: Valid email format
- Password: Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
- Role: Optional, defaults to "Developer"

---

### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { /* Same as register */ },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Errors:**
- 400: Invalid credentials
- 429: Too many login attempts (rate limit)

---

### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "64abc123...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "Developer",
      "avatar": "https://...",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

---

### Update Password
```http
PUT /auth/password
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass456!",
  "confirmPassword": "NewPass456!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password updated successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### Forgot Password
```http
POST /auth/forgot-password
```

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset email sent. Please check your inbox."
}
```

---

### Reset Password
```http
POST /auth/reset-password
```

**Request Body:**
```json
{
  "resetToken": "abc123def456...",
  "password": "NewPass123!",
  "confirmPassword": "NewPass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### Refresh Access Token
```http
POST /auth/refresh-token
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

## 🏢 Organization Endpoints

### Get All Organizations
```http
GET /organizations
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64org123...",
      "name": "Acme Corp",
      "description": "Software development company",
      "owner": "64user123...",
      "members": [
        {
          "userId": "64user123...",
          "role": "Owner",
          "joinedAt": "2024-01-01T00:00:00.000Z"
        }
      ],
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### Get Organization by ID
```http
GET /organizations/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64org123...",
    "name": "Acme Corp",
    "description": "Software development company",
    "owner": "64user123...",
    "members": [ /* Array of members */ ],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Errors:**
- 403: User is not a member of this organization
- 404: Organization not found

---

### Create Organization
```http
POST /organizations
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Acme Corp",
  "description": "Software development company" // Optional
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Organization created successfully",
  "data": { /* Organization object */ }
}
```

**Validation:**
- Name: 2-100 characters, must be unique
- Description: Max 500 characters

---

### Update Organization
```http
PUT /organizations/:id
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "New Acme Corp", // Optional
  "description": "Updated description" // Optional
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Organization updated successfully",
  "data": { /* Updated organization */ }
}
```

**Permissions:** Owner or Admin only

---

### Delete Organization
```http
DELETE /organizations/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Organization deleted successfully"
}
```

**Permissions:** Owner only

---

### Invite Member
```http
POST /organizations/:id/members
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "email": "newmember@example.com",
  "role": "Developer" // Admin | Manager | Developer
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Member invited successfully",
  "data": { /* Updated organization with new member */ }
}
```

**Permissions:** Owner or Admin only

---

### Remove Member
```http
DELETE /organizations/:id/members/:userId
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Member removed successfully",
  "data": { /* Updated organization */ }
}
```

**Permissions:** Owner or Admin only (cannot remove owner)

---

### Update Member Role
```http
PUT /organizations/:id/members/:userId/role
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "role": "Manager" // Admin | Manager | Developer
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Member role updated successfully",
  "data": { /* Updated organization */ }
}
```

**Permissions:** Owner or Admin only

---

## 📁 Project Endpoints

### Get All Projects
```http
GET /projects?organizationId=<orgId>&page=1&limit=10
Authorization: Bearer <token>
```

**Query Parameters:**
- `organizationId` (optional): Filter by organization
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 10)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64proj123...",
      "title": "Mobile App Redesign",
      "description": "Complete redesign of mobile application",
      "organizationId": "64org123...",
      "owner": "64user123...",
      "status": "Active", // Planning | Active | Testing | Completed
      "isDeleted": false,
      "createdAt": "2024-01-10T00:00:00.000Z",
      "updatedAt": "2024-01-15T00:00:00.000Z"
    }
  ]
}
```

---

### Get Project by ID
```http
GET /projects/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64proj123...",
    "title": "Mobile App Redesign",
    "description": "Complete redesign of mobile application",
    "organizationId": "64org123...",
    "owner": "64user123...",
    "status": "Active",
    "isDeleted": false,
    "createdAt": "2024-01-10T00:00:00.000Z",
    "updatedAt": "2024-01-15T00:00:00.000Z"
  }
}
```

---

### Create Project
```http
POST /projects
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Mobile App Redesign",
  "description": "Complete redesign of mobile application",
  "organizationId": "64org123...",
  "status": "Planning" // Optional: Planning | Active | Testing | Completed
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Project created successfully",
  "data": { /* Project object */ }
}
```

**Validation:**
- Title: 3-100 characters
- Description: 10-2000 characters
- Status: Must be one of: Planning, Active, Testing, Completed

**Permissions:** Manager or Admin only

---

### Update Project
```http
PUT /projects/:id
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Updated Project Title", // Optional
  "description": "Updated description", // Optional
  "status": "Testing" // Optional
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Project updated successfully",
  "data": { /* Updated project */ }
}
```

**Permissions:** Manager or Admin only

---

### Delete Project (Soft Delete)
```http
DELETE /projects/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

**Note:** This is a soft delete. Project is marked as `isDeleted: true`.

**Permissions:** Admin only

---

### Get Project Statistics
```http
GET /projects/:id/stats
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalIssues": 42,
    "completedIssues": 28,
    "openIssues": 14,
    "inProgressIssues": 6,
    "criticalIssues": 2,
    "completionRate": 66.67
  }
}
```

---

## 🎯 Issue Endpoints

### Get All Issues
```http
GET /issues?projectId=<projId>&status=<status>&priority=<priority>&assignedTo=<userId>&search=<query>
Authorization: Bearer <token>
```

**Query Parameters:**
- `projectId` (required): Filter by project
- `status` (optional): Todo | InProgress | Review | Done
- `priority` (optional): Low | Medium | High | Critical
- `assignedTo` (optional): User ID
- `labels` (optional): Comma-separated labels
- `search` (optional): Search in title and description

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64issue123...",
      "title": "Fix login bug",
      "description": "Users unable to login with email",
      "projectId": "64proj123...",
      "assignedTo": "64user123...",
      "priority": "Critical", // Low | Medium | High | Critical
      "status": "InProgress", // Todo | InProgress | Review | Done
      "labels": ["bug", "urgent"],
      "dueDate": "2024-01-20T00:00:00.000Z",
      "isDeleted": false,
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T15:00:00.000Z"
    }
  ]
}
```

---

### Get Issue by ID
```http
GET /issues/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": { /* Issue object */ }
}
```

---

### Create Issue
```http
POST /issues
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Fix login bug",
  "description": "Users unable to login with email",
  "projectId": "64proj123...",
  "priority": "Critical",
  "status": "Todo", // Optional, defaults to "Todo"
  "assignedTo": "64user123...", // Optional
  "labels": ["bug", "urgent"], // Optional
  "dueDate": "2024-01-20" // Optional, ISO date string
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Issue created successfully",
  "data": { /* Issue object */ }
}
```

**Validation:**
- Title: 3-200 characters
- Description: 10-5000 characters
- Priority: Must be one of: Low, Medium, High, Critical
- Status: Must be one of: Todo, InProgress, Review, Done

---

### Update Issue
```http
PUT /issues/:id
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Updated title", // Optional
  "description": "Updated description", // Optional
  "priority": "High", // Optional
  "status": "InProgress", // Optional
  "assignedTo": "64user456...", // Optional
  "labels": ["bug", "backend"], // Optional
  "dueDate": "2024-01-25" // Optional
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Issue updated successfully",
  "data": { /* Updated issue */ }
}
```

**Note:** Automatically creates activity log entry for the change.

---

### Delete Issue (Soft Delete)
```http
DELETE /issues/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Issue deleted successfully"
}
```

**Permissions:** Manager or Admin only

---

### Get Issue Activity Log
```http
GET /issues/:id/activity
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64act123...",
      "issueId": "64issue123...",
      "userId": "64user123...",
      "action": "status_changed",
      "field": "status",
      "oldValue": "Todo",
      "newValue": "InProgress",
      "createdAt": "2024-01-15T15:00:00.000Z"
    }
  ]
}
```

**Activity Types:**
- `created` - Issue was created
- `updated` - General update
- `status_changed` - Status transition
- `priority_changed` - Priority change
- `assigned` - Assigned to user
- `unassigned` - Unassigned from user
- `comment_added` - Comment added (future feature)

---

### Search Issues
```http
GET /issues/search?projectId=<projId>&q=<query>
Authorization: Bearer <token>
```

**Query Parameters:**
- `projectId` (required): Project to search in
- `q` (required): Search query (min 2 chars)

**Response (200):**
```json
{
  "success": true,
  "data": [ /* Array of matching issues */ ]
}
```

**Search Fields:** Title and description (case-insensitive regex)

---

### Get Kanban Board
```http
GET /issues/kanban?projectId=<projId>
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "Todo": [ /* Array of Todo issues */ ],
    "InProgress": [ /* Array of InProgress issues */ ],
    "Review": [ /* Array of Review issues */ ],
    "Done": [ /* Array of Done issues */ ]
  }
}
```

---

## ⚠️ Error Responses

### Standard Error Format

```json
{
  "success": false,
  "message": "Error message describing what went wrong",
  "errors": [ // Optional: validation errors
    {
      "field": "email",
      "msg": "Invalid email format"
    }
  ]
}
```

### Common HTTP Status Codes

- **200 OK**: Request succeeded
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request data or validation errors
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: User lacks permission for this action
- **404 Not Found**: Resource does not exist
- **409 Conflict**: Resource already exists (duplicate)
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error

---

## 🔒 Role-Based Permissions

### Role Hierarchy

1. **Owner** - Full control of organization
2. **Admin** - Manage projects, users, settings (cannot remove owner)
3. **Manager** - Create/edit projects and issues
4. **Developer** - Create/edit issues, view all

### Permission Matrix

| Action | Developer | Manager | Admin | Owner |
|--------|-----------|---------|-------|-------|
| View organizations | ✅ | ✅ | ✅ | ✅ |
| Create organization | ✅ | ✅ | ✅ | ✅ |
| Update organization | ❌ | ❌ | ✅ | ✅ |
| Delete organization | ❌ | ❌ | ❌ | ✅ |
| Invite members | ❌ | ❌ | ✅ | ✅ |
| Remove members | ❌ | ❌ | ✅ | ✅ |
| View projects | ✅ | ✅ | ✅ | ✅ |
| Create project | ❌ | ✅ | ✅ | ✅ |
| Update project | ❌ | ✅ | ✅ | ✅ |
| Delete project | ❌ | ❌ | ✅ | ✅ |
| View issues | ✅ | ✅ | ✅ | ✅ |
| Create issue | ✅ | ✅ | ✅ | ✅ |
| Update issue | ✅ | ✅ | ✅ | ✅ |
| Delete issue | ❌ | ✅ | ✅ | ✅ |

---

## 🚦 Rate Limiting

**Default Limits:**
- 100 requests per 15 minutes per IP address
- Applies to all endpoints
- Response headers include rate limit info:
  ```
  X-RateLimit-Limit: 100
  X-RateLimit-Remaining: 99
  X-RateLimit-Reset: 1705329600
  ```

**429 Response:**
```json
{
  "success": false,
  "message": "Too many requests. Please try again later."
}
```

---

## 📚 Additional Notes

### Date Formats
All dates are in ISO 8601 format: `2024-01-15T10:30:00.000Z`

### Pagination
Endpoints that return lists support pagination:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

### Soft Deletes
Resources are soft-deleted by setting `isDeleted: true`. They remain in the database but are excluded from queries.

### Activity Logging
All issue modifications automatically create activity log entries for audit trail purposes.

---

## 🧪 Testing with cURL

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"SecurePass123!","role":"Developer"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"SecurePass123!"}'
```

### Get Current User (Protected)
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Create Organization
```bash
curl -X POST http://localhost:5000/api/organizations \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Acme Corp","description":"Software company"}'
```

### Create Project
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Mobile App","description":"Redesign mobile app","organizationId":"YOUR_ORG_ID","status":"Active"}'
```

### Create Issue
```bash
curl -X POST http://localhost:5000/api/issues \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Fix bug","description":"Login not working","projectId":"YOUR_PROJECT_ID","priority":"High","status":"Todo"}'
```

---

## 📞 Support

For questions or issues with the API:
- Open an issue on GitHub
- Contact: your.email@example.com

---

**Last Updated**: January 2024  
**API Version**: 1.0.0
