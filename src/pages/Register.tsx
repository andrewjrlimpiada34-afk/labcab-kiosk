import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { db } from '../lib/firebase';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Check, AlertCircle, QrCode } from 'lucide-react';
import PINPad from '../components/PINPad';
import LoadingOverlay from '../components/LoadingOverlay';
import { QRCodeSVG } from 'qrcode.react';

const Register: React.FC = () => {
  const { setView } = useApp();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    fullname: '',
    studentID: '',
    course: '',
    yearLevel: '1st Year',
    email: '',
    contactNumber: '',
  });
  
  const [pin, setPin] = useState('');
  const [registeredUser, setRegisteredUser] = useState<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateStep1 = () => {
    if (!formData.fullname || !formData.studentID || !formData.email || !formData.course) {
      setError('Please fill in all required fields.');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async () => {
    if (!db) {
      setError('Firebase not configured. Please check .env.local (VITE_FIREBASE_*).');
      return;
    }
    setLoading(true);
    setError(null);
    try {

      // Check if student ID already exists
      const q = query(collection(db, 'users'), where('studentID', '==', formData.studentID));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        setError('This Student ID is already registered.');
        setLoading(false);
        setStep(1);
        return;
      }

      const userData = {
        ...formData,
        pin,
        qrCode: formData.studentID, // Use student ID as the QR data
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'users'), userData);
      setRegisteredUser({ ...userData, id: docRef.id });
      setStep(3); // Success step
    } catch (err: any) {
      console.error(err);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto">
      <LoadingOverlay isVisible={loading} message="Creating your account..." />
      
      <div className="w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] border border-slate-200">
        {/* Left Side Info */}
        <div className="md:w-1/3 bg-slate-900 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full translate-x-12 -translate-y-12"></div>
          <div className="relative z-10">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => step === 1 ? setView('home') : setStep(prev => prev - 1)}
              className="p-3 bg-white/10 rounded-2xl mb-8 hover:bg-white/20 transition-colors"
            >
              <ArrowLeft size={24} />
            </motion.button>
            <h2 className="text-4xl font-extrabold mb-4 tracking-tight">Registration</h2>
            <p className="text-slate-400 text-lg leading-relaxed font-medium">Join LabCab to start borrowing laboratory apparatus with ease.</p>
          </div>
          
          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-colors ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-500'}`}>1</div>
              <span className={`font-bold tracking-tight uppercase text-xs ${step >= 1 ? 'text-white' : 'text-slate-500'}`}>Student Info</span>
            </div>
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-colors ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-500'}`}>2</div>
              <span className={`font-bold tracking-tight uppercase text-xs ${step >= 2 ? 'text-white' : 'text-slate-500'}`}>Security PIN</span>
            </div>
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-colors ${step >= 3 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-500'}`}>3</div>
              <span className={`font-bold tracking-tight uppercase text-xs ${step >= 3 ? 'text-white' : 'text-slate-500'}`}>Confirmation</span>
            </div>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="md:w-2/3 p-12 flex flex-col bg-white">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1"
              >
                <div className="mb-8">
                  <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Student Information</h3>
                  <p className="text-slate-500 font-medium">Provide your official university details.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">Full Name *</label>
                    <input 
                      type="text" name="fullname" value={formData.fullname} onChange={handleInputChange}
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-semibold text-slate-800"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">Student ID *</label>
                    <input 
                      type="text" name="studentID" value={formData.studentID} onChange={handleInputChange}
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-semibold text-slate-800"
                      placeholder="XXXX-XXXX"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">Course *</label>
                    <input 
                      type="text" name="course" value={formData.course} onChange={handleInputChange}
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-semibold text-slate-800"
                      placeholder="BS in Biology"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">Year Level</label>
                    <select 
                      name="yearLevel" value={formData.yearLevel} onChange={handleInputChange}
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-semibold text-slate-800 appearance-none"
                    >
                      <option>1st Year</option>
                      <option>2nd Year</option>
                      <option>3rd Year</option>
                      <option>4th Year</option>
                      <option>5th Year+</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">Email *</label>
                    <input 
                      type="email" name="email" value={formData.email} onChange={handleInputChange}
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-semibold text-slate-800"
                      placeholder="student@univ.edu"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">Contact Number</label>
                    <input 
                      type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange}
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-semibold text-slate-800"
                      placeholder="09XXXXXXXX"
                    />
                  </div>
                </div>

                {error && (
                  <div className="mt-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl flex items-center gap-3 animate-shake font-bold text-sm">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                  </div>
                )}

                <div className="mt-10 flex justify-end">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => validateStep1() && setStep(2)}
                    className="px-10 py-4 gradient-blue text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 transition-all hover:translate-x-1"
                  >
                    Continue
                  </motion.button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col items-center"
              >
                <div className="text-center mb-8 w-full">
                  <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Create Security PIN</h3>
                  <p className="text-slate-500 font-medium">Choose a 6-digit PIN for quick access at the kiosk.</p>
                </div>

                <PINPad 
                  value={pin} 
                  onChange={setPin} 
                  maxLength={6} 
                  onComplete={handleSubmit}
                />

                {error && (
                  <div className="mt-8 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl flex items-center gap-3 font-bold text-sm">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                  </div>
                )}

                <div className="mt-12 flex justify-between w-full">
                  <button 
                    onClick={() => setStep(1)}
                    className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                  >
                    Back
                  </button>
                  <motion.button
                    disabled={pin.length < 6}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmit}
                    className="px-10 py-4 gradient-blue text-white rounded-2xl font-black text-lg shadow-xl disabled:opacity-50 disabled:grayscale transition-all"
                  >
                    Complete Registration
                  </motion.button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center py-4"
              >
                <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <Check size={48} strokeWidth={3} />
                </div>
                <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Registration Successful!</h3>
                <p className="text-lg text-slate-500 mb-10 font-bold">Your account has been created. Here is your unique QR ID card.</p>
                
                <div className="p-10 bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl mb-12 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-indigo-50/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <QRCodeSVG 
                    value={registeredUser?.qrCode} 
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                  <div className="mt-6 flex flex-col items-center">
                    <span className="text-2xl font-black tracking-[0.2em] text-slate-900 uppercase leading-none">{registeredUser?.studentID}</span>
                    <span className="text-[10px] font-black text-indigo-600 tracking-widest uppercase mt-2">LabCab Student ID</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.print()}
                    className="flex items-center justify-center gap-3 px-8 py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-slate-800 transition-colors"
                  >
                    <QrCode size={20} />
                    Print QR ID
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setView('home')}
                    className="flex items-center justify-center gap-3 px-8 py-5 gradient-blue text-white rounded-2xl font-black text-lg shadow-xl"
                  >
                    Go to Home
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Register;
