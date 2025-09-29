import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config({ path: '.env.local' });

const sanityClient = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false
});

async function generateQuickImage() {
  console.log('🎨 Generating Dubai skyline image with Flux Schnell...');
  
  try {
    // Using simpler Stable Diffusion for speed
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: 'ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4', // SDXL for speed
        input: {
          prompt: 'Dubai skyline at golden hour, Burj Khalifa, modern architecture, luxury cityscape, professional photography, ultra detailed',
          width: 1024,
          height: 576,
          scheduler: 'K_EULER',
          num_inference_steps: 25,
          guidance_scale: 7.5
        }
      })
    });
    
    const prediction = await response.json();
    console.log('⏳ Waiting for image generation...');
    
    // Poll for result
    let result = prediction;
    let attempts = 0;
    while (result.status !== 'succeeded' && result.status !== 'failed' && attempts < 30) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const statusRes = await fetch(
        `https://api.replicate.com/v1/predictions/${result.id}`,
        {
          headers: {
            'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`
          }
        }
      );
      result = await statusRes.json();
      attempts++;
    }
    
    if (result.status === 'succeeded' && result.output) {
      console.log('✅ Image generated successfully');
      return result.output[0];
    }
  } catch (error) {
    console.error('❌ Image generation failed:', error.message);
  }
  
  return null;
}

async function uploadImageToSanity(imageUrl) {
  console.log('📤 Uploading image to Sanity...');
  
  try {
    const imageResponse = await fetch(imageUrl);
    const buffer = await imageResponse.arrayBuffer();
    
    const asset = await sanityClient.assets.upload('image', Buffer.from(buffer), {
      filename: 'dubai-golden-visa-skyline.jpg'
    });
    
    console.log('✅ Image uploaded to Sanity');
    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id
      },
      alt: 'Dubai skyline with Burj Khalifa at golden hour'
    };
  } catch (error) {
    console.error('❌ Image upload failed:', error.message);
    return null;
  }
}

async function updateArticle(imageData) {
  console.log('📝 Updating Dubai article with image...');
  
  try {
    // Find the Dubai article
    const article = await sanityClient.fetch(
      `*[_type == "post" && slug.current == "dubai-golden-visa-ultimate-guide-2025"][0]`
    );
    
    if (!article) {
      console.error('❌ Article not found');
      return;
    }
    
    // Update with image
    const updated = await sanityClient
      .patch(article._id)
      .set({ mainImage: imageData })
      .commit();
    
    console.log('✅ Article updated with image');
    return updated;
  } catch (error) {
    console.error('❌ Article update failed:', error.message);
  }
}

async function main() {
  console.log('🔧 Fixing Dubai Golden Visa article image\n');
  
  // Generate image
  const imageUrl = await generateQuickImage();
  
  if (imageUrl) {
    // Upload to Sanity
    const imageData = await uploadImageToSanity(imageUrl);
    
    if (imageData) {
      // Update article
      await updateArticle(imageData);
      console.log('\n✅ SUCCESS! Dubai article now has hero image');
      console.log('🔗 View at: https://relocation.quest/articles/dubai-golden-visa-ultimate-guide-2025');
    }
  } else {
    console.log('⚠️ Proceeding without image - article already published');
  }
}

main();