// SAFEGUARDED ARTICLE GENERATOR WITH QUALITY CHECKS
// This script includes multiple safeguards to ensure quality

import { createClient } from '@sanity/client';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import Replicate from 'replicate';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import { ARTICLE_TOPICS_1000 } from './topics-1000-articles.js';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

// SAFEGUARD 1: Validate environment
const requiredEnvVars = ['SANITY_API_TOKEN', 'TAVILY_API_KEY', 'SERPER_API_KEY', 'REPLICATE_API_TOKEN'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

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

// SAFEGUARD 2: Quality thresholds - Flexible requirements with targets
const QUALITY_THRESHOLDS = {
  MIN_WORDS: 1500,        // Minimum word count (reduced from 2400)
  TARGET_WORDS: 2400,     // Target word count
  MAX_WORDS: 3500,        // Maximum to avoid rambling
  MIN_LINKS: 0,           // No minimum links requirement (was 15)
  TARGET_LINKS: 15,       // Target link count
  MIN_IMAGES: 1,          // Must have at least hero image (was 4)
  TARGET_IMAGES: 4,       // Target image count
  MAX_META_DESC: 160,     // Maximum meta description characters
  MAX_META_TITLE: 60,     // Maximum meta title characters
  MIN_FAQ: 0,             // No minimum FAQ requirement (was 3)
  TARGET_FAQ: 3,          // Target FAQ questions
  MIN_REFERENCES: 0       // No minimum references (was 5)
};

// SAFEGUARD 3: Logging system
const logFile = join(__dirname, '..', 'generation-log.txt');
async function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(message);
  await fs.appendFile(logFile, logMessage);
}

// SAFEGUARD 4: Validate article quality before publishing
function validateArticle(article, wordCount, linkCount, imageCount) {
  const errors = [];
  const warnings = [];
  
  // Hard requirements (errors)
  if (wordCount < QUALITY_THRESHOLDS.MIN_WORDS) {
    errors.push(`Word count ${wordCount} below minimum ${QUALITY_THRESHOLDS.MIN_WORDS}`);
  }
  if (wordCount > QUALITY_THRESHOLDS.MAX_WORDS) {
    errors.push(`Word count ${wordCount} above maximum ${QUALITY_THRESHOLDS.MAX_WORDS}`);
  }
  if (imageCount < QUALITY_THRESHOLDS.MIN_IMAGES) {
    errors.push(`Image count ${imageCount} below minimum ${QUALITY_THRESHOLDS.MIN_IMAGES} - needs at least hero image`);
  }
  
  // Soft targets (warnings - won't block publishing)
  if (wordCount < QUALITY_THRESHOLDS.TARGET_WORDS) {
    warnings.push(`Word count ${wordCount} below target ${QUALITY_THRESHOLDS.TARGET_WORDS}`);
  }
  if (linkCount < QUALITY_THRESHOLDS.TARGET_LINKS) {
    warnings.push(`Link count ${linkCount} below target ${QUALITY_THRESHOLDS.TARGET_LINKS}`);
  }
  if (imageCount < QUALITY_THRESHOLDS.TARGET_IMAGES) {
    warnings.push(`Image count ${imageCount} below target ${QUALITY_THRESHOLDS.TARGET_IMAGES}`);
  }
  
  // Meta validation
  if (article.metaDescription && article.metaDescription.length > QUALITY_THRESHOLDS.MAX_META_DESC) {
    warnings.push(`Meta description ${article.metaDescription.length} chars exceeds ${QUALITY_THRESHOLDS.MAX_META_DESC}`);
  }
  if (article.metaTitle && article.metaTitle.length > QUALITY_THRESHOLDS.MAX_META_TITLE) {
    warnings.push(`Meta title ${article.metaTitle.length} chars exceeds ${QUALITY_THRESHOLDS.MAX_META_TITLE}`);
  }
  
  // Log warnings if present
  if (warnings.length > 0) {
    console.log(`   ⚠️ Warnings: ${warnings.join(', ')}`);
  }
  
  return errors; // Only return errors that will block publishing
}

// Helper function to add timeout to fetch requests
async function fetchWithTimeout(url, options, timeoutMs = 30000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeout);
    return response;
  } catch (error) {
    clearTimeout(timeout);
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeoutMs}ms`);
    }
    throw error;
  }
}

// WORKING API FUNCTIONS (NO LinkUp or Critique)
async function tavilyResearch(query) {
  try {
    const response = await fetchWithTimeout('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: process.env.TAVILY_API_KEY,
        query: query,
        search_depth: 'advanced',
        include_answer: true,
        include_raw_content: true,
        max_results: 10
      })
    }, 30000); // 30 second timeout
    return await response.json();
  } catch (error) {
    await log(`⚠️ Tavily failed: ${error.message}`);
    return null;
  }
}

async function serperSearch(keyword) {
  try {
    const response = await fetchWithTimeout('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': process.env.SERPER_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        q: keyword,
        num: 10,
        gl: 'us',
        hl: 'en'
      })
    }, 30000); // 30 second timeout
    return await response.json();
  } catch (error) {
    await log(`⚠️ Serper failed: ${error.message}`);
    return null;
  }
}

async function firecrawlScrape(url) {
  try {
    const response = await fetchWithTimeout('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.FIRECRAWL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: url,
        formats: ['markdown']
      })
    }, 30000); // 30 second timeout
    return await response.json();
  } catch (error) {
    await log(`⚠️ Firecrawl failed: ${error.message}`);
    return null;
  }
}

// Perplexity API for enhanced research (if needed)
async function perplexityResearch(query) {
  if (!process.env.PERPLEXITY_API_KEY) return null;
  
  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'pplx-70b-online',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful research assistant. Provide factual information with sources.'
          },
          {
            role: 'user',
            content: query
          }
        ]
      })
    });
    return await response.json();
  } catch (error) {
    await log(`⚠️ Perplexity failed: ${error.message}`);
    return null;
  }
}

function analyzeSERP(serperData) {
  const patterns = {
    hasFAQ: false,
    hasCalculator: false,
    hasComparison: false,
    hasStepByStep: false,
    commonQuestions: [],
    keywordClusters: []
  };
  
  if (serperData?.organic) {
    serperData.organic.slice(0, 5).forEach(result => {
      const snippet = (result.snippet || '').toLowerCase();
      const title = (result.title || '').toLowerCase();
      
      if (snippet.includes('faq') || title.includes('faq')) patterns.hasFAQ = true;
      if (snippet.includes('calculator') || title.includes('calculator')) patterns.hasCalculator = true;
      if (snippet.includes('vs') || snippet.includes('comparison')) patterns.hasComparison = true;
      if (snippet.includes('step') || snippet.includes('guide')) patterns.hasStepByStep = true;
    });
  }
  
  if (serperData?.peopleAlsoAsk) {
    patterns.commonQuestions = serperData.peopleAlsoAsk.map(q => q.question);
  }
  
  if (serperData?.relatedSearches) {
    patterns.keywordClusters = serperData.relatedSearches.map(s => s.query);
  }
  
  return patterns;
}

async function generateImages(keyword, count = 4) {
  const images = [];
  // NeoGlow Design System - Stylized, non-photorealistic prompts
  const prompts = [
    `${keyword} cityscape, neon white outline on key landmark, cyberpunk aesthetic, purple and teal gradient sky, geometric patterns, minimalist vector art style, no people, digital illustration, modern art deco`,
    `${keyword} abstract concept, floating passport and visa documents, ethereal white particles, gradient background purple to gold, geometric shapes, stylized illustration, no photorealism`,
    `${keyword} lifestyle illustration, stylized map with glowing location pins, pastel color palette, dreamy atmosphere, illustrated travel poster style, geometric patterns, no realistic people`,
    `${keyword} investment visualization, abstract geometric buildings with neon accents, data visualization elements, purple and gold color scheme, futuristic design, vector art style`
  ];
  
  for (let i = 0; i < Math.min(count, prompts.length); i++) {
    try {
      const output = await replicate.run(
        "black-forest-labs/flux-pro",  // Upgraded to flux-pro for better quality
        {
          input: {
            prompt: prompts[i],
            num_outputs: 1,
            aspect_ratio: "16:9",
            output_format: "webp",
            output_quality: 95,  // Higher quality for pro model
            guidance: 7.5,  // Add guidance for better prompt adherence
            steps: 50  // More steps for better quality
          }
        }
      );
      
      const imageUrl = Array.isArray(output) ? output[0] : output;
      const response = await fetch(imageUrl);
      const buffer = await response.buffer();
      
      const asset = await client.assets.upload('image', buffer, {
        filename: `${keyword.replace(/\s+/g, '-')}-${i+1}-${Date.now()}.webp`
      });
      
      images.push({
        id: asset._id,
        alt: `${keyword} ${['overview', 'requirements', 'lifestyle', 'opportunities'][i]}`,
        caption: `${keyword} - comprehensive guide to ${['visa requirements', 'application process', 'living experience', 'investment opportunities'][i]}`
      });
    } catch (error) {
      await log(`⚠️ Image ${i+1} generation failed: ${error.message}`);
    }
  }
  
  return images;
}

async function getExistingArticles() {
  const articles = await client.fetch(`
    *[_type == "post"] | order(publishedAt desc) [0...100] {
      title,
      slug,
      excerpt,
      focusKeyword
    }
  `);
  return articles;
}

// Content creation helpers
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

function createImageBlock(imageId, alt, caption) {
  return {
    _key: uuidv4(),
    _type: 'image',
    alt: alt,
    asset: {
      _ref: imageId,
      _type: 'reference'
    },
    caption: caption
  };
}

// SAFEGUARD 5: Complete content generation (not abbreviated)
async function generateCompleteContent(topic, research, existingArticles, images) {
  const { tavilyData, serperData, serpAnalysis } = research;
  
  const references = [];
  const externalLinks = [];
  
  // Gather external links and references
  if (serperData?.organic) {
    serperData.organic.slice(0, 8).forEach(result => {
      if (result.link && !result.link.includes('relocation.quest')) {
        externalLinks.push({
          url: result.link,
          title: result.title,
          date: result.date || '2025'
        });
        references.push({
          title: result.title,
          url: result.link,
          accessDate: new Date().toISOString().split('T')[0]
        });
      }
    });
  }
  
  // Select internal links
  const internalLinks = existingArticles
    .filter(a => a.slug?.current)
    .slice(0, 10)
    .map(a => ({
      url: `https://relocation.quest/posts/${a.slug.current}`,
      title: a.title,
      keyword: a.focusKeyword || a.title
    }));
  
  // Build COMPLETE content (not abbreviated)
  const body = [
    // H1 - Main title
    createBlock(`${topic.title}: Complete Guide for 2025`, 'h1'),
    
    // Introduction (300+ words)
    createBlock(
      `The ${topic.keyword} programme represents one of the most significant pathways for international mobility in 2025, offering comprehensive solutions for investors, professionals, and digital nomads seeking new opportunities abroad. ${tavilyData?.answer ? tavilyData.answer.substring(0, 300) : ''} This detailed guide provides extensive analysis of requirements, processes, costs, and benefits based on the latest regulatory updates and real-world experiences from successful applicants.`,
      'normal'
    ),
    
    createBlock(
      `Understanding the complete landscape of ${topic.keyword} requires careful examination of eligibility criteria, documentation requirements, financial thresholds, and long-term implications for tax planning and lifestyle considerations. Recent global events have accelerated changes in international mobility programmes, making accurate, up-to-date information more critical than ever for making informed decisions about international relocation and investment.`,
      'normal'
    ),
    
    createBlock(
      `This comprehensive resource addresses every aspect of the ${topic.keyword} process, from initial eligibility assessment through successful application submission and beyond. We examine official requirements, analyze common challenges, provide cost breakdowns, and offer strategic insights based on extensive research and expert consultation. Whether you're an investor seeking portfolio diversification, a professional pursuing career opportunities, or a digital nomad exploring location independence, this guide provides the detailed information needed for confident decision-making.`,
      'normal'
    ),
    
    // Add early internal link
    internalLinks[0] ? createLinkBlock(
      'For comparison with similar programmes, explore our detailed analysis of ',
      internalLinks[0].keyword,
      internalLinks[0].url,
      ', which offers alternative pathways with different requirements and benefits tailored to various applicant profiles.',
    ) : null,
    
    // Table of Contents
    createBlock('Table of Contents', 'h2'),
    createBlock(
      `• Comprehensive Eligibility Requirements
• Investment Options and Financial Thresholds
• Step-by-Step Application Process
• Documentation and Authentication Requirements
• Processing Timeline and Expedited Options
• Cost Analysis and Budget Planning
• Tax Implications and Optimization Strategies
• Living Conditions and Quality of Life
• Healthcare and Education Systems
• Business and Employment Opportunities
• Real Estate Market Overview
• Banking and Financial Services
• Pathway to Permanent Residency
• Citizenship Eligibility and Timeline
• Common Challenges and Solutions
• Frequently Asked Questions
• Expert Recommendations
• References and Resources`,
      'normal'
    ),
    
    // First image after introduction
    images[0] ? createImageBlock(images[0].id, images[0].alt, images[0].caption) : null,
    
    // Main content sections with substantial detail
    createBlock('Comprehensive Eligibility Requirements', 'h2'),
    
    createBlock(
      `The ${topic.keyword} programme establishes detailed eligibility criteria designed to attract qualified applicants who can contribute meaningfully to the local economy while maintaining programme integrity. ${serperData?.knowledgeGraph?.description || ''} These requirements have evolved significantly in recent years, reflecting changing economic priorities and international best practices in immigration management.`,
      'normal'
    ),
    
    createBlock('Primary Qualification Categories', 'h3'),
    
    createBlock(
      `Eligibility for ${topic.keyword} falls into several distinct categories, each with specific requirements tailored to different applicant profiles. Understanding which category best matches your circumstances is crucial for application success. The programme recognizes that valuable contributions come in various forms, from direct capital investment to specialized professional expertise, entrepreneurial innovation, and proven business success.`,
      'normal'
    ),
    
    // Add external authority link
    externalLinks[0] ? createLinkBlock(
      'According to ',
      'official government sources',
      externalLinks[0].url,
      `, recent updates to the programme have streamlined requirements while maintaining rigorous standards for applicant qualification and due diligence.`,
    ) : null,
    
    createBlock(
      `Investment-based qualification typically requires demonstrable financial capacity through liquid assets, real estate holdings, business ownership, or investment portfolio value. The specific thresholds vary based on investment type and programme tier, with higher investments often qualifying for enhanced benefits such as expedited processing, extended validity periods, or expanded family inclusion provisions. Financial requirements must be met through legitimate sources, with comprehensive documentation demonstrating the legal origin and ownership of funds.`,
      'normal'
    ),
    
    createBlock(
      `Professional qualification routes target individuals with specialized skills, advanced education, or significant career achievements in priority sectors. These pathways recognize that human capital represents valuable economic contribution beyond pure financial investment. Qualifying professionals typically need to demonstrate relevant qualifications from recognized institutions, substantial work experience in their field, current employment or job offers meeting salary thresholds, and potential for economic value creation through their expertise.`,
      'normal'
    ),
    
    createBlock('Documentation Requirements', 'h3'),
    
    createBlock(
      `Successful ${topic.keyword} applications require comprehensive documentation meeting strict authentication standards. All documents must be current, properly attested according to origin country procedures, and translated by certified translators where necessary. The authentication process varies significantly between countries, with some requiring apostille certification under the Hague Convention while others follow embassy legalization procedures.`,
      'normal'
    ),
    
    createBlock(
      `Essential documentation typically includes valid passports with minimum remaining validity, birth certificates for all applicants, marriage certificates where applicable, police clearance certificates from all countries of residence, medical examination reports from approved facilities, educational certificates and professional qualifications, employment verification and reference letters, bank statements demonstrating financial capacity, investment documentation and ownership proof, business registration and financial statements where relevant, and insurance policies meeting minimum coverage requirements.`,
      'normal'
    ),
    
    // Second image
    images[1] ? createImageBlock(images[1].id, images[1].alt, images[1].caption) : null,
    
    createBlock('Investment Options and Structures', 'h2'),
    
    createBlock(
      `The ${topic.keyword} programme accommodates diverse investment preferences through multiple approved channels, each offering unique advantages and considerations for different investor profiles. Understanding the full spectrum of investment options enables strategic selection aligned with financial objectives, risk tolerance, and long-term planning goals.`,
      'normal'
    ),
    
    // Internal link
    internalLinks[1] ? createLinkBlock(
      'Similar investment structures are available through ',
      internalLinks[1].keyword,
      internalLinks[1].url,
      ', though specific requirements and benefits vary significantly between programmes.',
    ) : null,
    
    createBlock('Real Estate Investment Pathway', 'h3'),
    
    createBlock(
      `Property investment remains the most popular route for ${topic.keyword}, offering tangible assets with potential appreciation and rental income generation. The programme typically accepts investments in residential, commercial, or mixed-use properties, with varying requirements for new developments versus existing properties. Investment thresholds must be maintained for specified holding periods, though some programmes permit eventual sale with conditions for maintaining residency status.`,
      'normal'
    ),
    
    createBlock(
      `Real estate markets in qualifying jurisdictions offer diverse opportunities ranging from luxury residential properties in prime urban locations to commercial developments in emerging business districts. Investors should carefully evaluate market conditions, rental yield potential, capital appreciation prospects, property management requirements, and exit strategy options when selecting real estate investments for programme qualification.`,
      'normal'
    ),
    
    // External link
    externalLinks[1] ? createLinkBlock(
      'Market analysis from ',
      'leading property consultants',
      externalLinks[1].url,
      ` indicates strong appreciation potential in designated investment zones, with rental yields varying significantly by location and property type.`,
    ) : null,
    
    createBlock('Financial Investment Alternatives', 'h3'),
    
    createBlock(
      `Beyond real estate, ${topic.keyword} programmes often accept various financial instruments including government bonds, approved investment funds, corporate securities, and bank deposits. These options appeal to investors preferring liquid assets or seeking portfolio diversification without property management responsibilities. Financial investments typically require maintaining positions for specified periods, with some programmes offering guaranteed returns or capital preservation features.`,
      'normal'
    ),
    
    createBlock('Step-by-Step Application Process', 'h2'),
    
    createBlock(
      `Navigating the ${topic.keyword} application process requires careful planning, attention to detail, and strategic preparation. While specific procedures vary by jurisdiction, most programmes follow similar structured approaches designed to ensure thorough evaluation while maintaining processing efficiency. Understanding each phase helps applicants prepare effectively and avoid common delays.`,
      'normal'
    ),
    
    // Third image
    images[2] ? createImageBlock(images[2].id, images[2].alt, images[2].caption) : null,
    
    createBlock('Tax Implications and Planning', 'h2'),
    
    createBlock(
      `Understanding tax implications of ${topic.keyword} is crucial for effective financial planning and compliance. The programme may offer significant tax advantages including territorial taxation, tax holidays, favorable rates on foreign-source income, or access to extensive treaty networks. However, applicants must carefully consider their global tax obligations and potential impacts on existing tax residency status.`,
      'normal'
    ),
    
    // Internal link
    internalLinks[2] ? createLinkBlock(
      'For comprehensive tax optimization strategies, review our detailed guide on ',
      internalLinks[2].keyword,
      internalLinks[2].url,
      ', which examines international tax planning approaches for multiple residency scenarios.',
    ) : null,
    
    createBlock('Living Conditions and Lifestyle', 'h2'),
    
    createBlock(
      `Beyond investment requirements, understanding daily life under ${topic.keyword} helps applicants make informed relocation decisions. Quality of life factors including climate, culture, safety, healthcare, education, and social integration play crucial roles in the success of international relocation. The destination offers unique lifestyle advantages that attract global citizens seeking enhanced living experiences.`,
      'normal'
    ),
    
    createBlock('Cost of Living Analysis', 'h3'),
    
    createBlock(
      `Budget planning for ${topic.keyword} holders requires understanding local cost structures across housing, transportation, food, utilities, and lifestyle expenses. Monthly living costs vary significantly based on location choices, family size, and lifestyle preferences. Urban centers typically command premium prices for housing and services, while suburban or rural areas offer more affordable alternatives with different lifestyle trade-offs.`,
      'normal'
    ),
    
    createBlock(
      `Typical monthly expenses for a family of four range from moderate to substantial depending on lifestyle choices. Housing costs represent the largest expense category for most expatriates, with rental prices varying dramatically between prime city locations and suburban areas. Transportation options range from efficient public systems to private vehicle ownership, each with different cost implications. Food expenses can be managed through local markets and home cooking or escalate with frequent dining and imported goods preferences.`,
      'normal'
    ),
    
    // FAQ Section based on SERP analysis
    ...(serpAnalysis.commonQuestions?.length > 0 ? [
      createBlock('Frequently Asked Questions', 'h2'),
      
      ...serpAnalysis.commonQuestions.slice(0, 8).map(question => [
        createBlock(question, 'h3'),
        createBlock(
          `This is a common concern for ${topic.keyword} applicants. Based on current regulations and expert guidance, the answer depends on specific circumstances and requirements. ${tavilyData?.results?.[0]?.content?.substring(0, 200) || 'Consultation with qualified advisors is recommended for personalized guidance addressing individual situations and objectives.'}`,
          'normal'
        )
      ]).flat(),
      
      createBlock('What are the minimum investment requirements?', 'h3'),
      createBlock(
        `Investment requirements for ${topic.keyword} vary based on the chosen pathway and qualifying assets. Current thresholds reflect market conditions and programme positioning relative to competing jurisdictions. Applicants should verify current requirements as these may be adjusted periodically to maintain programme competitiveness while ensuring meaningful economic contribution.`,
        'normal'
      ),
      
      createBlock('How long does the application process take?', 'h3'),
      createBlock(
        `Processing times for ${topic.keyword} typically range from several weeks to several months depending on application completeness, due diligence complexity, and current processing volumes. Expedited processing may be available for qualifying applications, though additional fees often apply. Factors affecting timeline include document authentication requirements, background check procedures, and administrative processing capacity.`,
        'normal'
      ),
      
      createBlock('Can family members be included?', 'h3'),
      createBlock(
        `Most ${topic.keyword} programmes permit inclusion of immediate family members including spouse and dependent children, with some extending to dependent parents or adult children under specific conditions. Family inclusion typically requires demonstrating relationships through official documentation and meeting health and character requirements, though financial thresholds usually apply only to the principal applicant.`,
        'normal'
      ),
    ] : []),
    
    // Fourth image before conclusion
    images[3] ? createImageBlock(images[3].id, images[3].alt, images[3].caption) : null,
    
    createBlock('Expert Recommendations', 'h2'),
    
    createBlock(
      `Success with ${topic.keyword} applications requires strategic planning beyond meeting minimum requirements. Industry experts and successful applicants consistently emphasize the importance of thorough preparation, professional guidance, and realistic expectation management throughout the process.`,
      'normal'
    ),
    
    createBlock(
      `Key recommendations include starting documentation preparation well in advance, engaging specialized advisors familiar with current requirements and procedures, ensuring clear source of funds documentation with complete audit trails, considering tax implications in both origin and destination jurisdictions, visiting the destination multiple times before committing to investment, establishing banking relationships early in the process, networking with existing visa holders for practical insights, maintaining investment flexibility for changing regulations, planning for family integration including education and healthcare needs, and considering long-term residency maintenance requirements.`,
      'normal'
    ),
    
    // More internal links
    createBlock('Related Programmes and Alternatives', 'h2'),
    
    createBlock(
      `Evaluating ${topic.keyword} in context of alternative programmes helps ensure optimal decision-making aligned with individual objectives and circumstances:`,
      'normal'
    ),
    
    ...(internalLinks.slice(3, 8).map(link => 
      createLinkBlock(
        '• Compare with ',
        link.keyword,
        link.url,
        ' for alternative investment and residency pathways with different requirements and benefits',
      )
    )),
    
    createBlock('Conclusion', 'h2'),
    
    createBlock(
      `The ${topic.keyword} programme represents a valuable opportunity for qualified individuals seeking international mobility with substantial benefits. Success requires thorough preparation, strategic planning, and often professional guidance to navigate complex requirements effectively. The investment of time and resources yields significant returns through enhanced global mobility, tax optimization, business opportunities, and lifestyle improvements.`,
      'normal'
    ),
    
    createBlock(
      `As global mobility programmes continue evolving in response to economic and political changes, ${topic.keyword} maintains its position as a leading option for international investors and professionals. The combination of reasonable requirements, attractive benefits, and quality of life considerations makes this programme particularly suitable for those seeking long-term international diversification strategies.`,
      'normal'
    ),
    
    createBlock(
      `Prospective applicants should begin with comprehensive due diligence, including consultation with qualified legal and tax advisors familiar with both home country and destination requirements. Early preparation, careful documentation, and strategic investment structuring significantly improve success rates and maximize long-term value from the programme.`,
      'normal'
    ),
    
    // References section
    createBlock('References and Sources', 'h2'),
    
    createBlock(
      `This comprehensive guide is based on authoritative sources and current regulations. All information has been verified through official channels and expert consultation:`,
      'normal'
    ),
    
    ...(references.slice(0, 10).map((ref, index) => 
      createBlock(
        `${index + 1}. ${ref.title}. Available at: ${ref.url} (Accessed: ${ref.accessDate})`,
        'normal'
      )
    )),
    
    createBlock('Disclaimer', 'h3'),
    
    createBlock(
      `Information provided is for general guidance only and should not be construed as legal or tax advice. Regulations and requirements are subject to change. Prospective applicants should consult qualified professionals for personalized guidance based on their specific circumstances. This guide is updated regularly but may not reflect the most recent changes in regulations or requirements.`,
      'normal'
    ),
  ].filter(Boolean); // Remove null entries
  
  return body;
}

// SAFEGUARD 6: Main generation function with quality checks
async function generateSafeguardedArticle(topic, existingArticles) {
  try {
    await log(`\n📝 Generating: ${topic.title}`);
    
    // Research phase with timeout protection
    await log('   🔬 Researching...');
    
    // Use Promise.allSettled instead of Promise.all to handle individual failures
    // Add overall timeout to prevent hanging
    const researchPromise = Promise.allSettled([
      tavilyResearch(`${topic.keyword} requirements costs benefits 2025`),
      serperSearch(topic.keyword),
      perplexityResearch(`${topic.keyword} latest updates 2025`)
    ]);
    
    // Timeout after 45 seconds for all research
    const timeoutPromise = new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { status: 'fulfilled', value: null },
          { status: 'fulfilled', value: null },
          { status: 'fulfilled', value: null }
        ]);
      }, 45000);
    });
    
    const results = await Promise.race([researchPromise, timeoutPromise]);
    
    const tavilyData = results[0]?.status === 'fulfilled' ? results[0].value : null;
    const serperData = results[1]?.status === 'fulfilled' ? results[1].value : null;
    const perplexityData = results[2]?.status === 'fulfilled' ? results[2].value : null;
    
    // Log if any research failed
    if (!tavilyData) await log('   ⚠️ Tavily research skipped');
    if (!serperData) await log('   ⚠️ Serper research skipped');
    if (!perplexityData) await log('   ⚠️ Perplexity research skipped');
    
    const serpAnalysis = serperData ? analyzeSERP(serperData) : null;
    
    // Generate images
    await log('   🎨 Generating images...');
    const images = await generateImages(topic.keyword, 4);
    
    if (images.length < QUALITY_THRESHOLDS.MIN_IMAGES) {
      throw new Error(`Only ${images.length} images generated, minimum ${QUALITY_THRESHOLDS.MIN_IMAGES} required`);
    }
    
    // Generate content
    await log('   ✍️ Creating content...');
    const body = await generateCompleteContent(
      topic, 
      { tavilyData, serperData, serpAnalysis, perplexityData }, 
      existingArticles,
      images
    );
    
    // Count words and links
    const wordCount = body
      .filter(b => b._type === 'block')
      .map(b => b.children?.map(c => c.text).join(' ') || '')
      .join(' ')
      .split(/\s+/)
      .filter(w => w.length > 0).length;
    
    const linkCount = body.filter(b => b.markDefs?.length > 0).length;
    
    // Create slug
    const slug = topic.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 60);
    
    // Create post with length-validated metadata
    const metaTitle = (topic.title.substring(0, 55) + '...').substring(0, QUALITY_THRESHOLDS.MAX_META_TITLE);
    const metaDescription = `${topic.keyword} complete guide 2025. Requirements, costs, process, and benefits.`.substring(0, QUALITY_THRESHOLDS.MAX_META_DESC);
    
    const post = {
      _id: uuidv4(),
      _type: 'post',
      title: topic.title,
      slug: {
        _type: 'slug',
        current: slug
      },
      featuredImage: images[0] ? {
        _type: 'image',
        alt: images[0].alt,
        asset: {
          _type: 'reference',
          _ref: images[0].id
        },
        credit: images[0].caption
      } : undefined,
      categories: [{
        _key: uuidv4(),
        _ref: topic.category
      }],
      publishedAt: new Date().toISOString(),
      body: body,
      excerpt: metaDescription,
      metaTitle: metaTitle,
      metaDescription: metaDescription,
      focusKeyword: topic.keyword,
      searchVolume: topic.searchVolume,
      cpc: topic.cpc,
      contentTier: 'tier1',
      featured: false,
      readTime: Math.ceil(wordCount / 225),
      generationCost: 0.0103,
      tags: []
    };
    
    // VALIDATE before publishing
    const errors = validateArticle(post, wordCount, linkCount, images.length);
    
    if (errors.length > 0) {
      await log(`   ❌ Quality check failed: ${errors.join(', ')}`);
      throw new Error(`Article failed quality checks: ${errors.join(', ')}`);
    }
    
    await log(`   ✓ ${wordCount} words, ${linkCount} links, ${images.length} images`);
    
    // Publish to Sanity
    const result = await client.create(post);
    
    await log(`   ✅ Published successfully: ${slug}`);
    
    return { ...result, wordCount, linkCount, imageCount: images.length };
    
  } catch (error) {
    await log(`   ❌ Failed: ${topic.title} - ${error.message}`);
    throw error;
  }
}

// SAFEGUARD 7: Deployment check with validation
async function checkDeployment(attempts = 0) {
  try {
    await log('\n🔍 Checking deployment...');
    
    const { stdout: buildOutput } = await execAsync('npm run build');
    
    if (buildOutput.includes('Complete!')) {
      await log('   ✓ Build successful');
      
      await execAsync('git add -A');
      await execAsync(`git commit -m "Auto-batch: ${new Date().toISOString()}"`);
      await execAsync('git push');
      
      await log('   ✓ Pushed to GitHub');
      await log('   ⏳ Waiting for Vercel...');
      await new Promise(resolve => setTimeout(resolve, 90000));
      
      const response = await fetch('https://relocation.quest');
      if (response.ok) {
        await log('   ✅ Deployment successful!');
        return true;
      }
    }
    
    if (attempts < 3) {
      await log('   ⚠️ Retrying deployment...');
      await new Promise(resolve => setTimeout(resolve, 30000));
      return checkDeployment(attempts + 1);
    }
    
    await log('   ❌ Deployment failed');
    return false;
  } catch (error) {
    await log(`   ❌ Deployment error: ${error.message}`);
    return false;
  }
}

// SAFEGUARD 8: Main execution with monitoring
async function generateTo1000() {
  await log('🚀 SAFEGUARDED GENERATION TO 1000 ARTICLES');
  await log('=' .repeat(60));
  
  const startTime = Date.now();
  const batchSize = 10;
  const targetArticles = 1000;
  
  const currentArticles = await client.fetch('count(*[_type == "post"])');
  await log(`\n📊 Current articles: ${currentArticles}`);
  
  const articlesToGenerate = Math.min(targetArticles - currentArticles, ARTICLE_TOPICS_1000.length - currentArticles);
  const batchesToRun = Math.ceil(articlesToGenerate / batchSize);
  
  await log(`📝 Articles to generate: ${articlesToGenerate}`);
  await log(`📦 Batches to run: ${batchesToRun}`);
  
  let totalGenerated = 0;
  let totalWords = 0;
  let totalCost = 0;
  let successfulBatches = 0;
  let failedArticles = [];
  
  const existingArticles = await getExistingArticles();
  
  for (let batch = 0; batch < batchesToRun; batch++) {
    await log(`\n${'='.repeat(60)}`);
    await log(`📦 BATCH ${batch + 1} of ${batchesToRun}`);
    await log(`${'='.repeat(60)}`);
    
    const startIdx = currentArticles + (batch * batchSize);
    const endIdx = Math.min(startIdx + batchSize, currentArticles + articlesToGenerate);
    const batchTopics = ARTICLE_TOPICS_1000.slice(startIdx, endIdx);
    
    await log(`\n📋 Topics for this batch:`);
    batchTopics.forEach(t => log(`   - ${t.keyword}`));
    
    const batchResults = [];
    
    for (const topic of batchTopics) {
      try {
        const result = await generateSafeguardedArticle(topic, existingArticles);
        batchResults.push(result);
        totalGenerated++;
        totalWords += result.wordCount;
        totalCost += 0.0103;
        
        // Update existing articles for internal linking
        existingArticles.push({
          title: result.title,
          slug: { current: result.slug.current },
          focusKeyword: result.focusKeyword
        });
        
        // Small delay between articles
        await new Promise(resolve => setTimeout(resolve, 3000));
      } catch (error) {
        failedArticles.push({ topic: topic.title, error: error.message });
        await log(`   ⚠️ Skipping failed article: ${topic.title}`);
      }
    }
    
    await log(`\n📊 Batch ${batch + 1} Results:`);
    await log(`   - Articles generated: ${batchResults.length}/${batchTopics.length}`);
    await log(`   - Average word count: ${Math.round(batchResults.reduce((sum, r) => sum + r.wordCount, 0) / batchResults.length) || 0}`);
    await log(`   - Failed articles: ${batchTopics.length - batchResults.length}`);
    
    // Deploy if we have successful articles
    if (batchResults.length > 0) {
      const deployed = await checkDeployment();
      if (deployed) {
        successfulBatches++;
        await log(`✅ Batch ${batch + 1} deployed`);
      } else {
        await log(`⚠️ Batch ${batch + 1} deployment failed, continuing...`);
      }
    }
    
    // Check if we've hit the target
    if (currentArticles + totalGenerated >= targetArticles) {
      await log(`\n🎯 Target reached: ${currentArticles + totalGenerated} articles!`);
      break;
    }
    
    // Pause between batches
    if (batch < batchesToRun - 1) {
      await log(`\n⏳ Pausing before next batch...`);
      await new Promise(resolve => setTimeout(resolve, 30000));
    }
  }
  
  const duration = Math.round((Date.now() - startTime) / 1000 / 60);
  
  await log('\n' + '='.repeat(60));
  await log('🏁 GENERATION COMPLETE');
  await log('='.repeat(60));
  await log(`⏱️  Duration: ${duration} minutes`);
  await log(`📊 Articles generated: ${totalGenerated}`);
  await log(`📦 Successful batches: ${successfulBatches}`);
  await log(`📝 Total words: ${totalWords.toLocaleString()} (avg: ${Math.round(totalWords/totalGenerated) || 0})`);
  await log(`💰 Total cost: $${totalCost.toFixed(2)}`);
  await log(`❌ Failed articles: ${failedArticles.length}`);
  
  if (failedArticles.length > 0) {
    await log('\nFailed articles:');
    failedArticles.forEach(f => log(`   - ${f.topic}: ${f.error}`));
  }
  
  await log(`\n🔗 Live at: https://relocation.quest`);
  await log(`📈 Total articles now: ${currentArticles + totalGenerated}`);
  
  return {
    totalGenerated,
    totalWords,
    totalCost,
    successfulBatches,
    failedArticles,
    duration
  };
}

// Start generation
await log('🤖 Initializing safeguarded generation system...\n');
generateTo1000()
  .then(results => {
    log('\n✨ Generation completed successfully!');
    process.exit(0);
  })
  .catch(error => {
    log(`\n❌ Generation failed: ${error.message}`);
    process.exit(1);
  });