/**
 * Research Agent - Deep research and competitive intelligence
 * Part of the Three-Agent System for quality content generation
 * 
 * Purpose: Gather real data, analyze competitors, find content gaps
 * Output: Structured PRD (Product Requirements Document) for content creation
 */

import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { promises as fs } from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

// API Configuration
const DATAFORSEO_LOGIN = process.env.DATAFORSEO_LOGIN;
const DATAFORSEO_PASSWORD = process.env.DATAFORSEO_PASSWORD;
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;
const SERPER_API_KEY = process.env.SERPER_API_KEY;

class ResearchAgent {
  constructor() {
    this.results = {
      keyword: '',
      metrics: {},
      competitors: [],
      contentGaps: [],
      uniqueAngles: [],
      sources: [],
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Main research pipeline
   */
  async research(keyword, options = {}) {
    console.log(`\n🔬 Research Agent starting for: "${keyword}"`);
    this.results.keyword = keyword;

    try {
      // Step 1: Get keyword metrics from DataForSEO
      console.log('\n📊 Step 1: Fetching keyword metrics...');
      await this.getKeywordMetrics(keyword);

      // Step 2: Analyze competitors with Perplexity
      console.log('\n🔍 Step 2: Analyzing competitors...');
      await this.analyzeCompetitors(keyword);

      // Step 3: Search intent and SERP features
      console.log('\n🎯 Step 3: Understanding search intent...');
      await this.getSearchIntent(keyword);

      // Step 4: Find content gaps
      console.log('\n💡 Step 4: Identifying content gaps...');
      await this.findContentGaps(keyword);

      // Step 5: Gather authoritative sources
      console.log('\n📚 Step 5: Gathering authoritative sources...');
      await this.gatherSources(keyword);

      // Step 6: Generate PRD
      console.log('\n📋 Step 6: Creating Product Requirements Document...');
      const prd = await this.generatePRD();

      return prd;

    } catch (error) {
      console.error('❌ Research Agent Error:', error);
      throw error;
    }
  }

  /**
   * Get keyword metrics from DataForSEO
   */
  async getKeywordMetrics(keyword) {
    if (!DATAFORSEO_LOGIN || !DATAFORSEO_PASSWORD) {
      console.log('⚠️  DataForSEO credentials not found, using mock data');
      this.results.metrics = {
        searchVolume: Math.floor(Math.random() * 5000) + 500,
        difficulty: Math.floor(Math.random() * 60) + 20,
        cpc: (Math.random() * 20 + 1).toFixed(2),
        trend: 'stable',
        relatedKeywords: [
          `${keyword} guide`,
          `${keyword} requirements`,
          `${keyword} cost`,
          `${keyword} 2025`
        ]
      };
      return;
    }

    try {
      const auth = Buffer.from(`${DATAFORSEO_LOGIN}:${DATAFORSEO_PASSWORD}`).toString('base64');
      
      const response = await fetch('https://api.dataforseo.com/v3/keywords_data/google/search_volume/live', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([{
          keywords: [keyword],
          location_code: 2840, // USA
          language_code: "en"
        }])
      });

      if (response.ok) {
        const data = await response.json();
        const result = data.tasks?.[0]?.result?.[0];
        
        this.results.metrics = {
          searchVolume: result?.search_volume || 0,
          difficulty: result?.competition || 0,
          cpc: result?.cpc || 0,
          trend: this.analyzeTrend(result?.monthly_searches || []),
          relatedKeywords: []
        };
      }
    } catch (error) {
      console.error('DataForSEO error:', error.message);
      // Fallback to mock data
      this.results.metrics = {
        searchVolume: 1000,
        difficulty: 40,
        cpc: 5.00,
        trend: 'stable',
        relatedKeywords: []
      };
    }
  }

  /**
   * Analyze competitors using Perplexity
   */
  async analyzeCompetitors(keyword) {
    if (!PERPLEXITY_API_KEY) {
      console.log('⚠️  Perplexity API key not found, using fallback');
      this.results.competitors = [
        {
          url: 'competitor1.com',
          strengths: ['Comprehensive guide', 'Good visuals'],
          weaknesses: ['Outdated information', 'No personal experience']
        }
      ];
      return;
    }

    try {
      const prompt = `Analyze the top 5 ranking articles for "${keyword}". 
        For each, identify:
        1. Main topics covered
        2. Unique value propositions
        3. Content gaps or weaknesses
        4. Word count estimate
        Format as JSON.`;

      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'pplx-70b-online',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.2
        })
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '{}';
        
        try {
          const parsed = JSON.parse(content);
          this.results.competitors = parsed.competitors || [];
        } catch {
          // If not valid JSON, extract insights manually
          this.results.competitors = [{
            insights: content,
            analyzed: true
          }];
        }
      }
    } catch (error) {
      console.error('Perplexity error:', error.message);
    }
  }

  /**
   * Understand search intent using Serper
   */
  async getSearchIntent(keyword) {
    if (!SERPER_API_KEY) {
      console.log('⚠️  Serper API key not found');
      return;
    }

    try {
      const response = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: {
          'X-API-KEY': SERPER_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          q: keyword,
          gl: 'us',
          hl: 'en',
          num: 10
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        this.results.searchIntent = {
          featuredSnippet: data.answerBox?.answer || null,
          peopleAlsoAsk: data.peopleAlsoAsk || [],
          relatedSearches: data.relatedSearches || [],
          topResults: (data.organic || []).slice(0, 5).map(r => ({
            title: r.title,
            url: r.link,
            snippet: r.snippet
          }))
        };
      }
    } catch (error) {
      console.error('Serper error:', error.message);
    }
  }

  /**
   * Find content gaps
   */
  async findContentGaps(keyword) {
    // Analyze what competitors are missing
    const gaps = [];
    
    // Common gaps to check for
    const gapChecklist = [
      '2025 updates',
      'Personal experience',
      'Cost breakdowns',
      'Step-by-step process',
      'Common mistakes',
      'Alternative options',
      'Success stories',
      'Expert interviews',
      'Interactive tools',
      'Video content'
    ];

    gapChecklist.forEach(gap => {
      const covered = this.results.competitors.some(c => 
        c.strengths?.includes(gap) || c.topics?.includes(gap)
      );
      
      if (!covered) {
        gaps.push({
          gap: gap,
          opportunity: `Add ${gap} to differentiate`,
          priority: 'high'
        });
      }
    });

    this.results.contentGaps = gaps;
  }

  /**
   * Gather authoritative sources
   */
  async gatherSources(keyword) {
    const sources = [
      {
        type: 'official',
        query: `${keyword} official government site`,
        importance: 'critical'
      },
      {
        type: 'statistics',
        query: `${keyword} statistics 2025`,
        importance: 'high'
      },
      {
        type: 'news',
        query: `${keyword} latest news updates`,
        importance: 'medium'
      },
      {
        type: 'forums',
        query: `${keyword} reddit expat forum`,
        importance: 'medium'
      }
    ];

    // In production, would fetch actual sources
    this.results.sources = sources;
  }

  /**
   * Generate structured PRD
   */
  async generatePRD() {
    const prd = {
      title: `Content PRD: ${this.results.keyword}`,
      timestamp: this.results.timestamp,
      
      // Executive Summary
      summary: {
        keyword: this.results.keyword,
        searchVolume: this.results.metrics.searchVolume,
        difficulty: this.results.metrics.difficulty,
        opportunity: this.calculateOpportunity()
      },

      // Target Audience
      audience: {
        primary: this.identifyPrimaryAudience(),
        intent: this.results.searchIntent,
        painPoints: this.extractPainPoints()
      },

      // Content Requirements
      requirements: {
        wordCount: this.recommendWordCount(),
        structure: this.defineStructure(),
        uniqueAngles: this.results.contentGaps,
        mustInclude: this.getMustIncludeElements()
      },

      // SEO Specifications
      seo: {
        primaryKeyword: this.results.keyword,
        secondaryKeywords: this.results.metrics.relatedKeywords,
        schema: this.recommendSchema(),
        metaDescription: this.generateMetaDescription()
      },

      // Competitive Analysis
      competition: {
        topCompetitors: this.results.competitors,
        differentiators: this.results.contentGaps,
        positioningStrategy: this.definePositioning()
      },

      // Resources
      resources: {
        sources: this.results.sources,
        data: this.results.metrics,
        references: []
      }
    };

    // Save PRD to file
    const filename = `prd-${this.results.keyword.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.json`;
    const filepath = path.join(process.cwd(), 'research', filename);
    
    await fs.mkdir(path.dirname(filepath), { recursive: true });
    await fs.writeFile(filepath, JSON.stringify(prd, null, 2));
    
    console.log(`\n✅ PRD saved: ${filename}`);
    
    return prd;
  }

  // Helper methods
  analyzeTrend(monthlySearches) {
    if (!monthlySearches.length) return 'stable';
    // Simplified trend analysis
    const recent = monthlySearches.slice(-3);
    const older = monthlySearches.slice(-6, -3);
    const recentAvg = recent.reduce((a, b) => a + b.search_volume, 0) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b.search_volume, 0) / older.length;
    
    if (recentAvg > olderAvg * 1.1) return 'rising';
    if (recentAvg < olderAvg * 0.9) return 'declining';
    return 'stable';
  }

  calculateOpportunity() {
    const { searchVolume, difficulty, cpc } = this.results.metrics;
    const score = (searchVolume / 100) * (100 - difficulty) * cpc;
    
    if (score > 1000) return 'excellent';
    if (score > 500) return 'good';
    if (score > 100) return 'moderate';
    return 'low';
  }

  identifyPrimaryAudience() {
    const keyword = this.results.keyword.toLowerCase();
    
    if (keyword.includes('digital nomad')) return 'Remote workers and location-independent professionals';
    if (keyword.includes('golden visa')) return 'High-net-worth investors seeking residency';
    if (keyword.includes('tax')) return 'International entrepreneurs and crypto traders';
    if (keyword.includes('citizenship')) return 'Families seeking second passports';
    
    return 'International relocators and expats';
  }

  extractPainPoints() {
    return [
      'Unclear requirements and frequent regulation changes',
      'Difficulty finding reliable, up-to-date information',
      'Complex application processes',
      'Hidden costs and timeline uncertainties',
      'Language barriers and bureaucracy'
    ];
  }

  recommendWordCount() {
    const { difficulty } = this.results.metrics;
    
    if (difficulty > 60) return 3000; // Very competitive
    if (difficulty > 40) return 2500; // Competitive
    if (difficulty > 20) return 2000; // Moderate
    return 1500; // Easy
  }

  defineStructure() {
    return {
      sections: [
        'Hook (addressing main pain point)',
        'Overview and eligibility',
        'Step-by-step process',
        'Costs breakdown',
        'Timeline and processing',
        'Benefits and limitations',
        'Common mistakes to avoid',
        'Alternatives to consider',
        'FAQs',
        'Next steps and CTA'
      ],
      features: [
        'Comparison table',
        'Cost calculator',
        'Checklist',
        'Timeline graphic',
        'Success stories'
      ]
    };
  }

  getMustIncludeElements() {
    return [
      '2025 updated information',
      'Specific costs in USD/EUR',
      'Processing times',
      'Official sources links',
      'Real examples or case studies',
      'Alternative options',
      'Expert tips or quotes'
    ];
  }

  recommendSchema() {
    const keyword = this.results.keyword.toLowerCase();
    const schemas = [];

    // Base schema
    schemas.push('Article', 'BreadcrumbList');

    // Specific schemas based on content type
    if (keyword.includes('visa') || keyword.includes('residence')) {
      schemas.push('GovernmentService', 'HowTo');
    }
    if (keyword.includes('cost') || keyword.includes('price')) {
      schemas.push('FAQPage', 'Product');
    }
    if (keyword.includes('vs') || keyword.includes('comparison')) {
      schemas.push('ComparisonTable');
    }
    if (keyword.includes('guide') || keyword.includes('how')) {
      schemas.push('HowTo', 'FAQPage');
    }

    return schemas;
  }

  generateMetaDescription() {
    const { keyword } = this.results;
    const { searchVolume } = this.results.metrics;
    
    return `Complete 2025 guide to ${keyword}. Updated requirements, costs, timeline, and expert tips. Everything you need to know before applying.`;
  }

  definePositioning() {
    return {
      angle: 'Most comprehensive and up-to-date guide with real experiences',
      tone: 'Authoritative yet approachable',
      uniqueValue: 'Combines official requirements with practical insider tips',
      callToAction: 'Start your relocation journey with confidence'
    };
  }
}

// Export for use in orchestration
export default ResearchAgent;

// Allow direct execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const agent = new ResearchAgent();
  const keyword = process.argv[2] || 'Portugal Golden Visa 2025';
  
  console.log('🚀 Starting research for:', keyword);
  agent.research(keyword).then(prd => {
    console.log('\n📋 PRD Generated Successfully!');
    console.log('Summary:', prd.summary);
  }).catch(console.error);
}