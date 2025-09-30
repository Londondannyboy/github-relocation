import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'postTracking',
  title: 'Post Generation Tracking',
  type: 'document',
  fields: [
    // Reference to the post
    defineField({
      name: 'postRef',
      title: 'Related Post',
      type: 'reference',
      to: [{type: 'post'}],
      validation: Rule => Rule.required(),
      description: 'The post this tracking data belongs to'
    }),
    
    // Keyword cluster information
    defineField({
      name: 'keyword',
      title: 'Primary Keyword',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'keywordCluster',
      title: 'Keyword Cluster',
      type: 'array',
      of: [{type: 'string'}],
      description: 'All keywords covered by this article'
    }),
    defineField({
      name: 'clusterVolume',
      title: 'Total Cluster Search Volume',
      type: 'number',
      description: 'Combined monthly search volume for entire cluster'
    }),
    defineField({
      name: 'tier',
      title: 'Value Tier',
      type: 'string',
      options: {
        list: [
          {title: 'HIGH VALUE (2000+ volume, $5+ CPC)', value: 'HIGH'},
          {title: 'MEDIUM VALUE (1000+ volume)', value: 'MEDIUM'},
          {title: 'LOW VALUE (< 1000 volume)', value: 'LOW'}
        ]
      }
    }),
    
    // Tools used and their contributions
    defineField({
      name: 'toolsUsed',
      title: 'API Tools Used',
      type: 'object',
      fields: [
        // Perplexity
        {
          name: 'perplexity',
          type: 'object',
          fields: [
            {name: 'called', type: 'boolean'},
            {name: 'expandedQueries', type: 'number'},
            {name: 'cost', type: 'number'},
            {name: 'value', type: 'text'}
          ]
        },
        // LinkUp
        {
          name: 'linkup',
          type: 'object',
          fields: [
            {name: 'called', type: 'boolean'},
            {name: 'sources', type: 'number'},
            {name: 'citations', type: 'number'},
            {name: 'cost', type: 'number'},
            {name: 'value', type: 'text'}
          ]
        },
        // Tavily
        {
          name: 'tavily',
          type: 'object',
          fields: [
            {name: 'called', type: 'boolean'},
            {name: 'relevanceScore', type: 'number'},
            {name: 'cost', type: 'number'},
            {name: 'value', type: 'text'}
          ]
        },
        // Critique Labs
        {
          name: 'critique',
          type: 'object',
          fields: [
            {name: 'called', type: 'boolean'},
            {name: 'trustedSources', type: 'array', of: [{type: 'string'}]},
            {name: 'cost', type: 'number'},
            {name: 'value', type: 'text'}
          ]
        },
        // Serper
        {
          name: 'serper',
          type: 'object',
          fields: [
            {name: 'called', type: 'boolean'},
            {name: 'featuredSnippet', type: 'boolean'},
            {name: 'peopleAlsoAsk', type: 'number'},
            {name: 'cost', type: 'number'},
            {name: 'value', type: 'text'}
          ]
        },
        // DataForSEO
        {
          name: 'dataforseo',
          type: 'object',
          fields: [
            {name: 'called', type: 'boolean'},
            {name: 'searchVolume', type: 'number'},
            {name: 'cpc', type: 'number'},
            {name: 'difficulty', type: 'number'},
            {name: 'cost', type: 'number'},
            {name: 'value', type: 'text'}
          ]
        },
        // Firecrawl
        {
          name: 'firecrawl',
          type: 'object',
          fields: [
            {name: 'called', type: 'boolean'},
            {name: 'sitesScraped', type: 'array', of: [{type: 'string'}]},
            {name: 'cacheHit', type: 'boolean'},
            {name: 'cost', type: 'number'},
            {name: 'value', type: 'text'}
          ]
        },
        // Claude/OpenAI
        {
          name: 'llm',
          type: 'object',
          fields: [
            {name: 'model', type: 'string'},
            {name: 'tokens', type: 'number'},
            {name: 'cost', type: 'number'},
            {name: 'value', type: 'text'}
          ]
        }
      ]
    }),
    
    // Overall metrics
    defineField({
      name: 'metrics',
      title: 'Generation Metrics',
      type: 'object',
      fields: [
        {name: 'totalCost', type: 'number', title: 'Total API Cost ($)'},
        {name: 'generationTime', type: 'number', title: 'Generation Time (seconds)'},
        {name: 'wordCount', type: 'number', title: 'Word Count'},
        {name: 'citations', type: 'number', title: 'Number of Citations'},
        {name: 'uniqueSources', type: 'number', title: 'Unique Sources'},
        {name: 'qualityScore', type: 'number', title: 'Quality Score (0-100)'},
        {name: 'readingTime', type: 'number', title: 'Reading Time (minutes)'}
      ]
    }),
    
    // Cache tracking
    defineField({
      name: 'cacheStats',
      title: 'Cache Statistics',
      type: 'object',
      fields: [
        {name: 'hits', type: 'number', title: 'Cache Hits'},
        {name: 'misses', type: 'number', title: 'Cache Misses'},
        {name: 'savings', type: 'number', title: 'Cost Savings from Cache ($)'}
      ]
    }),
    
    // Timestamp
    defineField({
      name: 'generatedAt',
      title: 'Generation Timestamp',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    })
  ],
  
  preview: {
    select: {
      title: 'keyword',
      tier: 'tier',
      cost: 'metrics.totalCost',
      quality: 'metrics.qualityScore'
    },
    prepare({title, tier, cost, quality}) {
      const tierEmoji = tier === 'HIGH' ? '🔥' : tier === 'MEDIUM' ? '⭐' : '📝';
      return {
        title: `${tierEmoji} ${title}`,
        subtitle: `Cost: $${cost?.toFixed(3) || '0'} | Quality: ${quality || 'N/A'}%`
      }
    }
  }
})