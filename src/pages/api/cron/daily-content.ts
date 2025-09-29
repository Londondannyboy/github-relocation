import type { APIRoute } from 'astro';
import { createClient } from '@sanity/client';

const sanityClient = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID || 'bc08ijz6',
  dataset: process.env.PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.PUBLIC_SANITY_API_VERSION || '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// Content templates for different countries
const contentTemplates = [
  { country: 'cyprus', topic: 'tax-optimization', priority: 'high' },
  { country: 'dubai', topic: 'golden-visa', priority: 'high' },
  { country: 'portugal', topic: 'd7-visa', priority: 'medium' },
  { country: 'malta', topic: 'citizenship', priority: 'medium' },
  { country: 'singapore', topic: 'business-setup', priority: 'low' },
];

function generateArticleContent(country: string, topic: string) {
  const title = `${country.charAt(0).toUpperCase() + country.slice(1)} ${topic.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Guide ${new Date().getFullYear()}`;
  
  const intro = `Discover everything you need to know about ${topic.replace('-', ' ')} in ${country.charAt(0).toUpperCase() + country.slice(1)}. Our comprehensive guide covers requirements, benefits, and step-by-step processes.`;
  
  const slug = `${country}-${topic}-guide-${Date.now()}`;
  
  return {
    title,
    slug: { current: slug },
    excerpt: intro,
    body: [
      {
        _type: 'block',
        _key: `block-${Date.now()}-1`,
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: `span-${Date.now()}-1`,
            text: intro,
            marks: []
          }
        ],
        markDefs: []
      }
    ],
    publishedAt: new Date().toISOString(),
    _createdAt: new Date().toISOString(),
    _updatedAt: new Date().toISOString(),
    author: {
      _type: 'reference',
      _ref: 'relocation-team'
    },
    categories: [],
    tags: [country, topic],
    published: true, // Mark as published directly
  };
}

export const GET: APIRoute = async ({ request }) => {
  // Verify this is a Vercel Cron request
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const results = {
      created: [],
      errors: [],
      timestamp: new Date().toISOString()
    };

    // Select 2-3 articles to create (rate limit safe)
    const todaysTemplates = contentTemplates
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);

    for (const template of todaysTemplates) {
      try {
        const articleContent = generateArticleContent(template.country, template.topic);
        
        // Check if article with similar slug exists
        const existing = await sanityClient.fetch(
          `*[_type == "post" && slug.current match "${template.country}-${template.topic}*"][0]{_id}`
        );
        
        if (!existing) {
          // Create the article directly as published (not draft)
          const result = await sanityClient.create({
            _type: 'post',
            ...articleContent
          });
          
          // Ensure it's published by patching if needed
          await sanityClient
            .patch(result._id)
            .set({ 
              publishedAt: new Date().toISOString(),
              published: true 
            })
            .commit();
          
          results.created.push({
            id: result._id,
            title: articleContent.title,
            slug: articleContent.slug.current,
            published: true
          });
        }
      } catch (error) {
        results.errors.push({
          template,
          error: error.message
        });
      }
    }

    console.log('Daily content cron job:', results);

    return new Response(JSON.stringify({
      success: true,
      results
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Daily content cron failed:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

export const POST = GET;