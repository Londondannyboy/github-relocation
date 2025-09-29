import { createClient } from '@sanity/client';

// Test connection to Universal Sanity project
const client = createClient({
  projectId: '93ewsltm',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN || '[Configure in .env.local]',
  useCdn: false
});

async function testUniversalProject() {
  try {
    console.log('🔄 Testing Universal Sanity Project...');
    console.log('Project ID: 93ewsltm');
    console.log('Studio: https://universal-sanity.sanity.studio/\n');

    // Test 1: Query for categories
    const categories = await client.fetch(`*[_type == "category"] | order(order asc)`);
    console.log(`📁 Categories: ${categories.length}`);
    
    // Test 2: Query for posts
    const posts = await client.fetch(`*[_type == "post"][0...5] {
      title,
      slug,
      focusKeyword,
      publishedAt
    }`);
    console.log(`📝 Posts found: ${posts.length}`);
    
    if (posts.length > 0) {
      console.log('\nSample posts:');
      posts.forEach(post => {
        console.log(`  - ${post.title} (${post.focusKeyword})`);
      });
    }
    
    // Test 3: Create a test category if none exist
    if (categories.length === 0) {
      console.log('\n🏷️ Creating initial categories...');
      
      const visaCategory = await client.create({
        _type: 'category',
        title: 'Visa Requirements',
        slug: { _type: 'slug', current: 'visa-requirements' },
        description: 'Everything about visa requirements and immigration',
        icon: '📄',
        order: 1
      });
      
      const taxCategory = await client.create({
        _type: 'category',
        title: 'Tax Strategies',
        slug: { _type: 'slug', current: 'tax-strategies' },
        description: 'Tax optimization and financial planning',
        icon: '💰',
        order: 2
      });
      
      const livingCategory = await client.create({
        _type: 'category',
        title: 'Living Costs',
        slug: { _type: 'slug', current: 'living-costs' },
        description: 'Cost of living and lifestyle information',
        icon: '🏠',
        order: 3
      });
      
      console.log('✅ Created 3 initial categories');
    }
    
    console.log('\n✅ Universal Sanity project is fully operational!');
    console.log('🌐 Studio: https://universal-sanity.sanity.studio/');
    console.log('📊 Ready for content generation at $0.01 per article');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Details:', error.response.body);
    }
  }
}

testUniversalProject();