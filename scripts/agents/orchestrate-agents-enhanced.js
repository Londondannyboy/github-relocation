/**
 * Enhanced Agent Orchestration with Persona-Based Content Generation
 * Coordinates Research, Enhanced Copywriter, and Editor agents
 */

import dotenv from 'dotenv';
import { promises as fs } from 'fs';
import path from 'path';
import { createClient } from '@sanity/client';
import { nanoid } from 'nanoid';
import ResearchAgent from './research-agent.js';
import EnhancedCopywriterAgent from './copywriter-agent-enhanced.js';
import EditorAgent from './editor-agent.js';

dotenv.config({ path: '.env.local' });

// Initialize Sanity client
const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.PUBLIC_SANITY_DATASET,
  apiVersion: process.env.PUBLIC_SANITY_API_VERSION || '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false
});

class EnhancedAgentOrchestrator {
  constructor() {
    this.results = {
      keyword: '',
      category: '',
      prdPath: '',
      articlePath: '',
      status: 'idle',
      metrics: {
        totalCost: 0,
        totalTime: 0,
        wordCount: 0,
        sources: 0,
        qualityScore: 0
      },
      tracking: {
        toolsUsed: {},
        apiCalls: 0,
        errors: []
      }
    };
  }

  /**
   * Run the enhanced pipeline with persona-based content
   */
  async generateArticle(keyword, category = null, options = {}) {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`🚀 ENHANCED CONTENT GENERATION SYSTEM`);
    console.log(`📌 Keyword: "${keyword}"`);
    console.log(`📁 Category: ${category || 'Auto-detect'}`);
    console.log(`🎭 Using: Persona-based prompting + Content templates`);
    console.log(`${'='.repeat(70)}`);

    this.results.keyword = keyword;
    this.results.category = category;
    this.results.status = 'running';
    const startTime = Date.now();

    try {
      // Phase 1: Deep Research with all 12 APIs
      console.log(`\n${'─'.repeat(50)}`);
      console.log('📊 PHASE 1: DEEP RESEARCH (12 APIs)');
      console.log(`${'─'.repeat(50)}`);
      
      const researchAgent = new ResearchAgent();
      const prd = await researchAgent.research(keyword, options);
      
      // Save PRD
      const prdPath = await this.savePRD(prd, keyword);
      this.results.prdPath = prdPath;
      
      // Track research metrics
      this.trackResearchMetrics(prd);
      
      // Phase 2: Expert Content Generation with Claude
      console.log(`\n${'─'.repeat(50)}`);
      console.log('✍️ PHASE 2: EXPERT CONTENT GENERATION');
      console.log(`${'─'.repeat(50)}`);
      
      const copywriterAgent = new EnhancedCopywriterAgent();
      const article = await copywriterAgent.createContent(prdPath, category);
      this.results.articlePath = article;
      
      // Phase 3: Professional Editing (if EditorAgent exists)
      if (await this.editorAgentExists()) {
        console.log(`\n${'─'.repeat(50)}`);
        console.log('📝 PHASE 3: PROFESSIONAL EDITING');
        console.log(`${'─'.repeat(50)}`);
        
        const editorAgent = new EditorAgent();
        const finalArticle = await editorAgent.editContent(article);
        this.results.articlePath = finalArticle;
      }
      
      // Calculate final metrics
      await this.calculateFinalMetrics();
      
      // Display results
      this.displayResults();
      
      return this.results;
      
    } catch (error) {
      console.error('\n❌ Pipeline Error:', error);
      this.results.status = 'failed';
      this.results.tracking.errors.push(error.message);
      throw error;
    }
  }

  /**
   * Save PRD to file
   */
  async savePRD(prd, keyword) {
    const slug = keyword.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const timestamp = new Date().toISOString().split('T')[0];
    
    const outputDir = path.join(process.cwd(), 'content', 'prd');
    await fs.mkdir(outputDir, { recursive: true });
    
    const filename = `${timestamp}-${slug}-prd.json`;
    const filepath = path.join(outputDir, filename);
    
    // Add metadata
    prd.metadata = {
      generatedAt: new Date().toISOString(),
      keyword: keyword,
      category: this.results.category
    };
    
    await fs.writeFile(filepath, JSON.stringify(prd, null, 2), 'utf-8');
    console.log(`   ✅ PRD saved: ${filename}`);
    
    return filepath;
  }

  /**
   * Track research metrics from PRD
   */
  trackResearchMetrics(prd) {
    // Track tools used
    if (prd.research) {
      if (prd.research.perplexity) {
        this.results.tracking.toolsUsed.perplexity = {
          called: true,
          expandedQueries: prd.research.perplexity.expandedQueries?.length || 0,
          cost: 0.01
        };
      }
      
      if (prd.research.linkup) {
        this.results.tracking.toolsUsed.linkup = {
          called: true,
          sources: prd.research.linkup.sources?.length || 0,
          cost: 0.01
        };
        this.results.metrics.sources += prd.research.linkup.sources?.length || 0;
      }
      
      if (prd.research.tavily) {
        this.results.tracking.toolsUsed.tavily = {
          called: true,
          relevanceScore: prd.research.tavily.relevanceScore || 0,
          cost: 0.005
        };
      }
      
      if (prd.research.dataforseo) {
        this.results.tracking.toolsUsed.dataforseo = {
          called: true,
          searchVolume: prd.research.dataforseo.searchVolume || 0,
          difficulty: prd.research.dataforseo.difficulty || 0,
          cost: 0.002
        };
      }
      
      if (prd.research.serper) {
        this.results.tracking.toolsUsed.serper = {
          called: true,
          featuredSnippet: prd.research.serper.featuredSnippet || false,
          peopleAlsoAsk: prd.research.serper.peopleAlsoAsk?.length || 0,
          cost: 0.001
        };
      }
      
      if (prd.research.reddit) {
        this.results.tracking.toolsUsed.reddit = {
          called: true,
          posts: prd.research.reddit.posts || 0,
          insights: prd.research.reddit.insights?.length || 0,
          cost: 0  // FREE!
        };
      }
      
      if (prd.research.critique) {
        this.results.tracking.toolsUsed.critique = {
          called: true,
          trustedSources: prd.research.critique.trustedSources || [],
          cost: 0.005
        };
      }
      
      if (prd.research.firecrawl) {
        this.results.tracking.toolsUsed.firecrawl = {
          called: true,
          sitesScraped: prd.research.firecrawl.sites || [],
          cacheHit: prd.research.firecrawl.cacheHit || false,
          cost: prd.research.firecrawl.cacheHit ? 0 : 0.01
        };
      }
    }
    
    // Calculate total research cost
    this.results.metrics.totalCost = Object.values(this.results.tracking.toolsUsed)
      .reduce((sum, tool) => sum + (tool.cost || 0), 0);
    
    // Add Claude cost estimate (3.5 Sonnet is ~5x cheaper than Opus)
    this.results.tracking.toolsUsed.claude = {
      called: true,
      model: 'claude-3-5-sonnet-20241022',
      estimatedTokens: 8000,
      cost: 0.006  // Much cheaper than Opus!
    };
    
    this.results.metrics.totalCost += 0.006;
  }

  /**
   * Check if EditorAgent exists
   */
  async editorAgentExists() {
    try {
      const editorPath = path.join(process.cwd(), 'scripts', 'agents', 'editor-agent.js');
      await fs.access(editorPath);
      return true;
    } catch {
      console.log('   ℹ️ Editor agent not found, skipping editing phase');
      return false;
    }
  }

  /**
   * Calculate final metrics
   */
  async calculateFinalMetrics() {
    try {
      // Read the generated article
      const articleContent = await fs.readFile(this.results.articlePath, 'utf-8');
      
      // Calculate word count
      const words = articleContent.split(/\s+/).length;
      this.results.metrics.wordCount = words;
      
      // Calculate reading time
      this.results.metrics.readingTime = Math.ceil(words / 200);
      
      // Calculate quality score based on various factors
      let qualityScore = 50; // Base score
      
      // Add points for research depth
      if (this.results.metrics.sources > 20) qualityScore += 20;
      else if (this.results.metrics.sources > 10) qualityScore += 10;
      
      // Add points for tool usage
      const toolsUsed = Object.keys(this.results.tracking.toolsUsed).length;
      qualityScore += Math.min(toolsUsed * 3, 30);
      
      // Add points for optimal word count
      if (words >= 2000 && words <= 4000) qualityScore += 10;
      else if (words >= 1500 && words <= 5000) qualityScore += 5;
      
      // Add points for citations/references
      const citations = (articleContent.match(/\[\d+\]/g) || []).length;
      if (citations > 30) qualityScore += 10;
      else if (citations > 15) qualityScore += 5;
      
      this.results.metrics.qualityScore = Math.min(qualityScore, 100);
      
    } catch (error) {
      console.warn('Could not calculate all metrics:', error.message);
    }
    
    // Calculate total time
    this.results.metrics.totalTime = Math.round((Date.now() - startTime) / 1000);
  }

  /**
   * Display final results
   */
  displayResults() {
    console.log(`\n${'='.repeat(70)}`);
    console.log('✅ CONTENT GENERATION COMPLETE!');
    console.log(`${'='.repeat(70)}`);
    
    console.log('\n📊 METRICS:');
    console.log(`   Word Count: ${this.results.metrics.wordCount.toLocaleString()} words`);
    console.log(`   Sources Used: ${this.results.metrics.sources}`);
    console.log(`   Quality Score: ${this.results.metrics.qualityScore}/100`);
    console.log(`   Reading Time: ${this.results.metrics.readingTime} minutes`);
    console.log(`   Total Cost: $${this.results.metrics.totalCost.toFixed(3)}`);
    console.log(`   Generation Time: ${this.results.metrics.totalTime} seconds`);
    
    console.log('\n🔧 TOOLS USED:');
    Object.entries(this.results.tracking.toolsUsed).forEach(([tool, data]) => {
      if (data.called) {
        const details = [];
        if (data.sources) details.push(`${data.sources} sources`);
        if (data.expandedQueries) details.push(`${data.expandedQueries} queries`);
        if (data.relevanceScore) details.push(`${data.relevanceScore.toFixed(2)} relevance`);
        if (data.searchVolume) details.push(`${data.searchVolume} volume`);
        if (data.insights) details.push(`${data.insights} insights`);
        
        console.log(`   ✓ ${tool}: ${details.join(', ')} | $${(data.cost || 0).toFixed(3)}`);
      }
    });
    
    console.log('\n📁 OUTPUT FILES:');
    console.log(`   PRD: ${path.basename(this.results.prdPath)}`);
    console.log(`   Article: ${path.basename(this.results.articlePath)}`);
    
    if (this.results.tracking.errors.length > 0) {
      console.log('\n⚠️ WARNINGS:');
      this.results.tracking.errors.forEach(error => {
        console.log(`   - ${error}`);
      });
    }
    
    console.log(`\n${'='.repeat(70)}`);
  }
}

export default EnhancedAgentOrchestrator;

// Allow direct execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const orchestrator = new EnhancedAgentOrchestrator();
  const keyword = process.argv[2];
  const category = process.argv[3];
  
  if (!keyword) {
    console.log('Usage: node orchestrate-agents-enhanced.js "<keyword>" [category]');
    console.log('Example: node orchestrate-agents-enhanced.js "Portugal Golden Visa 2025" "Golden Visa Programs"');
    process.exit(1);
  }
  
  orchestrator.generateArticle(keyword, category)
    .then(results => {
      console.log('\n🎉 Pipeline completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Pipeline failed:', error);
      process.exit(1);
    });
}