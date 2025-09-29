#!/usr/bin/env node

import { createClient } from '@sanity/client';

// Initialize Sanity client with write permissions
const sanityClient = createClient({
  projectId: '93ewsltm',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: 'skTqzbDpQ9uWHpwJPk1XL6Xd0BuaSu9FXwNQZVtHa5xxzchB2jZGZQaURJ71hn1z2OsCqeLGiH2ooyrnEHcKFRKBlH24l6Fd6iHZA4hQw00RPVo8aBlclHBO4yTyMub5bDd9c8ICRuez9LyN5OE5T8o4cXvFrTXNnjozf0W7CZlZvd5CTvQE' // Developer token
});

// Categories to create
const categories = [
  {
    _type: 'category',
    title: 'Visas & Immigration',
    slug: { current: 'visas-immigration' },
    description: 'Visa applications, requirements, and immigration processes',
    icon: '📄',
    order: 1
  },
  {
    _type: 'category',
    title: 'Tax & Finance',
    slug: { current: 'tax-finance' },
    description: 'Tax optimization, exit tax, FATCA/FBAR compliance',
    icon: '💰',
    order: 2
  },
  {
    _type: 'category',
    title: 'Digital Nomad',
    slug: { current: 'digital-nomad' },
    description: 'Digital nomad visas, remote work, lifestyle guides',
    icon: '💻',
    order: 3
  },
  {
    _type: 'category',
    title: 'Golden Visa',
    slug: { current: 'golden-visa' },
    description: 'Investment visas, citizenship by investment programs',
    icon: '🎫',
    order: 4
  },
  {
    _type: 'category',
    title: 'Business Setup',
    slug: { current: 'business-setup' },
    description: 'Company formation, free zones, business visas',
    icon: '🏢',
    order: 5
  },
  {
    _type: 'category',
    title: 'Healthcare & Insurance',
    slug: { current: 'healthcare-insurance' },
    description: 'Expat health insurance, medical systems, coverage',
    icon: '🏥',
    order: 6
  },
  {
    _type: 'category',
    title: 'Living Costs',
    slug: { current: 'living-costs' },
    description: 'Cost of living, housing, daily expenses',
    icon: '🏠',
    order: 7
  },
  {
    _type: 'category',
    title: 'Education',
    slug: { current: 'education' },
    description: 'International schools, universities, education systems',
    icon: '🎓',
    order: 8
  },
  {
    _type: 'category',
    title: 'Property & Real Estate',
    slug: { current: 'property-real-estate' },
    description: 'Property investment, rental markets, buying guides',
    icon: '🏡',
    order: 9
  },
  {
    _type: 'category',
    title: 'Citizenship',
    slug: { current: 'citizenship' },
    description: 'Citizenship paths, naturalization, dual citizenship',
    icon: '🛂',
    order: 10
  }
];

// Tags to create
const tags = [
  // Country tags
  { _type: 'tag', title: 'cyprus', slug: { current: 'cyprus' } },
  { _type: 'tag', title: 'malta', slug: { current: 'malta' } },
  { _type: 'tag', title: 'dubai', slug: { current: 'dubai' } },
  { _type: 'tag', title: 'uae', slug: { current: 'uae' } },
  { _type: 'tag', title: 'portugal', slug: { current: 'portugal' } },
  { _type: 'tag', title: 'singapore', slug: { current: 'singapore' } },
  { _type: 'tag', title: 'greece', slug: { current: 'greece' } },
  { _type: 'tag', title: 'spain', slug: { current: 'spain' } },
  
  // Topic tags
  { _type: 'tag', title: 'exit-tax', slug: { current: 'exit-tax' } },
  { _type: 'tag', title: 'fatca', slug: { current: 'fatca' } },
  { _type: 'tag', title: 'fbar', slug: { current: 'fbar' } },
  { _type: 'tag', title: 'non-dom', slug: { current: 'non-dom' } },
  { _type: 'tag', title: 'golden-visa', slug: { current: 'golden-visa' } },
  { _type: 'tag', title: 'digital-nomad', slug: { current: 'digital-nomad' } },
  { _type: 'tag', title: 'work-permit', slug: { current: 'work-permit' } },
  { _type: 'tag', title: 'tax-optimization', slug: { current: 'tax-optimization' } },
  { _type: 'tag', title: 'relocation-guide', slug: { current: 'relocation-guide' } },
  { _type: 'tag', title: 'expat-insurance', slug: { current: 'expat-insurance' } },
  { _type: 'tag', title: 'healthcare', slug: { current: 'healthcare' } },
  { _type: 'tag', title: 'business-formation', slug: { current: 'business-formation' } },
  { _type: 'tag', title: 'free-zone', slug: { current: 'free-zone' } },
  { _type: 'tag', title: 'investment', slug: { current: 'investment' } },
  { _type: 'tag', title: 'residency', slug: { current: 'residency' } },
  { _type: 'tag', title: 'remote-work', slug: { current: 'remote-work' } },
  { _type: 'tag', title: 'visa', slug: { current: 'visa' } }
];

async function createCategories() {
  console.log('🏗️  Creating Categories...\n');
  
  for (const category of categories) {
    try {
      // Check if category already exists
      const existing = await sanityClient.fetch(
        `*[_type == "category" && slug.current == $slug][0]`,
        { slug: category.slug.current }
      );
      
      if (existing) {
        console.log(`✓ Category already exists: ${category.title}`);
        continue;
      }
      
      // Create new category
      const result = await sanityClient.create(category);
      console.log(`✅ Created category: ${category.title} (${result._id})`);
      
    } catch (error) {
      console.error(`❌ Error creating category ${category.title}:`, error.message);
    }
  }
}

async function createTags() {
  console.log('\n🏷️  Creating Tags...\n');
  
  for (const tag of tags) {
    try {
      // Check if tag already exists
      const existing = await sanityClient.fetch(
        `*[_type == "tag" && slug.current == $slug][0]`,
        { slug: tag.slug.current }
      );
      
      if (existing) {
        console.log(`✓ Tag already exists: ${tag.title}`);
        continue;
      }
      
      // Create new tag
      const result = await sanityClient.create(tag);
      console.log(`✅ Created tag: ${tag.title} (${result._id})`);
      
    } catch (error) {
      console.error(`❌ Error creating tag ${tag.title}:`, error.message);
    }
  }
}

async function main() {
  console.log('🚀 Setting up Categories and Tags for Relocation Quest\n');
  console.log('Project: 93ewsltm (Universal)');
  console.log('Dataset: production\n');
  console.log('=' .repeat(50));
  
  try {
    await createCategories();
    await createTags();
    
    console.log('\n' + '=' .repeat(50));
    console.log('\n✨ Setup complete! Categories and tags are ready for content generation.');
    console.log('\n📝 Next steps:');
    console.log('1. Run content generation scripts');
    console.log('2. Articles will now properly reference categories/tags');
    console.log('3. Pillar pages will display categorized content');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error);
  }
}

// Run the script
main().catch(console.error);