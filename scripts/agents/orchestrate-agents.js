/**
 * Orchestrate Agents - Coordinate the Three-Agent System
 * 
 * Purpose: Run complete pipeline with clean context per agent
 * Output: High-quality, SEO-optimized, multi-category article
 */

import dotenv from 'dotenv';
import { promises as fs } from 'fs';
import path from 'path';
import ResearchAgent from './research-agent.js';
import CopywriterAgent from './copywriter-agent.js';
import EditorAgent from './editor-agent.js';

dotenv.config({ path: '.env.local' });

class AgentOrchestrator {
  constructor() {
    this.results = {
      keyword: '',
      prdPath: '',
      draftPath: '',
      finalPath: '',
      status: 'idle',
      startTime: null,
      endTime: null,
      errors: []
    };
  }

  /**
   * Run the complete Three-Agent pipeline
   */
  async generateArticle(keyword, options = {}) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🎯 THREE-AGENT SYSTEM - Starting Pipeline`);
    console.log(`📌 Keyword: "${keyword}"`);
    console.log(`${'='.repeat(60)}`);

    this.results.keyword = keyword;
    this.results.startTime = Date.now();
    this.results.status = 'running';

    try {
      // Phase 1: Research (Clean Context)
      console.log(`\n${'─'.repeat(40)}`);
      console.log('PHASE 1: RESEARCH AGENT');
      console.log(`${'─'.repeat(40)}`);
      
      const researchAgent = new ResearchAgent();
      const prd = await researchAgent.research(keyword, options);
      
      // Save PRD path
      const prdFilename = `prd-${keyword.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.json`;
      const prdPath = path.join(process.cwd(), 'research', prdFilename);
      await fs.mkdir(path.dirname(prdPath), { recursive: true });
      await fs.writeFile(prdPath, JSON.stringify(prd, null, 2));
      this.results.prdPath = prdPath;

      console.log(`\n✅ Research Phase Complete`);
      console.log(`   PRD: ${prdFilename}`);
      console.log(`   Opportunity: ${prd.summary.opportunity}`);
      console.log(`   Search Volume: ${prd.summary.searchVolume}`);

      // Clean context break
      await this.cleanContextBreak();

      // Phase 2: Copywriting (Clean Context)
      console.log(`\n${'─'.repeat(40)}`);
      console.log('PHASE 2: COPYWRITER AGENT');
      console.log(`${'─'.repeat(40)}`);
      
      const copywriterAgent = new CopywriterAgent();
      const draft = await copywriterAgent.createContent(prdPath);
      
      // Save draft path
      const draftFilename = `draft-${keyword.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.json`;
      const draftPath = path.join(process.cwd(), 'drafts', draftFilename);
      await fs.mkdir(path.dirname(draftPath), { recursive: true });
      await fs.writeFile(draftPath, JSON.stringify(draft, null, 2));
      this.results.draftPath = draftPath;

      console.log(`\n✅ Copywriting Phase Complete`);
      console.log(`   Draft: ${draftFilename}`);
      console.log(`   Word Count: ${draft.metadata.wordCount}`);
      console.log(`   Reading Time: ${draft.metadata.readingTime} min`);

      // Clean context break
      await this.cleanContextBreak();

      // Phase 3: Editing (Clean Context)
      console.log(`\n${'─'.repeat(40)}`);
      console.log('PHASE 3: EDITOR AGENT');
      console.log(`${'─'.repeat(40)}`);
      
      const editorAgent = new EditorAgent();
      const finalArticle = await editorAgent.editContent(draftPath);
      
      // Save final article
      const finalFilename = `final-${keyword.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.json`;
      const finalPath = path.join(process.cwd(), 'published', finalFilename);
      await fs.mkdir(path.dirname(finalPath), { recursive: true });
      await fs.writeFile(finalPath, JSON.stringify(finalArticle, null, 2));
      this.results.finalPath = finalPath;

      console.log(`\n✅ Editing Phase Complete`);
      console.log(`   Final: ${finalFilename}`);
      console.log(`   Categories: ${finalArticle.categories?.join(', ')}`);
      console.log(`   Quality Score: ${finalArticle.metadata?.qualityScore || 'N/A'}%`);
      console.log(`   Publish Ready: ${finalArticle.publishReady ? 'YES ✅' : 'NO ❌'}`);

      // Complete
      this.results.status = 'completed';
      this.results.endTime = Date.now();
      
      // Final summary
      await this.printSummary(finalArticle);

      // Optionally publish to Sanity
      if (options.autoPublish && finalArticle.publishReady) {
        await this.publishToSanity(finalArticle);
      }

      return finalArticle;

    } catch (error) {
      console.error('\n❌ Pipeline Error:', error);
      this.results.status = 'failed';
      this.results.errors.push(error.message);
      throw error;
    }
  }

  /**
   * Clean context break between agents
   */
  async cleanContextBreak() {
    // Simulate context cleaning
    console.log('\n🔄 Cleaning context for next agent...');
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  /**
   * Print pipeline summary
   */
  async printSummary(article) {
    const duration = ((this.results.endTime - this.results.startTime) / 1000).toFixed(1);
    
    console.log(`\n${'='.repeat(60)}`);
    console.log('📊 PIPELINE SUMMARY');
    console.log(`${'='.repeat(60)}`);
    console.log(`\n✅ ARTICLE GENERATED SUCCESSFULLY`);
    console.log(`\n📝 Title: ${article.title}`);
    console.log(`🏷️ Categories: ${article.categories?.join(', ')}`);
    console.log(`🔖 Tags: ${(article.tags || []).slice(0, 5).join(', ')}...`);
    console.log(`📊 Quality Score: ${article.metadata?.qualityScore || 'N/A'}%`);
    console.log(`⏱️ Total Time: ${duration} seconds`);
    console.log(`\n📁 Output Files:`);
    console.log(`   • PRD: ${path.basename(this.results.prdPath)}`);
    console.log(`   • Draft: ${path.basename(this.results.draftPath)}`);
    console.log(`   • Final: ${path.basename(this.results.finalPath)}`);
    console.log(`\n${'='.repeat(60)}`);
  }

  /**
   * Publish to Sanity CMS
   */
  async publishToSanity(article) {
    console.log('\n📤 Publishing to Sanity...');
    
    try {
      const { createClient } = await import('@sanity/client');
      
      const client = createClient({
        projectId: process.env.PUBLIC_SANITY_PROJECT_ID || '93ewsltm',
        dataset: process.env.PUBLIC_SANITY_DATASET || 'production',
        apiVersion: process.env.PUBLIC_SANITY_API_VERSION || '2024-01-01',
        token: process.env.SANITY_WRITE_TOKEN,
        useCdn: false
      });

      const result = await client.create(article);
      console.log(`✅ Published to Sanity: ${result._id}`);
      
    } catch (error) {
      console.error('❌ Sanity publish error:', error.message);
    }
  }

  /**
   * Batch process multiple keywords
   */
  async batchGenerate(keywords, options = {}) {
    console.log(`\n🚀 Starting batch generation for ${keywords.length} keywords`);
    
    const results = [];
    
    for (let i = 0; i < keywords.length; i++) {
      const keyword = keywords[i];
      console.log(`\n[${i + 1}/${keywords.length}] Processing: ${keyword}`);
      
      try {
        const article = await this.generateArticle(keyword, options);
        results.push({
          keyword,
          success: true,
          article
        });
      } catch (error) {
        console.error(`Failed: ${keyword} - ${error.message}`);
        results.push({
          keyword,
          success: false,
          error: error.message
        });
      }

      // Delay between articles to avoid API rate limits
      if (i < keywords.length - 1) {
        console.log('\n⏳ Waiting 30 seconds before next article...');
        await new Promise(resolve => setTimeout(resolve, 30000));
      }
    }

    // Summary
    const successful = results.filter(r => r.success).length;
    console.log(`\n📊 Batch Complete: ${successful}/${keywords.length} successful`);
    
    return results;
  }
}

// Export for use elsewhere
export default AgentOrchestrator;

// Allow direct execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const orchestrator = new AgentOrchestrator();
  
  // Get keyword from command line or use default
  const keyword = process.argv.slice(2).join(' ') || 'Portugal Golden Visa 2025';
  
  // Options
  const options = {
    autoPublish: false, // Don't auto-publish by default
    includeImages: true,
    targetWordCount: 2500
  };

  console.log('🚀 Starting Three-Agent Pipeline...');
  
  orchestrator.generateArticle(keyword, options)
    .then(article => {
      console.log('\n✅ Pipeline completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Pipeline failed:', error);
      process.exit(1);
    });
}

// Example batch usage:
// const orchestrator = new AgentOrchestrator();
// const keywords = [
//   'Portugal Golden Visa 2025',
//   'Cyprus Non-Dom Tax Benefits',
//   'Dubai Company Formation Free Zone',
//   'Estonia e-Residency Business',
//   'Singapore PR Requirements 2025'
// ];
// orchestrator.batchGenerate(keywords, { autoPublish: false });