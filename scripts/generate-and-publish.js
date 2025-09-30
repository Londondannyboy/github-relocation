/**
 * Generate and publish a post directly to Sanity
 * Runs Three-Agent System and publishes immediately
 */

import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const client = createClient({
  projectId: '93ewsltm',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false
});

async function generateAndPublish(topic, category) {
  console.log(`\n🚀 Generating and Publishing: ${topic}\n`);
  
  try {
    // Step 1: Run Three-Agent System
    console.log('📝 Running Three-Agent System...');
    await runAgentPipeline(topic, category);
    
    // Step 2: Find the generated file
    const files = await fs.readdir('./published');
    const latestFile = files
      .filter(f => f.startsWith('final-') && f.endsWith('.json'))
      .sort()
      .pop();
    
    if (!latestFile) {
      throw new Error('No generated file found');
    }
    
    // Step 3: Read and prepare post
    console.log('📖 Reading generated post...');
    const content = await fs.readFile(`./published/${latestFile}`, 'utf-8');
    const post = JSON.parse(content);
    
    // Step 4: Fix category and tag references
    console.log('🔧 Fixing references...');
    await fixReferences(post);
    
    // Step 5: Publish to Sanity
    console.log('🚀 Publishing to Sanity...');
    const result = await client.create(post);
    
    console.log(`\n✅ SUCCESS! Published to Sanity`);
    console.log(`📄 ID: ${result._id}`);
    console.log(`🔗 Title: ${result.title}`);
    console.log(`🏷️ Categories: ${post.categories?.length || 0}`);
    console.log(`🌐 View at: https://relocation.quest/posts/${post.slug.current}`);
    
    return result;
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

function runAgentPipeline(topic, category) {
  return new Promise((resolve, reject) => {
    const child = spawn('node', [
      'scripts/agents/orchestrate-agents.js',
      topic,  // Pass topic as first argument
      category  // Pass category as second argument (not concatenated)
    ], {
      stdio: 'inherit'
    });
    
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Pipeline failed with code ${code}`));
    });
  });
}

async function fixReferences(post) {
  // Get category IDs
  const categories = await client.fetch(`*[_type == "category"]`);
  const categoryMap = {};
  categories.forEach(cat => {
    categoryMap[cat.title] = cat._id;
  });
  
  // Fix category references
  if (post.categories && Array.isArray(post.categories)) {
    const fixedCategories = [];
    
    for (const cat of post.categories) {
      if (typeof cat === 'string') {
        // Find matching category
        const categoryId = categoryMap[cat] || categoryMap['Digital Nomad'];
        if (categoryId) {
          fixedCategories.push({
            _type: 'reference',
            _ref: categoryId,
            _key: 'cat' + fixedCategories.length
          });
        }
      }
    }
    
    post.categories = fixedCategories;
  }
  
  // Fix tag references
  if (post.tags && Array.isArray(post.tags)) {
    const tags = await client.fetch(`*[_type == "tag"]`);
    const tagMap = {};
    tags.forEach(tag => {
      tagMap[tag.name] = tag._id;
    });
    
    const fixedTags = [];
    for (const tag of post.tags) {
      if (typeof tag === 'string') {
        // Create tag if doesn't exist
        let tagId = tagMap[tag];
        if (!tagId) {
          const newTag = await client.create({
            _type: 'tag',
            name: tag,
            slug: { current: tag.toLowerCase().replace(/\s+/g, '-') }
          });
          tagId = newTag._id;
        }
        
        fixedTags.push({
          _type: 'reference',
          _ref: tagId,
          _key: 'tag' + fixedTags.length
        });
      }
    }
    
    post.tags = fixedTags;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const topic = process.argv[2] || 'Cyprus Non-Dom Tax Benefits 2025';
  const category = process.argv[3] || 'Tax Strategies';
  
  generateAndPublish(topic, category)
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}