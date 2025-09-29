#!/usr/bin/env node

/**
 * Enhanced Article Generation with Video Integration
 * Generates articles with optional video heroes using best-performing concept
 */

import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createClient } from '@sanity/client';
import { VIDEO_CONCEPTS, PLATFORMS } from './test-video-concepts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

// Sanity client setup
const sanityClient = createClient({
  projectId: '93ewsltm',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN_UNIVERSAL,
  useCdn: false
});

// Video generation settings
const VIDEO_CONFIG = {
  enabled: process.env.ENABLE_VIDEO_GENERATION === 'true',
  concept: process.env.VIDEO_CONCEPT || 'goldenThread', // winning concept from tests
  platform: process.env.VIDEO_PLATFORM || 'replicate',
  fallbackToImage: true,
  cacheVideos: true,
  maxRetries: 2
};

// Cache for generated videos
const videoCache = new Map();

/**
 * Generate video for article using winning concept
 */
async function generateArticleVideo(title, location, keywords) {
  if (!VIDEO_CONFIG.enabled) {
    console.log('📹 Video generation disabled, using static image');
    return null;
  }
  
  // Check cache first
  const cacheKey = `${location}_${VIDEO_CONFIG.concept}`;
  if (VIDEO_CONFIG.cacheVideos && videoCache.has(cacheKey)) {
    console.log('✅ Using cached video for', cacheKey);
    return videoCache.get(cacheKey);
  }
  
  try {
    console.log(`\n🎬 Generating video for: ${title}`);
    console.log(`📍 Location: ${location}`);
    console.log(`🎨 Concept: ${VIDEO_CONFIG.concept}`);
    
    // Get the appropriate prompt template
    const concept = VIDEO_CONCEPTS[VIDEO_CONFIG.concept];
    const locationKey = location.toLowerCase().replace(/\s+/g, '');
    const template = concept.templates[locationKey] || concept.templates.cyprus;
    
    // Customize prompt based on article keywords
    let customPrompt = template.prompt;
    if (keywords.includes('golden visa')) {
      customPrompt = customPrompt.replace('residency permit', 'Golden Visa');
    }
    if (keywords.includes('business')) {
      customPrompt = customPrompt.replace('professional', 'corporate business');
    }
    if (keywords.includes('investment')) {
      customPrompt = customPrompt.replace('real estate', 'investment property');
    }
    
    // Generate video based on platform
    let videoUrl;
    
    if (VIDEO_CONFIG.platform === 'replicate') {
      videoUrl = await generateReplicateVideo(customPrompt);
    } else if (VIDEO_CONFIG.platform === 'luma') {
      videoUrl = await generateLumaVideo(customPrompt);
    } else {
      console.log('⚠️ Unknown platform, simulating...');
      videoUrl = await simulateVideoGeneration(customPrompt);
    }
    
    // Cache the result
    if (VIDEO_CONFIG.cacheVideos && videoUrl) {
      videoCache.set(cacheKey, videoUrl);
    }
    
    return videoUrl;
    
  } catch (error) {
    console.error('❌ Video generation failed:', error.message);
    
    if (VIDEO_CONFIG.fallbackToImage) {
      console.log('↩️ Falling back to static image');
      return null;
    }
    throw error;
  }
}

/**
 * Generate video using Replicate
 */
async function generateReplicateVideo(prompt) {
  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      version: "3f0457e4619daac51203dedb472816fd4af51f3149fa7a9e0b5ffcf1b8172438",
      input: {
        prompt_a: prompt,
        prompt_b: prompt,
        video_length: 25,
        sizing_strategy: "maintain_aspect_ratio",
        frames_per_second: 5,
        seed: Math.floor(Math.random() * 1000000)
      }
    })
  });
  
  if (!response.ok) {
    throw new Error(`Replicate API error: ${response.status}`);
  }
  
  const prediction = await response.json();
  
  // Poll for completion
  return await pollForVideoCompletion(prediction.id);
}

/**
 * Generate video using Luma (when API available)
 */
async function generateLumaVideo(prompt) {
  // Note: Implement when Luma API docs are available
  console.log('🔜 Luma API integration coming soon');
  return await simulateVideoGeneration(prompt);
}

/**
 * Simulate video generation for testing
 */
async function simulateVideoGeneration(prompt) {
  console.log('🎬 Simulating video generation...');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return a placeholder video URL
  return `https://example.com/video_${Date.now()}.mp4`;
}

/**
 * Poll for video completion
 */
async function pollForVideoCompletion(predictionId, maxAttempts = 60) {
  for (let i = 0; i < maxAttempts; i++) {
    const response = await fetch(
      `https://api.replicate.com/v1/predictions/${predictionId}`,
      {
        headers: {
          'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`
        }
      }
    );
    
    const prediction = await response.json();
    
    if (prediction.status === 'succeeded') {
      return prediction.output;
    } else if (prediction.status === 'failed') {
      throw new Error(`Video generation failed: ${prediction.error}`);
    }
    
    console.log(`⏳ Video status: ${prediction.status}...`);
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  
  throw new Error('Video generation timed out');
}

/**
 * Upload video to Sanity
 */
async function uploadVideoToSanity(videoUrl, title) {
  try {
    // For now, we'll store the video URL as an external link
    // In production, you'd download and upload to Sanity's asset pipeline
    
    console.log('📤 Storing video reference in Sanity...');
    
    const videoAsset = {
      _type: 'video',
      title: title,
      url: videoUrl,
      platform: VIDEO_CONFIG.platform,
      concept: VIDEO_CONFIG.concept,
      generatedAt: new Date().toISOString()
    };
    
    return videoAsset;
    
  } catch (error) {
    console.error('Failed to upload video to Sanity:', error);
    return null;
  }
}

/**
 * Generate complete article with video
 */
async function generateArticleWithVideo(config) {
  const {
    title,
    slug,
    location,
    keywords,
    category,
    content
  } = config;
  
  console.log(`\n📝 Generating article: ${title}`);
  
  // Generate hero media (video or image)
  let heroMedia = {};
  
  if (VIDEO_CONFIG.enabled) {
    try {
      const videoUrl = await generateArticleVideo(title, location, keywords);
      
      if (videoUrl) {
        const videoAsset = await uploadVideoToSanity(videoUrl, title);
        heroMedia = {
          type: 'video',
          video: videoAsset,
          thumbnail: await generateThumbnail(title) // Still need a poster image
        };
        console.log('✅ Video hero created successfully');
      }
    } catch (error) {
      console.error('Video generation failed, using image:', error.message);
    }
  }
  
  // Fallback to image if no video
  if (!heroMedia.video) {
    heroMedia = {
      type: 'image',
      image: await generateHeroImage(title)
    };
    console.log('✅ Image hero created');
  }
  
  // Create the article document
  const article = {
    _type: 'post',
    title,
    slug: { current: slug },
    excerpt: content.excerpt,
    content: content.body,
    heroMedia,
    category: { _ref: category },
    keywords,
    publishedAt: new Date().toISOString(),
    seo: {
      metaTitle: title,
      metaDescription: content.excerpt,
      keywords: keywords.join(', ')
    },
    performance: {
      hasVideo: heroMedia.type === 'video',
      videoConcept: VIDEO_CONFIG.concept,
      generationCost: calculateCost(heroMedia.type)
    }
  };
  
  // Upload to Sanity
  const result = await sanityClient.create(article);
  console.log(`✅ Article published: ${result._id}`);
  
  return result;
}

/**
 * Generate hero image (existing functionality)
 */
async function generateHeroImage(title) {
  console.log('🎨 Generating hero image with Flux Pro...');
  
  const imagePrompt = `Professional photograph of ${title.toLowerCase()}, 
    luxury real estate photography, golden hour lighting, 
    high resolution, architectural photography`;
  
  // Use existing Replicate Flux Pro generation
  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      version: "black-forest-labs/flux-pro",
      input: {
        prompt: imagePrompt,
        aspect_ratio: "16:9",
        output_format: "webp",
        output_quality: 90
      }
    })
  });
  
  // Poll for completion and return URL
  // ... existing image generation code ...
  
  return "https://example.com/image.jpg"; // Placeholder
}

/**
 * Generate video thumbnail
 */
async function generateThumbnail(title) {
  // Generate a still image for video poster
  return await generateHeroImage(title);
}

/**
 * Calculate generation cost
 */
function calculateCost(mediaType) {
  if (mediaType === 'video') {
    return PLATFORMS[VIDEO_CONFIG.platform].costPerVideo;
  }
  return 0.003; // Flux Pro image cost
}

/**
 * Main execution for testing
 */
async function main() {
  console.log('🚀 Testing Article Generation with Video\n');
  console.log('=' .repeat(50));
  
  // Test article configuration
  const testArticle = {
    title: 'Cyprus Golden Visa 2025: Complete Investment Guide',
    slug: 'cyprus-golden-visa-2025-investment-guide',
    location: 'Cyprus',
    keywords: ['cyprus', 'golden visa', 'investment', 'EU residency'],
    category: 'golden-visa-category-id',
    content: {
      excerpt: 'Comprehensive guide to obtaining Cyprus Golden Visa through investment in 2025.',
      body: 'Full article content here...'
    }
  };
  
  // Check configuration
  console.log('📹 Video Generation:', VIDEO_CONFIG.enabled ? 'ENABLED' : 'DISABLED');
  console.log('🎨 Concept:', VIDEO_CONFIG.concept);
  console.log('🚀 Platform:', VIDEO_CONFIG.platform);
  console.log('💰 Estimated Cost:', calculateCost('video'));
  console.log('');
  
  // Generate the article
  const result = await generateArticleWithVideo(testArticle);
  
  console.log('\n' + '=' .repeat(50));
  console.log('✅ Article generation complete!');
  console.log(`📊 Media Type: ${result.heroMedia.type}`);
  console.log(`🔗 Article ID: ${result._id}`);
}

// Export for use in other scripts
export { 
  generateArticleWithVideo, 
  generateArticleVideo,
  VIDEO_CONFIG 
};

// Run if executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(console.error);
}