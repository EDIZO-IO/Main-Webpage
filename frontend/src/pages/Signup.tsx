// src/pages/Signup.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
// Import necessary functions and types from firebase/auth
import { auth, googleProvider } from '../firebaseConfig';
import { signInWithPopup } from 'firebase/auth';
import type { User } from 'firebase/auth'; // Ensure User type is imported
import { FcGoogle } from 'react-icons/fc';
import Logo from '../components/common/Logo';

// Define the structure of the user data we'll store
interface UserData {
  name: string;
  email: string;
  photoURL?: string;
}

const Signup: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user: User = result.user;
      console.log('User signed in:', user);

      // --- Prepare and store user data ---
      // Create the user data object matching the structure expected by Header.tsx
      const userData: UserData = {
        name: user.displayName || 'User', // Fallback name
        email: user.email || '',         // Email should always be present for Google sign-in
        photoURL: user.photoURL || ''    // photoURL might be null/undefined
      };

      // Store the user data as a JSON string under the 'user' key
      localStorage.setItem('user', JSON.stringify(userData));
      // Set the authentication flag
      localStorage.setItem('isAuthenticated', 'true');
      // --- End storing user data ---

      // Redirect to the home page after successful login
      navigate('/');
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      // Provide a user-friendly error message
      setError(err.message || 'Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
      >
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo isScrolled={false} isFooter={false} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Welcome to Edizo</h2>
            <p className="text-gray-600 mt-2">Sign up or log in to continue</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50"
            >
              <FcGoogle className="w-5 h-5" />
              <span className="font-medium">
                {isLoading ? 'Signing in...' : 'Sign in with Google'}
              </span>
            </motion.button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              By signing up, you agree to our <a href="/terms" className="text-red-600 hover:underline">Terms of Service</a> and <a href="/privacy" className="text-red-600 hover:underline">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;