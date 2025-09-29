# 📋 PRODUCT REQUIREMENTS DOCUMENT - RELOCATION QUEST

**Version**: 5.0 - Content Generation Sprint
**Last Updated**: September 29, 2025 - 18:20
**Status**: ACTIVE - Focus on 1000 Articles

---

## 🎯 SINGLE OBJECTIVE

**Generate 1000 high-quality articles at $0.01/article to capture $50K+/month revenue**

Current: 24/1000 (2.4% complete)
Deadline: Q4 2025
Daily Target: 50 articles

---

## 📊 CURRENT REALITY (Sep 29, 18:20)

### What's Live
- **Site**: https://relocation.quest ✅
- **Articles**: 24 published
- **Quality**: 700 words average (TOO LOW)
- **Cost**: $0.003/article (can afford more)
- **Build**: 90% success rate

### What's Broken
- Articles too short (need 2000+ words)
- Not using research APIs consistently
- No batch generation system
- 976 articles still needed

---

## 🚀 CONTENT REQUIREMENTS (NON-NEGOTIABLE)

### Every Article MUST Have:
```
✅ 2000+ words (2500 target)
✅ Hero image (Flux/SDXL)
✅ 70 character title max
✅ British English
✅ 5-7 internal links
✅ 3-5 external citations
✅ Reading time calculated
✅ Category assigned
✅ Build tested
```

### Article Structure Template
```
1. Title (70 chars max)
2. Introduction (250 words) - Problem/solution hook
3. Overview (400 words) - Context and background  
4. Requirements (400 words) - Detailed criteria
5. Process (400 words) - Step-by-step guide
6. Costs (300 words) - With comparison table
7. Benefits (300 words) - Value proposition
8. Mistakes (250 words) - Common pitfalls
9. FAQs (300 words) - Search intent answers
10. Conclusion (200 words) - Summary and CTA

TOTAL: 2600 words
```

---

## 💰 ECONOMICS (Why This Matters)

### Investment
- 1000 articles × $0.01 = $10 total cost
- Time: 20 hours of compute
- APIs: $100 in credits

### Returns
- Search Volume: 5M+ monthly
- Traffic: 500K visitors/month
- Ad Revenue: $20K/month 
- Affiliates: $30K/month
- **Total: $50K+/month**
- **ROI: 5000% monthly**

---

## 🤖 GENERATION PIPELINE (USE THIS)

```javascript
async function generateArticle(keyword) {
  // 1. RESEARCH (with caching)
  const serp = await serper.search(keyword);          // $0.0003
  const competitors = await firecrawl.scrape(top3);   // $0.05 (cached)
  const facts = await tavily.research(questions);     // FREE
  
  // 2. GENERATE (2000+ words)
  const content = await generateWithStructure({
    research: combinedData,
    template: articleTemplate,
    wordCount: 2500
  });
  
  // 3. ENHANCE
  const image = await flux.generateHero(prompt);      // $0.003
  const readTime = Math.ceil(wordCount / 225);
  
  // 4. VALIDATE & PUBLISH
  await sanity.create(article);
  await npm.run('build'); // Test locally
  
  return { success: true, cost: 0.008 };
}
```

---

## 📅 EXECUTION PLAN

### TODAY (Sep 29) - 10 Articles
```bash
1. Create scripts/generate-enhanced-batch.js
2. Generate 10 articles:
   - Dubai Golden Visa Guide
   - Singapore PR Requirements
   - Malta Digital Nomad Visa
   - Cyprus Non-Dom Tax Benefits
   - Portugal D7 Visa Guide
   - Estonia e-Residency Program
   - Barbados Welcome Stamp
   - Croatia Digital Nomad
   - Mexico Temporary Residence
   - Thailand Elite Visa
3. All with images, 2000+ words
4. Deploy successfully
```

### THIS WEEK - 100 Articles
- Day 1 (Today): 10 articles
- Day 2: 20 articles  
- Day 3: 20 articles
- Day 4: 20 articles
- Day 5: 30 articles

### THIS MONTH - 1000 Articles
- Week 1: 100 articles
- Week 2: 300 articles
- Week 3: 300 articles
- Week 4: 300 articles

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

## ✅ SUCCESS CRITERIA

### Article Quality
- [ ] 2000+ words
- [ ] Hero image present
- [ ] 9+ minute read time
- [ ] Passes build test

### Pipeline Performance  
- [ ] < $0.01 per article
- [ ] < 2 minutes generation
- [ ] 100% build success
- [ ] 80% cache hit rate

### Business Metrics
- [ ] 1000 articles by Q4
- [ ] $50K monthly revenue
- [ ] 500K monthly visitors
- [ ] 10K+ keywords ranked

---

## 🚨 RULES TO NEVER BREAK

1. **NO articles under 2000 words**
2. **NO publishing without images**
3. **NO American English** (use British)
4. **NO untested deployments**
5. **NO new documentation** (update CLAUDE.md only)
6. **NO premium components** (they break builds)

---

## 📝 NEXT ACTIONS (DO NOW)

```bash
1. cd /Users/dankeegan/local-relocation
2. Create enhanced generation script
3. Generate 10 articles TODAY
4. Test build locally
5. Deploy to production
6. Update CLAUDE.md with progress
```

---

**REMEMBER**: We need 976 more articles. Everything else is noise. Generate content, test builds, deploy. Repeat until done.