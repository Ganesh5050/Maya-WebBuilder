import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signInWithGitHub: (redirectUrl?: string) => Promise<void>
  signInWithEmail: (email: string) => Promise<void>
  signInWithPassword: (email: string, password: string) => Promise<void>
  signUpWithPassword: (email: string, password: string, firstName: string, lastName: string) => Promise<void>
  signOut: () => Promise<void>
  testConnection: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      // Store user globally for non-hook access
      if (session?.user) {
        (window as any).__currentUser = session.user;
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        // Store user globally for non-hook access
        if (session?.user) {
          (window as any).__currentUser = session.user;
        } else {
          delete (window as any).__currentUser;
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/apps`
      }
    })
    if (error) throw error
  }

  const signInWithGitHub = async (redirectUrl?: string) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: redirectUrl || `${window.location.origin}/apps`
      }
    })
    if (error) throw error
  }

  const signInWithEmail = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/apps`
      }
    })
    if (error) throw error
  }

  const signInWithPassword = async (email: string, password: string) => {
    console.log('Attempting to sign in with:', { email });
    console.log('Supabase URL:', 'https://simngjynepjayqkwmkau.supabase.co');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Sign in response:', { data, error });

      if (error) {
        console.error('Supabase auth error:', error);
        throw error;
      }
    } catch (err: any) {
      console.error('Complete sign in error:', err);
      console.error('Error type:', typeof err);
      console.error('Error message:', err?.message || 'No message available');
      console.error('Error stack:', err?.stack || 'No stack available');
      throw err;
    }
  }

  const signUpWithPassword = async (email: string, password: string, firstName: string, lastName: string) => {
    console.log('=== AUTH CONTEXT SIGN UP START ===');
    console.log('Attempting to sign up with:', { email, firstName, lastName });

    try {
      console.log('Calling supabase.auth.signUp...');
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            full_name: `${firstName} ${lastName}`
          },
          // Skip email confirmation
          emailRedirectTo: undefined
        }
      });

      console.log('Sign up response:', { data, error });

      if (error) {
        console.error('Supabase auth error:', error);
        throw error;
      }

      // If user is created but not confirmed, that's OK for our use case
      if (data.user && !data.user.email_confirmed_at) {
        console.log('✅ User created successfully (email confirmation disabled)');
      }

      console.log('=== AUTH CONTEXT SIGN UP SUCCESS ===');
    } catch (err: any) {
      console.error('=== AUTH CONTEXT SIGN UP ERROR ===');
      console.error('Complete sign up error:', err);
      throw err;
    }
  }

  const testConnection = async () => {
    console.log('=== TESTING SUPABASE CONNECTION ===');
    console.log('Testing Supabase connection...');
    console.log('URL:', 'https://simngjynepjayqkwmkau.supabase.co');

    try {
      // Test 1: Basic auth endpoint
      console.log('Test 1: Testing auth endpoint...');
      const { data: authData, error: authError } = await supabase.auth.getSession();
      console.log('Auth test result:', { authData, authError });

      // Test 2: Test if we can reach the auth API directly
      console.log('Test 2: Testing direct API call...');
      const response = await fetch('https://simngjynepjayqkwmkau.supabase.co/auth/v1/user', {
        method: 'GET',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpbW5nanluZXBqYXlxa3dta2F1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MTkyOTcsImV4cCI6MjA3OTk5NTI5N30.2aY4lq6Y3ijUx0GUpvaqSFB6l2UJXpOPGzd5_UU8U_Q',
          'Content-Type': 'application/json'
        }
      });
      console.log('Direct API response status:', response.status);
      console.log('Direct API response ok:', response.ok);

      if (!authError && response.ok) {
        console.log('✅ Supabase connection successful!');
        return true;
      } else {
        console.log('❌ Supabase connection failed');
        return false;
      }
    } catch (err: any) {
      console.error('=== CONNECTION TEST FAILED ===');
      console.error('Connection test error:', err);
      console.error('Error type:', typeof err);
      console.error('Error message:', err?.message || 'No message available');
      console.error('Error stack:', err?.stack || 'No stack available');
      return false;
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const value = {
    user,
    session,
    loading,
    signInWithGoogle,
    signInWithGitHub,
    signInWithEmail,
    signInWithPassword,
    signUpWithPassword,
    signOut,
    testConnection
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
