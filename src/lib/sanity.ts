import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: 'bc08ijz6',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
  perspective: 'published',
});

// Helper function to get image URL from Sanity
export function urlForImage(source: any): string {
  if (!source) return '';
  
  const ref = source.asset?._ref;
  if (!ref) return '';
  
  const [_file, id, dimensions, format] = ref.split('-');
  const [width, height] = dimensions.split('x');
  
  return `https://cdn.sanity.io/images/bc08ijz6/production/${id}-${dimensions}.${format}`;
}