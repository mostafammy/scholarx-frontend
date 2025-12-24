/**
 * Utility functions for handling image URLs
 */

/**
 * Processes an image URL to handle both local uploads and Cloudinary URLs
 * @param {string|object} image - Image string URL or object with url property
 * @param {string} defaultImage - Default image to return if no image provided
 * @returns {string} - Processed image URL
 */
export const processImageUrl = (image, defaultImage = null) => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  
  // Extract URL from image object or use string directly
  let imageUrl = typeof image === 'string' ? image : image?.url;
  
  // Return default if no image
  if (!imageUrl) {
    return defaultImage;
  }
  
  // If it's a local upload path, prepend the backend base URL
  if (imageUrl.startsWith('/uploads')) {
    return API_URL.replace('/api', '') + imageUrl;
  }
  
  // If it's already a Cloudinary URL or external URL, use it as is
  return imageUrl;
};

/**
 * Gets user avatar URL with fallback to default
 * @param {object} user - User object
 * @param {string} defaultAvatar - Default avatar URL
 * @returns {string} - Processed avatar URL
 */
export const getUserAvatarUrl = (user, defaultAvatar) => {
  return processImageUrl(user?.image?.url, defaultAvatar);
};

/**
 * Gets course image URL with fallback to default
 * @param {object} course - Course object
 * @param {string} defaultImage - Default course image URL
 * @returns {string} - Processed course image URL
 */
export const getCourseImageUrl = (course, defaultImage) => {
  return processImageUrl(course?.image, defaultImage);
};
