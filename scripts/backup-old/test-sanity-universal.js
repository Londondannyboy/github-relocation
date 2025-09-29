import { createClient } from '@sanity/client';

// Test connection to Universal Sanity project
const client = createClient({
  projectId: '93ewsltm',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'skTqzbDpQ9uWHpwJPk1XL6Xd0BuaSu9FXwNQZVtHa5xxzchB2jZGZQaURJ71hn1z2OsCqeLGiH2ooyrnEHcKFRKBlH24l6Fd6iHZA4hQw00RPVo8aBlclHBO4yTyMub5bDd9c8ICRuez9LyN5OE5T8o4cXvFrTXNnjozf0W7CZlZvd5CTvQE',
  useCdn: false
});

async function testConnection() {
  try {
    console.log('🔄 Testing connection to Universal Sanity project...');
    console.log('Project ID: 93ewsltm');
    console.log('Workspace: sanity-relocation\n');

    // Test 1: Check if we can query the project
    const query = `*[_type == "sanity.imageAsset"][0...1]`;
    const result = await client.fetch(query);
    console.log('✅ Connection successful!');
    
    // Test 2: Check for existing posts
    const postCount = await client.fetch(`count(*[_type == "post"])`);
    console.log(`📊 Current post count: ${postCount}`);
    
    // Test 3: Check for existing categories
    const categoryCount = await client.fetch(`count(*[_type == "category"])`);
    console.log(`📁 Current category count: ${categoryCount}`);
    
    // Test 4: Create a test category
    console.log('\n🏷️ Creating test category...');
    const testCategory = await client.create({
      _type: 'category',
      title: 'Visa Requirements',
      slug: {
        _type: 'slug',
        current: 'visa-requirements'
      },
      description: 'Everything about visa requirements for different countries',
      icon: '📄',
      order: 1
    });
    console.log('✅ Test category created:', testCategory._id);
    
    // Test 5: Create a test post
    console.log('\n📝 Creating test post...');
    const testPost = await client.create({
      _type: 'post',
      title: 'Cyprus Golden Visa Complete Guide 2025',
      slug: {
        _type: 'slug',
        current: 'cyprus-golden-visa-guide-2025'
      },
      excerpt: 'Complete guide to obtaining Cyprus Golden Visa in 2025',
      body: [
        {
          _type: 'block',
          _key: 'block1',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'span1',
              text: 'This is a test post to verify our Universal Sanity setup is working correctly.',
              marks: []
            }
          ],
          markDefs: []
        }
      ],
      focusKeyword: 'Cyprus golden visa',
      searchVolume: 590,
      cpc: 2.41,
      category: {
        _type: 'reference',
        _ref: testCategory._id
      },
      contentTier: 'tier1',
      featured: true,
      publishedAt: new Date().toISOString(),
      generationCost: 0.01,
      metaTitle: 'Cyprus Golden Visa Guide 2025',
      metaDescription: 'Complete guide to Cyprus Golden Visa requirements, costs, and application process for 2025.'
    });
    
    console.log('✅ Test post created:', testPost._id);
    console.log('\n🎉 Universal Sanity project is fully operational!');
    console.log('Studio URL: https://universal.sanity.studio/structure/sanity-relocation');
    
  } catch (error) {
    console.error('❌ Error testing Sanity connection:', error.message);
    if (error.statusCode === 401) {
      console.error('Authentication failed. Please check the API token.');
    } else if (error.statusCode === 404) {
      console.error('Project not found. Please verify project ID: 93ewsltm');
    }
  }
}

testConnection();