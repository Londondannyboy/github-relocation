// Image format utilities for handling Sanity images

export function getSanityImageUrl(url, options = {}) {
  if (!url) return '';
  
  const {
    width = 1200,
    height,
    format = 'auto', // Use auto=format to let Sanity serve the best format
    quality = 90,
    fit = 'clip'
  } = options;
  
  // Parse Sanity image URL
  const baseUrl = url.split('?')[0];
  
  // Build query parameters
  const params = new URLSearchParams();
  if (width) params.append('w', width);
  if (height) params.append('h', height);
  
  // Use auto=format for automatic format selection based on browser support
  if (format === 'auto') {
    params.append('auto', 'format');
  } else {
    params.append('fm', format); // fm = format (jpg, webp, png)
  }
  
  params.append('q', quality); // q = quality
  params.append('fit', fit);
  
  return `${baseUrl}?${params.toString()}`;
}

// Get optimized image URL for featured/hero images
export function getFeaturedImageUrl(url) {
  return getSanityImageUrl(url, {
    width: 1920,
    format: 'auto', // Auto-detect best format (WebP, AVIF, etc.)
    quality: 85
  });
}

// Get optimized image URL for body content
export function getBodyImageUrl(url) {
  return getSanityImageUrl(url, {
    width: 1200,
    format: 'auto', // Auto-detect best format for body images
    quality: 85
  });
}

// Get optimized image URL for thumbnails
export function getThumbnailUrl(url) {
  return getSanityImageUrl(url, {
    width: 400,
    height: 300,
    format: 'auto', // Auto-detect best format
    quality: 80,
    fit: 'crop'
  });
}

// Generate srcset for responsive images
export function getResponsiveSrcSet(url, format = 'jpg') {
  const widths = [400, 800, 1200, 1600];
  return widths
    .map(w => `${getSanityImageUrl(url, { width: w, format })} ${w}w`)
    .join(', ');
}

// Generate picture element with WebP and JPEG fallback
export function getPictureHtml(url, alt = '', className = '') {
  const webpSrcSet = getResponsiveSrcSet(url, 'webp');
  const jpgSrcSet = getResponsiveSrcSet(url, 'jpg');
  const defaultSrc = getBodyImageUrl(url);
  
  return `
    <picture>
      <source 
        type="image/webp" 
        srcset="${webpSrcSet}"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
      />
      <source 
        type="image/jpeg" 
        srcset="${jpgSrcSet}"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
      />
      <img 
        src="${defaultSrc}" 
        alt="${alt}" 
        class="${className}"
        loading="lazy"
        decoding="async"
      />
    </picture>
  `;
}