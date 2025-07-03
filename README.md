# Next.js Multi-tenant Starter Template with Temporary Email Service

A minimalistic multi-tenant Next.js starter template with temporary email functionality using Mailsac API. Features include user authentication, team management, and disposable email generation for testing and verification.

[Demo](https://stack-template.vercel.app/)

## Landing Page

<div align="center">
<img src="./assets/landing-page.png" alt="Teams" width="600"/>
</div>

## Dashboard

<div align="center">
<img src="./assets/dashboard-overview.png" alt="Teams" width="600"/>
</div>

## Multi-tenancy (Teams)

<div align="center">
<img src="./assets/team-switcher.png" alt="Teams" width="400"/>
</div>

## Account Settings

<div align="center">
<img src="./assets/account-settings.png" alt="Teams" width="500"/>
</div>

## Getting Started

1. Clone the repository

    ```bash
    git clone https://github.com/rowdy-raedon/multi-tenant-starter-template.git
    cd multi-tenant-starter-template
    ```

2. Install dependencies

    ```bash
    npm install
    ```

3. Set up your environment variables by copying the example file:

    ```bash
    cp .env.local.example .env.local
    ```

4. Configure your services:

    - **Stack Auth**: Register at [Stack Auth](https://stack-auth.com) and enable "client team creation"
    - **Supabase**: Create a project at [Supabase](https://supabase.com) and run the schema from `supabase-schema.sql`
    - **Mailsac**: Get an API key from [Mailsac](https://mailsac.com/api-keys)

5. Update `.env.local` with your actual API keys and credentials

6. Start the development server:

    ```bash
    npm run dev
    ```

7. Visit [http://localhost:3000](http://localhost:3000) to see your application

## Configuration

See `SETUP_GUIDE.md` for detailed configuration instructions including database setup and API key configuration.

## Features & Tech Stack

- Next.js 14 app router
- TypeScript
- Tailwind & Shadcn UI
- Stack Auth (Authentication)
- Supabase (Database)
- Mailsac API (Temporary emails)
- Multi-tenancy (teams/orgs)
- Dark mode
- Temporary email service
- Real-time message retrieval
- Email management dashboard

## Inspired by

- [Shadcn UI](https://github.com/shadcn-ui/ui)
- [Shadcn Taxonomy](https://github.com/shadcn-ui/taxonomy)
