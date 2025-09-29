# 📋 RELOCATION-PRD-UNIFIED v4.0
**Product Requirements Document - Enhanced Content Pipeline**  
**Last Updated**: September 29, 2025  
**Status**: ACTIVE - Industrialized Content Generation

---

## 🎯 Project Overview

### Current Status
- **Articles Published**: 25 live articles
- **Search Volume Captured**: 65,000+ monthly searches
- **Potential Value**: $3,600/month
- **Articles Remaining**: 975 of 1000 target
- **Cost Per Article**: $0.003 (current) → $0.01 (enhanced)

### Project Structure
- **Local Directory**: `/Users/dankeegan/local-relocation`
- **GitHub Repository**: `github-relocation` (https://github.com/Londondannyboy/github-relocation)
- **Sanity Workspace**: `sanity-relocation` (Universal Project: 93ewsltm)
- **Vercel Project**: `vercel-relocation` (ID: prj_1GgLva0kMVd018TGoVK3LXvELhZE)
- **Production Domain**: `https://relocation.quest` (live)

### Objectives
- Generate 1000 high-quality SEO articles (2000+ words each)
- Achieve 20,000+ organic visits/month within 90 days
- Capture 10-40% conversion from AI search traffic
- Build topical authority across relocation/immigration topics
- Maintain quality score 80+ per article

---

## 🚀 ENHANCED CONTENT PIPELINE (ACTIVE)

### Research Phase (Cached)
```javascript
// Step 1: SERP Analysis - $0.0003
await serper.search(keyword) // Get top 10 competitors

// Step 2: Competitor Scraping - $0.05 (cached after first use)
await firecrawl.scrape(competitorURL) // Deep content analysis

// Step 3: Fact Research - FREE
await tavily.search(questions) // 1000 free searches/month
// FALLBACK: LinkUp API (55ae9876-ffe4-4ee3-92b0-cb3c43ba280f)

// Step 4: Keyword Validation - $0.01 (selective)
await dataForSEO.getMetrics(keyword) // Only for Tier 1
```

### Content Generation (2000+ words)
```javascript
const article = {
  introduction: 250 words,
  mainSections: [
    { title: 'Overview', content: 400 words },
    { title: 'Requirements', content: 400 words },
    { title: 'Process', content: 400 words },
    { title: 'Costs & Timeline', content: 300 words },
    { title: 'Benefits', content: 300 words },
    { title: 'Common Mistakes', content: 250 words }
  ],
  faqSection: 300 words,
  conclusion: 200 words,
  
  // Required Elements:
  internalLinks: 5-7,
  externalLinks: 3-5 authoritative,
  images: 2-3 (hero + body),
  tables: 1-2 comparisons,
  lists: 3-4 bulleted
}
```

### Quality Validation
```javascript
// Primary: Critique Labs (if available)
await critiqueLabs.factCheck(content)

// Fallback Validation:
- Word count >= 2000
- British English
- Authoritative citations
- Fact-checked claims
- SEO optimization score
```

---

## 💰 Cost Structure

### Per Article (Enhanced Pipeline)
| Component | Cost | Purpose |
|-----------|------|---------|
| Flux Pro Image | $0.003 | Hero image generation |
| Serper.dev | $0.0003 | SERP analysis |
| Firecrawl | $0.005 | Competitor content (cached) |
| Tavily/LinkUp | FREE | Fact research |
| DataForSEO | $0.001 | Selective validation |
| Critique Labs | $0.002 | Quality check |
| **Total** | **$0.011** | Per article |

### At Scale (1000 Articles)
- Total Investment: $11
- Monthly Value Potential: $180,000+
- ROI: 16,000x per month

---

## 🔧 Technical Stack

### Core Technologies
- **Framework**: Astro 5.x + React + TypeScript
- **CMS**: Sanity Universal (93ewsltm)
- **Deployment**: Vercel (auto-deploy)
- **Images**: Flux Pro via Replicate
- **Sitemap**: @astrojs/sitemap (implemented)

### Active APIs
```markdown
✅ Replicate: Flux Pro images ($0.003/image)
✅ Serper.dev: SERP analysis ($0.0003/search)
✅ Tavily: Research (1000 free/month)
✅ LinkUp: Research fallback (55ae9876-ffe4-4ee3-92b0-cb3c43ba280f)
✅ Firecrawl: Competitor scraping ($0.05/page, cached)
✅ DataForSEO: Keyword metrics ($50 credit)
✅ Sanity: CMS operations (multiple tokens)
⚠️ Critique Labs: Quality validation (testing)
```

### Smart Caching System
```javascript
const cache = {
  competitor: {}, // 30-day TTL - 80% cost reduction
  serp: {},      // 7-day TTL
  research: {},  // 24-hour TTL
  
  withCache(type, key, fetchFn) {
    if (cached && !expired) return cached;
    const data = await fetchFn();
    this.save(type, key, data);
    return data;
  }
}
```

---

## 📊 Content Strategy

### 1000 Article Formula
```
5 Countries × 10 Topics × 20 Variations = 1000 Articles

Countries: Cyprus, Dubai, Malta, Portugal, Singapore
Topics: visa, tax, business, residency, banking, 
        property, education, healthcare, cost, citizenship
Variations: 2025, requirements, for Americans, process, guide,
           cost, best, vs comparisons, calculator, how to...
```

### Content Tiers
- **Tier 1** (100 articles): 2500+ words, full research, all features
- **Tier 2** (300 articles): 2000+ words, standard research
- **Tier 3** (600 articles): 1500+ words, cached research

---

## 📈 Progress Tracking

### Current Stats (Sep 29, 2025)
- Articles Created: 25
- Total Word Count: ~35,000
- Categories Active: 12
- Tags Created: 34
- Images Generated: 25
- Total Cost: $0.075
- Time per 20 articles: ~25 minutes

### Quality Metrics
- Average Word Count: Currently 700 → Target 2000+
- Internal Links: 2-3 → Target 5-7
- External Citations: 1-2 → Target 3-5
- SEO Score: 65 → Target 85+

---

## 🔄 Workflow Automation

### Batch Generation Options
1. **Cron Schedule**: Every 30 min, 10 articles
2. **Continuous**: Run until target reached
3. **Context-Managed**: 50 per session, auto-resume

### Error Handling
- API fallbacks for all services
- Progress saved every article
- Automatic retry with exponential backoff
- Never block on single failure

---

## 📝 Documentation

### Key Files
- **PRD**: This document (strategy & requirements)
- **CLAUDE.md**: AI assistant reference
- **CREDENTIALS.md**: API keys (git-ignored)
- **RESTART.md**: Recovery procedures
- **CONTENT.md**: Keyword tracking
- **SUMMARY.md**: Current state

### Tracking Tools
- Sanity Studio: Content management
- Vercel Dashboard: Deployment status
- GitHub: Version control
- Local CSV: Progress tracking

---

## ✅ Success Metrics

### Phase 1 (Current)
- ✅ 25 articles published
- ✅ Basic pipeline working
- ✅ Cost under $0.01/article
- ⚠️ Articles too thin (700 words)

### Phase 2 (This Week)
- [ ] Implement enhanced pipeline
- [ ] 2000+ word articles
- [ ] 100 articles published
- [ ] Quality score 80+

### Phase 3 (Next Week)
- [ ] 500 articles published
- [ ] Full automation running
- [ ] 10,000+ organic visits
- [ ] AI visibility confirmed

### Phase 4 (Month End)
- [ ] 1000 articles complete
- [ ] 20,000+ monthly visits
- [ ] $15,000+ monthly value
- [ ] Top 3 rankings achieved

---

## 🚨 Critical Notes

1. **ALWAYS use British English** (optimisation, not optimization)
2. **ALWAYS include authoritative external links**
3. **NEVER generate articles under 1500 words**
4. **NEVER skip image generation** ($0.003 is worth it)
5. **ALWAYS cache competitor research** (80% cost savings)
6. **ALWAYS track progress** in master spreadsheet

---

**Next Action**: Implement enhanced pipeline with 2000+ word articles!