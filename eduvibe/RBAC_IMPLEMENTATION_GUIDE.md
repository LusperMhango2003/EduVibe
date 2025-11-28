# Role-Based Access Control (RBAC) Implementation Guide

This document explains how the frontend interacts with the backend to implement Role-Based Access Control for the EduVibe learning platform.

## Architecture Overview


Frontend (React)
- AuthContext → User state & JWT token management
- AuthService → API calls with token interceptor
- Permissions Utils → Define what each role can do
- ProtectedRoute → Route protection based on roles
- Components → UI that respects user permissions
        ↓ 
Backend API
- Authentication Endpoints → /auth/login, /auth/register
- Protected Endpoints → Check JWT & role on each request
- Content Endpoints → /recordings/* with role-based restrictions


## User Roles & Permissions

### 1. **STUDENT**
-  View published content
-  View recordings
-  Download allowed materials
-  Enroll in courses
-  Cannot upload content
-  Cannot edit content
-  Cannot publish content
-  Cannot approve content

### 2. **INSTRUCTOR** (Content Creator)
-  View published content
-  Upload recordings and materials
-  Edit their own drafts
-  View all their own content
-  Cannot auto-publish (requires approval from admin)
-  Cannot approve content from others
-  Cannot manage users or categories

### 3. **ADMIN** (Reviewer/Manager)
-  All instructor permissions
-  Auto-publish content
-  Review and approve/reject submitted content
-  Manage categories and tags
-  Manage users and roles
-  View all content (including drafts and pending)

## Key Files & Their Purpose

### Authentication & Authorization

#### `src/context/AuthContext.jsx`
Manages user authentication state and provides login/logout/register methods.

  javascript
const { user, token, isAuthenticated, login, logout } = useAuth();
 

**Features:**
- Stores JWT token and user data in localStorage
- Persists login across page refreshes
- Provides login, register, logout methods
- Handles error messages

#### `src/services/authApi.js`
Axios instance with automatic JWT token injection.

**Key functions:**
- `getAuthHeaders()` - Get headers with Authorization token
- `getCurrentUser()` - Get current user from localStorage
- `isAuthenticated()` - Check if user is logged in

**Interceptors:**
- Request: Automatically adds `Authorization: Bearer {token}` header
- Response: Redirects to login if 401 (Unauthorized)

#### `src/utils/permissions.js`
Defines permissions for each role.

**Key functions:**
```javascript
hasPermission(role, 'uploadContent')      // true/false
hasRole(userRole, ['INSTRUCTOR', 'ADMIN']) // true/false
isContentCreator(role)                     // Check if instructor or admin
isAdmin(role)                              // Check if admin
getRolePermissions(role)                   // Get all permissions for role
```

### Route Protection

#### `src/components/ProtectedRoute.jsx`
Protects routes based on authentication status and user role.

```javascript
<Route
  path="/recordings"
  element={
    <ProtectedRoute
      element={<Recordings />}
      requiredRoles={[USER_ROLES.STUDENT, USER_ROLES.INSTRUCTOR, USER_ROLES.ADMIN]}
    />
  }
/>
```

### Components

#### `src/components/Recordings.jsx`
Main component for recording management:
- Displays all recordings in a grid layout
- Shows search functionality via RecordingsHeader
- Shows upload button for instructors/admins
- Shows approval queue for admins only
- Shows edit/delete buttons for content creators
- Filters recordings based on permissions
- Shows status badges (published, draft, pending, rejected)

**Role-specific features:**
- **STUDENT**: Can only play published recordings
- **INSTRUCTOR**: Can upload, edit own recordings, see approval status
- **ADMIN**: Can approve/reject recordings with reasons, see pending queue, manage all content

#### `src/components/RecordingsHeader.jsx`
Header component with:
- EduVibe logo
- Search bar for filtering recordings
- Clear search button
- Notifications area
- Mobile responsive menu

#### `src/components/ProtectedRoute.jsx`
Route protection wrapper that:
- Checks user authentication status
- Verifies user has required role(s)
- Shows loading state while checking auth
- Redirects to fallback route if unauthorized
- Provides UnauthorizedPage component for 403 errors

### API Services

#### `src/services/recordingApi.js`
Provides functions for recording management, each respecting backend role checks.

**Public endpoints (all authenticated users):**
- `getAllRecordings()` - GET /recordings
- `searchRecordings(query)` - GET /recordings/search?q=query

**Instructor/Admin only:**
- `getMyRecordings()` - GET /recordings/my-recordings
- `uploadRecording(formData)` - POST /recordings/upload
- `updateRecording(id, data)` - PUT /recordings/{id}
- `deleteRecording(id)` - DELETE /recordings/{id}

**Admin only:**
- `getPendingRecordings()` - GET /recordings/pending
- `approveRecording(id)` - POST /recordings/{id}/approve
- `rejectRecording(id, reason)` - POST /recordings/{id}/reject

## Frontend → Backend Communication Flow

### 1. Login Flow
```
User enters email/password
         ↓
Frontend calls POST /auth/login
         ↓
Backend validates credentials
         ↓
Backend returns { token, user: { id, name, role, email } }
         ↓
Frontend stores token & user in localStorage
         ↓
Frontend redirects to /recordings
```

### 2. Protected API Call Flow
```
Component calls recordingApi.getAllRecordings()
         ↓
Axios interceptor adds: Authorization: Bearer {token}
         ↓
Backend receives request with token in header
         ↓
Backend middleware checks:
  - Is token valid? (JWT verification)
  - Does user exist?
  - Can user access this endpoint? (role check)
         ↓
If authorized: returns filtered data based on role
If 401 Unauthorized: frontend redirects to login
```

### 3. Content Upload Flow (Instructor)
```
Instructor submits form with recording file
         ↓
Frontend calls uploadRecording(formData) with JWT
         ↓
Backend checks:
  - Is user authenticated? (token check)
  - Does user have uploadContent permission? (role check)
         ↓
Backend creates recording with status = 'pending'
         ↓
Returns recorded data to frontend
         ↓
Frontend shows "Awaiting approval" status
```

### 4. Content Approval Flow (Admin)
```
Admin views pending recordings
         ↓
Frontend calls getPendingRecordings() with JWT
         ↓
Backend returns only recordings with status = 'pending'
         ↓
Admin clicks Approve or Reject
         ↓
Frontend calls approveRecording() or rejectRecording()
         ↓
Backend checks: Is user admin?
         ↓
Backend updates recording status to 'published' or 'rejected'
         ↓
Frontend removes from pending queue
```

## How Backend Role Checks Work

### Backend Guard Pattern (NestJS)
```typescript
// Example backend guard (NestJS)
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly requiredRoles: string[]) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userRole = request.user.role; // From JWT token via JwtAuthGuard
    
    if (!this.requiredRoles.includes(userRole)) {
      throw new ForbiddenException('Insufficient permissions');
    }
    
    return true;
  }
}

// Usage in NestJS controller
import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('recordings')
@UseGuards(JwtAuthGuard) // Verify JWT token
export class RecordingsController {
  
  @Post('upload')
  @UseGuards(new RoleGuard(['INSTRUCTOR', 'ADMIN'])) // Check role
  uploadRecording(@Body() dto: CreateRecordingDto) {
    // Upload logic here
  }
}
```

### Alternative: NestJS Role Decorator (Recommended)
```typescript
// Custom decorator for cleaner code
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

// Guard that checks the decorator
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) return true;
    
    const request = context.switchToHttp().getRequest();
    return requiredRoles.includes(request.user.role);
  }
}

// Usage - much cleaner!
@Post('upload')
@Roles('INSTRUCTOR', 'ADMIN')
uploadRecording(@Body() dto: CreateRecordingDto) {
  // Upload logic
}
```

### Frontend Permission Check
```javascript
// Before showing UI, frontend also checks:
if (hasPermission(user.role, 'uploadContent')) {
  // Show upload button
}
```

## Branch Structure & Organization

### **Recordings Branch** (Current)
This branch focuses **exclusively on recording management**:

✅ **Included:**
- Record viewing, searching, filtering
- Upload recordings (instructors/admins)
- Edit and delete recordings (content creators)
- Approve/reject recordings (admins only)
- Status tracking and display
- Role-based UI elements for recordings

❌ **NOT Included (separate Auth branch):**
- Login/authentication pages
- User profile management
- Signup/registration
- Logout functionality
- User management pages

**File structure for Recordings branch:**
```
src/
├── components/
│   ├── Recordings.jsx (main recording component)
│   ├── RecordingsHeader.jsx (search & header)
│   └── ProtectedRoute.jsx (auth check wrapper)
├── services/
│   ├── recordingApi.js (recording API calls)
│   └── authApi.js (JWT token management)
├── utils/
│   └── permissions.js (role definitions)
└── context/
    └── AuthContext.jsx (user state from auth branch)
```

---

## Setup Instructions

### 1. Environment Variables
Create `.env` file in `eduvibe/` folder:
```
REACT_APP_API_URL=http://localhost:3000/api
```

### 2. Backend Requirements
Ensure backend has these endpoints:

```
POST /auth/login
POST /auth/register

GET  /recordings              (all authenticated users)
GET  /recordings/search       (all authenticated users)
GET  /recordings/my-recordings (instructors/admins)
GET  /recordings/pending      (admins only)

POST /recordings/upload       (instructors/admins)
PUT  /recordings/:id          (content creators)
DELETE /recordings/:id        (content creators)

POST /recordings/:id/approve  (admins only)
POST /recordings/:id/reject   (admins only)
```

### 3. JWT Token Format
Backend should return JWT containing:
```javascript
{
  userId: "user_id",
  email: "user@example.com",
  role: "STUDENT|INSTRUCTOR|ADMIN"
}
```

## Testing the Implementation

### Test Case 1: Student Login
1. Go to login page
2. Enter: `student@example.com / password123`
3. Should see only published recordings
4. No upload button should be visible
5. Cannot edit or delete

### Test Case 2: Instructor Upload
1. Login as instructor: `instructor@example.com / password123`
2. Should see "Upload Recording" button
3. Click upload, submit form
4. Recording should appear with "pending" status
5. Cannot see approval queue

### Test Case 3: Admin Approves
1. Login as admin: `admin@example.com / password123`
2. Should see "Approvals" button with pending count
3. Click to view pending recordings
4. Click Approve → recording status changes to published
5. Click Reject with reason → recording rejected

### Test Case 4: Authentication Protection
1. Open DevTools → Application → LocalStorage
2. Delete `authToken` entry
3. Refresh page → Should redirect to login
4. Try accessing `/recordings` directly → Should redirect to login

## Common Issues & Solutions

### Issue: API calls return 401 (Unauthorized)
**Solution:** 
- Check if token is in localStorage: `localStorage.getItem('authToken')`
- Check if token is valid (not expired)
- Verify backend is checking `Authorization` header correctly

### Issue: User can see buttons they shouldn't
**Solution:**
- Ensure `hasPermission()` check is used before rendering button
- Check if backend is enforcing role checks on endpoints

### Issue: User still can access route after logout
**Solution:**
- Ensure `logout()` clears localStorage
- Refresh page to clear state
- Check if ProtectedRoute is properly checking `isAuthenticated`

## Next Steps

1. **Create Upload Recording Page** (`src/pages/UploadRecording.jsx`)
   - Form for instructors to upload recordings
   - Auto-set status = "pending" for instructors
   - Auto-set status = "published" for admins

2. **Create Edit Recording Page** (`src/pages/EditRecording.jsx`)
   - Instructors can edit their own drafts
   - Admins can edit any recording

3. **Add Rejection Reason Display** in Recordings component
   - Show why a recording was rejected
   - Allow instructors to resubmit

4. **Create Dashboard** (`src/pages/Dashboard.jsx`)
   - Show statistics based on role
   - Students: enrolled courses, watched recordings
   - Instructors: uploaded content, pending approvals
   - Admins: total users, pending approvals, system health

5. **Implement Category Management** (Admin only)
   - Add/edit/delete categories
   - Assign categories to recordings

## API Response Format

**Successful response:**
```json
{
  "success": true,
  "data": [...],
  "message": "Operation successful"
}
```

**Error response:**
```json
{
  "success": false,
  "message": "Error message",
  "error": "error_code"
}
```

## Security Best Practices Implemented

✅ JWT tokens stored in localStorage (consider httpOnly cookies for production)
✅ Automatic token injection in all API requests
✅ Automatic logout on 401 (unauthorized)
✅ Route protection based on roles
✅ Frontend permission checks mirror backend checks
✅ Token verification on every backend request
✅ Role-based endpoint access control
