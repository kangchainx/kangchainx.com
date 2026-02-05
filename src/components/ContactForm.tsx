"use client";

import React, { useState } from "react";
import {
  User,
  Envelope,
  ChatText,
  PaperPlaneRight,
  CircleNotch,
  CheckCircle,
} from "@phosphor-icons/react";
import { sendEmail } from "@/app/actions";
import { Turnstile } from "@marsidev/react-turnstile";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [turnstileToken, setTurnstileToken] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;
    
    const newErrors: typeof errors = {};
    if (!name?.trim()) newErrors.name = "Please enter your full name.";
    if (!email?.trim()) newErrors.email = "Please enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Please enter a valid email address.";
    if (!message?.trim()) newErrors.message = "Please enter a message.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!turnstileToken) {
      alert("Please complete the security check.");
      return;
    }

    setErrors({});
    setStatus("sending");

    try {
      const result = await sendEmail(formData);

      if (result?.error) {
        throw new Error(result.error);
      }

      setStatus("success");
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong. Please try again.");
      setStatus("idle");
    }
  };

  const handleInputChange = (field: keyof typeof errors) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (status === "success") {
    // ... (keep success view same)
    return (
      <div className="w-full max-w-xl mx-auto min-h-[400px] flex flex-col items-center justify-center p-8 bg-card border border-border rounded-2xl shadow-xl animate-fade-in-up text-center">
        <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-6">
          <CheckCircle size={32} weight="fill" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-2">
          Message Sent!
        </h3>
        <p className="text-zinc-500 max-w-xs mx-auto">
          Thanks for reaching out. I&apos;ll get back to you as soon as possible.
        </p>
        <button
          onClick={() => {
            setStatus("idle");
            setTurnstileToken("");
          }}
          className="mt-8 px-6 py-2 text-sm font-medium text-zinc-500 hover:text-foreground transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto bg-card border border-border rounded-2xl shadow-xl p-6 md:p-10 transition-all duration-300 text-left">
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Name Field */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="name"
            className="text-sm font-medium text-foreground"
          >
            Full Name
          </label>
          <div className={`relative group ${errors.name ? 'animate-shake' : ''}`}>
            <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.name ? 'text-red-500' : 'text-zinc-500 group-focus-within:text-blue-500'}`}>
              <User size={20} />
            </div>
            <input
              type="text"
              id="name"
              name="name"
              onChange={() => handleInputChange('name')}
              placeholder="John Doe"
              className={`w-full bg-zinc-50 dark:bg-white/5 border rounded-xl py-3.5 pl-12 pr-4 text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                errors.name 
                  ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' 
                  : 'border-zinc-200 dark:border-white/10 focus:ring-blue-500/20 focus:border-blue-500'
              }`}
            />
          </div>
          {errors.name ? (
            <p className="text-xs text-red-500 ml-1 animate-fade-in-up">{errors.name}</p>
          ) : (
            <p className="text-xs text-zinc-500 ml-1">Tell me your name.</p>
          )}
        </div>

        {/* Email Field */}
        <div className="flex flex-col gap-4">
          <label
            htmlFor="email"
            className="text-sm font-medium text-foreground"
          >
            Email Address
          </label>
          <div className={`relative group ${errors.email ? 'animate-shake' : ''}`}>
            <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.email ? 'text-red-500' : 'text-zinc-500 group-focus-within:text-blue-500'}`}>
              <Envelope size={20} />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              onChange={() => handleInputChange('email')}
              placeholder="john@example.com"
              className={`w-full bg-zinc-50 dark:bg-white/5 border rounded-xl py-3.5 pl-12 pr-4 text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                errors.email 
                  ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' 
                  : 'border-zinc-200 dark:border-white/10 focus:ring-blue-500/20 focus:border-blue-500'
              }`}
            />
          </div>
          {errors.email ? (
            <p className="text-xs text-red-500 ml-1 animate-fade-in-up">{errors.email}</p>
          ) : (
            <p className="text-xs text-zinc-500 ml-1">So I can reply to you.</p>
          )}
        </div>

        {/* Message Field */}
        <div className="flex flex-col gap-4">
          <label
            htmlFor="message"
            className="text-sm font-medium text-foreground"
          >
            Message
          </label>
          <div className={`relative group ${errors.message ? 'animate-shake' : ''}`}>
            <div className={`absolute left-4 top-4 transition-colors ${errors.message ? 'text-red-500' : 'text-zinc-500 group-focus-within:text-blue-500'}`}>
              <ChatText size={20} />
            </div>
            <textarea
              id="message"
              name="message"
              rows={4}
              onChange={() => handleInputChange('message')}
              placeholder="Type your message here"
              className={`w-full bg-zinc-50 dark:bg-white/5 border rounded-xl py-3.5 pl-12 pr-4 text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 transition-all duration-300 resize-none ${
                errors.message 
                  ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' 
                  : 'border-zinc-200 dark:border-white/10 focus:ring-blue-500/20 focus:border-blue-500'
              }`}
            />
          </div>
          {errors.message ? (
            <p className="text-xs text-red-500 ml-1 animate-fade-in-up">{errors.message}</p>
          ) : (
            <p className="text-xs text-zinc-500 ml-1">What&apos;s on your mind?</p>
          )}
        </div>

        {/* Honeypot Field (Hidden) - Traps bots */}
        <div className="hidden" aria-hidden="true">
          <input
            type="text"
            name="confirm_email"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* Turnstile Widget - Invisible Mode */}
        <Turnstile
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
          onSuccess={(token) => setTurnstileToken(token)}
          options={{
            size: "invisible",
          }}
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 active:scale-[0.98] transition-all duration-200 rounded-xl py-4 font-bold tracking-wide flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
        >
          {status === "sending" ? (
            <>
              <CircleNotch size={20} className="animate-spin" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <span>Send Message</span>
              <PaperPlaneRight size={18} weight="bold" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
