#!/usr/bin/env node

/**
 * Test one video concept with Luma
 */

import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const LUMA_API_KEY = process.env.LUMA_API_KEY;

// Test the Golden Thread concept for Cyprus
const GOLDEN_THREAD_CYPRUS = {
  concept: "Golden Thread",
  location: "Cyprus",
  prompt: "Cinematic aerial view of Paphos harbor at golden hour, a subtle golden particle stream flows through the frame like a thread of light, weaving between the boats and ancient fort, professional real estate video style, warm Mediterranean lighting, 4K quality, smooth camera movement following the golden thread"
};

// Test the Portal concept for Dubai  
const PORTAL_DUBAI = {
  concept: "Portal Transition",
  location: "Dubai",
  prompt: "Futuristic hexagonal portal materializes, revealing Dubai Downtown skyline, the portal rim glows with golden Arabic geometric patterns, camera moves through portal from dark to bright, Burj Khalifa prominent in background, luxury lifestyle videography, warm evening light"
};

// Test the Data Viz concept for Malta
const DATA_VIZ_MALTA = {
  concept: "Data Visualization",
  location: "Malta",
  prompt: "EU passport statistics (€600k, 4 months, 183 days) floating and transforming into aerial view of Sliema waterfront, numbers morph into yacht marina, data visualization becoming real estate, modern business presentation style, Mediterranean blue and gold palette"
};

// Test the First Person concept for Portugal
const FIRST_PERSON_LISBON = {
  concept: "First Person Explorer", 
  location: "Lisbon",
  prompt: "POV shot: hands holding Portuguese residence card and Tram 28 ticket, riding historic tram through Alfama district, holding tram rail, vintage leather bag and guidebook visible, cultural exploration vlog style, golden hour light"
};

async function generateLumaVideo(testCase) {
  console.log(`\n🎬 Generating ${testCase.concept} for ${testCase.location}`);
  console.log(`📝 Prompt: ${testCase.prompt.substring(0, 100)}...`);
  
  try {
    // Submit generation request
    const response = await fetch('https://api.lumalabs.ai/dream-machine/v1/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LUMA_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: testCase.prompt,
        aspect_ratio: '16:9',
        loop: false,
        model: 'ray-2'
      })
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${error}`);
    }
    
    const result = await response.json();
    console.log(`⏳ Generation ID: ${result.id}`);
    console.log(`⏳ State: ${result.state}`);
    
    // Poll for completion
    const startTime = Date.now();
    let attempts = 0;
    const maxAttempts = 60;
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const statusResponse = await fetch(`https://api.lumalabs.ai/dream-machine/v1/generations/${result.id}`, {
        headers: {
          'Authorization': `Bearer ${LUMA_API_KEY}`
        }
      });
      
      const generation = await statusResponse.json();
      
      if (generation.state === 'completed') {
        const duration = ((Date.now() - startTime) / 1000).toFixed(1);
        const videoUrl = generation.assets?.video;
        
        console.log(`✅ Complete in ${duration}s`);
        console.log(`🎥 Video URL: ${videoUrl}`);
        
        return {
          concept: testCase.concept,
          location: testCase.location,
          videoUrl,
          duration,
          cost: 0.04
        };
      } else if (generation.state === 'failed') {
        throw new Error(`Generation failed: ${generation.failure_reason}`);
      }
      
      if (attempts % 3 === 0) {
        console.log(`⏳ Status: ${generation.state}... (${attempts}/60)`);
      }
      
      attempts++;
    }
    
    throw new Error('Generation timed out');
    
  } catch (error) {
    console.error(`❌ Failed: ${error.message}`);
    return {
      concept: testCase.concept,
      location: testCase.location,
      error: error.message
    };
  }
}

async function main() {
  console.log('🚀 Testing Video Concepts with Luma Dream Machine');
  console.log('=' .repeat(50));
  
  // Choose which concept to test
  const testCase = process.argv[2] || 'golden';
  
  let selectedTest;
  switch(testCase) {
    case 'portal':
      selectedTest = PORTAL_DUBAI;
      break;
    case 'data':
      selectedTest = DATA_VIZ_MALTA;
      break;
    case 'first':
      selectedTest = FIRST_PERSON_LISBON;
      break;
    default:
      selectedTest = GOLDEN_THREAD_CYPRUS;
  }
  
  const result = await generateLumaVideo(selectedTest);
  
  // Save result
  const resultsFile = path.join(__dirname, '../luma-test-results.json');
  const existingResults = await fs.readFile(resultsFile, 'utf-8').catch(() => '[]');
  const results = JSON.parse(existingResults || '[]');
  results.push({
    ...result,
    timestamp: new Date().toISOString()
  });
  await fs.writeFile(resultsFile, JSON.stringify(results, null, 2));
  
  console.log('\n' + '=' .repeat(50));
  console.log('📊 Test Complete!');
  console.log(`Concept: ${result.concept}`);
  console.log(`Location: ${result.location}`);
  if (result.videoUrl) {
    console.log(`Video: ${result.videoUrl}`);
    console.log(`Time: ${result.duration}s`);
    console.log(`Cost: $${result.cost}`);
  } else {
    console.log(`Error: ${result.error}`);
  }
  console.log('=' .repeat(50));
}

main().catch(console.error);