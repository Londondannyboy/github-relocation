import { createClient } from '@sanity/client';
import { promises as fs } from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID || '93ewsltm',
  dataset: process.env.PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.PUBLIC_SANITY_API_VERSION || '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false
});

async function publishArticle() {
  try {
    // Read the final article
    const articlePath = process.argv[2] || 'published/final-portugal-golden-visa-2025-2025-costs-process-timeline-1759227947250.json';
    const content = await fs.readFile(articlePath, 'utf-8');
    const article = JSON.parse(content);

    // Prepare for Sanity
    const sanityDoc = {
      _type: 'article',
      title: article.title,
      slug: article.slug,
      body: article.body,
      excerpt: article.excerpt,
      focusKeyword: article.focusKeyword,
      seoTitle: article.seoTitle,
      metaDescription: article.metaDescription,
      publishedAt: new Date().toISOString(),
      categories: article.categories || [],
      tags: article.tags || []
    };

    console.log('Publishing article:', sanityDoc.title);
    console.log('Categories:', sanityDoc.categories);
    
    const result = await client.create(sanityDoc);
    console.log('✅ Published successfully!');
    console.log('Document ID:', result._id);
    console.log('View at: https://relocation.quest/posts/' + article.slug.current);
    
  } catch (error) {
    console.error('❌ Error publishing:', error);
  }
}

publishArticle();