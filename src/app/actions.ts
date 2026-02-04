'use server'

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;
  const honeypot = formData.get('confirm_email') as string;
  const turnstileToken = formData.get('cf-turnstile-response') as string;

  // 1. Honeypot Check (Silent Rejection)
  if (honeypot) {
    console.warn('Bot detected via honeypot.');
    return { success: true }; // Fake success
  }

  if (!name || !email || !message) {
    return { error: 'Please fill in all fields.' };
  }

  // 2. Turnstile Verification
  if (!turnstileToken) {
    return { error: 'Security check failed. Please refresh and try again.' };
  }

  try {
    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY!,
        response: turnstileToken,
      }),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const verifyData = await verifyRes.json();
    if (!verifyData.success) {
      console.error('Turnstile verification failed:', verifyData);
      return { error: 'Security verification failed.' };
    }
  } catch (err) {
    console.error('Turnstile API error:', err);
    return { error: 'Failed to verify security token.' };
  }

  // 3. Send Email
  try {
    const { data, error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: ['kangchenhe666@gmail.com'], 
      subject: `New Message from ${name}`,
      replyTo: email,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    if (error) {
      console.error('Resend error:', error);
      return { error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Server error:', error);
    return { error: 'Something went wrong. Please try again later.' };
  }
}
