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

async function generateImage(prompt, type = 'featured') {
  try {
    console.log(`🎨 Generating ${type} image with Flux Schnell...`);
    
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
      filename: `dubai-golden-visa-${type}-${Date.now()}.webp`
    });
    
    return asset._id;
  } catch (error) {
    console.error(`Image generation failed:`, error);
    return null;
  }
}

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

function createBlockWithMarks(children, markDefs = [], style = 'normal', key = null) {
  return {
    _type: 'block',
    _key: key || uuidv4(),
    style: style,
    markDefs: markDefs,
    children: children
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
  console.log('📝 Starting formatted article generation...');
  
  // Generate featured image first
  const featuredImagePrompt = "Professional aerial view of Dubai skyline at golden hour, showing Burj Khalifa and Dubai Marina, luxury lifestyle, golden visa concept, photorealistic, high quality business photography";
  const featuredImageId = await generateImage(featuredImagePrompt, 'featured');
  
  // Generate body image
  const bodyImagePrompt = "Modern office space in Dubai with professionals working, golden visa documents on desk, Dubai skyline view through windows, business meeting, photorealistic";
  const bodyImageId = await generateImage(bodyImagePrompt, 'body');
  
  const slug = 'dubai-golden-visa-2025-comprehensive-guide';
  const postId = uuidv4();
  
  // Create properly formatted body content
  const body = [
    createBlock('The Dubai Golden Visa programme represents one of the most attractive long-term residency options in the Middle East, offering unprecedented opportunities for investors, entrepreneurs, and skilled professionals seeking to establish their base in the UAE.', 'normal', 'intro1'),
    
    createBlock('Launched in 2019 and significantly expanded in recent years, this programme fundamentally transforms how expatriates can live and work in Dubai, providing 5 to 10-year renewable residency permits without the traditional requirement of employer sponsorship.', 'normal', 'intro2'),
    
    createBlock('Dubai Golden Visa Eligibility Categories', 'h2', 'h2-1'),
    
    createBlock('The Golden Visa programme offers multiple pathways to qualification, each designed to attract specific types of contributors to Dubai\'s dynamic economy. Understanding these categories is essential for determining your eligibility and choosing the most appropriate route.', 'normal', 'para1'),
    
    createBlock('Investor Category Requirements', 'h3', 'h3-1'),
    
    createBlock('The investor category remains the most popular route for high-net-worth individuals. To qualify, applicants must demonstrate substantial financial commitment through one of the following channels:', 'normal', 'para2'),
    
    createListItem('Real estate investment of minimum AED 2 million in Dubai property', 'list1'),
    createListItem('Deposit of AED 2 million in an approved investment fund', 'list2'),
    createListItem('Establishing a company with capital of at least AED 2 million', 'list3'),
    createListItem('Combined investments totalling AED 2 million across approved categories', 'list4'),
    
    createBlock('Properties can be off-plan or completed, but must be retained for at least three years. Importantly, mortgage-financed purchases qualify provided the paid amount meets the threshold requirement.', 'normal', 'para3'),
    
    // Add body image
    {
      _key: 'bodyImage1',
      _type: 'image',
      alt: 'Dubai business professionals discussing Golden Visa requirements',
      asset: {
        _ref: bodyImageId,
        _type: 'reference'
      },
      caption: 'Dubai offers world-class business facilities for Golden Visa holders'
    },
    
    createBlock('Professional and Skilled Worker Category', 'h3', 'h3-2'),
    
    createBlock('Dubai recognises that economic prosperity depends equally on human talent. The professional category targets individuals with exceptional skills and qualifications in their fields.', 'normal', 'para4'),
    
    createListItem('Specialised professionals with AED 30,000+ monthly salary', 'list5'),
    createListItem('Scientists and researchers with significant contributions', 'list6'),
    createListItem('Cultural and creative professionals with international recognition', 'list7'),
    createListItem('Medical professionals and engineers in priority sectors', 'list8'),
    
    createBlock('Application Process and Documentation', 'h2', 'h2-2'),
    
    createBlock('The Golden Visa application process, while streamlined compared to many international residency programmes, requires careful preparation and attention to detail. The entire process typically takes 2-4 weeks from submission to approval.', 'normal', 'para5'),
    
    createBlock('Required Documentation', 'h3', 'h3-3'),
    
    createBlock('All documents must be current, properly attested, and translated into Arabic or English by certified translators. The attestation process varies depending on the document\'s country of origin.', 'normal', 'para6'),
    
    createListItem('Valid passport with minimum 6 months validity', 'list9'),
    createListItem('Proof of investment or employment meeting threshold requirements', 'list10'),
    createListItem('Bank statements showing consistent balances over 6 months', 'list11'),
    createListItem('Medical fitness certificate from approved centres', 'list12'),
    createListItem('Police clearance certificate from country of origin', 'list13'),
    
    createBlock('Financial Requirements and Costs', 'h2', 'h2-3'),
    
    createBlock('Understanding the complete financial implications helps applicants budget appropriately. While investment thresholds represent the primary requirement, various fees contribute to the total expense.', 'normal', 'para7'),
    
    createBlock('Government Fees Breakdown', 'h3', 'h3-4'),
    
    createListItem('Application processing fee: AED 2,800 (non-refundable)', 'list14'),
    createListItem('Medical examination: AED 300-500', 'list15'),
    createListItem('Emirates ID: AED 1,075 for 10-year visa', 'list16'),
    createListItem('Document attestation: AED 200-500 per document', 'list17'),
    
    createBlock('Benefits and Privileges', 'h2', 'h2-4'),
    
    createBlock('The Dubai Golden Visa confers numerous advantages beyond basic residency rights, creating a comprehensive ecosystem of benefits for visa holders and their families.', 'normal', 'para8'),
    
    createBlock('Family Sponsorship Rights', 'h3', 'h3-5'),
    
    createBlock('Golden Visa holders can sponsor immediate family members, including spouse and children regardless of age. This eliminates traditional age restrictions that affect standard residency visas, particularly benefiting families with adult children pursuing higher education.', 'normal', 'para9'),
    
    createBlock('Business and Employment Flexibility', 'h3', 'h3-6'),
    
    createListItem('Establish businesses without local sponsors in many sectors', 'list18'),
    createListItem('Work for own companies or other employers without restrictions', 'list19'),
    createListItem('100% ownership in mainland companies across numerous activities', 'list20'),
    createListItem('Extended absence allowances up to 12 months', 'list21'),
    
    createBlock('Tax Considerations', 'h2', 'h2-5'),
    
    createBlock('Dubai offers a tax-friendly environment with no personal income tax on salaries and most investment income. However, understanding the complete tax implications, including potential obligations in your home country, is essential for proper financial planning.', 'normal', 'para10'),
    
    createBlock('The UAE has double taxation agreements with over 130 countries, potentially reducing tax burdens for international investors and professionals. Corporate tax of 9% applies to mainland companies with profits exceeding AED 375,000 annually.', 'normal', 'para11'),
    
    createBlock('Living in Dubai as a Golden Visa Holder', 'h2', 'h2-6'),
    
    createBlock('Dubai offers an exceptional quality of life, combining modern infrastructure with cultural diversity. The city provides world-class healthcare, education, and entertainment facilities, making it ideal for families and professionals.', 'normal', 'para12'),
    
    createBlock('Cost of Living Considerations', 'h3', 'h3-7'),
    
    createBlock('Monthly expenses for a comfortable lifestyle in Dubai typically range from AED 10,000 to AED 25,000 depending on lifestyle choices:', 'normal', 'para13'),
    
    createListItem('Accommodation: AED 5,000-15,000 (two-bedroom apartment)', 'list22'),
    createListItem('Transportation: AED 1,000-3,000 (including car payments)', 'list23'),
    createListItem('Food and groceries: AED 2,000-4,000', 'list24'),
    createListItem('Education (per child): AED 3,000-8,000', 'list25'),
    createListItem('Healthcare insurance: AED 500-1,500 per person', 'list26'),
    
    createBlock('Best Residential Areas', 'h3', 'h3-8'),
    
    createBlock('Dubai Marina and JBR offer beachfront living with modern amenities, while Downtown Dubai provides proximity to business districts and iconic landmarks. Family-oriented communities like Arabian Ranches and Dubai Hills Estate offer villas with excellent schools and recreational facilities.', 'normal', 'para14'),
    
    createBlock('Business Opportunities', 'h2', 'h2-7'),
    
    createBlock('Golden Visa holders enjoy unprecedented freedom to establish and operate businesses across multiple sectors. Dubai\'s strategic location serves as a gateway between East and West, offering access to markets spanning Africa, Asia, and Europe.', 'normal', 'para15'),
    
    createBlock('Priority sectors receiving government support include technology, renewable energy, healthcare, education, and tourism. Free zones offer 100% foreign ownership, tax exemptions, and simplified setup procedures.', 'normal', 'para16'),
    
    createBlock('Comparison with Regional Programmes', 'h2', 'h2-8'),
    
    createBlock('When compared to other residency programmes in the region, Dubai\'s Golden Visa stands out for its comprehensive benefits and straightforward process. Unlike programmes requiring annual renewals or restrictive conditions, the Golden Visa provides genuine long-term stability.', 'normal', 'para17'),
    
    createBlock('Singapore\'s Global Investor Programme requires significantly higher investment thresholds, while European golden visa programmes often involve complex tax implications. Dubai\'s programme balances accessibility with meaningful benefits, making it attractive to a broader range of qualified individuals.', 'normal', 'para18'),
    
    createBlock('Future Outlook', 'h2', 'h2-9'),
    
    createBlock('The Dubai Golden Visa programme continues evolving, with recent expansions suggesting further liberalisation. Authorities regularly review eligibility criteria and introduce new categories targeting specific economic priorities.', 'normal', 'para19'),
    
    createBlock('Digital transformation initiatives are streamlining application processes, while blockchain technology may enhance document verification. The trend toward reduced thresholds and expanded categories indicates Dubai\'s commitment to attracting diverse talent and investment.', 'normal', 'para20'),
    
    createBlock('Conclusion', 'h2', 'h2-10'),
    
    createBlock('The Dubai Golden Visa represents more than just a residency permit; it embodies Dubai\'s vision for a sustainable, diversified economy built on global talent and investment. For qualified individuals, the programme offers unparalleled opportunities to establish roots in one of the world\'s most dynamic cities.', 'normal', 'conclusion1'),
    
    createBlock('Success in securing a Golden Visa requires careful preparation, thorough documentation, and often professional guidance. However, the benefits – from family security to business flexibility and premium service access – justify the investment of time and resources required.', 'normal', 'conclusion2'),
    
    createBlockWithMarks([
      {
        _type: 'span',
        _key: uuidv4(),
        text: 'Ready to begin your Dubai Golden Visa journey? ',
        marks: ['strong']
      },
      {
        _type: 'span',
        _key: uuidv4(),
        text: 'Start your application today and join thousands of successful applicants who have made Dubai their long-term home.',
        marks: []
      }
    ], [], 'normal', 'cta')
  ];
  
  const post = {
    _id: postId,
    _type: 'post',
    title: 'Dubai Golden Visa 2025: Comprehensive Guide',
    slug: {
      _type: 'slug',
      current: slug
    },
    featuredImage: featuredImageId ? {
      _type: 'image',
      alt: 'Dubai skyline at golden hour showcasing modern architecture',
      asset: {
        _type: 'reference',
        _ref: featuredImageId
      },
      credit: 'Generated by Flux Schnell'
    } : undefined,
    categories: [{
      _key: uuidv4(),
      _ref: 'N49R87StLCedgcysgqApOx' // Golden Visa category
    }],
    publishedAt: new Date().toISOString(),
    body: body,
    excerpt: 'Complete guide to Dubai Golden Visa requirements, eligibility, costs, and application process for investors and professionals in 2025.',
    metaTitle: 'Dubai Golden Visa 2025 - Requirements & Process',
    metaDescription: 'Dubai Golden Visa 2025 complete guide. AED 2M investment requirement, application process, benefits, and eligibility for investors and professionals.',
    focusKeyword: 'Dubai golden visa',
    searchVolume: 8100,
    cpc: 3.45,
    contentTier: 'tier1',
    featured: true,
    readTime: 12,
    generationCost: 0.006,
    tags: []
  };
  
  console.log('📤 Publishing to Sanity...');
  const result = await client.create(post);
  
  console.log('✅ Article published successfully!');
  console.log(`🔗 Slug: ${slug}`);
  console.log(`🆔 ID: ${result._id}`);
  console.log(`📊 Reading time: ${post.readTime} minutes`);
  console.log(`💰 Cost: $${post.generationCost}`);
  
  return result;
}

generateArticle().catch(console.error);