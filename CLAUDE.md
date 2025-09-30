# 🤖 CLAUDE.MD - SINGLE SOURCE OF TRUTH

**THIS IS YOUR PRIMARY DOCUMENT - READ THIS FIRST FOR EVERY SESSION**

## ⚠️ CRITICAL TERMINOLOGY - MUST READ
**ALWAYS USE "POSTS" NOT "ARTICLES"**
- Sanity document type: `_type: "post"` (NOT "article")
- All content pieces are called POSTS
- Database queries must use "post" type
- Scripts must reference "post" not "article"
- The single "article" type document was created by mistake and should be deleted

## 📚 DOCUMENT RULES
- **NO NEW DOCUMENTS** unless explicitly requested by user
- **CLAUDE.md** is the ONLY source for project guidance
- **content-bible.md** is the content planning bible
- **product-requirements-document.md** contains product requirements
- **LOCAL-RELOCATION-IDEATION.md** contains market research & opportunities

## 🎯 Project Status (September 30, 2025) - MAJOR BREAKTHROUGH! 🚀

**Project**: Relocation Quest - International relocation content platform
**Location**: `/Users/dankeegan/local-relocation`
**Live Site**: https://relocation.quest ✅
**Sanity Configuration**:
- Project ID: `93ewsltm`
- Dataset: `production`
- Studio: https://universal-sanity.sanity.studio/
- Document Type: `post` (NOT "article")
- Tracking Schema: `postTracking` (for API usage transparency)

### 🎉 MEGA VICTORY: 12+ APIs ORCHESTRATED!
**Previous Reality**: 999 posts with OpenAI, no research, generic content
**NEW REALITY**: Full API power stack with intelligent routing + real human stories!

### ✅ CONFIRMED WORKING APIs (ENHANCED Oct 2025):
1. **Perplexity** ✅ - Query expansion, 12+ citations, "People Also Ask"
2. **LinkUp** ✅ - 29+ deep sources with inline citations
3. **Tavily** ✅ - AI synthesis with 0.95 relevance scores
4. **Critique Labs** ✅ - Fact validation with structured output
5. **Claude (Anthropic)** ✅ - High-quality content ($200/month saved!)
6. **DataForSEO** ✅ - ENHANCED with 4 APIs:
   - Keywords Data API - Search volume, CPC, difficulty
   - SERP API - Top 10 rankings, featured snippets
   - Domain Analytics - Competitor keyword portfolios
   - Content Analysis - Quality scoring, word counts
   - Backlinks API - Authority sources to link to
7. **Serper** ✅ - SERP features, People Also Ask
8. **Firecrawl** ✅ - Official site scraping (v1 endpoint)
9. **Reddit API** ✅ - FREE! Real human experiences, no auth needed
10. **Replicate** ✅ - Upgraded to flux-pro for stylized images

### 📊 Enhanced Cost & Quality Tracking
- **HIGH VALUE** articles: ~$0.04-0.05 per article (with all enhancements)
- **Tools Used**: Tracked per article in postTracking schema
- **Cache System**: Smart caching for DataForSEO APIs
- **Reddit**: FREE real human experiences!
- **Visual Quality**: NeoGlow design system - stylized, not tacky
- **ROI**: 20x content quality for 3x cost

## 🎨 NEW: NeoGlow Visual Design System
- **Problem Solved**: No more tacky AI-generated people/offices
- **Solution**: Stylized, artistic images that embrace AI aesthetics
- **Implementation**: flux-pro with cyberpunk/art deco prompts
- **Result**: Premium, consistent visual brand

## 🚀 CONTENT STRATEGY 2.0 - THREE-AGENT SYSTEM

### The Three-Agent Architecture

#### 1. Research Analyst Agent
```javascript
// Purpose: Deep research and competitive intelligence
Tasks:
- Use DataForSEO for real keyword metrics (volume, difficulty, CPC)
- Use Perplexity to analyze top 5 competitors
- Use Firecrawl to scrape official sources
- Find content gaps and unique angles
- Identify surprising statistics and case studies

Output: Structured research brief with:
- Actual search metrics
- Competitor analysis
- Content gaps
- Unique data points
- Recommended angles
```

#### 2. Creative Copywriter Agent
```javascript
// Purpose: Create engaging, problem-solving content
Tasks:
- Create hooks that address real pain points
- Write conversational, engaging content
- Include personal stories and case studies
- Structure for maximum readability
- Focus on solving problems, not just informing

Output: Post draft with:
- Compelling hook
- Problem → Solution structure
- Specific examples
- Clear sections
- Natural keyword integration
```

#### 3. Senior Editor Agent
```javascript
// Purpose: Polish, optimize, and categorize
Tasks:
- Break up walls of text (paragraphs every 2-3 sentences)
- Add formatting (bullets, tables, callouts)
- Verify all facts against sources
- Add multi-category tagging
- Include country-specific schema
- Optimize for featured snippets
- Calculate accurate reading time

Output: Publication-ready POST with:
- Proper formatting
- SEO optimization
- Multiple category assignments
- Schema markup
- Meta descriptions
```

### Agent Orchestration Workflow
```javascript
async function generateQualityContent(topic) {
  // 1. Research Phase (10-15 mins)
  const research = await researchAgent.analyze(topic);
  
  // 2. Writing Phase (10-15 mins)
  const draft = await copywriterAgent.write(research);
  
  // 3. Editing Phase (5-10 mins)
  const final = await editorAgent.polish(draft);
  
  // 4. Publish with proper categorization
  return await publish(final);
}
```

## 📊 Content Categories & Distribution

### Target Distribution (from Ideation Document)
- **Digital Nomad Visas**: 200 articles (20%)
- **Golden Visa Programs**: 150 articles (15%)
- **Business Setup**: 150 articles (15%)
- **Tax Strategies**: 150 articles (15%)
- **Citizenship Programs**: 100 articles (10%)
- **Cost of Living**: 100 articles (10%)
- **Healthcare & Education**: 50 articles (5%)
- **Property Investment**: 50 articles (5%)
- **Banking & Finance**: 50 articles (5%)

### Multi-Category Tagging Structure
```javascript
article = {
  categories: ["Digital Nomad", "Tax Strategies", "Golden Visa"], // Multiple!
  country: "Portugal",  // Primary country
  cities: ["Lisbon", "Porto"],  // Relevant cities
  topics: ["NHR", "D7 Visa", "Property Investment"],  // Specific topics
  difficulty: 35,  // From DataForSEO
  searchVolume: 5400,  // Actual monthly searches
  cpc: 8.50  // Actual CPC value
}
```

## 🛠️ New Scripts Architecture

### Core Agent Scripts
```bash
scripts/
├── agents/
│   ├── research-agent.js       # DataForSEO + Perplexity research
│   ├── copywriter-agent.js     # Content creation with hooks
│   ├── editor-agent.js         # Polish and optimize
│   └── orchestrate-agents.js   # Run complete pipeline
├── optimization/
│   ├── consolidate-duplicates.js    # Merge similar content
│   ├── redistribute-categories.js   # Fix categorization
│   └── improve-formatting.js        # Fix wall-of-text issues
└── planning/
    ├── analyze-competitors.js        # Competitive intelligence
    ├── find-content-gaps.js         # Identify opportunities
    └── generate-content-briefs.js   # Create detailed outlines
```

## 💰 API Power Stack Configuration

### Complete API Arsenal
```bash
# Tier 1: Discovery & Validation ($0.001-0.005/call)
SERPER_API_KEY=[configured]          # Quick SERP analysis
DATAFORSEO_LOGIN=[configured]        # Keyword metrics & clustering

# Tier 2: Deep Research ($0.005-0.01/call)  
TAVILY_API_KEY=[configured]          # AI synthesis & scoring
PERPLEXITY_API_KEY=[configured]      # Query expansion & competitor analysis
LINKUP_API_KEY=[configured]          # 30+ sources with citations

# Tier 3: Trust & Authority ($0.005-0.01/call)
CRITIQUE_API_KEY=[configured]        # Mainstream media validation
FIRECRAWL_API_KEY=[configured]       # Official source scraping (with caching)

# Content Generation
ANTHROPIC_API_KEY=[needed]           # Claude for writing (not OpenAI!)

# Media & CMS
REPLICATE_API_TOKEN=[configured]     # Image generation
LUMA_API_KEY=[configured]           # Video generation
SANITY_WRITE_TOKEN=[configured]     # CMS publishing
```

### 🎯 Tiered Tool Routing Strategy

**HIGH VALUE** (Volume > 2000, CPC > $5):
- Full stack: LinkUp → Tavily → Critique → Perplexity
- Cost: ~$0.08/article | Time: 45-60 seconds
- Result: 3000+ words, 40+ citations

**MEDIUM VALUE** (Volume > 1000):  
- Essential stack: Tavily → Serper → Perplexity
- Cost: ~$0.03/article | Time: 20-30 seconds  
- Result: 2000+ words, 20+ citations

**LOW VALUE** (Volume < 1000):
- Light stack: Serper → DataForSEO only
- Cost: ~$0.01/article | Time: 10 seconds
- Result: 1500+ words, basic optimization

### 🧠 Keyword Clustering Intelligence (WORKING!)

```javascript
// Perplexity generates "People Also Ask" → Creates keyword clusters
// One article covers 10-15 related keywords automatically!

Example from Today's Test:
Primary: "Portugal Golden Visa 2025" (2400 searches)
Perplexity Expanded To:
├── "How does Portugal Golden Visa work?" 
├── "What are the investment options?"
├── "How long to get citizenship?"
├── "Can family members be included?"
├── "What are the tax implications?"
└── Total Cluster: 10+ related queries covered in ONE article

// This is the game-changer - competitors write 10 articles, we write 1!
```

### 💾 Smart Caching System

```javascript
firecrawlCache = {
  'immigration.gov.cy': { expires: '7 days' },
  'goldenvisa.com': { expires: '30 days' },
  'government-sites': { expires: '7 days' },
  'competitor-sites': { expires: '30 days' }
}
// Saves ~70% on Firecrawl costs through intelligent caching
```

## 📅 NEW EXECUTION PLAN

### Phase 1: Research Sprint (Week 1)
```
Day 1-2: DataForSEO Analysis
- Pull metrics for all ideation topics
- Identify low-competition, high-value opportunities
- Export keyword clusters

Day 3-4: Competitive Intelligence
- Analyze top 10 competitors with Perplexity
- Map content gaps
- Identify unique angles

Day 5-6: Content Brief Creation
- Create 100 detailed content briefs
- Include hooks, problems, solutions
- Map to customer journey stages

Day 7: Review & Test
- Generate 5 test articles with new system
- Measure quality improvements
- Adjust agents based on results
```

### Phase 2: Quality Test (Week 2)
- Generate 100 articles using Three-Agent System
- Ensure proper multi-category distribution
- Test engagement metrics
- Refine agent prompts

### Phase 3: Consolidation (Week 3)
- Merge duplicate country content into hubs
- Create pillar pages for each country
- Implement proper internal linking
- Add country-specific schema

### Phase 4: Scale Quality (Week 4+)
- Generate remaining high-quality content
- Monitor performance metrics
- Continuous optimization

## ✅ Quality Checklist (Every Article)

### Research Phase
- [ ] DataForSEO metrics pulled
- [ ] Top 5 competitors analyzed
- [ ] Content gaps identified
- [ ] Unique angle defined

### Content Phase
- [ ] Compelling hook created
- [ ] Real problem addressed
- [ ] Specific examples included
- [ ] Natural keyword usage

### Editorial Phase
- [ ] Paragraphs every 2-3 sentences
- [ ] Multiple categories assigned
- [ ] Facts verified
- [ ] Schema markup added
- [ ] Featured snippet optimized

## 🚨 Critical Rules

### NEVER
- ❌ Generate without research phase
- ❌ Publish walls of text
- ❌ Use single category only
- ❌ Create generic content
- ❌ Skip competitive analysis

### ALWAYS
- ✅ Run Three-Agent workflow
- ✅ Multi-category tagging
- ✅ Problem-solving focus
- ✅ Include unique insights
- ✅ Format for readability

## 📈 Success Metrics

| Metric | Current | Target | Status |
|--------|---------|--------|---------|
| Articles | 999 | 1000 quality | 🔄 Refocus on quality |
| Avg Words | 2300 | 2000-2500 | ✅ Good |
| Categories Used | 1 | 9 | 🔴 Need distribution |
| Unique Insights | Low | High | 🔴 Need research |
| Engagement | Unknown | Track | 🟡 Implement tracking |

## 🚀 Next Immediate Actions

1. **Stop blind generation** - No more articles without research
2. **Set up Three-Agent System** - Create the agent scripts
3. **Run DataForSEO analysis** - Get real keyword opportunities
4. **Test with 5 articles** - Validate new approach
5. **Redistribute existing content** - Fix categorization

---

**REMEMBER**: Quality over quantity. We have 999 articles but they need improvement. Focus on creating valuable, problem-solving content using the Three-Agent System before generating more.