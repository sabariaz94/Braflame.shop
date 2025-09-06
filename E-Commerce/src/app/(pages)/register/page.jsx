'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/firebase/firebaseConfig'; // Adjust path as needed
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
        toast.success('Passwords do not match!')
      
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      // Add name to user profile
      await updateProfile(userCredential.user, {
        displayName: form.name
      });

      toast.success('Successfully Registered!');
      router.push('/login'); // Redirect to dashboard or desired route
    } catch (error) {
      console.error('Error registering:', error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div>
    <Navbar/>
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-pink-200 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md backdrop-blur-md bg-white/80 border border-pink-100 shadow-2xl rounded-3xl p-8 space-y-6"
      >
        <h1 className="text-3xl font-bold text-pink-600 text-center">Create Account 💫</h1>
        <p className="text-center text-sm text-pink-500">Join the BraBliss community</p>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-pink-700">Full Name</label>
            <input
              type="text"
              name="name"
              required
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-pink-700">Email</label>
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-pink-700">Password</label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-pink-700">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              required
              placeholder="Repeat password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${loading ? 'bg-pink-400' : 'bg-pink-600 hover:bg-pink-700'} text-white py-2 rounded-xl font-semibold shadow transition`}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        <div className="text-center text-sm text-pink-500">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-pink-600 hover:underline">
            Log In
          </Link>
        </div>
      </motion.div>
    </div>
    <Footer/>
  </div>
  );
}