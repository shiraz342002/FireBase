import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from '../config/FireBaseConfig'; 
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(false); 
  const [isAuthenticated, setIsAuthenticated] = useState(!!auth.currentUser);
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Signed in successfully!');
        setIsAuthenticated(true);
        navigate('/student');
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    } else {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success('Account created successfully! Redirecting to login...');
        setIsLogin(true); // Switch to login mode
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const thirdPartySignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success('Signed in successfully!');
      navigate('/students');
      setIsAuthenticated(true);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully!');
      setIsAuthenticated(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {isAuthenticated ? (
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold text-center mb-6">Welcome, {auth.currentUser?.email}</h2>
            <button
              onClick={handleLogout}
              className="w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-md hover:bg-red-500 transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center mb-6">{isLogin ? 'Sign In' : 'Sign Up'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="Enter your password"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-500 transition-colors duration-200"
              >
                {isLogin ? 'Sign In' : 'Sign Up'}
              </button>
            </form>
            <p className="text-sm text-gray-500 text-center mt-4">
              {isLogin ? 'Don\'t have an account?' : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-indigo-600 hover:underline focus:outline-none"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
            <div className="mt-6 flex flex-col items-center">
              <button
                onClick={thirdPartySignIn}
                aria-label="Sign in with Google"
                className="flex items-center bg-white border border-gray-300 rounded-md px-4 py-2 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300 w-full"
              >
                <img
                  src="https://static-00.iconduck.com/assets.00/google-icon-2048x2048-pks9lbdv.png"
                  alt="Google Logo"
                  className="w-5 h-5"
                />
                <span className="text-sm text-gray-700 ml-3">Sign in with Google</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Auth;
