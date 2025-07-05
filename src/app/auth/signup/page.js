// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import supabase from '@/lib/supabaseClient';

// export default function SignupPage() {
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     role: 'candidate',
//   });
//   const [error, setError] = useState('');

//   const handleChange = (e) => {
//     setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     setError('');

//     const { email, password, name, role } = formData;

//     const { data, error: signUpError } = await supabase.auth.signUp({
//       email,
//       password,
//       options: {
//         data: { name, role }, // Stores additional user metadata
//       }
//     });

//     if (signUpError) {
//       setError(signUpError.message);
//     } else {
//       alert('Check your email for confirmation link');
//       router.push('/auth/login');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-white">
//       <form
//         onSubmit={handleSignup}
//         className="bg-gray-100 p-8 rounded-xl shadow-lg max-w-md w-full"
//       >
//         <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Account</h1>

//         {error && <p className="text-red-500 mb-4">{error}</p>}

//         <label className="block mb-2 text-gray-700">Full Name</label>
//         <input
//           name="name"
//           type="text"
//           required
//           value={formData.name}
//           onChange={handleChange}
//           className="w-full mb-4 p-2 border rounded text-gray-900"
//         />

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
//           className="w-full mb-4 p-2 border rounded text-gray-900"
//         />

//         <label className="block mb-2 text-gray-700">Role</label>
//         <select
//           name="role"
//           value={formData.role}
//           onChange={handleChange}
//           className="w-full mb-6 p-2 border rounded text-gray-900"
//         >
//           <option value="candidate">Candidate</option>
//           <option value="manager">Manager</option>
//         </select>

//         <button
//           type="submit"
//           className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
//         >
//           Sign Up
//         </button>

//         <p className="mt-4 text-sm text-gray-700">
//           Already have an account?{' '}
//           <a href="/auth/login" className="text-indigo-600 hover:underline">
//             Login
//           </a>
//         </p>
//       </form>
//     </div>
//   );
// }


// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import supabase from '@/lib/supabaseClient';

// export default function SignupPage() {
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     role: 'candidate',
//   });
//   const [error, setError] = useState('');

//   const handleChange = (e) => {
//     setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     setError('');

//     const { email, password, name, role } = formData;

//     const { data: userData, error: signUpError } = await supabase.auth.signUp({
//       email,
//       password,
//       options: {
//         data: { name, role }, // store name and role in auth metadata
//       }
//     });

//     if (signUpError) {
//       setError(signUpError.message);
//       return;
//     }

//     const userId = userData?.user?.id;

//     if (userId) {
//       const table = role === 'candidate' ? 'candidates' : 'managers';

//       const { error: dbError } = await supabase.from(table).insert([
//         {
//           id: userId,
//           name,
//           email,
//         },
//       ]);

//       if (dbError) {
//         console.error(`Error inserting into ${table}:`, dbError.message);
//         setError(`Signup succeeded but failed to save info in ${table} table.`);
//         return;
//       }

//     //   alert('Check your email for confirmation link');
//       router.push('/auth/login');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-white">
//       <form
//         onSubmit={handleSignup}
//         className="bg-gray-100 p-8 rounded-xl shadow-lg max-w-md w-full"
//       >
//         <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Account</h1>

//         {error && <p className="text-red-500 mb-4">{error}</p>}

//         <label className="block mb-2 text-gray-700">Full Name</label>
//         <input
//           name="name"
//           type="text"
//           required
//           value={formData.name}
//           onChange={handleChange}
//           className="w-full mb-4 p-2 border rounded text-gray-900"
//         />

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
//           className="w-full mb-4 p-2 border rounded text-gray-900"
//         />

//         <label className="block mb-2 text-gray-700">Role</label>
//         <select
//           name="role"
//           value={formData.role}
//           onChange={handleChange}
//           className="w-full mb-6 p-2 border rounded text-gray-900"
//         >
//           <option value="candidate">Candidate</option>
//           <option value="manager">Manager</option>
//         </select>

//         <button
//           type="submit"
//           className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
//         >
//           Sign Up
//         </button>

//         <p className="mt-4 text-sm text-gray-700">
//           Already have an account?{' '}
//           <a href="/auth/login" className="text-indigo-600 hover:underline">
//             Login
//           </a>
//         </p>
//       </form>
//     </div>
//   );
// }



'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import supabase from '@/lib/supabaseClient';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'candidate',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    const { email, password, name, role } = formData;

    const { data: userData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role },
      }
    });

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    const userId = userData?.user?.id;

    if (userId) {
      const table = role === 'candidate' ? 'candidates' : 'managers';

      const { error: dbError } = await supabase.from(table).insert([
        {
          id: userId,
          name,
          email,
        },
      ]);

      if (dbError) {
        console.error(`Error inserting into ${table}:`, dbError.message);
        setError(`Signup succeeded but failed to save info in ${table} table.`);
        return;
      }

      router.push('/auth/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-indigo-100 px-4">
      <motion.form
        onSubmit={handleSignup}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full"
      >
        <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">Create Account</h1>

        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

        <label className="block mb-2 text-gray-700 font-medium">Full Name</label>
        <input
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full mb-4 p-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

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
          className="w-full mb-4 p-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <label className="block mb-2 text-gray-700 font-medium">Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full mb-6 p-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="candidate">Candidate</option>
          <option value="manager">Manager</option>
        </select>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg transition font-semibold text-lg"
        >
          Sign Up
        </button>

        <p className="mt-4 text-sm text-gray-600 text-center">
          Already have an account?{' '}
          <a href="/auth/login" className="text-indigo-600 font-medium hover:underline">
            Login
          </a>
        </p>
      </motion.form>
    </div>
  );
}
