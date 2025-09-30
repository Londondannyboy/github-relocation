import dotenv from 'dotenv';
import { createClient } from '@sanity/client';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false
});

async function fixDubaiSlug() {
  try {
    // Find the Dubai article
    const post = await client.fetch(
      `*[_type == "post" && title match "Dubai Freelance*"][0]`
    );
    
    if (post) {
      console.log('Found post:', post._id, post.title);
      
      // Update with proper slug
      const updated = await client
        .patch(post._id)
        .set({
          slug: {
            _type: 'slug',
            current: 'dubai-freelance-visa-2025'
          }
        })
        .commit();
      
      console.log('✅ Fixed slug for Dubai Freelance Visa 2025');
      console.log('Updated:', updated.slug);
    } else {
      console.log('❌ Dubai article not found');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

fixDubaiSlug();