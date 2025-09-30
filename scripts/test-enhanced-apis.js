/**
 * Test script for enhanced APIs
 */

import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config({ path: '.env.local' });

const DATAFORSEO_LOGIN = process.env.DATAFORSEO_LOGIN;
const DATAFORSEO_PASSWORD = process.env.DATAFORSEO_PASSWORD;

async function testSERPAPI() {
  console.log('\n📍 Testing SERP API...');
  
  const auth = Buffer.from(`${DATAFORSEO_LOGIN}:${DATAFORSEO_PASSWORD}`).toString('base64');
  
  try {
    const response = await fetch('https://api.dataforseo.com/v3/serp/google/organic/live/regular', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([{
        keyword: "Dubai Golden Visa",
        location_code: 2840,
        language_code: "en",
        depth: 10
      }])
    });
    
    if (response.ok) {
      const data = await response.json();
      const items = data.tasks?.[0]?.result?.[0]?.items || [];
      console.log(`✅ SERP API: Found ${items.length} results`);
      console.log('Top 3:');
      items.slice(0, 3).forEach((item, i) => {
        console.log(`  ${i+1}. ${item.title}`);
        console.log(`     ${item.url}`);
      });
      return true;
    } else {
      console.log('❌ SERP API failed:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ SERP API error:', error.message);
    return false;
  }
}

async function testRedditAPI() {
  console.log('\n💬 Testing Reddit API (FREE!)...');
  
  try {
    const response = await fetch('https://www.reddit.com/r/dubai/search.json?q=golden+visa&limit=5', {
      headers: {
        'User-Agent': 'RelocationQuest/1.0'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      const posts = data.data?.children || [];
      console.log(`✅ Reddit API: Found ${posts.length} posts`);
      posts.slice(0, 3).forEach((post, i) => {
        console.log(`  ${i+1}. ${post.data.title}`);
        console.log(`     Score: ${post.data.score}, Comments: ${post.data.num_comments}`);
      });
      return true;
    } else {
      console.log('❌ Reddit API failed:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Reddit API error:', error.message);
    return false;
  }
}

async function testDomainAnalytics() {
  console.log('\n🔍 Testing Domain Analytics API...');
  
  const auth = Buffer.from(`${DATAFORSEO_LOGIN}:${DATAFORSEO_PASSWORD}`).toString('base64');
  
  try {
    const response = await fetch('https://api.dataforseo.com/v3/dataforseo_labs/google/domain_keywords/live', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([{
        target: "u.ae",
        location_code: 2840,
        language_code: "en",
        limit: 10,
        filters: ["search_volume", ">", 100]
      }])
    });
    
    if (response.ok) {
      const data = await response.json();
      const items = data.tasks?.[0]?.result?.[0]?.items || [];
      console.log(`✅ Domain Analytics: Found ${items.length} keywords for u.ae`);
      items.slice(0, 3).forEach((item, i) => {
        console.log(`  ${i+1}. "${item.keyword}" - Volume: ${item.search_volume}`);
      });
      return true;
    } else {
      console.log('❌ Domain Analytics failed:', response.status);
      const error = await response.text();
      console.log('Error:', error.substring(0, 200));
      return false;
    }
  } catch (error) {
    console.log('❌ Domain Analytics error:', error.message);
    return false;
  }
}

async function testContentAnalysis() {
  console.log('\n📝 Testing Content Analysis API...');
  
  const auth = Buffer.from(`${DATAFORSEO_LOGIN}:${DATAFORSEO_PASSWORD}`).toString('base64');
  
  try {
    const response = await fetch('https://api.dataforseo.com/v3/content_analysis/search/live', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([{
        keyword: "Dubai Golden Visa",
        page_type: ["article"],
        search_mode: "as_is"
      }])
    });
    
    if (response.ok) {
      const data = await response.json();
      const items = data.tasks?.[0]?.result?.[0]?.items || [];
      console.log(`✅ Content Analysis: Found ${items.length} articles`);
      
      if (items.length > 0) {
        const avgWords = Math.round(items.reduce((sum, item) => sum + (item.word_count || 0), 0) / items.length);
        console.log(`  Average word count: ${avgWords}`);
      }
      return true;
    } else {
      console.log('❌ Content Analysis failed:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Content Analysis error:', error.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Testing Enhanced API Stack\n');
  console.log('================================');
  
  const results = {
    serp: await testSERPAPI(),
    reddit: await testRedditAPI(),
    domain: await testDomainAnalytics(),
    content: await testContentAnalysis()
  };
  
  console.log('\n================================');
  console.log('📊 TEST RESULTS:');
  console.log(`  SERP API: ${results.serp ? '✅' : '❌'}`);
  console.log(`  Reddit API: ${results.reddit ? '✅' : '❌'}`);
  console.log(`  Domain Analytics: ${results.domain ? '✅' : '❌'}`);
  console.log(`  Content Analysis: ${results.content ? '✅' : '❌'}`);
  
  const passed = Object.values(results).filter(r => r).length;
  const total = Object.values(results).length;
  
  console.log(`\n✨ ${passed}/${total} APIs working!`);
}

runAllTests();