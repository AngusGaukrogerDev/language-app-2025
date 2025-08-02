import { Client, Account, Databases, Storage } from 'appwrite';

// Validate environment variables
const APPWRITE_URL = process.env.NEXT_PUBLIC_APPWRITE_URL;
const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

if (!APPWRITE_URL || !APPWRITE_PROJECT_ID) {
  throw new Error(
    'Missing Appwrite environment variables. Please set NEXT_PUBLIC_APPWRITE_URL and NEXT_PUBLIC_APPWRITE_PROJECT_ID in your .env.local file.'
  );
}

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
    } catch (error: unknown) {
        console.error('Login error:', error);
        // Handle specific Appwrite errors
        if (error && typeof error === 'object' && 'code' in error && error.code === 401) {
            return { success: false, error: { message: 'Invalid email or password' } };
        }
        const errorMessage = error instanceof Error ? error.message : 'Login failed';
        return { success: false, error: { message: errorMessage } };
    }
};

export const signupWithEmail = async (email: string, password: string, name: string) => {
    try {
        const user = await account.create('unique()', email, password, name);
        // Automatically log in after successful signup
        const session = await loginWithEmail(email, password);
        return { success: true, data: { user, session } };
    } catch (error: unknown) {
        console.error('Signup error:', error);
        // Handle specific Appwrite errors
        if (error && typeof error === 'object' && 'code' in error && error.code === 409) {
            return { success: false, error: { message: 'User already exists with this email' } };
        }
        const errorMessage = error instanceof Error ? error.message : 'Signup failed';
        return { success: false, error: { message: errorMessage } };
    }
};

export const logout = async () => {
    try {
        // Delete all sessions instead of just the current one
        await account.deleteSessions();
        return { success: true };
    } catch (error: unknown) {
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
    } catch (error: unknown) {
        // Don't log errors for expected authentication check failures
        // This is normal behavior when user is not authenticated
        if (error && typeof error === 'object' && 'code' in error && error.code === 401) {
            return { success: false, error: { message: 'Not authenticated' } };
        }
        if (error instanceof Error && error.message?.includes('missing scope')) {
            return { success: false, error: { message: 'Not authenticated' } };
        }
        const errorMessage = error instanceof Error ? error.message : 'Failed to get user';
        return { success: false, error: { message: errorMessage } };
    }
};

export const updatePassword = async (oldPassword: string, newPassword: string) => {
    try {
        await account.updatePassword(newPassword, oldPassword);
        return { success: true };
    } catch (error: unknown) {
        console.error('Password update error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Password update failed';
        return { success: false, error: { message: errorMessage } };
    }
};

export const updateName = async (name: string) => {
    try {
        const user = await account.updateName(name);
        return { success: true, data: user };
    } catch (error: unknown) {
        console.error('Name update error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Name update failed';
        return { success: false, error: { message: errorMessage } };
    }
};