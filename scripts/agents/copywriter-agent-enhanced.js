/**
 * Enhanced Copywriter Agent with Claude API and Persona System
 * Uses role-based prompting and content templates for expert-level content
 */

import dotenv from 'dotenv';
import { promises as fs } from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import Replicate from 'replicate';
import { selectPersona, createSystemPrompt } from './personas.js';
import { selectTemplate, generateContentBrief } from './content-templates.js';

dotenv.config({ path: '.env.local' });

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
});

class EnhancedCopywriterAgent {
  constructor() {
    this.prd = null;
    this.persona = null;
    this.template = null;
    this.contentBrief = null;
  }

  /**
   * Call Claude API with advanced prompting
   */
  async callClaude(systemPrompt, userPrompt, temperature = 0.7, maxTokens = 4000) {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: maxTokens,
          temperature: temperature,
          system: systemPrompt,
          messages: [
            {
              role: 'user',
              content: userPrompt
            }
          ]
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Claude API error: ${error}`);
      }

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error('Error calling Claude:', error);
      throw error;
    }
  }

  /**
   * Main content creation pipeline with enhanced prompting
   */
  async createContent(prdPath, category = null) {
    console.log(`\n✍️ Enhanced Copywriter Agent starting...`);

    try {
      // Load PRD
      console.log('\n📖 Loading PRD and research data...');
      await this.loadPRD(prdPath);
      
      // Select appropriate persona and template
      console.log('\n🎭 Selecting expert persona...');
      const keyword = this.prd.summary?.keyword || this.prd.keyword;
      this.persona = selectPersona(category || this.prd.category, keyword);
      console.log(`   Selected: ${this.persona.name}`);
      
      console.log('\n📋 Selecting content template...');
      this.template = selectTemplate(keyword, category || this.prd.category);
      console.log(`   Selected: ${this.template.name}`);
      
      // Generate content brief
      console.log('\n📝 Generating content brief...');
      this.contentBrief = generateContentBrief(this.template, keyword, this.prd);
      
      // Create content section by section
      console.log('\n✨ Generating expert content with Claude...');
      const article = await this.generateFullArticle();
      
      // Generate images for the article
      const images = await this.generateImages(keyword, category || this.prd.category);
      
      // Post-process and optimize
      console.log('\n🔧 Optimizing content...');
      const optimizedArticle = await this.optimizeContent(article);
      
      // Save the result
      const outputPath = await this.saveArticle(optimizedArticle);
      console.log(`\n✅ Article saved to: ${outputPath}`);
      
      return optimizedArticle;
      
    } catch (error) {
      console.error('❌ Enhanced Copywriter Error:', error);
      throw error;
    }
  }

  /**
   * Load PRD from file
   */
  async loadPRD(prdPath) {
    const prdContent = await fs.readFile(prdPath, 'utf-8');
    this.prd = JSON.parse(prdContent);
  }

  /**
   * Generate the full article using Claude with advanced prompting
   */
  async generateFullArticle() {
    const systemPrompt = createSystemPrompt(this.persona, this.template.name);
    
    // Build comprehensive user prompt with all research data
    const userPrompt = this.buildUserPrompt();
    
    console.log('\n🤖 Calling Claude with expert persona...');
    console.log(`   Persona: ${this.persona.name}`);
    console.log(`   Template: ${this.template.name}`);
    console.log(`   Target words: ${this.template.totalWords}`);
    
    // Generate content with chain of thought
    const contentPrompt = `${userPrompt}

IMPORTANT: Think through this step-by-step:
1. First, consider the reader's main pain points and goals
2. Structure the content to solve their problems progressively
3. Include specific examples, numbers, and actionable advice
4. Write in a conversational yet authoritative tone
5. Naturally incorporate the keywords without forcing them

Now, write the complete article following the structure provided. Make it comprehensive, practical, and genuinely helpful.`;

    const article = await this.callClaude(
      systemPrompt,
      contentPrompt,
      0.7,  // Balanced creativity
      8192  // Maximum for Claude 3.5 Sonnet
    );
    
    return article;
  }

  /**
   * Build comprehensive user prompt with all research data
   */
  buildUserPrompt() {
    const keyword = this.prd.summary?.keyword || this.prd.keyword;
    
    let prompt = `Write a comprehensive article about "${keyword}" following this exact structure:\n\n`;
    
    // Add research insights
    if (this.prd.research) {
      prompt += `KEY RESEARCH INSIGHTS TO INCORPORATE:\n`;
      
      if (this.prd.research.linkup?.sources) {
        prompt += `\nTrusted Sources (use for citations):\n`;
        this.prd.research.linkup.sources.slice(0, 10).forEach(source => {
          prompt += `- ${source.title}: ${source.snippet}\n`;
        });
      }
      
      if (this.prd.research.tavily?.results) {
        prompt += `\nKey Information Points:\n`;
        this.prd.research.tavily.results.slice(0, 5).forEach(result => {
          prompt += `- ${result.title}: ${result.snippet}\n`;
        });
      }
      
      if (this.prd.research.reddit?.insights) {
        prompt += `\nReal User Experiences (incorporate naturally):\n`;
        this.prd.research.reddit.insights.slice(0, 3).forEach(insight => {
          prompt += `- ${insight}\n`;
        });
      }
      
      if (this.prd.research.serp?.peopleAlsoAsk) {
        prompt += `\nQuestions to Answer:\n`;
        this.prd.research.serp.peopleAlsoAsk.forEach(question => {
          prompt += `- ${question}\n`;
        });
      }
    }
    
    // Add template structure
    prompt += `\n\nARTICLE STRUCTURE (follow exactly):\n\n`;
    
    this.contentBrief.sections.forEach((section, index) => {
      prompt += `${index + 1}. ${section.title} (${section.targetWords} words)\n`;
      prompt += `   Instructions: ${section.instructions}\n`;
      if (section.requirements && section.requirements.length > 0) {
        prompt += `   Requirements:\n`;
        section.requirements.forEach(req => {
          prompt += `   - ${req}\n`;
        });
      }
      if (section.researchPoints && section.researchPoints.length > 0) {
        prompt += `   Research to include:\n`;
        section.researchPoints.forEach(point => {
          prompt += `   - ${point}\n`;
        });
      }
      prompt += '\n';
    });
    
    // Add SEO requirements
    prompt += `\nSEO REQUIREMENTS:\n`;
    prompt += `- Primary keyword: "${keyword}" (use naturally 5-8 times)\n`;
    if (this.prd.seo?.secondaryKeywords) {
      prompt += `- Secondary keywords: ${this.prd.seo.secondaryKeywords.join(', ')} (use 2-3 times each)\n`;
    }
    prompt += `- Include H2 headings for each major section\n`;
    prompt += `- Write meta description (155 chars): Focus on the main benefit\n`;
    
    return prompt;
  }

  /**
   * Generate images for the article using NeoGlow style
   */
  async generateImages(keyword, category) {
    console.log('\n🎨 Generating NeoGlow style images...');
    
    const images = [];
    
    // Generate 3 images with different prompts
    const imagePrompts = [
      // Hero image
      `${keyword} visualization, stylized neon glow effect, cyberpunk aesthetic with golden particles floating, magical dust, gradient background from deep purple to electric blue, abstract representation, no people, no photorealism, art deco influences, premium quality, 16:9 aspect ratio`,
      
      // Mid-article image
      `Investment opportunity visualization for ${category}, flowing neon light trails forming abstract financial growth patterns, golden accent lights, particle effects, dark gradient background, futuristic holographic elements, no people, stylized artistic rendering, premium aesthetic`,
      
      // Bottom image
      `Success pathway visualization, abstract neon roadmap with glowing milestones, particle streams, electric blue and gold color scheme, cosmic dust effects, geometric patterns, no people, artistic interpretation, luxury feel, wide format`
    ];
    
    try {
      for (let i = 0; i < imagePrompts.length; i++) {
        console.log(`   Generating image ${i + 1}/3...`);
        
        const output = await replicate.run(
          "black-forest-labs/flux-pro",
          {
            input: {
              prompt: imagePrompts[i],
              num_outputs: 1,
              aspect_ratio: "16:9",
              output_format: "webp",
              output_quality: 95,
              guidance: 7.5,
              steps: 50
            }
          }
        );
        
        if (output && output[0]) {
          images.push({
            url: output[0],
            alt: `${keyword} - Image ${i + 1}`,
            caption: i === 0 ? `${keyword} Overview` : `${keyword} Details`
          });
          console.log(`   ✅ Image ${i + 1} generated`);
        }
      }
    } catch (error) {
      console.warn('   ⚠️ Image generation failed:', error.message);
      // Continue without images rather than failing
    }
    
    return images;
  }

  /**
   * Optimize content for readability and SEO
   */
  async optimizeContent(article) {
    const systemPrompt = `You are an expert editor specializing in web content optimization. Your job is to polish content for maximum readability and engagement while maintaining SEO best practices.`;
    
    const optimizationPrompt = `Please optimize this article with the following improvements:

1. Break up any paragraphs longer than 3 sentences
2. Add bullet points or numbered lists where appropriate
3. Ensure all headings are properly formatted (H2, H3)
4. Add a compelling meta description (155 characters max)
5. Create 3-5 internal link suggestions with anchor text
6. Add a clear call-to-action at the end
7. Ensure smooth transitions between sections
8. Fix any repetitive phrases or awkward wording

Article to optimize:
${article}

Return the optimized article with all improvements applied.`;

    const optimized = await this.callClaude(
      systemPrompt,
      optimizationPrompt,
      0.3,  // Lower temperature for editing
      8192  // Maximum for Claude 3.5 Sonnet
    );
    
    return optimized;
  }

  /**
   * Save article to file
   */
  async saveArticle(content) {
    const keyword = this.prd.summary?.keyword || this.prd.keyword;
    const slug = keyword.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const timestamp = new Date().toISOString().split('T')[0];
    
    const outputDir = path.join(process.cwd(), 'content', 'generated');
    await fs.mkdir(outputDir, { recursive: true });
    
    const filename = `${timestamp}-${slug}.md`;
    const filepath = path.join(outputDir, filename);
    
    // Add metadata header
    const fullContent = `---
title: "${keyword}"
date: "${new Date().toISOString()}"
author: "${this.persona.name}"
template: "${this.template.name}"
category: "${this.prd.category || 'General'}"
keywords: ["${keyword}", ${this.prd.seo?.secondaryKeywords?.map(k => `"${k}"`).join(', ') || ''}]
---

${content}`;
    
    await fs.writeFile(filepath, fullContent, 'utf-8');
    
    return filepath;
  }
}

export default EnhancedCopywriterAgent;

// Allow direct execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const agent = new EnhancedCopywriterAgent();
  const prdPath = process.argv[2];
  const category = process.argv[3];
  
  if (!prdPath) {
    console.log('Usage: node copywriter-agent-enhanced.js <prd-path> [category]');
    process.exit(1);
  }
  
  agent.createContent(prdPath, category)
    .then(result => {
      console.log('\n✅ Content generation complete!');
    })
    .catch(error => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}