import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'category',
  title: 'Categories',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Category Name',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'e.g., "Visa Requirements", "Tax Strategies", "Living Costs"'
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: Rule => Rule.required(),
      description: 'URL-friendly version of the category name'
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      description: 'Brief description of what this category covers'
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Emoji icon for this category (optional)'
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 0,
      description: 'Order in which categories appear (lower numbers first)'
    })
  ],
  preview: {
    select: {
      title: 'title',
      icon: 'icon'
    },
    prepare({title, icon}) {
      return {
        title: `${icon || ''} ${title}`.trim()
      }
    }
  }
})