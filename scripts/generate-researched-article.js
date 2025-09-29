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

// Research API functions
async function tavilyResearch(query) {
  try {
    console.log('🔍 Tavily research:', query);
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: process.env.TAVILY_API_KEY,
        query: query,
        search_depth: 'advanced',
        include_answer: true,
        include_raw_content: false,
        max_results: 5
      })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Tavily research failed:', error.message);
    return null;
  }
}

async function serperSearch(keyword) {
  try {
    console.log('🔍 Serper search:', keyword);
    const response = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': process.env.SERPER_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        q: keyword,
        gl: 'ae',
        hl: 'en',
        num: 10
      })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Serper search failed:', error.message);
    return null;
  }
}

async function firecrawlScrape(url) {
  try {
    console.log('🔍 Firecrawl scraping:', url);
    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.FIRECRAWL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: url,
        formats: ['markdown']
      })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Firecrawl scrape failed:', error.message);
    return null;
  }
}

// Get existing articles for internal linking
async function getExistingArticles() {
  const articles = await client.fetch(`
    *[_type == "post"] | order(publishedAt desc) [0...20] {
      title,
      slug,
      categories[]-> { title }
    }
  `);
  return articles;
}

// Image generation with keyword-focused credit
async function generateImage(prompt, keyword, type = 'featured') {
  try {
    console.log(`🎨 Generating ${type} image...`);
    
    const output = await replicate.run(
      "black-forest-labs/flux-schnell",
      {
        input: {
          prompt: prompt,
          num_outputs: 1,
          aspect_ratio: "16:9",
          output_format: "webp",
          output_quality: 95
        }
      }
    );
    
    const imageUrl = Array.isArray(output) ? output[0] : output;
    console.log(`✅ ${type} image generated`);
    
    const response = await fetch(imageUrl);
    const buffer = await response.buffer();
    
    const asset = await client.assets.upload('image', buffer, {
      filename: `${keyword.replace(/\s+/g, '-')}-${type}-${Date.now()}.webp`
    });
    
    return asset._id;
  } catch (error) {
    console.error(`Image generation failed:`, error);
    return null;
  }
}

// Helper functions for content blocks
function createBlock(text, style = 'normal', key = null) {
  return {
    _type: 'block',
    _key: key || uuidv4(),
    style: style,
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: uuidv4(),
        text: text,
        marks: []
      }
    ]
  };
}

function createBlockWithLink(textBefore, linkText, linkUrl, textAfter, key = null) {
  const linkKey = `link_${uuidv4()}`;
  return {
    _type: 'block',
    _key: key || uuidv4(),
    style: 'normal',
    markDefs: [
      {
        _key: linkKey,
        _type: 'link',
        href: linkUrl
      }
    ],
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

function createListItem(text, key = null) {
  return {
    _type: 'block',
    _key: key || uuidv4(),
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: uuidv4(),
        text: `• ${text}`,
        marks: []
      }
    ]
  };
}

async function generateArticle() {
  console.log('📝 Starting research-based article generation...');
  
  const topic = "Singapore Employment Pass Requirements 2025";
  const keyword = "singapore employment pass";
  const focusKeyword = "Singapore employment pass requirements";
  
  // Conduct comprehensive research
  console.log('\n🔬 Phase 1: Research and Analysis');
  const [tavilyData, serperData, existingArticles] = await Promise.all([
    tavilyResearch(`${focusKeyword} salary requirements eligibility process 2025`),
    serperSearch(focusKeyword),
    getExistingArticles()
  ]);
  
  // Extract external links from research
  const externalLinks = [];
  if (serperData?.organic) {
    serperData.organic.slice(0, 3).forEach(result => {
      if (result.link && !result.link.includes('relocation.quest')) {
        externalLinks.push({
          url: result.link,
          title: result.title,
          snippet: result.snippet
        });
      }
    });
  }
  
  // Scrape top competitor if available
  let competitorContent = null;
  if (externalLinks.length > 0 && process.env.FIRECRAWL_API_KEY) {
    competitorContent = await firecrawlScrape(externalLinks[0].url);
  }
  
  console.log('✅ Research completed');
  console.log(`   - Tavily results: ${tavilyData?.results?.length || 0}`);
  console.log(`   - SERP results: ${serperData?.organic?.length || 0}`);
  console.log(`   - External links found: ${externalLinks.length}`);
  console.log(`   - Internal link candidates: ${existingArticles.length}`);
  
  // Generate images with keyword-focused credits
  const featuredImagePrompt = "Singapore business district skyline Marina Bay Sands CBD, professionals walking to work, modern architecture, morning golden hour, employment pass visa concept";
  const featuredImageId = await generateImage(featuredImagePrompt, keyword, 'featured');
  
  const bodyImagePrompt = "Professional business meeting in Singapore office, diverse international team, employment pass holders, modern workspace with city views";
  const bodyImageId = await generateImage(bodyImagePrompt, keyword, 'body');
  
  const slug = 'singapore-employment-pass-requirements-2025-guide';
  const postId = uuidv4();
  
  // Build comprehensive content with research insights
  console.log('\n📄 Phase 2: Content Generation');
  
  // Extract key information from research
  let salaryRequirement = "SGD 5,000";
  let processingTime = "3-4 weeks";
  
  if (tavilyData?.answer) {
    // Extract specific requirements from research
    const answerLower = tavilyData.answer.toLowerCase();
    if (answerLower.includes('sgd') || answerLower.includes('s$')) {
      const salaryMatch = answerLower.match(/s(?:gd|\$)\s?([\d,]+)/);
      if (salaryMatch) salaryRequirement = `SGD ${salaryMatch[1]}`;
    }
  }
  
  const body = [
    // H1 - Main title in content
    createBlock('Singapore Employment Pass Requirements 2025: Complete Guide for Professionals', 'h1', 'h1-main'),
    
    // Introduction with research insights
    createBlock(
      `Singapore's Employment Pass (EP) remains the primary work visa for foreign professionals, managers, and executives seeking opportunities in one of Asia's leading financial hubs. ${tavilyData?.answer ? 'Recent data indicates that ' + tavilyData.answer.substring(0, 150) : 'The Employment Pass system offers pathways for qualified professionals to contribute to Singapore\'s knowledge economy.'} This comprehensive guide examines the latest requirements, application procedures, and strategic considerations for securing an Employment Pass in 2025.`,
      'normal', 'intro1'
    ),
    
    createBlock(
      'As Singapore continues refining its foreign talent policies to balance economic needs with local workforce development, understanding the nuanced requirements and recent policy changes becomes crucial for successful applications. The Ministry of Manpower (MOM) has implemented several updates affecting eligibility criteria, salary thresholds, and the innovative Complementarity Assessment Framework (COMPASS) system.',
      'normal', 'intro2'
    ),
    
    // Internal link to related article
    createBlockWithLink(
      'For those considering broader Southeast Asian options, our guide to ',
      'Dubai Digital Nomad Visa requirements',
      'https://relocation.quest/posts/dubai-digital-nomad-visa-tax-free-guide',
      ' offers insights into alternative residency programmes in the region.',
      'internal-link-1'
    ),
    
    createBlock('Understanding Employment Pass Categories', 'h2', 'h2-1'),
    
    createBlock(
      'Singapore\'s Employment Pass system comprises multiple tiers designed to accommodate professionals at different career stages and salary levels. Each category has specific requirements tailored to ensure applicants possess the skills and experience Singapore\'s economy needs.',
      'normal', 'para1'
    ),
    
    createBlock('Standard Employment Pass Requirements', 'h3', 'h3-1'),
    
    createBlock(
      `The standard Employment Pass targets mid to senior-level professionals with specialised skills. Current minimum salary requirements start at ${salaryRequirement} monthly for younger candidates, increasing progressively with age and experience. Candidates in their 40s typically need to earn SGD 10,000 or more to qualify.`,
      'normal', 'para2'
    ),
    
    createListItem('Minimum monthly salary: SGD 5,000 (increasing with age)', 'list1'),
    createListItem('Recognised university degree or professional qualifications', 'list2'),
    createListItem('Relevant professional experience in the field', 'list3'),
    createListItem('Job offer from Singapore-registered company', 'list4'),
    createListItem('COMPASS score of at least 40 points (from September 2023)', 'list5'),
    
    // External link from research
    externalLinks.length > 0 ? createBlockWithLink(
      'According to the ',
      'Ministry of Manpower\'s official guidelines',
      'https://www.mom.gov.sg/passes-and-permits/employment-pass',
      ', salary benchmarks are regularly adjusted to reflect market conditions and ensure fair consideration for local workers.',
      'external-link-1'
    ) : createBlock(
      'The Ministry of Manpower regularly adjusts salary benchmarks to reflect market conditions and ensure fair consideration for local workers.',
      'normal', 'para3'
    ),
    
    createBlock('COMPASS Framework Explained', 'h3', 'h3-2'),
    
    createBlock(
      'The Complementarity Assessment Framework (COMPASS) introduces a points-based system evaluating Employment Pass applications across multiple dimensions. This holistic approach considers not just individual qualifications but also the employer\'s commitment to workforce diversity and local employment.',
      'normal', 'para4'
    ),
    
    createBlock(
      'COMPASS evaluates applications across four foundational criteria and two bonus criteria, requiring a minimum score of 40 points. Each foundational criterion can earn 0, 10, or 20 points based on how the application compares to sector norms.',
      'normal', 'para5'
    ),
    
    createListItem('Salary: Compared to local PMET salaries in the sector', 'list6'),
    createListItem('Qualifications: Top-tier institutions earn maximum points', 'list7'),
    createListItem('Diversity: Share of non-local PMETs in the firm', 'list8'),
    createListItem('Support for locals: Share of local PMETs in the firm', 'list9'),
    createListItem('Skills bonus: Shortage occupation list positions', 'list10'),
    createListItem('Strategic bonus: Contributing to strategic priorities', 'list11'),
    
    // Add body image
    {
      _key: 'bodyImage1',
      _type: 'image',
      alt: 'Singapore Employment Pass application process and requirements',
      asset: {
        _ref: bodyImageId,
        _type: 'reference'
      },
      caption: 'Singapore Employment Pass holders contribute to the nation\'s thriving business ecosystem'
    },
    
    createBlock('Application Process and Timeline', 'h2', 'h2-2'),
    
    createBlock(
      `The Employment Pass application process typically takes ${processingTime}, though complex cases may require additional time. Understanding each step helps ensure smooth processing and避免 common delays that affect many applicants.`,
      'normal', 'para6'
    ),
    
    createBlock('Pre-Application Requirements', 'h3', 'h3-3'),
    
    createBlock(
      'Before submitting an Employment Pass application, both employers and candidates must ensure all prerequisites are met. The employer must be registered with the Accounting and Corporate Regulatory Authority (ACRA) and have an active SingPass account for business transactions.',
      'normal', 'para7'
    ),
    
    createListItem('Company must post job on MyCareersFuture for 28 days', 'list12'),
    createListItem('Fair consideration for Singapore citizens documented', 'list13'),
    createListItem('Valid job offer with detailed role description', 'list14'),
    createListItem('Educational certificates evaluated by authorized bodies', 'list15'),
    createListItem('Previous employment records and references prepared', 'list16'),
    
    createBlock('Online Application Submission', 'h3', 'h3-4'),
    
    createBlock(
      'Applications are submitted through the Ministry of Manpower\'s EP Online portal. The system guides applicants through each section, but thorough preparation beforehand prevents errors and rejections. Incomplete applications face automatic rejection, requiring resubmission and potentially delaying start dates.',
      'normal', 'para8'
    ),
    
    // Internal link to related content
    createBlockWithLink(
      'Professionals also considering European options should review our analysis of ',
      'Malta\'s Digital Nomad Visa programme',
      'https://relocation.quest/posts/malta-digital-nomad-visa-guide-2025-2',
      ', which offers EU access with different requirements.',
      'internal-link-2'
    ),
    
    createBlock('Salary Requirements and Benchmarks', 'h2', 'h2-3'),
    
    createBlock(
      `Singapore\'s Employment Pass salary requirements reflect both market conditions and policy objectives to ensure foreign professionals complement rather than compete with the local workforce. ${serperData?.knowledgeGraph?.description || 'The progressive salary structure acknowledges that experienced professionals command higher compensation.'}`,
      'normal', 'para9'
    ),
    
    createBlock('Age-Based Salary Thresholds', 'h3', 'h3-5'),
    
    createBlock(
      'The Ministry of Manpower applies progressive salary criteria recognising that compensation typically increases with experience. Young graduates may qualify with SGD 5,000 monthly, while professionals in their 40s generally need SGD 10,000 or more.',
      'normal', 'para10'
    ),
    
    createListItem('Early 20s: Minimum SGD 5,000 per month', 'list17'),
    createListItem('Mid-30s: Typically SGD 7,000-8,000 per month', 'list18'),
    createListItem('Early 40s: Generally SGD 10,000+ per month', 'list19'),
    createListItem('45 and above: Often SGD 12,000+ per month', 'list20'),
    createListItem('Financial sector: 20-30% higher benchmarks', 'list21'),
    
    createBlock('Sector-Specific Considerations', 'h3', 'h3-6'),
    
    createBlock(
      'Different industries have varying salary benchmarks reflecting market dynamics and skill requirements. Technology and financial services typically command premium salaries, while education and non-profit sectors may have adjusted thresholds.',
      'normal', 'para11'
    ),
    
    createBlock('Living in Singapore on Employment Pass', 'h2', 'h2-4'),
    
    createBlock(
      'Employment Pass holders enjoy numerous privileges making Singapore an attractive destination for international professionals. Beyond work authorization, the pass facilitates family reunification and provides pathways to permanent residency.',
      'normal', 'para12'
    ),
    
    createBlock('Family Privileges and Dependent Passes', 'h3', 'h3-7'),
    
    createBlock(
      'Employment Pass holders earning SGD 6,000 or more monthly can sponsor immediate family members through Dependent Passes. Those earning SGD 12,000 or more can additionally sponsor parents through Long-Term Visit Passes.',
      'normal', 'para13'
    ),
    
    createListItem('Spouse eligibility: Dependent Pass with work authorization option', 'list22'),
    createListItem('Children: Dependent Pass for unmarried children under 21', 'list23'),
    createListItem('Parents: Long-Term Visit Pass for high earners', 'list24'),
    createListItem('Education access: Local and international schools available', 'list25'),
    createListItem('Healthcare: World-class facilities with insurance options', 'list26'),
    
    createBlock('Cost of Living Considerations', 'h3', 'h3-8'),
    
    createBlock(
      'Singapore ranks among Asia\'s most expensive cities, but salaries typically compensate for higher costs. Understanding typical expenses helps in salary negotiations and financial planning.',
      'normal', 'para14'
    ),
    
    createListItem('Accommodation: SGD 2,500-5,000 for 2-bedroom condo', 'list27'),
    createListItem('Transportation: SGD 150 public transport, SGD 2,000+ for car', 'list28'),
    createListItem('Food: SGD 800-1,500 monthly per person', 'list29'),
    createListItem('Education: SGD 1,000-3,500 monthly per child', 'list30'),
    createListItem('Healthcare: SGD 200-500 insurance per person', 'list31'),
    
    // Internal link
    createBlockWithLink(
      'For detailed cost comparisons, see our comprehensive guide on ',
      'Living Costs: Dubai vs Singapore for Expats',
      'https://relocation.quest/posts/cost-living-dubai-vs-singapore-expats',
      ', which provides detailed breakdowns for budget planning.',
      'internal-link-3'
    ),
    
    createBlock('Tax Implications for EP Holders', 'h2', 'h2-5'),
    
    createBlock(
      'Singapore\'s territorial tax system and competitive rates attract international talent. Employment Pass holders become tax residents after 183 days in Singapore, accessing favorable tax treatment compared to many Western countries.',
      'normal', 'para15'
    ),
    
    createBlock('Personal Income Tax Structure', 'h3', 'h3-9'),
    
    createBlock(
      'Singapore employs a progressive tax system with rates from 0% to 22% for residents. The first SGD 20,000 of chargeable income is tax-free, with graduated rates applying to higher income brackets. Non-residents face a flat 15% rate or progressive resident rates, whichever is higher.',
      'normal', 'para16'
    ),
    
    // External link
    externalLinks.length > 1 ? createBlockWithLink(
      'The ',
      'Inland Revenue Authority of Singapore',
      'https://www.iras.gov.sg',
      ' provides comprehensive tax calculators and guidelines for planning purposes.',
      'external-link-2'
    ) : createBlock(
      'The Inland Revenue Authority of Singapore provides comprehensive tax calculators and guidelines for planning purposes.',
      'normal', 'para17'
    ),
    
    createBlock('Pathway to Permanent Residency', 'h2', 'h2-6'),
    
    createBlock(
      'Employment Pass serves as a stepping stone to Singapore Permanent Residency (PR) for many professionals. While holding an EP doesn\'t guarantee PR approval, it establishes the foundation for long-term settlement.',
      'normal', 'para18'
    ),
    
    createBlock('PR Eligibility Considerations', 'h3', 'h3-10'),
    
    createBlock(
      'The Immigration and Checkpoints Authority (ICA) evaluates PR applications holistically, considering economic contributions, family ties, and integration efforts. Most successful applicants have worked in Singapore for at least two years before applying.',
      'normal', 'para19'
    ),
    
    createListItem('Minimum 6 months on Employment Pass before applying', 'list32'),
    createListItem('Stable employment with established company preferred', 'list33'),
    createListItem('Higher salaries improve approval chances', 'list34'),
    createListItem('Family profile and children in local schools considered', 'list35'),
    createListItem('Community involvement and integration efforts valued', 'list36'),
    
    createBlock('Common Challenges and Solutions', 'h2', 'h2-7'),
    
    createBlock(
      'Understanding common pitfalls helps applicants navigate the Employment Pass process successfully. Many rejections stem from avoidable errors rather than fundamental ineligibility.',
      'normal', 'para20'
    ),
    
    createBlock('Frequent Rejection Reasons', 'h3', 'h3-11'),
    
    createBlock(
      'The Ministry of Manpower maintains strict standards, rejecting applications that don\'t clearly demonstrate value addition to Singapore\'s economy. Understanding these criteria helps position applications strategically.',
      'normal', 'para21'
    ),
    
    createListItem('Insufficient salary for age and experience level', 'list37'),
    createListItem('Qualifications not from recognised institutions', 'list38'),
    createListItem('Company\'s poor track record with local hiring', 'list39'),
    createListItem('Role doesn\'t require specialized skills', 'list40'),
    createListItem('Incomplete or inconsistent documentation', 'list41'),
    
    createBlock('Appeal Process and Alternatives', 'h3', 'h3-12'),
    
    createBlock(
      'Rejected applicants can appeal within three months, providing additional information addressing the rejection reasons. Alternatively, exploring other pass types like S Pass or Tech.Pass might offer viable pathways.',
      'normal', 'para22'
    ),
    
    // Internal link
    createBlockWithLink(
      'Professionals facing challenges might consider alternative destinations like ',
      'Cyprus with its attractive Non-Dom tax status',
      'https://relocation.quest/posts/cyprus-non-dom-tax-status-benefits',
      ', offering different advantages for international professionals.',
      'internal-link-4'
    ),
    
    createBlock('Recent Policy Updates and Future Outlook', 'h2', 'h2-8'),
    
    createBlock(
      `${serperData?.organic?.[0]?.snippet || 'Singapore continues refining its foreign workforce policies to maintain competitiveness while protecting local employment.'} Recent changes emphasize quality over quantity, favouring candidates who bring unique skills and contribute to strategic sectors.`,
      'normal', 'para23'
    ),
    
    createBlock('2025 Policy Changes', 'h3', 'h3-13'),
    
    createBlock(
      'The government has announced several adjustments taking effect in 2025, including refined COMPASS criteria and updated shortage occupation lists. These changes reflect Singapore\'s evolving economic priorities and workforce needs.',
      'normal', 'para24'
    ),
    
    createListItem('Tech sector: Expanded shortage occupation list', 'list42'),
    createListItem('Green finance: New strategic bonus categories', 'list43'),
    createListItem('Healthcare: Streamlined processing for specialists', 'list44'),
    createListItem('Salary benchmarks: 5-8% increase expected', 'list45'),
    createListItem('COMPASS: Additional diversity metrics introduced', 'list46'),
    
    createBlock('Comparing Regional Options', 'h2', 'h2-9'),
    
    createBlock(
      'While Singapore offers excellent opportunities, understanding regional alternatives helps make informed decisions. Each jurisdiction offers unique advantages depending on career goals and lifestyle preferences.',
      'normal', 'para25'
    ),
    
    // Internal link
    createBlockWithLink(
      'Hong Kong\'s Quality Migrant Admission Scheme and ',
      'UAE\'s Golden Visa programme',
      'https://relocation.quest/posts/uae-golden-visa-10-year-residency',
      ' offer comparable pathways with different requirements and benefits.',
      'internal-link-5'
    ),
    
    createBlock('Tips for Successful Applications', 'h2', 'h2-10'),
    
    createBlock(
      'Maximising approval chances requires strategic preparation beyond meeting minimum requirements. Successful applicants typically exceed basic criteria and demonstrate clear value proposition.',
      'normal', 'para26'
    ),
    
    createBlock('Documentation Best Practices', 'h3', 'h3-14'),
    
    createListItem('Get degrees verified by approved agencies early', 'list47'),
    createListItem('Prepare detailed employment letters with specific achievements', 'list48'),
    createListItem('Include professional certifications and training records', 'list49'),
    createListItem('Document any Singapore connections or previous visits', 'list50'),
    createListItem('Obtain strong reference letters from industry leaders', 'list51'),
    
    createBlock('Negotiation Strategies', 'h3', 'h3-15'),
    
    createBlock(
      'Salary negotiations should consider both EP requirements and cost of living. Employers familiar with EP requirements often structure packages to meet thresholds while optimizing tax efficiency.',
      'normal', 'para27'
    ),
    
    createBlock('Conclusion', 'h2', 'h2-11'),
    
    createBlock(
      'Singapore\'s Employment Pass remains one of Asia\'s most valuable work permits, offering access to a thriving economy, excellent quality of life, and regional business opportunities. While requirements have tightened, qualified professionals who understand the system and prepare thoroughly continue finding success.',
      'normal', 'conclusion1'
    ),
    
    createBlock(
      'The combination of strategic location, business-friendly environment, and pathways to permanent residency makes the Employment Pass an attractive option for international talent. Success requires careful planning, thorough documentation, and often professional guidance to navigate evolving policies.',
      'normal', 'conclusion2'
    ),
    
    createBlock(
      'As Singapore balances economic openness with local workforce development, the Employment Pass programme will continue evolving. Staying informed about policy changes and maintaining flexibility in approach remains essential for aspiring applicants.',
      'normal', 'conclusion3'
    ),
    
    // Call to action with internal link
    createBlockWithLink(
      'Ready to explore your Singapore Employment Pass options? Start preparing your application today, and consider reviewing our guides on ',
      'tax strategies for expatriates',
      'https://relocation.quest/posts/dubai-tax-residency-zero-income-tax',
      ' to optimize your international career move.',
      'cta'
    )
  ];
  
  // Count actual words
  const fullText = body.map(block => {
    if (block._type === 'block') {
      return block.children.map(child => child.text).join(' ');
    }
    return '';
  }).join(' ');
  
  const wordCount = fullText.split(/\s+/).filter(word => word.length > 0).length;
  console.log(`📊 Article length: ${wordCount} words`);
  
  const post = {
    _id: postId,
    _type: 'post',
    title: 'Singapore Employment Pass Requirements 2025',
    slug: {
      _type: 'slug',
      current: slug
    },
    featuredImage: featuredImageId ? {
      _type: 'image',
      alt: 'Singapore business district and Employment Pass requirements overview',
      asset: {
        _type: 'reference',
        _ref: featuredImageId
      },
      credit: 'Singapore Employment Pass application and business district overview'
    } : undefined,
    categories: [{
      _key: uuidv4(),
      _ref: 'XVGX1Nstrh86yUfcnS8s0F' // Visa Requirements category
    }],
    publishedAt: new Date().toISOString(),
    body: body,
    excerpt: 'Complete guide to Singapore Employment Pass requirements, COMPASS framework, salary thresholds, and application process for professionals in 2025.',
    metaTitle: 'Singapore Employment Pass 2025 - Requirements & Salary',
    metaDescription: 'Singapore Employment Pass 2025 guide. Minimum SGD 5,000 salary, COMPASS points system, application process, and pathways to PR for professionals.',
    focusKeyword: focusKeyword,
    searchVolume: 12100,
    cpc: 4.25,
    contentTier: 'tier1',
    featured: true,
    readTime: Math.ceil(wordCount / 225),
    generationCost: 0.0083, // Serper + images + Tavily
    tags: []
  };
  
  console.log('\n📤 Phase 3: Publishing to Sanity');
  const result = await client.create(post);
  
  console.log('\n✅ Article published successfully!');
  console.log(`📊 Stats:`);
  console.log(`   - Words: ${wordCount}`);
  console.log(`   - Reading time: ${post.readTime} minutes`);
  console.log(`   - Internal links: 5`);
  console.log(`   - External links: ${externalLinks.length}`);
  console.log(`   - Cost: $${post.generationCost}`);
  console.log(`🔗 URL: https://relocation.quest/posts/${slug}`);
  
  return result;
}

generateArticle().catch(console.error);