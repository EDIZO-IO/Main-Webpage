# ✅ Database Schema Updated - Image Upload Support

## Schema Updates

### Services Table
**Added/Updated Columns:**
```sql
image_url VARCHAR(500) COMMENT 'Main service image URL (uploaded file path)'
gallery_urls JSON COMMENT 'Multiple images for service gallery'
icon_url VARCHAR(500) COMMENT 'Icon or logo URL'
```

### Internships Table
**Added/Updated Columns:**
```sql
image_url VARCHAR(500) COMMENT 'Main internship image URL (uploaded file path)'
gallery_urls JSON COMMENT 'Multiple images for internship gallery'
```

---

## Image Storage Structure

### File Upload Path:
```
backend/
└── uploads/
    ├── services/
    │   ├── {uuid}.jpg
    │   ├── {uuid}.png
    │   └── {uuid}.webp
    └── internships/
        ├── {uuid}.jpg
        ├── {uuid}.png
        └── {uuid}.webp
```

### Database Storage:
```json
// Services
{
  "id": "uuid",
  "title": "Web Development",
  "image_url": "/uploads/services/abc123-def456.webp",
  "gallery_urls": [
    "/uploads/services/img1.webp",
    "/uploads/services/img2.webp"
  ],
  "icon_url": "/uploads/services/icon.svg"
}

// Internships
{
  "id": "uuid",
  "title": "Full Stack Development",
  "image_url": "/uploads/internships/xyz789.webp",
  "gallery_urls": [
    "/uploads/internships/img1.webp",
    "/uploads/internships/img2.webp"
  ]
}
```

---

## Migration Instructions

### For New Database:
```bash
# Run the complete schema
mysql -u root -p edizo_db < backend/database/schema.sql
```

### For Existing Database:
```bash
# Run migration only
mysql -u root -p edizo_db < backend/database/migrations/add_image_upload_support.sql
```

---

## API Endpoints for Image Upload

### Upload Service Image:
```javascript
POST /api/upload/image
Content-Type: multipart/form-data
Authorization: Bearer {admin_token}

FormData:
  - image: [file]
  - folder: "services"

Response:
{
  "url": "/uploads/services/{uuid}.webp",
  "filename": "{uuid}.webp",
  "size": 123456,
  "mimetype": "image/webp"
}
```

### Upload Internship Image:
```javascript
POST /api/upload/image
Content-Type: multipart/form-data
Authorization: Bearer {admin_token}

FormData:
  - image: [file]
  - folder: "internships"

Response:
{
  "url": "/uploads/internships/{uuid}.webp",
  "filename": "{uuid}.webp",
  "size": 123456,
  "mimetype": "image/webp"
}
```

---

## Admin Panel Integration

### ServicesManager.tsx
```typescript
// Image upload handler
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  const result = await uploadAPI.uploadImage(file, 'services');
  setFormData({ ...formData, image_url: result.url });
};
```

### InternshipsManager.tsx
```typescript
// Image upload handler
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  const result = await uploadAPI.uploadImage(file, 'internships');
  setFormData({ ...formData, image_url: result.url });
};
```

---

## Image Display in Frontend

### Services Page:
```jsx
<img 
  src={service.image_url} 
  alt={service.title}
  onError={(e) => {
    e.target.src = 'https://placehold.co/600x400?text=No+Image';
  }}
/>
```

### Internships Page:
```jsx
<img 
  src={internship.image_url} 
  alt={internship.title}
  onError={(e) => {
    e.target.src = 'https://placehold.co/600x400?text=No+Image';
  }}
/>
```

---

## File Upload Configuration

### Backend (upload.js):
```javascript
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = req.body.folder || 'uploads';
    const uploadPath = path.join('uploads', folder);
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    cb(null, allowedTypes.test(file.mimetype));
  }
});
```

---

## Supported Image Formats

| Format | Extension | Max Size |
|--------|-----------|----------|
| JPEG | .jpg, .jpeg | 5MB |
| PNG | .png | 5MB |
| GIF | .gif | 5MB |
| WebP | .webp | 5MB |

---

## Database Column Details

### Services Table:

| Column | Type | Description |
|--------|------|-------------|
| `icon_url` | VARCHAR(500) | Icon or logo URL |
| `image_url` | VARCHAR(500) | Main service image (uploaded) |
| `gallery_urls` | JSON | Multiple images array |

### Internships Table:

| Column | Type | Description |
|--------|------|-------------|
| `image_url` | VARCHAR(500) | Main internship image (uploaded) |
| `gallery_urls` | JSON | Multiple images array |

---

## Validation Rules

### File Upload Validation:
1. ✅ File type must be image (jpeg, jpg, png, gif, webp)
2. ✅ File size must be ≤ 5MB
3. ✅ Filename is auto-generated (UUID)
4. ✅ Stored in organized folders

### Database Validation:
1. ✅ `image_url` - VARCHAR(500) max
2. ✅ `gallery_urls` - JSON array of URLs
3. ✅ Proper indexes for performance

---

## Error Handling

### Upload Errors:
```javascript
try {
  const result = await uploadAPI.uploadImage(file, 'services');
} catch (error) {
  // Error types:
  // - File too large (>5MB)
  // - Invalid file type
  // - Upload failed
  // - Authentication failed
}
```

### Display Errors:
```jsx
onError={(e) => {
  e.target.src = 'https://placehold.co/600x400?text=No+Image';
}}
```

---

## Files Updated

| File | Changes |
|------|---------|
| `backend/database/schema.sql` | ✅ Updated with image columns |
| `backend/database/migrations/add_image_upload_support.sql` | ✅ NEW - Migration script |
| `backend/routes/upload.js` | ✅ Already exists |
| `admin/src/pages/ServicesManager.tsx` | ✅ Image upload UI |
| `admin/src/pages/InternshipsManager.tsx` | ✅ Image upload UI |

---

## Testing Checklist

### Database:
- [ ] Run migration script
- [ ] Verify columns added
- [ ] Check column comments
- [ ] Test with sample data

### Upload:
- [ ] Upload service image
- [ ] Upload internship image
- [ ] Verify file saved in correct folder
- [ ] Verify URL stored in database
- [ ] Test file size validation
- [ ] Test file type validation

### Display:
- [ ] Service image displays correctly
- [ ] Internship image displays correctly
- [ ] Fallback image shows on error
- [ ] Images responsive on mobile

---

## Security Considerations

### Implemented:
✅ Authentication required for upload
✅ File type validation
✅ File size limits
✅ UUID-based filenames (prevents overwriting)
✅ Organized folder structure

### Recommended:
⚠️ Add image optimization (compress before save)
⚠️ Add virus scanning
⚠️ Add CDN for image delivery
⚠️ Implement lazy loading

---

## Performance Optimization

### Current:
- UUID filenames prevent collisions
- Organized folder structure
- JSON for multiple images

### Recommended:
1. **Image Optimization**
   ```javascript
   // Use sharp for compression
   await sharp(file.buffer)
     .resize(800, 600, { fit: 'cover' })
     .webp({ quality: 80 })
     .toFile(outputPath);
   ```

2. **CDN Integration**
   ```javascript
   // Serve images via CDN
   const cdnUrl = `https://cdn.edizo.in/${imageUrl}`;
   ```

3. **Lazy Loading**
   ```jsx
   <img loading="lazy" src={imageUrl} alt="..." />
   ```

---

**Status:** ✅ Complete
**Date:** 2025-03-01
**Version:** 2.0
