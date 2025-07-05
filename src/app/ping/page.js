// 'use client';

// import { useEffect, useState } from 'react';
// import supabase from '@/lib/supabaseClient';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FiBell, FiClock, FiCheckCircle, FiXCircle, FiUser, FiCalendar, FiMessageCircle } from 'react-icons/fi';
// import { Toaster, toast } from 'react-hot-toast';

// export default function ManagerPingsPage() {
//   const [pings, setPings] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [filter, setFilter] = useState('all'); // all, pending, accepted, completed

//   useEffect(() => {
//     fetchPings();
//   }, []);

//   const fetchPings = async () => {
//     setIsLoading(true);
//     try {
//       const { data, error } = await supabase
//         .from('pings')
//         .select(`
//           *,
//           candidates (
//             id,
//             name,
//             email
//           )
//         `)
//         .order('created_at', { ascending: false });

//       if (error) throw error;
//       setPings(data || []);
//     } catch (error) {
//       toast.error('Failed to load pings');
//       console.error(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const updatePingStatus = async (pingId, newStatus) => {
//     const toastId = toast.loading('Updating ping status...');
    
//     try {
//       const { error } = await supabase
//         .from('pings')
//         .update({ status: newStatus })
//         .eq('id', pingId);

//       if (error) throw error;
      
//       setPings(prev => prev.map(ping => 
//         ping.id === pingId ? { ...ping, status: newStatus } : ping
//       ));
      
//       toast.success('Status updated successfully', { id: toastId });
//     } catch (error) {
//       toast.error('Failed to update status', { id: toastId });
//       console.error(error);
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case 'pending':
//         return <FiClock className="text-yellow-500" />;
//       case 'accepted':
//         return <FiCheckCircle className="text-green-500" />;
//       case 'completed':
//         return <FiCheckCircle className="text-blue-500" />;
//       default:
//         return <FiClock className="text-gray-500" />;
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'pending':
//         return 'bg-yellow-100 text-yellow-800';
//       case 'accepted':
//         return 'bg-green-100 text-green-800';
//       case 'completed':
//         return 'bg-blue-100 text-blue-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const filteredPings = pings.filter(ping => {
//     if (filter === 'all') return true;
//     return ping.status === filter;
//   });

//   return (
//     <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-blue-50 to-indigo-50">
//       <Toaster position="top-right" richColors />
      
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="max-w-6xl mx-auto"
//       >
//         {/* Header */}
//         <div className="flex items-center mb-8">
//           <div className="p-3 rounded-xl bg-white shadow-sm border border-blue-100 mr-4">
//             <FiBell className="text-blue-600 text-2xl" />
//           </div>
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800">Ping Management</h1>
//             <p className="text-gray-500">Track all pings sent to candidates</p>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
//         >
//           <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
//             <div className="flex items-center">
//               <div className="p-2 rounded-lg bg-blue-100 mr-3">
//                 <FiBell className="text-blue-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Total Pings</p>
//                 <p className="text-2xl font-bold text-gray-800">{pings.length}</p>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
//             <div className="flex items-center">
//               <div className="p-2 rounded-lg bg-yellow-100 mr-3">
//                 <FiClock className="text-yellow-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Pending</p>
//                 <p className="text-2xl font-bold text-gray-800">
//                   {pings.filter(p => p.status === 'pending').length}
//                 </p>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
//             <div className="flex items-center">
//               <div className="p-2 rounded-lg bg-green-100 mr-3">
//                 <FiCheckCircle className="text-green-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Accepted</p>
//                 <p className="text-2xl font-bold text-gray-800">
//                   {pings.filter(p => p.status === 'accepted').length}
//                 </p>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
//             <div className="flex items-center">
//               <div className="p-2 rounded-lg bg-blue-100 mr-3">
//                 <FiCheckCircle className="text-blue-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Completed</p>
//                 <p className="text-2xl font-bold text-gray-800">
//                   {pings.filter(p => p.status === 'completed').length}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </motion.div>

//         {/* Filter Controls */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6"
//         >
//           <div className="flex items-center justify-between">
//             <h2 className="text-lg font-semibold text-gray-800">Filter Pings</h2>
//             <div className="flex space-x-2">
//               {['all', 'pending', 'accepted', 'completed'].map((status) => (
//                 <button
//                   key={status}
//                   onClick={() => setFilter(status)}
//                   className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
//                     filter === status
//                       ? 'bg-blue-600 text-white'
//                       : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                   }`}
//                 >
//                   {status.charAt(0).toUpperCase() + status.slice(1)}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </motion.div>

//         {/* Pings List */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3 }}
//           className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
//         >
//           {isLoading ? (
//             <div className="flex justify-center items-center py-12">
//               <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
//             </div>
//           ) : filteredPings.length === 0 ? (
//             <div className="text-center py-12">
//               <FiBell className="mx-auto text-gray-400 text-4xl mb-4" />
//               <p className="text-gray-500">No pings found</p>
//             </div>
//           ) : (
//             <div className="divide-y divide-gray-100">
//               <AnimatePresence>
//                 {filteredPings.map((ping) => (
//                   <motion.div
//                     key={ping.id}
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0 }}
//                     transition={{ duration: 0.2 }}
//                     className="p-6 hover:bg-gray-50 transition-colors"
//                   >
//                     <div className="flex items-start justify-between">
//                       <div className="flex-1">
//                         <div className="flex items-center space-x-3 mb-2">
//                           <div className="p-2 rounded-lg bg-gray-100">
//                             <FiUser className="text-gray-600" />
//                           </div>
//                           <div>
//                             <h3 className="font-semibold text-gray-800">
//                               {ping.candidates?.name || 'Unknown Candidate'}
//                             </h3>
//                             <p className="text-sm text-gray-500">
//                               {ping.candidates?.email || 'No email'}
//                             </p>
//                           </div>
//                         </div>
                        
//                         <div className="flex items-center space-x-4 text-sm text-gray-600">
//                           <div className="flex items-center space-x-1">
//                             <FiCalendar className="text-gray-400" />
//                             <span>{formatDate(ping.created_at)}</span>
//                           </div>
//                           {ping.conversation && (
//                             <div className="flex items-center space-x-1">
//                               <FiMessageCircle className="text-gray-400" />
//                               <span>{ping.conversation.length || 0} messages</span>
//                             </div>
//                           )}
//                         </div>
//                       </div>
                      
//                       <div className="flex items-center space-x-3">
//                         <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ping.status)}`}>
//                           <div className="flex items-center space-x-1">
//                             {getStatusIcon(ping.status)}
//                             <span>{ping.status.charAt(0).toUpperCase() + ping.status.slice(1)}</span>
//                           </div>
//                         </span>
                        
//                         {ping.status === 'pending' && (
//                           <div className="flex space-x-1">
//                             <button
//                               onClick={() => updatePingStatus(ping.id, 'accepted')}
//                               className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
//                               title="Mark as accepted"
//                             >
//                               <FiCheckCircle size={16} />
//                             </button>
//                             <button
//                               onClick={() => updatePingStatus(ping.id, 'completed')}
//                               className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
//                               title="Mark as completed"
//                             >
//                               <FiCheckCircle size={16} />
//                             </button>
//                           </div>
//                         )}
                        
//                         {ping.status === 'accepted' && (
//                           <button
//                             onClick={() => updatePingStatus(ping.id, 'completed')}
//                             className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
//                             title="Mark as completed"
//                           >
//                             <FiCheckCircle size={16} />
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   </motion.div>
//                 ))}
//               </AnimatePresence>
//             </div>
//           )}
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState } from 'react';
// import supabase from '@/lib/supabaseClient';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FiBell, FiClock, FiCheckCircle, FiXCircle, FiUser, FiCalendar, FiMessageCircle } from 'react-icons/fi';
// import { Toaster, toast } from 'react-hot-toast';

// export default function ManagerPingsPage() {
//   const [pings, setPings] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [filter, setFilter] = useState('all');

//   useEffect(() => {
//     fetchPings();
//   }, []);

//   const fetchPings = async () => {
//     setIsLoading(true);
//     try {
//       const { data, error } = await supabase
//         .from('pings')
//         .select(`*, candidates (id, name, email)`) 
//         .order('created_at', { ascending: false });

//       if (error) throw error;
//       setPings(data || []);
//     } catch (error) {
//       toast.error('Failed to load pings');
//       console.error(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const updatePingStatus = async (pingId, newStatus) => {
//     const toastId = toast.loading('Updating ping status...');
//     try {
//       const { error } = await supabase
//         .from('pings')
//         .update({ status: newStatus })
//         .eq('id', pingId);

//       if (error) throw error;

//       setPings(prev => prev.map(ping => ping.id === pingId ? { ...ping, status: newStatus } : ping));
//       toast.success('Status updated successfully', { id: toastId });
//     } catch (error) {
//       toast.error('Failed to update status', { id: toastId });
//       console.error(error);
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case 'pending': return <FiClock className="text-yellow-500" />;
//       case 'accepted': return <FiCheckCircle className="text-green-500" />;
//       case 'completed': return <FiCheckCircle className="text-blue-500" />;
//       default: return <FiClock className="text-gray-500" />;
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'pending': return 'bg-yellow-100 text-yellow-800';
//       case 'accepted': return 'bg-green-100 text-green-800';
//       case 'completed': return 'bg-blue-100 text-blue-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
//     });
//   };

//   const filteredPings = pings.filter(p => filter === 'all' || p.status === filter);

//   return (
//     <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-blue-50 to-indigo-50">
//       <Toaster position="top-right" richColors />
//       <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
//         <div className="flex items-center mb-8">
//           <div className="p-3 rounded-xl bg-white shadow-sm border border-blue-100 mr-4">
//             <FiBell className="text-blue-600 text-2xl" />
//           </div>
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800">Ping Management</h1>
//             <p className="text-gray-500">Track all pings sent to candidates</p>
//           </div>
//         </div>

//         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//           {['Total Pings', 'Pending', 'Accepted', 'Completed'].map((label, idx) => {
//             const status = label.toLowerCase();
//             const count = label === 'Total Pings' ? pings.length : pings.filter(p => p.status === status).length;
//             const iconColor = ['blue', 'yellow', 'green', 'blue'][idx];
//             const Icon = [FiBell, FiClock, FiCheckCircle, FiCheckCircle][idx];

//             return (
//               <div key={label} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
//                 <div className="flex items-center">
//                   <div className={`p-2 rounded-lg bg-${iconColor}-100 mr-3`}>
//                     <Icon className={`text-${iconColor}-600`} />
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">{label}</p>
//                     <p className="text-2xl font-bold text-gray-800">{count}</p>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </motion.div>

//         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
//           <div className="flex items-center justify-between">
//             <h2 className="text-lg font-semibold text-gray-800">Filter Pings</h2>
//             <div className="flex space-x-2">
//               {['all', 'pending', 'accepted', 'completed'].map((status) => (
//                 <button key={status} onClick={() => setFilter(status)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === status ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
//                   {status.charAt(0).toUpperCase() + status.slice(1)}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </motion.div>

//         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//           {isLoading ? (
//             <div className="flex justify-center items-center py-12">
//               <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
//             </div>
//           ) : filteredPings.length === 0 ? (
//             <div className="text-center py-12">
//               <FiBell className="mx-auto text-gray-400 text-4xl mb-4" />
//               <p className="text-gray-500">No pings found</p>
//             </div>
//           ) : (
//             <div className="divide-y divide-gray-100">
//               <AnimatePresence>
//                 {filteredPings.map((ping) => (
//                   <motion.div key={ping.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="p-6 hover:bg-gray-50 transition-colors">
//                     <div className="flex items-start justify-between">
//                       <div className="flex-1">
//                         <div className="flex items-center space-x-3 mb-2">
//                           <div className="p-2 rounded-lg bg-gray-100">
//                             <FiUser className="text-gray-600" />
//                           </div>
//                           <div>
//                             <h3 className="font-semibold text-gray-800">{ping.candidates?.name || 'Unknown Candidate'}</h3>
//                             <p className="text-sm text-gray-500">{ping.candidates?.email || 'No email'}</p>
//                           </div>
//                         </div>
//                         <div className="flex items-center space-x-4 text-sm text-gray-600">
//                           <div className="flex items-center space-x-1">
//                             <FiCalendar className="text-gray-400" />
//                             <span>{formatDate(ping.created_at)}</span>
//                           </div>
//                           {ping.conversation && (
//                             <div className="flex items-center space-x-1">
//                               <FiMessageCircle className="text-gray-400" />
//                               <span>{ping.conversation.length || 0} messages</span>
//                             </div>
//                           )}
//                         </div>

//                         {(ping.status === 'accepted' || ping.status === 'completed') && ping.feedback && (
//                           <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-800">
//                             <p className="font-semibold text-gray-900 mb-1">Interview Feedback Summary</p>
//                             <div className="mb-2"><span className="font-medium">Score:</span> {ping.feedback.score ?? 'N/A'}</div>
//                             <div className="mb-2">
//                               <span className="font-medium">Assessment:</span>
//                               <p className="text-gray-700 mt-1 whitespace-pre-wrap">{ping.feedback.assessment}</p>
//                             </div>
//                             {ping.feedback.strengths?.length > 0 && (
//                               <div className="mb-2">
//                                 <span className="font-medium">Strengths / Notes:</span>
//                                 <ul className="list-disc list-inside mt-1 text-gray-700 space-y-1">
//                                   {ping.feedback.strengths.map((point, i) => (
//                                     <li key={i}>{point}</li>
//                                   ))}
//                                 </ul>
//                               </div>
//                             )}
//                             {ping.feedback.recommendation && (
//                               <div className="mt-2">
//                                 <span className="font-medium">Recommendation:</span> {ping.feedback.recommendation}
//                               </div>
//                             )}
//                           </div>
//                         )}
//                       </div>
//                       <div className="flex items-center space-x-3">
//                         <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ping.status)}`}>
//                           <div className="flex items-center space-x-1">
//                             {getStatusIcon(ping.status)}
//                             <span>{ping.status.charAt(0).toUpperCase() + ping.status.slice(1)}</span>
//                           </div>
//                         </span>
//                         {ping.status === 'pending' && (
//                           <div className="flex space-x-1">
//                             <button onClick={() => updatePingStatus(ping.id, 'accepted')} className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors" title="Mark as accepted">
//                               <FiCheckCircle size={16} />
//                             </button>
//                             <button onClick={() => updatePingStatus(ping.id, 'completed')} className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors" title="Mark as completed">
//                               <FiCheckCircle size={16} />
//                             </button>
//                           </div>
//                         )}
//                         {ping.status === 'accepted' && (
//                           <button onClick={() => updatePingStatus(ping.id, 'completed')} className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors" title="Mark as completed">
//                             <FiCheckCircle size={16} />
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   </motion.div>
//                 ))}
//               </AnimatePresence>
//             </div>
//           )}
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// }



// "use client";

// import { useEffect, useState } from 'react';
// import supabase from '@/lib/supabaseClient';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FiBell, FiClock, FiCheckCircle, FiXCircle, FiUser, FiCalendar, FiMessageCircle } from 'react-icons/fi';
// import { Toaster, toast } from 'react-hot-toast';

// export default function ManagerPingsPage() {
//   const [pings, setPings] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [filter, setFilter] = useState('all');
//   const [expandedPingId, setExpandedPingId] = useState(null);

//   useEffect(() => {
//     fetchPings();
//   }, []);

//   const fetchPings = async () => {
//     setIsLoading(true);
//     try {
//       const { data, error } = await supabase
//         .from('pings')
//         .select(`*, candidates (id, name, email)`) 
//         .order('created_at', { ascending: false });

//       if (error) throw error;
//       setPings(data || []);
//     } catch (error) {
//       toast.error('Failed to load pings');
//       console.error(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const updatePingStatus = async (pingId, newStatus) => {
//     const toastId = toast.loading('Updating ping status...');
//     try {
//       const { error } = await supabase
//         .from('pings')
//         .update({ status: newStatus })
//         .eq('id', pingId);

//       if (error) throw error;

//       setPings(prev => prev.map(ping => ping.id === pingId ? { ...ping, status: newStatus } : ping));
//       toast.success('Status updated successfully', { id: toastId });
//     } catch (error) {
//       toast.error('Failed to update status', { id: toastId });
//       console.error(error);
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case 'pending': return <FiClock className="text-yellow-500" />;
//       case 'accepted': return <FiCheckCircle className="text-green-500" />;
//       case 'completed': return <FiCheckCircle className="text-blue-500" />;
//       default: return <FiClock className="text-gray-500" />;
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'pending': return 'bg-yellow-100 text-yellow-800';
//       case 'accepted': return 'bg-green-100 text-green-800';
//       case 'completed': return 'bg-blue-100 text-blue-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
//     });
//   };

//   const filteredPings = pings.filter(p => filter === 'all' || p.status === filter);

//   return (
//     <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-blue-50 to-indigo-50">
//       <Toaster position="top-right" richColors />
//       <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
//         <div className="flex items-center mb-8">
//           <div className="p-3 rounded-xl bg-white shadow-sm border border-blue-100 mr-4">
//             <FiBell className="text-blue-600 text-2xl" />
//           </div>
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800">Ping Management</h1>
//             <p className="text-gray-500">Track all pings sent to candidates</p>
//           </div>
//         </div>

//         {/* other components unchanged... */}

//         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//           {isLoading ? (
//             <div className="flex justify-center items-center py-12">
//               <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
//             </div>
//           ) : filteredPings.length === 0 ? (
//             <div className="text-center py-12">
//               <FiBell className="mx-auto text-gray-400 text-4xl mb-4" />
//               <p className="text-gray-500">No pings found</p>
//             </div>
//           ) : (
//             <div className="divide-y divide-gray-100">
//               <AnimatePresence>
//                 {filteredPings.map((ping) => (
//                   <motion.div key={ping.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="p-6 hover:bg-gray-50 transition-colors">
//                     <div className="flex items-start justify-between">
//                       <div className="flex-1">
//                         <div className="flex items-center space-x-3 mb-2">
//                           <div className="p-2 rounded-lg bg-gray-100">
//                             <FiUser className="text-gray-600" />
//                           </div>
//                           <div>
//                             <h3 className="font-semibold text-gray-800">{ping.candidates?.name || 'Unknown Candidate'}</h3>
//                             <p className="text-sm text-gray-500">{ping.candidates?.email || 'No email'}</p>
//                           </div>
//                         </div>
//                         <div className="flex items-center space-x-4 text-sm text-gray-600">
//                           <div className="flex items-center space-x-1">
//                             <FiCalendar className="text-gray-400" />
//                             <span>{formatDate(ping.created_at)}</span>
//                           </div>
//                           {ping.conversation && (
//                             <div className="flex items-center space-x-1">
//                               <FiMessageCircle className="text-gray-400" />
//                               <span>{ping.conversation.length || 0} messages</span>
//                             </div>
//                           )}
//                         </div>

//                         {(ping.status === 'accepted' || ping.status === 'completed') && ping.feedback && (
//                           <div className="mt-3">
//                             <button
//                               className="text-sm text-blue-600 underline"
//                               onClick={() => setExpandedPingId(expandedPingId === ping.id ? null : ping.id)}
//                             >
//                               {expandedPingId === ping.id ? 'Hide Feedback' : 'View Feedback'}
//                             </button>

//                             <AnimatePresence>
//                               {expandedPingId === ping.id && (
//                                 <motion.div
//                                   initial={{ opacity: 0, height: 0 }}
//                                   animate={{ opacity: 1, height: 'auto' }}
//                                   exit={{ opacity: 0, height: 0 }}
//                                   transition={{ duration: 0.3 }}
//                                   className="overflow-hidden"
//                                 >
//                                   <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-800">
//                                     <p className="font-semibold text-gray-900 mb-1">Interview Feedback Summary</p>
//                                     <div className="mb-2"><span className="font-medium">Score:</span> {ping.feedback.score ?? 'N/A'}</div>
//                                     <div className="mb-2">
//                                       <span className="font-medium">Assessment:</span>
//                                       <p className="text-gray-700 mt-1 whitespace-pre-wrap">{ping.feedback.assessment}</p>
//                                     </div>
//                                     {ping.feedback.strengths?.length > 0 && (
//                                       <div className="mb-2">
//                                         <span className="font-medium">Strengths / Notes:</span>
//                                         <ul className="list-disc list-inside mt-1 text-gray-700 space-y-1">
//                                           {ping.feedback.strengths.map((point, i) => (
//                                             <li key={i}>{point}</li>
//                                           ))}
//                                         </ul>
//                                       </div>
//                                     )}
//                                     {ping.feedback.recommendation && (
//                                       <div className="mt-2">
//                                         <span className="font-medium">Recommendation:</span> {ping.feedback.recommendation}
//                                       </div>
//                                     )}
//                                   </div>
//                                 </motion.div>
//                               )}
//                             </AnimatePresence>
//                           </div>
//                         )}
//                       </div>
//                       <div className="flex items-center space-x-3">
//                         <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ping.status)}`}>
//                           <div className="flex items-center space-x-1">
//                             {getStatusIcon(ping.status)}
//                             <span>{ping.status.charAt(0).toUpperCase() + ping.status.slice(1)}</span>
//                           </div>
//                         </span>
//                         {ping.status === 'pending' && (
//                           <div className="flex space-x-1">
//                             <button onClick={() => updatePingStatus(ping.id, 'accepted')} className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors" title="Mark as accepted">
//                               <FiCheckCircle size={16} />
//                             </button>
//                             <button onClick={() => updatePingStatus(ping.id, 'completed')} className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors" title="Mark as completed">
//                               <FiCheckCircle size={16} />
//                             </button>
//                           </div>
//                         )}
//                         {ping.status === 'accepted' && (
//                           <button onClick={() => updatePingStatus(ping.id, 'completed')} className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors" title="Mark as completed">
//                             <FiCheckCircle size={16} />
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   </motion.div>
//                 ))}
//               </AnimatePresence>
//             </div>
//           )}
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// }



// 'use client';

// import { useEffect, useState } from 'react';
// import supabase from '@/lib/supabaseClient';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FiBell, FiClock, FiCheckCircle, FiXCircle, FiUser, FiCalendar, FiMessageCircle, FiTrash2 } from 'react-icons/fi';
// import { Toaster, toast } from 'react-hot-toast';

// export default function ManagerPingsPage() {
//   const [pings, setPings] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [filter, setFilter] = useState('all');
//   const [expandedPingId, setExpandedPingId] = useState(null);

//   useEffect(() => {
//     fetchPings();
//   }, []);

//   const fetchPings = async () => {
//     setIsLoading(true);
//     try {
//       const { data, error } = await supabase
//         .from('pings')
//         .select(`*, candidates (id, name, email)`) 
//         .order('created_at', { ascending: false });

//       if (error) throw error;
//       setPings(data || []);
//     } catch (error) {
//       toast.error('Failed to load pings');
//       console.error(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const updatePingStatus = async (pingId, newStatus) => {
//     const toastId = toast.loading('Updating ping status...');
//     try {
//       const { error } = await supabase
//         .from('pings')
//         .update({ status: newStatus })
//         .eq('id', pingId);

//       if (error) throw error;

//       setPings(prev => prev.map(ping => ping.id === pingId ? { ...ping, status: newStatus } : ping));
//       toast.success('Status updated successfully', { id: toastId });
//     } catch (error) {
//       toast.error('Failed to update status', { id: toastId });
//       console.error(error);
//     }
//   };

//   const deletePing = async (pingId) => {
//     const toastId = toast.loading('Deleting ping...');
//     try {
//       const { error } = await supabase
//         .from('pings')
//         .delete()
//         .eq('id', pingId);

//       if (error) throw error;

//       setPings(prev => prev.filter(ping => ping.id !== pingId));
//       toast.success('Ping deleted successfully', { id: toastId });
//     } catch (error) {
//       toast.error('Failed to delete ping', { id: toastId });
//       console.error(error);
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case 'pending': return <FiClock className="text-yellow-500" />;
//       case 'accepted': return <FiCheckCircle className="text-green-500" />;
//       case 'completed': return <FiCheckCircle className="text-blue-500" />;
//       default: return <FiClock className="text-gray-500" />;
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'pending': return 'bg-yellow-100 text-yellow-800';
//       case 'accepted': return 'bg-green-100 text-green-800';
//       case 'completed': return 'bg-blue-100 text-blue-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
//     });
//   };

//   const filteredPings = pings.filter(p => filter === 'all' || p.status === filter);

//   return (
//     <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-blue-50 to-indigo-50">
//       <Toaster position="top-right" richColors />
//       <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
//         <div className="flex items-center mb-8">
//           <div className="p-3 rounded-xl bg-white shadow-sm border border-blue-100 mr-4">
//             <FiBell className="text-blue-600 text-2xl" />
//           </div>
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800">Ping Management</h1>
//             <p className="text-gray-500">Track all pings sent to candidates</p>
//           </div>
//         </div>

//         {/* Filter controls */}
//         <div className="flex space-x-2 mb-6">
//           <button
//             onClick={() => setFilter('all')}
//             className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300'}`}
//           >
//             All Pings
//           </button>
//           <button
//             onClick={() => setFilter('pending')}
//             className={`px-4 py-2 rounded-lg ${filter === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-white border border-gray-300'}`}
//           >
//             Pending
//           </button>
//           <button
//             onClick={() => setFilter('accepted')}
//             className={`px-4 py-2 rounded-lg ${filter === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-white border border-gray-300'}`}
//           >
//             Accepted
//           </button>
//           <button
//             onClick={() => setFilter('completed')}
//             className={`px-4 py-2 rounded-lg ${filter === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-white border border-gray-300'}`}
//           >
//             Completed
//           </button>
//         </div>

//         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//           {isLoading ? (
//             <div className="flex justify-center items-center py-12">
//               <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
//             </div>
//           ) : filteredPings.length === 0 ? (
//             <div className="text-center py-12">
//               <FiBell className="mx-auto text-gray-400 text-4xl mb-4" />
//               <p className="text-gray-500">No pings found</p>
//             </div>
//           ) : (
//             <div className="divide-y divide-gray-100">
//               <AnimatePresence>
//                 {filteredPings.map((ping) => (
//                   <motion.div key={ping.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="p-6 hover:bg-gray-50 transition-colors">
//                     <div className="flex items-start justify-between">
//                       <div className="flex-1">
//                         <div className="flex items-center space-x-3 mb-2">
//                           <div className="p-2 rounded-lg bg-gray-100">
//                             <FiUser className="text-gray-600" />
//                           </div>
//                           <div>
//                             <h3 className="font-semibold text-gray-800">{ping.candidates?.name || 'Unknown Candidate'}</h3>
//                             <p className="text-sm text-gray-500">{ping.candidates?.email || 'No email'}</p>
//                           </div>
//                         </div>
//                         <div className="flex items-center space-x-4 text-sm text-gray-600">
//                           <div className="flex items-center space-x-1">
//                             <FiCalendar className="text-gray-400" />
//                             <span>{formatDate(ping.created_at)}</span>
//                           </div>
//                           {ping.conversation && (
//                             <div className="flex items-center space-x-1">
//                               <FiMessageCircle className="text-gray-400" />
//                               <span>{ping.conversation.length || 0} messages</span>
//                             </div>
//                           )}
//                         </div>

//                         {(ping.status === 'accepted' || ping.status === 'completed') && ping.feedback && (
//                           <div className="mt-3">
//                             <button
//                               className="text-sm text-blue-600 underline"
//                               onClick={() => setExpandedPingId(expandedPingId === ping.id ? null : ping.id)}
//                             >
//                               {expandedPingId === ping.id ? 'Hide Feedback' : 'View Feedback'}
//                             </button>

//                             <AnimatePresence>
//                               {expandedPingId === ping.id && (
//                                 <motion.div
//                                   initial={{ opacity: 0, height: 0 }}
//                                   animate={{ opacity: 1, height: 'auto' }}
//                                   exit={{ opacity: 0, height: 0 }}
//                                   transition={{ duration: 0.3 }}
//                                   className="overflow-hidden"
//                                 >
//                                   <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-800">
//                                     <p className="font-semibold text-gray-900 mb-1">Interview Feedback Summary</p>
//                                     <div className="mb-2"><span className="font-medium">Score:</span> {ping.feedback.score ?? 'N/A'}</div>
//                                     <div className="mb-2">
//                                       <span className="font-medium">Assessment:</span>
//                                       <p className="text-gray-700 mt-1 whitespace-pre-wrap">{ping.feedback.assessment}</p>
//                                     </div>
//                                     {ping.feedback.strengths?.length > 0 && (
//                                       <div className="mb-2">
//                                         <span className="font-medium">Strengths / Notes:</span>
//                                         <ul className="list-disc list-inside mt-1 text-gray-700 space-y-1">
//                                           {ping.feedback.strengths.map((point, i) => (
//                                             <li key={i}>{point}</li>
//                                           ))}
//                                         </ul>
//                                       </div>
//                                     )}
//                                     {ping.feedback.recommendation && (
//                                       <div className="mt-2">
//                                         <span className="font-medium">Recommendation:</span> {ping.feedback.recommendation}
//                                       </div>
//                                     )}
//                                   </div>
//                                 </motion.div>
//                               )}
//                             </AnimatePresence>
//                           </div>
//                         )}
//                       </div>
//                       <div className="flex items-center space-x-3">
//                         <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ping.status)}`}>
//                           <div className="flex items-center space-x-1">
//                             {getStatusIcon(ping.status)}
//                             <span>{ping.status.charAt(0).toUpperCase() + ping.status.slice(1)}</span>
//                           </div>
//                         </span>
//                         <div className="flex space-x-1">
//                           {ping.status === 'pending' && (
//                             <>
//                               <button onClick={() => updatePingStatus(ping.id, 'accepted')} className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors" title="Mark as accepted">
//                                 <FiCheckCircle size={16} />
//                               </button>
//                               <button onClick={() => updatePingStatus(ping.id, 'completed')} className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors" title="Mark as completed">
//                                 <FiCheckCircle size={16} />
//                               </button>
//                             </>
//                           )}
//                           {ping.status === 'accepted' && (
//                             <button onClick={() => updatePingStatus(ping.id, 'completed')} className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors" title="Mark as completed">
//                               <FiCheckCircle size={16} />
//                             </button>
//                           )}
//                           <button 
//                             onClick={() => deletePing(ping.id)} 
//                             className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors" 
//                             title="Delete ping"
//                           >
//                             <FiTrash2 size={16} />
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </motion.div>
//                 ))}
//               </AnimatePresence>
//             </div>
//           )}
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// }


'use client';

import { useEffect, useState } from 'react';
import supabase from '@/lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiClock, FiCheckCircle, FiUser, FiCalendar, FiMessageCircle, FiTrash2, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { Toaster, toast } from 'react-hot-toast';

export default function ManagerPingsPage() {
  const [pings, setPings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expandedPingId, setExpandedPingId] = useState(null);

  useEffect(() => {
    fetchPings();
  }, []);

  const fetchPings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('pings')
        .select(`*, candidates (id, name, email)`) 
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPings(data || []);
    } catch (error) {
      toast.error('Failed to load pings');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Count pings by status
  const pingCounts = {
    all: pings.length,
    pending: pings.filter(p => p.status === 'pending').length,
    accepted: pings.filter(p => p.status === 'accepted').length,
    completed: pings.filter(p => p.status === 'completed').length,
  };

  const updatePingStatus = async (pingId, newStatus) => {
    const toastId = toast.loading('Updating ping status...');
    try {
      const { error } = await supabase
        .from('pings')
        .update({ status: newStatus })
        .eq('id', pingId);

      if (error) throw error;

      setPings(prev => prev.map(ping => ping.id === pingId ? { ...ping, status: newStatus } : ping));
      toast.success('Status updated successfully', { id: toastId });
    } catch (error) {
      toast.error('Failed to update status', { id: toastId });
      console.error(error);
    }
  };

  const deletePing = async (pingId) => {
    const toastId = toast.loading('Deleting ping...');
    try {
      const { error } = await supabase
        .from('pings')
        .delete()
        .eq('id', pingId);

      if (error) throw error;

      setPings(prev => prev.filter(ping => ping.id !== pingId));
      toast.success('Ping deleted successfully', { id: toastId });
    } catch (error) {
      toast.error('Failed to delete ping', { id: toastId });
      console.error(error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FiClock className="text-yellow-500" />;
      case 'accepted': return <FiCheckCircle className="text-green-500" />;
      case 'completed': return <FiCheckCircle className="text-blue-500" />;
      default: return <FiClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const filteredPings = pings.filter(p => filter === 'all' || p.status === filter);

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-blue-50 to-indigo-50">
      <Toaster position="top-right" richColors />
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <div className="p-3 rounded-xl bg-white shadow-sm border border-blue-100 mr-4">
            <FiBell className="text-blue-600 text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Ping Management</h1>
            <p className="text-gray-500">Track all pings sent to candidates</p>
          </div>
        </div>

        {/* Enhanced Filter controls with counts */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
              filter === 'all' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white border border-gray-200 hover:border-blue-300'
            }`}
          >
            <span>All Pings</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              filter === 'all' ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-700'
            }`}>
              {pingCounts.all}
            </span>
          </button>
          
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
              filter === 'pending' 
                ? 'bg-yellow-100 text-yellow-800 shadow-md' 
                : 'bg-white border border-gray-200 hover:border-yellow-300'
            }`}
          >
            <span>Pending</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              filter === 'pending' ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-100 text-gray-700'
            }`}>
              {pingCounts.pending}
            </span>
          </button>
          
          <button
            onClick={() => setFilter('accepted')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
              filter === 'accepted' 
                ? 'bg-green-100 text-green-800 shadow-md' 
                : 'bg-white border border-gray-200 hover:border-green-300'
            }`}
          >
            <span>Accepted</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              filter === 'accepted' ? 'bg-green-200 text-green-800' : 'bg-gray-100 text-gray-700'
            }`}>
              {pingCounts.accepted}
            </span>
          </button>
          
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
              filter === 'completed' 
                ? 'bg-blue-100 text-blue-800 shadow-md' 
                : 'bg-white border border-gray-200 hover:border-blue-300'
            }`}
          >
            <span>Completed</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              filter === 'completed' ? 'bg-blue-200 text-blue-800' : 'bg-gray-100 text-gray-700'
            }`}>
              {pingCounts.completed}
            </span>
          </button>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }} 
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredPings.length === 0 ? (
            <div className="text-center py-12">
              <FiBell className="mx-auto text-gray-400 text-4xl mb-4" />
              <p className="text-gray-500">No pings found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              <AnimatePresence>
                {filteredPings.map((ping) => (
                  <motion.div 
                    key={ping.id} 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0 }} 
                    transition={{ duration: 0.2 }} 
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="p-2 rounded-lg bg-gray-100">
                            <FiUser className="text-gray-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">{ping.candidates?.name || 'Unknown Candidate'}</h3>
                            <p className="text-sm text-gray-500">{ping.candidates?.email || 'No email'}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <FiCalendar className="text-gray-400" />
                            <span>{formatDate(ping.created_at)}</span>
                          </div>
                          {ping.conversation && (
                            <div className="flex items-center space-x-1">
                              <FiMessageCircle className="text-gray-400" />
                              <span>{ping.conversation.length || 0} messages</span>
                            </div>
                          )}
                        </div>

                        {(ping.status === 'accepted' || ping.status === 'completed') && ping.feedback && (
                          <div className="mt-3">
                            <button
                              onClick={() => setExpandedPingId(expandedPingId === ping.id ? null : ping.id)}
                              className="flex items-center space-x-2 px-3 py-1.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                            >
                              {expandedPingId === ping.id ? (
                                <>
                                  <FiChevronUp size={14} />
                                  <span>Hide Feedback</span>
                                </>
                              ) : (
                                <>
                                  <FiChevronDown size={14} />
                                  <span>View Feedback</span>
                                </>
                              )}
                            </button>

                            <AnimatePresence>
                              {expandedPingId === ping.id && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="overflow-hidden"
                                >
                                  <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-800">
                                    <p className="font-semibold text-gray-900 mb-1">Interview Feedback Summary</p>
                                    <div className="mb-2"><span className="font-medium">Score:</span> {ping.feedback.score ?? 'N/A'}</div>
                                    <div className="mb-2">
                                      <span className="font-medium">Assessment:</span>
                                      <p className="text-gray-700 mt-1 whitespace-pre-wrap">{ping.feedback.assessment}</p>
                                    </div>
                                    {ping.feedback.strengths?.length > 0 && (
                                      <div className="mb-2">
                                        <span className="font-medium">Strengths / Notes:</span>
                                        <ul className="list-disc list-inside mt-1 text-gray-700 space-y-1">
                                          {ping.feedback.strengths.map((point, i) => (
                                            <li key={i}>{point}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                    {ping.feedback.recommendation && (
                                      <div className="mt-2">
                                        <span className="font-medium">Recommendation:</span> {ping.feedback.recommendation}
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ping.status)}`}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(ping.status)}
                            <span>{ping.status.charAt(0).toUpperCase() + ping.status.slice(1)}</span>
                          </div>
                        </span>
                        <div className="flex space-x-1">
                          {ping.status === 'pending' && (
                            <>
                              <button 
                                onClick={() => updatePingStatus(ping.id, 'accepted')} 
                                className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors" 
                                title="Mark as accepted"
                              >
                                <FiCheckCircle size={16} />
                              </button>
                              <button 
                                onClick={() => updatePingStatus(ping.id, 'completed')} 
                                className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors" 
                                title="Mark as completed"
                              >
                                <FiCheckCircle size={16} />
                              </button>
                            </>
                          )}
                          {ping.status === 'accepted' && (
                            <button 
                              onClick={() => updatePingStatus(ping.id, 'completed')} 
                              className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors" 
                              title="Mark as completed"
                            >
                              <FiCheckCircle size={16} />
                            </button>
                          )}
                          <button 
                            onClick={() => deletePing(ping.id)} 
                            className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors" 
                            title="Delete ping"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}