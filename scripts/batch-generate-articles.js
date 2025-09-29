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

// Helper to generate unique keys
function generateKey() {
  return `block-${Date.now()}-${Math.random().toString(36).substring(7)}`;
}

// Sleep helper to avoid rate limits
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Article templates for different topics
const articleTemplates = [
  // EXIT TAX ARTICLES (High value)
  {
    title: 'US Exit Tax Calculator 2025: Complete IRS Expatriation Guide',
    slug: 'us-exit-tax-calculator-2025-irs-guide',
    keyword: 'us exit tax calculator',
    searchVolume: 1900,
    cpc: 8.45,
    category: 'Tax Strategies',
    imagePrompt: 'Modern financial dashboard showing tax calculations, American flag transitioning to globe, professional office setting, photorealistic'
  },
  {
    title: 'How to Avoid US Exit Tax: Legal Strategies for 2025',
    slug: 'how-to-avoid-us-exit-tax-legal-strategies',
    keyword: 'avoid us exit tax',
    searchVolume: 880,
    cpc: 12.30,
    category: 'Tax Strategies',
    imagePrompt: 'Professional tax advisor consulting with client, documents and laptop, modern office, bright natural light'
  },
  {
    title: 'Exit Tax Threshold 2025: Net Worth Limits Explained',
    slug: 'exit-tax-threshold-2025-net-worth-limits',
    keyword: 'exit tax threshold',
    searchVolume: 720,
    cpc: 9.80,
    category: 'Tax Strategies',
    imagePrompt: 'Financial charts showing wealth thresholds, calculator and documents, professional setting'
  },
  
  // DIGITAL NOMAD VISAS (Highest search volume)
  {
    title: 'Estonia Digital Nomad Visa 2025: Complete Application Guide',
    slug: 'estonia-digital-nomad-visa-2025-guide',
    keyword: 'estonia digital nomad visa',
    searchVolume: 2400,
    cpc: 3.45,
    category: 'Digital Nomad',
    imagePrompt: 'Tallinn Old Town aerial view with modern coworking space overlay, laptops and coffee, Baltic architecture'
  },
  {
    title: 'Barbados Welcome Stamp 2025: 12-Month Remote Work Visa',
    slug: 'barbados-welcome-stamp-digital-nomad-visa',
    keyword: 'barbados digital nomad visa',
    searchVolume: 1600,
    cpc: 4.20,
    category: 'Digital Nomad',
    imagePrompt: 'Tropical beach with laptop setup, palm trees, turquoise Caribbean water, beachfront workspace'
  },
  {
    title: 'Dubai Digital Nomad Visa 2025: Tax-Free Remote Work',
    slug: 'dubai-digital-nomad-visa-tax-free-guide',
    keyword: 'dubai digital nomad visa',
    searchVolume: 3200,
    cpc: 5.60,
    category: 'Digital Nomad',
    imagePrompt: 'Dubai skyline with Burj Khalifa, modern coworking space, luxury lifestyle, golden hour'
  },
  {
    title: 'Mexico Temporary Resident Visa: Digital Nomad Guide 2025',
    slug: 'mexico-temporary-resident-visa-digital-nomad',
    keyword: 'mexico digital nomad visa',
    searchVolume: 2800,
    cpc: 2.90,
    category: 'Digital Nomad',
    imagePrompt: 'Playa del Carmen beachfront with coworking cafe, tropical setting, modern workspace'
  },
  {
    title: 'Croatia Digital Nomad Visa 2025: EU Access Guide',
    slug: 'croatia-digital-nomad-visa-eu-access',
    keyword: 'croatia digital nomad visa',
    searchVolume: 1900,
    cpc: 3.75,
    category: 'Digital Nomad',
    imagePrompt: 'Dubrovnik coastal view with historic walls, laptop lifestyle, Mediterranean azure waters'
  },
  
  // GOLDEN VISAS (High CPC)
  {
    title: 'Greece Golden Visa 2025: €250K Property Investment',
    slug: 'greece-golden-visa-property-investment-guide',
    keyword: 'greece golden visa',
    searchVolume: 4900,
    cpc: 6.80,
    category: 'Golden Visa',
    imagePrompt: 'Santorini white buildings with blue domes, luxury property, sunset over Aegean Sea, real estate photography'
  },
  {
    title: 'Spain Golden Visa 2025: €500K Investment Requirements',
    slug: 'spain-golden-visa-investment-requirements',
    keyword: 'spain golden visa',
    searchVolume: 5600,
    cpc: 7.20,
    category: 'Golden Visa',
    imagePrompt: 'Barcelona skyline with Sagrada Familia, luxury apartment interior, Mediterranean lifestyle'
  },
  {
    title: 'UAE Golden Visa 2025: 10-Year Residency Guide',
    slug: 'uae-golden-visa-10-year-residency',
    keyword: 'uae golden visa',
    searchVolume: 8900,
    cpc: 4.50,
    category: 'Golden Visa',
    imagePrompt: 'Dubai Marina luxury towers, golden sunset, yacht harbor, futuristic architecture'
  },
  {
    title: 'Caribbean CBI Programs 2025: Compare 5 Countries',
    slug: 'caribbean-citizenship-by-investment-comparison',
    keyword: 'caribbean citizenship by investment',
    searchVolume: 2100,
    cpc: 15.40,
    category: 'Citizenship',
    imagePrompt: 'Caribbean islands aerial view, multiple flags, luxury resorts, tropical paradise'
  },
  
  // TAX OPTIMIZATION
  {
    title: 'Portugal NHR Tax Regime 2025: 0% Foreign Income',
    slug: 'portugal-nhr-tax-regime-zero-foreign-income',
    keyword: 'portugal nhr tax',
    searchVolume: 3200,
    cpc: 4.90,
    category: 'Tax Strategies',
    imagePrompt: 'Lisbon panoramic view with Tagus River, financial district, modern Portugal'
  },
  {
    title: 'Dubai Tax Residency 2025: Zero Income Tax Guide',
    slug: 'dubai-tax-residency-zero-income-tax',
    keyword: 'dubai tax residency',
    searchVolume: 2600,
    cpc: 6.30,
    category: 'Tax Strategies',
    imagePrompt: 'Dubai Business Bay skyline, luxury lifestyle, financial center, modern architecture'
  },
  {
    title: 'Cyprus Non-Dom Tax Status 2025: 17-Year Benefits',
    slug: 'cyprus-non-dom-tax-status-benefits',
    keyword: 'cyprus non dom tax',
    searchVolume: 1100,
    cpc: 5.80,
    category: 'Tax Strategies',
    imagePrompt: 'Cyprus coastal city Limassol, business district, Mediterranean lifestyle'
  },
  
  // COUNTRY GUIDES
  {
    title: 'Best Countries for American Expats 2025: Tax & Lifestyle',
    slug: 'best-countries-american-expats-2025',
    keyword: 'best countries for american expats',
    searchVolume: 3400,
    cpc: 3.20,
    category: 'Living Costs',
    imagePrompt: 'World map with highlighted expat destinations, passports, global lifestyle collage'
  },
  {
    title: 'Singapore Expat Guide 2025: Employment Pass & Taxes',
    slug: 'singapore-expat-guide-employment-pass',
    keyword: 'singapore expat guide',
    searchVolume: 2800,
    cpc: 4.10,
    category: 'Visa Requirements',
    imagePrompt: 'Singapore Marina Bay Sands, business district, modern Asian metropolis'
  },
  {
    title: 'Cost of Living Dubai vs Singapore 2025: Expat Comparison',
    slug: 'cost-living-dubai-vs-singapore-expats',
    keyword: 'dubai vs singapore cost',
    searchVolume: 1600,
    cpc: 2.80,
    category: 'Living Costs',
    imagePrompt: 'Split screen Dubai Burj Khalifa and Singapore skyline, comparison infographic style'
  },
  
  // VISA REQUIREMENTS
  {
    title: 'Schengen Visa for Digital Nomads 2025: 90/180 Rule',
    slug: 'schengen-visa-digital-nomads-90-180-rule',
    keyword: 'schengen visa digital nomad',
    searchVolume: 2200,
    cpc: 2.40,
    category: 'Visa Requirements',
    imagePrompt: 'European Union map with Schengen zone highlighted, passport stamps, travel planning'
  },
  {
    title: 'UK Skilled Worker Visa 2025: Salary Requirements',
    slug: 'uk-skilled-worker-visa-salary-requirements',
    keyword: 'uk skilled worker visa',
    searchVolume: 12000,
    cpc: 3.90,
    category: 'Visa Requirements',
    imagePrompt: 'London financial district with Big Ben, professional workers, British flag'
  }
];

// Generate content for each article
function generateArticleContent(template) {
  const blocks = [
    {
      _type: 'block',
      _key: generateKey(),
      style: 'normal',
      children: [{ 
        _type: 'span', 
        text: `This comprehensive guide covers everything you need to know about ${template.keyword} in 2025. With ${template.searchVolume} monthly searches and growing interest, this topic is crucial for international mobility planning.` 
      }]
    },
    {
      _type: 'block',
      _key: generateKey(),
      style: 'h2',
      children: [{ _type: 'span', text: 'Overview and Requirements' }]
    },
    {
      _type: 'block',
      _key: generateKey(),
      style: 'normal',
      children: [{ 
        _type: 'span', 
        text: `The ${template.keyword} programme offers unique advantages for qualified applicants. Recent regulatory changes have made the process more streamlined while maintaining strict compliance standards. Understanding these requirements is essential for successful application.` 
      }]
    },
    {
      _type: 'block',
      _key: generateKey(),
      style: 'h2',
      children: [{ _type: 'span', text: 'Eligibility Criteria' }]
    },
    {
      _type: 'block',
      _key: generateKey(),
      style: 'normal',
      markDefs: [
        {
          _key: 'link1',
          _type: 'link',
          href: 'https://relocation.quest/categories/visa-requirements/'
        }
      ],
      children: [
        { _type: 'span', text: 'Meeting the eligibility criteria is the first step in your application journey. Requirements vary significantly between programmes. For comprehensive visa guides, visit our ' },
        { _type: 'span', text: 'visa requirements section', marks: ['link1'] },
        { _type: 'span', text: '. Key criteria typically include financial thresholds, professional qualifications, and clean background checks.' }
      ]
    },
    {
      _type: 'block',
      _key: generateKey(),
      style: 'h3',
      children: [{ _type: 'span', text: 'Financial Requirements' }]
    },
    {
      _type: 'block',
      _key: generateKey(),
      style: 'normal',
      children: [{ 
        _type: 'span', 
        text: 'Financial requirements form the backbone of most residency programmes. Applicants must demonstrate sufficient funds through bank statements, investment portfolios, or guaranteed income streams. The specific amounts vary by jurisdiction and programme type.' 
      }]
    },
    {
      _type: 'block',
      _key: generateKey(),
      style: 'h2',
      children: [{ _type: 'span', text: 'Application Process' }]
    },
    {
      _type: 'block',
      _key: generateKey(),
      style: 'normal',
      children: [{ 
        _type: 'span', 
        text: 'The application process typically involves multiple stages including document preparation, submission, biometric data collection, and final approval. Processing times range from 2-6 months depending on the programme and current application volumes.' 
      }]
    },
    {
      _type: 'block',
      _key: generateKey(),
      style: 'h3',
      children: [{ _type: 'span', text: 'Required Documentation' }]
    },
    {
      _type: 'block',
      _key: generateKey(),
      style: 'normal',
      children: [{ 
        _type: 'span', 
        text: 'Documentation requirements include passport copies, proof of income, health insurance, criminal background checks, and potentially apostilled documents. Ensure all documents are current and properly translated where necessary.' 
      }]
    },
    {
      _type: 'block',
      _key: generateKey(),
      style: 'h2',
      children: [{ _type: 'span', text: 'Benefits and Advantages' }]
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
        { _type: 'span', text: 'This programme offers numerous benefits including travel freedom, business opportunities, and potential tax advantages. For tax optimization strategies, explore our ' },
        { _type: 'span', text: 'tax planning guides', marks: ['link2'] },
        { _type: 'span', text: '. Many programmes also provide pathways to permanent residency or citizenship.' }
      ]
    },
    {
      _type: 'block',
      _key: generateKey(),
      style: 'h2',
      children: [{ _type: 'span', text: 'Common Mistakes to Avoid' }]
    },
    {
      _type: 'block',
      _key: generateKey(),
      style: 'normal',
      children: [{ 
        _type: 'span', 
        text: 'Common application mistakes include incomplete documentation, missing deadlines, incorrect fee payments, and failure to maintain eligibility requirements. Working with qualified advisors can help avoid these pitfalls and ensure smooth processing.' 
      }]
    },
    {
      _type: 'block',
      _key: generateKey(),
      style: 'h2',
      children: [{ _type: 'span', text: 'Conclusion' }]
    },
    {
      _type: 'block',
      _key: generateKey(),
      style: 'normal',
      markDefs: [
        {
          _key: 'link3',
          _type: 'link',
          href: 'https://relocation.quest/posts'
        }
      ],
      children: [
        { _type: 'span', text: `Successfully navigating the ${template.keyword} process requires careful planning and attention to detail. With proper preparation and understanding of requirements, applicants can achieve their international mobility goals. For more guides, visit our ` },
        { _type: 'span', text: 'complete article library', marks: ['link3'] },
        { _type: 'span', text: '.' }
      ]
    }
  ];

  return blocks;
}

async function generateArticle(template, categories) {
  try {
    console.log(`\n📝 Generating: ${template.title}`);
    
    // Generate hero image
    console.log('  🎨 Creating image...');
    const imageOutput = await replicate.run(
      "black-forest-labs/flux-1.1-pro",
      {
        input: {
          prompt: template.imagePrompt,
          aspect_ratio: "16:9",
          output_format: "webp",
          output_quality: 80
        }
      }
    );

    const imageUrl = Array.isArray(imageOutput) ? imageOutput[0] : imageOutput;
    
    // Upload to Sanity
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    const asset = await sanityClient.assets.upload('image', Buffer.from(buffer), {
      filename: `${template.slug}.webp`
    });

    // Get category reference
    const categoryRef = categories.find(c => c.title === template.category);
    if (!categoryRef) {
      console.log(`  ⚠️ Category not found: ${template.category}`);
      return null;
    }

    // Create document
    const doc = {
      _type: 'post',
      title: template.title,
      slug: { current: template.slug },
      excerpt: `Comprehensive guide to ${template.keyword} with detailed requirements, process, and expert insights for 2025.`,
      body: generateArticleContent(template),
      featuredImage: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: asset._id
        },
        alt: template.title,
        credit: 'Generated by Flux Pro'
      },
      categories: [{
        _type: 'reference',
        _ref: categoryRef._id,
        _key: generateKey()
      }],
      tags: [],
      metaTitle: template.title.substring(0, 60),
      metaDescription: `${template.keyword} guide 2025: requirements, process, benefits, and expert tips for successful application.`,
      focusKeyword: template.keyword,
      searchVolume: template.searchVolume,
      cpc: template.cpc,
      contentTier: template.searchVolume > 3000 ? 'tier1' : template.searchVolume > 1500 ? 'tier2' : 'tier3',
      generationCost: 0.003,
      publishedAt: new Date().toISOString(),
      featured: template.cpc > 10
    };

    const result = await sanityClient.create(doc);
    console.log(`  ✅ Created: ${template.slug}`);
    console.log(`  📊 Volume: ${template.searchVolume} | CPC: $${template.cpc}`);
    
    return result;

  } catch (error) {
    console.error(`  ❌ Failed: ${error.message}`);
    return null;
  }
}

async function batchGenerate() {
  console.log('🚀 Starting batch article generation...');
  console.log(`📊 Target: ${articleTemplates.length} articles`);
  
  // Fetch categories
  const categories = await sanityClient.fetch(`
    *[_type == "category"] {
      _id,
      title
    }
  `);

  let successCount = 0;
  let failCount = 0;
  let totalCost = 0;

  for (const template of articleTemplates) {
    const result = await generateArticle(template, categories);
    
    if (result) {
      successCount++;
      totalCost += 0.003; // $0.003 per image
    } else {
      failCount++;
    }

    // Rate limiting - wait between requests
    await sleep(2000); // 2 second delay
    
    // Progress update every 5 articles
    if ((successCount + failCount) % 5 === 0) {
      console.log(`\n📊 Progress: ${successCount} success, ${failCount} failed`);
      console.log(`💰 Cost so far: $${totalCost.toFixed(2)}`);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('✅ BATCH GENERATION COMPLETE!');
  console.log('='.repeat(50));
  console.log(`📊 Total Articles Created: ${successCount}/${articleTemplates.length}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`💰 Total Cost: $${totalCost.toFixed(2)}`);
  console.log(`📈 Average Cost per Article: $${(totalCost/successCount).toFixed(4)}`);
  
  // Calculate potential monthly value
  const totalSearchVolume = articleTemplates.reduce((sum, t) => sum + t.searchVolume, 0);
  const avgCPC = articleTemplates.reduce((sum, t) => sum + t.cpc, 0) / articleTemplates.length;
  console.log(`\n🎯 Content Value:`);
  console.log(`   Total Search Volume: ${totalSearchVolume.toLocaleString()} searches/month`);
  console.log(`   Average CPC: $${avgCPC.toFixed(2)}`);
  console.log(`   Potential Monthly Value: $${(totalSearchVolume * avgCPC * 0.01).toFixed(0)}`);
}

// Run the batch generation
batchGenerate()
  .then(() => {
    console.log('\n✅ Batch generation complete!');
    console.log('🌐 Check: https://universal-sanity.sanity.studio/');
    console.log('🚀 Deploy: git push to update site');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Batch generation failed:', error);
    process.exit(1);
  });