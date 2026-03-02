/**
 * Image URL Helper
 * 
 * Converts relative image paths to full backend URLs
 * for uploaded images
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Convert relative image path to full URL
 * @param {string} imagePath - Relative path like '/uploads/services/image.jpg'
 * @returns {string} Full URL like 'http://localhost:3001/uploads/services/image.jpg'
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a relative path, prepend API URL
  if (imagePath.startsWith('/')) {
    return `${API_URL}${imagePath}`;
  }
  
  // Otherwise, assume it's a filename and construct the path
  return `${API_URL}/uploads/${imagePath}`;
};

/**
 * Get service image URL
 * @param {object} service - Service object
 * @returns {string} Full image URL
 */
export const getServiceImage = (service) => {
  return getImageUrl(service?.image_url) || 'https://placehold.co/600x400?text=No+Image';
};

/**
 * Get internship image URL
 * @param {object} internship - Internship object
 * @returns {string} Full image URL
 */
export const getInternshipImage = (internship) => {
  return getImageUrl(internship?.image_url) || 'https://placehold.co/600x400?text=No+Image';
};

/**
 * Get team member photo URL
 * @param {object} member - Team member object
 * @returns {string} Full photo URL
 */
export const getTeamPhoto = (member) => {
  return getImageUrl(member?.photo_url) || 'https://placehold.co/400x400?text=No+Photo';
};

/**
 * Get project image URL
 * @param {object} project - Project object
 * @returns {string} Full image URL
 */
export const getProjectImage = (project) => {
  return getImageUrl(project?.image_url) || 'https://placehold.co/600x400?text=No+Image';
};

/**
 * Get gallery images URLs
 * @param {array} galleryUrls - Array of relative URLs
 * @returns {array} Array of full URLs
 */
export const getGalleryImages = (galleryUrls = []) => {
  return galleryUrls.map(url => getImageUrl(url)).filter(Boolean);
};

/**
 * Placeholder image for errors
 * @param {string} text - Custom text for placeholder
 * @returns {string} Placeholder image URL
 */
export const getPlaceholder = (text = 'No Image') => {
  return `https://placehold.co/600x400/e2e8f0/64748b?text=${encodeURIComponent(text)}`;
};

export default {
  getImageUrl,
  getServiceImage,
  getInternshipImage,
  getTeamPhoto,
  getProjectImage,
  getGalleryImages,
  getPlaceholder
};
