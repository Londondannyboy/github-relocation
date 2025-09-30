# 📋 PRODUCT REQUIREMENTS DOCUMENT - RELOCATION QUEST

**Version**: 6.1 - Three-Agent Quality System
**Last Updated**: September 30, 2025
**Status**: PIVOT - Quality Over Quantity

## ⚠️ CRITICAL: ALWAYS USE "POSTS" NOT "ARTICLES"
- **Sanity document type**: `_type: "post"` (NEVER "article")
- **All content pieces are POSTS**
- **Never create or query "article" type**

---

## 🎯 REVISED OBJECTIVE

**Create 1000 high-quality, problem-solving POSTS using Three-Agent System**

Current: 999/1000 (99.9% complete BUT need quality improvement)
Focus: Quality refinement and proper categorization
Strategy: Research-first approach with competitive analysis

---

## 📊 CURRENT REALITY (Sep 30, 2025)

### What We Achieved (Old System)
- **Site**: https://relocation.quest ✅
- **Posts**: 999 published (mission technically complete)
- **Word Count**: 2000+ average ✅
- **Cost**: $0.015/article (OpenAI only)
- **Build**: 100% success rate ✅

### 🎉 MEGA BREAKTHROUGH ACHIEVED (Oct 2025)
- ✅ **12+ APIs Integrated & Working**: 
  - Perplexity, LinkUp, Tavily, Critique Labs, Claude
  - DataForSEO (5 APIs): Keywords, SERP, Domain Analytics, Content Analysis, Backlinks
  - Serper, Firecrawl, Reddit (FREE!), Replicate (flux-pro)
- ✅ **Intelligent Routing**: HIGH/MEDIUM/LOW value tiers with full stack deployment
- ✅ **Keyword Clustering**: 1 article covers 10-15 related queries via Perplexity
- ✅ **Full Transparency**: postTracking schema tracks every API call
- ✅ **Reddit Integration**: FREE real human stories and experiences
- ✅ **NeoGlow Visuals**: Stylized, premium images (no more tacky AI people)
- ✅ **Cost Optimized**: $0.04-0.05 per HIGH VALUE article (20x quality for 3x cost)
- ✅ **Competitor Intelligence**: Full keyword portfolios, content gaps, backlink sources
- ✅ **29+ Sources**: LinkUp + Reddit real experiences

---

## 🧪 TESTING THE ENHANCED STACK

### Test Article: "Dubai Golden Visa 2025"
Run this command to test all 12+ APIs:
```bash
node scripts/agents/research-agent.js "Dubai Golden Visa 2025"
```

### What to Verify:
1. **DataForSEO Suite**:
   - ✓ SERP data shows top 10 competitors
   - ✓ Domain Analytics reveals competitor keywords
   - ✓ Content Analysis shows average word counts
   - ✓ Backlinks identifies authority sources

2. **Reddit Integration**:
   - ✓ Real stories from r/dubai, r/expats
   - ✓ Common problems identified
   - ✓ Authentic quotes extracted

3. **Visual Quality**:
   - ✓ flux-pro generates stylized images
   - ✓ NeoGlow aesthetic (neon outlines, gradients)
   - ✓ No photorealistic people

4. **Cost Tracking**:
   - ✓ Total cost ~$0.04-0.05
   - ✓ All API calls tracked
   - ✓ Cache hits reduce redundant calls

---

## 🚀 THREE-AGENT SYSTEM (NEW APPROACH)

### Agent 1: Research Analyst (FULLY WORKING!)
```javascript
// Deep research using 8 orchestrated APIs
Working APIs:
- DataForSEO: Real metrics (2400 volume, 0.77 difficulty) ✅
- Perplexity: Query expansion & "People Also Ask" ✅
- LinkUp: 29+ deep sources with citations ✅
- Tavily: AI synthesis (0.95 relevance scores) ✅
- Critique Labs: Fact validation ✅
- Serper: SERP features & People Also Ask ✅
- Firecrawl: Official site scraping ✅
- Firecrawl: Scrape official sources
- Identify content gaps and unique angles
- Find surprising statistics and case studies

Output: Structured research brief with metrics
```

### Agent 2: Creative Copywriter
```javascript
// Problem-solving content creation
Tasks:
- Create hooks addressing real pain points
- Write conversational, engaging content
- Include personal stories and case studies
- Structure for maximum readability
- Focus on solving problems, not just informing

Output: Article draft with compelling narrative
```

### Agent 3: Senior Editor
```javascript
// Polish, optimize, and categorize
Tasks:
- Break up walls of text (2-3 sentence paragraphs)
- Add formatting (bullets, tables, callouts)
- Verify facts against sources
- Multi-category tagging (NOT single category)
- Country-specific schema markup
- Featured snippet optimization

Output: Publication-ready article
```

### New Content Requirements
```yaml
every_article:
  research_phase:
    - DataForSEO metrics pulled
    - Top 5 competitors analyzed
    - Content gaps identified
    - Unique angle defined
    
  content_phase:
    - Compelling hook (addresses pain point)
    - Problem → Solution structure
    - Real examples and case studies
    - Natural keyword integration
    - 2000+ words of value
    
  editorial_phase:
    - Paragraphs every 2-3 sentences
    - Multiple categories assigned
    - Country and city tags
    - Schema markup added
    - Featured snippet optimized
    
  quality_markers:
    - Has unique insight competitors missed
    - Solves specific problem
    - Includes data/statistics
    - Proper formatting and readability
    - Multi-category distribution
```

---

## 💰 REVISED ECONOMICS

### Actual Investment
- 999 articles × $0.015 = $14.99 spent
- Time: 11 hours compute time
- APIs: ~$15 in credits used

### Quality-Focused Returns
- Better Rankings: Quality > Quantity for SEO
- Higher Engagement: Problem-solving content
- Multi-Category: Broader audience reach
- Authority Building: Comprehensive guides
- **Projected: $30-50K/month with quality content**

---

## 🤖 THREE-AGENT PIPELINE (NEW)

```javascript
async function threeAgentPipeline(topic) {
  // AGENT 1: Research Analyst (Clean Context)
  const researchBrief = await researchAgent({
    keyword: topic.keyword,
    apis: {
      dataForSEO: { volume, difficulty, cpc },
      perplexity: { competitors, gaps },
      firecrawl: { officialData }
    },
    output: 'structured-brief.json'
  });
  
  // AGENT 2: Creative Copywriter (Clean Context)
  const articleDraft = await copywriterAgent({
    brief: researchBrief,
    style: 'problem-solving',
    hooks: 'pain-point-focused',
    structure: 'engaging-narrative',
    output: 'draft-article.md'
  });
  
  // AGENT 3: Senior Editor (Clean Context)
  const finalArticle = await editorAgent({
    draft: articleDraft,
    formatting: 'web-optimized',
    categories: ['primary', 'secondary', 'tertiary'],
    schema: 'location-based',
    output: 'final-article.json'
  });
  
  // Publish with multi-category tags
  await sanity.create(finalArticle);
  return { quality: 'high', cost: 0.02 };
}
```

---

## 📅 REVISED EXECUTION PLAN

### Phase 1: Fix Existing Content (Week 1)
```bash
# Redistribute categories (fix 97% single-category problem)
scripts/optimization/redistribute-categories.js
- Analyze all 999 articles
- Assign proper multi-categories
- Update country/city tags

# Consolidate duplicates (16-18 per country → hubs)
scripts/optimization/consolidate-duplicates.js
- Create country hub pages
- Merge repetitive content
- Setup proper redirects

# Improve formatting
scripts/optimization/improve-formatting.js
- Break up walls of text
- Add tables and comparisons
- Improve readability
```

### Phase 2: Research Sprint (Week 2)
```bash
# DataForSEO Analysis
scripts/agents/research-agent.js
- Pull metrics for ideation topics
- Find low-competition opportunities
- Export keyword clusters

# Competitive Intelligence
- Analyze top competitors
- Map content gaps
- Identify unique angles
```

### Phase 3: Test Three-Agent System (Week 3)
```bash
# Create agent scripts
scripts/agents/orchestrate-agents.js
- Test with 10 high-priority topics
- Measure quality improvements
- Refine agent prompts
```

### Phase 4: Quality Content Creation (Week 4+)
```bash
# Generate new quality content
- Focus on ideation document opportunities
- Proper multi-category distribution
- Problem-solving focus
- Competitive differentiation
```

---

## 🛠️ TECHNICAL STACK (WORKING)

### Core
- **Astro** + Tailwind (frontend)
- **Sanity** Universal Project: 93ewsltm
- **Vercel** Auto-deploy from GitHub
- **GitHub** github-relocation repo

### APIs (All Configured)
```bash
TAVILY_API_KEY=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
SERPER_API_KEY=dc168391eeb102a7da15466f1b04477445356d9d  
FIRECRAWL_API_KEY=fc-fcc00e00206d4c1db2653d3815a2b0b0
REPLICATE_API_TOKEN=[REDACTED]
```

---

## ✅ REVISED SUCCESS CRITERIA

### Content Quality (Priority 1)
- [ ] Research-backed with real data
- [ ] Solves specific problems
- [ ] Unique angle vs competitors
- [ ] Proper formatting and readability
- [ ] Multi-category distribution

### Technical Metrics
- [ ] 2000+ words of VALUE (not filler)
- [ ] < 2% single-category articles
- [ ] 100% schema markup
- [ ] Featured snippet optimization

### Business Impact
- [ ] Higher engagement metrics
- [ ] Better search rankings
- [ ] Increased conversions
- [ ] Authority in multiple categories

---

## 🚨 LESSONS LEARNED & NEW RULES

### What Went Wrong
1. **Single Category Trap**: All articles in one category
2. **No Research Phase**: Skipped competitive analysis
3. **Generic Content**: No unique insights or angles
4. **Poor Formatting**: Walls of text, no breaks
5. **Unused APIs**: Perplexity never called

### New Rules
1. **ALWAYS use Three-Agent System**
2. **ALWAYS assign multiple categories**
3. **ALWAYS do competitive research first**
4. **ALWAYS format for readability**
5. **ALWAYS include unique insights**
6. **NEVER skip the research phase**
7. **NEVER publish generic content**

---

## 📝 IMMEDIATE NEXT STEPS

```bash
1. Create Three-Agent scripts:
   - scripts/agents/research-agent.js
   - scripts/agents/copywriter-agent.js
   - scripts/agents/editor-agent.js
   - scripts/agents/orchestrate-agents.js

2. Fix existing content:
   - Redistribute categories properly
   - Consolidate duplicate content
   - Improve formatting

3. Test new system:
   - Run 5-10 articles through pipeline
   - Measure quality improvements
   - Refine based on results
```

---

**REMEMBER**: We have 999 articles but they need quality improvement. Focus on:
1. Fixing categorization (97% in single category)
2. Adding unique insights and research
3. Improving formatting and readability
4. Implementing Three-Agent System for future content
5. Quality over quantity - better 100 great articles than 1000 generic ones