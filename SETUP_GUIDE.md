# Temporary Email Service Setup Guide

This guide will help you set up the temporary email service using the Mailsac API for reliable disposable email generation.

## Prerequisites

1. **Mailsac Account**: For temporary email API access
2. **Supabase Account**: For database
3. **Stack Auth Account**: For authentication

## Step 1: Mailsac Setup

### Create Mailsac Account

1. Go to [Mailsac](https://mailsac.com/)
2. Sign up for a free account
3. Navigate to [API Keys](https://mailsac.com/api-keys)
4. Generate a new API key
5. Copy the API key for later use

### Mailsac Features

- **Instant Email Creation**: Any email @mailsac.com is automatically created
- **API Access**: Retrieve messages via REST API
- **No Setup Required**: No domain configuration needed
- **Reliable Service**: Professional email testing platform

## Step 2: Supabase Setup

1. Create a new Supabase project at [Supabase](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Copy and paste the contents of `supabase-schema.sql`
4. Execute the query to create the required tables

### Get Supabase Credentials

1. **Project URL**: Found in Settings > API
2. **Anon Key**: Found in Settings > API
3. **Service Role Key**: Found in Settings > API (keep this secret)

## Step 3: Stack Auth Setup

1. Go to [Stack Auth](https://stack-auth.com)
2. Create a new project
3. Configure the project settings:
   - Enable team creation in the Teams tab
   - Set appropriate redirect URLs for your domain
4. Copy your project credentials:
   - Project ID
   - Publishable Client Key
   - Secret Server Key

## Step 4: Environment Configuration

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Update `.env.local` with your actual credentials:

```bash
# Stack Auth
NEXT_PUBLIC_STACK_PROJECT_ID=your_actual_project_id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your_actual_publishable_key
STACK_SECRET_SERVER_KEY=your_actual_secret_key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key

# Mailsac API
MAILSAC_API_KEY=your_actual_mailsac_api_key

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 5: Testing the Setup

### Test Mailsac API

Run the test script to verify your Mailsac integration:

```bash
node scripts/test-mailsac.js
```

### Test the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to [http://localhost:3000](http://localhost:3000)

3. Sign up or log in using Stack Auth

4. Navigate to the Temporary Email section

5. Generate a test email and verify it appears in your dashboard

## Step 6: Using the Service

### Generate Temporary Emails

1. **Random Generation**: Creates emails like `abc123@mailsac.com`
2. **Custom Generation**: Create emails like `mytest@mailsac.com`
3. **Expiration**: Set optional expiration times for emails
4. **Real-time**: Messages appear instantly when received

### Message Management

- **View Messages**: See all messages in the web interface
- **Message Content**: View both text and HTML content
- **Attachments**: Download and view email attachments
- **Real-time Updates**: Refresh to see new messages

## Troubleshooting

### Common Issues

1. **Mailsac API Errors**:
   - Verify your API key is correct
   - Check that your account has API access
   - Ensure you haven't exceeded rate limits

2. **Database Connection Issues**:
   - Verify Supabase credentials are correct
   - Check that the schema was applied successfully
   - Ensure RLS policies are configured properly

3. **Authentication Problems**:
   - Verify Stack Auth project is properly configured
   - Check that team creation is enabled
   - Ensure redirect URLs are set correctly

### Debug Commands

```bash
# Test Mailsac API
MAILSAC_API_KEY=your_key node scripts/test-mailsac.js

# Check environment variables
echo $MAILSAC_API_KEY

# Verify database connection
# Check Supabase dashboard for connection logs
```

## Production Deployment

### Security Considerations

1. **API Keys**: Never commit real API keys to version control
2. **Environment Variables**: Use your hosting platform's environment variable system
3. **Rate Limiting**: Monitor API usage to avoid limits
4. **HTTPS**: Ensure all API calls use HTTPS

### Hosting Platforms

The application can be deployed to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- **Heroku**
- Any platform supporting Node.js

## Features

- ✅ Generate temporary email addresses (@mailsac.com)
- ✅ Receive and display emails in web interface
- ✅ Dark theme UI
- ✅ Multi-tenant support (teams)
- ✅ Automatic email expiration
- ✅ Real-time message retrieval
- ✅ Copy email addresses to clipboard
- ✅ Professional email API service
- ✅ No domain setup required

## API Reference

### Mailsac Endpoints Used

- `GET /api/addresses/{email}/messages` - List messages
- `GET /api/text/{email}/{messageId}` - Get message text
- `GET /api/body/{email}/{messageId}` - Get message HTML
- `GET /api/raw/{email}/{messageId}` - Get raw message

### Rate Limits

Mailsac has generous rate limits for API access. Check your dashboard for current usage and limits.

## Support

- **Mailsac**: Check their documentation and support
- **Supabase**: Database and authentication issues  
- **Stack Auth**: Authentication and team management
- **GitHub Issues**: For application-specific problems