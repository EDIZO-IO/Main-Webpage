import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

// Add meta tags for performance and SEO
const addMetaTags = () => {
  // Viewport meta tag
  let viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) {
    viewport = document.createElement('meta');
    viewport.setAttribute('name', 'viewport');
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0');
    document.head.appendChild(viewport);
  }

  // Performance meta tags
  const metaTags = [
    { name: 'theme-color', content: '#ffffff' },
    { name: 'msapplication-TileColor', content: '#da532c' },
    { name: 'description', content: 'EDIZO - Creative Digital Agency offering web development, UI/UX design, app development, and digital marketing services.' },
    { property: 'og:title', content: 'EDIZO - Creative Digital Agency' },
    { property: 'og:description', content: 'Web development, UI/UX design, app development, and digital marketing services.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://www.edizo.in/' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'EDIZO - Creative Digital Agency' },
    { name: 'twitter:description', content: 'Web development, UI/UX design, app development, and digital marketing services.' },
  ];

  metaTags.forEach(tag => {
    let element = document.querySelector(tag.name ? `meta[name="${tag.name}"]` : `meta[property="${tag.property}"]`);
    if (!element) {
      element = document.createElement('meta');
      if (tag.name) element.setAttribute('name', tag.name);
      if (tag.property) element.setAttribute('property', tag.property);
      element.setAttribute('content', tag.content);
      document.head.appendChild(element);
    }
  });
};

addMetaTags();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
