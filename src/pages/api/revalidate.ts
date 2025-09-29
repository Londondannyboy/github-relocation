import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const authHeader = request.headers.get('Authorization');
  const expectedToken = `Bearer ${import.meta.env.SANITY_WEBHOOK_SECRET || 'your-secret-key'}`;
  
  // Verify webhook secret
  if (authHeader !== expectedToken) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await request.json();
    const documentType = body?._type;
    const slug = body?.slug?.current;
    
    console.log(`🔄 Sanity webhook received: ${documentType} updated`);
    
    // Log the update for monitoring
    if (slug) {
      console.log(`📝 Content updated: /${documentType === 'post' || documentType === 'article' ? 'articles' : documentType}/${slug}`);
    }

    // For Vercel, we can trigger a redeployment using the deploy hook
    // This will rebuild the entire site with fresh Sanity content
    if (import.meta.env.VERCEL_DEPLOY_HOOK_URL) {
      const deployResponse = await fetch(import.meta.env.VERCEL_DEPLOY_HOOK_URL, {
        method: 'POST',
      });
      
      if (deployResponse.ok) {
        console.log('✅ Vercel redeployment triggered successfully');
      } else {
        console.error('❌ Failed to trigger Vercel redeployment');
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Content update processed',
      documentType,
      slug 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Webhook processing failed:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Webhook processing failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};