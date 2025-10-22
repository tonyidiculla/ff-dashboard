# HMS Gateway - Reverse Proxy Implementation

## Overview
The HMS Gateway (ff-hms-6900) now functions as a **true reverse proxy**, routing all traffic through port 6900 to the backend services. This solves the cross-port cookie authentication issue.

## How It Works

### Architecture
```
User Browser (localhost:6900)
          ↓
   HMS Gateway (6900)
    ├─ /finance/* → Finance Service (6850)
    ├─ /clinical/* → Clinical Service (6830)
    ├─ /hr/* → HR Service (6860)
    ├─ /rostering/* → Rostering Service (6840)
    ├─ /purchasing/* → Purchasing Service (6870)
    └─ /platform/* → Platform Admin (6810)
```

### Benefits
✅ **Single Domain/Port**: All services accessed through `localhost:6900`
✅ **Cookie Sharing**: Authentication cookies work automatically across all routes
✅ **No Token Passing**: No need to append tokens to URLs
✅ **Seamless SSO**: Login once, access everything
✅ **Clean URLs**: No port numbers or tokens visible to users

## Route Mapping

| Navigation Link | User Sees | Proxied To |
|----------------|-----------|------------|
| Finance → Books | `localhost:6900/finance/books` | `localhost:6850/books` |
| Clinical → Appointments | `localhost:6900/clinical/core/appointments` | `localhost:6830/core/appointments` |
| HR | `localhost:6900/hr` | `localhost:6860/` |
| Rostering | `localhost:6900/rostering` | `localhost:6840/` |
| Purchasing | `localhost:6900/purchasing` | `localhost:6870/` |

## Configuration

### Next.js Rewrites (next.config.js)
The reverse proxy is implemented using Next.js `rewrites()` function:

```javascript
async rewrites() {
  return [
    // Page rewrites
    { source: '/finance/:path*', destination: 'http://localhost:6850/:path*' },
    { source: '/clinical/:path*', destination: 'http://localhost:6830/:path*' },
    // ... more routes

    // API rewrites
    { source: '/api/finance/:path*', destination: 'http://localhost:6850/api/:path*' },
    { source: '/api/clinical/:path*', destination: 'http://localhost:6830/api/:path*' },
    // ... more API routes
  ]
}
```

### Navigation Updates
All navigation links updated from absolute URLs to relative paths:

**Before (Direct Port Access):**
```tsx
{ name: 'Books', href: 'http://localhost:6850/books' }
```

**After (Proxied):**
```tsx
{ name: 'Books', href: '/finance/books' }
```

## Authentication Flow

### Before (With Token Passing)
1. User at HMS clicks "Finance" → "Books"
2. Link includes token: `http://localhost:6850/books?token=xxx`
3. Finance middleware reads token from URL
4. Sets cookie for localhost:6850
5. Redirects to clean URL

### After (With Reverse Proxy)
1. User at HMS clicks "Finance" → "Books"
2. Browser navigates to: `localhost:6900/finance/books`
3. HMS Gateway proxies request to: `localhost:6850/books`
4. Response sent back through gateway
5. **Cookie already valid** - no extra steps needed!

## Requirements

### Backend Services Must Run
All backend services must be running on their respective ports:
- ✅ Auth Service (6800)
- ✅ Platform Admin (6810)
- ✅ Clinical Service (6830)
- ✅ Rostering (6840)
- ✅ Finance (6850)
- ✅ HR Management (6860)
- ✅ Purchasing (6870)

### Service Middleware
Backend services can keep their middleware but it becomes **optional** for authentication since:
- Requests come from localhost:6900 (HMS Gateway)
- Cookies are shared automatically
- Auth can be handled at gateway level if desired

## Testing

### 1. Start All Services
```bash
# Each service in its own terminal
cd ff-auth-6800 && npm run dev  # Port 6800
cd ff-clin-6830 && npm run dev  # Port 6830
cd ff-finm-6850 && npm run dev  # Port 6850
# ... etc

# Start HMS Gateway LAST
cd ff-hms-6900 && npm run dev   # Port 6900
```

### 2. Access Through Gateway
- Navigate to: `http://localhost:6900`
- Login with credentials
- Click any sidebar link
- **No redirects, no token URLs, just works!** ✨

### 3. Verify Proxy
Open DevTools Network tab and observe:
- Request URL: `localhost:6900/finance/books`
- Actual request proxied to port 6850 behind the scenes
- Response comes back seamlessly
- Cookies work across all routes

## Production Considerations

### Domain Configuration
In production, use a real domain instead of localhost:

```javascript
// Production example
{
  source: '/finance/:path*',
  destination: 'https://finance-service.internal:8080/:path*'
}
```

### Load Balancing
Each backend service can be scaled independently:
- Multiple instances behind load balancer
- Gateway routes to load balancer URL
- Session affinity if needed

### HTTPS/Security
- Gateway terminates SSL
- Internal services can use HTTP
- Or use mTLS for service-to-service

### Headers
Forward important headers:
- User-Agent
- Authorization
- Custom tenant headers
- Request ID for tracing

## Future Enhancements

1. **Rate Limiting** at gateway level
2. **Caching** for static resources
3. **API Versioning** through gateway
4. **Request/Response Transformation**
5. **Centralized Logging** and monitoring
6. **Health Checks** at gateway
7. **Circuit Breaker** patterns
8. **A/B Testing** routing

## Migration Notes

### From Token-Passing to Reverse Proxy

**Removed:**
- ❌ Token appending in Sidebar component
- ❌ Token reading from URL in middleware
- ❌ Cookie setting from URL tokens
- ❌ `Cookies.get()` imports in Sidebar

**Added:**
- ✅ Next.js rewrites configuration
- ✅ Relative path navigation
- ✅ Service path prefixes (/finance, /clinical, etc.)

**Unchanged:**
- ✅ Backend services continue running on same ports
- ✅ Middleware verification logic
- ✅ Database and auth logic
- ✅ UI components and styling

---

**Implementation Date**: October 22, 2025
**Status**: ✅ Production Ready
**Entry Point**: http://localhost:6900
