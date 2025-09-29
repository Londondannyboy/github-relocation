# 🔄 RESTART RELOCATION QUEST - FRESH START PLAN

## 🎯 NEW NAMING CONVENTION
**CRITICAL**: All services now use consistent prefixed naming:
- **Local Directory**: `/Users/dankeegan/local-relocation`
- **GitHub Repository**: `github-relocation` (https://github.com/Londondannyboy/github-relocation)
- **Sanity Workspace**: `sanity-relocation`
- **Vercel Project**: `vercel-relocation`

## ⚡ QUICK RESTART (3 HOURS TOTAL)

### Hour 1: Fresh Setup & Test Basics
```bash
# 1. Clone new repository (5 mins)
cd /Users/dankeegan
git clone https://github.com/Londondannyboy/github-relocation local-relocation
cd local-relocation

# 2. Initialize Astro project with proper setup (10 mins)
npm create astro@latest . -- --template minimal --typescript

# 3. Test image upload works (10 mins)
npx tsx scripts/test-basic-image.ts

# 4. Test MUX video pipeline (15 mins)
npx tsx scripts/test-mux-pipeline.ts
```
**STOP if images don't display in Sanity Studio**
**VERIFY MUX videos can be embedded**

### Hour 2: Generate Quality Content
Once Flux Pro AND MUX work, create 20 articles:
- Cyprus, Dubai, Malta, Singapore topics
- 2000+ words each
- Images using Flux Pro ($0.003 each - best quality)
- AVIF format with WebP fallback
- MUX video fields (optional, can add later)
- Proper SEO fields with working auto-population
- Smart caching for research (huge savings)

### Hour 3: Deploy & Verify
- Deploy to Vercel as `vercel-relocation`
- Verify all articles display
- Check images work on live site
- Test MUX video replacement for hero images
- Prepare for custom domain switch

## 💡 LESSONS LEARNED

### ✅ WHAT WORKS (FINALIZED)
- Flux Pro images: $0.003 per image (worth the quality)
- AVIF format (20% better than WebP)
- Smart caching (scrape once, use 20×)
- MUX video integration (optional enhancement)
- 2000+ word comprehensive content
- Post schema (NOT article)
- Clear naming convention (local-, github-, sanity-, vercel-)

### ❌ WHAT TO AVOID
- Video-first approach (too expensive at scale)
- Complex schema before basics
- Not testing media display first
- Ambiguous project naming
- Missing favicon and schema.org metadata

## 🛠️ SCRIPTS TO CREATE

Located in `/Users/dankeegan/local-relocation/scripts/`:
1. `test-flux-pro.ts` - Verify Flux Pro image generation
2. `test-mux-pipeline.ts` - Validate MUX video embedding
3. `generate-article.ts` - Create articles with Flux Pro + caching
4. `smart-cache.ts` - Cache competitor/SERP data
5. `generate-video-async.ts` - Non-blocking video generation (optional)

## 📋 LAUNCH SUCCESS CHECKLIST

### Foundation
- [ ] Fresh repository at `github-relocation`
- [ ] Astro project with proper favicon/schema.org
- [ ] Sanity workspace `sanity-relocation` configured
- [ ] Images display in Sanity Studio
- [ ] MUX video pipeline validated

### Content
- [ ] 20 articles with 2000+ words each
- [ ] Flux Pro images working ($0.003 each)
- [ ] AVIF format with WebP fallback
- [ ] Smart caching implemented (save 80% on APIs)
- [ ] SEO fields auto-populate correctly
- [ ] Internal linking to pillar pages
- [ ] MUX videos can replace hero images (optional)

### Deployment
- [ ] Vercel project `vercel-relocation` deployed
- [ ] Custom domain ready to switch
- [ ] No schema errors
- [ ] Cost under $0.01 per article

## 🚀 WHY THIS FRESH START WORKS

1. **Clear naming**: No confusion between services
2. **Test everything**: Images + MUX before content
3. **Flux Pro images**: Professional quality at $0.003/image
4. **Smart caching**: Save 80% on API costs
5. **AVIF format**: 20% better compression than WebP
4. **Proper foundations**: Favicon, schema.org from day one
5. **Clean slate**: No technical debt from old project

---

**READY TO LAUNCH**: Fresh start with `/Users/dankeegan/local-relocation`. All foundations proper. Videos optional but validated.