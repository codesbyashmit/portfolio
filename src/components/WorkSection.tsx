import React from 'react';
import { db } from '@/db';
import { projects } from '@/db/schema';
import { asc } from 'drizzle-orm';
import { WorkGrid } from './WorkGrid';

export const WorkSection = async () => {
  const allProjects = await db
    .select()
    .from(projects)
    .orderBy(asc(projects.displayOrder));

  return (
    <div className="w-full relative z-10">
      <WorkGrid projects={allProjects} />
    </div>
  );
};