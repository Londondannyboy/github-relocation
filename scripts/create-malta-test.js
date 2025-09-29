import { createClient } from '@sanity/client';
import Replicate from 'replicate';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sanityClient = createClient({
  projectId: '93ewsltm',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN
});

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
});

function generateKey() {
  return `block-${Date.now()}-${Math.random().toString(36).substring(7)}`;
}

async function createMaltaArticle() {
  console.log('🚀 Creating Malta test article...');

  try {
    // 1. First, ensure we have categories
    console.log('📂 Checking categories...');
    let categories = await sanityClient.fetch(`
      *[_type == "category" && title in ["Visa Requirements", "Golden Visa"]] {
        _id,
        title
      }
    `);

    // If no categories exist, create one
    if (categories.length === 0) {
      console.log('Creating Visa Requirements category...');
      const newCategory = await sanityClient.create({
        _type: 'category',
        title: 'Visa Requirements',
        slug: { current: 'visa-requirements' },
        icon: '📄',
        description: 'Comprehensive visa guides and requirements'
      });
      categories = [newCategory];
    }

    console.log(`Found ${categories.length} categories:`, categories.map(c => c.title));

    // 2. Generate hero image
    console.log('🎨 Generating hero image...');
    const imageOutput = await replicate.run(
      "black-forest-labs/flux-1.1-pro",
      {
        input: {
          prompt: "Aerial view of Valletta Malta harbor with traditional boats, limestone buildings, azure Mediterranean Sea, golden hour light, photorealistic",
          aspect_ratio: "16:9",
          output_format: "webp",
          output_quality: 90
        }
      }
    );

    const imageUrl = Array.isArray(imageOutput) ? imageOutput[0] : imageOutput;
    console.log('✅ Image generated');

    // 3. Upload image to Sanity
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    const asset = await sanityClient.assets.upload('image', Buffer.from(buffer), {
      filename: 'malta-valletta-harbor.webp'
    });

    // 4. Create simple content with proper _keys
    const blocks = [
      {
        _type: 'block',
        _key: generateKey(),
        style: 'normal',
        children: [{ 
          _type: 'span', 
          text: 'Malta offers an exceptional Golden Visa programme for investors seeking European Union residency. With its strategic Mediterranean location and English-speaking population, Malta has become a premier destination for high-net-worth individuals.' 
        }]
      },
      {
        _type: 'block',
        _key: generateKey(),
        style: 'h2',
        children: [{ _type: 'span', text: 'Malta Permanent Residence Programme (MPRP)' }]
      },
      {
        _type: 'block',
        _key: generateKey(),
        style: 'normal',
        children: [{ 
          _type: 'span', 
          text: 'The Malta Permanent Residence Programme requires a minimum investment of €110,000 in government contributions plus property purchase or rental. This provides permanent residency for the entire family, including dependent children and parents.' 
        }]
      },
      {
        _type: 'block',
        _key: generateKey(),
        style: 'normal',
        markDefs: [
          {
            _key: 'link1',
            _type: 'link',
            href: 'https://relocation.quest/posts/portugal-golden-visa-2025-investment-guide'
          }
        ],
        children: [
          { _type: 'span', text: 'Compared to the ' },
          { _type: 'span', text: 'Portugal Golden Visa', marks: ['link1'] },
          { _type: 'span', text: ', Malta\'s programme offers faster processing times and immediate permanent residency status rather than temporary residence.' }
        ]
      },
      {
        _type: 'block',
        _key: generateKey(),
        style: 'h2',
        children: [{ _type: 'span', text: 'Investment Requirements' }]
      },
      {
        _type: 'block',
        _key: generateKey(),
        style: 'normal',
        children: [{ 
          _type: 'span', 
          text: 'Applicants must contribute €98,000 if purchasing property in South Malta/Gozo (€68,000 for other areas), plus €2,000 to a registered charity. Property purchase minimum is €350,000 in South Malta/Gozo or €300,000 elsewhere. Alternatively, rental options start at €12,000 per year.' 
        }]
      },
      // Add embedded image
      {
        _type: 'image',
        _key: generateKey(),
        asset: {
          _type: 'reference',
          _ref: asset._id
        },
        alt: 'Valletta Malta harbor view',
        caption: 'Malta\'s historic capital Valletta offers stunning Mediterranean lifestyle'
      },
      {
        _type: 'block',
        _key: generateKey(),
        style: 'h2',
        children: [{ _type: 'span', text: 'Benefits and Tax Advantages' }]
      },
      {
        _type: 'block',
        _key: generateKey(),
        style: 'normal',
        markDefs: [
          {
            _key: 'link2',
            _type: 'link',
            href: 'https://relocation.quest/categories/tax-strategies/'
          }
        ],
        children: [
          { _type: 'span', text: 'Malta offers attractive tax benefits including no wealth tax, no inheritance tax, and special tax rates for residents. For more tax optimisation strategies, see our ' },
          { _type: 'span', text: 'tax guides', marks: ['link2'] },
          { _type: 'span', text: '. The Global Residence Programme provides a flat 15% tax rate on foreign income remitted to Malta.' }
        ]
      },
      {
        _type: 'block',
        _key: generateKey(),
        style: 'h2',
        children: [{ _type: 'span', text: 'Path to Citizenship' }]
      },
      {
        _type: 'block',
        _key: generateKey(),
        style: 'normal',
        markDefs: [
          {
            _key: 'link3',
            _type: 'link',
            href: 'https://www.identitymalta.com'
          }
        ],
        children: [
          { _type: 'span', text: 'After holding permanent residency for five years, investors may apply for citizenship through naturalisation. Malta also offers a separate citizenship by investment programme with faster timelines. For official requirements, consult ' },
          { _type: 'span', text: 'Identity Malta', marks: ['link3'] },
          { _type: 'span', text: '.' }
        ]
      }
    ];

    // 5. Create document with GUARANTEED categories
    console.log('💾 Creating Sanity document with categories...');
    const doc = {
      _type: 'post',
      title: 'Malta Golden Visa 2025: MPRP Investment Guide',
      slug: {
        current: 'malta-golden-visa-mprp-guide-2025'
      },
      excerpt: 'Complete guide to Malta Permanent Residence Programme (MPRP) with €110,000 investment requirements and path to EU residency.',
      body: blocks,
      featuredImage: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: asset._id
        },
        alt: 'Valletta Malta harbor aerial view',
        credit: 'Generated by Flux Pro'
      },
      categories: categories.map(cat => ({
        _type: 'reference',
        _ref: cat._id,
        _key: generateKey() // Add key to reference
      })),
      tags: [],
      metaTitle: 'Malta Golden Visa 2025: €110K MPRP Investment Requirements',
      metaDescription: 'Malta Permanent Residence Programme guide: €110,000 investment, property requirements, tax benefits, and EU citizenship path.',
      focusKeyword: 'malta golden visa',
      searchVolume: 880,
      cpc: 3.65,
      contentTier: 'tier1',
      generationCost: 0.003,
      publishedAt: new Date().toISOString(),
      featured: true
    };

    const result = await sanityClient.create(doc);
    console.log('✅ Article created successfully!');
    console.log('🔗 Sanity ID:', result._id);
    console.log('🔗 Slug:', doc.slug.current);
    console.log('📂 Categories:', categories.map(c => c.title).join(', '));
    
    return result;

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

createMaltaArticle()
  .then(() => {
    console.log('\n✅ Malta test article created with categories!');
    console.log('Check: https://universal-sanity.sanity.studio/');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Failed:', error);
    process.exit(1);
  });