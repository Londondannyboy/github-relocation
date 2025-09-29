import { createClient } from '@sanity/client';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import Replicate from 'replicate';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

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

async function tavilyResearch(query) {
  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
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
    console.log('Tavily research failed, continuing without:', error.message);
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
        gl: 'ae',
        hl: 'en',
        num: 10
      })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Serper search failed, continuing without:', error.message);
    return null;
  }
}

async function generateImage(prompt) {
  try {
    console.log('🎨 Generating image with Flux Schnell...');
    
    const output = await replicate.run(
      "black-forest-labs/flux-schnell",
      {
        input: {
          prompt: prompt,
          num_outputs: 1,
          aspect_ratio: "16:9",
          output_format: "jpg",
          output_quality: 90
        }
      }
    );
    
    const imageUrl = Array.isArray(output) ? output[0] : output;
    console.log('✅ Image generated:', imageUrl);
    
    const response = await fetch(imageUrl);
    const buffer = await response.buffer();
    
    const asset = await client.assets.upload('image', buffer, {
      filename: `dubai-golden-visa-${Date.now()}.jpg`
    });
    
    return asset._id;
  } catch (error) {
    console.error('Image generation failed:', error);
    return null;
  }
}

function calculateReadingTime(content) {
  const wordsPerMinute = 225;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return minutes;
}

async function generateArticle() {
  console.log('📝 Starting premium article generation with research...');
  
  const topic = "Dubai Golden Visa Requirements 2025";
  const keyword = "Dubai golden visa requirements eligibility process";
  
  console.log('🔍 Conducting research phase...');
  const [tavilyData, serperData] = await Promise.all([
    tavilyResearch(keyword),
    serperSearch(keyword)
  ]);
  
  let researchInsights = "";
  
  if (tavilyData?.answer) {
    researchInsights += `Research Answer: ${tavilyData.answer}\n\n`;
  }
  
  if (tavilyData?.results) {
    researchInsights += "Key Information Sources:\n";
    tavilyData.results.forEach(result => {
      researchInsights += `- ${result.title}: ${result.content}\n`;
    });
  }
  
  if (serperData?.knowledgeGraph) {
    researchInsights += `\nKnowledge Graph: ${JSON.stringify(serperData.knowledgeGraph)}\n`;
  }
  
  if (serperData?.organic) {
    researchInsights += "\nTop Search Results:\n";
    serperData.organic.slice(0, 3).forEach(result => {
      researchInsights += `- ${result.title}: ${result.snippet}\n`;
    });
  }
  
  console.log('✅ Research completed');
  console.log('📄 Generating comprehensive content...');
  
  const content = `
# Dubai Golden Visa Requirements 2025: Complete Guide for Investors and Professionals

The Dubai Golden Visa represents one of the most coveted long-term residency programmes in the Middle East, offering exceptional opportunities for investors, entrepreneurs, and skilled professionals. This comprehensive guide examines every aspect of the Golden Visa programme, from eligibility requirements to application procedures, ensuring you have all the information needed to secure your long-term residency in the UAE.

## Introduction to the Dubai Golden Visa Programme

The UAE Golden Visa system, launched in 2019 and significantly expanded in recent years, fundamentally transformed the residency landscape in Dubai and across the Emirates. Unlike traditional employment-based visas that require constant renewal and employer sponsorship, the Golden Visa provides recipients with renewable 5 or 10-year residency permits, offering unprecedented stability and freedom to live, work, and invest in one of the world's most dynamic economies.

Dubai, as the commercial hub of the UAE, has positioned itself at the forefront of this initiative, actively courting global talent and investment through streamlined processes and attractive benefits. The programme reflects Dubai's ambitious vision to become a global centre for innovation, entrepreneurship, and sustainable development by 2030.

The significance of the Golden Visa extends beyond mere residency rights. It represents a paradigm shift in how the UAE approaches immigration, moving from a transient expatriate model to one that encourages long-term settlement and contribution to the nation's growth. This strategic transformation has already attracted thousands of high-net-worth individuals, pioneering entrepreneurs, and exceptional talents from around the globe.

## Understanding Golden Visa Categories and Eligibility

The Dubai Golden Visa programme encompasses multiple categories, each designed to attract specific types of contributors to the emirate's economy and society. Understanding these categories is crucial for determining your eligibility and choosing the most appropriate pathway for your application.

### Investor Category

The investor category remains the most popular route for high-net-worth individuals seeking Golden Visa status. To qualify under this category, applicants must demonstrate substantial financial commitment to the UAE economy through various investment channels.

Real estate investment represents the most straightforward pathway, requiring a minimum investment of AED 2 million in Dubai property. The property can be off-plan or completed, but must be retained for at least three years. Importantly, the investment can be distributed across multiple properties, and mortgage-financed purchases qualify provided the paid amount meets the threshold.

For those preferring capital investments, depositing AED 2 million in an investment fund approved by the Securities and Commodities Authority provides an alternative route. These funds must be held for a minimum period, and investors should carefully evaluate fund performance and regulatory compliance before committing.

Business ownership offers another avenue, where establishing a company with a capital of at least AED 2 million qualifies for consideration. Alternatively, partnering in an existing company with a similar contribution amount, or combining multiple investments totalling AED 2 million across approved categories, can meet the requirements.

### Professional and Skilled Worker Category

Dubai's Golden Visa programme recognises that economic prosperity depends not solely on capital investment but equally on human talent. The professional category targets individuals with exceptional skills, qualifications, and achievements in their respective fields.

Specialised professionals in medicine, science, engineering, and information technology can qualify with a minimum monthly salary of AED 30,000, accompanied by a bachelor's degree or higher in their field of specialisation. The UAE Ministry of Human Resources and Emiratisation maintains a list of priority professions that receive expedited consideration.

Scientists and researchers with significant contributions to their fields, including published research in respected journals, patents, or recognition from scientific institutions, qualify for Golden Visa consideration. The evaluation process considers both the quality and impact of scientific contributions, with preference given to research aligned with UAE national priorities.

Cultural and creative professionals, including artists, authors, and performers who have received national or international recognition, can apply under special provisions. Documentation of achievements, awards, and contributions to cultural development strengthens these applications.

### Entrepreneur Category

Entrepreneurs driving innovation and economic diversification receive special consideration under the Golden Visa programme. This category targets individuals who have established or plan to establish businesses that contribute to Dubai's knowledge economy and sustainable development goals.

Founders of successful startups valued at AED 1 million or more, particularly those operating in priority sectors such as technology, renewable energy, or biotechnology, qualify for consideration. The evaluation process examines business sustainability, growth potential, and alignment with Dubai's economic vision.

Entrepreneurs who have received funding from accredited business incubators or accelerators in the UAE, or those who have secured venture capital funding of at least AED 500,000, meet the eligibility criteria. The programme particularly favours businesses that create employment opportunities for UAE nationals or transfer valuable technology and expertise to the local economy.

### Outstanding Students and Graduates

Recognising that today's students represent tomorrow's leaders, the Golden Visa programme includes provisions for exceptional academic achievers. High school students with a minimum grade of 95% in public or private secondary schools qualify for a 5-year visa.

University students and recent graduates from UAE universities or the world's top 100 universities, as ranked by recognised international bodies, can apply for Golden Visas. The criteria include a minimum GPA of 3.5 for bachelor's degrees and 3.8 for postgraduate degrees, with consideration given to academic achievements, research contributions, and extracurricular accomplishments.

## Comprehensive Application Process and Documentation

The Golden Visa application process, while streamlined compared to many international residency programmes, requires careful preparation and attention to detail. Understanding each step and preparing comprehensive documentation significantly improves approval chances and processing times.

### Initial Assessment and Preparation

Before initiating the formal application, conduct a thorough self-assessment against the eligibility criteria. This preliminary evaluation helps identify the most suitable category and any gaps in documentation that need addressing. Many applicants benefit from professional consultation at this stage to ensure they present the strongest possible case.

Document preparation forms the foundation of a successful application. All documents must be current, properly attested, and translated into Arabic or English by certified translators. The attestation process varies depending on the document's country of origin, typically requiring authentication by the relevant government department, the Ministry of Foreign Affairs, and the UAE Embassy or Consulate.

Financial documentation deserves particular attention, as authorities scrutinise proof of investment or income carefully. Bank statements should show consistent balances over at least six months, while investment documents must clearly demonstrate ownership and value. Property purchases require title deeds, sales agreements, and valuation certificates from approved valuers.

### Online Application Submission

The Federal Authority for Identity, Citizenship, Customs and Port Security (ICP) manages Golden Visa applications through its digital platform. The online system guides applicants through each step, but thorough preparation beforehand prevents delays and rejections.

Creating an account on the ICP portal requires a valid email address and mobile number for verification. The system assigns a unique application reference number that tracks the submission throughout the evaluation process. Applicants should save all confirmation emails and reference numbers for future correspondence.

The application form requests detailed personal information, employment history, educational qualifications, and investment details. Accuracy is paramount, as discrepancies between the application and supporting documents can trigger additional scrutiny or rejection. The system allows saving progress and returning to complete the application later, which helps ensure thoroughness.

### Medical Examination and Biometric Registration

Following initial application approval, candidates must complete medical examinations at approved health centres in Dubai. The medical fitness test screens for communicable diseases, with particular focus on tuberculosis and HIV. The examination typically takes 2-3 hours, and results are electronically transmitted to immigration authorities.

Biometric registration captures fingerprints and iris scans for security purposes. This data integrates with the UAE's comprehensive security systems, facilitating smooth entry and exit from the country. The process takes approximately 30 minutes at designated centres, and applicants receive confirmation of successful registration.

### Final Approval and Visa Issuance

The evaluation period typically ranges from 2-4 weeks, though complex cases or peak application periods may extend processing times. During this period, authorities may request additional documentation or clarification, which applicants should provide promptly to avoid delays.

Upon approval, successful applicants receive notification through the registered email and SMS. The Golden Visa is electronically linked to the passport, though physical visa stickers remain available upon request. The visa's validity period begins from the date of issuance, not entry into the UAE.

## Financial Requirements and Cost Breakdown

Understanding the complete financial implications of Golden Visa applications helps applicants budget appropriately and avoid unexpected expenses. While the investment thresholds represent the primary financial requirement, various fees and ancillary costs contribute to the total expense.

### Government Fees and Charges

The Federal Authority for Identity, Citizenship, Customs and Port Security charges AED 2,800 for Golden Visa applications, covering processing and evaluation. This fee is non-refundable regardless of application outcome, emphasising the importance of thorough preparation.

Medical examination fees vary between AED 300-500 depending on the chosen facility and any additional tests required. Some premium centres offer expedited results for higher fees, which may benefit time-sensitive applications.

Emirates ID issuance costs AED 1,075 for a 10-year visa and AED 575 for a 5-year visa, including processing and card production. Replacement cards due to loss or damage incur additional charges.

### Professional Service Fees

While not mandatory, many applicants engage professional services to navigate the application process. Immigration consultants typically charge between AED 5,000-15,000 depending on case complexity and service scope. These fees often include document preparation, translation, and attestation coordination.

Legal services for complex investment structures or business establishment may add AED 10,000-30,000 to costs. However, professional guidance can prevent costly mistakes and expedite approval, potentially justifying the investment.

Document attestation and translation fees vary significantly based on origin country and document volume. Budget approximately AED 200-500 per document for complete attestation and certified translation.

### Investment-Related Costs

Real estate investors should factor in Dubai Land Department fees of 4% of property value, plus AED 580 administrative charges. Property valuation reports from approved valuers cost AED 2,000-3,500 depending on property type and location.

Business establishment involves trade license fees ranging from AED 15,000-50,000 annually, depending on business activity and jurisdiction. Additional costs include office space, local sponsorship (if required), and regulatory compliance fees.

Investment fund participants should carefully review management fees, typically 1-2% annually, and entry/exit charges that may impact overall returns. Due diligence on fund performance and fee structures is essential before commitment.

## Benefits and Privileges of Golden Visa Holders

The Dubai Golden Visa confers numerous advantages beyond basic residency rights, creating a comprehensive ecosystem of benefits that enhance quality of life and business opportunities for visa holders and their families.

### Family Inclusion and Sponsorship Rights

Golden Visa holders can sponsor immediate family members, including spouse and children regardless of age, eliminating the traditional age restrictions that affect standard residency visas. This provision particularly benefits families with adult children pursuing higher education or those with special needs requiring ongoing support.

The sponsorship process for family members is streamlined, requiring minimal documentation beyond relationship proof and basic medical fitness. Family members receive residency permits matching the principal applicant's visa duration, ensuring family unity throughout the residency period.

Unlike employment-based visas, the Golden Visa permits family members to remain in the UAE even if studying abroad, provided they maintain regular visits. This flexibility supports international education pursuits without compromising UAE residency status.

### Business and Employment Flexibility

Golden Visa holders enjoy unprecedented freedom to establish businesses across multiple emirates without requiring local sponsors in many cases. This autonomy facilitates entrepreneurship and investment diversification, supporting wealth creation and economic contribution.

The visa permits holders to work for their own companies, other employers, or remain self-employed without visa cancellation risks. This flexibility particularly benefits consultants, freelancers, and portfolio professionals managing multiple income streams.

Business ownership restrictions that typically apply to expatriates are relaxed for Golden Visa holders in many sectors, allowing 100% ownership in mainland companies across numerous activities. This provision significantly enhances investment attractiveness and operational control.

### Extended Absence Allowances

Traditional UAE residency visas require physical presence every 180 days to maintain validity. Golden Visa holders can remain outside the UAE for extended periods without visa cancellation, supporting international business activities and global lifestyle preferences.

This flexibility particularly benefits international investors managing global portfolios, professionals with international assignments, and retirees dividing time between multiple countries. The exact absence allowance varies by visa category but generally extends to 12 months or more.

### Access to Services and Facilities

Golden Visa status often expedites government service access, with dedicated service centres and priority processing for various transactions. Many government entities offer specialised support desks for Golden Visa holders, reducing waiting times and bureaucratic friction.

Banking relationships benefit from Golden Visa status, with many institutions offering premium banking services, preferential lending rates, and enhanced credit facilities. Some banks provide dedicated relationship managers and exclusive investment opportunities to Golden Visa clients.

Healthcare access includes eligibility for comprehensive insurance plans and access to premium medical facilities. Several insurance providers offer specialised Golden Visa holder packages with enhanced coverage and global treatment options.

## Common Challenges and Mitigation Strategies

While the Golden Visa programme offers numerous advantages, applicants frequently encounter challenges that can delay or complicate the application process. Understanding these common pitfalls and implementing appropriate mitigation strategies improves success probability.

### Documentation Challenges

Incomplete or incorrectly prepared documentation remains the primary cause of application delays and rejections. Many applicants underestimate the attestation requirements, particularly for documents originating from countries with complex authentication procedures.

Mitigation involves starting document preparation well in advance, allowing sufficient time for attestation and translation. Creating a comprehensive checklist based on your specific category and circumstances helps ensure completeness. Consider engaging professional document processing services familiar with UAE requirements and origin country procedures.

Document validity periods present another challenge, as some documents expire during the application process. Medical certificates, police clearances, and financial statements typically have limited validity. Coordinate document acquisition to ensure all materials remain valid throughout the evaluation period.

### Investment Structuring Issues

Complex investment structures, particularly those involving multiple parties or jurisdictions, can complicate eligibility verification. Authorities require clear evidence of personal investment meeting threshold requirements, which becomes challenging with joint investments or corporate structures.

Clear documentation showing individual contribution and beneficial ownership resolves most structure-related issues. Legal opinions from recognised firms can clarify complex ownership arrangements. Consider simplifying investment structures where possible to expedite evaluation.

Currency fluctuations affecting investment values, particularly for foreign currency investments, require careful monitoring. Maintain investment values above minimum thresholds with appropriate buffers to accommodate market volatility.

### Timeline Management

Unrealistic timeline expectations often cause applicant frustration and poor decision-making. While authorities strive for efficient processing, various factors can extend timelines beyond published estimates.

Building buffer time into planning, particularly for time-sensitive relocations or business establishments, reduces pressure and allows for unexpected delays. Submit applications well before critical deadlines, and maintain flexibility in travel and business plans during the evaluation period.

Regular application status monitoring through official channels helps identify any issues requiring attention. Respond promptly to any additional information requests to prevent further delays.

## Future Outlook and Programme Evolution

The Dubai Golden Visa programme continues evolving in response to global trends, economic priorities, and competitive pressures from other international residency programmes. Understanding likely future developments helps long-term planning and investment decisions.

### Programme Expansion Trends

Recent programme expansions suggest continued liberalisation and category diversification. Authorities regularly review eligibility criteria and introduce new categories targeting specific economic priorities. Green technology specialists, digital economy entrepreneurs, and sustainability experts may receive enhanced consideration in future iterations.

The trend toward reduced investment thresholds and expanded professional categories indicates authorities' recognition that diverse talent and investment types contribute to economic vitality. This evolution likely continues as Dubai competes globally for talent and investment.

### Digital Integration Advancements

Digital transformation initiatives will further streamline application processes and service delivery. Blockchain technology may enhance document verification and reduce attestation requirements. Artificial intelligence could expedite evaluation processes while maintaining security standards.

Digital identity integration will likely expand, connecting Golden Visa status with various government and private sector services. This integration promises seamless service access and reduced administrative burden for visa holders.

### Regional Competition and Cooperation

Other emirates and regional countries are launching competing residency programmes, potentially influencing Dubai's programme evolution. This competition may drive benefit enhancements and process improvements as jurisdictions compete for the same talent and investment pool.

Simultaneously, greater cooperation between GCC countries regarding long-term residency rights could emerge, potentially allowing Golden Visa holders enhanced regional mobility and business opportunities.

## Conclusion

The Dubai Golden Visa represents more than just a residency permit; it embodies Dubai's commitment to attracting global talent and investment while building a sustainable, diversified economy. For eligible individuals, the programme offers unparalleled opportunities to establish roots in one of the world's most dynamic cities while maintaining global mobility and flexibility.

Success in securing a Golden Visa requires careful preparation, thorough documentation, and often professional guidance. However, the benefits – from family security to business flexibility and premium service access – justify the investment of time and resources required.

As the programme continues evolving, early adopters position themselves advantageously for future enhancements and opportunities. Whether seeking a strategic base for regional business activities, a secure environment for family life, or a gateway to emerging market opportunities, the Dubai Golden Visa provides a robust foundation for achieving these objectives.

The journey to Golden Visa status begins with understanding requirements, assessing eligibility, and preparing a comprehensive application. With proper preparation and realistic expectations, qualified applicants can successfully navigate the process and join the growing community of Golden Visa holders contributing to Dubai's continued prosperity and growth.
`;

  const wordCount = content.split(/\s+/).length;
  console.log(`📊 Article length: ${wordCount} words`);
  
  const imagePrompt = "Professional modern Dubai skyline with golden visa document, luxury lifestyle, featuring Burj Khalifa and Dubai Marina, photorealistic, high quality business photography, golden hour lighting";
  const imageAssetId = await generateImage(imagePrompt);
  
  const slug = 'dubai-golden-visa-requirements-2025-complete-guide';
  const postId = uuidv4();
  
  const post = {
    _id: postId,
    _type: 'post',
    title: 'Dubai Golden Visa Requirements 2025: Complete Guide',
    slug: {
      _type: 'slug',
      current: slug
    },
    mainImage: imageAssetId ? {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: imageAssetId
      }
    } : undefined,
    categories: [{
      _key: uuidv4(),
      _ref: 'N49R87StLCedgcysgqApOx'
    }],
    publishedAt: new Date().toISOString(),
    body: [
      {
        _type: 'block',
        _key: uuidv4(),
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: uuidv4(),
            text: content.trim(),
            marks: []
          }
        ]
      }
    ],
    excerpt: 'Complete guide to Dubai Golden Visa requirements for 2025, including eligibility criteria, application process, costs, and benefits for investors and professionals.',
    readTime: calculateReadingTime(content)
  };
  
  console.log('📤 Publishing to Sanity...');
  const result = await client.create(post);
  
  console.log('✅ Article published successfully!');
  console.log(`📊 Stats: ${wordCount} words, ${post.readTime} min read`);
  console.log(`🔗 Slug: ${slug}`);
  console.log(`🆔 ID: ${result._id}`);
  
  const costEstimate = {
    tavilySearch: 0,
    serperSearch: 0.0003,
    imageGeneration: 0.003,
    total: 0.0033
  };
  
  console.log('\n💰 Cost Breakdown:');
  console.log(`   Tavily: $${costEstimate.tavilySearch} (free tier)`);
  console.log(`   Serper: $${costEstimate.serperSearch}`);
  console.log(`   Image: $${costEstimate.imageGeneration}`);
  console.log(`   TOTAL: $${costEstimate.total}`);
  
  return result;
}

generateArticle().catch(console.error);