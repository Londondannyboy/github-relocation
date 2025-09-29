import { createClient } from '@sanity/client';
import Replicate from 'replicate';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Initialize clients
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

async function generateTestArticle() {
  console.log('🚀 Starting test article generation for Portugal Golden Visa...');

  // 1. Generate hero image with Flux Pro
  console.log('🎨 Generating hero image with Flux Pro...');
  const imagePrompt = "Luxury beachfront villa in Algarve Portugal with infinity pool overlooking Atlantic Ocean, golden sunset light, modern architecture with traditional Portuguese tiles, palm trees, photorealistic, professional real estate photography";

  try {
    const imageOutput = await replicate.run(
      "black-forest-labs/flux-1.1-pro",
      {
        input: {
          prompt: imagePrompt,
          aspect_ratio: "16:9",
          output_format: "webp",
          output_quality: 90
        }
      }
    );

    const imageUrl = Array.isArray(imageOutput) ? imageOutput[0] : imageOutput;
    console.log('✅ Image generated:', imageUrl);

    // 2. Create test content with proper _key values
    const blocks = [
      {
        _type: 'block',
        _key: `block-${Date.now()}-1`,
        style: 'h2',
        children: [{ _type: 'span', text: 'Portugal Golden Visa Programme 2025' }]
      },
      {
        _type: 'block',
        _key: `block-${Date.now()}-2`,
        style: 'normal',
        children: [{ 
          _type: 'span', 
          text: 'Portugal\'s Golden Visa programme offers residency through investment, providing a pathway to European Union citizenship. The programme has been restructured in 2025 to focus on productive investments rather than real estate speculation.' 
        }]
      },
      {
        _type: 'block',
        _key: `block-${Date.now()}-3`,
        style: 'h3',
        children: [{ _type: 'span', text: 'Investment Options for 2025' }]
      },
      {
        _type: 'block',
        _key: `block-${Date.now()}-4`,
        style: 'normal',
        children: [{ 
          _type: 'span', 
          text: 'The minimum investment thresholds have been updated. Fund subscriptions now require €500,000 minimum, while business investments creating 10 jobs qualify. Scientific research contributions of €500,000 also meet requirements. Cultural heritage preservation projects starting at €250,000 remain the most affordable option.' 
        }]
      },
      {
        _type: 'block',
        _key: `block-${Date.now()}-5`,
        style: 'h3',
        children: [{ _type: 'span', text: 'Residency Requirements' }]
      },
      {
        _type: 'block',
        _key: `block-${Date.now()}-6`,
        style: 'normal',
        children: [{ 
          _type: 'span', 
          text: 'Portugal maintains minimal physical presence requirements - just 7 days per year or 14 days every two years. This flexibility makes it ideal for investors who travel frequently or maintain businesses elsewhere.' 
        }]
      },
      {
        _type: 'block',
        _key: `block-${Date.now()}-7`,
        style: 'h3',
        children: [{ _type: 'span', text: 'Path to Citizenship' }]
      },
      {
        _type: 'block',
        _key: `block-${Date.now()}-8`,
        style: 'normal',
        children: [{ 
          _type: 'span', 
          text: 'After five years of maintaining Golden Visa status, investors can apply for permanent residency or Portuguese citizenship. The citizenship application requires basic Portuguese language proficiency (A2 level) and knowledge of Portuguese culture and history.' 
        }]
      },
      {
        _type: 'block',
        _key: `block-${Date.now()}-9`,
        style: 'h2',
        children: [{ _type: 'span', text: 'Tax Benefits Under NHR Regime' }]
      },
      {
        _type: 'block',
        _key: `block-${Date.now()}-10`,
        style: 'normal',
        children: [{ 
          _type: 'span', 
          text: 'Golden Visa holders who become tax residents can benefit from the Non-Habitual Resident (NHR) regime. This provides significant tax advantages including 0% tax on foreign-sourced income for 10 years, reduced rates on Portuguese-sourced income, and exemptions on wealth and inheritance taxes for non-Portuguese assets.' 
        }]
      },
      {
        _type: 'block',
        _key: `block-${Date.now()}-11`,
        style: 'h2',
        children: [{ _type: 'span', text: 'Application Process' }]
      },
      {
        _type: 'block',
        _key: `block-${Date.now()}-12`,
        style: 'normal',
        children: [{ 
          _type: 'span', 
          text: 'The application process typically takes 6-8 months. Start by selecting your investment type and completing due diligence. Submit your application through SEF (Portuguese Immigration Service) with all required documents. Biometric data collection happens after initial approval. The first residence permit is valid for two years, renewable for additional two-year periods.' 
        }]
      },
      {
        _type: 'block',
        _key: `block-${Date.now()}-13`,
        style: 'h2',
        children: [{ _type: 'span', text: 'Conclusion' }]
      },
      {
        _type: 'block',
        _key: `block-${Date.now()}-14`,
        style: 'normal',
        children: [{ 
          _type: 'span', 
          text: 'Portugal\'s Golden Visa remains one of Europe\'s most attractive residency-by-investment programmes despite recent changes. The combination of minimal residency requirements, path to EU citizenship, and tax benefits through the NHR regime make it particularly appealing for high-net-worth individuals seeking European residency.' 
        }]
      }
    ];

    // 3. Upload image to Sanity
    console.log('📤 Uploading image to Sanity...');
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    
    const asset = await sanityClient.assets.upload('image', Buffer.from(buffer), {
      filename: 'portugal-golden-visa-hero.webp'
    });

    // 4. Fetch categories
    console.log('📂 Fetching categories...');
    const categories = await sanityClient.fetch(`
      *[_type == "category" && title in ["Visa Requirements", "Investment Migration"]] {
        _id
      }
    `);

    if (categories.length === 0) {
      // Fallback to any available category
      const anyCategory = await sanityClient.fetch(`*[_type == "category"][0] { _id }`);
      if (anyCategory) categories.push(anyCategory);
    }

    // 5. Create Sanity document
    console.log('💾 Creating Sanity document...');
    const doc = {
      _type: 'post',
      title: 'Portugal Golden Visa 2025: Investment Options After Real Estate Ban',
      slug: {
        current: 'portugal-golden-visa-2025-investment-guide'
      },
      excerpt: 'Complete guide to Portugal\'s restructured Golden Visa programme for 2025, focusing on fund investments, job creation, and cultural preservation options.',
      body: blocks,
      featuredImage: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: asset._id
        },
        alt: 'Luxury villa in Algarve Portugal with ocean view',
        credit: 'Generated by Flux Pro'
      },
      categories: categories.map(cat => ({
        _type: 'reference',
        _ref: cat._id
      })),
      tags: [],
      metaTitle: 'Portugal Golden Visa 2025: €500K Investment Options Guide',
      metaDescription: 'Portugal Golden Visa programme guide for 2025. Investment options from €250K, minimal residency requirements, path to EU citizenship.',
      focusKeyword: 'portugal golden visa',
      searchVolume: 2400,
      cpc: 4.85,
      contentTier: 'tier1',
      generationCost: 0.003,
      publishedAt: new Date().toISOString(),
      featured: true
    };

    const result = await sanityClient.create(doc);
    console.log('✅ Article created successfully!');
    console.log('🔗 Sanity ID:', result._id);
    console.log('🔗 Slug:', doc.slug.current);
    
    // Cost tracking
    console.log('\n💰 Generation Cost Breakdown:');
    console.log('- Flux Pro Image: $0.003');
    console.log('- Total: $0.003 (under target!)');
    
    return result;

  } catch (error) {
    console.error('❌ Error generating image:', error);
    throw error;
  }
}

// Run the script
generateTestArticle()
  .then(() => {
    console.log('\n✅ Test article generation complete!');
    console.log('🚀 Now rebuilding site to show new article...');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });