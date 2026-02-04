# kangchainx.com

Personal portfolio website built with Next.js and React.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Phosphor Icons
- **Contact Form**: Resend API + Cloudflare Turnstile

## Getting Started

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env.local` file in the root directory:

```env
RESEND_API_KEY=your_resend_api_key
TURNSTILE_SECRET_KEY=your_turnstile_secret_key
```

## Build

```bash
npm run build
npm start
```

## License

MIT
