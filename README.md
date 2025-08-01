# Grammar Lab

A modern grammar learning platform built with Next.js and Appwrite.

## Features

- 🔐 User authentication (login/signup)
- 📊 Dashboard with learning statistics
- 🎨 Clean monochrome design
- ⚡ Fast and responsive UI

## Getting Started

### Prerequisites

- Node.js 18+ 
- Appwrite account and project

### Environment Setup

1. Create a `.env.local` file in the root directory with your Appwrite credentials:

```env
NEXT_PUBLIC_APPWRITE_URL=your_appwrite_endpoint
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Appwrite Setup

1. Create a new Appwrite project
2. Enable authentication in your Appwrite console
3. Add your project URL and ID to the environment variables
4. The app will automatically handle user registration and authentication

## Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── api/            # API routes
│   ├── dashboard/      # Dashboard page
│   ├── login/          # Login page
│   └── signup/         # Signup page
├── components/         # Reusable components
├── contexts/          # React contexts
└── utils/             # Utility functions (Appwrite config)
```

## Testing the Application

1. Visit the homepage - you'll see the Grammar Lab landing page
2. Click "Create Account" to sign up with a new user
3. Or click "Sign In" if you already have an account
4. After authentication, you'll be redirected to the dashboard
5. Use the logout button in the navigation to sign out

## Next Steps

- Add grammar lessons and exercises
- Implement progress tracking
- Add user profile management
- Create interactive learning modules

## Technologies Used

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Appwrite** - Backend and authentication
- **React Context** - State management
