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

function generateKey() {
  return `key-${Date.now()}-${Math.random().toString(36).substring(7)}`;
}

async function fixArticles() {
  console.log('🔧 Fixing categories and adding tags to all articles...\n');

  // Fetch all categories and tags
  const categories = await sanityClient.fetch(`*[_type == "category"] { _id, title }`);
  const tags = await sanityClient.fetch(`*[_type == "tag"] { _id, title }`);
  
  console.log(`Found ${categories.length} categories and ${tags.length} tags\n`);

  // Map categories by keyword
  const categoryMap = {
    'exit tax': categories.find(c => c.title === 'Tax Strategies'),
    'digital nomad': categories.find(c => c.title === 'Digital Nomad'),
    'golden visa': categories.find(c => c.title === 'Golden Visa'),
    'tax': categories.find(c => c.title === 'Tax Strategies'),
    'visa': categories.find(c => c.title === 'Visa Requirements'),
    'living': categories.find(c => c.title === 'Living Costs'),
    'citizenship': categories.find(c => c.title === 'Citizenship'),
    'expat': categories.find(c => c.title === 'Living Costs')
  };

  // Map tags
  const tagMap = {
    'usa': tags.find(t => t.title === 'USA'),
    'europe': tags.find(t => t.title === 'Europe'),
    'tax-free': tags.find(t => t.title === 'Tax Free'),
    'remote-work': tags.find(t => t.title === 'Remote Work'),
    'investment': tags.find(t => t.title === 'Investment'),
    'eu-citizenship': tags.find(t => t.title === 'EU Citizenship'),
    'caribbean': tags.find(t => t.title === 'Caribbean'),
    'middle-east': tags.find(t => t.title === 'Middle East'),
    'asia': tags.find(t => t.title === 'Asia')
  };

  // Fetch all posts without proper categories
  const posts = await sanityClient.fetch(`
    *[_type == "post" && (!defined(categories) || count(categories) == 0)] {
      _id,
      _rev,
      title,
      focusKeyword
    }
  `);

  console.log(`Found ${posts.length} posts needing category/tag updates\n`);

  for (const post of posts) {
    console.log(`📝 Updating: ${post.title}`);
    
    const titleLower = post.title.toLowerCase();
    const keywordLower = (post.focusKeyword || '').toLowerCase();
    
    // Determine categories
    const postCategories = [];
    
    // Primary category based on content
    if (titleLower.includes('exit tax')) {
      postCategories.push(categoryMap['exit tax']);
      postCategories.push(categoryMap['tax']);
    } else if (titleLower.includes('digital nomad')) {
      postCategories.push(categoryMap['digital nomad']);
      postCategories.push(categoryMap['visa']);
    } else if (titleLower.includes('golden visa')) {
      postCategories.push(categoryMap['golden visa']);
      postCategories.push(categoryMap['visa']);
    } else if (titleLower.includes('tax')) {
      postCategories.push(categoryMap['tax']);
    } else if (titleLower.includes('visa')) {
      postCategories.push(categoryMap['visa']);
    } else if (titleLower.includes('citizenship')) {
      postCategories.push(categoryMap['citizenship']);
    } else if (titleLower.includes('cost') || titleLower.includes('living')) {
      postCategories.push(categoryMap['living']);
    } else if (titleLower.includes('expat')) {
      postCategories.push(categoryMap['expat']);
    }

    // Remove duplicates and nulls
    const uniqueCategories = [...new Set(postCategories.filter(c => c))];
    
    // Determine tags
    const postTags = [];
    
    if (titleLower.includes('us ') || titleLower.includes('america')) {
      postTags.push(tagMap['usa']);
    }
    if (titleLower.includes('portugal') || titleLower.includes('spain') || titleLower.includes('greece') || 
        titleLower.includes('cyprus') || titleLower.includes('malta') || titleLower.includes('croatia')) {
      postTags.push(tagMap['europe']);
      postTags.push(tagMap['eu-citizenship']);
    }
    if (titleLower.includes('dubai') || titleLower.includes('uae')) {
      postTags.push(tagMap['middle-east']);
      postTags.push(tagMap['tax-free']);
    }
    if (titleLower.includes('singapore')) {
      postTags.push(tagMap['asia']);
    }
    if (titleLower.includes('caribbean') || titleLower.includes('barbados')) {
      postTags.push(tagMap['caribbean']);
    }
    if (titleLower.includes('digital nomad') || titleLower.includes('remote')) {
      postTags.push(tagMap['remote-work']);
    }
    if (titleLower.includes('investment') || titleLower.includes('golden visa')) {
      postTags.push(tagMap['investment']);
    }
    if (titleLower.includes('tax-free') || titleLower.includes('zero tax') || titleLower.includes('0% tax')) {
      postTags.push(tagMap['tax-free']);
    }

    // Remove duplicates and nulls
    const uniqueTags = [...new Set(postTags.filter(t => t))];

    if (uniqueCategories.length === 0) {
      // Fallback to visa requirements if no category found
      uniqueCategories.push(categoryMap['visa']);
    }

    try {
      const patch = sanityClient
        .patch(post._id)
        .setIfMissing({ categories: [] })
        .setIfMissing({ tags: [] });

      // Set categories with proper structure
      if (uniqueCategories.length > 0) {
        patch.set({
          categories: uniqueCategories.map(cat => ({
            _type: 'reference',
            _ref: cat._id,
            _key: generateKey()
          }))
        });
      }

      // Set tags
      if (uniqueTags.length > 0) {
        patch.set({
          tags: uniqueTags.map(tag => ({
            _type: 'reference',
            _ref: tag._id,
            _key: generateKey()
          }))
        });
      }

      await patch.commit();
      
      console.log(`  ✅ Categories: ${uniqueCategories.map(c => c.title).join(', ')}`);
      console.log(`  ✅ Tags: ${uniqueTags.map(t => t.title).join(', ')}`);
      
    } catch (error) {
      console.error(`  ❌ Failed: ${error.message}`);
    }
  }

  // Now check for the unknown field issue
  console.log('\n🔍 Checking for posts with malformed categories field...\n');
  
  const allPosts = await sanityClient.fetch(`
    *[_type == "post"] {
      _id,
      title,
      categories
    }
  `);

  for (const post of allPosts) {
    if (post.categories && Array.isArray(post.categories)) {
      // Check if categories have _key field at wrong level
      const hasWrongStructure = post.categories.some(cat => 
        cat._key && cat._ref && !cat._type
      );
      
      if (hasWrongStructure) {
        console.log(`🔧 Fixing malformed categories in: ${post.title}`);
        
        // Fix the structure
        const fixedCategories = post.categories
          .filter(cat => cat._ref)
          .map(cat => ({
            _type: 'reference',
            _ref: cat._ref,
            _key: generateKey()
          }));

        await sanityClient
          .patch(post._id)
          .set({ categories: fixedCategories })
          .commit();
          
        console.log(`  ✅ Fixed categories structure`);
      }
    }
  }

  console.log('\n✅ All articles updated with categories and tags!');
}

// Create missing tags if needed
async function ensureTagsExist() {
  const requiredTags = [
    { title: 'USA', slug: 'usa', icon: '🇺🇸' },
    { title: 'Europe', slug: 'europe', icon: '🇪🇺' },
    { title: 'Tax Free', slug: 'tax-free', icon: '💰' },
    { title: 'Remote Work', slug: 'remote-work', icon: '💻' },
    { title: 'Investment', slug: 'investment', icon: '📈' },
    { title: 'EU Citizenship', slug: 'eu-citizenship', icon: '🇪🇺' },
    { title: 'Caribbean', slug: 'caribbean', icon: '🏝️' },
    { title: 'Middle East', slug: 'middle-east', icon: '🌍' },
    { title: 'Asia', slug: 'asia', icon: '🌏' }
  ];

  console.log('🏷️ Ensuring required tags exist...\n');

  for (const tagData of requiredTags) {
    const existing = await sanityClient.fetch(
      `*[_type == "tag" && title == $title][0]`,
      { title: tagData.title }
    );

    if (!existing) {
      await sanityClient.create({
        _type: 'tag',
        title: tagData.title,
        slug: { current: tagData.slug },
        icon: tagData.icon
      });
      console.log(`  ✅ Created tag: ${tagData.title}`);
    }
  }
}

// Run the fix
ensureTagsExist()
  .then(() => fixArticles())
  .then(() => {
    console.log('\n🎉 Complete! All articles now have proper categories and tags.');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });