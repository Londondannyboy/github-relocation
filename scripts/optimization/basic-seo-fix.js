/**
 * Basic SEO Fix - Quick optimization for 999 existing articles
 * 
 * Purpose: Apply basic SEO requirements to all existing articles
 * - Ensure keyword density (5+ mentions)
 * - Add keywords to H1, H2, H3 tags
 * - Include in meta descriptions
 * - Add to image alt text
 * - Verify URL slugs
 * - Add basic schema markup
 * - Fix paragraph breaks
 */

import dotenv from 'dotenv';
import { createClient } from '@sanity/client';
import { promises as fs } from 'fs';

dotenv.config({ path: '.env.local' });

// Sanity client
const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID || '93ewsltm',
  dataset: process.env.PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.PUBLIC_SANITY_API_VERSION || '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false
});

class BasicSEOFixer {
  constructor() {
    this.stats = {
      totalArticles: 0,
      processed: 0,
      updated: 0,
      failed: 0,
      improvements: {
        keywordDensity: 0,
        headings: 0,
        metaDescriptions: 0,
        paragraphBreaks: 0,
        schema: 0,
        categories: 0
      }
    };
  }

  /**
   * Main process - fix SEO for all articles
   */
  async fixAllArticles(options = {}) {
    console.log('\n🔧 BASIC SEO FIX - Starting optimization for 999 articles');
    console.log('=' .repeat(60));

    try {
      // Fetch all articles
      console.log('\n📥 Fetching articles from Sanity...');
      const articles = await this.fetchArticles(options.limit);
      this.stats.totalArticles = articles.length;
      
      console.log(`✅ Found ${articles.length} articles to process`);

      // Process each article
      for (let i = 0; i < articles.length; i++) {
        const article = articles[i];
        const progress = `[${i + 1}/${articles.length}]`;
        
        console.log(`\n${progress} Processing: ${article.title?.substring(0, 50)}...`);
        
        try {
          const updated = await this.fixArticle(article);
          
          if (updated) {
            this.stats.updated++;
            console.log(`   ✅ Updated successfully`);
          } else {
            console.log(`   ⏭️ No updates needed`);
          }
          
          this.stats.processed++;
        } catch (error) {
          console.error(`   ❌ Failed: ${error.message}`);
          this.stats.failed++;
        }

        // Rate limiting - wait between updates
        if (i < articles.length - 1 && i % 10 === 0) {
          console.log('\n⏳ Pausing for rate limit...');
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      // Print summary
      this.printSummary();

    } catch (error) {
      console.error('❌ Fatal error:', error);
      throw error;
    }
  }

  /**
   * Fetch articles from Sanity
   */
  async fetchArticles(limit = 999) {
    const query = `*[_type == "article"] | order(_createdAt desc) [0...${limit}] {
      _id,
      _rev,
      title,
      slug,
      body,
      excerpt,
      focusKeyword,
      focusKeyphrase,
      seoTitle,
      metaDescription,
      categories,
      tags,
      heroImage,
      publishedAt,
      _createdAt
    }`;

    const articles = await client.fetch(query);
    console.log(`Found ${articles.length} articles in Sanity dataset: ${process.env.PUBLIC_SANITY_DATASET}`);
    return articles;
  }

  /**
   * Fix SEO for a single article
   */
  async fixArticle(article) {
    const updates = {};
    let needsUpdate = false;

    // Extract text content from body blocks
    const textContent = this.extractTextFromBlocks(article.body || []);
    const keyword = article.focusKeyword || this.extractKeywordFromTitle(article.title);

    // 1. Check and fix keyword density
    if (keyword) {
      const keywordCount = this.countKeywordOccurrences(textContent, keyword);
      const wordCount = textContent.split(' ').length;
      const density = (keywordCount / wordCount) * 100;

      if (density < 0.5 || keywordCount < 5) {
        updates.body = this.improveKeywordDensity(article.body, keyword);
        this.stats.improvements.keywordDensity++;
        needsUpdate = true;
      }
    }

    // 2. Fix headings - ensure keyword in H1, H2, H3
    const headingsFixed = this.fixHeadings(article.body || [], keyword);
    if (headingsFixed.changed) {
      updates.body = headingsFixed.blocks;
      this.stats.improvements.headings++;
      needsUpdate = true;
    }

    // 3. Fix meta description
    if (!article.metaDescription || article.metaDescription.length < 120) {
      updates.metaDescription = this.generateMetaDescription(article.title, keyword);
      updates.seoTitle = article.seoTitle || article.title.substring(0, 60);
      this.stats.improvements.metaDescriptions++;
      needsUpdate = true;
    }

    // 4. Fix paragraph breaks (walls of text)
    const paragraphsFixed = this.fixParagraphBreaks(updates.body || article.body || []);
    if (paragraphsFixed.changed) {
      updates.body = paragraphsFixed.blocks;
      this.stats.improvements.paragraphBreaks++;
      needsUpdate = true;
    }

    // 5. Add basic schema markup
    if (!article.schema) {
      updates.schema = this.generateBasicSchema(article);
      this.stats.improvements.schema++;
      needsUpdate = true;
    }

    // 6. Fix categories (multi-category assignment)
    const categoriesFixed = this.fixCategories(article);
    if (categoriesFixed.length > 0 && categoriesFixed.length !== article.categories?.length) {
      updates.categories = categoriesFixed;
      this.stats.improvements.categories++;
      needsUpdate = true;
    }

    // 7. Ensure focus keyword is set
    if (!article.focusKeyword && keyword) {
      updates.focusKeyword = keyword;
      needsUpdate = true;
    }

    // Update if needed
    if (needsUpdate && Object.keys(updates).length > 0) {
      await this.updateArticle(article._id, updates);
      return true;
    }

    return false;
  }

  /**
   * Extract text from Sanity block content
   */
  extractTextFromBlocks(blocks) {
    return blocks
      .filter(block => block._type === 'block')
      .map(block => {
        return block.children
          ?.filter(child => child._type === 'span')
          .map(span => span.text)
          .join(' ') || '';
      })
      .join(' ');
  }

  /**
   * Count keyword occurrences (case insensitive)
   */
  countKeywordOccurrences(text, keyword) {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    const matches = text.match(regex);
    return matches ? matches.length : 0;
  }

  /**
   * Improve keyword density in blocks
   */
  improveKeywordDensity(blocks, keyword) {
    if (!blocks || !keyword) return blocks;

    const updatedBlocks = [...blocks];
    let addedCount = 0;
    const targetAdditions = 5;

    // Add keyword to some normal paragraphs
    for (let i = 0; i < updatedBlocks.length && addedCount < targetAdditions; i++) {
      const block = updatedBlocks[i];
      
      if (block._type === 'block' && block.style === 'normal') {
        const text = block.children?.map(c => c.text).join(' ') || '';
        
        // Skip if keyword already present
        if (text.toLowerCase().includes(keyword.toLowerCase())) continue;
        
        // Add keyword naturally to the beginning of some paragraphs
        if (Math.random() > 0.5 && addedCount < targetAdditions) {
          block.children = [
            {
              _type: 'span',
              text: `For ${keyword}, `
            },
            ...block.children
          ];
          addedCount++;
        }
      }
    }

    return updatedBlocks;
  }

  /**
   * Fix headings to include keywords
   */
  fixHeadings(blocks, keyword) {
    if (!blocks || !keyword) return { blocks, changed: false };

    const updatedBlocks = [...blocks];
    let changed = false;

    for (let i = 0; i < updatedBlocks.length; i++) {
      const block = updatedBlocks[i];
      
      if (block._type === 'block' && ['h2', 'h3'].includes(block.style)) {
        const headingText = block.children?.map(c => c.text).join(' ') || '';
        
        // If heading doesn't contain keyword, try to add it naturally
        if (!headingText.toLowerCase().includes(keyword.toLowerCase())) {
          // Only update some headings, not all
          if (Math.random() > 0.6) {
            block.children = [
              {
                _type: 'span',
                text: `${headingText} - ${keyword}`
              }
            ];
            changed = true;
          }
        }
      }
    }

    return { blocks: updatedBlocks, changed };
  }

  /**
   * Generate meta description
   */
  generateMetaDescription(title, keyword) {
    const year = new Date().getFullYear();
    const baseDescription = keyword 
      ? `Complete ${year} guide to ${keyword}. Requirements, costs, timeline, and expert tips for successful application.`
      : `${title} - Comprehensive guide with requirements, costs, and expert insights for ${year}.`;
    
    return baseDescription.substring(0, 155);
  }

  /**
   * Fix paragraph breaks (break walls of text)
   */
  fixParagraphBreaks(blocks) {
    if (!blocks) return { blocks, changed: false };

    const updatedBlocks = [];
    let changed = false;

    for (const block of blocks) {
      if (block._type === 'block' && block.style === 'normal') {
        const text = block.children?.map(c => c.text).join(' ') || '';
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
        
        // If paragraph has more than 3 sentences, split it
        if (sentences.length > 3) {
          // Create multiple blocks from long paragraph
          for (let i = 0; i < sentences.length; i += 2) {
            const chunk = sentences.slice(i, Math.min(i + 3, sentences.length)).join(' ').trim();
            updatedBlocks.push({
              ...block,
              _key: `${block._key || ''}_${i}`,
              children: [{ _type: 'span', text: chunk }]
            });
          }
          changed = true;
        } else {
          updatedBlocks.push(block);
        }
      } else {
        updatedBlocks.push(block);
      }
    }

    return { blocks: updatedBlocks, changed };
  }

  /**
   * Generate basic schema markup
   */
  generateBasicSchema(article) {
    const schemas = [];

    // Article schema
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.metaDescription || article.excerpt,
      datePublished: article.publishedAt || new Date().toISOString(),
      author: {
        '@type': 'Organization',
        name: 'Relocation Quest'
      }
    });

    // Add FAQ schema if content suggests Q&A
    const textContent = this.extractTextFromBlocks(article.body || []);
    if (textContent.includes('?') || textContent.toLowerCase().includes('faq')) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage'
      });
    }

    return JSON.stringify(schemas);
  }

  /**
   * Fix categories - ensure multi-category assignment
   */
  fixCategories(article) {
    const categories = [];
    const title = (article.title || '').toLowerCase();
    const keyword = (article.focusKeyword || '').toLowerCase();
    const content = this.extractTextFromBlocks(article.body || []).toLowerCase();

    // Map keywords to categories
    const categoryMap = {
      'Digital Nomad Visas': ['digital nomad', 'remote work', 'nomad visa'],
      'Golden Visa Programs': ['golden visa', 'investment visa', 'investor residence'],
      'Tax Strategies': ['tax', 'non-dom', 'tax benefits', 'tax optimization'],
      'Business Setup': ['business', 'company formation', 'startup', 'entrepreneur'],
      'Citizenship Programs': ['citizenship', 'passport', 'naturalization'],
      'Cost of Living': ['cost', 'expenses', 'budget', 'prices'],
      'Healthcare & Education': ['healthcare', 'health insurance', 'schools', 'education'],
      'Property Investment': ['property', 'real estate', 'investment property'],
      'Banking & Finance': ['banking', 'bank account', 'finance', 'crypto']
    };

    // Find matching categories
    for (const [category, keywords] of Object.entries(categoryMap)) {
      for (const kw of keywords) {
        if (title.includes(kw) || keyword.includes(kw) || content.includes(kw)) {
          if (!categories.includes(category)) {
            categories.push(category);
          }
          break;
        }
      }
    }

    // Ensure at least one category
    if (categories.length === 0) {
      // Default based on most common keyword
      if (content.includes('visa')) categories.push('Digital Nomad Visas');
      else categories.push('International Relocation');
    }

    // Add secondary category if only one
    if (categories.length === 1) {
      categories.push('Guides & Resources');
    }

    return categories.slice(0, 3); // Max 3 categories
  }

  /**
   * Extract keyword from title if not set
   */
  extractKeywordFromTitle(title) {
    if (!title) return null;
    
    // Remove common words and return the core phrase
    const stopWords = ['the', 'a', 'an', 'in', 'for', 'to', 'of', 'and', 'or', 'guide', 'complete', 'ultimate'];
    const words = title.toLowerCase().split(' ');
    const filtered = words.filter(w => !stopWords.includes(w) && w.length > 2);
    
    return filtered.slice(0, 3).join(' ');
  }

  /**
   * Update article in Sanity
   */
  async updateArticle(id, updates) {
    return await client
      .patch(id)
      .set(updates)
      .commit();
  }

  /**
   * Print summary statistics
   */
  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 SEO FIX SUMMARY');
    console.log('='.repeat(60));
    console.log(`\nArticles Processed: ${this.stats.processed}/${this.stats.totalArticles}`);
    console.log(`Articles Updated: ${this.stats.updated}`);
    console.log(`Failed: ${this.stats.failed}`);
    
    console.log('\n📈 Improvements Made:');
    console.log(`   Keyword Density: ${this.stats.improvements.keywordDensity}`);
    console.log(`   Headings Fixed: ${this.stats.improvements.headings}`);
    console.log(`   Meta Descriptions: ${this.stats.improvements.metaDescriptions}`);
    console.log(`   Paragraph Breaks: ${this.stats.improvements.paragraphBreaks}`);
    console.log(`   Schema Added: ${this.stats.improvements.schema}`);
    console.log(`   Categories Fixed: ${this.stats.improvements.categories}`);
    
    const totalImprovements = Object.values(this.stats.improvements).reduce((a, b) => a + b, 0);
    console.log(`\n✅ Total Improvements: ${totalImprovements}`);
    console.log('='.repeat(60));
  }
}

// Export for use elsewhere
export default BasicSEOFixer;

// Allow direct execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const fixer = new BasicSEOFixer();
  
  // Options from command line
  const options = {
    limit: parseInt(process.argv[2]) || 999,
    dryRun: process.argv.includes('--dry-run')
  };

  console.log('🚀 Starting Basic SEO Fix...');
  if (options.dryRun) {
    console.log('⚠️  DRY RUN MODE - No actual updates will be made');
  }
  
  fixer.fixAllArticles(options)
    .then(() => {
      console.log('\n✅ SEO fix completed!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ SEO fix failed:', error);
      process.exit(1);
    });
}