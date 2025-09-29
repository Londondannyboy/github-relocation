import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sanityClient = createClient({
  projectId: '93ewsltm',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN
});

async function migrateCategories() {
  console.log('🔄 Starting category migration...');

  // 1. Fetch all posts that have the old "category" field
  const postsWithOldCategory = await sanityClient.fetch(`
    *[_type == "post" && defined(category)] {
      _id,
      _rev,
      category
    }
  `);

  console.log(`Found ${postsWithOldCategory.length} posts with old category field`);

  for (const post of postsWithOldCategory) {
    console.log(`Migrating post ${post._id}...`);
    
    try {
      await sanityClient
        .patch(post._id)
        .set({
          categories: [post.category]
        })
        .unset(['category'])
        .commit();
        
      console.log(`✅ Migrated post ${post._id}`);
    } catch (error) {
      console.error(`❌ Failed to migrate post ${post._id}:`, error.message);
    }
  }

  // 2. Fix posts with missing _key in body blocks
  console.log('\n🔧 Fixing missing _key values in body blocks...');
  
  const postsWithBody = await sanityClient.fetch(`
    *[_type == "post" && defined(body)] {
      _id,
      _rev,
      body
    }
  `);

  for (const post of postsWithBody) {
    let needsUpdate = false;
    const updatedBody = post.body.map((block, index) => {
      if (!block._key) {
        needsUpdate = true;
        return {
          ...block,
          _key: `block-fix-${Date.now()}-${index}`
        };
      }
      return block;
    });

    if (needsUpdate) {
      console.log(`Fixing _key values for post ${post._id}...`);
      try {
        await sanityClient
          .patch(post._id)
          .set({ body: updatedBody })
          .commit();
        console.log(`✅ Fixed _key values for post ${post._id}`);
      } catch (error) {
        console.error(`❌ Failed to fix post ${post._id}:`, error.message);
      }
    }
  }

  console.log('\n✅ Migration complete!');
}

migrateCategories()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Migration failed:', error);
    process.exit(1);
  });