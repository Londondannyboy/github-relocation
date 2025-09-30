/**
 * Background Improvement Agent
 * Continuously improves existing posts in the background
 * 
 * Features:
 * - Runs autonomously in background
 * - Prioritizes lowest-quality posts
 * - Updates outdated information
 * - Improves SEO and formatting
 * - Adds internal links
 * - Updates statistics and data
 */

import { createClient } from '@sanity/client';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fetch from 'node-fetch';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '..', '.env.local') });

const client = createClient({
  projectId: '93ewsltm',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class BackgroundImprovementAgent {
  constructor(options = {}) {
    this.batchSize = options.batchSize || 5;
    this.interval = options.interval || 300000; // 5 minutes
    this.running = false;
    this.improvements = 0;
    this.errors = 0;
  }

  async start() {
    console.log('🤖 Background Improvement Agent Starting...');
    console.log(`📋 Settings: Batch size ${this.batchSize}, Interval ${this.interval/1000}s\n`);
    
    this.running = true;
    
    while (this.running) {
      await this.improveBatch();
      
      if (this.running) {
        console.log(`⏸️  Waiting ${this.interval/1000}s before next batch...\n`);
        await new Promise(resolve => setTimeout(resolve, this.interval));
      }
    }
  }

  async improveBatch() {
    try {
      // Find posts that need improvement
      const posts = await this.findPostsToImprove();
      
      if (posts.length === 0) {
        console.log('✅ All posts are optimized!');
        return;
      }
      
      console.log(`\n🔍 Found ${posts.length} posts to improve`);
      
      for (const post of posts) {
        await this.improvePost(post);
      }
      
      console.log(`\n📊 Batch complete: ${this.improvements} improved, ${this.errors} errors`);
      
    } catch (error) {
      console.error('❌ Batch error:', error.message);
      this.errors++;
    }
  }

  async findPostsToImprove() {
    // Priority criteria for improvement
    const query = `
      *[_type == "post"] | order(_updatedAt asc) [0...${this.batchSize}] {
        _id,
        title,
        content,
        categories,
        seoTitle,
        seoDescription,
        focusKeyphrase,
        schemaMarkup,
        _updatedAt,
        "wordCount": length(pt::text(content)),
        "categoryCount": count(categories)
      }
    `;
    
    const posts = await client.fetch(query);
    
    // Filter for posts that need improvement
    return posts.filter(post => {
      const needsImprovement = 
        !post.seoTitle ||
        !post.seoDescription ||
        !post.focusKeyphrase ||
        !post.schemaMarkup ||
        post.categoryCount < 2 ||
        post.wordCount < 1500;
      
      return needsImprovement;
    });
  }

  async improvePost(post) {
    console.log(`\n🔧 Improving: ${post.title}`);
    
    try {
      const improvements = {};
      
      // 1. Check and improve SEO
      if (!post.seoTitle || !post.seoDescription || !post.focusKeyphrase) {
        const seo = await this.improveSEO(post);
        Object.assign(improvements, seo);
        console.log('  ✅ SEO improved');
      }
      
      // 2. Add schema markup if missing
      if (!post.schemaMarkup) {
        improvements.schemaMarkup = this.generateSchema(post);
        console.log('  ✅ Schema markup added');
      }
      
      // 3. Improve categorization
      if (post.categoryCount < 2) {
        const categories = await this.improveCategories(post);
        if (categories.length > 0) {
          improvements.categories = categories;
          console.log('  ✅ Categories expanded');
        }
      }
      
      // 4. Update content with fresh data
      const updatedContent = await this.updateContent(post);
      if (updatedContent.changed) {
        improvements.content = updatedContent.content;
        console.log('  ✅ Content refreshed with new data');
      }
      
      // 5. Add internal links
      const linkedContent = await this.addInternalLinks(post, updatedContent.content || post.content);
      if (linkedContent.changed) {
        improvements.content = linkedContent.content;
        console.log('  ✅ Internal links added');
      }
      
      // Apply improvements
      if (Object.keys(improvements).length > 0) {
        await client
          .patch(post._id)
          .set(improvements)
          .commit();
        
        this.improvements++;
        console.log(`  ✨ Post improved successfully!`);
      } else {
        console.log('  ℹ️  Post already optimized');
      }
      
    } catch (error) {
      console.error(`  ❌ Error improving post: ${error.message}`);
      this.errors++;
    }
  }

  async improveSEO(post) {
    const prompt = `
Analyze this post and generate optimized SEO metadata:

Title: ${post.title}
Content preview: ${post.content?.substring(0, 500) || ''}

Generate:
1. SEO Title (50-60 chars, include primary keyword)
2. Meta Description (150-160 chars, compelling and includes keyword)
3. Focus Keyphrase (2-4 words, high search volume term)

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
      seoTitle: lines.find(l => l.startsWith('TITLE:'))?.replace('TITLE:', '').trim(),
      seoDescription: lines.find(l => l.startsWith('DESCRIPTION:'))?.replace('DESCRIPTION:', '').trim(),
      focusKeyphrase: lines.find(l => l.startsWith('KEYPHRASE:'))?.replace('KEYPHRASE:', '').trim()
    };
  }

  generateSchema(post) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.seoTitle || post.title,
      description: post.seoDescription || '',
      author: {
        '@type': 'Organization',
        name: 'Relocation Quest'
      },
      datePublished: post._createdAt || new Date().toISOString(),
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

  async improveCategories(post) {
    // Get all categories
    const allCategories = await client.fetch(`*[_type == "category"]`);
    
    // Analyze content for category keywords
    const content = `${post.title} ${post.content}`.toLowerCase();
    const categories = [];
    
    const categoryKeywords = {
      'Golden Visa Programs': ['golden visa', 'investment', 'residency'],
      'Tax Strategies': ['tax', 'nhr', 'non-dom', 'tax optimization'],
      'Business Setup': ['company', 'business', 'startup', 'entrepreneur'],
      'Digital Nomad': ['nomad', 'remote', 'digital', 'freelance']
    };
    
    for (const [catName, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(kw => content.includes(kw))) {
        const category = allCategories.find(c => c.title === catName);
        if (category) {
          categories.push({
            _type: 'reference',
            _ref: category._id
          });
        }
      }
    }
    
    return categories.slice(0, 3); // Max 3 categories
  }

  async updateContent(post) {
    // Check if content needs updating (older than 30 days)
    const lastUpdated = new Date(post._updatedAt);
    const daysSinceUpdate = (Date.now() - lastUpdated) / (1000 * 60 * 60 * 24);
    
    if (daysSinceUpdate < 30) {
      return { changed: false };
    }
    
    // Use Perplexity to get fresh data
    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [{
            role: 'user',
            content: `Find the latest 2025 updates for: ${post.title}. 
            Provide only new information, statistics, or regulatory changes from the last 3 months.`
          }],
          temperature: 0.7,
          max_tokens: 500
        })
      });
      
      const data = await response.json();
      
      if (data.choices && data.choices[0]) {
        const updates = data.choices[0].message.content;
        
        // Add update notice to content
        const updatedContent = `${post.content}\n\n## Latest Updates (${new Date().toLocaleDateString()})\n\n${updates}`;
        
        return {
          changed: true,
          content: updatedContent
        };
      }
    } catch (error) {
      console.log('  ⚠️  Could not fetch updates');
    }
    
    return { changed: false };
  }

  async addInternalLinks(post, content) {
    // Find related posts
    const relatedPosts = await client.fetch(`
      *[_type == "post" && _id != $id] | score(
        boost(title match $title, 3),
        boost(categories[]._ref in $categories, 2)
      ) | order(_score desc) [0...5] {
        title,
        slug
      }
    `, {
      id: post._id,
      title: post.title,
      categories: post.categories?.map(c => c._ref) || []
    });
    
    if (relatedPosts.length === 0) {
      return { changed: false };
    }
    
    // Add related posts section
    let updatedContent = content;
    if (!content.includes('## Related Articles')) {
      const relatedSection = '\n\n## Related Articles\n\n' +
        relatedPosts.map(p => `- [${p.title}](/posts/${p.slug.current})`).join('\n');
      
      updatedContent = content + relatedSection;
      
      return {
        changed: true,
        content: updatedContent
      };
    }
    
    return { changed: false };
  }

  stop() {
    console.log('\n🛑 Stopping Background Improvement Agent...');
    this.running = false;
  }

  getStats() {
    return {
      improvements: this.improvements,
      errors: this.errors,
      running: this.running
    };
  }
}

// Allow running standalone
if (import.meta.url === `file://${process.argv[1]}`) {
  const agent = new BackgroundImprovementAgent({
    batchSize: parseInt(process.argv[2]) || 5,
    interval: parseInt(process.argv[3]) || 300000 // 5 minutes default
  });
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    agent.stop();
    console.log('\n📊 Final stats:', agent.getStats());
    process.exit(0);
  });
  
  agent.start().catch(console.error);
}

export default BackgroundImprovementAgent;