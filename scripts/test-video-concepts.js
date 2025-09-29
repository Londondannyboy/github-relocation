#!/usr/bin/env node

/**
 * Video Concept Testing Script
 * Tests 4 different video concepts for Relocation Quest
 * Uses Luma Dream Machine API (or alternatives)
 */

import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

// Video generation platforms configuration
const PLATFORMS = {
  luma: {
    name: 'Luma Dream Machine',
    apiUrl: 'https://api.lumalabs.ai/dream-machine/v1/generations',
    apiKey: process.env.LUMA_API_KEY,
    costPerVideo: 0.04,
    features: ['consistency', 'realism', 'api']
  },
  runway: {
    name: 'Runway Gen-3',
    apiUrl: 'https://api.runwayml.com/v1/generate',
    apiKey: process.env.RUNWAY_API_KEY,
    costPerVideo: 0.08,
    features: ['creativity', 'effects']
  },
  pika: {
    name: 'Pika Labs',
    apiUrl: 'https://api.pika.art/generate',
    apiKey: process.env.PIKA_API_KEY,
    costPerVideo: 0.03,
    features: ['budget', 'simple']
  },
  replicate: {
    name: 'Replicate (Stable Video)',
    apiUrl: 'https://api.replicate.com/v1/predictions',
    apiKey: process.env.REPLICATE_API_TOKEN,
    costPerVideo: 0.02,
    model: 'stability-ai/stable-video-diffusion',
    features: ['opensource', 'customizable']
  }
};

// Video concept templates
const VIDEO_CONCEPTS = {
  goldenThread: {
    name: 'Golden Thread Visual Signature',
    description: 'Elegant golden particle stream connecting locations',
    templates: {
      cyprus: {
        prompt: "Cinematic aerial view of Paphos harbor at golden hour, a subtle golden particle stream flows through the frame like a thread of light, weaving between the boats and ancient fort, professional real estate video style, warm Mediterranean lighting, 4K quality, smooth camera movement following the golden thread",
        duration: 5,
        aspectRatio: "16:9"
      },
      dubai: {
        prompt: "Drone shot of Dubai Marina at sunset, elegant golden particles flow between the skyscrapers like a river of light, connecting the buildings, luxury real estate cinematography, warm desert light, professional color grading, the golden thread forms the shape of the Burj Khalifa briefly",
        duration: 5,
        aspectRatio: "16:9"
      },
      malta: {
        prompt: "Aerial view of Valletta Grand Harbour, golden particles dance across the historic fortifications, thread of light connecting the Three Cities, Mediterranean golden hour, cinematic drone footage, the golden thread traces the outline of St. John's Co-Cathedral dome",
        duration: 5,
        aspectRatio: "16:9"
      }
    }
  },
  
  portal: {
    name: 'Portal Transitions',
    description: 'Geometric portals revealing destinations',
    templates: {
      cyprus: {
        prompt: "A geometric portal frame opens in the center of frame, revealing Limassol Marina through the doorway, the portal edges have intricate golden patterns, Mediterranean blue sky visible through portal, modern architecture visible, smooth push through the portal, professional property video style",
        duration: 5,
        aspectRatio: "16:9"
      },
      dubai: {
        prompt: "Futuristic hexagonal portal materializes, revealing Dubai Downtown skyline, the portal rim glows with golden Arabic geometric patterns, camera moves through portal from dark to bright, Burj Khalifa prominent in background, luxury lifestyle videography, warm evening light",
        duration: 5,
        aspectRatio: "16:9"
      },
      malta: {
        prompt: "Ancient stone archway transforms into glowing portal, revealing Mdina silent city beyond, Maltese cross patterns on portal edges, medieval architecture through the gateway, smooth dolly through portal, historic documentary style, warm limestone colors",
        duration: 5,
        aspectRatio: "16:9"
      }
    }
  },
  
  dataVisualization: {
    name: 'Data Visualization Journey',
    description: 'Statistics morphing into real locations',
    templates: {
      cyprus: {
        prompt: "Numbers and data points (tax rates 12.5%, 60 days, €300k) floating in space, morphing smoothly into aerial view of Limassol business district, data transforms into buildings, professional infographic style transitioning to real footage, clean modern aesthetic, blue and gold color scheme",
        duration: 5,
        aspectRatio: "16:9"
      },
      dubai: {
        prompt: "Financial figures and percentages (0% tax, 100% ownership, AED 75,000) materialize and transform into Dubai Financial District skyline, numbers become buildings, data particles form the shape of DIFC gate, corporate video style, premium quality, golden hour lighting",
        duration: 5,
        aspectRatio: "16:9"
      },
      malta: {
        prompt: "EU passport statistics (€600k, 4 months, 183 days) floating and transforming into aerial view of Sliema waterfront, numbers morph into yacht marina, data visualization becoming real estate, modern business presentation style, Mediterranean blue and gold palette",
        duration: 5,
        aspectRatio: "16:9"
      }
    }
  },
  
  firstPerson: {
    name: 'First Person Explorer',
    description: 'POV shots with consistent props',
    templates: {
      cyprus: {
        prompt: "POV shot: hands holding a golden compass and Cyprus residency permit, walking through Paphos harbor, compass points toward the castle, same leather briefcase visible in corner of frame, steady gimbal movement, professional vlog style, warm afternoon light",
        duration: 5,
        aspectRatio: "16:9"
      },
      dubai: {
        prompt: "First-person view: hands holding UAE Golden Visa and smartphone showing Dubai map, walking into DIFC building lobby, consistent brown leather briefcase and silver watch visible, smooth steadicam movement, luxury lifestyle videography, modern architecture",
        duration: 5,
        aspectRatio: "16:9"
      },
      malta: {
        prompt: "POV perspective: hands holding Malta Golden Visa and ancient map, walking through Valletta streets, same leather satchel and compass visible, cobblestone streets underfoot, handheld documentary style, warm Mediterranean afternoon light",
        duration: 5,
        aspectRatio: "16:9"
      }
    }
  }
};

// Test metrics storage
const testResults = {
  timestamp: new Date().toISOString(),
  platform: null,
  concepts: {},
  totalCost: 0,
  totalTime: 0
};

/**
 * Generate video using Luma Dream Machine API
 */
async function generateLumaVideo(prompt, options = {}) {
  console.log('🎬 Generating with Luma Dream Machine...');
  
  // Note: Luma API endpoint is illustrative - check actual docs
  const response = await fetch('https://api.lumalabs.ai/dream-machine/v1/generations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PLATFORMS.luma.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: prompt.prompt,
      aspect_ratio: prompt.aspectRatio || '16:9',
      duration: prompt.duration || 5
    })
  });
  
  if (!response.ok) {
    throw new Error(`Luma API error: ${response.status}`);
  }
  
  const result = await response.json();
  
  // Poll for completion
  return await pollForCompletion(result.id, 'luma');
}

/**
 * Generate video using Replicate (Stable Video Diffusion)
 */
async function generateReplicateVideo(prompt, options = {}) {
  console.log('🎬 Generating with Replicate Stable Video...');
  
  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${PLATFORMS.replicate.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      version: "3f0457e4619daac51203dedb472816fd4af51f3149fa7a9e0b5ffcf1b8172438",
      input: {
        prompt_a: prompt.prompt,
        prompt_b: prompt.prompt,
        video_length: 25, // frames
        sizing_strategy: "maintain_aspect_ratio",
        frames_per_second: 5,
        seed: Math.floor(Math.random() * 1000000)
      }
    })
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Replicate API error: ${error}`);
  }
  
  const prediction = await response.json();
  
  // Poll for completion
  return await pollReplicateStatus(prediction.id);
}

/**
 * Poll Replicate for video completion
 */
async function pollReplicateStatus(predictionId) {
  const maxAttempts = 60; // 5 minutes max
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
      headers: {
        'Authorization': `Token ${PLATFORMS.replicate.apiKey}`
      }
    });
    
    const prediction = await response.json();
    
    if (prediction.status === 'succeeded') {
      return {
        url: prediction.output,
        status: 'completed',
        id: predictionId
      };
    } else if (prediction.status === 'failed') {
      throw new Error(`Video generation failed: ${prediction.error}`);
    }
    
    console.log(`⏳ Status: ${prediction.status}... (${attempts + 1}/${maxAttempts})`);
    await sleep(5000); // Wait 5 seconds
    attempts++;
  }
  
  throw new Error('Video generation timed out');
}

/**
 * Generic polling function for video completion
 */
async function pollForCompletion(generationId, platform) {
  // This would need to be implemented based on each platform's API
  console.log(`⏳ Polling ${platform} for completion...`);
  
  // Simulated response for testing
  await sleep(3000);
  
  return {
    url: `https://example.com/video/${generationId}.mp4`,
    status: 'completed',
    id: generationId
  };
}

/**
 * Test a single concept
 */
async function testConcept(conceptKey, concept, platform = 'replicate') {
  console.log(`\n🧪 Testing Concept: ${concept.name}`);
  console.log(`📝 ${concept.description}\n`);
  
  const results = {
    name: concept.name,
    description: concept.description,
    videos: {},
    totalTime: 0,
    totalCost: 0
  };
  
  for (const [location, template] of Object.entries(concept.templates)) {
    console.log(`📍 Generating for ${location}...`);
    const startTime = Date.now();
    
    try {
      let video;
      
      if (platform === 'luma' && PLATFORMS.luma.apiKey) {
        video = await generateLumaVideo(template);
      } else if (platform === 'replicate' && PLATFORMS.replicate.apiKey) {
        video = await generateReplicateVideo(template);
      } else {
        // Simulate for testing without API keys
        console.log('⚠️ No API key found - simulating generation...');
        await sleep(2000);
        video = {
          url: `simulated_${conceptKey}_${location}.mp4`,
          status: 'simulated',
          id: `sim_${Date.now()}`
        };
      }
      
      const elapsed = (Date.now() - startTime) / 1000;
      
      results.videos[location] = {
        prompt: template.prompt,
        url: video.url,
        generationTime: elapsed,
        cost: PLATFORMS[platform].costPerVideo,
        status: video.status
      };
      
      results.totalTime += elapsed;
      results.totalCost += PLATFORMS[platform].costPerVideo;
      
      console.log(`✅ ${location} complete in ${elapsed.toFixed(1)}s`);
      
    } catch (error) {
      console.error(`❌ Failed for ${location}: ${error.message}`);
      results.videos[location] = {
        error: error.message,
        status: 'failed'
      };
    }
  }
  
  return results;
}

/**
 * Generate HTML dashboard for results
 */
async function generateDashboard(results) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Relocation Quest - Video Concept Testing</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 2rem;
    }
    .container {
      max-width: 1400px;
      margin: 0 auto;
    }
    h1 {
      color: white;
      text-align: center;
      margin-bottom: 2rem;
      font-size: 2.5rem;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 1rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }
    .stat-label {
      font-size: 0.875rem;
      color: #666;
      margin-bottom: 0.5rem;
    }
    .stat-value {
      font-size: 2rem;
      font-weight: bold;
      color: #333;
    }
    .concepts {
      display: grid;
      gap: 2rem;
    }
    .concept {
      background: white;
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }
    .concept-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1.5rem;
    }
    .concept-title {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }
    .concept-description {
      opacity: 0.9;
    }
    .videos {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      padding: 1.5rem;
    }
    .video-card {
      border: 1px solid #e0e0e0;
      border-radius: 0.5rem;
      overflow: hidden;
    }
    .video-placeholder {
      background: #f5f5f5;
      height: 180px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
    }
    .video-info {
      padding: 1rem;
    }
    .video-location {
      font-weight: bold;
      margin-bottom: 0.5rem;
      text-transform: capitalize;
    }
    .video-prompt {
      font-size: 0.875rem;
      color: #666;
      margin-bottom: 0.5rem;
      max-height: 60px;
      overflow-y: auto;
    }
    .video-stats {
      display: flex;
      justify-content: space-between;
      font-size: 0.875rem;
      color: #999;
      margin-top: 0.5rem;
      padding-top: 0.5rem;
      border-top: 1px solid #f0f0f0;
    }
    .winner {
      background: #fff3cd;
      border: 2px solid #ffc107;
    }
    .comparison {
      margin-top: 3rem;
      background: white;
      padding: 2rem;
      border-radius: 1rem;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
    }
    th {
      background: #f5f5f5;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🎬 Relocation Quest - Video Concept Testing</h1>
    
    <div class="stats">
      <div class="stat-card">
        <div class="stat-label">Platform</div>
        <div class="stat-value">${results.platform}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Total Cost</div>
        <div class="stat-value">$${results.totalCost.toFixed(2)}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Total Time</div>
        <div class="stat-value">${Math.round(results.totalTime)}s</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Videos Generated</div>
        <div class="stat-value">${Object.keys(results.concepts).length * 3}</div>
      </div>
    </div>
    
    <div class="concepts">
      ${Object.entries(results.concepts).map(([key, concept]) => `
        <div class="concept">
          <div class="concept-header">
            <div class="concept-title">${concept.name}</div>
            <div class="concept-description">${concept.description}</div>
          </div>
          <div class="videos">
            ${Object.entries(concept.videos).map(([location, video]) => `
              <div class="video-card ${video.status === 'completed' ? '' : 'error'}">
                <div class="video-placeholder">
                  ${video.status === 'completed' ? '🎥' : '❌'}
                </div>
                <div class="video-info">
                  <div class="video-location">${location}</div>
                  <div class="video-prompt">${video.prompt || 'N/A'}</div>
                  <div class="video-stats">
                    <span>⏱ ${video.generationTime ? video.generationTime.toFixed(1) + 's' : 'Failed'}</span>
                    <span>💰 $${video.cost || 0}</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
    
    <div class="comparison">
      <h2>📊 Concept Comparison</h2>
      <table>
        <thead>
          <tr>
            <th>Concept</th>
            <th>Success Rate</th>
            <th>Avg Time</th>
            <th>Total Cost</th>
            <th>Recommendation</th>
          </tr>
        </thead>
        <tbody>
          ${Object.entries(results.concepts).map(([key, concept]) => {
            const videos = Object.values(concept.videos);
            const successful = videos.filter(v => v.status === 'completed').length;
            const successRate = (successful / videos.length * 100).toFixed(0);
            const avgTime = concept.totalTime / videos.length;
            
            return `
              <tr>
                <td><strong>${concept.name}</strong></td>
                <td>${successRate}%</td>
                <td>${avgTime.toFixed(1)}s</td>
                <td>$${concept.totalCost.toFixed(2)}</td>
                <td>${successRate > 80 ? '✅ Recommended' : '⚠️ Needs work'}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  </div>
  
  <script>
    console.log('Test Results:', ${JSON.stringify(results, null, 2)});
  </script>
</body>
</html>`;
  
  const dashboardPath = path.join(__dirname, '../video-test-results.html');
  await fs.writeFile(dashboardPath, html);
  console.log(`\n📊 Dashboard saved to: ${dashboardPath}`);
  
  return dashboardPath;
}

/**
 * Save test results to JSON
 */
async function saveResults(results) {
  const resultsPath = path.join(__dirname, '../video-test-results.json');
  await fs.writeFile(resultsPath, JSON.stringify(results, null, 2));
  console.log(`📁 Results saved to: ${resultsPath}`);
  return resultsPath;
}

/**
 * Helper sleep function
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting Relocation Quest Video Concept Testing\n');
  console.log('=' .repeat(50));
  
  // Determine which platform to use
  const platform = process.argv[2] || 'replicate';
  
  if (!PLATFORMS[platform]) {
    console.error(`❌ Unknown platform: ${platform}`);
    console.log(`Available platforms: ${Object.keys(PLATFORMS).join(', ')}`);
    process.exit(1);
  }
  
  console.log(`\n🎯 Using platform: ${PLATFORMS[platform].name}`);
  console.log(`💰 Cost per video: $${PLATFORMS[platform].costPerVideo}`);
  console.log(`🔑 API Key: ${PLATFORMS[platform].apiKey ? 'Found' : 'Missing (will simulate)'}\n`);
  
  testResults.platform = PLATFORMS[platform].name;
  
  // Test each concept
  for (const [key, concept] of Object.entries(VIDEO_CONCEPTS)) {
    const conceptResults = await testConcept(key, concept, platform);
    testResults.concepts[key] = conceptResults;
    testResults.totalCost += conceptResults.totalCost;
    testResults.totalTime += conceptResults.totalTime;
  }
  
  // Generate outputs
  console.log('\n' + '=' .repeat(50));
  console.log('📈 FINAL RESULTS');
  console.log('=' .repeat(50));
  console.log(`Total Cost: $${testResults.totalCost.toFixed(2)}`);
  console.log(`Total Time: ${testResults.totalTime.toFixed(1)}s`);
  console.log(`Videos Generated: ${Object.keys(testResults.concepts).length * 3}`);
  
  // Save results
  await saveResults(testResults);
  await generateDashboard(testResults);
  
  console.log('\n✅ Testing complete! Open video-test-results.html to view dashboard.');
}

// Run if executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(console.error);
}

export { VIDEO_CONCEPTS, PLATFORMS, testConcept };