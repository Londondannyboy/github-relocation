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
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // Get weekly statistics
    const [totalArticles, weeklyArticles, unpublishedDrafts, categoriesUsed] = await Promise.all([
      // Total published articles
      sanityClient.fetch(`count(*[_type == "post" && defined(publishedAt)])`),
      
      // Articles published this week
      sanityClient.fetch(
        `count(*[_type == "post" && publishedAt >= $weekStart])`,
        { weekStart: oneWeekAgo.toISOString() }
      ),
      
      // Unpublished drafts count
      sanityClient.fetch(`count(*[_type == "post" && !defined(publishedAt)])`),
      
      // Categories with article counts
      sanityClient.fetch(`
        *[_type == "category"]{
          title,
          "articleCount": count(*[_type == "post" && references(^._id)])
        } | order(articleCount desc)[0...5]
      `)
    ]);

    // Get top performing articles (mock engagement data)
    const topArticles = await sanityClient.fetch(`
      *[_type == "post" && defined(publishedAt)] | order(publishedAt desc)[0...10]{
        _id,
        title,
        slug,
        publishedAt,
        "categoryCount": count(categories),
        "hasImage": defined(mainImage)
      }
    `);

    // Content health check
    const contentHealth = {
      missingImages: await sanityClient.fetch(
        `count(*[_type == "post" && defined(publishedAt) && !defined(mainImage)])`
      ),
      missingCategories: await sanityClient.fetch(
        `count(*[_type == "post" && defined(publishedAt) && count(categories) == 0])`
      ),
      shortContent: await sanityClient.fetch(
        `count(*[_type == "post" && defined(publishedAt) && length(body[].children[].text) < 500])`
      )
    };

    const report = {
      timestamp: new Date().toISOString(),
      period: {
        start: oneWeekAgo.toISOString(),
        end: new Date().toISOString()
      },
      statistics: {
        totalArticles,
        weeklyArticles,
        unpublishedDrafts,
        publishRate: weeklyArticles > 0 ? ((weeklyArticles / 7) * 100).toFixed(1) + '% daily' : '0%'
      },
      topCategories: categoriesUsed,
      recentArticles: topArticles.slice(0, 5),
      contentHealth,
      recommendations: []
    };

    // Add recommendations based on data
    if (unpublishedDrafts > 5) {
      report.recommendations.push({
        priority: 'high',
        action: 'Review and publish pending drafts',
        count: unpublishedDrafts
      });
    }

    if (contentHealth.missingImages > 10) {
      report.recommendations.push({
        priority: 'medium',
        action: 'Add hero images to articles',
        count: contentHealth.missingImages
      });
    }

    if (weeklyArticles < 14) {
      report.recommendations.push({
        priority: 'low',
        action: 'Increase content production rate',
        target: '2-3 articles per day'
      });
    }

    console.log('Weekly review report:', report);

    // Optionally send to monitoring service or email
    // await sendWeeklyReport(report);

    return new Response(JSON.stringify({
      success: true,
      report
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Weekly review cron failed:', error);
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