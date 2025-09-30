/**
 * Editor Agent - Polish, optimize, and prepare for publication
 * Part of the Three-Agent System for quality content generation
 * 
 * Purpose: Format for readability, add SEO elements, multi-category tagging
 * Output: Publication-ready post with schema markup
 */

import dotenv from 'dotenv';
import { promises as fs } from 'fs';
import path from 'path';
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import crypto from 'crypto';

dotenv.config({ path: '.env.local' });

// Sanity client setup
const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID || '93ewsltm',
  dataset: process.env.PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.PUBLIC_SANITY_API_VERSION || '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false
});

const builder = imageUrlBuilder(client);

class EditorAgent {
  constructor() {
    this.draft = null;
    this.finalArticle = {
      title: '',
      content: [],
      metadata: {},
      seo: {},
      schema: [],
      publishReady: false
    };
  }

  /**
   * Main editing pipeline
   */
  async editContent(draftPath) {
    console.log(`\n📝 Editor Agent starting...`);

    try {
      // Step 1: Load draft
      console.log('\n📖 Step 1: Loading draft...');
      await this.loadDraft(draftPath);

      // Step 2: Format for readability
      console.log('\n📐 Step 2: Formatting for readability...');
      await this.formatReadability();

      // Step 3: Add schema markup
      console.log('\n🏷️ Step 3: Adding schema markup...');
      await this.addSchemaMarkup();

      // Step 4: Multi-category tagging
      console.log('\n🗂️ Step 4: Applying multi-category tags...');
      await this.applyCategoryTags();

      // Step 5: Optimize for featured snippets
      console.log('\n⭐ Step 5: Optimizing for featured snippets...');
      await this.optimizeFeaturedSnippets();

      // Step 6: Add internal/external links
      console.log('\n🔗 Step 6: Adding strategic links...');
      await this.addStrategicLinks();

      // Step 7: Generate meta descriptions
      console.log('\n🔍 Step 7: Creating meta descriptions...');
      await this.generateMetaDescriptions();

      // Step 8: Final quality checks
      console.log('\n✅ Step 8: Running quality checks...');
      await this.runQualityChecks();

      // Step 9: Prepare for publication
      console.log('\n🚀 Step 9: Preparing for publication...');
      const article = await this.prepareForPublication();

      return article;

    } catch (error) {
      console.error('❌ Editor Agent Error:', error);
      throw error;
    }
  }

  /**
   * Load draft from file
   */
  async loadDraft(draftPath) {
    try {
      const draftContent = await fs.readFile(draftPath, 'utf-8');
      this.draft = JSON.parse(draftContent);
      
      this.finalArticle.title = this.draft.title;
      this.finalArticle.metadata = this.draft.metadata;
      
      console.log(`✅ Draft loaded: ${this.draft.title}`);
    } catch (error) {
      console.error('Error loading draft:', error);
      throw error;
    }
  }

  /**
   * Format content for maximum readability
   */
  async formatReadability() {
    const content = this.draft.content;
    
    // Split into paragraphs
    const paragraphs = content.split('\n\n');
    const formattedParagraphs = [];

    for (const paragraph of paragraphs) {
      // Skip if it's a heading or list
      if (paragraph.startsWith('#') || paragraph.startsWith('-') || paragraph.startsWith('|')) {
        formattedParagraphs.push(paragraph);
        continue;
      }

      // Break long paragraphs (more than 3 sentences)
      const sentences = paragraph.match(/[^.!?]+[.!?]+/g) || [paragraph];
      
      if (sentences.length > 3) {
        // Group into 2-3 sentence paragraphs
        const chunks = [];
        for (let i = 0; i < sentences.length; i += 2) {
          const chunk = sentences.slice(i, Math.min(i + 3, sentences.length)).join(' ');
          chunks.push(chunk.trim());
        }
        formattedParagraphs.push(...chunks);
      } else {
        formattedParagraphs.push(paragraph);
      }
    }

    // Add formatting enhancements
    let formattedContent = formattedParagraphs.join('\n\n');

    // Add bullet points for lists
    formattedContent = formattedContent.replace(/^(\d+)\.\s+/gm, '• ');

    // Add emphasis to key phrases
    const keyPhrases = [
      'important',
      'critical',
      'essential',
      'must',
      'required',
      'mandatory',
      'deadline',
      'cost',
      'fee'
    ];

    keyPhrases.forEach(phrase => {
      const regex = new RegExp(`\\b(${phrase}[\\w\\s]{0,20})`, 'gi');
      formattedContent = formattedContent.replace(regex, '**$1**');
    });

    // Add callout boxes for important information
    formattedContent = formattedContent.replace(
      /⚠️\s*([^\n]+)/g,
      '\n> ⚠️ **Important:** $1\n'
    );

    this.finalArticle.formattedContent = formattedContent;
    console.log('✅ Content formatted for readability');
  }

  /**
   * Add comprehensive schema markup
   */
  async addSchemaMarkup() {
    const schemas = [];
    const keyword = this.draft.metadata.primaryKeyword;

    // Article schema (base)
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: this.finalArticle.title,
      description: this.generateMetaDescription(),
      keywords: [
        this.draft.metadata.primaryKeyword,
        ...this.draft.metadata.secondaryKeywords
      ].join(', '),
      wordCount: this.draft.metadata.wordCount,
      datePublished: new Date().toISOString(),
      dateModified: new Date().toISOString(),
      author: {
        '@type': 'Organization',
        name: 'Relocation Quest',
        url: 'https://relocation.quest'
      },
      publisher: {
        '@type': 'Organization',
        name: 'Relocation Quest',
        logo: {
          '@type': 'ImageObject',
          url: 'https://relocation.quest/logo.png'
        }
      }
    });

    // BreadcrumbList schema
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: this.generateBreadcrumbs()
    });

    // FAQPage schema (if FAQ section exists)
    const faqSection = this.draft.sections.find(s => s.title === 'Frequently Asked Questions');
    if (faqSection) {
      schemas.push(this.generateFAQSchema());
    }

    // HowTo schema (for process/guide content)
    if (keyword.includes('how') || keyword.includes('guide') || keyword.includes('process')) {
      schemas.push(this.generateHowToSchema());
    }

    // GovernmentService schema (for visa/residence content)
    if (keyword.includes('visa') || keyword.includes('residence') || keyword.includes('permit')) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'GovernmentService',
        name: this.finalArticle.title,
        description: this.generateMetaDescription(),
        serviceType: 'Immigration and Visa Services',
        provider: {
          '@type': 'GovernmentOrganization',
          name: 'Immigration Department'
        }
      });
    }

    // ItemList schema (for listicles)
    if (this.finalArticle.title.includes('Top') || this.finalArticle.title.includes('Best')) {
      schemas.push(this.generateItemListSchema());
    }

    this.finalArticle.schema = schemas;
    console.log(`✅ Added ${schemas.length} schema types`);
  }

  /**
   * Apply multi-category tagging
   */
  async applyCategoryTags() {
    const keyword = this.draft.metadata.primaryKeyword.toLowerCase();
    const categories = [];
    const tags = [];
    
    // Primary category assignment
    const categoryMap = {
      'digital nomad': 'Digital Nomad Visas',
      'golden visa': 'Golden Visa Programs',
      'tax': 'Tax Strategies',
      'citizenship': 'Citizenship Programs',
      'business': 'Business Setup',
      'cost': 'Cost of Living',
      'healthcare': 'Healthcare & Education',
      'property': 'Property Investment',
      'banking': 'Banking & Finance'
    };

    // Find all applicable categories
    for (const [key, category] of Object.entries(categoryMap)) {
      if (keyword.includes(key)) {
        categories.push(category);
      }
    }

    // Secondary categories based on content
    const content = this.draft.content.toLowerCase();
    
    if (content.includes('investment') && !categories.includes('Golden Visa Programs')) {
      categories.push('Property Investment');
    }
    if (content.includes('remote work') && !categories.includes('Digital Nomad Visas')) {
      categories.push('Digital Nomad Visas');
    }
    if (content.includes('tax') && !categories.includes('Tax Strategies')) {
      categories.push('Tax Strategies');
    }

    // Country tags
    const countries = this.extractCountries(content);
    countries.forEach(country => tags.push(country));

    // Topic tags
    const topics = [
      'visa requirements',
      'application process',
      'investment options',
      'tax benefits',
      'family inclusion',
      'processing time',
      'renewal process',
      'citizenship pathway'
    ];

    topics.forEach(topic => {
      if (content.includes(topic)) {
        tags.push(topic);
      }
    });

    // Ensure at least 2 categories
    if (categories.length === 0) {
      categories.push('International Relocation');
    }
    if (categories.length === 1) {
      categories.push('Guides & Resources');
    }

    this.finalArticle.categories = categories;
    this.finalArticle.tags = tags;
    
    console.log(`✅ Applied ${categories.length} categories and ${tags.length} tags`);
  }

  /**
   * Optimize for featured snippets
   */
  async optimizeFeaturedSnippets() {
    const optimizations = [];

    // Add definition snippet for "what is" queries
    if (this.draft.title.toLowerCase().includes('what')) {
      optimizations.push({
        type: 'definition',
        content: this.createDefinitionSnippet()
      });
    }

    // Add list snippet for "how to" queries
    if (this.draft.title.toLowerCase().includes('how')) {
      optimizations.push({
        type: 'numbered-list',
        content: this.createHowToSnippet()
      });
    }

    // Add table snippet for comparisons
    if (this.draft.title.toLowerCase().includes('vs') || 
        this.draft.title.toLowerCase().includes('comparison')) {
      optimizations.push({
        type: 'table',
        content: this.createComparisonTable()
      });
    }

    // Add quick answer box
    optimizations.push({
      type: 'quick-answer',
      content: this.createQuickAnswer()
    });

    this.finalArticle.featuredSnippets = optimizations;
    console.log(`✅ Added ${optimizations.length} featured snippet optimizations`);
  }

  /**
   * Add strategic internal and external links
   */
  async addStrategicLinks() {
    // Fetch existing articles for internal linking
    const existingArticles = await this.fetchExistingArticles();
    
    const internalLinks = [];
    const externalLinks = [];

    // Find relevant internal links
    const keyword = this.draft.metadata.primaryKeyword.toLowerCase();
    
    existingArticles.forEach(article => {
      if (article.title && article.slug?.current) {
        const relevanceScore = this.calculateRelevance(keyword, article.title.toLowerCase());
        if (relevanceScore > 0.3) {
          internalLinks.push({
            title: article.title,
            url: `/posts/${article.slug.current}`,
            relevance: relevanceScore
          });
        }
      }
    });

    // Sort by relevance and take top 5
    internalLinks.sort((a, b) => b.relevance - a.relevance);
    this.finalArticle.internalLinks = internalLinks.slice(0, 5);

    // Add authoritative external links
    const authorityDomains = [
      { domain: 'gov', type: 'official' },
      { domain: 'europa.eu', type: 'official' },
      { domain: 'oecd.org', type: 'statistics' },
      { domain: 'worldbank.org', type: 'data' }
    ];

    authorityDomains.forEach(source => {
      externalLinks.push({
        type: source.type,
        domain: source.domain,
        purpose: 'authority'
      });
    });

    this.finalArticle.externalLinks = externalLinks;
    
    console.log(`✅ Added ${this.finalArticle.internalLinks.length} internal and ${externalLinks.length} external links`);
  }

  /**
   * Generate optimized meta descriptions
   */
  async generateMetaDescriptions() {
    const keyword = this.draft.metadata.primaryKeyword;
    const year = new Date().getFullYear();

    // Primary meta description (155 characters)
    const primaryMeta = `${keyword} guide ${year}: Requirements, costs, timeline, and expert tips. Everything you need for successful application. Updated monthly.`;

    // Social media descriptions
    const socialMeta = {
      og: {
        title: this.finalArticle.title,
        description: `Complete ${year} guide to ${keyword}. Updated requirements, real costs, processing times, and insider strategies for approval.`,
        type: 'article'
      },
      twitter: {
        title: this.finalArticle.title.substring(0, 70),
        description: `${keyword} in ${year}: Requirements ✓ Costs ✓ Timeline ✓ Expert tips ✓ Start your journey today!`,
        card: 'summary_large_image'
      }
    };

    this.finalArticle.seo = {
      metaDescription: primaryMeta.substring(0, 155),
      ogDescription: socialMeta.og.description.substring(0, 200),
      twitterDescription: socialMeta.twitter.description.substring(0, 200),
      focusKeyword: keyword,
      title: this.finalArticle.title
    };

    console.log('✅ Generated SEO meta descriptions');
  }

  /**
   * Run comprehensive quality checks
   */
  async runQualityChecks() {
    const checks = {
      seo: [],
      content: [],
      technical: []
    };

    // SEO checks
    const keyword = this.draft.metadata.primaryKeyword;
    const content = this.finalArticle.formattedContent;
    
    // Keyword density (should be 0.5-1.5%)
    const keywordCount = (content.match(new RegExp(keyword, 'gi')) || []).length;
    const wordCount = content.split(' ').length;
    const density = (keywordCount / wordCount) * 100;
    
    checks.seo.push({
      check: 'Keyword density',
      result: density.toFixed(2) + '%',
      status: density >= 0.5 && density <= 1.5 ? 'pass' : 'warning'
    });

    // Title length (50-60 characters)
    checks.seo.push({
      check: 'Title length',
      result: this.finalArticle.title.length + ' characters',
      status: this.finalArticle.title.length <= 60 ? 'pass' : 'warning'
    });

    // Meta description length (150-160 characters)
    checks.seo.push({
      check: 'Meta description',
      result: this.finalArticle.seo.metaDescription.length + ' characters',
      status: this.finalArticle.seo.metaDescription.length <= 160 ? 'pass' : 'warning'
    });

    // Content checks
    checks.content.push({
      check: 'Word count',
      result: wordCount + ' words',
      status: wordCount >= 1500 ? 'pass' : (wordCount >= 1000 ? 'warning' : 'fail')
    });

    checks.content.push({
      check: 'Reading time',
      result: Math.ceil(wordCount / 225) + ' minutes',
      status: 'info'
    });

    checks.content.push({
      check: 'Categories assigned',
      result: this.finalArticle.categories.length + ' categories',
      status: this.finalArticle.categories.length >= 2 ? 'pass' : 'warning'
    });

    // Technical checks
    checks.technical.push({
      check: 'Schema markup',
      result: this.finalArticle.schema.length + ' schemas',
      status: this.finalArticle.schema.length >= 2 ? 'pass' : 'warning'
    });

    checks.technical.push({
      check: 'Internal links',
      result: this.finalArticle.internalLinks.length + ' links',
      status: this.finalArticle.internalLinks.length >= 3 ? 'pass' : 'warning'
    });

    // Determine if publish-ready
    const failures = Object.values(checks).flat().filter(c => c.status === 'fail');
    this.finalArticle.publishReady = failures.length === 0;
    
    this.finalArticle.qualityChecks = checks;
    
    console.log('✅ Quality checks complete');
    console.log(`   - SEO: ${checks.seo.filter(c => c.status === 'pass').length}/${checks.seo.length} passed`);
    console.log(`   - Content: ${checks.content.filter(c => c.status === 'pass').length}/${checks.content.length} passed`);
    console.log(`   - Technical: ${checks.technical.filter(c => c.status === 'pass').length}/${checks.technical.length} passed`);
    console.log(`   - Publish ready: ${this.finalArticle.publishReady ? 'YES ✅' : 'NO ❌'}`);
  }

  /**
   * Prepare final article for publication
   */
  async prepareForPublication() {
    // Convert content to Sanity block format
    const blocks = this.convertToSanityBlocks(this.finalArticle.formattedContent);

    const article = {
      _type: 'post',
      title: this.finalArticle.title,
      slug: {
        current: this.generateSlug(this.finalArticle.title)
      },
      body: blocks,
      excerpt: this.finalArticle.seo.metaDescription?.substring(0, 200) || '',
      focusKeyword: this.draft.metadata.secondaryKeywords?.[0] || this.draft.metadata.primaryKeyword || '',
      metaTitle: this.finalArticle.title.substring(0, 60),
      metaDescription: this.finalArticle.seo.metaDescription?.substring(0, 160) || '',
      searchVolume: this.draft.metadata.searchVolume || 0,
      cpc: this.draft.metadata.cpc || 0,
      categories: this.finalArticle.categories,
      tags: this.finalArticle.tags,
      publishedAt: new Date().toISOString(),
      featured: false,
      contentTier: 'tier1',
      generationCost: 0.02,
      readingTime: Math.ceil(this.draft.metadata.wordCount / 200)
    };

    // Save to file
    const filename = `final-${this.generateSlug(this.finalArticle.title)}-${Date.now()}.json`;
    const filepath = path.join(process.cwd(), 'published', filename);
    
    await fs.mkdir(path.dirname(filepath), { recursive: true });
    await fs.writeFile(filepath, JSON.stringify(article, null, 2));
    
    console.log(`\n✅ Article prepared for publication: ${filename}`);
    
    return article;
  }

  // Helper methods
  generateMetaDescription() {
    const keyword = this.draft.metadata.primaryKeyword;
    const year = new Date().getFullYear();
    return `Complete ${year} guide to ${keyword}. Requirements, costs, timeline, and expert tips for successful application. Updated monthly.`;
  }

  generateBreadcrumbs() {
    const categories = this.finalArticle.categories || ['International Relocation'];
    const breadcrumbs = [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://relocation.quest'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: categories[0],
        item: `https://relocation.quest/category/${this.generateSlug(categories[0])}`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: this.finalArticle.title,
        item: `https://relocation.quest/posts/${this.generateSlug(this.finalArticle.title)}`
      }
    ];
    
    return breadcrumbs;
  }

  generateFAQSchema() {
    // Extract FAQ content from draft
    const faqContent = this.draft.content.match(/\*\*Q: (.+?)\*\*\n\n(.+?)(?=\*\*Q:|$)/gs) || [];
    
    const faqItems = faqContent.map(item => {
      const [question, answer] = item.split('\n\n');
      return {
        '@type': 'Question',
        name: question.replace(/\*\*Q: |\*\*/g, '').trim(),
        acceptedAnswer: {
          '@type': 'Answer',
          text: answer.trim()
        }
      };
    });

    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems
    };
  }

  generateHowToSchema() {
    const steps = [];
    const stepMatches = this.draft.content.match(/\*\*Step \d+: (.+?)\*\*\n(.+?)(?=\*\*Step|$)/gs) || [];
    
    stepMatches.forEach((step, index) => {
      const [title, description] = step.split('\n');
      steps.push({
        '@type': 'HowToStep',
        name: title.replace(/\*\*Step \d+: |\*\*/g, '').trim(),
        text: description.trim(),
        position: index + 1
      });
    });

    return {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: this.finalArticle.title,
      description: this.generateMetaDescription(),
      step: steps
    };
  }

  generateItemListSchema() {
    const items = [];
    const listMatches = this.draft.content.match(/^\d+\. (.+)$/gm) || [];
    
    listMatches.forEach((item, index) => {
      items.push({
        '@type': 'ListItem',
        position: index + 1,
        name: item.replace(/^\d+\. /, '').trim()
      });
    });

    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: this.finalArticle.title,
      itemListElement: items
    };
  }

  extractCountries(content) {
    const countries = [
      'Portugal', 'Spain', 'Greece', 'Malta', 'Cyprus',
      'Dubai', 'UAE', 'Singapore', 'Malaysia', 'Thailand',
      'Estonia', 'Lithuania', 'Latvia', 'Poland', 'Czech Republic',
      'Mexico', 'Costa Rica', 'Panama', 'Barbados', 'Bahamas',
      'Turkey', 'Montenegro', 'Serbia', 'Albania', 'Georgia'
    ];

    const found = [];
    countries.forEach(country => {
      if (content.includes(country.toLowerCase())) {
        found.push(country);
      }
    });

    return found;
  }

  createDefinitionSnippet() {
    const keyword = this.draft.metadata.primaryKeyword;
    return `${keyword} is a residence or visa program that allows eligible individuals to live, work, or invest in a foreign country. Requirements typically include financial investment, background checks, and documentation proving eligibility.`;
  }

  createHowToSnippet() {
    return `
1. Check eligibility requirements
2. Gather required documents
3. Complete application forms
4. Submit application with fees
5. Attend biometric appointment
6. Wait for processing
7. Receive decision
8. Complete post-approval requirements`;
  }

  createComparisonTable() {
    return `
| Feature | Option A | Option B |
|---------|----------|----------|
| Cost | $XXX,XXX | $XXX,XXX |
| Timeline | 3-4 months | 4-6 months |
| Requirements | Investment | Business |
| Benefits | Full access | Limited |`;
  }

  createQuickAnswer() {
    const keyword = this.draft.metadata.primaryKeyword;
    return `The ${keyword} process typically takes 3-6 months, costs between $XXX,XXX-$XXX,XXX, and requires proof of investment, clean background checks, and valid documentation.`;
  }

  async fetchExistingArticles() {
    try {
      const articles = await client.fetch(`
        *[_type == "post"][0...100] {
          title,
          slug,
          focusKeyword,
          categories
        }
      `);
      return articles;
    } catch (error) {
      console.error('Error fetching articles:', error);
      return [];
    }
  }

  calculateRelevance(keyword1, keyword2) {
    const words1 = keyword1.toLowerCase().split(' ');
    const words2 = keyword2.toLowerCase().split(' ');
    
    let matches = 0;
    words1.forEach(word => {
      if (words2.includes(word)) matches++;
    });
    
    return matches / Math.max(words1.length, words2.length);
  }

  convertToSanityBlocks(content) {
    // Generate unique keys using crypto
    const getBlockKey = () => crypto.randomUUID();
    const getSpanKey = () => crypto.randomUUID();
    
    const lines = content.split('\n');
    const blocks = [];

    lines.forEach(line => {
      if (line.startsWith('## ')) {
        blocks.push({
          _type: 'block',
          _key: getBlockKey(),
          style: 'h2',
          children: [{ _type: 'span', _key: getSpanKey(), text: line.replace('## ', '') }],
          markDefs: []
        });
      } else if (line.startsWith('### ')) {
        blocks.push({
          _type: 'block',
          _key: getBlockKey(),
          style: 'h3',
          children: [{ _type: 'span', _key: getSpanKey(), text: line.replace('### ', '') }],
          markDefs: []
        });
      } else if (line.startsWith('• ')) {
        blocks.push({
          _type: 'block',
          _key: getBlockKey(),
          listItem: 'bullet',
          children: [{ _type: 'span', _key: getSpanKey(), text: line.replace('• ', '') }],
          markDefs: []
        });
      } else if (line.startsWith('> ')) {
        blocks.push({
          _type: 'block',
          _key: getBlockKey(),
          style: 'blockquote',
          children: [{ _type: 'span', _key: getSpanKey(), text: line.replace('> ', '') }],
          markDefs: []
        });
      } else if (line.trim()) {
        blocks.push({
          _type: 'block',
          _key: getBlockKey(),
          style: 'normal',
          children: [{ _type: 'span', _key: getSpanKey(), text: line }],
          markDefs: []
        });
      }
    });

    return blocks;
  }

  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 60);
  }

  calculateQualityScore() {
    const checks = this.finalArticle.qualityChecks;
    let score = 0;
    let total = 0;

    Object.values(checks).flat().forEach(check => {
      if (check.status !== 'info') {
        total++;
        if (check.status === 'pass') score++;
      }
    });

    return Math.round((score / total) * 100);
  }
}

// Export for use in orchestration
export default EditorAgent;

// Allow direct execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const agent = new EditorAgent();
  const draftPath = process.argv[2];
  
  if (!draftPath) {
    console.error('Please provide a draft file path');
    process.exit(1);
  }
  
  console.log('🚀 Starting editing process...');
  agent.editContent(draftPath).then(article => {
    console.log('\n✅ Article edited and ready for publication!');
    console.log(`Quality Score: ${article.metadata?.qualityScore || 0}%`);
  }).catch(console.error);
}