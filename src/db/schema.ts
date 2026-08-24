import { pgTable, uuid, varchar, text, boolean, integer, timestamp } from 'drizzle-orm/pg-core';

export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  shortDescription: text('short_description').notNull(),
  coverImage: text('cover_image').notNull(),
  demoUrl: text('demo_url'),
  githubUrl: text('github_url'),
  isFeatured: boolean('is_featured').default(false),
  displayOrder: integer('display_order').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const statusLogs = pgTable('status_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  currentFocus: text('current_focus').notNull(),
  locationLabel: varchar('location_label', { length: 100 }).default('Somewhere'),
  isActive: boolean('is_active').default(true),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const messages = pgTable('messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject').notNull(),
  content: text('content').notNull(),
  status: text('status').default('unread').notNull(), //unread, read, archived
  createdAt: timestamp('created_at').defaultNow().notNull(),
});