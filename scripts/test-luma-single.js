#!/usr/bin/env node

/**
 * Test Luma API with a single video generation
 */

import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const LUMA_API_KEY = process.env.LUMA_API_KEY;

async function testLumaAPI() {
  console.log('🚀 Testing Luma Dream Machine API\n');
  console.log('=' .repeat(50));
  
  if (!LUMA_API_KEY) {
    console.error('❌ LUMA_API_KEY not found in environment');
    return;
  }
  
  console.log('✅ API Key found:', LUMA_API_KEY.substring(0, 20) + '...');
  
  // Simple test prompt
  const testPrompt = "Cinematic aerial view of Dubai Marina at sunset, elegant golden particles flow between the skyscrapers like a river of light, luxury real estate cinematography, warm desert light, professional color grading, 4K quality";
  
  console.log('\n📝 Test Prompt:', testPrompt);
  console.log('\n🎬 Submitting generation request...\n');
  
  try {
    // Submit generation request
    const response = await fetch('https://api.lumalabs.ai/dream-machine/v1/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LUMA_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: testPrompt,
        aspect_ratio: '16:9',
        loop: false
      })
    });
    
    console.log('Response Status:', response.status);
    
    const responseText = await response.text();
    console.log('Response Body:', responseText);
    
    if (!response.ok) {
      console.error('❌ API Error:', responseText);
      return;
    }
    
    const result = JSON.parse(responseText);
    console.log('\n✅ Generation started!');
    console.log('Generation ID:', result.id);
    console.log('State:', result.state);
    
    // Poll for completion
    console.log('\n⏳ Polling for completion...\n');
    
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      
      const statusResponse = await fetch(`https://api.lumalabs.ai/dream-machine/v1/generations/${result.id}`, {
        headers: {
          'Authorization': `Bearer ${LUMA_API_KEY}`
        }
      });
      
      if (!statusResponse.ok) {
        console.error('❌ Failed to check status');
        break;
      }
      
      const generation = await statusResponse.json();
      console.log(`Attempt ${attempts + 1}: State = ${generation.state}`);
      
      if (generation.state === 'completed') {
        console.log('\n' + '=' .repeat(50));
        console.log('🎉 Video generation complete!');
        console.log('Video URL:', generation.assets?.video || generation.video?.url || 'URL not found');
        console.log('=' .repeat(50));
        break;
      } else if (generation.state === 'failed') {
        console.error('❌ Generation failed:', generation.failure_reason);
        break;
      }
      
      attempts++;
    }
    
    if (attempts >= maxAttempts) {
      console.error('⏱ Generation timed out');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  }
}

testLumaAPI();