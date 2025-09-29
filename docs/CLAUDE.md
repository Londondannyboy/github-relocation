# CLAUDE AI ASSISTANT GUIDELINES

## Project Overview
This is the Relocation Quest project - a content platform focused on international relocation, visas, tax optimization, and global lifestyle information.

### 🎯 NEW PROJECT CONFIGURATION (FRESH START)
**STATUS**: Successfully deployed with new naming convention!
- **Local Directory**: `/Users/dankeegan/local-relocation` ✅
- **GitHub Repository**: `github-relocation` (https://github.com/Londondannyboy/github-relocation) ✅
- **Vercel Project**: `local-relocation` (auto-linked) ✅
- **Sanity Project**: `bc08ijz6` (production dataset)
- **Production Domain**: `relocation.quest` (ready to switch)

This new naming convention prevents confusion between services.

## Technical Stack
### Core Framework
- **Frontend**: Astro 5.13.10 + React + TypeScript
- **CMS**: Sanity Studio with enhanced schema
- **Video**: Mux Player v2 with advanced optimizations
- **Styling**: Tailwind CSS with custom animations
- **Deployment**: Vercel with automated CI/CD
- **Database**: Sanity Cloud (production dataset)
- **Analytics**: Mux Data integration
- **Automation**: Vercel Cron Jobs for content publishing

### Content Quality APIs (December 2024)
- **Firecrawl**: Web scraping, PDF parsing, government site monitoring
- **Critique Labs**: Autonomous fact-checking, inline citations, verification
- **LinkUp/Tavily**: Contextual search, real-time web data access
- **Pipeline**: Automated research → fact-checking → citation-rich content generation

### Media Infrastructure
**Image-First Approach with Optional Video Enhancement**

#### Primary: Flux Pro via Replicate (FINALIZED)
- Model: `black-forest-labs/flux-1.1-pro`
- Cost: $0.003 per image (worth the quality)
- Format: AVIF primary, WebP fallback
- Best for professional/business content
- No blocking on generation

#### Optional: MUX Video Integration
**Existing MUX Playback IDs (for reference):**
- **Cyprus**: `ew9vFwrawM3Eq1MVGHUZwu4IPoFOHVv002Hal1ei02JXM`
- **Dubai**: `5br2hylJ4F009vDLHrxWZ3C7UDTw5901GcXYBjSOWNV8k`
- **Portugal**: `Oy1LRvO5eSoXGUTthBNS13r007WorSyGvf2YLh1keA5E`
- **Malta**: `aeX9W002bzUWYKu3Ryln4hLVAplzOm7DfUKm3iZqGGz00`
- **Singapore**: `dCBAYhMsKX7v00HaI1gHsW8tMI2HZDLlb01KJv5hGkpkI`
- **Caribbean**: `021dUb7I5L2G9dDKBWup4efv9Sxh7ZNAtElSbYkN8C2k`

**NOTE**: Videos are optional enhancements, not requirements

## Project Structure (Fresh Start)
```
/Users/dankeegan/local-relocation/
├── src/
│   ├── pages/        # Astro pages + API routes
│   ├── components/   # React/Astro components
│   ├── layouts/      # Layout templates (with proper SEO/favicon)
│   └── styles/       # Global styles
├── public/           
│   ├── favicon.ico   # Proper favicon
│   ├── favicon.svg   
│   ├── apple-touch-icon.png
│   └── site.webmanifest
├── sanity/           # Clean schema setup
├── scripts/          # Content generation scripts
│   ├── test-basic-image.ts
│   ├── test-mux-pipeline.ts
│   ├── generate-article.ts
│   └── generate-video-async.ts
└── docs/             # All documentation
```

## Development Commands
```bash
# Working directory: /Users/dankeegan/local-relocation
cd /Users/dankeegan/local-relocation

# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Deployment
git add .
git commit -m "Description"
git push origin main # Deploys to vercel-relocation
```

## Environment Variables
Required environment variables:
- `PUBLIC_SANITY_PROJECT_ID` - bc08ijz6
- `PUBLIC_SANITY_DATASET` - production
- `PUBLIC_SANITY_API_VERSION` - 2024-01-01
- `SANITY_API_TOKEN` - Read/write token for scripts
- `MUX_TOKEN_ID` - Mux API token ID for video uploads
- `MUX_TOKEN_SECRET` - Mux API secret key
- `PUBLIC_MUX_ENV_KEY` - Mux environment key
- `VERCEL_AI_GATEWAY_API_KEY` - AI Gateway integration
- `CRON_SECRET` - Authentication for automated jobs

## Content Quality API Credentials
Advanced content research and verification APIs:
- `FIRECRAWL_API_KEY` - [Configured in CREDENTIALS.md] (Web scraping, PDF parsing)
- `CRITIQUE_LABS_API_KEY` - [Configured in CREDENTIALS.md] (Fact-checking, citations)
- `LINKUP_API_KEY` - (Advanced contextual search - API key needed)
- `TAVILY_API_KEY` - (Web search for current data and research)

## 🎯 Content Quality Scoring System (0-100)

### Scoring Algorithm
Content quality is measured on a 0-100 scale based on:

**Content Depth (40 points max)**
- 3000+ words: 40 points
- 2000+ words: 35 points  
- 1000+ words: 25 points
- 500+ words: 15 points
- 200+ words: 5 points

**Research Quality (25 points max)**
- Tavily research used: +20 points
- 8+ external links: +5 points
- 4+ external links: +3 points
- 1+ external links: +1 point

**AI Enhancement (20 points max)**
- AI-enhanced content: +15 points
- Multiple enhancements logged: +5 points

**Currency/Freshness (15 points max)**
- Less than 3 months old: +15 points
- Less than 6 months old: +10 points
- Less than 12 months old: +5 points

### Content Enhancement Priority
**High Priority (Score < 60):**
- Use Tavily for current research
- Expand to 2000+ words
- Add 5+ authoritative external links
- Update with 2025 data

**Medium Priority (Score 60-79):**
- Add targeted Tavily research
- Enhance specific sections
- Improve internal linking

**Low Priority (Score 80+):**
- Regular freshness updates
- Monitor for accuracy
- Expand based on user feedback

### Enhancement Tracking
When enhancing content, always document:
1. Tools used (Tavily, Firecrawl, Critique Labs, etc.)
2. Date of enhancement
3. Specific improvements made
4. New quality score after enhancement

## Deployment & Live Sites
- **GitHub**: [github-relocation](https://github.com/Londondannyboy/github-relocation)
- **Vercel Project**: vercel-relocation (staging first)
- **Production Domain**: relocation.quest (switch after validation)
- **Sanity Studio**: sanity-relocation.sanity.studio
- **Auto-deploy**: Pushes to main branch trigger Vercel deployment
- **Migration Plan**: Validate on vercel-relocation.vercel.app first, then switch domain

## Development Commands
```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
git push origin main # Deploy to production
```

## Content Management

### Current Content State (September 2025)
- **91+ articles** with complete SEO optimization
- **14 categories** organized by topic (not geography)
- **Enhanced Sanity schema** with comprehensive field descriptions
- **Automated SEO generation** for all content
- **100% categorized content** with proper organization

### Category Organization
**Topical Categories (NOT Geographic):**
- Golden Visa, Business & Investment, Digital Nomad
- Tax & Finance, Healthcare & Education, Lifestyle & Culture
- Residency & Immigration, and country-specific categories for active programs

**Geographic Content:**
- Countries featured in "Popular Destinations" homepage section
- No separate category pages for countries
- Country-specific content categorized by topic

### SEO Optimization (Completed September 2025)
- ✅ **Homepage SEO**: Title (47 chars), meta description (127 chars)
- ✅ **Schema.org markup**: Organization, Website structured data  
- ✅ **Image caching**: Vercel headers configured (24h cache)
- ✅ **External links**: Strategic government/authority links added
- ✅ **All articles**: Complete SEO titles, meta descriptions, focus keywords, tags

## Sanity CMS Integration

### Enhanced Schema (September 2025)
- **Comprehensive field descriptions** for AI assistance
- **Organized fieldsets**: Content, Media, SEO, Taxonomy, Publishing
- **Enhanced validation** with helpful error messages
- **Rich previews** with status information and visual indicators

### API Tokens Available
- **Developer**: Full read/write access for content management
- **Editor**: Content editing and publishing permissions
- **Deploy**: Deployment operations and schema changes

### Content Scripts (Located in `/scripts/`)
- `auto-categorize-articles.js` - Intelligent article categorization
- `auto-generate-seo-data.js` - Complete SEO metadata generation
- `check-article-categories.js` - Category organization validation
- `remove-country-categories.js` - Geographic vs topical cleanup

## 🤖 Automated Content Publishing (Operational)

### Vercel Cron Jobs (Every 6 Hours)
The project has fully operational automated content publishing:

1. **Publish Content** - `/api/cron/publish-content`
   - Schedule: Every 6 hours (00:00, 06:00, 12:00, 18:00 UTC)
   - Publishes up to 3 draft articles per run

2. **Daily Content** - `/api/cron/daily-content`  
   - Schedule: Daily at 9 AM UTC
   - Creates 2-3 new articles from templates

3. **Weekly Review** - `/api/cron/weekly-review`
   - Schedule: Mondays at 10 AM UTC
   - Generates content health reports and analytics

### Monitoring & Control
- All endpoints secured with `CRON_SECRET` authentication
- Rate limiting: 3 articles max per run, 60s timeout
- Manual triggering available for immediate publishing
- Vercel dashboard monitoring at project functions page

## Security & Best Practices
- Never commit secrets or API keys to repository
- Use environment variables for all sensitive data
- CREDENTIALS.md excluded from git via .gitignore
- Follow security best practices for Sanity operations
- Validate all user inputs and external data

## Testing & Quality
- Build locally before pushing: `npm run build`
- Test responsive design on mobile devices
- Verify Sanity schema changes in Studio interface
- Check TypeScript compilation for errors
- Test cron endpoints manually when modifying

## Phase Completion History

### ✅ Phase 1: Foundation & Infrastructure (COMPLETED)
**Project Successfully Built & Deployed - September 2024**
- Clean design implementation with modern gradient theme
- Complete page structure with working navigation (25+ pages)
- Sanity CMS integration with optimized queries
- Production deployment with reliable automation
- All broken links fixed, unique icons implemented

### ✅ Phase 2: Professional Video & Performance (COMPLETED)  
**Professional Video System - September 2024**
- Mux Player v2 integration with advanced optimizations
- Cyprus video hero with cinematic overlay effects
- Connection-aware quality streaming (2G→360p, 4G+→1080p)
- Video thumbnail system for category pages
- 99% mobile, 100% desktop PageSpeed scores maintained

### ✅ Phase 3: Content & SEO Optimization (COMPLETED)
**Comprehensive Content Management - September 2025**
- 91+ articles with complete SEO optimization
- Enhanced Sanity schema with AI-friendly descriptions
- Automated SEO generation (100% completion rate)
- Category reorganization (topic-based, not geographic)
- All SEO audit recommendations implemented

## Current Project State (September 2025) - FULLY OPERATIONAL ✅

### ✅ **Production Ready & Operational**
- **Live Site**: https://relocation.quest (fully functional)
- **Content Management**: Sanity Studio with enhanced schema including video thumbnails
- **Automation**: Cron jobs running every 6 hours
- **SEO**: All critical issues resolved, optimal performance
- **Categories**: Clean topical organization implemented
- **Documentation**: Fully updated and comprehensive

### ✅ **Video System Implementation**
- **Mobile Video Playback**: Fixed and optimized for all devices
- **Hero Video Sizing**: Responsive (60vh mobile, 80vh tablet, full desktop)
- **Country Video Overlays**: Clean text overlays on video thumbnails
- **Article Video Support**: Country-specific videos auto-display
- **Video Thumbnails**: Curated video previews for featured articles
- **Control Suppression**: No distracting play button overlays

### ✅ **Clean Architecture**
- **No technical debt** - all legacy code removed
- **Unified naming** across all platforms and services  
- **Enhanced schemas** with video support
- **Automated systems** for content management and SEO
- **Security best practices** implemented throughout
- **Dynamic rendering** for video functionality

### ✅ **Ready for Next Phase**
The project is in excellent condition for future development:
- Solid foundation with clean, maintainable code
- Complete documentation including ideation roadmap
- Professional video integration throughout
- Enhanced mobile UX with optimized video experience
- All major performance optimizations complete

## 🔄 A→N Workflow Execution Guide

### How to Execute the Complete Intelligence Pipeline

#### Step A: IDEATION - Find Competitors
```javascript
// Using Perplexity MCP
"Find the top 10 competitors for 'cyprus relocation services'"
"Extract their main content categories and focus areas"
"Identify their most linked-to pages"
```

#### Step B: DISCOVERY - Analyze SERPs
```javascript
// Using Serper.dev
"Search 'cyprus golden visa' and extract:"
- Top 10 ranking URLs
- SERP features present (AI overview, FAQs, etc.)
- Average position of competitors
```

#### Step C: SCRAPING - Extract Content
```javascript
// Using Firecrawl/Puppeteer
"Scrape top 5 competitors and extract:"
- All article URLs
- Word counts per page
- Internal linking structure
- Content categories
```

#### Step D: ANALYSIS - Extract Keywords
```javascript
// Using Perplexity on scraped content
"Extract all SEO keywords from this content"
"Group keywords by search intent"
"Identify keyword gaps we can exploit"
```

#### Step E: VALIDATION - Check Metrics
```javascript
// Using DataForSEO
For each keyword:
- Search volume (min 200/month)
- CPC (indicates commercial value)
- Keyword difficulty (< 70)
- Priority score = (volume × CPC) / difficulty
```

#### Step F: SERP INTEL - Deep Analysis
```javascript
// For target keyword, analyze top 10:
- Average word count → Our target + 10%
- Required features (calculator, FAQ, video)
- Keyword density of winner
- AI overview format if present
```

#### Step G-H: GENERATION - Create Content & Media
```javascript
// Generate with all intelligence applied
- Match word count requirements
- Include all required features
- Optimize for AI citation format
- Generate image with Replicate
```

#### Step I-K: PUBLISH & DEPLOY
```javascript
// Publish to Sanity with full metadata
- Set content tier (pillar/supporting/standard)
- Include all research data
- Add SERP intelligence
- Deploy to production
```

#### Step L-N: TRACK & OPTIMIZE
```javascript
// Store in Neon DB and monitor
- Weekly ranking checks
- AI visibility tracking
- Competitor movement
- Iterate based on data
```

### Intelligence Data Interpretation

#### Reading SERP Intelligence
```javascript
if (avgWordCount > 3000) {
  strategy = "tower"; // Create massive comprehensive resource
} else if (features.includes('calculator')) {
  strategy = "tool"; // Interactive tool is primary
} else if (aiFormat === "stepByStep") {
  strategy = "howto"; // Structure as step-by-step guide
}
```

#### Content Tier Decision Tree
```javascript
if (searchVolume >= 3000 || cpc >= 5) {
  tier = "pillar"; // High-value focus page
} else if (supportsPllarPage) {
  tier = "supporting"; // Cluster content
} else {
  tier = "standard"; // Quick win opportunity
}
```

#### Optimization Triggers
```javascript
// When to optimize existing content
if (ranking > 10) {
  action = "Major overhaul - add 50% more content";
} else if (ranking > 3 && ranking <= 10) {
  action = "Enhance - add missing features from top 3";
} else if (!appearsInAI) {
  action = "Restructure for AI - add FAQ schema";
}
```

### Troubleshooting Intelligence Issues

#### Common Intelligence Problems
- **No AI overview**: Content lacks clear structure → Add FAQ schema
- **Low rankings despite length**: Missing user intent → Analyze top 3 again
- **High bounce rate**: Content doesn't match SERP intent → Restructure
- **No featured snippet**: Missing direct answer → Add definition box

## Support & Troubleshooting

### Common Issues Resolution
- **Build failures**: Check TypeScript errors and import statements
- **Sanity errors**: Verify API tokens and project configuration
- **Vercel deployment**: Review build logs and environment variables
- **Cron job issues**: Check authentication and rate limiting

### Quick Commands
```bash
# Development
npm run dev

# Production build test
npm run build && npm run preview

# Deploy to production  
git add . && git commit -m "Description" && git push origin main

# Check cron job logs
VERCEL_TOKEN=gAYaR1sjB2NTXl4oYQ4CrmeY npx vercel logs https://relocation.quest --token $VERCEL_TOKEN

# Test Sanity connection
SANITY_API_TOKEN="token" node scripts/analyze-article-fields.js
```

---
**Last Updated**: September 25, 2025  
**Project Status**: ✅ Production Ready & Fully Operational  
**Next Phase**: Ready for advanced features or new requirements