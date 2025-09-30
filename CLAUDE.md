# 🤖 CLAUDE.MD - SINGLE SOURCE OF TRUTH

**THIS IS YOUR PRIMARY DOCUMENT - READ THIS FIRST FOR EVERY SESSION**

## 📚 DOCUMENT RULES
- **NO NEW DOCUMENTS** unless explicitly requested by user
- **CLAUDE.md** is the ONLY source for project guidance
- **content-bible.md** is the content planning bible
- **product-requirements-document.md** contains product requirements
- **LOCAL-RELOCATION-IDEATION.md** contains market research & opportunities

## 🎯 Project Status (September 30, 2025)

**Project**: Relocation Quest - International relocation content platform
**Location**: `/Users/dankeegan/local-relocation`
**Live Site**: https://relocation.quest ✅
**Current Reality**: 999 articles published (but quality issues identified)

### What We Learned (Critical Insights)
- ❌ 97% of articles in single "Digital Nomad" category (should be distributed)
- ❌ Generic content without unique insights or problem-solving
- ❌ No competitive research or content gap analysis
- ❌ Wall-of-text formatting issues
- ❌ Missing the sophisticated opportunities from ideation document
- ✅ Pipeline works technically but content quality needs improvement

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

Output: Article draft with:
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

Output: Publication-ready article with:
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

## 💰 API Configuration

```bash
# Research & Analysis
DATAFORSEO_LOGIN=[configured in .env.local]
DATAFORSEO_PASSWORD=[configured in .env.local]
PERPLEXITY_API_KEY=[configured in .env.local]

# Content Generation
TAVILY_API_KEY=[configured in .env.local]
SERPER_API_KEY=[configured in .env.local]
FIRECRAWL_API_KEY=[configured in .env.local]

# Images & Media
REPLICATE_API_TOKEN=[configured in .env.local]
LUMA_API_KEY=[configured in .env.local]

# CMS
SANITY_API_TOKEN=[configured in .env.local]
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