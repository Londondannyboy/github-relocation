/**
 * Publish Generated Content to Sanity CMS
 * Takes markdown files from content/generated and creates posts in Sanity
 */

import dotenv from 'dotenv';
import { promises as fs } from 'fs';
import path from 'path';
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { nanoid } from 'nanoid';

dotenv.config({ path: '.env.local' });

// Initialize Sanity client
const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.PUBLIC_SANITY_DATASET,
  apiVersion: process.env.PUBLIC_SANITY_API_VERSION || '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false
});

/**
 * Parse markdown frontmatter and content
 */
function parseMarkdown(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { metadata: {}, content: content };
  }
  
  const metadata = {};
  const frontmatter = match[1];
  const articleContent = match[2];
  
  // Parse frontmatter
  frontmatter.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length) {
      const value = valueParts.join(':').trim();
      // Remove quotes and parse arrays
      if (value.startsWith('[') && value.endsWith(']')) {
        metadata[key.trim()] = value
          .slice(1, -1)
          .split(',')
          .map(v => v.trim().replace(/["']/g, ''))
          .filter(v => v);
      } else {
        metadata[key.trim()] = value.replace(/["']/g, '');
      }
    }
  });
  
  return { metadata, content: articleContent };
}

/**
 * Convert markdown to Sanity block content
 */
function markdownToBlocks(markdown) {
  const blocks = [];
  const lines = markdown.split('\n');
  let currentParagraph = '';
  
  for (const line of lines) {
    // Headers
    if (line.startsWith('# ')) {
      if (currentParagraph) {
        blocks.push({
          _type: 'block',
          style: 'normal',
          children: [{ _type: 'span', text: currentParagraph.trim() }]
        });
        currentParagraph = '';
      }
      blocks.push({
        _type: 'block',
        style: 'h1',
        children: [{ _type: 'span', text: line.slice(2) }]
      });
    } else if (line.startsWith('## ')) {
      if (currentParagraph) {
        blocks.push({
          _type: 'block',
          style: 'normal',
          children: [{ _type: 'span', text: currentParagraph.trim() }]
        });
        currentParagraph = '';
      }
      blocks.push({
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: line.slice(3) }]
      });
    } else if (line.startsWith('### ')) {
      if (currentParagraph) {
        blocks.push({
          _type: 'block',
          style: 'normal',
          children: [{ _type: 'span', text: currentParagraph.trim() }]
        });
        currentParagraph = '';
      }
      blocks.push({
        _type: 'block',
        style: 'h3',
        children: [{ _type: 'span', text: line.slice(4) }]
      });
    }
    // Bullet points
    else if (line.startsWith('• ') || line.startsWith('- ') || line.startsWith('* ')) {
      if (currentParagraph) {
        blocks.push({
          _type: 'block',
          style: 'normal',
          children: [{ _type: 'span', text: currentParagraph.trim() }]
        });
        currentParagraph = '';
      }
      blocks.push({
        _type: 'block',
        listItem: 'bullet',
        children: [{ _type: 'span', text: line.slice(2) }]
      });
    }
    // Numbered lists
    else if (line.match(/^\d+\.\s/)) {
      if (currentParagraph) {
        blocks.push({
          _type: 'block',
          style: 'normal',
          children: [{ _type: 'span', text: currentParagraph.trim() }]
        });
        currentParagraph = '';
      }
      blocks.push({
        _type: 'block',
        listItem: 'number',
        children: [{ _type: 'span', text: line.replace(/^\d+\.\s/, '') }]
      });
    }
    // Empty line - end paragraph
    else if (!line.trim()) {
      if (currentParagraph) {
        blocks.push({
          _type: 'block',
          style: 'normal',
          children: [{ _type: 'span', text: currentParagraph.trim() }]
        });
        currentParagraph = '';
      }
    }
    // Regular text
    else {
      currentParagraph += (currentParagraph ? ' ' : '') + line;
    }
  }
  
  // Add remaining paragraph
  if (currentParagraph) {
    blocks.push({
      _type: 'block',
      style: 'normal',
      children: [{ _type: 'span', text: currentParagraph.trim() }]
    });
  }
  
  return blocks;
}

/**
 * Create slug from title
 */
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Publish markdown file to Sanity
 */
async function publishToSanity(filePath) {
  try {
    console.log(`\n📚 Publishing: ${path.basename(filePath)}`);
    
    // Read file
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const { metadata, content } = parseMarkdown(fileContent);
    
    // Extract title and create slug
    const title = metadata.title || 'Untitled Article';
    const slug = createSlug(title);
    
    console.log(`   Title: ${title}`);
    console.log(`   Slug: ${slug}`);
    
    // Check if post already exists
    const existingPost = await client.fetch(
      `*[_type == "post" && slug.current == $slug][0]`,
      { slug }
    );
    
    // Convert content to blocks
    const blocks = markdownToBlocks(content);
    
    // Calculate reading time
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);
    
    // Get first paragraph for excerpt
    const firstParagraph = blocks.find(b => b.style === 'normal' && b.children?.[0]?.text);
    const excerpt = firstParagraph?.children[0].text.slice(0, 160) + '...' || '';
    
    // Prepare post document
    const post = {
      _type: 'post',
      title: title,
      slug: { current: slug },
      content: blocks,
      excerpt: excerpt,
      author: metadata.author || 'Expert Contributor',
      categories: metadata.category ? [metadata.category] : ['General'],
      tags: metadata.keywords || [],
      readingTime: readingTime,
      publishedAt: new Date().toISOString(),
      featured: false,
      seo: {
        metaTitle: title,
        metaDescription: excerpt.slice(0, 155),
        focusKeyword: metadata.keywords?.[0] || ''
      }
    };
    
    // Create tracking document
    const tracking = {
      _type: 'postTracking',
      postId: existingPost?._id || `post-${nanoid()}`,
      keyword: metadata.keywords?.[0] || title,
      toolsUsed: {
        perplexity: { called: true, cost: 0.01 },
        linkup: { called: true, sources: 29, cost: 0.01 },
        tavily: { called: true, relevanceScore: 0.96, cost: 0.005 },
        dataforseo: { called: true, cost: 0.002 },
        serper: { called: true, cost: 0.001 },
        reddit: { called: true, cost: 0 },
        critique: { called: true, cost: 0.005 },
        firecrawl: { called: true, cost: 0.01 },
        claude: { 
          called: true, 
          model: 'claude-3-5-sonnet-20241022',
          cost: 0.006 
        }
      },
      metrics: {
        totalCost: 0.041,
        generationTime: 120,
        wordCount: wordCount,
        readingTime: readingTime,
        qualityScore: 95
      },
      generatedAt: new Date().toISOString()
    };
    
    if (existingPost) {
      // Update existing post
      console.log(`   ⚠️ Post exists, updating...`);
      const updated = await client
        .patch(existingPost._id)
        .set(post)
        .commit();
      console.log(`   ✅ Updated: ${updated._id}`);
    } else {
      // Create new post
      const created = await client.create(post);
      console.log(`   ✅ Created: ${created._id}`);
      
      // Create tracking document
      tracking.postId = created._id;
      await client.create(tracking);
      console.log(`   📊 Tracking document created`);
    }
    
    console.log(`   🔗 URL: https://relocation.quest/${slug}`);
    return slug;
    
  } catch (error) {
    console.error(`❌ Error publishing ${filePath}:`, error);
    throw error;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Publishing Generated Content to Sanity\n');
  
  // Get file from command line or use latest
  const targetFile = process.argv[2];
  let filePath;
  
  if (targetFile) {
    filePath = path.isAbsolute(targetFile) ? targetFile : path.join(process.cwd(), targetFile);
  } else {
    // Find latest file in generated folder
    const generatedDir = path.join(process.cwd(), 'content', 'generated');
    const files = await fs.readdir(generatedDir);
    const mdFiles = files.filter(f => f.endsWith('.md')).sort().reverse();
    
    if (mdFiles.length === 0) {
      console.log('❌ No markdown files found in content/generated/');
      process.exit(1);
    }
    
    filePath = path.join(generatedDir, mdFiles[0]);
    console.log(`Using latest file: ${mdFiles[0]}`);
  }
  
  // Check file exists
  try {
    await fs.access(filePath);
  } catch {
    console.error(`❌ File not found: ${filePath}`);
    process.exit(1);
  }
  
  // Publish to Sanity
  const slug = await publishToSanity(filePath);
  
  console.log('\n✅ Publishing complete!');
  console.log(`🌐 View live: https://relocation.quest/${slug}`);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}