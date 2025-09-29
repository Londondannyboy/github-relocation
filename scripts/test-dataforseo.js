#!/usr/bin/env node

/**
 * Test DataForSEO API connection and keyword metrics
 */

import axios from 'axios';

// DataForSEO credentials
const DATAFORSEO_LOGIN = 'dan@predeploy.ai';
const DATAFORSEO_PASSWORD = '9090d2e4183d704a';
const DATAFORSEO_BASE64 = 'ZGFuQHByZWRlcGxveS5haTo5MDkwZDJlNDE4M2Q3MDRh';

async function testDataForSEO() {
  console.log('🔍 Testing DataForSEO API connection...\n');
  
  try {
    // Test with a simple keyword
    const testKeyword = 'Cyprus golden visa';
    
    // Using Keywords Data API endpoint
    const response = await axios({
      method: 'post',
      url: 'https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live',
      headers: {
        'Authorization': `Basic ${DATAFORSEO_BASE64}`,
        'Content-Type': 'application/json'
      },
      data: [{
        keywords: [testKeyword],
        location_name: "United States",
        language_name: "English"
      }]
    });
    
    console.log('✅ API Connection successful!\n');
    console.log('📊 Test Results for:', testKeyword);
    
    if (response.data && response.data.tasks && response.data.tasks[0]) {
      const task = response.data.tasks[0];
      if (task.result && task.result[0]) {
        const result = task.result[0];
        console.log('- Search Volume:', result.search_volume || 'N/A');
        console.log('- Competition:', result.competition || 'N/A');
        console.log('- CPC:', result.cpc ? `$${result.cpc}` : 'N/A');
        console.log('- Status:', task.status_message || 'Success');
      }
    }
    
    // Check account balance
    const balanceResponse = await axios({
      method: 'get',
      url: 'https://api.dataforseo.com/v3/appendix/user_data',
      headers: {
        'Authorization': `Basic ${DATAFORSEO_BASE64}`
      }
    });
    
    if (balanceResponse.data && balanceResponse.data.tasks && balanceResponse.data.tasks[0]) {
      const userData = balanceResponse.data.tasks[0].result[0];
      if (userData && userData.money) {
        console.log('\n💰 Account Balance:', `$${userData.money.balance || 0}`);
        console.log('📈 Total API calls:', userData.money.spent || 0);
      }
    }
    
  } catch (error) {
    console.error('❌ Error testing DataForSEO:', error.response?.data || error.message);
  }
}

// Run the test
testDataForSEO();