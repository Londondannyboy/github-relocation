import { createClient } from '@sanity/client';
import Replicate from 'replicate';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize clients
const sanityClient = createClient({
  projectId: '93ewsltm',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN
});

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function generateArticle() {
  console.log('🚀 Starting article generation for Portugal D7 Visa...');

  // 1. Generate content with GPT-4
  console.log('📝 Generating content with GPT-4...');
  const contentPrompt = `Write a comprehensive 2000+ word guide about the Portugal D7 Passive Income Visa for 2025. 

Write in British English. Include:

1. Introduction to the D7 Visa programme
2. Eligibility requirements and income thresholds (€760/month minimum)
3. Application process step-by-step
4. Required documents checklist
5. Processing times and costs
6. Path to permanent residence and citizenship
7. Tax implications under NHR regime
8. Best cities for D7 visa holders
9. Healthcare and education benefits
10. Common mistakes to avoid
11. FAQs section

Include specific facts, figures, and recent policy updates. Add internal links opportunities and mark 3-4 places for external source links with [SOURCE NEEDED].

Format with proper HTML-like headings (h2, h3) and include a compelling introduction and conclusion.`;

  const contentResponse = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: contentPrompt }],
    temperature: 0.7
  });

  const articleContent = contentResponse.choices[0].message.content;

  // 2. Generate hero image with Flux Pro
  console.log('🎨 Generating hero image with Flux Pro...');
  const imagePrompt = "Stunning aerial view of Lisbon Portugal at golden hour, showing the historic Alfama district with terracotta rooftops, the Tagus River, and the 25 de Abril Bridge in the background, warm Mediterranean lighting, photorealistic, high resolution";

  const imageOutput = await replicate.run(
    "black-forest-labs/flux-1.1-pro",
    {
      input: {
        prompt: imagePrompt,
        aspect_ratio: "16:9",
        output_format: "webp",
        output_quality: 90
      }
    }
  );

  const imageUrl = Array.isArray(imageOutput) ? imageOutput[0] : imageOutput;
  console.log('✅ Image generated:', imageUrl);

  // 3. Convert content to Portable Text blocks
  console.log('📦 Converting to Portable Text...');
  const blocks = [];
  const paragraphs = articleContent.split('\n\n');

  for (const para of paragraphs) {
    if (para.startsWith('## ')) {
      blocks.push({
        _type: 'block',
        style: 'h2',
        children: [{
          _type: 'span',
          text: para.replace('## ', '')
        }]
      });
    } else if (para.startsWith('### ')) {
      blocks.push({
        _type: 'block',
        style: 'h3',
        children: [{
          _type: 'span',
          text: para.replace('### ', '')
        }]
      });
    } else if (para.trim()) {
      // Handle links
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      const children = [];
      let lastIndex = 0;
      let match;

      while ((match = linkRegex.exec(para)) !== null) {
        // Add text before link
        if (match.index > lastIndex) {
          children.push({
            _type: 'span',
            text: para.substring(lastIndex, match.index)
          });
        }

        // Add link
        const linkKey = `link-${Date.now()}-${Math.random()}`;
        children.push({
          _type: 'span',
          text: match[1],
          marks: [linkKey]
        });

        lastIndex = match.index + match[0].length;
      }

      // Add remaining text
      if (lastIndex < para.length) {
        children.push({
          _type: 'span',
          text: para.substring(lastIndex)
        });
      }

      blocks.push({
        _type: 'block',
        style: 'normal',
        children: children.length > 0 ? children : [{
          _type: 'span',
          text: para
        }]
      });
    }
  }

  // 4. Fetch categories
  console.log('📂 Fetching categories...');
  const categories = await sanityClient.fetch(`
    *[_type == "category" && title in ["Visa Requirements", "Tax Strategies"]] {
      _id
    }
  `);

  // 5. Create Sanity document
  console.log('💾 Creating Sanity document...');
  const doc = {
    _type: 'post',
    title: 'Portugal D7 Visa Guide 2025: Complete Passive Income Requirements',
    slug: {
      current: 'portugal-d7-visa-passive-income-guide-2025'
    },
    excerpt: 'Complete guide to Portugal\'s D7 Passive Income Visa including €760/month requirements, NHR tax benefits, and path to EU citizenship in 5 years.',
    body: blocks,
    featuredImage: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: await uploadImageToSanity(imageUrl, sanityClient)
      },
      alt: 'Aerial view of Lisbon Portugal showing historic district and river',
      credit: 'Generated by Flux Pro'
    },
    categories: categories.map(cat => ({
      _type: 'reference',
      _ref: cat._id
    })),
    tags: [],
    metaTitle: 'Portugal D7 Visa 2025: €760/Month Passive Income Requirements',
    metaDescription: 'Complete Portugal D7 visa guide: income requirements, NHR tax benefits, application process, and path to EU citizenship. Updated for 2025.',
    focusKeyword: 'portugal d7 visa',
    searchVolume: 1900,
    cpc: 3.45,
    contentTier: 'tier1',
    generationCost: 0.008,
    publishedAt: new Date().toISOString(),
    featured: true
  };

  const result = await sanityClient.create(doc);
  console.log('✅ Article created successfully!');
  console.log('🔗 Sanity ID:', result._id);
  console.log('🔗 URL: /posts/', doc.slug.current);
  
  // Cost tracking
  console.log('\n💰 Generation Cost Breakdown:');
  console.log('- Flux Pro Image: $0.003');
  console.log('- GPT-4 Content: ~$0.005');
  console.log('- Total: $0.008');
  
  return result;
}

async function uploadImageToSanity(imageUrl, client) {
  console.log('📤 Uploading image to Sanity...');
  
  // Fetch image
  const response = await fetch(imageUrl);
  const buffer = await response.arrayBuffer();
  
  // Upload to Sanity
  const asset = await client.assets.upload('image', Buffer.from(buffer), {
    filename: 'portugal-d7-visa-hero.webp'
  });
  
  return asset._id;
}

// Run the script
generateArticle()
  .then(() => {
    console.log('\n✅ Article generation complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });