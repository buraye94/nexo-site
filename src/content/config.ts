import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    lang: z.enum(['en', 'es']),
    // Legacy field: no longer rendered (no emoji in the 2.0 design).
    emoji: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

// No longer rendered (design decision D5). Kept until Felipe confirms whether any entry is a real, permitted quote.
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

// Before/after proof. One entry per client, labeled by industry + market (never a name).
// status "illustrative" renders with a visible tag and data-gate="pending" (blocks the merge);
// "verified" renders only when client_ok is true.
const cases = defineCollection({
  type: 'data',
  schema: z.object({
    label_es: z.string(),
    label_en: z.string(),
    services: z.array(z.enum(['consultoria', 'auditoria', 'tecnico', 'local', 'linkbuilding', 'geo'])).min(1),
    markets: z.array(z.enum(['CO', 'MX'])).min(1),
    city: z.enum(['bogota', 'medellin', 'mexico', 'monterrey', 'guadalajara']).optional(),
    before: z.number().nonnegative(),
    after: z.number().positive(),
    window_months: z.number().int().positive(),
    source_es: z.string(),
    source_en: z.string(),
    status: z.enum(['illustrative', 'verified']),
    client_ok: z.boolean(),
    order: z.number().default(0),
  }),
});

export const collections = { blog, testimonials, cases };
