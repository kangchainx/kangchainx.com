'use server'

import { Resend } from 'resend';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONTACT_RECIPIENT = 'kangchenhe666@gmail.com';
const CONTACT_SENDER = 'Portfolio Contact <onboarding@resend.dev>';

interface TurnstileVerifyResponse {
  success: boolean;
  [key: string]: unknown;
}

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

function getRequiredEnv(key: string) {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export async function sendEmail(formData: FormData) {
  const name = getFormString(formData, 'name');
  const email = getFormString(formData, 'email');
  const message = getFormString(formData, 'message');
  const honeypot = getFormString(formData, 'confirm_email');
  const turnstileToken = getFormString(formData, 'cf-turnstile-response');

  // 1. Honeypot Check (Silent Rejection)
  if (honeypot) {
    console.warn('Bot detected via honeypot.');
    return { success: true }; // Fake success
  }

  if (!name || !email || !message) {
    return { error: 'Please fill in all fields.' };
  }

  if (!EMAIL_PATTERN.test(email)) {
    return { error: 'Please enter a valid email address.' };
  }

  // 2. Turnstile Verification
  if (!turnstileToken) {
    return { error: 'Security check failed. Please refresh and try again.' };
  }

  try {
    const turnstileSecret = getRequiredEnv('TURNSTILE_SECRET_KEY');

    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({
        secret: turnstileSecret,
        response: turnstileToken,
      }),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const verifyData = (await verifyRes.json()) as TurnstileVerifyResponse;
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
    const resend = new Resend(getRequiredEnv('RESEND_API_KEY'));
    const { error } = await resend.emails.send({
      from: CONTACT_SENDER,
      to: [CONTACT_RECIPIENT],
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
