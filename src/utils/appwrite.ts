import { Client, Account, Databases, Storage, Query, Models } from 'appwrite';

// Lazy initialization to avoid build-time errors
let client: Client | null = null;
let account: Account | null = null;
let databases: Databases | null = null;
let storage: Storage | null = null;

const initializeAppwrite = () => {
  if (client) return; // Already initialized

  const APPWRITE_URL = process.env.NEXT_PUBLIC_APPWRITE_URL;
  const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

  if (!APPWRITE_URL || !APPWRITE_PROJECT_ID) {
    throw new Error(
      'Missing Appwrite environment variables. Please set NEXT_PUBLIC_APPWRITE_URL and NEXT_PUBLIC_APPWRITE_PROJECT_ID in your .env.local file.'
    );
  }

  client = new Client()
    .setEndpoint(APPWRITE_URL)
    .setProject(APPWRITE_PROJECT_ID);

  account = new Account(client);
  databases = new Databases(client);
  storage = new Storage(client);
};

const getAccount = () => {
  initializeAppwrite();
  return account!;
};

const getDatabases = () => {
  initializeAppwrite();
  return databases!;
};

const getStorage = () => {
  initializeAppwrite();
  return storage!;
};

export { getAccount as account, getDatabases as databases, getStorage as storage };

export const loginWithEmail = async (email: string, password: string) => {
    try {
        const session = await getAccount().createEmailPasswordSession(email, password);
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
        const user = await getAccount().create('unique()', email, password, name);
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
        await getAccount().deleteSessions();
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
        const user = await getAccount().get();
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
        await getAccount().updatePassword(newPassword, oldPassword);
        return { success: true };
    } catch (error: unknown) {
        console.error('Password update error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Password update failed';
        return { success: false, error: { message: errorMessage } };
    }
};

export const updateName = async (name: string) => {
    try {
        const user = await getAccount().updateName(name);
        return { success: true, data: user };
    } catch (error: unknown) {
        console.error('Name update error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Name update failed';
        return { success: false, error: { message: errorMessage } };
    }
};

// Database configurations
const DATABASE_ID = 'language-app';
const LEVELS_COLLECTION_ID = 'levels';
const COURSES_COLLECTION_ID = 'courses';
const LESSONS_COLLECTION_ID = 'lessons';

// Fetch all levels from the database
export const getLevels = async () => {
    try {
        const result = await getDatabases().listDocuments(DATABASE_ID, LEVELS_COLLECTION_ID);
        return { success: true, data: result.documents as Models.Document[] };
    } catch (error: unknown) {
        console.error('Get levels error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch levels';
        return { success: false, error: { message: errorMessage } };
    }
};

// Fetch courses for a specific level
export const getCourses = async (levelId: string) => {
    try {
        const result = await getDatabases().listDocuments(
            DATABASE_ID, 
            COURSES_COLLECTION_ID,
            [
                Query.equal('level', levelId),
                Query.equal('isActive', true)
            ]
        );
        return { success: true, data: result.documents as Models.Document[] };
    } catch (error: unknown) {
        console.error('Get courses error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch courses';
        return { success: false, error: { message: errorMessage } };
    }
};

// Fetch lessons for a specific course
export const getLessons = async (courseId: string) => {
    try {
        const result = await getDatabases().listDocuments(
            DATABASE_ID, 
            LESSONS_COLLECTION_ID,
            [
                Query.equal('course', courseId),
                Query.equal('isActive', true)
            ]
        );
        return { success: true, data: result.documents as Models.Document[] };
    } catch (error: unknown) {
        console.error('Get lessons error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch lessons';
        return { success: false, error: { message: errorMessage } };
    }
};

// Fetch a single lesson by ID
export const getLesson = async (lessonId: string) => {
    try {
        const result = await getDatabases().getDocument(
            DATABASE_ID, 
            LESSONS_COLLECTION_ID,
            lessonId
        );
        return { success: true, data: result as Models.Document };
    } catch (error: unknown) {
        console.error('Get lesson error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch lesson';
        return { success: false, error: { message: errorMessage } };
    }
};