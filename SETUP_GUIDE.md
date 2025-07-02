# Temporary Email Service Setup Guide

This guide will help you set up the temporary email service using your custom domain with ImprovMX and Cloudflare.

## Prerequisites

1. **Domain**: You should own a domain (e.g., `rowdymail.pro`)
2. **Cloudflare Account**: Domain should be managed by Cloudflare
3. **ImprovMX Account**: For email forwarding
4. **Supabase Account**: For database
5. **Stack Auth Account**: For authentication

## Step 1: Domain Configuration

### Cloudflare DNS Setup

1. Log into your Cloudflare dashboard
2. Navigate to your domain (e.g., `rowdymail.pro`)
3. Go to **DNS** tab
4. Add the following records:

```
Type: MX
Name: @
Content: mx1.improvmx.com
Priority: 10

Type: MX  
Name: @
Content: mx2.improvmx.com
Priority: 20
```

### ImprovMX Configuration

1. Go to [ImprovMX](https://improvmx.com/)
2. Add your domain `rowdymail.pro`
3. Set up email forwarding:
   - Forward `*@rowdymail.pro` to your app's webhook
   - Or set up alias forwarding to your Gmail account for testing

## Step 2: Supabase Setup

1. Create a new Supabase project
2. Run the SQL schema from `supabase-schema.sql`:
   - Go to SQL Editor in Supabase dashboard
   - Copy and paste the contents of `supabase-schema.sql`
   - Execute the query

3. Get your Supabase credentials:
   - Project URL
   - Anon (public) key
   - Service role key (for admin operations)

## Step 3: Stack Auth Setup

1. Go to [Stack Auth](https://stack-auth.com)
2. Create a new project
3. Configure the project:
   - Enable team creation
   - Set redirect URLs
   - Get your project credentials

## Step 4: Environment Variables

1. Copy `.env.local.example` to `.env.local`
2. Fill in all the required values:

```bash
# Stack Auth
NEXT_PUBLIC_STACK_PROJECT_ID=your_project_id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your_publishable_key
STACK_SECRET_SERVER_KEY=your_secret_key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Email
WEBHOOK_SECRET=your_webhook_secret
DOMAIN=rowdymail.pro
```

## Step 5: Testing the Setup

### Test Domain Configuration

1. **DNS Propagation**: Check if MX records are propagated
   ```bash
   dig MX rowdymail.pro
   ```

2. **ImprovMX Status**: Check if ImprovMX recognizes your domain
   - Log into ImprovMX dashboard
   - Verify domain status is "Active"

### Test Email Forwarding

1. **Simple Forward Test**:
   - Send an email to `test@rowdymail.pro`
   - Check if it forwards to your configured address

2. **Webhook Test**:
   - Deploy your application
   - Configure ImprovMX to forward to your webhook URL
   - Send test emails to generated temporary addresses

## Step 6: Production Deployment

### Webhook URLs

Configure ImprovMX to forward emails to your webhook:

- **Standard webhook**: `https://your-domain.com/api/webhook/email`
- **ImprovMX format**: `https://your-domain.com/api/webhook/improvmx`

### Security

1. Set a strong `WEBHOOK_SECRET` in production
2. Enable HTTPS for all webhook endpoints
3. Set up proper CORS policies
4. Monitor webhook logs for suspicious activity

## Step 7: Usage

1. **Access the App**: Go to your deployed application
2. **Sign Up/Login**: Use Stack Auth to authenticate
3. **Create Team**: Create or join a team
4. **Generate Emails**: Use the temp email interface to create temporary addresses
5. **Receive Messages**: Messages sent to temporary addresses will appear in the inbox

## Troubleshooting

### Common Issues

1. **MX Records Not Working**:
   - Check DNS propagation (can take up to 48 hours)
   - Verify MX record values are correct
   - Ensure TTL is not too high

2. **ImprovMX Not Receiving**:
   - Check domain verification in ImprovMX dashboard
   - Verify DNS records match ImprovMX requirements
   - Test with simple forwarding first

3. **Webhook Not Receiving**:
   - Check webhook URL is accessible publicly
   - Verify HTTPS is working
   - Check webhook secret configuration
   - Review server logs for errors

4. **Database Issues**:
   - Verify Supabase credentials
   - Check RLS policies are configured correctly
   - Ensure schema was applied successfully

### Debug Commands

```bash
# Test DNS
dig MX rowdymail.pro
nslookup -type=MX rowdymail.pro

# Test webhook endpoint
curl -X GET https://your-domain.com/api/webhook/email

# Check application logs
npm run dev
```

### Support

- **ImprovMX**: Check their documentation and support
- **Cloudflare**: DNS troubleshooting guides
- **Supabase**: Database and authentication issues
- **Stack Auth**: Authentication and team management

## Features

- ✅ Generate temporary email addresses
- ✅ Receive and display emails in web interface
- ✅ Dark theme UI
- ✅ Multi-tenant support (teams)
- ✅ Automatic email expiration
- ✅ Message management (read/unread status)
- ✅ Copy email addresses to clipboard
- ✅ Real-time email reception
- ✅ Secure webhook endpoints

## Next Steps

1. **Monitoring**: Set up logging and monitoring for production
2. **Scaling**: Consider rate limiting and resource management
3. **Features**: Add email templates, filters, or forwarding rules
4. **Security**: Implement additional security measures for production use