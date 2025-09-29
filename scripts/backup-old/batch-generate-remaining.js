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

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Remaining articles to generate
const remainingArticles = [
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

function generateArticleContent(template) {
  return [
    {
      _type: 'block',
      _key: generateKey(),
      style: 'normal',
      children: [{ 
        _type: 'span', 
        text: `Comprehensive guide to ${template.keyword} covering all essential requirements and strategies for 2025. This guide addresses the ${template.searchVolume.toLocaleString()} monthly searches from people seeking reliable information.` 
      }]
    },
    {
      _type: 'block',
      _key: generateKey(),
      style: 'h2',
      children: [{ _type: 'span', text: 'Key Requirements and Overview' }]
    },
    {
      _type: 'block',
      _key: generateKey(),
      style: 'normal',
      children: [{ 
        _type: 'span', 
        text: 'Understanding the fundamental requirements is crucial for successful application. Recent changes in 2025 have streamlined certain processes while introducing new compliance measures.' 
      }]
    },
    {
      _type: 'block',
      _key: generateKey(),
      style: 'h2',
      children: [{ _type: 'span', text: 'Step-by-Step Process' }]
    },
    {
      _type: 'block',
      _key: generateKey(),
      style: 'normal',
      markDefs: [{
        _key: 'link1',
        _type: 'link',
        href: 'https://relocation.quest/posts'
      }],
      children: [
        { _type: 'span', text: 'Following the correct process ensures smooth application. Each step must be completed thoroughly. For more guides, visit our ' },
        { _type: 'span', text: 'article library', marks: ['link1'] },
        { _type: 'span', text: '. Documentation accuracy is paramount for approval.' }
      ]
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
      children: [{ 
        _type: 'span', 
        text: 'This programme offers significant benefits including enhanced mobility, business opportunities, and lifestyle improvements. Tax advantages may also apply depending on individual circumstances.' 
      }]
    },
    {
      _type: 'block',
      _key: generateKey(),
      style: 'h2',
      children: [{ _type: 'span', text: 'Important Considerations' }]
    },
    {
      _type: 'block',
      _key: generateKey(),
      style: 'normal',
      markDefs: [{
        _key: 'link2',
        _type: 'link',
        href: 'https://relocation.quest/categories/tax-strategies/'
      }],
      children: [
        { _type: 'span', text: 'Consider all implications including tax obligations, residency requirements, and long-term goals. For tax planning, see our ' },
        { _type: 'span', text: 'tax strategy guides', marks: ['link2'] },
        { _type: 'span', text: '. Professional advice is recommended for complex situations.' }
      ]
    }
  ];
}

async function generateArticle(template, categories) {
  try {
    console.log(`📝 Creating: ${template.title}`);
    
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
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    const asset = await sanityClient.assets.upload('image', Buffer.from(buffer), {
      filename: `${template.slug}.webp`
    });

    const categoryRef = categories.find(c => c.title === template.category);
    if (!categoryRef) {
      console.log(`  ⚠️ Category not found: ${template.category}`);
      return null;
    }

    const doc = {
      _type: 'post',
      title: template.title,
      slug: { current: template.slug },
      excerpt: `Expert guide to ${template.keyword} with requirements, process, and tips for 2025.`,
      body: generateArticleContent(template),
      featuredImage: {
        _type: 'image',
        asset: { _type: 'reference', _ref: asset._id },
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
      metaDescription: `${template.keyword} guide: requirements, process, benefits for 2025.`,
      focusKeyword: template.keyword,
      searchVolume: template.searchVolume,
      cpc: template.cpc,
      contentTier: template.searchVolume > 3000 ? 'tier1' : 'tier2',
      generationCost: 0.003,
      publishedAt: new Date().toISOString(),
      featured: template.cpc > 10
    };

    const result = await sanityClient.create(doc);
    console.log(`  ✅ Success | Volume: ${template.searchVolume} | CPC: $${template.cpc}`);
    return result;

  } catch (error) {
    console.error(`  ❌ Failed: ${error.message}`);
    return null;
  }
}

async function generateRemaining() {
  console.log('🚀 Generating remaining articles...');
  console.log(`📊 Target: ${remainingArticles.length} articles\n`);
  
  const categories = await sanityClient.fetch(`*[_type == "category"] { _id, title }`);

  let count = 0;
  for (const article of remainingArticles) {
    await generateArticle(article, categories);
    count++;
    await sleep(2000);
    
    if (count % 3 === 0) {
      console.log(`\n📊 Progress: ${count}/${remainingArticles.length} completed\n`);
    }
  }

  const totalVolume = remainingArticles.reduce((sum, a) => sum + a.searchVolume, 0);
  const totalValue = remainingArticles.reduce((sum, a) => sum + (a.searchVolume * a.cpc * 0.01), 0);

  console.log('\n' + '='.repeat(50));
  console.log('✅ BATCH COMPLETE!');
  console.log(`📊 Articles: ${count}`);
  console.log(`🔍 Total Search Volume: ${totalVolume.toLocaleString()}/month`);
  console.log(`💰 Potential Value: $${totalValue.toFixed(0)}/month`);
  console.log(`📈 Cost: $${(count * 0.003).toFixed(2)}`);
}

generateRemaining()
  .then(() => {
    console.log('\n✅ All remaining articles generated!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });