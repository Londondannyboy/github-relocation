import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sanityClient = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false
});

// Calculate reading time based on word count
// Average reading speed is 200-250 words per minute
// We'll use 225 words per minute as a balanced estimate
function calculateReadingTime(text) {
  if (!text) return 1;
  
  // Extract plain text from body blocks
  let wordCount = 0;
  
  if (Array.isArray(text)) {
    // Handle Sanity block content
    text.forEach(block => {
      if (block._type === 'block' && block.children) {
        block.children.forEach(child => {
          if (child.text) {
            wordCount += child.text.split(/\s+/).filter(word => word.length > 0).length;
          }
        });
      }
    });
  } else if (typeof text === 'string') {
    // Handle plain text
    wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
  }
  
  // Calculate minutes, minimum 1 minute
  const minutes = Math.max(1, Math.ceil(wordCount / 225));
  return minutes;
}

async function updateAllArticlesWithReadingTime() {
  console.log('📚 Updating all articles with reading time...\n');
  
  try {
    // Fetch all posts
    const posts = await sanityClient.fetch(`
      *[_type == "post"] {
        _id,
        title,
        body,
        readTime
      }
    `);
    
    console.log(`Found ${posts.length} articles to process\n`);
    
    let updated = 0;
    let skipped = 0;
    
    for (const post of posts) {
      const calculatedTime = calculateReadingTime(post.body);
      
      // Skip if already has correct reading time
      if (post.readTime === calculatedTime) {
        skipped++;
        console.log(`⏭️  ${post.title} - Already has reading time: ${calculatedTime} min`);
        continue;
      }
      
      // Update the post with reading time
      await sanityClient
        .patch(post._id)
        .set({ readTime: calculatedTime })
        .commit();
      
      updated++;
      console.log(`✅ ${post.title} - Reading time: ${calculatedTime} min`);
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`   Updated: ${updated} articles`);
    console.log(`   Skipped: ${skipped} articles (already had correct reading time)`);
    console.log(`   Total: ${posts.length} articles`);
    
  } catch (error) {
    console.error('❌ Error updating reading times:', error);
  }
}

// Also create a function to update a single article
export async function updateSingleArticleReadingTime(articleId) {
  try {
    const post = await sanityClient.fetch(`
      *[_type == "post" && _id == $id][0] {
        _id,
        title,
        body
      }
    `, { id: articleId });
    
    if (!post) {
      console.error('Article not found');
      return null;
    }
    
    const readingTime = calculateReadingTime(post.body);
    
    await sanityClient
      .patch(post._id)
      .set({ readTime: readingTime })
      .commit();
    
    console.log(`✅ Updated "${post.title}" - Reading time: ${readingTime} min`);
    return readingTime;
    
  } catch (error) {
    console.error('❌ Error updating reading time:', error);
    return null;
  }
}

// Run the update
updateAllArticlesWithReadingTime();