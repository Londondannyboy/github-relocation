#!/usr/bin/env node

import { createClient } from '@sanity/client';
import Replicate from 'replicate';
import axios from 'axios';

// Initialize Sanity client
const sanityClient = createClient({
  projectId: '93ewsltm',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: 'skgoNQFzPC3j0BAzMD0OvRqHPhgGBkcyLGJLGU97b770oRTI7Qz9qBWExxPEYVHtIVF82CbAG9kyt4Bd2WCybUZaaORM0BUYMHLCy45uNzs3b0HX1w4UCqJ3wAF1PFuHrBtf3CtugrlbxOQKxrGIQFTcehbSvVlF8LdE5EW0kg6VpnDI6BIC'
});

// Initialize Replicate
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN // Must be set in environment
});

async function generateImage(prompt) {
  console.log(`🎨 Generating image: ${prompt.substring(0, 50)}...`);
  
  try {
    const output = await replicate.run(
      "black-forest-labs/flux-1.1-pro",
      {
        input: {
          prompt: prompt,
          aspect_ratio: "16:9",
          output_format: "jpg",
          output_quality: 85,
          safety_tolerance: 3,
          prompt_upsampling: true
        }
      }
    );
    
    console.log('✅ Image generated successfully');
    return Array.isArray(output) ? output[0] : output;
  } catch (error) {
    console.error('❌ Error generating image:', error);
    return null;
  }
}

async function uploadImageToSanity(imageUrl, filename) {
  try {
    console.log(`📤 Uploading image to Sanity: ${filename}`);
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);
    
    const asset = await sanityClient.assets.upload('image', buffer, {
      filename: filename
    });
    
    console.log(`✅ Image uploaded: ${asset._id}`);
    return asset._id;
  } catch (error) {
    console.error('❌ Error uploading image:', error);
    return null;
  }
}

async function createTestArticle() {
  console.log('\n🚀 Creating Test Article: US Exit Tax Calculator Guide\n');
  console.log('=' .repeat(50));
  
  // Generate hero image
  const heroPrompt = "Professional office setting with tax documents, calculator, US passport on desk, modern business environment, photorealistic, high quality, bright lighting";
  const heroImageUrl = await generateImage(heroPrompt);
  
  // Generate content image
  const contentPrompt = "Tax forms and financial documents spread on desk, Form 8854 visible, professional accounting workspace, detailed, photorealistic";
  const contentImageUrl = await generateImage(contentPrompt);
  
  // Upload images to Sanity
  let heroImageId = null;
  let contentImageId = null;
  
  if (heroImageUrl) {
    heroImageId = await uploadImageToSanity(heroImageUrl, 'exit-tax-calculator-hero.jpg');
  }
  
  if (contentImageUrl) {
    contentImageId = await uploadImageToSanity(contentImageUrl, 'exit-tax-forms.jpg');
  }
  
  // Get category reference
  const taxCategory = await sanityClient.fetch(
    `*[_type == "category" && slug.current == "tax-finance"][0]`
  );
  
  // Get tag references
  const exitTaxTag = await sanityClient.fetch(
    `*[_type == "tag" && slug.current == "exit-tax"][0]`
  );
  
  const fatcaTag = await sanityClient.fetch(
    `*[_type == "tag" && slug.current == "fatca"][0]`
  );
  
  // Create article content with proper internal links (full URLs)
  const content = [
    {
      _type: 'block',
      style: 'normal',
      children: [{
        _type: 'span',
        text: 'The US exit tax is one of the most complex aspects of expatriation, affecting Americans who renounce their citizenship or give up their green cards. Our comprehensive exit tax calculator helps you understand your potential tax liability before making this life-changing decision.'
      }]
    },
    {
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: 'Understanding the US Exit Tax' }]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [{
        _type: 'span',
        text: 'The exit tax applies to "covered expatriates" - individuals who meet certain wealth or tax compliance thresholds. In 2025, you may be subject to exit tax if your net worth exceeds $2.5 million or your average annual income tax liability for the past 5 years exceeds $201,000.'
      }]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: 'For more detailed information on expatriation rules, visit our ' },
        {
          _type: 'span',
          marks: ['link1'],
          text: 'complete guide to US exit tax'
        },
        { _type: 'span', text: ' or explore ' },
        {
          _type: 'span',
          marks: ['link2'],
          text: 'FATCA compliance requirements'
        },
        { _type: 'span', text: '.' }
      ],
      markDefs: [
        {
          _key: 'link1',
          _type: 'link',
          href: 'https://relocation.quest/taxes/'
        },
        {
          _key: 'link2',
          _type: 'link',
          href: 'https://relocation.quest/taxes/'
        }
      ]
    },
    {
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: 'Key Forms and Documentation' }]
    }
  ];
  
  // Add content image if available
  if (contentImageId) {
    content.push({
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: contentImageId
      },
      alt: 'US tax forms including Form 8854 for expatriation',
      caption: 'Form 8854 is the primary document for expatriation tax compliance'
    });
  }
  
  content.push(
    {
      _type: 'block',
      style: 'normal',
      children: [{
        _type: 'span',
        text: 'Form 8854 is the cornerstone of exit tax compliance. This form must be filed with your final tax return and includes a comprehensive balance sheet of your worldwide assets. Missing the filing deadline can result in penalties of $10,000 or more.'
      }]
    },
    {
      _type: 'block',
      style: 'h3',
      children: [{ _type: 'span', text: 'Required Documentation' }]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [{
        _type: 'span',
        text: '• Complete balance sheet listing all assets and liabilities\n• Five years of tax returns to prove compliance\n• Valuation documents for real estate and business interests\n• Investment account statements\n• Retirement account valuations'
      }]
    },
    {
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: 'Exit Tax Calculator: How It Works' }]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [{
        _type: 'span',
        text: 'Our exit tax calculator considers several factors to estimate your potential tax liability:'
      }]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [{
        _type: 'span',
        text: '1. **Net Worth Test**: Assets minus liabilities exceeding $2.5 million\n2. **Income Tax Test**: Average tax liability over $201,000 (2025 threshold)\n3. **Compliance Test**: Filed all required returns for 5 years\n4. **Exclusion Amount**: First $866,000 of gains excluded from tax'
      }]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: 'For alternative relocation strategies without renunciation, explore our guides on ' },
        {
          _type: 'span',
          marks: ['link3'],
          text: 'Cyprus non-dom status'
        },
        { _type: 'span', text: ' or ' },
        {
          _type: 'span',
          marks: ['link4'],
          text: 'Portugal NHR program'
        },
        { _type: 'span', text: '.' }
      ],
      markDefs: [
        {
          _key: 'link3',
          _type: 'link',
          href: 'https://relocation.quest/countries/cyprus/'
        },
        {
          _key: 'link4',
          _type: 'link',
          href: 'https://relocation.quest/countries/portugal/'
        }
      ]
    },
    {
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: 'Frequently Asked Questions' }]
    },
    {
      _type: 'block',
      style: 'h3',
      children: [{ _type: 'span', text: 'Who is considered a covered expatriate?' }]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [{
        _type: 'span',
        text: 'A covered expatriate is someone who meets any of these criteria: net worth of $2.5 million or more, average annual income tax liability exceeding $201,000 for the past 5 years, or failure to certify tax compliance for the previous 5 years.'
      }]
    },
    {
      _type: 'block',
      style: 'h3',
      children: [{ _type: 'span', text: 'Can I avoid the exit tax?' }]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [{
        _type: 'span',
        text: 'There are limited exceptions for dual citizens from birth and certain minors. Strategic planning before reaching the thresholds is essential. Consider consulting with a tax professional specializing in expatriation.'
      }]
    }
  );
  
  // Create the article document
  const article = {
    _type: 'post',
    title: 'US Exit Tax Calculator: Estimate Your Expatriation Tax Liability',
    slug: {
      current: 'us-exit-tax-calculator-guide'
    },
    excerpt: 'Calculate your potential US exit tax liability. Understand Form 8854 requirements and covered expatriate rules for 2025.', // Under 200 chars
    body: content,
    status: 'published',
    publishedAt: new Date().toISOString(),
    
    // Media
    featuredImage: heroImageId ? {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: heroImageId
      },
      alt: 'US Exit Tax Calculator Guide'
    } : undefined,
    
    // SEO fields
    metaTitle: 'US Exit Tax Calculator 2025 | Expatriation Tax Guide',
    metaDescription: 'Free US exit tax calculator. Estimate your expatriation tax liability, understand Form 8854 requirements, and covered expatriate rules for 2025.',
    focusKeyword: 'exit tax calculator',
    searchVolume: 180,
    cpc: 4.20,
    
    // Taxonomy
    category: taxCategory ? {
      _type: 'reference',
      _ref: taxCategory._id
    } : undefined,
    
    tags: [
      exitTaxTag && { _type: 'reference', _ref: exitTaxTag._id },
      fatcaTag && { _type: 'reference', _ref: fatcaTag._id }
    ].filter(Boolean),
    
    // Content tier
    contentTier: 'pillar',
    generationCost: 0.006 // Just for images
  };
  
  try {
    const result = await sanityClient.create(article);
    
    console.log('\n' + '=' .repeat(50));
    console.log('✅ ARTICLE CREATED SUCCESSFULLY!');
    console.log('=' .repeat(50));
    console.log(`\n📄 Title: ${article.title}`);
    console.log(`🔗 URL: https://relocation.quest/posts/${article.slug.current}`);
    console.log(`📸 Hero Image: ${heroImageId ? 'Yes' : 'No'}`);
    console.log(`📸 Content Image: ${contentImageId ? 'Yes' : 'No'}`);
    console.log(`🏷️ Category: ${taxCategory ? 'Tax & Finance' : 'Not set'}`);
    console.log(`🔍 Focus Keyword: ${article.focusKeyword}`);
    console.log(`📊 Search Volume: ${article.searchVolume}/month`);
    console.log(`💰 CPC: $${article.cpc}`);
    console.log('\n✨ Features:');
    console.log('  • Full URL internal links (4 links)');
    console.log('  • Hero image (Flux Pro generated)');
    console.log('  • Content image (Flux Pro generated)');
    console.log('  • FAQ section');
    console.log('  • Proper excerpt under 200 chars');
    console.log('\n🚀 View at: https://relocation.quest/posts/us-exit-tax-calculator-guide');
    
    return result;
    
  } catch (error) {
    console.error('\n❌ Error creating article:', error);
    return null;
  }
}

// Run the script
createTestArticle().catch(console.error);