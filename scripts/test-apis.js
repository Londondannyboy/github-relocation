/**
 * Test script to debug API integrations
 */

import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config({ path: '.env.local' });

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
const LINKUP_API_KEY = process.env.LINKUP_API_KEY;
const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
const CRITIQUE_API_KEY = process.env.CRITIQUE_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

async function testPerplexity() {
  console.log('\n🧠 Testing Perplexity API...');
  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [{
          role: 'user',
          content: 'What are the requirements for Portugal Golden Visa 2025? Please list related questions people ask.'
        }],
        temperature: 0.2
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Perplexity Response:', JSON.stringify(data, null, 2));
      return data;
    } else {
      const error = await response.text();
      console.error('❌ Perplexity Error:', response.status, error);
    }
  } catch (error) {
    console.error('❌ Perplexity Network Error:', error.message);
  }
}

async function testLinkUp() {
  console.log('\n🔍 Testing LinkUp API...');
  try {
    // Try the search endpoint
    const response = await fetch('https://api.linkup.so/v1/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LINKUP_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        q: 'Portugal Golden Visa 2025',
        depth: 'deep',
        outputType: 'searchResults'
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ LinkUp Response:', JSON.stringify(data, null, 2).slice(0, 500));
      return data;
    } else {
      const error = await response.text();
      console.error('❌ LinkUp Error:', response.status, error);
    }
  } catch (error) {
    console.error('❌ LinkUp Network Error:', error.message);
  }
}

async function testTavily() {
  console.log('\n🤖 Testing Tavily API...');
  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'api-key': TAVILY_API_KEY
      },
      body: JSON.stringify({
        query: 'Portugal Golden Visa 2025',
        search_depth: 'advanced',
        include_answer: true,
        include_raw_content: false,
        max_results: 5
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Tavily Response:', {
        answer: data.answer?.slice(0, 200) + '...',
        results: data.results?.length,
        topScore: data.results?.[0]?.score
      });
      return data;
    } else {
      const error = await response.text();
      console.error('❌ Tavily Error:', response.status, error);
    }
  } catch (error) {
    console.error('❌ Tavily Network Error:', error.message);
  }
}

async function testFirecrawl() {
  console.log('\n🔥 Testing Firecrawl API...');
  try {
    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: 'https://www.sef.pt/en/pages/homepage.aspx'
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Firecrawl Response:', {
        success: data.success,
        dataLength: data.data?.content?.length || 0
      });
      return data;
    } else {
      const error = await response.text();
      console.error('❌ Firecrawl Error:', response.status, error);
    }
  } catch (error) {
    console.error('❌ Firecrawl Network Error:', error.message);
  }
}

async function testCritique() {
  console.log('\n✓ Testing Critique Labs API...');
  
  // Note: Critique Labs API endpoint might be different
  // This is a placeholder - need to check their docs
  console.log('⚠️  Critique Labs endpoint needs verification from docs');
}

async function testAnthropic() {
  console.log('\n🤖 Testing Anthropic (Claude) API...');
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 100,
        messages: [{
          role: 'user',
          content: 'Say "API working!" if you can hear me.'
        }]
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Claude Response:', data.content?.[0]?.text);
      return data;
    } else {
      const error = await response.text();
      console.error('❌ Claude Error:', response.status, error);
    }
  } catch (error) {
    console.error('❌ Claude Network Error:', error.message);
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting API Tests...\n');
  console.log('API Keys Status:');
  console.log(`  Perplexity: ${PERPLEXITY_API_KEY ? '✅' : '❌'}`);
  console.log(`  LinkUp: ${LINKUP_API_KEY ? '✅' : '❌'}`);
  console.log(`  Tavily: ${TAVILY_API_KEY ? '✅' : '❌'}`);
  console.log(`  Critique: ${CRITIQUE_API_KEY ? '✅' : '❌'}`);
  console.log(`  Anthropic: ${ANTHROPIC_API_KEY ? '✅' : '❌'}`);
  
  await testPerplexity();
  await testLinkUp();
  await testTavily();
  await testFirecrawl();
  await testCritique();
  await testAnthropic();
  
  console.log('\n✅ Tests Complete!');
}

runTests().catch(console.error);