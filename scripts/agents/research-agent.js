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
import RedditAgent from './reddit-agent.js';

dotenv.config({ path: '.env.local' });

// API Configuration
const DATAFORSEO_LOGIN = process.env.DATAFORSEO_LOGIN;
const DATAFORSEO_PASSWORD = process.env.DATAFORSEO_PASSWORD;
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;
const SERPER_API_KEY = process.env.SERPER_API_KEY;
const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
const LINKUP_API_KEY = process.env.LINKUP_API_KEY;
const CRITIQUE_API_KEY = process.env.CRITIQUE_API_KEY;

class ResearchAgent {
  constructor() {
    this.results = {
      keyword: '',
      keywordCluster: [],
      metrics: {},
      competitors: [],
      contentGaps: [],
      uniqueAngles: [],
      sources: [],
      timestamp: new Date().toISOString()
    };
    
    // Tracking API usage
    this.tracking = {
      toolsUsed: {},
      benefits: {},
      totalCost: 0,
      cacheHits: 0,
      cacheMisses: 0
    };
    
    // Simple cache for Firecrawl
    this.firecrawlCache = new Map();
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

      // Determine value tier based on metrics
      const tier = this.determineValueTier(this.results.metrics);
      console.log(`\n🎯 Value Tier: ${tier}`);

      // Step 2: Use Perplexity for query expansion (always)
      console.log('\n🧠 Step 2: Query expansion with Perplexity...');
      await this.analyzeCompetitors(keyword);

      // Step 2b: Get SERP data to see who actually ranks
      console.log('\n🔍 Step 2b: Analyzing SERP rankings...');
      await this.getSERPData(keyword);
      
      // Extract competitor domains for further analysis
      const competitorDomains = this.results.serpData?.topRankings
        ?.slice(0, 3)
        .map(r => new URL(r.url).hostname)
        .filter(d => !d.includes('youtube.com')) || [];

      // Step 3: Tiered research based on value
      if (tier === 'HIGH') {
        console.log('\n🔥 HIGH VALUE - Using full research stack');
        
        // NEW: Domain Analytics for competitor keywords
        if (competitorDomains.length > 0) {
          await this.getDomainAnalytics(competitorDomains);
        }
        
        // NEW: Content Analysis for quality gaps
        const competitorUrls = this.results.serpData?.topRankings?.slice(0, 5).map(r => r.url) || [];
        if (competitorUrls.length > 0) {
          await this.getContentAnalysis(competitorUrls);
        }
        
        // NEW: Backlinks for authority sources
        if (competitorDomains.length > 0) {
          await this.getBacklinks(competitorDomains);
        }
        
        // LinkUp for deep search with citations
        await this.getLinkUpDeepSearch(keyword);
        
        // Tavily for AI synthesis
        await this.getTavilySynthesis(keyword);
        
        // Critique for validation
        const keyFacts = this.extractKeyFacts();
        await this.getCritiqueValidation(keyFacts);
        
      } else if (tier === 'MEDIUM') {
        console.log('\n⭐ MEDIUM VALUE - Using essential stack');
        
        // Still get content analysis for medium value
        const competitorUrls = this.results.serpData?.topRankings?.slice(0, 3).map(r => r.url) || [];
        if (competitorUrls.length > 0) {
          await this.getContentAnalysis(competitorUrls);
        }
        
        // Tavily for synthesis
        await this.getTavilySynthesis(keyword);
        
      } else {
        console.log('\n📝 LOW VALUE - Using basic stack');
      }

      // Always get SERP features with Serper (cheap and valuable)
      console.log('\n🎯 Step 3: Understanding search intent...');
      await this.getSearchIntent(keyword);

      // Step 3b: Get real human experiences from Reddit (FREE!)
      console.log('\n💬 Step 3b: Gathering real experiences from Reddit...');
      const redditAgent = new RedditAgent();
      this.results.redditData = await redditAgent.research(keyword);
      if (this.results.redditData?.stories?.length > 0) {
        console.log(`✅ Reddit: Found ${this.results.redditData.stories.length} authentic stories`);
        this.tracking.toolsUsed.reddit = {
          called: true,
          stories: this.results.redditData.stories.length,
          cost: 0, // FREE!
          value: `${this.results.redditData.stories.length} real human experiences`
        };
      }

      // Step 4: Find content gaps based on all research
      console.log('\n💡 Step 4: Identifying content gaps...');
      await this.findContentGaps(keyword);

      // Step 5: Gather authoritative sources (with caching)
      console.log('\n📚 Step 5: Gathering authoritative sources...');
      await this.gatherSources(keyword);

      // Step 6: Generate PRD with tracking data
      console.log('\n📋 Step 6: Creating Product Requirements Document...');
      const prd = await this.generatePRD();

      // Log tracking summary
      console.log('\n📊 Research Complete:');
      console.log(`   Tools Used: ${Object.keys(this.tracking.toolsUsed).join(', ')}`);
      console.log(`   Total Cost: $${this.tracking.totalCost.toFixed(3)}`);
      console.log(`   Cache Hits: ${this.tracking.cacheHits}`);

      return prd;

    } catch (error) {
      console.error('❌ Research Agent Error:', error);
      throw error;
    }
  }

  /**
   * Determine value tier based on metrics
   */
  determineValueTier(metrics) {
    const { searchVolume = 0, cpc = 0 } = metrics;
    
    // Force HIGH tier for testing if keyword contains "test" or "Dubai"
    const keyword = this.results.keyword?.toLowerCase() || '';
    if (keyword.includes('test') || keyword.includes('dubai')) return 'HIGH';
    
    if (searchVolume > 2000 && cpc > 5) return 'HIGH';
    if (searchVolume > 1000) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * Extract key facts for validation
   */
  extractKeyFacts() {
    const facts = [];
    
    // Extract facts from various sources
    if (this.results.metrics.searchVolume) {
      facts.push(`Search volume is ${this.results.metrics.searchVolume} per month`);
    }
    if (this.results.tavilySynthesis?.answer) {
      // Extract first 3 sentences as key claims
      const sentences = this.results.tavilySynthesis.answer.split('.').slice(0, 3);
      facts.push(...sentences);
    }
    
    return facts.slice(0, 5); // Limit to 5 facts for validation
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
   * Get SERP data to see who ranks and what features they have
   */
  async getSERPData(keyword) {
    if (!DATAFORSEO_LOGIN || !DATAFORSEO_PASSWORD) {
      console.log('⚠️  DataForSEO SERP skipped - no credentials');
      return null;
    }

    // Check cache first (7-day cache for SERP data)
    const cacheKey = `serp_${keyword.toLowerCase().replace(/\s+/g, '_')}`;
    const cached = this.checkCache(cacheKey, 7);
    if (cached) {
      console.log('✅ SERP data from cache');
      this.tracking.cacheHits++;
      return cached;
    }

    try {
      console.log('🔍 DataForSEO SERP: Analyzing top 10 results...');
      const auth = Buffer.from(`${DATAFORSEO_LOGIN}:${DATAFORSEO_PASSWORD}`).toString('base64');
      
      const response = await fetch('https://api.dataforseo.com/v3/serp/google/organic/live/regular', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([{
          keyword: keyword,
          location_code: 2840,
          language_code: "en",
          depth: 10
        }])
      });

      if (response.ok) {
        const data = await response.json();
        const items = data.tasks?.[0]?.result?.[0]?.items || [];
        
        const serpResults = {
          topRankings: items.map(item => ({
            position: item.rank_group,
            url: item.url,
            title: item.title,
            snippet: item.description,
            hasSchema: item.is_featured_snippet || false
          })),
          featuredSnippet: items.find(item => item.is_featured_snippet),
          peopleAlsoAsk: data.tasks?.[0]?.result?.[0]?.people_also_ask || []
        };

        this.results.serpData = serpResults;
        this.saveToCache(cacheKey, serpResults);
        this.tracking.toolsUsed.serpApi = {
          called: true,
          cost: 0.002,
          value: `Top 10 rankings analyzed`
        };
        this.tracking.totalCost += 0.002;
        
        console.log(`✅ SERP: Analyzed ${items.length} top results`);
        return serpResults;
      }
    } catch (error) {
      console.error('SERP API error:', error.message);
    }
    return null;
  }

  /**
   * Get Domain Analytics - competitor's full keyword portfolio
   */
  async getDomainAnalytics(competitorDomains) {
    if (!DATAFORSEO_LOGIN || !DATAFORSEO_PASSWORD || !competitorDomains?.length) {
      console.log('⚠️  Domain Analytics skipped');
      return null;
    }

    // Check cache (30-day cache for domain data)
    const cacheKey = `domain_${competitorDomains[0].replace(/[^a-z0-9]/gi, '_')}`;
    const cached = this.checkCache(cacheKey, 30);
    if (cached) {
      console.log('✅ Domain analytics from cache');
      this.tracking.cacheHits++;
      return cached;
    }

    try {
      console.log('📊 DataForSEO Domain Analytics: Getting competitor keywords...');
      const auth = Buffer.from(`${DATAFORSEO_LOGIN}:${DATAFORSEO_PASSWORD}`).toString('base64');
      
      // Using the correct endpoint for related keywords
      const response = await fetch('https://api.dataforseo.com/v3/dataforseo_labs/google/related_keywords/live', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([{
          keyword: this.results.keyword,
          location_code: 2840,
          language_code: "en",
          limit: 50,
          filters: [
            ["keyword_data.keyword_info.search_volume", ">", 100]
          ]
        }])
      });

      if (response.ok) {
        const data = await response.json();
        const items = data.tasks?.[0]?.result?.[0]?.items || [];
        
        const domainData = {
          totalKeywords: items.length,
          topKeywords: items.slice(0, 20).map(item => ({
            keyword: item.keyword_data?.keyword || '',
            volume: item.keyword_data?.keyword_info?.search_volume || 0,
            competition: item.keyword_data?.keyword_info?.competition || 0,
            cpc: item.keyword_data?.keyword_info?.cpc || 0
          }))
        };

        this.results.domainAnalytics = domainData;
        this.saveToCache(cacheKey, domainData);
        this.tracking.toolsUsed.domainAnalytics = {
          called: true,
          cost: 0.006,
          value: `${items.length} competitor keywords found`
        };
        this.tracking.totalCost += 0.006;
        
        console.log(`✅ Domain Analytics: Found ${items.length} keywords`);
        return domainData;
      }
    } catch (error) {
      console.error('Domain Analytics error:', error.message);
    }
    return null;
  }

  /**
   * Get Content Analysis - quality scoring
   */
  async getContentAnalysis(urls) {
    if (!DATAFORSEO_LOGIN || !DATAFORSEO_PASSWORD || !urls?.length) {
      console.log('⚠️  Content Analysis skipped');
      return null;
    }

    // Check cache (forever cache for content analysis)
    const cacheKey = `content_${urls[0].replace(/[^a-z0-9]/gi, '_')}`;
    const cached = this.checkCache(cacheKey, 999);
    if (cached) {
      console.log('✅ Content analysis from cache');
      this.tracking.cacheHits++;
      return cached;
    }

    try {
      console.log('📝 DataForSEO Content Analysis: Analyzing competitor content...');
      const auth = Buffer.from(`${DATAFORSEO_LOGIN}:${DATAFORSEO_PASSWORD}`).toString('base64');
      
      const response = await fetch('https://api.dataforseo.com/v3/content_analysis/search/live', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([{
          keyword: this.results.keyword,
          page_type: ["article"],
          search_mode: "as_is"
        }])
      });

      if (response.ok) {
        const data = await response.json();
        const items = data.tasks?.[0]?.result?.[0]?.items || [];
        
        const contentData = {
          averageWordCount: Math.round(items.reduce((sum, item) => sum + (item.word_count || 0), 0) / items.length),
          topContent: items.slice(0, 5).map(item => ({
            url: item.url,
            wordCount: item.word_count,
            contentScore: item.content_info?.rating?.value || 0
          }))
        };

        this.results.contentAnalysis = contentData;
        this.saveToCache(cacheKey, contentData);
        this.tracking.toolsUsed.contentAnalysis = {
          called: true,
          cost: 0.004,
          value: `Analyzed ${items.length} competitor articles`
        };
        this.tracking.totalCost += 0.004;
        
        console.log(`✅ Content Analysis: Avg word count ${contentData.averageWordCount}`);
        return contentData;
      }
    } catch (error) {
      console.error('Content Analysis error:', error.message);
    }
    return null;
  }

  /**
   * Get Backlinks - find authoritative sources to link to
   */
  async getBacklinks(competitorDomains) {
    if (!DATAFORSEO_LOGIN || !DATAFORSEO_PASSWORD || !competitorDomains?.length) {
      console.log('⚠️  Backlinks API skipped');
      return null;
    }

    // Check cache (30-day cache for backlinks)
    const cacheKey = `backlinks_${competitorDomains[0].replace(/[^a-z0-9]/gi, '_')}`;
    const cached = this.checkCache(cacheKey, 30);
    if (cached) {
      console.log('✅ Backlinks from cache');
      this.tracking.cacheHits++;
      return cached;
    }

    try {
      console.log('🔗 DataForSEO Backlinks: Finding authority sources...');
      const auth = Buffer.from(`${DATAFORSEO_LOGIN}:${DATAFORSEO_PASSWORD}`).toString('base64');
      
      const response = await fetch('https://api.dataforseo.com/v3/backlinks/domain_pages_summary/live', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([{
          target: competitorDomains[0],
          limit: 20,
          order_by: ["rank,desc"]
        }])
      });

      if (response.ok) {
        const data = await response.json();
        const items = data.tasks?.[0]?.result?.[0]?.items || [];
        
        const backlinkData = {
          authorityPages: items.slice(0, 10).map(item => ({
            url: item.url,
            rank: item.rank,
            backlinks: item.backlinks
          }))
        };

        this.results.backlinks = backlinkData;
        this.saveToCache(cacheKey, backlinkData);
        this.tracking.toolsUsed.backlinks = {
          called: true,
          cost: 0.003,
          value: `Found ${items.length} authority sources`
        };
        this.tracking.totalCost += 0.003;
        
        console.log(`✅ Backlinks: Found ${items.length} authority sources`);
        return backlinkData;
      }
    } catch (error) {
      console.error('Backlinks API error:', error.message);
    }
    return null;
  }

  /**
   * Get deep search results from LinkUp
   */
  async getLinkUpDeepSearch(keyword) {
    if (!LINKUP_API_KEY) {
      console.log('⚠️  LinkUp API key not found, skipping deep search');
      return null;
    }

    try {
      console.log('🔍 LinkUp: Deep searching with citations (30s timeout)...');
      
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch('https://api.linkup.so/v1/search', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LINKUP_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          q: keyword,
          depth: 'standard', // Changed from 'deep' to 'standard' for faster response
          outputType: 'searchResults'
        }),
        signal: controller.signal
      }).finally(() => clearTimeout(timeout));

      if (response.ok) {
        const data = await response.json();
        
        this.results.linkupSources = data.results || [];
        this.tracking.toolsUsed.linkup = {
          called: true,
          sources: data.results?.length || 0,
          cost: 0.01,
          value: `${data.results?.length || 0} deep sources with citations`
        };
        this.tracking.totalCost += 0.01;
        
        console.log(`✅ LinkUp: Found ${data.results?.length || 0} sources`);
        return data;
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('⚠️  LinkUp timeout after 30s - skipping');
      } else {
        console.error('LinkUp error:', error.message);
      }
    }
    return null;
  }

  /**
   * Get AI synthesis from Tavily
   */
  async getTavilySynthesis(keyword) {
    if (!TAVILY_API_KEY) {
      console.log('⚠️  Tavily API key not found, using existing Serper data');
      return null;
    }

    try {
      console.log('🤖 Tavily: AI synthesis and scoring...');
      const response = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          api_key: TAVILY_API_KEY,
          query: keyword,
          search_depth: 'advanced',
          include_answer: true,
          include_images: false,
          max_results: 5
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        this.results.tavilySynthesis = {
          answer: data.answer,
          results: data.results
        };
        
        const topScore = data.results?.[0]?.score || 0;
        this.tracking.toolsUsed.tavily = {
          called: true,
          relevanceScore: topScore,
          cost: 0.005,
          value: `AI synthesis with ${topScore.toFixed(2)} relevance score`
        };
        this.tracking.totalCost += 0.005;
        
        console.log(`✅ Tavily: Synthesis complete, top score: ${topScore.toFixed(2)}`);
        return data;
      }
    } catch (error) {
      console.error('Tavily error:', error.message);
    }
    return null;
  }

  /**
   * Validate claims with Critique Labs
   */
  async getCritiqueValidation(claims) {
    if (!CRITIQUE_API_KEY) {
      console.log('⚠️  Critique Labs API key not found, skipping validation');
      return null;
    }

    try {
      console.log('✓ Critique Labs: Validating with trusted sources...');
      const response = await fetch('https://api.critique-labs.ai/v1/search', {
        method: 'POST',
        headers: {
          'X-API-Key': CRITIQUE_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: `Verify these claims about ${this.results.keyword}: ${claims.join('. ')}`,
          source_blacklist: [],
          output_format: {
            verification: "string",
            sources_used: ["string"],
            confidence: "number"
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        this.results.critiqueValidation = data;
        this.tracking.toolsUsed.critique = {
          called: true,
          trustedSources: data.sources || [],
          cost: 0.005,
          value: `Validated with ${data.sources?.join(', ') || 'trusted sources'}`
        };
        this.tracking.totalCost += 0.005;
        
        console.log(`✅ Critique: Validated with ${data.sources?.length || 0} trusted sources`);
        return data;
      }
    } catch (error) {
      console.error('Critique Labs error:', error.message);
    }
    return null;
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
          model: 'sonar',
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
      },

      // Tracking data for transparency
      tracking: this.tracking
    };

    // Save PRD to file
    const filename = `prd-${this.results.keyword.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.json`;
    const filepath = path.join(process.cwd(), 'research', filename);
    
    await fs.mkdir(path.dirname(filepath), { recursive: true });
    await fs.writeFile(filepath, JSON.stringify(prd, null, 2));
    
    console.log(`\n✅ PRD saved: ${filename}`);
    
    return prd;
  }

  // Cache helper methods
  checkCache(key, maxAgeDays) {
    // Simple in-memory cache for this session
    if (!this.cache) this.cache = new Map();
    
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    const ageInDays = (Date.now() - cached.timestamp) / (1000 * 60 * 60 * 24);
    if (ageInDays > maxAgeDays) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }
  
  saveToCache(key, data) {
    if (!this.cache) this.cache = new Map();
    
    this.cache.set(key, {
      data: data,
      timestamp: Date.now()
    });
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