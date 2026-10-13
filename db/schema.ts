import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const workspaces = sqliteTable('workspaces', {owner: text('owner').primaryKey(), createdAt:text('created_at').notNull()});
export const events = sqliteTable('events', {id:text('id').primaryKey(), owner:text('owner').notNull(), version:integer('version').notNull().default(1), data:text('data').notNull(), updatedAt:text('updated_at').notNull()});
export const files = sqliteTable('files', {id:text('id').primaryKey(), owner:text('owner').notNull(), eventId:text('event_id').notNull(), name:text('name').notNull(), type:text('type').notNull(), size:integer('size').notNull(), createdAt:text('created_at').notNull()});
