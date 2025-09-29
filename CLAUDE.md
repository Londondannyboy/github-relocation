# 🤖 CLAUDE.MD - PRIMARY AI REFERENCE DOCUMENT

**THIS IS YOUR PRIMARY DOCUMENT - READ THIS FIRST FOR EVERY SESSION**

## 🎯 Project Identity

**Project**: Relocation Quest - International relocation content platform
**Location**: `/Users/dankeegan/local-relocation`
**Mission**: Generate 1000 SEO-optimized articles at $0.01 per article
**Status**: 25/1000 articles published (975 remaining)

## 📊 Current Performance

### Live Metrics (Sep 29, 2025)
- **Articles Published**: 25
- **Search Volume Captured**: 65,000+ monthly
- **Potential Value**: $3,600/month
- **Average Article Length**: 700 words (TOO SHORT!)
- **Target Article Length**: 2000+ words
- **Cost Per Article**: $0.003 → Target $0.01
- **Generation Speed**: 20 articles in 25 minutes

## 🚀 ENHANCED CONTENT PIPELINE

### Research Phase (USE ALL APIS!)
```javascript
// 1. SERP Analysis - ALWAYS USE
const competitors = await serper.search(keyword); // $0.0003

// 2. Competitor Content - CACHE EVERYTHING
const content = await withCache('competitor', url, async () => {
  return await firecrawl.scrape(url); // $0.05 first time, free after
});

// 3. Fresh Research - USE LIBERALLY
const facts = await tavily.search(questions); // FREE - 1000/month
// FALLBACK: LinkUp API if Tavily fails

// 4. Keyword Metrics - SELECTIVE
const metrics = await dataForSEO.check(keyword); // Only Tier 1
```

### Content Structure (2000+ WORDS MINIMUM!)
```javascript
{
  introduction: 250 words,
  sections: [
    'Overview' (400 words),
    'Requirements' (400 words),
    'Process' (400 words),
    'Costs' (300 words),
    'Benefits' (300 words),
    'Mistakes' (250 words)
  ],
  faqs: 300 words,
  conclusion: 200 words,
  
  // REQUIRED:
  internalLinks: 5-7,
  externalLinks: 3-5,
  images: 2-3,
  tables: 1-2
}
```

## 🏗️ Architecture

### Project Structure
```
/Users/dankeegan/local-relocation/
├── src/               # Astro source
├── sanity/           # CMS config
├── scripts/          # Generation scripts
├── dist/             # Build output
└── docs/             # Documentation
```

### Naming Convention
- **local-relocation**: Local directory
- **github-relocation**: GitHub repo
- **vercel-relocation**: Vercel deployment (ID: prj_1GgLva0kMVd018TGoVK3LXvELhZE)
- **sanity-relocation**: Workspace
- **Universal Project**: 93ewsltm

### Live Endpoints
- **Production**: https://relocation.quest
- **Sanity Studio**: https://universal-sanity.sanity.studio/
- **GitHub**: https://github.com/Londondannyboy/github-relocation
- **Vercel**: https://vercel.com/londondannyboys-projects/vercel-relocation

## 💰 API Stack & Usage

### Active APIs (USE THEM ALL!)
```bash
✅ Serper.dev - $0.0003/search - USE FOR EVERY ARTICLE
✅ Tavily - FREE (1000/month) - USE FOR RESEARCH
✅ LinkUp - Fallback for Tavily (55ae9876-ffe4-4ee3-92b0-cb3c43ba280f)
✅ Firecrawl - $0.05/page - CACHE EVERYTHING
✅ DataForSEO - $50 credit - SELECTIVE USE
✅ Replicate - Flux Pro images - $0.003/image
✅ Critique Labs - Quality check - TESTING
```

## ⚠️ Critical Rules

### NEVER DO
- ❌ Generate articles under 1500 words
- ❌ Skip competitor research
- ❌ Skip image generation
- ❌ Use American English (use British)
- ❌ Publish without categories
- ❌ Exceed $0.02 per article

### ALWAYS DO
- ✅ Write 2000+ words minimum
- ✅ Use Serper for SERP analysis
- ✅ Cache all competitor content
- ✅ Include 5-7 internal links
- ✅ Add 3-5 authoritative external links
- ✅ Generate unique Flux Pro images
- ✅ Track progress in master list
- ✅ Use British English

## 📝 Quick Commands

### Generate Articles
```bash
# Test enhanced pipeline
node scripts/test-enhanced-pipeline.js

# Generate batch (with research)
node scripts/generate-batch-enhanced.js --count=20

# Generate to target
node scripts/generate-to-target.js --target=1000
```

### Monitoring
```bash
# Check progress
node scripts/check-progress.js

# Build and deploy
npm run build && git push
```

## 📊 Progress Tracking

### Completed (25/1000)
- Exit Tax: 3 articles
- Digital Nomad Visas: 8 articles
- Golden Visas: 5 articles
- Tax Strategies: 4 articles
- Other: 5 articles

### Next Priorities (975 remaining)
1. Cyprus focus (20 keywords)
2. Dubai focus (20 keywords)
3. Portugal NHR (15 keywords)
4. Singapore expat (15 keywords)
5. Malta programs (10 keywords)

## 🔧 Troubleshooting

### If Generation Fails
1. Check API credits
2. Verify cache is working
3. Fallback to simpler pipeline
4. Never block - always publish something

### If Quality Too Low
1. Increase word count target
2. Add more research sources
3. Use Critique Labs validation
4. Add more external citations

### If Costs Too High
1. Increase cache TTL
2. Skip DataForSEO for Tier 3
3. Batch similar articles
4. Reuse research across topics

## 🎯 Current Priority

**IMMEDIATE TASK**: Implement enhanced pipeline
1. Build script with full research integration
2. Test with 5 articles
3. Compare quality vs current
4. Scale to 100 articles today
5. Reach 1000 by end of week

## 📈 Success Metrics

- **Word Count**: 2000+ (currently 700)
- **Cost**: Under $0.01 (currently $0.003)
- **Quality Score**: 80+ (currently ~65)
- **Generation Time**: 2 min/article
- **Cache Hit Rate**: 80%+

---

**Remember**: We're building authority. Every article must be comprehensive, well-researched, and better than competitors. Use ALL available APIs to achieve this!