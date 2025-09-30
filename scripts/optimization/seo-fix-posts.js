/**
 * SEO Optimization Script for Existing 999 Posts
 * 
 * Fixes:
 * 1. Category distribution (97% single-category problem)
 * 2. SEO meta tags and descriptions
 * 3. Schema markup
 * 4. Formatting (wall-of-text issues)
 * 5. Internal linking
 */

import { createClient } from '@sanity/client';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '..', '.env.local') });

const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID || '93ewsltm',
  dataset: process.env.PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Category mapping based on content
const CATEGORY_KEYWORDS = {
  'Golden Visa Programs': ['golden visa', 'investment visa', 'investor', 'property investment', 'residency by investment'],
  'Tax Strategies': ['tax', 'nhr', 'non-dom', 'tax optimization', 'tax regime', 'tax benefits', 'zero tax'],
  'Business Setup': ['company formation', 'business', 'startup', 'entrepreneur', 'e-residency', 'free zone'],
  'Cost of Living': ['cost of living', 'expenses', 'budget', 'affordable', 'cheap', 'expensive'],
  'Citizenship Programs': ['citizenship', 'passport', 'naturalization', 'dual citizenship'],
  'Healthcare & Education': ['healthcare', 'health insurance', 'schools', 'education', 'medical'],
  'Property Investment': ['real estate', 'property', 'rental', 'housing', 'apartment'],
  'Banking & Finance': ['bank account', 'banking', 'crypto', 'finance', 'offshore']
};

async function analyzeAndFixPost(post) {
  console.log(`\n📝 Processing: ${post.title}`);
  
  try {
    const updates = {
      _id: post._id,
      _type: 'post'
    };
    
    // 1. Fix Categories (Multi-category assignment)
    const categories = await assignCategories(post);
    if (categories.length > 0) {
      updates.categories = categories.map(cat => ({
        _type: 'reference',
        _ref: cat._id
      }));
      console.log(`  ✅ Categories: ${categories.map(c => c.title).join(', ')}`);
    }
    
    // 2. Fix SEO Meta
    if (!post.seoTitle || !post.seoDescription) {
      const seoMeta = await generateSEOMeta(post);
      updates.seoTitle = seoMeta.title;
      updates.seoDescription = seoMeta.description;
      updates.focusKeyphrase = seoMeta.keyphrase;
      console.log(`  ✅ SEO: ${seoMeta.keyphrase}`);
    }
    
    // 3. Fix Formatting (Break walls of text)
    if (needsFormatting(post.content)) {
      updates.content = await improveFormatting(post.content);
      console.log(`  ✅ Formatting: Improved paragraph breaks`);
    }
    
    // 4. Add Schema Markup
    if (!post.schemaMarkup) {
      updates.schemaMarkup = generateSchema(post);
      console.log(`  ✅ Schema: Added structured data`);
    }
    
    // 5. Calculate Reading Time
    const wordCount = countWords(post.content);
    updates.readingTime = Math.ceil(wordCount / 200);
    
    // Update in Sanity
    await client
      .patch(post._id)
      .set(updates)
      .commit();
    
    return { success: true, id: post._id };
    
  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
    return { success: false, id: post._id, error: error.message };
  }
}

async function assignCategories(post) {
  // Get all categories
  const allCategories = await client.fetch(`*[_type == "category"]`);
  
  const assignedCategories = [];
  const content = `${post.title} ${post.content}`.toLowerCase();
  
  // Check each category's keywords
  for (const [categoryName, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const hasKeyword = keywords.some(keyword => content.includes(keyword));
    if (hasKeyword) {
      const category = allCategories.find(c => c.title === categoryName);
      if (category) {
        assignedCategories.push(category);
      }
    }
  }
  
  // Always assign at least Digital Nomad if no other categories match
  if (assignedCategories.length === 0) {
    const digitalNomad = allCategories.find(c => c.title === 'Digital Nomad');
    if (digitalNomad) assignedCategories.push(digitalNomad);
  }
  
  // Limit to 3 categories max
  return assignedCategories.slice(0, 3);
}

async function generateSEOMeta(post) {
  const prompt = `
Generate SEO metadata for this post about international relocation:

Title: ${post.title}
First 500 chars: ${post.content.substring(0, 500)}

Provide:
1. SEO Title (50-60 chars)
2. Meta Description (150-160 chars)
3. Focus Keyphrase (2-4 words)

Format:
TITLE: [title]
DESCRIPTION: [description]
KEYPHRASE: [keyphrase]
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{
      role: 'user',
      content: prompt
    }],
    temperature: 0.7,
    max_tokens: 200
  });
  
  const result = response.choices[0].message.content;
  const lines = result.split('\n');
  
  return {
    title: lines.find(l => l.startsWith('TITLE:'))?.replace('TITLE:', '').trim() || post.title,
    description: lines.find(l => l.startsWith('DESCRIPTION:'))?.replace('DESCRIPTION:', '').trim() || '',
    keyphrase: lines.find(l => l.startsWith('KEYPHRASE:'))?.replace('KEYPHRASE:', '').trim() || ''
  };
}

function needsFormatting(content) {
  // Check if content has walls of text (paragraphs > 5 sentences)
  const paragraphs = content.split('\n\n');
  return paragraphs.some(p => {
    const sentences = p.split(/[.!?]+/).filter(s => s.trim().length > 0);
    return sentences.length > 5;
  });
}

async function improveFormatting(content) {
  // Break up long paragraphs
  const paragraphs = content.split('\n\n');
  const formatted = paragraphs.map(p => {
    const sentences = p.split(/([.!?]+)/).filter(s => s.trim());
    
    if (sentences.length <= 6) return p;
    
    // Group sentences into smaller paragraphs (2-3 sentences each)
    const newParagraphs = [];
    for (let i = 0; i < sentences.length; i += 4) {
      const chunk = sentences.slice(i, i + 4).join('');
      if (chunk.trim()) newParagraphs.push(chunk.trim());
    }
    
    return newParagraphs.join('\n\n');
  });
  
  return formatted.join('\n\n');
}

function generateSchema(post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.seoDescription || post.excerpt || '',
    author: {
      '@type': 'Organization',
      name: 'Relocation Quest'
    },
    datePublished: post.publishedAt || new Date().toISOString(),
    dateModified: new Date().toISOString(),
    publisher: {
      '@type': 'Organization',
      name: 'Relocation Quest',
      logo: {
        '@type': 'ImageObject',
        url: 'https://relocation.quest/logo.png'
      }
    }
  };
}

function countWords(content) {
  return content.split(/\s+/).filter(word => word.length > 0).length;
}

async function main() {
  console.log('🚀 Starting SEO Optimization for 999 Posts\n');
  
  try {
    // Fetch all posts
    const posts = await client.fetch(`
      *[_type == "post"][0...999] {
        _id,
        title,
        content,
        categories,
        seoTitle,
        seoDescription,
        focusKeyphrase,
        schemaMarkup,
        publishedAt
      }
    `);
    
    console.log(`📊 Found ${posts.length} posts to optimize\n`);
    
    // Process in batches of 10
    const batchSize = 10;
    const results = { success: 0, failed: 0 };
    
    for (let i = 0; i < posts.length; i += batchSize) {
      const batch = posts.slice(i, i + batchSize);
      console.log(`\n🔄 Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(posts.length/batchSize)}`);
      
      const batchResults = await Promise.all(
        batch.map(post => analyzeAndFixPost(post))
      );
      
      batchResults.forEach(result => {
        if (result.success) results.success++;
        else results.failed++;
      });
      
      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('\n✅ SEO Optimization Complete!');
    console.log(`📈 Success: ${results.success}`);
    console.log(`❌ Failed: ${results.failed}`);
    
    // Final category distribution check
    const categoryDist = await client.fetch(`
      *[_type == "post"] {
        "categories": categories[]->title
      } | {
        "distribution": categories[].categories | order() | {"name": @, "count": count(^[categories[] == @])}
      }
    `);
    
    console.log('\n📊 Final Category Distribution:');
    console.log(categoryDist);
    
  } catch (error) {
    console.error('Fatal error:', error);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default main;