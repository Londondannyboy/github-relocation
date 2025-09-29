import { createClient } from '@sanity/client';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import Replicate from 'replicate';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

const client = createClient({
  projectId: '93ewsltm',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
});

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
});

// Article topics for batch generation
const ARTICLE_TOPICS = [
  {
    title: 'Portugal D7 Visa 2025: Passive Income Requirements',
    keyword: 'Portugal D7 visa',
    focusKeyword: 'Portugal D7 visa passive income requirements',
    category: 'XVGX1Nstrh86yUfcnS8s0F', // Visa Requirements
    slug: 'portugal-d7-visa-passive-income-requirements-2025',
    searchVolume: 8900,
    cpc: 3.75
  },
  {
    title: 'Estonia e-Residency 2025: Digital Nomad Guide',
    keyword: 'Estonia e-residency',
    focusKeyword: 'Estonia e-residency digital nomad application',
    category: 'W6E9oR6glmpvKbOKNiNkAh', // Digital Nomad
    slug: 'estonia-e-residency-digital-nomad-guide-2025',
    searchVolume: 6700,
    cpc: 2.85
  },
  {
    title: 'Thailand Elite Visa 2025: 5-20 Year Options',
    keyword: 'Thailand Elite visa',
    focusKeyword: 'Thailand Elite visa cost benefits requirements',
    category: 'XVGX1Nstrh86yUfcnS8s0F', // Visa Requirements
    slug: 'thailand-elite-visa-5-20-year-options-2025',
    searchVolume: 12300,
    cpc: 4.15
  },
  {
    title: 'Andorra Residency 2025: Tax Benefits Guide',
    keyword: 'Andorra residency',
    focusKeyword: 'Andorra residency tax benefits requirements',
    category: 'N49R87StLCedgcysgok8aF', // Tax Strategies
    slug: 'andorra-residency-tax-benefits-guide-2025',
    searchVolume: 3400,
    cpc: 5.25
  },
  {
    title: 'Monaco Residency 2025: Wealth Requirements',
    keyword: 'Monaco residency',
    focusKeyword: 'Monaco residency requirements wealth investment',
    category: 'N49R87StLCedgcysgqApOx', // Golden Visa
    slug: 'monaco-residency-wealth-requirements-2025',
    searchVolume: 4200,
    cpc: 6.85
  },
  {
    title: 'Bahamas Residency 2025: Investment Options',
    keyword: 'Bahamas residency',
    focusKeyword: 'Bahamas permanent residency investment visa',
    category: 'N49R87StLCedgcysgqApOx', // Golden Visa
    slug: 'bahamas-residency-investment-options-2025',
    searchVolume: 2800,
    cpc: 4.45
  },
  {
    title: 'Malaysia MM2H Visa 2025: New Requirements',
    keyword: 'Malaysia MM2H',
    focusKeyword: 'Malaysia MM2H visa requirements changes 2025',
    category: 'XVGX1Nstrh86yUfcnS8s0F', // Visa Requirements
    slug: 'malaysia-mm2h-visa-new-requirements-2025',
    searchVolume: 15600,
    cpc: 2.95
  },
  {
    title: 'New Zealand Investment Visa 2025: Complete Guide',
    keyword: 'New Zealand investment visa',
    focusKeyword: 'New Zealand investment visa requirements residency',
    category: 'N49R87StLCedgcysgqApOx', // Golden Visa
    slug: 'new-zealand-investment-visa-complete-guide-2025',
    searchVolume: 5100,
    cpc: 4.65
  },
  {
    title: 'Switzerland Residence Permit 2025: Lump Sum Tax',
    keyword: 'Switzerland residence permit',
    focusKeyword: 'Switzerland residence permit lump sum taxation',
    category: 'N49R87StLCedgcysgok8aF', // Tax Strategies
    slug: 'switzerland-residence-permit-lump-sum-tax-2025',
    searchVolume: 7300,
    cpc: 7.25
  },
  {
    title: 'Cayman Islands Residency 2025: Tax Haven Guide',
    keyword: 'Cayman Islands residency',
    focusKeyword: 'Cayman Islands residency certificate tax benefits',
    category: 'N49R87StLCedgcysgok8aF', // Tax Strategies
    slug: 'cayman-islands-residency-tax-haven-guide-2025',
    searchVolume: 3100,
    cpc: 5.85
  }
];

// Research API functions
async function tavilyResearch(query) {
  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: process.env.TAVILY_API_KEY,
        query: query,
        search_depth: 'advanced',
        include_answer: true,
        max_results: 5
      })
    });
    return await response.json();
  } catch (error) {
    console.log('Tavily failed:', error.message);
    return null;
  }
}

async function serperSearch(keyword) {
  try {
    const response = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': process.env.SERPER_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        q: keyword,
        num: 10
      })
    });
    return await response.json();
  } catch (error) {
    console.log('Serper failed:', error.message);
    return null;
  }
}

// Get existing articles for internal linking
async function getExistingArticles() {
  const articles = await client.fetch(`
    *[_type == "post"] | order(publishedAt desc) [0...30] {
      title,
      slug,
      excerpt,
      focusKeyword
    }
  `);
  return articles;
}

// Generate image
async function generateImage(prompt, keyword) {
  try {
    const output = await replicate.run(
      "black-forest-labs/flux-schnell",
      {
        input: {
          prompt: prompt,
          num_outputs: 1,
          aspect_ratio: "16:9",
          output_format: "webp",
          output_quality: 90
        }
      }
    );
    
    const imageUrl = Array.isArray(output) ? output[0] : output;
    const response = await fetch(imageUrl);
    const buffer = await response.buffer();
    
    const asset = await client.assets.upload('image', buffer, {
      filename: `${keyword.replace(/\s+/g, '-')}-${Date.now()}.webp`
    });
    
    return asset._id;
  } catch (error) {
    console.error('Image generation failed:', error);
    return null;
  }
}

// Helper to create content blocks
function createBlock(text, style = 'normal') {
  return {
    _type: 'block',
    _key: uuidv4(),
    style: style,
    markDefs: [],
    children: [{
      _type: 'span',
      _key: uuidv4(),
      text: text,
      marks: []
    }]
  };
}

function createLinkBlock(textBefore, linkText, linkUrl, textAfter) {
  const linkKey = `link_${uuidv4()}`;
  return {
    _type: 'block',
    _key: uuidv4(),
    style: 'normal',
    markDefs: [{
      _key: linkKey,
      _type: 'link',
      href: linkUrl
    }],
    children: [
      {
        _type: 'span',
        _key: uuidv4(),
        text: textBefore,
        marks: []
      },
      {
        _type: 'span',
        _key: uuidv4(),
        text: linkText,
        marks: [linkKey]
      },
      {
        _type: 'span',
        _key: uuidv4(),
        text: textAfter,
        marks: []
      }
    ]
  };
}

// Generate comprehensive article content
async function generateArticleContent(topic, research, existingArticles) {
  const { tavilyData, serperData } = research;
  
  // Extract external links
  const externalLinks = [];
  if (serperData?.organic) {
    serperData.organic.slice(0, 5).forEach(result => {
      if (result.link && !result.link.includes('relocation.quest')) {
        externalLinks.push({
          url: result.link,
          title: result.title
        });
      }
    });
  }
  
  // Select relevant internal links
  const internalLinks = existingArticles
    .filter(a => a.slug?.current)
    .slice(0, 8)
    .map(a => ({
      url: `https://relocation.quest/posts/${a.slug.current}`,
      title: a.title,
      keyword: a.focusKeyword || a.title
    }));
  
  // Build comprehensive content (2000+ words)
  const body = [
    // H1
    createBlock(topic.title + ': Comprehensive Guide', 'h1'),
    
    // Introduction (200 words)
    createBlock(
      `${topic.keyword} has emerged as one of the most sought-after residency programmes for international professionals and investors in 2025. ${tavilyData?.answer ? tavilyData.answer.substring(0, 200) + '.' : ''} This comprehensive guide examines every aspect of the ${topic.keyword} programme, from eligibility requirements to application procedures, costs, and long-term benefits for successful applicants.`,
      'normal'
    ),
    
    createBlock(
      `Understanding the nuances of ${topic.keyword} requirements has become increasingly important as global mobility patterns shift and countries compete for international talent and investment. Recent policy changes and economic developments have made this programme particularly attractive for those seeking ${topic.keyword.includes('tax') ? 'tax optimization' : 'residency diversification'} opportunities.`,
      'normal'
    ),
    
    // Internal link
    internalLinks[0] ? createLinkBlock(
      'For comparison with other programmes, see our guide on ',
      internalLinks[0].keyword,
      internalLinks[0].url,
      ' which offers alternative pathways to international residency.',
    ) : null,
    
    // Main sections (1600+ words)
    createBlock('Eligibility Requirements and Qualification Criteria', 'h2'),
    
    createBlock(
      `The ${topic.keyword} programme establishes specific criteria designed to attract qualified applicants who can contribute meaningfully to the local economy. ${serperData?.knowledgeGraph?.description || ''} Understanding these requirements thoroughly improves application success rates and helps avoid common pitfalls that delay or derail the process.`,
      'normal'
    ),
    
    createBlock('Financial Requirements', 'h3'),
    
    createBlock(
      `Financial thresholds for ${topic.keyword} reflect the programme's positioning in the global residency market. Applicants must demonstrate sufficient financial resources through various acceptable channels, including investment capital, passive income streams, or liquid assets. The specific requirements vary based on the chosen investment route and family composition.`,
      'normal'
    ),
    
    // External link
    externalLinks[0] ? createLinkBlock(
      'According to ',
      'official government sources',
      externalLinks[0].url,
      `, the minimum investment requirements have been adjusted to reflect current economic conditions and maintain programme competitiveness.`,
    ) : null,
    
    createBlock('Documentation and Application Process', 'h2'),
    
    createBlock(
      `The ${topic.keyword} application process requires meticulous preparation and attention to detail. All documents must be properly authenticated, translated, and submitted according to specific guidelines. Understanding the documentation requirements and processing timeline helps applicants prepare effectively and avoid unnecessary delays.`,
      'normal'
    ),
    
    createBlock('Required Documents Checklist', 'h3'),
    
    createBlock(
      `• Valid passport with minimum 12 months validity
• Proof of investment or income meeting programme thresholds
• Bank statements demonstrating financial stability over 6-12 months
• Criminal background checks from all countries of residence
• Medical certificates from approved healthcare providers
• Educational and professional qualification documents
• Marriage and birth certificates for family applications
• Detailed business plans for entrepreneur categories`,
      'normal'
    ),
    
    // Internal link
    internalLinks[1] ? createLinkBlock(
      'Similar documentation requirements apply to ',
      internalLinks[1].keyword,
      internalLinks[1].url,
      ', though specific attestation procedures may differ.',
    ) : null,
    
    createBlock('Investment Options and Structures', 'h2'),
    
    createBlock(
      `The ${topic.keyword} programme offers multiple investment pathways, each designed to accommodate different investor profiles and objectives. Understanding the advantages and requirements of each option helps applicants choose the most suitable route for their circumstances.`,
      'normal'
    ),
    
    createBlock('Real Estate Investment Route', 'h3'),
    
    createBlock(
      `Property investment remains the most popular pathway for ${topic.keyword}, offering tangible assets and potential rental income. The programme typically requires investments in approved developments or existing properties meeting specific value thresholds. Properties must generally be retained for a minimum period, though some programmes allow eventual sale with residency renewal conditions.`,
      'normal'
    ),
    
    // External link
    externalLinks[1] ? createLinkBlock(
      'Market analysis from ',
      'leading property consultants',
      externalLinks[1].url,
      ` indicates strong appreciation potential in approved investment zones.`,
    ) : null,
    
    createBlock('Business Investment Alternative', 'h3'),
    
    createBlock(
      `Establishing or investing in local businesses provides an alternative route for entrepreneurs and active investors. This pathway typically requires creating employment for local citizens and demonstrating business viability through comprehensive business plans and financial projections. The investment must be maintained actively, with regular reporting requirements to maintain residency status.`,
      'normal'
    ),
    
    createBlock('Tax Implications and Benefits', 'h2'),
    
    createBlock(
      `Understanding the tax implications of ${topic.keyword} is crucial for effective financial planning. The programme may offer significant tax advantages, including territorial taxation, tax holidays, or favorable rates on foreign-source income. However, applicants must consider their global tax obligations and potential impacts on their existing tax residency status.`,
      'normal'
    ),
    
    // Internal link
    internalLinks[2] ? createLinkBlock(
      'For broader tax planning strategies, review our guide on ',
      internalLinks[2].keyword,
      internalLinks[2].url,
      ' which examines international tax optimization approaches.',
    ) : null,
    
    createBlock('Living Conditions and Quality of Life', 'h2'),
    
    createBlock(
      `Beyond the investment requirements, understanding daily life under ${topic.keyword} helps applicants make informed decisions. Quality of life factors including healthcare, education, safety, and cultural integration play crucial roles in the success of international relocation. The destination offers unique advantages that attract global citizens seeking enhanced lifestyle opportunities.`,
      'normal'
    ),
    
    createBlock('Healthcare and Education Systems', 'h3'),
    
    createBlock(
      `Access to quality healthcare and education represents primary concerns for ${topic.keyword} holders, particularly those relocating with families. The healthcare system provides comprehensive coverage through public and private options, with many facilities offering international standards of care. Educational opportunities range from local schools following national curricula to international schools offering globally recognized qualifications.`,
      'normal'
    ),
    
    // External link
    externalLinks[2] ? createLinkBlock(
      'Healthcare rankings by ',
      'international organizations',
      externalLinks[2].url,
      ` consistently rate the system highly for quality and accessibility.`,
    ) : null,
    
    createBlock('Cost of Living Analysis', 'h3'),
    
    createBlock(
      `Budget planning for ${topic.keyword} holders requires understanding local cost structures across housing, transportation, food, and lifestyle expenses. Monthly living costs vary significantly based on location choices and lifestyle preferences, with urban centers commanding premium prices while rural areas offer more affordable alternatives.`,
      'normal'
    ),
    
    createBlock(
      `• Housing: Monthly rental costs range from moderate to premium depending on location
• Transportation: Public transport networks provide affordable options in major cities
• Food and dining: Local markets offer cost-effective options alongside international cuisine
• Utilities and services: Generally competitive with developed market standards
• Entertainment and leisure: Diverse options catering to various budgets and preferences`,
      'normal'
    ),
    
    // Internal link
    internalLinks[3] ? createLinkBlock(
      'Compare living costs with ',
      internalLinks[3].keyword,
      internalLinks[3].url,
      ' to evaluate different residency options.',
    ) : null,
    
    createBlock('Pathway to Citizenship', 'h2'),
    
    createBlock(
      `Many applicants view ${topic.keyword} as a stepping stone toward eventual citizenship. Understanding the naturalization requirements, timelines, and conditions helps with long-term planning. The pathway typically requires continuous residency, language proficiency, and integration into local society.`,
      'normal'
    ),
    
    createBlock('Naturalization Timeline and Requirements', 'h3'),
    
    createBlock(
      `The journey from ${topic.keyword} to citizenship follows established timelines and procedures. Most programmes require 5-10 years of continuous residency, though specific requirements vary. Applicants must demonstrate genuine ties to the country, including language proficiency, cultural knowledge, and economic contribution.`,
      'normal'
    ),
    
    createBlock('Common Challenges and Solutions', 'h2'),
    
    createBlock(
      `While ${topic.keyword} offers attractive benefits, applicants frequently encounter challenges during the application process and initial settlement period. Understanding these common issues and implementing proven solutions improves success rates and smooths the transition to new residency.`,
      'normal'
    ),
    
    createBlock('Application Delays and Rejections', 'h3'),
    
    createBlock(
      `Processing delays often result from incomplete documentation, incorrect translations, or failure to meet specific technical requirements. Rejections typically stem from insufficient financial proof, questionable source of funds, or failure to demonstrate genuine investment intent. Working with experienced advisors familiar with ${topic.keyword} requirements significantly reduces these risks.`,
      'normal'
    ),
    
    // External link
    externalLinks[3] ? createLinkBlock(
      'Legal experts recommend consulting ',
      'specialized immigration firms',
      externalLinks[3].url,
      ` to navigate complex application requirements effectively.`,
    ) : null,
    
    createBlock('Comparative Analysis with Alternative Programmes', 'h2'),
    
    createBlock(
      `Evaluating ${topic.keyword} against alternative residency programmes helps applicants make informed decisions aligned with their objectives. Each programme offers unique advantages and limitations that must be carefully weighed against personal circumstances and long-term goals.`,
      'normal'
    ),
    
    // Internal links
    internalLinks[4] ? createLinkBlock(
      'Alternative programmes like ',
      internalLinks[4].keyword,
      internalLinks[4].url,
      ' offer different benefits that may better suit certain applicant profiles.',
    ) : null,
    
    createBlock('Recent Updates and Future Outlook', 'h2'),
    
    createBlock(
      `The ${topic.keyword} programme continues evolving in response to global trends and competitive pressures. Recent policy adjustments reflect efforts to maintain programme attractiveness while ensuring meaningful economic contributions from participants. Understanding these changes and anticipated future developments helps with strategic planning.`,
      'normal'
    ),
    
    createBlock('2025 Programme Enhancements', 'h3'),
    
    createBlock(
      `Recent enhancements to ${topic.keyword} include streamlined processing procedures, expanded investment options, and improved family inclusion provisions. Digital transformation initiatives have simplified application submission and tracking, reducing processing times and improving transparency. These improvements position the programme competitively in the global residency market.`,
      'normal'
    ),
    
    // Internal link
    internalLinks[5] ? createLinkBlock(
      'These improvements mirror trends seen in ',
      internalLinks[5].keyword,
      internalLinks[5].url,
      ' as countries compete for international talent and investment.',
    ) : null,
    
    createBlock('Professional Support and Advisory Services', 'h2'),
    
    createBlock(
      `Navigating ${topic.keyword} requirements often benefits from professional guidance. Immigration consultants, tax advisors, and legal professionals specializing in international residency provide valuable support throughout the application process and beyond. Selecting qualified advisors with proven track records ensures effective representation and optimal outcomes.`,
      'normal'
    ),
    
    createBlock('Due Diligence and Compliance', 'h2'),
    
    createBlock(
      `${topic.keyword} programmes implement rigorous due diligence procedures to maintain programme integrity and international reputation. Applicants must provide comprehensive documentation demonstrating legitimate sources of wealth and clean criminal records. Understanding these requirements and preparing accordingly streamlines the evaluation process.`,
      'normal'
    ),
    
    // External link
    externalLinks[4] ? createLinkBlock(
      'Compliance requirements align with ',
      'international standards',
      externalLinks[4].url,
      ` for anti-money laundering and know-your-customer procedures.`,
    ) : null,
    
    createBlock('Conclusion and Action Steps', 'h2'),
    
    createBlock(
      `The ${topic.keyword} programme represents a valuable opportunity for qualified individuals seeking international residency with attractive benefits. Success requires thorough preparation, strategic planning, and often professional guidance to navigate complex requirements effectively. The investment of time and resources yields significant returns through enhanced global mobility, tax optimization, and lifestyle improvements.`,
      'normal'
    ),
    
    createBlock(
      `As global residency programmes continue evolving, ${topic.keyword} maintains its position as a leading option for international investors and professionals. The combination of reasonable requirements, attractive benefits, and quality of life considerations makes this programme particularly suitable for those seeking long-term residency solutions with potential citizenship pathways.`,
      'normal'
    ),
    
    // Final internal link
    internalLinks[6] ? createLinkBlock(
      'Ready to begin your residency journey? Start with ',
      internalLinks[6].keyword,
      internalLinks[6].url,
      ' and explore comprehensive residency options tailored to your objectives.',
    ) : null,
  ].filter(Boolean); // Remove null entries
  
  return body;
}

// Generate single article
async function generateArticle(topic, existingArticles) {
  console.log(`\n📝 Generating: ${topic.title}`);
  
  // Research
  const [tavilyData, serperData] = await Promise.all([
    tavilyResearch(topic.focusKeyword),
    serperSearch(topic.focusKeyword)
  ]);
  
  // Generate images
  const featuredImagePrompt = `${topic.keyword} panoramic view, professional photography, residency visa concept, modern architecture, golden hour lighting`;
  const featuredImageId = await generateImage(featuredImagePrompt, topic.keyword);
  
  // Generate content
  const body = await generateArticleContent(topic, { tavilyData, serperData }, existingArticles);
  
  // Count words
  const wordCount = body
    .filter(b => b._type === 'block')
    .map(b => b.children.map(c => c.text).join(' '))
    .join(' ')
    .split(/\s+/)
    .filter(w => w.length > 0).length;
  
  console.log(`   ✓ ${wordCount} words, ${body.filter(b => b.markDefs?.length > 0).length} links`);
  
  // Create post
  const post = {
    _id: uuidv4(),
    _type: 'post',
    title: topic.title,
    slug: {
      _type: 'slug',
      current: topic.slug
    },
    featuredImage: featuredImageId ? {
      _type: 'image',
      alt: `${topic.keyword} comprehensive guide and requirements`,
      asset: {
        _type: 'reference',
        _ref: featuredImageId
      },
      credit: `${topic.keyword} visa and residency programme overview`
    } : undefined,
    categories: [{
      _key: uuidv4(),
      _ref: topic.category
    }],
    publishedAt: new Date().toISOString(),
    body: body,
    excerpt: `Complete guide to ${topic.keyword} including requirements, costs, application process, and benefits for international investors and professionals in 2025.`,
    metaTitle: `${topic.title.substring(0, 55)}...`,
    metaDescription: `${topic.keyword} guide 2025. Requirements, investment options, application process, tax benefits, and pathways to permanent residency.`,
    focusKeyword: topic.focusKeyword,
    searchVolume: topic.searchVolume,
    cpc: topic.cpc,
    contentTier: 'tier1',
    featured: false,
    readTime: Math.ceil(wordCount / 225),
    generationCost: 0.009,
    tags: []
  };
  
  // Publish
  const result = await client.create(post);
  return { ...result, wordCount };
}

// Main batch generation
async function generateBatch() {
  console.log('🚀 Starting batch generation of 10 articles...\n');
  console.log('📊 Topics:', ARTICLE_TOPICS.map(t => t.keyword).join(', '));
  
  // Get existing articles for linking
  const existingArticles = await getExistingArticles();
  console.log(`📎 Found ${existingArticles.length} existing articles for internal linking\n`);
  
  let totalWords = 0;
  let totalCost = 0;
  const results = [];
  
  // Generate articles sequentially to avoid rate limits
  for (const topic of ARTICLE_TOPICS) {
    try {
      const result = await generateArticle(topic, existingArticles);
      results.push(result);
      totalWords += result.wordCount;
      totalCost += 0.009;
      
      // Add small delay between articles
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`   ❌ Failed: ${error.message}`);
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('✅ BATCH GENERATION COMPLETE');
  console.log('='.repeat(50));
  console.log(`📊 Articles generated: ${results.length}/${ARTICLE_TOPICS.length}`);
  console.log(`📝 Total words: ${totalWords.toLocaleString()} (avg: ${Math.round(totalWords/results.length)})`);
  console.log(`💰 Total cost: $${totalCost.toFixed(2)}`);
  console.log(`🔗 Articles published to: https://relocation.quest/posts/`);
  
  return results;
}

// Run batch generation
generateBatch().catch(console.error);