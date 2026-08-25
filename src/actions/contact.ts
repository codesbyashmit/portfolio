'use server';

import { db } from '@/db';
import { messages } from '@/db/schema';

export async function submitContactForm(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const subject = formData.get('subject') as string;
  const content = formData.get('content') as string;

  if (!name || !email || !subject || !content) {
    return { error: 'All fields are required.' };
  }

  try {
    await db.insert(messages).values({
      name,
      email,
      subject,
      content,
    });
    
    return { success: true };
  } catch (error) {
    console.error('Failed to insert message:', error);
    return { error: 'Failed to send transmission. Try again.' };
  }
}