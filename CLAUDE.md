# 🤖 CLAUDE.MD - SINGLE SOURCE OF TRUTH

**THIS IS YOUR PRIMARY DOCUMENT - READ THIS FIRST FOR EVERY SESSION**

## 📚 DOCUMENT RULES
- **NO NEW DOCUMENTS** unless explicitly requested by user
- **CLAUDE.md** is the ONLY source for:
  - Project kickoff
  - Project restart 
  - Explaining what we're doing
  - Current status and next steps
- **Other documents**:
  - LOCAL-RELOCATION-PRD.md - Product requirements (kept separate)
  - All others should be merged here or deleted

## 🎯 Project Status (September 29, 2025 - 18:15)

**Project**: Relocation Quest - International relocation content platform
**Location**: `/Users/dankeegan/local-relocation`
**Mission**: Generate 1000 SEO-optimized articles at $0.01 per article
**Current**: 24/1000 articles published (976 remaining)
**Live Site**: https://relocation.quest ✅

## 📊 Current Reality Check

### What's Actually Working
- ✅ Site is LIVE and deployed
- ✅ 24 articles published (but quality varies)
- ✅ Sanity CMS connected and functioning
- ✅ Build pipeline works (when we don't break it)
- ✅ Image generation via Replicate/Flux
- ✅ Reading time indicators implemented

### Critical Issues
- ❌ Articles too short (700-1500 words vs 2000+ target)
- ❌ Not consistently using research APIs
- ❌ Premium components breaking builds
- ❌ No systematic content generation
- ❌ Cost tracking not implemented
- ❌ 976 articles still needed

## 🏗️ Architecture (CONFIRMED WORKING)

### Naming Convention (DON'T CONFUSE THESE!)
- **local-relocation**: Local directory
- **github-relocation**: GitHub repo 
- **vercel-relocation**: Vercel deployment
- **Universal Sanity**: Project ID 93ewsltm
- **sanity-relocation**: Current workspace

### Live Endpoints
- **Production**: https://relocation.quest
- **Sanity Studio**: https://universal-sanity.sanity.studio/
- **GitHub**: https://github.com/Londondannyboy/github-relocation
- **Vercel Dashboard**: https://vercel.com/londondannyboys-projects/vercel-relocation

## 🚀 CONTENT GENERATION PIPELINE (USE THIS!)

### Step 1: Research Phase
```javascript
// ALWAYS use these APIs for quality content
const research = {
  serper: await serperSearch(keyword),      // $0.0003 - SERP analysis
  tavily: await tavilyResearch(query),      // FREE - 1000/month
  firecrawl: await firecrawlScrape(url),    // $0.05 - cache after first use
  dataForSEO: await getMetrics(keyword)     // Only for Tier 1 keywords
};
```

### Step 2: Content Structure (2000+ WORDS MANDATORY)
```javascript
const article = {
  title: "Under 70 characters for SEO",
  sections: {
    introduction: 250,      // Hook the reader
    overview: 400,         // Set context
    requirements: 400,     // Detailed criteria
    process: 400,         // Step-by-step guide
    costs: 300,          // Breakdown with tables
    benefits: 300,       // Value proposition
    mistakes: 250,       // Common pitfalls
    faqs: 300,          // Answer searches
    conclusion: 200     // CTA and summary
  },
  totalWords: 2600,
  
  requirements: {
    internalLinks: "5-7 to related articles",
    externalLinks: "3-5 authoritative sources",
    images: "Hero image REQUIRED (Flux/SDXL)",
    readTime: "Calculate at 225 words/minute",
    category: "MUST assign to existing category"
  }
};
```

### Step 3: Image Generation
```javascript
// Use Flux Schnell for speed, SDXL as fallback
const image = await generateImage({
  model: "flux-schnell",  // Fast, good quality
  prompt: "Professional, relevant to article topic",
  format: "jpg",          // JPEG for body images
  cost: "$0.003"         // Track in article metadata
});
```

### Step 4: Publishing Checklist
- [ ] Title under 70 characters
- [ ] 2000+ words minimum
- [ ] Hero image generated
- [ ] Reading time calculated
- [ ] Category assigned
- [ ] No draft status
- [ ] Build tested locally

## 💰 API Keys & Costs

```bash
# All configured in .env.local
TAVILY_API_KEY=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  # 1000 free/month
SERPER_API_KEY=dc168391eeb102a7da15466f1b04477445356d9d    # $0.0003/search
FIRECRAWL_API_KEY=fc-fcc00e00206d4c1db2653d3815a2b0b0      # $0.05/scrape
REPLICATE_API_TOKEN=[REDACTED]
LUMA_API_KEY=luma-c78aecd8-ffe1-4e77-acb0-8231ae4749ef-1a63a717-96c8-48b8-8c04-700ea35dc2e2
```

## 📝 Working Scripts (TESTED)

```bash
# Generate content with images
node scripts/generate-dubai-fast.js       # Creates article without research
node scripts/generate-batch-fast.js       # Multiple articles quickly
node scripts/add-reading-time.js          # Update all reading times
node scripts/fix-dubai-image.js           # Add image to existing article

# Build and deploy
npm run build                              # Test locally first!
git add -A && git commit -m "msg" && git push  # Deploy to Vercel
```

## 🔧 Common Build Fixes

### If build fails with "Cannot read properties of null"
1. Check for posts without images
2. Check for drafts (delete them)
3. Clear dist folder: `rm -rf dist .astro`
4. Check slug conflicts

### If premium components break
1. Remove from pages temporarily
2. Test components individually
3. Check prop types match usage

### If deployment fails
1. Check Vercel logs for specific error
2. Test build locally first
3. Remove problematic content
4. Push clean version

## 🎯 TODAY'S FOCUS: CONTENT GENERATION

### Immediate Actions (Sep 29, 2025)
1. **Generate 10 quality articles NOW**
   - Focus: Dubai, Singapore, Malta, Cyprus
   - 2000+ words each
   - WITH images
   - WITH research

2. **Scripts to Create**
   ```bash
   scripts/generate-enhanced-batch.js  # With all APIs
   scripts/track-costs.js              # Monitor spending
   scripts/validate-content.js         # Quality check
   ```

3. **Content Calendar**
   - Today: 10 articles (34 total)
   - Tomorrow: 20 articles (54 total)
   - This week: 100 articles (124 total)
   - End goal: 1000 articles

## ⚠️ CRITICAL RULES

### NEVER
- ❌ Push untested code
- ❌ Generate without images
- ❌ Skip build test
- ❌ Create articles under 2000 words
- ❌ Ignore build errors
- ❌ Mix up project names

### ALWAYS
- ✅ Test build locally first
- ✅ Include hero images
- ✅ Calculate reading time
- ✅ Use British English
- ✅ Cache API responses
- ✅ Track costs

## 📊 Progress Metrics

| Metric | Current | Target | Status |
|--------|---------|--------|---------|
| Articles | 24 | 1000 | 🔴 2.4% |
| Avg Words | 700 | 2000+ | 🔴 35% |
| Cost/Article | $0.003 | $0.01 | 🟢 30% |
| Quality Score | 65 | 80+ | 🟡 81% |
| Build Success | 90% | 100% | 🟡 90% |

## 🚨 Recovery Procedure (If Everything Breaks)

```bash
# 1. Revert to last working commit
git log --oneline -10  # Find last working
git reset --hard <commit-hash>

# 2. Clean build
rm -rf dist .astro node_modules
npm install
npm run build

# 3. Test locally
npm run dev  # Check localhost:4321

# 4. Deploy clean version
git push --force
```

---

**REMEMBER**: We're here to generate 1000 articles. Everything else is secondary. Focus on content, test before pushing, and keep the site live.