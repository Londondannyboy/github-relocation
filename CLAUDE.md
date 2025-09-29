# 🤖 CLAUDE.MD - PRIMARY AI REFERENCE DOCUMENT

**THIS IS YOUR PRIMARY DOCUMENT - READ THIS FIRST FOR EVERY SESSION**

## 🎯 Project Identity

**Project**: Relocation Quest - International relocation content platform
**Location**: `/Users/dankeegan/local-relocation`
**Mission**: Generate 1000 SEO-optimized articles at $0.01 per article

## 🏗️ Current Architecture

### Project Structure
```
/Users/dankeegan/local-relocation/
├── src/
│   ├── pages/        # Astro pages
│   ├── layouts/      # Layout templates
│   ├── components/   # React/Astro components
│   ├── lib/          # Utilities (Sanity client)
│   └── styles/       # Global styles
├── public/           # Static assets
├── sanity/           # Sanity studio configuration
└── scripts/          # Content generation scripts
```

### Naming Convention (CRITICAL)
- **local-relocation**: Local directory
- **github-relocation**: GitHub repository  
- **vercel-relocation**: Vercel deployment
- **sanity-relocation**: Sanity workspace
- **Universal Project**: Sanity project ID 93ewsltm

### Live Endpoints
- **Staging**: https://local-relocation.vercel.app
- **Production**: relocation.quest (ready to switch)
- **Sanity Studio**: https://universal-sanity.sanity.studio/
- **GitHub**: https://github.com/Londondannyboy/github-relocation

## 📋 Essential Documents to Check

1. **LOCAL-RELOCATION-PRD.md** - Product requirements, workflow, schemas
2. **LOCAL-RELOCATION-CREDENTIALS.md** - All API keys and tokens
3. **LOCAL-RELOCATION-CONTENT.md** - 1000 keywords, content strategy
4. **LOCAL-RELOCATION-SUMMARY.md** - Current project state
5. **LOCAL-RELOCATION-RESTART.md** - What to avoid, lessons learned

## ⚠️ Critical Rules

### NEVER DO
- ❌ Use "article" schema - ALWAYS use "post"
- ❌ Reference old project bc08ijz6 (deleted)
- ❌ Create video-first content (too expensive)
- ❌ Skip image generation (required for every article)
- ❌ Exceed $0.01 per article cost
- ❌ Create excerpts over 200 characters (Sanity validation will fail)
- ❌ Reference categories/tags that don't exist in Sanity

### ALWAYS DO
- ✅ Use Flux Pro for images ($0.003/image)
- ✅ Implement smart caching for API calls
- ✅ Generate AVIF format with WebP fallback
- ✅ Track generation costs in Sanity
- ✅ Include DataForSEO metrics (search volume, CPC)
- ✅ Write in British English (optimisation, centre, realise, etc.)
- ✅ Include external source links for every major claim
- ✅ Use Critique Labs for fact-checking when available

## 🔄 Content Generation Workflow

### Step 1: Research (Cache Everything)
```javascript
// Check cache first
const cached = await checkCache(keyword);
if (cached) return cached;

// If not cached, fetch and store
const data = await fetchCompetitors(keyword);
await saveCache(keyword, data);
```

### Step 2: Generate Content
- Use GPT-4 for main content
- Target word counts: Tier 1 (2000+), Tier 2 (1500+), Tier 3 (1000+)
- Include FAQs with schema markup
- Add internal links (3-5) and external links (2-3)

### Step 3: Generate Image
```javascript
// Flux Pro via Replicate
const image = await replicate.run(
  "black-forest-labs/flux-1.1-pro",
  { 
    prompt: imagePrompt,
    aspect_ratio: "16:9" 
  }
);
// Cost: $0.003 per image
```

### Step 4: Publish to Sanity
```javascript
const post = {
  _type: 'post', // NOT 'article'!
  title,
  slug,
  body,
  featuredImage,
  focusKeyword,
  searchVolume, // From DataForSEO
  cpc,          // From DataForSEO
  category,     // Reference to category
  generationCost: 0.01 // Track actual cost
};
```

## 💰 Cost Breakdown (Per Article Target: $0.01)

| Service | Cost | Usage |
|---------|------|-------|
| DataForSEO | $0.003 | Use selectively (cache results) |
| Serper | $0.0003 | Use liberally! |
| Firecrawl | $0.002 | Cache after first scrape |
| Flux Pro | $0.003 | Every article needs image |
| GPT-4 | $0.002 | Main content generation |
| **Total** | **$0.0103** | Within budget! |

## 🚀 Quick Commands

### Development Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Testing Scripts
```bash
# Test Sanity Connection
node scripts/test-universal-sanity.js

# Generate Test Article
node scripts/generate-test-article.js
```

### Deploy to Production
```bash
# Auto-deploys to Vercel on push
git add . && git commit -m "Update" && git push origin main
```

## 🔑 Key Technical Details

### Sanity Configuration
- Project ID: `93ewsltm`
- Dataset: `production`
- Schema: `post` (with categories and tags)

### Image Handling
- Primary: AVIF format
- Fallback: WebP
- Optimization: Via Sharp
- Hosting: Sanity CDN

### API Credentials Status
- ✅ DataForSEO: $50 credit available
- ✅ Flux Pro: Working via Replicate
- ✅ Serper: Active with credits
- ✅ Firecrawl: Token ready
- ✅ Tavily: 1000 free searches/month

## 📊 Progress Tracking

### Content Status
- Keywords Identified: 1000
- Articles Published: 0
- Next Milestone: 20 test articles
- Final Goal: 1000 articles

### Categories Created
1. Visa Requirements (📄)
2. Tax Strategies (💰)
3. Living Costs (🏠)

## 🎯 Current Priority

**NEXT TASK**: Create and publish test article
1. Pick keyword: "Cyprus golden visa" (590 searches/month)
2. Research top 3 competitors (cache results)
3. Generate 2000+ word article
4. Create Flux Pro hero image
5. Publish to Sanity with cost tracking
6. Verify on staging site

## 🚨 Emergency Procedures

### If Sanity Connection Fails
1. Check token in LOCAL-RELOCATION-CREDENTIALS.md
2. Verify project ID is 93ewsltm
3. Access https://universal-sanity.sanity.studio/ to check status

### If Costs Exceed Target
1. Review LOCAL-RELOCATION-PRD.md for optimization strategies
2. Increase caching aggressiveness
3. Reduce DataForSEO calls

### If Deployment Fails
1. Check GitHub token validity
2. Verify Vercel connection
3. Run `npm run build` locally first

## 📝 Session Checklist

When starting any work session:
- [ ] Read this CLAUDE.md first
- [ ] Check LOCAL-RELOCATION-SUMMARY.md for current state
- [ ] Verify Sanity Studio is accessible
- [ ] Review any new requirements in PRD
- [ ] Check cost tracking is working

---

**Remember**: This project has been restarted clean. No old schemas, no contamination. The Universal project (93ewsltm) is the ONLY Sanity project. Always use "post" schema, never "article".