import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    lang: z.enum(['en', 'es']),
    emoji: z.string().default('📊'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const testimonials = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    role: z.string(),
    role_es: z.string(),
    initials: z.string(),
    text_en: z.string(),
    text_es: z.string(),
    order: z.number().default(0),
  }),
});

const cases = defineCollection({
  type: 'data',
  schema: z.object({
    title_en: z.string(),
    title_es: z.string(),
    tag: z.string(),
    description_en: z.string(),
    description_es: z.string(),
    metrics: z.array(z.object({
      value: z.string(),
      label_en: z.string(),
      label_es: z.string(),
    })),
    order: z.number().default(0),
  }),
});

export const collections = { blog, testimonials, cases };
