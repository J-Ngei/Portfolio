import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Create a client for fetching data in the getProps page functions
export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03', // Use current date (YYYY-MM-DD) to target the latest API version
  useCdn: import.meta.env.PROD, // Enable CDN in production only
  token: import.meta.env.VITE_SANITY_TOKEN, // Only if you want to update content with the client
});

// Helper function for using the current client
const builder = imageUrlBuilder(client);

export function urlFor(source) {
  return builder.image(source);
}

// Helper function to fetch data with GROQ
export async function fetchSanityData(query, params = {}) {
  try {
    const data = await client.fetch(query, params);
    return data;
  } catch (error) {
    console.error('Error fetching data from Sanity:', error);
    throw error;
  }
}

// Helper function to get all documents of a specific type
export async function getAllDocuments(type) {
  const query = `*[_type == "${type}"]`;
  return fetchSanityData(query);
}

// Helper function to get a single document by slug
export async function getDocumentBySlug(type, slug) {
  const query = `*[_type == "${type}" && slug.current == $slug][0]`;
  return fetchSanityData(query, { slug });
}

// Helper function to get site settings
export async function getSiteSettings() {
  const query = `*[_type == "siteSettings"][0]`;
  return fetchSanityData(query);
}
