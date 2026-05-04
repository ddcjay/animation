import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const animations = sqliteTable('animations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  category: text('category').notNull(),
  description: text('description').notNull(),
  techStack: text('techStack', { mode: 'json' }).$type<string[]>().notNull(),
  codeSnippet: text('codeSnippet').notNull(),
  sourceUrl: text('sourceUrl'),
  previewType: text('previewType', { enum: ['iframe', 'image', 'none'] }).notNull().default('none'),
  previewUrl: text('previewUrl'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().defaultNow(),
});
