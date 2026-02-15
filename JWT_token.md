# Complete JWT Access & Refresh Token Frontend Guide

## 📚 Table of Contents

1. [How JWT Works](#how-jwt-works)
2. [API Service Setup](#api-service-setup)
3. [Key Concepts](#key-concepts)
4. [Complete Implementation](#complete-implementation)
5. [Common Patterns](#common-patterns)
6. [Troubleshooting](#troubleshooting)

---

## 🔐 How JWT Works

### Token Flow Diagram

```
1. User logs in → Server sends accessToken + refreshToken
2. Store tokens in memory (secure)
3. Send accessToken with every API request
4. If accessToken expires (401) → Use refreshToken to get new accessToken
5. If refreshToken expires → User must login again
```

### Why Two Tokens?

**Access Token (Short-lived: 15min-1hr)**

- Used for every API request
- Contains user data
- If stolen, expires quickly (limited damage)

**Refresh Token (Long-lived: 7-30 days)**

- Only used to get new access tokens
- Stored in httpOnly cookie (more secure)
- If stolen, harder to use and can be revoked

---

## 🛠️ API Service Setup

### Step 1: Create API Service Class

```typescript
// services/api.service.ts
const API_BASE_URL = "http://localhost:5000/api/v1";

class ApiService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private isRefreshing = false;
  private failedQueue: Array<any> = [];

  // Store tokens after login
  setTokens(access: string, refresh: string) {
    this.accessToken = access;
    this.refreshToken = refresh;
  }

  // Clear tokens on logout
  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
  }

  // Refresh the access token
  async refreshAccessToken(): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // ✅ Important: sends cookies
      body: JSON.stringify({ refreshToken: this.refreshToken }),
    });

    if (!response.ok) throw new Error("Token refresh failed");

    const data = await response.json();
    this.setTokens(data.data.accessToken, data.data.refreshToken);
    return data.data.accessToken;
  }

  // Main fetch method with auto-retry
  async fetchWithAuth(url: string, options: RequestInit = {}) {
    const headers = {
      "Content-Type": "application/json",
      ...(this.accessToken && { Authorization: `Bearer ${this.accessToken}` }),
      ...options.headers,
    };

    let response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
      credentials: "include",
    });

    // If 401 and we have refresh token, try refreshing
    if (response.status === 401 && this.refreshToken) {
      // Prevent multiple refresh calls
      if (!this.isRefreshing) {
        this.isRefreshing = true;
        try {
          await this.refreshAccessToken();
          // Retry the original request
          response = await fetch(`${API_BASE_URL}${url}`, {
            ...options,
            headers: {
              ...headers,
              Authorization: `Bearer ${this.accessToken}`,
            },
            credentials: "include",
          });
        } finally {
          this.isRefreshing = false;
        }
      }
    }

    return response;
  }
}

export const apiService = new ApiService();
```

---

## 🔑 Key Concepts

### 1. **Credentials: 'include'**

Always include this to send cookies:

```typescript
fetch(url, {
  credentials: "include", // ✅ Sends httpOnly cookies
});
```

### 2. **Authorization Header**

Send access token with every protected request:

```typescript
headers: {
  'Authorization': `Bearer ${accessToken}`,
}
```

### 3. **Auto-Refresh on 401**

When access token expires, automatically get new one:

```typescript
if (response.status === 401) {
  await refreshAccessToken();
  // Retry original request
}
```

### 4. **Token Storage**

```typescript
// ❌ BAD: localStorage (vulnerable to XSS)
localStorage.setItem('token', accessToken);

// ✅ GOOD: In-memory (cleared on page refresh)
private accessToken: string | null = null;

// ✅ BEST: httpOnly cookies (backend sets this)
// Your refresh token should be in httpOnly cookie
```

---

## 💻 Complete Implementation

### Auth Context Hook

```typescript
// hooks/useAuth.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from './api.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Login
  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) throw new Error('Login failed');

    const data = await response.json();
    apiService.setTokens(data.data.accessToken, data.data.refreshToken);
    setUser(data.data.user);
  };

  // Logout
  const logout = async () => {
    try {
      await apiService.fetchWithAuth('/auth/logout', { method: 'POST' });
    } finally {
      apiService.clearTokens();
      setUser(null);
    }
  };

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await apiService.fetchWithAuth('/auth/check-auth');
        if (response.ok) {
          const data = await response.json();
          setUser(data.data.user);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

---

## 📋 Common Patterns

### 1. Protected API Call

```typescript
const fetchUserProfile = async () => {
  const response = await apiService.fetchWithAuth("/auth/profile");
  const data = await response.json();
  return data;
};
```

### 2. File Upload with Auth

```typescript
const uploadAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const response = await apiService.fetchWithAuth("/users/update-avatar", {
    method: "PATCH",
    body: formData,
    headers: {
      // Don't set Content-Type, browser will set with boundary
      Authorization: `Bearer ${apiService.getAccessToken()}`,
    },
  });

  return response.json();
};
```

### 3. Update User Details

```typescript
const updateProfile = async (fullName: string, email: string) => {
  const response = await apiService.fetchWithAuth(
    "/users/update-user-profile",
    {
      method: "PATCH",
      body: JSON.stringify({ fullName, email }),
    },
  );

  return response.json();
};
```

### 4. Protected Route Component

```typescript
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return children;
};

// Usage in React Router
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

---

## 🐛 Troubleshooting

### Problem 1: "Access token expired" on every request

**Solution:** Make sure you're updating the token after refresh:

```typescript
// After refresh, retry with new token
const newToken = await this.refreshAccessToken();
headers["Authorization"] = `Bearer ${newToken}`; // ✅ Use new token
```

### Problem 2: Infinite refresh loop

**Solution:** Add a flag to prevent multiple simultaneous refreshes:

```typescript
if (this.isRefreshing) {
  // Wait for current refresh to complete
  return new Promise((resolve) => {
    this.failedQueue.push(resolve);
  });
}
```

### Problem 3: Cookies not being sent

**Solution:** Check these settings:

```typescript
// Frontend
credentials: 'include'

// Backend (Express)
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Cookie options
{
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax'
}
```

### Problem 4: 401 even after login

**Solution:** Check token is being saved and sent:

```typescript
// After login
// console.log($&) // Should not be null

// Before request
// console.log($&) // Should be "Bearer xxx"
```

---

## 🎯 Best Practices

1. **Always use HTTPS in production** - prevents token theft
2. **Keep access tokens short-lived** (15 min - 1 hour)
3. **Store refresh tokens in httpOnly cookies** - prevents XSS
4. **Implement token rotation** - refresh token changes on each refresh
5. **Add logout on all devices** - revoke all refresh tokens
6. **Monitor failed refresh attempts** - detect compromised tokens
7. **Never log tokens** - security risk

---

## 📦 Environment Variables

```env
# Backend
ACCESS_TOKEN_SECRET=your-super-secret-key-min-32-chars
REFRESH_TOKEN_SECRET=your-different-super-secret-key
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
CLIENT_URL=http://localhost:3000

# Frontend
REACT_APP_API_URL=http://localhost:5000/api/v1
```

---

## ✅ Testing Checklist

- [ ] User can login and receive tokens
- [ ] Access token is sent with protected requests
- [ ] Access token auto-refreshes when expired
- [ ] User stays logged in after page refresh
- [ ] User is logged out when refresh token expires
- [ ] Logout clears all tokens
- [ ] Multiple tabs sync authentication state
- [ ] Tokens are not visible in browser DevTools

---

## 🚀 Quick Start

1. Copy the `ApiService` class
2. Copy the `AuthProvider` context
3. Wrap your app with `<AuthProvider>`
4. Use `useAuth()` hook in components
5. Call `apiService.fetchWithAuth()` for protected routes

That's it! Your JWT authentication is ready to use.

## Complete Flow Comparison

```typescript
const token = req.header("Authorization")?.replace("Bearer ", "");
// Frontend sets header (YOUR CURRENT APPROACH)
```

GET /api/courses
Headers: { Authorization: "Bearer eyJhbGc..." }

```

**Your axios interceptor uses Option 2 (Authorization Header)**, which is the standard approach for SPAs (Single Page Applications).

---

## How It Works Together

### **Frontend → Backend Flow**
```

┌─────────────────────────────────────────────────────────┐
│ FRONTEND: Login Successful │
│ localStorage.setItem('accessToken', 'eyJhbGc...') │
└────────────────┬────────────────────────────────────────┘
▼
┌─────────────────────────────────────────────────────────┐
│ USER: Navigates to /dashboard │
│ Component calls: getCourses() │
└────────────────┬────────────────────────────────────────┘
▼
┌─────────────────────────────────────────────────────────┐
│ AXIOS INTERCEPTOR (Request) │
│ const token = localStorage.getItem('accessToken'); │
│ config.headers.Authorization = `Bearer ${token}`; │
└────────────────┬────────────────────────────────────────┘
▼
┌─────────────────────────────────────────────────────────┐
│ HTTP REQUEST │
│ GET /api/courses │
│ Headers: { │
│ Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI..."│
│ } │
└────────────────┬────────────────────────────────────────┘
▼
┌─────────────────────────────────────────────────────────┐
│ BACKEND: verifyJwt Middleware │
│ │
│ Step 1: Extract token │
│ const token = req.cookies?.accessToken || │
│ req.header("Authorization") │
│ ?.replace("Bearer ", ""); │
│ │
│ Result: token = "eyJhbGciOiJIUzI1NiIsInR5cCI..." │
└────────────────┬────────────────────────────────────────┘
▼
┌─────────────────────────────────────────────────────────┐
│ Step 2: Verify JWT │
│ const decodedToken = jwt.verify(token, SECRET); │
│ │
│ Decoded: { │
│ \_id: "507f1f77bcf86cd799439011", │
│ email: "user@example.com", │
│ iat: 1674567890, │
│ exp: 1674654290 │
│ } │
└────────────────┬────────────────────────────────────────┘
▼
┌─────────────────────────────────────────────────────────┐
│ Step 3: Find User in Database │
│ const user = await User.findById("507f1f77...") │
│ .select("-password -refreshToken"); │
│ │
│ Found: { │
│ \_id: "507f1f77...", │
│ email: "user@example.com", │
│ name: "John Doe", │
│ role: "student" │
│ // password excluded ✅ │
│ // refreshToken excluded ✅ │
│ } │
└────────────────┬────────────────────────────────────────┘
▼
┌─────────────────────────────────────────────────────────┐
│ Step 4: Attach User to Request │
│ req.user = user; │
└────────────────┬────────────────────────────────────────┘
▼
┌─────────────────────────────────────────────────────────┐
│ Step 5: Call next() │
│ Proceed to route handler │
└────────────────┬────────────────────────────────────────┘
▼
┌─────────────────────────────────────────────────────────┐
│ ROUTE HANDLER │
│ router.get('/courses', verifyJwt, async (req, res) => { │
│ const userId = req.user.\_id; // Available! ✅ │
│ const courses = await Course.find({ userId }); │
│ res.json(courses); │
│ }); │
└────────────────┬────────────────────────────────────────┘
▼
┌─────────────────────────────────────────────────────────┐
│ RESPONSE │
│ 200 OK │
│ [{ id: 1, name: "Math" }, { id: 2, name: "Physics" }] │
└─────────────────────────────────────────────────────────┘

Summary of Fixes:

✅ Download Backend: Handle Cloudinary images by redirecting to URL
