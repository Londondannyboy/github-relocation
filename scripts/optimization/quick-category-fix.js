/**
 * QUICK Category Distribution Fix
 * Just fixes the 97% single-category problem
 * Takes ~5 minutes for 999 posts
 */

import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '..', '.env.local') });

const client = createClient({
  projectId: '93ewsltm',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false
});

// Quick category mapping based on keywords
const CATEGORY_MAP = {
  'Golden Visa Programs': ['golden visa', 'investment', 'residency program', 'investor visa'],
  'Tax Strategies': ['tax', 'nhr', 'non-dom', 'tax regime', 'zero tax'],
  'Business Setup': ['business', 'company', 'startup', 'entrepreneur', 'freelance'],
  'Cost of Living': ['cost', 'budget', 'expense', 'affordable', 'price'],
  'Citizenship Programs': ['citizenship', 'passport', 'naturalization'],
  'Property Investment': ['property', 'real estate', 'rental', 'housing']
};

async function quickFix() {
  console.log('⚡ Quick Category Fix Starting...\n');
  
  // Get all categories
  const categories = await client.fetch(`*[_type == "category"]`);
  const categoryMap = {};
  categories.forEach(cat => {
    categoryMap[cat.title] = cat._id;
  });
  
  // Get all posts
  const posts = await client.fetch(`
    *[_type == "post"][0...999] {
      _id,
      title,
      categories
    }
  `);
  
  console.log(`Found ${posts.length} posts to fix\n`);
  
  // Batch updates
  const mutations = [];
  
  posts.forEach((post, index) => {
    const titleLower = post.title.toLowerCase();
    const assignedCats = [];
    
    // Always keep Digital Nomad
    if (categoryMap['Digital Nomad']) {
      assignedCats.push({
        _type: 'reference',
        _ref: categoryMap['Digital Nomad']
      });
    }
    
    // Add relevant categories based on title
    for (const [catName, keywords] of Object.entries(CATEGORY_MAP)) {
      if (keywords.some(kw => titleLower.includes(kw))) {
        if (categoryMap[catName] && assignedCats.length < 3) {
          assignedCats.push({
            _type: 'reference',
            _ref: categoryMap[catName]
          });
        }
      }
    }
    
    // Only update if we have multiple categories
    if (assignedCats.length > 1) {
      mutations.push({
        patch: {
          id: post._id,
          set: {
            categories: assignedCats
          }
        }
      });
    }
    
    if ((index + 1) % 100 === 0) {
      console.log(`Processed ${index + 1} posts...`);
    }
  });
  
  console.log(`\n📝 Applying ${mutations.length} category updates...`);
  
  // Apply in batches of 100
  for (let i = 0; i < mutations.length; i += 100) {
    const batch = mutations.slice(i, i + 100);
    await client.transaction(batch).commit();
    console.log(`✅ Updated batch ${Math.floor(i/100) + 1}/${Math.ceil(mutations.length/100)}`);
  }
  
  console.log('\n✅ Quick Category Fix Complete!');
  
  // Check distribution
  const stats = await client.fetch(`
    *[_type == "category"] {
      title,
      "count": count(*[_type == "post" && references(^._id)])
    } | order(count desc)
  `);
  
  console.log('\n📊 New Category Distribution:');
  stats.forEach(stat => {
    console.log(`  ${stat.title}: ${stat.count} posts`);
  });
}

quickFix().catch(console.error);