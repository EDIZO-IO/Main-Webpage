import { useEffect } from 'react';

const SEO = ({ title, description, keywords, canonical, ogTitle, ogDescription, ogImage, twitterTitle, twitterDescription, twitterImage, schemaData }) => {
  useEffect(() => {
    // Update title
    document.title = title || 'Edizo | Design.Develop.Learn - Digital Agency';

    // Update or create meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description || 'Edizo offers expert web development, UI/UX design, app development & digital marketing in India. Transform your business with our creative solutions.');

    // Update or create meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', keywords || 'Edizo, digital agency India, UI/UX design, web development, app development, React development, Next.js, Flutter, internships India, creative agency, branding, SEO services, digital marketing');

    // Update or create canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonical || 'https://www.edizo.in/');

    // Update or create Open Graph tags
    const ogTags = [
      { property: 'og:title', content: ogTitle || title || 'Edizo | Design.Develop.Learn - Digital Agency' },
      { property: 'og:description', content: ogDescription || description || 'Transform your business with Edizo - India\'s leading creative digital agency. Expert UI/UX design, web development, app development & internships.' },
      { property: 'og:url', content: canonical || 'https://www.edizo.in/' },
      { property: 'og:image', content: ogImage || 'https://www.edizo.in/og-image.png' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'Edizo' },
    ];

    ogTags.forEach(tag => {
      let element = document.querySelector(`meta[property="${tag.property}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('property', tag.property);
        document.head.appendChild(element);
      }
      element.setAttribute('content', tag.content);
    });

    // Update or create Twitter Card tags
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@edizo_official' },
      { name: 'twitter:creator', content: '@edizo_official' },
      { name: 'twitter:title', content: twitterTitle || title || 'Edizo | Design.Develop.Learn - Digital Agency' },
      { name: 'twitter:description', content: twitterDescription || description || 'Transform your business with Edizo - India\'s leading creative digital agency. Expert UI/UX design, web development, app development & internships.' },
      { name: 'twitter:image', content: twitterImage || ogImage || 'https://www.edizo.in/og-image.png' },
    ];

    twitterTags.forEach(tag => {
      let element = document.querySelector(`meta[name="${tag.name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', tag.name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', tag.content);
    });

    // Update or create structured data script
    if (schemaData) {
      let schemaScript = document.querySelector('script[type="application/ld+json"]');
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.setAttribute('type', 'application/ld+json');
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify(schemaData);
    }

    // Update or create robots meta
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute('content', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    // Update or create googlebot meta
    let googlebotMeta = document.querySelector('meta[name="googlebot"]');
    if (!googlebotMeta) {
      googlebotMeta = document.createElement('meta');
      googlebotMeta.setAttribute('name', 'googlebot');
      document.head.appendChild(googlebotMeta);
    }
    googlebotMeta.setAttribute('content', 'index, follow');

    // Update or create geo meta tags
    const geoTags = [
      { name: 'geo.region', content: 'IN' },
      { name: 'geo.placename', content: 'India' },
      { name: 'geo.position', content: '20.5937;78.9629' },
      { name: 'ICBM', content: '20.5937, 78.9629' },
    ];

    geoTags.forEach(tag => {
      let element = document.querySelector(`meta[name="${tag.name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', tag.name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', tag.content);
    });

    // Update or create theme color meta
    let themeColor = document.querySelector('meta[name="theme-color"]');
    if (!themeColor) {
      themeColor = document.createElement('meta');
      themeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(themeColor);
    }
    themeColor.setAttribute('content', '#ff6b6b');

  }, [title, description, keywords, canonical, ogTitle, ogDescription, ogImage, twitterTitle, twitterDescription, twitterImage, schemaData]);

  return null;
};

export default SEO;