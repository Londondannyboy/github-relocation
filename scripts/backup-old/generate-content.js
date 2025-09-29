#!/usr/bin/env node

import { createClient } from '@sanity/client';
import Replicate from 'replicate';
import axios from 'axios';
import dotenv from 'dotenv';
import { withCache, getCachedCompetitor, getCachedSERP, getCachedMetrics, cacheCompetitorContent, cacheSERPResults, cacheKeywordMetrics } from '../src/lib/cache.js';

dotenv.config();

// Initialize Sanity client
const sanityClient = createClient({
  projectId: '93ewsltm',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN || 'skTqzbDpQ9uWHpwJPk1XL6Xd0BuaSu9FXwNQZVtHa5xxzchB2jZGZQaURJ71hn1z2OsCqeLGiH2ooyrnEHcKFRKBlH24l6Fd6iHZA4hQw00RPVo8aBlclHBO4yTyMub5bDd9c8ICRuez9LyN5OE5T8o4cXvFrTXNnjozf0W7CZlZvd5CTvQE'
});

// Initialize Replicate
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
});

// Cost tracking
let totalCost = 0;
const costBreakdown = {
  serper: 0,
  firecrawl: 0,
  dataForSEO: 0,
  replicate: 0,
  openai: 0
};

// Log cost
function logCost(service, amount) {
  costBreakdown[service] = (costBreakdown[service] || 0) + amount;
  totalCost += amount;
  console.log(`💰 ${service}: $${amount.toFixed(4)} (Total: $${totalCost.toFixed(4)})`);
}

// Fetch SERP data with caching
async function getSERPData(keyword) {
  // Check cache first
  const cached = await getCachedSERP(keyword);
  if (cached) {
    console.log(`✅ Using cached SERP data for: ${keyword}`);
    return cached.results;
  }
  
  // Fetch fresh data
  console.log(`🔍 Fetching fresh SERP data for: ${keyword}`);
  
  // Mock SERP data for now (replace with actual Serper API call)
  const serpData = {
    organic: [
      { url: 'https://example.com/1', title: 'Example 1', snippet: 'Content...' },
      { url: 'https://example.com/2', title: 'Example 2', snippet: 'Content...' },
      { url: 'https://example.com/3', title: 'Example 3', snippet: 'Content...' }
    ],
    peopleAlsoAsk: [
      'What is exit tax?',
      'Who needs to pay exit tax?',
      'How to calculate exit tax?'
    ],
    relatedSearches: [
      'exit tax calculator',
      'form 8854',
      'covered expatriate'
    ]
  };
  
  // Cache the results
  await cacheSERPResults(keyword, serpData);
  logCost('serper', 0.0003); // $0.0003 per search
  
  return serpData;
}

// Get keyword metrics with caching
async function getKeywordMetrics(keyword) {
  // Check cache first
  const cached = await getCachedMetrics(keyword);
  if (cached) {
    console.log(`✅ Using cached metrics for: ${keyword}`);
    return cached;
  }
  
  // Mock metrics for now (replace with DataForSEO API)
  const metrics = {
    searchVolume: Math.floor(Math.random() * 5000) + 100,
    cpc: (Math.random() * 15 + 1).toFixed(2),
    difficulty: Math.floor(Math.random() * 100)
  };
  
  // Cache the metrics
  await cacheKeywordMetrics(keyword, metrics);
  logCost('dataForSEO', 0.01); // $0.01 per keyword
  
  return metrics;
}

// Generate image with Replicate
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
          output_quality: 85
        }
      }
    );
    
    logCost('replicate', 0.003); // $0.003 per image
    return output[0] || output;
  } catch (error) {
    console.error('Error generating image:', error);
    return null;
  }
}

// Upload image to Sanity
async function uploadImageToSanity(imageUrl, title) {
  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);
    
    const asset = await sanityClient.assets.upload('image', buffer, {
      filename: `${title.toLowerCase().replace(/\s+/g, '-')}.jpg`
    });
    
    return asset._id;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

// Generate article content
async function generateArticleContent(keyword, serpData, metrics) {
  // This would normally call OpenAI/Claude API
  // For now, using a template
  
  const content = [
    {
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: `Understanding ${keyword}` }]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [{ 
        _type: 'span', 
        text: `The ${keyword} is a critical consideration for anyone planning international relocation. With ${metrics.searchVolume} monthly searches and a CPC of $${metrics.cpc}, this topic represents significant interest in the relocation community.`
      }]
    },
    {
      _type: 'block',
      style: 'h3',
      children: [{ _type: 'span', text: 'Key Requirements' }]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [{ 
        _type: 'span', 
        text: 'Understanding the requirements is essential for compliance and avoiding penalties. Here are the main considerations...'
      }]
    }
  ];
  
  // Add FAQ section based on People Also Ask
  if (serpData.peopleAlsoAsk && serpData.peopleAlsoAsk.length > 0) {
    content.push({
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: 'Frequently Asked Questions' }]
    });
    
    serpData.peopleAlsoAsk.forEach(question => {
      content.push({
        _type: 'block',
        style: 'h3',
        children: [{ _type: 'span', text: question }]
      });
      content.push({
        _type: 'block',
        style: 'normal',
        children: [{ 
          _type: 'span', 
          text: `This is a comprehensive answer to the question: ${question}. It provides detailed information to help readers understand the topic better.`
        }]
      });
    });
  }
  
  logCost('openai', 0.002); // Estimated cost for GPT-4
  return content;
}

// Generate a single article
async function generateArticle(keyword, category = 'taxes') {
  console.log(`\n📝 Generating article for: ${keyword}`);
  console.log('=' .repeat(50));
  
  try {
    // Step 1: Get SERP data (cached)
    const serpData = await getSERPData(keyword);
    
    // Step 2: Get keyword metrics (cached)
    const metrics = await getKeywordMetrics(keyword);
    
    // Step 3: Generate content
    const content = await generateArticleContent(keyword, serpData, metrics);
    
    // Step 4: Generate hero image
    const imagePrompt = `Professional photo of ${keyword}, modern business setting, high quality, photorealistic, 16:9 aspect ratio`;
    const imageUrl = await generateImage(imagePrompt);
    
    // Step 5: Upload image to Sanity
    let featuredImageId = null;
    if (imageUrl) {
      featuredImageId = await uploadImageToSanity(imageUrl, keyword);
    }
    
    // Step 6: Create Sanity document
    const slug = keyword.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const title = keyword.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ') + ' - Complete 2025 Guide';
    
    const doc = {
      _type: 'post',
      title: title,
      slug: { current: slug },
      excerpt: `Comprehensive guide to ${keyword} with latest 2025 updates, requirements, and expert insights.`,
      body: content,
      metaTitle: `${title} | Relocation Quest`,
      metaDescription: `Everything you need to know about ${keyword}. Updated for 2025 with expert insights, requirements, and practical tips.`,
      focusKeyword: keyword,
      searchVolume: metrics.searchVolume,
      cpc: parseFloat(metrics.cpc),
      contentTier: metrics.searchVolume > 3000 ? 'pillar' : metrics.searchVolume > 1000 ? 'supporting' : 'standard',
      generationCost: totalCost,
      publishedAt: new Date().toISOString(),
      status: 'published'
    };
    
    // Add featured image if available
    if (featuredImageId) {
      doc.featuredImage = {
        _type: 'image',
        asset: { _ref: featuredImageId }
      };
    }
    
    // Create in Sanity
    const result = await sanityClient.create(doc);
    
    console.log(`✅ Article created: ${title}`);
    console.log(`   URL: /posts/${slug}`);
    console.log(`   Search Volume: ${metrics.searchVolume}`);
    console.log(`   CPC: $${metrics.cpc}`);
    console.log(`   Cost: $${totalCost.toFixed(4)}`);
    
    return result;
    
  } catch (error) {
    console.error(`❌ Error generating article for ${keyword}:`, error);
    return null;
  }
}

// Generate batch of articles
async function generateBatch(keywords, category) {
  console.log(`\n🚀 Starting batch generation for ${keywords.length} articles`);
  console.log('Category:', category);
  console.log('Keywords:', keywords.join(', '));
  console.log('\n');
  
  const results = [];
  
  for (const keyword of keywords) {
    const result = await generateArticle(keyword, category);
    results.push(result);
    
    // Reset cost for next article
    totalCost = 0;
    
    // Small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Print summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 BATCH GENERATION SUMMARY');
  console.log('='.repeat(50));
  console.log(`Total articles: ${results.filter(r => r).length}/${keywords.length}`);
  console.log(`Total cost: $${Object.values(costBreakdown).reduce((a, b) => a + b, 0).toFixed(2)}`);
  console.log('\nCost breakdown:');
  Object.entries(costBreakdown).forEach(([service, cost]) => {
    if (cost > 0) {
      console.log(`  ${service}: $${cost.toFixed(4)}`);
    }
  });
  
  return results;
}

// Main execution
async function main() {
  // Exit Tax articles (high-value, low competition)
  const exitTaxKeywords = [
    'exit tax USA',
    'form 8854 threshold',
    'covered expatriate tax',
    'streamlined filing compliance',
    'exit tax calculator'
  ];
  
  // Digital Nomad visa articles (high volume)
  const digitalNomadKeywords = [
    'digital nomad visa',
    'Japan digital nomad visa',
    'Slovenia digital nomad visa',
    'Bulgaria digital nomad visa',
    'digital nomad visa requirements'
  ];
  
  // Generate based on command line argument
  const batchType = process.argv[2] || 'test';
  
  switch (batchType) {
    case 'exit-tax':
      await generateBatch(exitTaxKeywords, 'taxes');
      break;
    case 'digital-nomad':
      await generateBatch(digitalNomadKeywords, 'visas');
      break;
    case 'test':
      // Just generate one test article
      await generateArticle('exit tax USA 2025', 'taxes');
      break;
    default:
      console.log('Usage: node generate-content.js [exit-tax|digital-nomad|test]');
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}