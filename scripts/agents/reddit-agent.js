/**
 * Reddit Agent - Real human experiences and stories
 * FREE for read-only access!
 */

import fetch from 'node-fetch';

class RedditAgent {
  constructor() {
    this.results = {
      stories: [],
      insights: [],
      problems: [],
      solutions: []
    };
    
    // Relevant subreddits for relocation/visa content
    this.subreddits = [
      'expats',
      'IWantOut', 
      'digitalnomad',
      'ExpatFinance',
      'immigration',
      'ExpatFIRE',
      'portugal',
      'Cyprus',
      'dubai',
      'TillSverige',
      'iwanttorun'
    ];
    
    // Cache for Reddit API calls (1 day cache)
    this.cache = new Map();
  }

  /**
   * Search Reddit for real experiences about a keyword
   */
  async searchReddit(keyword, subreddit = null) {
    const searchQuery = encodeURIComponent(keyword);
    const subredditPath = subreddit ? `/r/${subreddit}` : '';
    
    // Check cache first
    const cacheKey = `reddit_${searchQuery}_${subreddit || 'all'}`;
    const cached = this.cache.get(cacheKey);
    if (cached && cached.timestamp > Date.now() - 86400000) { // 24 hour cache
      console.log('✅ Reddit data from cache');
      return cached.data;
    }
    
    try {
      const url = `https://www.reddit.com${subredditPath}/search.json?q=${searchQuery}&limit=25&sort=relevance&t=year`;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'RelocationQuest/1.0 (Content Research Bot)'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Cache the results
        this.cache.set(cacheKey, {
          data: data,
          timestamp: Date.now()
        });
        
        return data;
      }
    } catch (error) {
      console.error(`Reddit search error: ${error.message}`);
    }
    
    return null;
  }

  /**
   * Extract authentic quotes and experiences
   */
  extractAuthenticContent(redditData) {
    const experiences = [];
    
    if (!redditData?.data?.children) return experiences;
    
    for (const post of redditData.data.children) {
      const postData = post.data;
      
      // Skip low-quality posts
      if (postData.score < 5) continue;
      
      // Look for posts with real experiences
      const isExperience = 
        postData.selftext?.includes('I moved') ||
        postData.selftext?.includes('I lived') ||
        postData.selftext?.includes('my experience') ||
        postData.title?.includes('moved to') ||
        postData.title?.includes('living in');
      
      if (isExperience && postData.selftext) {
        // Extract key sentences
        const sentences = postData.selftext.split(/[.!?]+/);
        const valuableSentences = sentences.filter(s => 
          s.length > 30 && s.length < 200 &&
          (s.includes('wish I knew') ||
           s.includes('biggest mistake') ||
           s.includes('best decision') ||
           s.includes('don\'t forget') ||
           s.includes('make sure') ||
           s.includes('cost me') ||
           s.includes('saved me') ||
           s.includes('took me'))
        );
        
        if (valuableSentences.length > 0) {
          experiences.push({
            quote: valuableSentences[0].trim(),
            context: postData.title,
            subreddit: postData.subreddit,
            score: postData.score,
            url: `https://reddit.com${postData.permalink}`
          });
        }
      }
    }
    
    return experiences;
  }

  /**
   * Get common problems and solutions
   */
  async getCommonIssues(keyword) {
    const problemKeywords = [
      `${keyword} problems`,
      `${keyword} issues`,
      `${keyword} mistakes`,
      `${keyword} avoid`,
      `${keyword} warning`
    ];
    
    const allProblems = [];
    
    for (const searchTerm of problemKeywords) {
      const data = await this.searchReddit(searchTerm);
      const posts = data?.data?.children || [];
      
      for (const post of posts.slice(0, 5)) {
        const postData = post.data;
        
        if (postData.score > 10 && postData.selftext) {
          // Extract problem statements
          const problemMatches = postData.selftext.match(
            /(problem|issue|mistake|avoid|warning|careful|don't|never)[^.!?]*[.!?]/gi
          ) || [];
          
          for (const match of problemMatches.slice(0, 2)) {
            allProblems.push({
              problem: match.trim(),
              source: postData.subreddit,
              score: postData.score
            });
          }
        }
      }
    }
    
    return allProblems;
  }

  /**
   * Main research method
   */
  async research(keyword) {
    console.log('\n🔍 Reddit Agent: Gathering real human experiences...');
    
    try {
      // Search across relevant subreddits
      console.log('   Searching r/expats...');
      const expatsData = await this.searchReddit(keyword, 'expats');
      
      console.log('   Searching r/IWantOut...');
      const iwantoutData = await this.searchReddit(keyword, 'IWantOut');
      
      console.log('   Searching r/digitalnomad...');
      const nomadData = await this.searchReddit(keyword, 'digitalnomad');
      
      // Extract authentic content
      const expatsExperiences = this.extractAuthenticContent(expatsData);
      const iwantoutExperiences = this.extractAuthenticContent(iwantoutData);
      const nomadExperiences = this.extractAuthenticContent(nomadData);
      
      // Combine and sort by score
      const allExperiences = [
        ...expatsExperiences,
        ...iwantoutExperiences,
        ...nomadExperiences
      ].sort((a, b) => b.score - a.score);
      
      // Get top 3 most valuable quotes
      this.results.stories = allExperiences.slice(0, 3);
      
      // Get common problems
      this.results.problems = await this.getCommonIssues(keyword);
      
      // Extract insights
      this.results.insights = this.extractInsights(allExperiences);
      
      console.log(`✅ Reddit: Found ${this.results.stories.length} authentic stories`);
      console.log(`✅ Reddit: Identified ${this.results.problems.length} common problems`);
      
      return this.results;
      
    } catch (error) {
      console.error('Reddit Agent error:', error);
      return this.results;
    }
  }

  /**
   * Extract key insights from experiences
   */
  extractInsights(experiences) {
    const insights = [];
    
    // Group by common themes
    const themes = {
      cost: [],
      time: [],
      documentation: [],
      lifestyle: [],
      mistakes: []
    };
    
    for (const exp of experiences) {
      const quote = exp.quote.toLowerCase();
      
      if (quote.includes('cost') || quote.includes('expensive') || quote.includes('cheap')) {
        themes.cost.push(exp);
      }
      if (quote.includes('months') || quote.includes('weeks') || quote.includes('days')) {
        themes.time.push(exp);
      }
      if (quote.includes('document') || quote.includes('paperwork') || quote.includes('visa')) {
        themes.documentation.push(exp);
      }
      if (quote.includes('life') || quote.includes('living') || quote.includes('culture')) {
        themes.lifestyle.push(exp);
      }
      if (quote.includes('mistake') || quote.includes('wish') || quote.includes('should have')) {
        themes.mistakes.push(exp);
      }
    }
    
    // Create insights from themes
    for (const [theme, posts] of Object.entries(themes)) {
      if (posts.length > 0) {
        insights.push({
          theme: theme,
          frequency: posts.length,
          topExample: posts[0]?.quote
        });
      }
    }
    
    return insights;
  }

  /**
   * Format for inclusion in article
   */
  formatForArticle() {
    let content = '';
    
    // Add real experiences section
    if (this.results.stories.length > 0) {
      content += '\n## Real Experiences from the Community\n\n';
      
      for (const story of this.results.stories) {
        content += `> "${story.quote}"\n`;
        content += `> — *${story.subreddit} user*\n\n`;
      }
    }
    
    // Add common challenges section
    if (this.results.problems.length > 0) {
      content += '\n### Common Challenges to Avoid\n\n';
      
      const uniqueProblems = [...new Set(this.results.problems.map(p => p.problem))];
      for (const problem of uniqueProblems.slice(0, 5)) {
        content += `- ${problem}\n`;
      }
      content += '\n';
    }
    
    return content;
  }
}

export default RedditAgent;