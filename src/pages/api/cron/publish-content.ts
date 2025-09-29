import type { APIRoute } from 'astro';
import { createClient } from '@sanity/client';

const sanityClient = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID || 'bc08ijz6',
  dataset: process.env.PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.PUBLIC_SANITY_API_VERSION || '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

export const GET: APIRoute = async ({ request }) => {
  // Verify this is a Vercel Cron request
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // Query for unpublished documents (both drafts and regular documents)
    const unpublished = await sanityClient.fetch(
      `*[_type == "post" && !defined(publishedAt)][0...3]{
        _id,
        title,
        slug,
        body,
        "isDraft": _id match "drafts.*"
      }`
    );

    const results = {
      processed: 0,
      published: [],
      errors: []
    };

    // Process each unpublished document
    for (const document of unpublished) {
      try {
        let targetId;
        
        if (document.isDraft) {
          // For draft documents, remove drafts. prefix from ID
          targetId = document._id.replace('drafts.', '');
        } else {
          // For regular documents, use the ID as-is
          targetId = document._id;
        }
        
        // Publish the document
        await sanityClient
          .patch(targetId)
          .set({ 
            publishedAt: new Date().toISOString(),
            published: true 
          })
          .commit();

        results.published.push({
          id: targetId,
          title: document.title,
          slug: document.slug?.current,
          wasDraft: document.isDraft
        });
        results.processed++;
      } catch (error) {
        results.errors.push({
          id: document._id,
          title: document.title,
          error: error.message
        });
      }
    }

    // Log results for monitoring
    console.log('Cron Job: publish-content', results);

    return new Response(JSON.stringify({
      success: true,
      timestamp: new Date().toISOString(),
      results
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Cron job failed:', error);
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

// Also support POST for manual triggering
export const POST = GET;