import React from 'react';

// Replace this with your actual Google Drive FILE_ID
const DRIVE_FILE_ID = '1BPENwSqdgKdGwRrCFcFSk_wCVrbhQt3q';

// Google Drive image URLs
const THUMBNAIL_URL = `https://drive.google.com/thumbnail?id=${DRIVE_FILE_ID}&sz=w2048`;
const UC_VIEW_URL = `https://drive.google.com/uc?export=view&id=${DRIVE_FILE_ID}`;

const GoogleDriveImageTest: React.FC = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2 style={{ marginBottom: '1rem' }}>Google Drive Image Display Test</h2>
      
      <div style={{ marginBottom: '2rem' }}>
        <p>Thumbnail Endpoint (Recommended):</p>
        <img
          src={THUMBNAIL_URL}
          alt="Drive Thumbnail"
          style={{
            width: 220,
            height: 220,
            borderRadius: '1rem',
            border: '2px solid #aaa',
            objectFit: 'cover'
          }}
          loading="lazy"
          onError={e => {
            e.currentTarget.src = 'https://via.placeholder.com/150?text=No+Photo';
          }}
        />
        <div style={{ fontSize: '0.85rem', color: '#999', marginTop: '0.5rem' }}>
          {THUMBNAIL_URL}
        </div>
      </div>

      <div>
        <p>UC Export Endpoint (Alternative):</p>
        <img
          src={UC_VIEW_URL}
          alt="Drive UC View"
          style={{
            width: 220,
            height: 220,
            borderRadius: '1rem',
            border: '2px solid #aaa',
            objectFit: 'cover'
          }}
          loading="lazy"
          onError={e => {
            e.currentTarget.src = 'https://via.placeholder.com/150?text=No+Photo';
          }}
        />
        <div style={{ fontSize: '0.85rem', color: '#999', marginTop: '0.5rem' }}>
          {UC_VIEW_URL}
        </div>
      </div>
    </div>
  );
};

export default GoogleDriveImageTest;
