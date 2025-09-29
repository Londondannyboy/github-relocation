import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'tag',
  title: 'Tags',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Tag Name',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'e.g., "golden-visa", "digital-nomad", "tax-free"'
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    })
  ],
  preview: {
    select: {
      title: 'title'
    },
    prepare({title}) {
      return {
        title: `#${title}`
      }
    }
  }
})