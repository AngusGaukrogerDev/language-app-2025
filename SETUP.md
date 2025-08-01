# Grammar Lab Setup Guide

## Environment Variables Setup

To fix the runtime error, you need to set up your environment variables properly.

### 1. Create Environment File

Create a `.env.local` file in the root directory of your project with the following content:

```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_URL=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_actual_project_id
```

**For Self-Hosted Appwrite:**
```env
NEXT_PUBLIC_APPWRITE_URL=https://your-domain.com/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_actual_project_id
```

### 2. Get Your Appwrite Credentials

1. Go to [Appwrite Console](https://console.appwrite.io/) (or your self-hosted instance)
2. Create a new project or select an existing one
3. Go to **Settings** → **General**
4. Copy your **Project ID**
5. The endpoint URL depends on your setup:
   - **Cloud**: `https://cloud.appwrite.io/v1`
   - **Self-hosted**: `https://your-domain.com/v1`

### 3. Enable Authentication

1. In your Appwrite project, go to **Auth** → **Settings**
2. Enable **Email/Password** authentication
3. Save the settings

### 4. Configure Permissions (Important!)

The "User (role: guests) missing scope (account)" error occurs when permissions aren't set correctly:

1. Go to **Auth** → **Settings** in your Appwrite project
2. Under **Permissions**, make sure:
   - **Create** is enabled for "Any authenticated user"
   - **Read** is enabled for "Any authenticated user"
   - **Update** is enabled for "Any authenticated user"
   - **Delete** is enabled for "Any authenticated user"

3. If you're using a database, also configure database permissions:
   - Go to **Databases** → **Your Database** → **Settings**
   - Set appropriate permissions for your collections

### 5. Self-Hosted Appwrite Specific Setup

If you're using a self-hosted Appwrite instance (like `thepitahaya.com`):

1. **Verify HTTPS**: Make sure your domain uses HTTPS
2. **Check CORS**: Ensure your Appwrite instance allows requests from `localhost:3000`
3. **API Key**: You might need to create an API key with proper permissions
4. **Project Settings**: Verify the project is properly configured

### 6. Restart Development Server

After creating the `.env.local` file:

```bash
npm run dev
```

## Troubleshooting

### "Cannot read properties of undefined (reading 'startsWith')" Error

This error occurs when:
- Environment variables are not set
- Environment variables are empty
- The `.env.local` file is not in the correct location

**Solution:**
1. Make sure `.env.local` is in the project root (same level as `package.json`)
2. Verify the environment variables are not empty
3. Restart your development server after adding the file

### "User (role: guests) missing scope (account)" Error

This error occurs when:
- User is not properly authenticated
- Appwrite permissions are not configured correctly
- Session has expired or is invalid
- Self-hosted instance has configuration issues

**Solution:**
1. Check that authentication is enabled in Appwrite
2. Verify permissions are set correctly (see step 4 above)
3. For self-hosted instances:
   - Check if the instance is accessible
   - Verify CORS settings
   - Check API key permissions
4. Try logging out and logging back in
5. Clear browser cookies and try again

### 401 Error on Self-Hosted Instances

If you see `401` errors with a self-hosted instance:

1. **Check API Key**: Create a new API key with proper permissions
2. **Verify Project ID**: Make sure the project ID is correct
3. **Check Instance Status**: Ensure your Appwrite instance is running
4. **CORS Issues**: Add `localhost:3000` to allowed origins
5. **HTTPS Required**: Make sure you're using HTTPS for the endpoint

### Common Issues

1. **File not found**: Make sure the file is named exactly `.env.local` (not `.env` or `.env.example`)
2. **Wrong location**: The file must be in the project root directory
3. **Wrong format**: Don't use quotes around the values in the `.env.local` file
4. **Caching**: Restart the development server after making changes
5. **Permissions**: Make sure Appwrite permissions are configured correctly
6. **Self-hosted**: Verify your instance is properly configured and accessible

## Testing

Once configured:
1. Visit `http://localhost:3000`
2. Click "Create Account" to test signup
3. Or click "Sign In" to test login
4. You should be redirected to the dashboard after successful authentication

## Debug Information

The app will log Appwrite configuration details to the console. Check the browser console to verify:
- The correct URL is being used
- The correct Project ID is set
- Any connection errors are displayed 