// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import supabase from '@/lib/supabaseClient';

// export default function LoginPage() {
//   const router = useRouter();
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');

//   const handleChange = (e) => {
//     setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError('');

//     const { email, password } = formData;

//     const { data, error: loginError } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });

//     if (loginError) {
//       setError(loginError.message);
//     } else {
//       const role = data.user.user_metadata.role;
//       if (role === 'manager') {
//         router.push('/dashboard/manager');
//       } else {
//         router.push('/dashboard/candidate');
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-white">
//       <form
//         onSubmit={handleLogin}
//         className="bg-gray-100 p-8 rounded-xl shadow-lg max-w-md w-full"
//       >
//         <h1 className="text-2xl font-bold text-gray-900 mb-6">Login</h1>

//         {error && <p className="text-red-500 mb-4">{error}</p>}

//         <label className="block mb-2 text-gray-700">Email</label>
//         <input
//           name="email"
//           type="email"
//           required
//           value={formData.email}
//           onChange={handleChange}
//           className="w-full mb-4 p-2 border rounded text-gray-900"
//         />

//         <label className="block mb-2 text-gray-700">Password</label>
//         <input
//           name="password"
//           type="password"
//           required
//           value={formData.password}
//           onChange={handleChange}
//           className="w-full mb-6 p-2 border rounded text-gray-900"
//         />

//         <button
//           type="submit"
//           className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
//         >
//           Login
//         </button>

//         <p className="mt-4 text-sm text-gray-700">
//           Don't have an account?{' '}
//           <a href="/auth/signup" className="text-indigo-600 hover:underline">
//             Sign Up
//           </a>
//         </p>
//       </form>
//     </div>
//   );
// }


// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
// import supabase from '@/lib/supabaseClient';

// export default function LoginPage() {
//   const router = useRouter();
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');

//   const handleChange = (e) => {
//     setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError('');

//     const { email, password } = formData;

//     const { data, error: loginError } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });

//     if (loginError) {
//       setError(loginError.message);
//     } else {
//       const role = data.user.user_metadata.role;
//       if (role === 'manager') {
//         router.push('/dashboard/manager');
//       } else {
//         router.push('/dashboard/candidate');
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-indigo-100 px-4">
//       <motion.form
//         onSubmit={handleLogin}
//         initial={{ opacity: 0, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, ease: 'easeOut' }}
//         className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full"
//       >
//         <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">Login</h1>

//         {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

//         <label className="block mb-2 text-gray-700 font-medium">Email</label>
//         <input
//           name="email"
//           type="email"
//           required
//           value={formData.email}
//           onChange={handleChange}
//           className="w-full mb-4 p-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//         />

//         <label className="block mb-2 text-gray-700 font-medium">Password</label>
//         <input
//           name="password"
//           type="password"
//           required
//           value={formData.password}
//           onChange={handleChange}
//           className="w-full mb-6 p-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//         />

//         <button
//           type="submit"
//           className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg transition font-semibold text-lg"
//         >
//           Login
//         </button>

//         <p className="mt-4 text-sm text-gray-600 text-center">
//           Don&apos;t have an account?{' '}
//           <a href="/auth/signup" className="text-indigo-600 font-medium hover:underline">
//             Sign Up
//           </a>
//         </p>
//       </motion.form>
//     </div>
//   );
// }



'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import supabase from '@/lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Load saved credentials on mount
  useEffect(() => {
    const saved = localStorage.getItem('credentials');
    if (saved) {
      const { email, password } = JSON.parse(saved);
      setFormData({ email, password });
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const { email, password } = formData;

    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError(loginError.message);
    } else {
      if (rememberMe) {
        localStorage.setItem('credentials', JSON.stringify({ email, password }));
      } else {
        localStorage.removeItem('credentials');
      }

      const role = data.user.user_metadata.role;
      if (role === 'manager') {
        router.push('/dashboard/manager');
      } else {
        router.push('/dashboard/candidate');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-indigo-100 px-4">
      <motion.form
        onSubmit={handleLogin}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full"
      >
        <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">Login</h1>

        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

        <label className="block mb-2 text-gray-700 font-medium">Email</label>
        <input
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full mb-4 p-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <label className="block mb-2 text-gray-700 font-medium">Password</label>
        <input
          name="password"
          type="password"
          required
          value={formData.password}
          onChange={handleChange}
          className="w-full mb-2 p-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <div className="flex items-center mb-6">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="rememberMe" className="text-sm text-gray-700">
            Keep me signed in
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg transition font-semibold text-lg"
        >
          Login
        </button>

        <p className="mt-4 text-sm text-gray-600 text-center">
          Don&apos;t have an account?{' '}
          <a href="/auth/signup" className="text-indigo-600 font-medium hover:underline">
            Sign Up
          </a>
        </p>
      </motion.form>
    </div>
  );
}
