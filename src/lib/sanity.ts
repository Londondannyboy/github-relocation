import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: '93ewsltm', // Universal project
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
  perspective: 'published',
  token: process.env.SANITY_API_TOKEN, // For authenticated requests
});

// Helper function to get image URL from Sanity
export function urlForImage(source: any): string {
  if (!source) return '';
  
  const ref = source.asset?._ref;
  if (!ref) return '';
  
  const [_file, id, dimensions, format] = ref.split('-');
  const [width, height] = dimensions.split('x');
  
  return `https://cdn.sanity.io/images/93ewsltm/production/${id}-${dimensions}.${format}`;
}