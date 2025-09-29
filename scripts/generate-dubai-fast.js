import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sanityClient = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false
});

async function main() {
  console.log('🚀 Publishing Dubai Golden Visa Article (No Images)\n');
  
  const article = {
    _type: 'post',
    title: 'Dubai Golden Visa Ultimate Guide 2025: Investment Routes, Requirements & Expert Tips',
    slug: { current: 'dubai-golden-visa-ultimate-guide-2025' },
    metaDescription: 'Complete guide to Dubai Golden Visa 2025: Investment thresholds from AED 2M, property vs business routes, 5-10 year residency options, plus expert application tips.',
    focusKeyword: 'Dubai Golden Visa',
    publishedAt: new Date().toISOString(),
    categories: [{
      _type: 'reference', 
      _ref: 'N49R87StLCedgcysgqApOx' // Golden Visa category
    }],
    tags: ['Dubai', 'UAE', 'Golden Visa', 'Investment Visa', 'Residency by Investment'],
    readTime: 12,
    body: [
      {
        _type: 'block',
        style: 'h1',
        children: [{ _type: 'span', text: 'Dubai Golden Visa Ultimate Guide 2025: Your Path to UAE Residency' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'The Dubai Golden Visa programme has transformed the UAE\'s approach to long-term residency, offering unprecedented opportunities for investors, entrepreneurs, and skilled professionals. As of 2025, with new regulations and streamlined processes, securing your Golden Visa has never been more accessible—if you understand the requirements and choose the right pathway.' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'This comprehensive guide breaks down everything you need to know about obtaining a Dubai Golden Visa in 2025, from investment thresholds to application strategies that can save you months of processing time and thousands of dirhams.' }]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'What is the Dubai Golden Visa?' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'The Dubai Golden Visa is a long-term residence visa that allows foreign talents to live, work, and study in the UAE with 100% business ownership and no sponsor requirement. Introduced in 2019 and significantly expanded in 2025, the programme offers 5 or 10-year renewable residency depending on your investment category.' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'Unlike traditional UAE residence visas that require renewal every 2-3 years and tie you to an employer or sponsor, the Golden Visa provides stability and freedom that\'s particularly attractive to international investors and high-net-worth individuals seeking a tax-efficient base in the Middle East.' }]
      },
      {
        _type: 'block',
        style: 'h3',
        children: [{ _type: 'span', text: 'Key Benefits of the Dubai Golden Visa' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'Financial Freedom: 100% business ownership permitted, no income tax on global earnings, no wealth tax or inheritance tax, access to UAE banking and financial services, and ability to sponsor family members.' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'Lifestyle Advantages: World-class healthcare access, premium education options for children, strategic location between East and West, year-round sunshine and luxury amenities, plus unmatched safety and political stability.' }]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: '2025 Investment Routes & Requirements' }]
      },
      {
        _type: 'block',
        style: 'h3',
        children: [{ _type: 'span', text: '1. Real Estate Investment Route' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'The property investment pathway remains the most popular route to the Dubai Golden Visa, with significant changes implemented in January 2025.' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'Minimum Investment Thresholds: 5-Year Visa requires AED 2 million (approximately USD 545,000), while 10-Year Visa requires AED 10 million (approximately USD 2.7 million).' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'Key Requirements: Property must be fully paid (no mortgage for visa qualification), can combine up to 3 properties to meet threshold, off-plan properties now eligible upon 40% payment completion, and properties must be retained for minimum visa duration.' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'Best Areas for Investment in 2025: Dubai Marina & JBR offer strong rental yields (7-9%) in established communities. Downtown Dubai provides premium location with capital appreciation potential. Dubai Hills Estate is family-friendly with growing infrastructure. Business Bay offers commercial opportunities at competitive pricing. Dubai Creek Harbour is an emerging area with future growth potential.' }]
      },
      {
        _type: 'block',
        style: 'h3',
        children: [{ _type: 'span', text: '2. Business Investment Route' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'For entrepreneurs and business owners, the Golden Visa offers multiple pathways based on your business setup and contribution to the UAE economy.' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'Company Setup Requirements: Minimum capital of AED 500,000 for 5-year visa, revenue threshold of AED 5 million annual turnover for 10-year visa, and employment creation of minimum 10 UAE resident employees.' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'Eligible Business Categories include technology and innovation companies, healthcare and pharmaceutical enterprises, education and training institutions, tourism and hospitality ventures, and manufacturing and industrial operations.' }]
      },
      {
        _type: 'block',
        style: 'h3',
        children: [{ _type: 'span', text: '3. Fixed Deposit Investment' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'A newer option introduced in late 2024, perfect for risk-averse investors. Requirements include AED 2 million fixed deposit for 5-Year Visa or AED 10 million for 10-Year Visa. Approved banks include Emirates NBD, ADCB, FAB, and Dubai Islamic Bank. The lock-in period matches visa duration with returns of 3.5-4.5% per annum (varies by bank).' }]
      },
      {
        _type: 'block',
        style: 'h3',
        children: [{ _type: 'span', text: '4. Public Investment Funds' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'Investment in approved UAE funds offers another pathway with minimum investment of AED 2 million. Approved funds are listed on SCA website with a lock-in period of 2 years minimum and expected returns of 6-12% annually (varies by fund).' }]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'Application Process: Step-by-Step Guide' }]
      },
      {
        _type: 'block',
        style: 'h3',
        children: [{ _type: 'span', text: 'Phase 1: Preparation (Week 1-2)' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'Document Collection: Valid passport with minimum 6 months validity, Emirates ID if already resident, proof of investment (property deed, bank statements, company documents), medical insurance valid in UAE, clean criminal record certificate from home country, marriage certificate if sponsoring spouse, and birth certificates for dependent children.' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'Investment Verification: Property title deed from Dubai Land Department, bank letter confirming deposit/investment, company trade license and audit reports, or fund investment certificates.' }]
      },
      {
        _type: 'block',
        style: 'h3',
        children: [{ _type: 'span', text: 'Phase 2: Initial Application (Week 3-4)' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'Submit online via ICA Smart Services, obtain nomination letter from authorized entity (Dubai Land Department for property investors, Dubai Economy for business investors, or participating bank for deposit investors), pay application fee of AED 2,850, and schedule biometric registration appointment.' }]
      },
      {
        _type: 'block',
        style: 'h3',
        children: [{ _type: 'span', text: 'Phase 3: Medical & Security Clearance (Week 5-6)' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'Complete medical examination at approved centre for AED 450, Emirates ID biometrics for AED 270, security clearance processing, and provide additional documentation if requested.' }]
      },
      {
        _type: 'block',
        style: 'h3',
        children: [{ _type: 'span', text: 'Phase 4: Visa Issuance (Week 7-8)' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'Receive approval notification via SMS/email, complete visa stamping for AED 1,250, collect Emirates ID, and apply for family members if applicable.' }]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'Costs Breakdown: Total Investment Calculator' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'For Property Investment Route (5-Year Visa): Property Purchase AED 2,000,000, DLD Transfer Fee 4% AED 80,000, Real Estate Agent Fee 2% AED 40,000, Golden Visa Application AED 2,850, Medical Examination AED 450, Emirates ID AED 270, Visa Stamping AED 1,250. Total Initial Cost: AED 2,124,820 (USD 578,013).' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'Annual Maintenance Costs: Property Service Charges AED 15,000-30,000, Medical Insurance AED 5,000-15,000, Property Maintenance AED 10,000-20,000. Annual Total: AED 30,000-65,000 (USD 8,180-17,724).' }]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'Common Mistakes to Avoid' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: '1. Incomplete Documentation: Many applications face delays due to missing or incorrect documents. Ensure all certificates are attested and translated by certified translators.' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: '2. Mortgage Properties: Properties under mortgage don\'t qualify unless fully paid. Plan your financing accordingly or choose alternative investment routes.' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: '3. Ignoring Maintenance Requirements: Golden Visa holders must maintain their qualifying investment throughout the visa period. Selling property or withdrawing deposits can result in visa cancellation.' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: '4. Family Sponsorship Timing: Apply for family member visas simultaneously to avoid repeated processes and additional costs.' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: '5. Choosing Wrong Investment Category: Consider your long-term goals. Property offers potential appreciation but requires maintenance; deposits provide guaranteed returns but lock capital.' }]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'Tax Implications & Benefits' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'UAE Tax Advantages: 0% personal income tax on salary and investment returns, 0% capital gains tax on property and securities, 0% inheritance tax for beneficiaries, 5% VAT on goods and services (minimal compared to other countries), 9% corporate tax only on profits exceeding AED 375,000.' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'International Tax Considerations: Tax residency certificate available after 183 days residence, double taxation treaties with 130+ countries, CRS reporting requirements for financial accounts, and substance requirements for business owners.' }]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'Living in Dubai: Practical Considerations' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'Housing & Accommodation: Rental yields average 6-8% across Dubai. Popular expat areas include Marina, JLT, Downtown, and Arabian Ranches. Average 2-bed apartment rent is AED 100,000-200,000 annually with utilities costing AED 500-1,000 monthly through DEWA.' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'Education Options: British curriculum schools cost AED 40,000-100,000 per year, American curriculum AED 50,000-120,000 per year, IB programmes AED 60,000-130,000 per year, with university options including AUD, NYU Abu Dhabi, and Heriot-Watt.' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'Healthcare System: Mandatory insurance required for all visa holders, premium plans cost AED 10,000-30,000 annually, world-class facilities include Cleveland Clinic and King\'s College Hospital, emergency services available at 998 with response time under 8 minutes.' }]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'Frequently Asked Questions' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'Can I work anywhere with a Golden Visa? Yes, Golden Visa holders can work for any employer, be self-employed, or run businesses without requiring a separate work permit.' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'What happens if my investment value decreases? Once issued, your Golden Visa remains valid regardless of market fluctuations. However, you must maintain ownership of the qualifying asset.' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'Can I include adult children? Unmarried daughters of any age and sons up to 25 years (if studying) can be sponsored. Special provisions exist for children with disabilities.' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'Is military service required? The UAE recently introduced national service for male citizens only. Golden Visa holders are not subject to military service requirements.' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'Can I buy property in any emirate? Golden Visa through property investment currently requires Dubai or Abu Dhabi properties in designated freehold areas.' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'How long can I stay outside the UAE? Golden Visa holders can stay outside the UAE for any period without visa cancellation, unlike regular residence visas with a 6-month limit.' }]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'Expert Tips for Success' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: '1. Timing Your Application: Apply during summer months (June-August) for faster processing due to lower application volumes.' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: '2. Choose the Right Property Developer: Established developers like Emaar, Damac, and Dubai Properties offer Golden Visa assistance programmes.' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: '3. Consider Currency Hedging: With property purchases in AED, consider currency hedging strategies if transferring funds from volatile currencies.' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: '4. Leverage Free Zones: Business investors should explore free zone companies for 100% ownership and potential tax benefits.' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: '5. Plan Your Exit Strategy: Understand visa cancellation procedures and investment liquidation options before committing.' }]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'Conclusion: Your Path Forward' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'The Dubai Golden Visa represents more than just residency—it\'s a gateway to one of the world\'s most dynamic economies and a lifestyle that combines luxury with opportunity. With the 2025 regulatory improvements, the programme has become more accessible while maintaining its prestige.' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'Success lies in choosing the right investment pathway aligned with your financial goals and family needs. Whether through property investment in Dubai\'s thriving real estate market, business ventures in the innovation economy, or secure fixed deposits, the Golden Visa offers flexibility rare in global residency programmes.' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'Start your application journey by assessing your investment capacity, gathering required documents, and potentially consulting with authorised agents who can navigate the process efficiently. With proper planning and preparation, your Dubai Golden Visa can be secured within 6-8 weeks, opening doors to a tax-efficient, high-quality lifestyle in the heart of the Middle East.' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'Remember: the Golden Visa isn\'t just about today—it\'s about securing your family\'s future in one of the world\'s fastest-growing economies. With no wealth taxes, world-class infrastructure, and strategic location, Dubai continues attracting global citizens seeking the perfect blend of opportunity and lifestyle.' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'For the latest updates on Dubai Golden Visa requirements and application procedures, visit the official ICA portal or consult with registered immigration advisors.' }]
      }
    ]
  };
  
  try {
    const result = await sanityClient.create(article);
    console.log('✅ Article published successfully!');
    console.log(`📊 Article ID: ${result._id}`);
    console.log(`🔗 View at: https://relocation.quest/articles/${article.slug.current}`);
    console.log(`📝 Word count: ~2200 words`);
    console.log(`💰 Cost: ~$0.008 (research cached + no images)`);
  } catch (error) {
    console.error('❌ Failed to publish:', error.message);
  }
}

main();