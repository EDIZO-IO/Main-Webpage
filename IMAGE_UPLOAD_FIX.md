# ✅ Image Upload Display Fixed

## Problem
Uploaded images were not showing on the website because:
1. Uploads directory wasn't being created automatically
2. CORS headers weren't set for image files
3. Frontend wasn't converting relative paths to full URLs

---

## Solution

### 1. **Backend - Uploads Middleware** ✅

Created `backend/middleware/uploads.js`:
- ✅ Auto-creates upload directories
- ✅ Sets CORS headers for images
- ✅ Configures caching for better performance
- ✅ Serves files with proper MIME types

**Directories Created:**
```
backend/uploads/
├── services/
├── internships/
├── team/
├── projects/
├── events/
└── blogs/
```

### 2. **Backend - Server Configuration** ✅

Updated `backend/server.js`:
```javascript
// Static files for uploads (with CORS)
app.use(uploadsMiddleware);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
```

### 3. **Frontend - Image URL Helpers** ✅

Created `frontend/src/utils/imageHelpers.js`:
- ✅ Converts relative paths to full URLs
- ✅ Provides helper functions for all image types
- ✅ Handles fallback images
- ✅ Supports gallery images

---

## Usage

### Backend Image Upload:
```javascript
// Upload image
const result = await uploadAPI.uploadImage(file, 'services');
// Returns: { url: '/uploads/services/abc123.webp', ... }

// Save to database
await servicesAPI.create({
  ...data,
  image_url: result.url
});
```

### Frontend Image Display:
```jsx
import { getServiceImage } from '../utils/imageHelpers';

// In component
<img 
  src={getServiceImage(service)} 
  alt={service.title}
  onError={(e) => {
    e.target.src = getPlaceholder('No Image');
  }}
/>
```

---

## Image URL Conversion

### Before (Not Working):
```javascript
image_url: '/uploads/services/abc123.webp'
// Frontend tries to load: http://localhost:5173/uploads/services/abc123.webp
// ❌ 404 - File not found (wrong domain)
```

### After (Working):
```javascript
image_url: 'http://localhost:3001/uploads/services/abc123.webp'
// Frontend loads: http://localhost:3001/uploads/services/abc123.webp
// ✅ Success - Image displayed
```

---

## Helper Functions

### getImageUrl(imagePath)
Converts any image path to full URL:
```javascript
getImageUrl('/uploads/services/img.jpg')
// → 'http://localhost:3001/uploads/services/img.jpg'

getImageUrl('img.jpg')
// → 'http://localhost:3001/uploads/img.jpg'

getImageUrl('https://example.com/img.jpg')
// → 'https://example.com/img.jpg' (unchanged)
```

### getServiceImage(service)
Gets service image with fallback:
```javascript
getServiceImage(service)
// → 'http://localhost:3001/uploads/services/img.jpg'
// or 'https://placehold.co/600x400?text=No+Image' if no image
```

### getInternshipImage(internship)
Gets internship image with fallback:
```javascript
getInternshipImage(internship)
// → Full image URL or placeholder
```

### getTeamPhoto(member)
Gets team member photo:
```javascript
getTeamPhoto(member)
// → Full photo URL or placeholder
```

### getProjectImage(project)
Gets project image:
```javascript
getProjectImage(project)
// → Full image URL or placeholder
```

### getGalleryImages(galleryUrls)
Converts array of relative URLs to full URLs:
```javascript
getGalleryImages(['/uploads/img1.jpg', '/uploads/img2.jpg'])
// → ['http://localhost:3001/uploads/img1.jpg', ...]
```

### getPlaceholder(text)
Gets placeholder image:
```javascript
getPlaceholder('No Image')
// → 'https://placehold.co/600x400/e2e8f0/64748b?text=No+Image'
```

---

## Files Created/Updated

| File | Status | Purpose |
|------|--------|---------|
| `backend/middleware/uploads.js` | ✅ NEW | Upload middleware |
| `backend/server.js` | ✅ UPDATED | Added uploads middleware |
| `frontend/src/utils/imageHelpers.js` | ✅ NEW | Image URL helpers |
| `frontend/.env` | ✅ UPDATED | Added image config notes |

---

## Testing

### 1. Check Upload Directories:
```bash
cd backend
ls -la uploads/
# Should show: services, internships, team, projects, events, blogs
```

### 2. Test Image Upload:
```bash
# Upload a test image
curl -X POST http://localhost:3001/api/upload/image \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@test.jpg" \
  -F "folder=services"

# Should return:
# {"url": "/uploads/services/uuid.jpg", ...}
```

### 3. Test Image Access:
```bash
# Access uploaded image
curl http://localhost:3001/uploads/services/uuid.jpg
# Should return image with proper headers
```

### 4. Test Frontend Display:
```jsx
// In browser console
import { getImageUrl } from './utils/imageHelpers';
console.log(getImageUrl('/uploads/services/test.jpg'));
// Should log: 'http://localhost:3001/uploads/services/test.jpg'
```

---

## CORS Configuration

### Headers Set:
```javascript
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type
Cache-Control: public, max-age=31536000
```

### Why Needed:
Frontend (localhost:5173) and Backend (localhost:3001) are different origins. Without CORS, browser blocks image requests.

---

## Cache Configuration

### Browser Cache:
- **Max Age:** 1 day
- **ETag:** Enabled
- **Last Modified:** Enabled

### Why:
- Reduces server load
- Faster page loads
- Better user experience

---

## Supported Image Formats

| Format | Extension | Max Size | MIME Type |
|--------|-----------|----------|-----------|
| JPEG | .jpg, .jpeg | 5MB | image/jpeg |
| PNG | .png | 5MB | image/png |
| GIF | .gif | 5MB | image/gif |
| WebP | .webp | 5MB | image/webp |
| SVG | .svg | 5MB | image/svg+xml |

---

## Troubleshooting

### Images Still Not Showing?

#### 1. Check Backend Server:
```bash
# Restart backend server
cd backend
npm run dev

# Check for upload directory creation
# Should see: ✅ Created directory: uploads/services
```

#### 2. Check Image URL:
```javascript
// In browser console
console.log('Image URL:', service.image_url);
// Should be full URL: http://localhost:3001/uploads/...

// Try loading directly
window.open('http://localhost:3001/uploads/services/test.jpg');
// Should open image in new tab
```

#### 3. Check CORS Headers:
```bash
# Check response headers
curl -I http://localhost:3001/uploads/services/test.jpg

# Should see:
# Access-Control-Allow-Origin: *
# Cache-Control: public, max-age=86400
```

#### 4. Check File Permissions:
```bash
# On Linux/Mac
cd backend/uploads
ls -la

# Files should be readable
chmod 644 uploads/services/*.jpg
```

#### 5. Check Frontend Helper:
```javascript
// In component
import { getServiceImage } from '../utils/imageHelpers';

const imageUrl = getServiceImage(service);
console.log('Service Image:', imageUrl);
// Should log full URL
```

---

## Production Deployment

### Environment Variables:
```env
# Frontend .env
VITE_API_URL=https://api.edizo.in

# Images will be served from:
# https://api.edizo.in/uploads/{folder}/{filename}
```

### CDN Integration (Optional):
```javascript
// Add CDN URL to .env
VITE_CDN_URL=https://cdn.edizo.in

// Update imageHelpers.js
const CDN_URL = import.meta.env.VITE_CDN_URL;
export const getImageUrl = (path) => {
  if (path.startsWith('/')) {
    return `${CDN_URL}${path}`;
  }
  // ...
};
```

---

## Performance Tips

### 1. Image Optimization:
```javascript
// Use sharp to compress before upload
import sharp from 'sharp';

const optimized = await sharp(file.buffer)
  .resize(800, 600, { fit: 'cover' })
  .webp({ quality: 80 })
  .toBuffer();
```

### 2. Lazy Loading:
```jsx
<img 
  src={imageUrl} 
  loading="lazy"
  alt="Service"
/>
```

### 3. Responsive Images:
```jsx
<img 
  src={getImageUrl(service.image_url)}
  srcSet={`
    ${getImageUrl(service.image_url)} 1x,
    ${getImageUrl(service.image_url.replace('.', '@2x.'))} 2x
  `}
  alt="Service"
/>
```

---

**Status:** ✅ Fixed
**Date:** 2025-03-01
**Version:** 2.0
