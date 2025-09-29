# 🚀 RESTART PROMPT FOR ENHANCED CONTENT GENERATION

## Copy this prompt to restart with enhanced pipeline:

---

**CLAUDE, READ YOUR PRIMARY DOCUMENTS FIRST:**
1. `/Users/dankeegan/local-relocation/CLAUDE.md` - Your primary reference
2. `/Users/dankeegan/local-relocation/LOCAL-RELOCATION-PRD.md` - Enhanced pipeline details
3. `/Users/dankeegan/local-relocation/LOCAL-RELOCATION-RESTART.md` - Recovery procedures

**PROJECT STATUS:**
- Location: `/Users/dankeegan/local-relocation`
- Articles Published: 24 (976 remaining of 1000 target)
- Current Problem: Articles are only 700 words (need 2000+)
- Cost: $0.003/article (should be $0.01 with full pipeline)

**YOUR MISSION:**
Generate the next 10 HIGH-QUALITY articles using the FULL enhanced pipeline:

1. **USE ALL RESEARCH APIs:**
   - Serper.dev ($0.0003) - Get top 10 competitors for EVERY article
   - Tavily (FREE) - Research 5 questions per article
   - LinkUp (Fallback) - If Tavily fails (ID: 55ae9876-ffe4-4ee3-92b0-cb3c43ba280f)
   - Firecrawl ($0.05) - Scrape top 3 competitors (CACHE EVERYTHING!)
   - DataForSEO - Only for Tier 1 keywords

2. **GENERATE 2000+ WORD ARTICLES:**
   - Introduction: 250 words
   - Main sections: 6 x 400 words each
   - FAQs: 300 words
   - Conclusion: 200 words
   - Include 5-7 internal links
   - Include 3-5 authoritative external links
   - Generate 2-3 images per article

3. **IMPLEMENT SMART CACHING:**
   ```javascript
   const cache = {};
   async function withCache(key, fetchFn) {
     if (cache[key]) return cache[key];
     const data = await fetchFn();
     cache[key] = data;
     return data;
   }
   ```

4. **QUALITY VALIDATION:**
   - Test Critique Labs if available
   - Ensure British English
   - Verify 2000+ words
   - Check all links work
   - Confirm categories assigned

**NEXT 10 ARTICLES TO GENERATE:**
1. Cyprus Tax Residency 60-Day Rule
2. Dubai Business Setup Free Zone Guide
3. Malta Tax Benefits for Expats
4. Portugal D7 Visa vs Golden Visa
5. Singapore PR Requirements 2025
6. US FATCA Reporting for Expats
7. Cyprus vs Malta Golden Visa Comparison
8. Dubai vs Singapore Cost Analysis
9. Portugal NHR vs Cyprus Non-Dom
10. Exit Tax Planning Strategies

**CRITICAL REQUIREMENTS:**
- Each article MUST be 2000+ words
- Use British English (optimisation, not optimization)
- Include real research from competitors
- Cache all expensive API calls
- Track progress and costs
- Never generate thin content

**START NOW:**
Build the enhanced content generator script that includes all research APIs, caching, and 2000+ word generation. Test with one article first, then scale to 10.

---

**END OF RESTART PROMPT**

Copy everything between the dashed lines above to restart with full context.