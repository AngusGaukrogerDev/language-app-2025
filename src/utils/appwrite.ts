import { Client, Account, Databases, ID, Query, Storage } from 'appwrite';

// Validate environment variables
const APPWRITE_URL = process.env.NEXT_PUBLIC_APPWRITE_URL;
const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

if (!APPWRITE_URL || !APPWRITE_PROJECT_ID) {
  throw new Error(
    'Missing Appwrite environment variables. Please set NEXT_PUBLIC_APPWRITE_URL and NEXT_PUBLIC_APPWRITE_PROJECT_ID in your .env.local file.'
  );
}

console.log('Appwrite Configuration:', {
  url: APPWRITE_URL,
  projectId: APPWRITE_PROJECT_ID
});

const client = new Client()
    .setEndpoint(APPWRITE_URL)
    .setProject(APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export const loginWithEmail = async (email: string, password: string) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);
        return { success: true, data: session };
    } catch (error: any) {
        console.error('Login error:', error);
        // Handle specific Appwrite errors
        if (error.code === 401) {
            return { success: false, error: { message: 'Invalid email or password' } };
        }
        return { success: false, error: { message: error.message || 'Login failed' } };
    }
};

export const signupWithEmail = async (email: string, password: string, name: string) => {
    try {
        const user = await account.create('unique()', email, password, name);
        // Automatically log in after successful signup
        const session = await loginWithEmail(email, password);
        return { success: true, data: { user, session } };
    } catch (error: any) {
        console.error('Signup error:', error);
        // Handle specific Appwrite errors
        if (error.code === 409) {
            return { success: false, error: { message: 'User already exists with this email' } };
        }
        return { success: false, error: { message: error.message || 'Signup failed' } };
    }
};

export const logout = async () => {
    try {
        // Delete all sessions instead of just the current one
        await account.deleteSessions();
        return { success: true };
    } catch (error: any) {
        console.error('Logout error:', error);
        // Even if logout fails, we should clear local state
        return { success: true };
    }
};

// Get the current user session
export const getCurrentUser = async () => {
    try {
        const user = await account.get();
        return { success: true, data: user };
    } catch (error: any) {
        // Don't log errors for expected authentication check failures
        // This is normal behavior when user is not authenticated
        if (error.code === 401 || error.message?.includes('missing scope')) {
            return { success: false, error: { message: 'Not authenticated' } };
        }
        // Only log actual errors, not expected auth failures
        console.error('Get current user error:', error);
        return { success: false, error: { message: error.message || 'Failed to get user' } };
    }
};

export const updatePassword = async (oldPassword: string, newPassword: string) => {
    try {
        await account.updatePassword(newPassword, oldPassword);
        return { success: true };
    } catch (error: any) {
        console.error('Password update error:', error);
        return { success: false, error: { message: error.message || 'Password update failed' } };
    }
};

export const updateName = async (name: string) => {
    try {
        const user = await account.updateName(name);
        return { success: true, data: user };
    } catch (error: any) {
        console.error('Name update error:', error);
        return { success: false, error: { message: error.message || 'Name update failed' } };
    }
};