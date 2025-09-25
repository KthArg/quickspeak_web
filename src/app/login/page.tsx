"use client";

import type { NextPage } from 'next';
import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { FaMicrosoft } from 'react-icons/fa';
import { RiVoiceprintFill } from 'react-icons/ri';

const SignUpPage: NextPage = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email address is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters long';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted successfully:', formData);
      alert('Sign Up Successful!');
    }
  };

  return (
    <div className={`w-full min-h-screen relative font-cabin flex items-center justify-center p-4 sm:p-6 transition-colors
        ${isDark 
            ? 'bg-gradient-to-b from-[#232323] to-[#2c006e] text-white' 
            : 'bg-gradient-to-b from-white to-purple-200 text-black'}`
    }>
      <div className={`absolute bottom-0 left-0 w-full h-3/4
        ${isDark 
            ? 'bg-gradient-to-t from-purple-500/30 via-transparent to-transparent [filter:blur(100px)]' 
            : 'bg-gradient-to-t from-purple-300/40 via-transparent to-transparent [filter:blur(100px)]'}`
      }></div>

      <ArrowLeft className={`absolute top-6 left-6 md:top-10 md:left-14 w-9 h-9 md:w-11 md:h-11 cursor-pointer z-20 ${isDark ? 'text-white' : 'text-gray-600'}`} />

      <form onSubmit={handleSubmit} noValidate className="relative z-10 w-full max-w-sm flex flex-col items-start gap-5">
        <div className="w-full flex flex-col items-center justify-center gap-5 mb-3">
          <div className={`rounded-full flex items-center justify-center py-3 px-8 gap-3 w-full
            ${isDark ? 'bg-white' : 'bg-black'}`}>
            <RiVoiceprintFill size={36} className={`${isDark ? 'text-[#073b4c]' : 'text-white'}`} />
            <b className={`relative text-2xl md:text-3xl ${isDark ? 'text-[#073b4c]' : 'text-white'}`}>QuickSpeak</b>
          </div>
          <div className={`self-start text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-400'}`}>
            <h1 className="relative">Sign Up</h1>
          </div>
        </div>

        <div className="w-full flex flex-col items-start gap-4">
          <div className="w-full flex flex-col items-start gap-2.5">
            <label className={`rounded-full text-sm font-bold flex items-center justify-center py-1.5 px-5 ${isDark ? 'bg-white text-[#073b4c]' : 'bg-white text-gray-500'}`}>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="FulanitoDeTal@example.com"
              className={`w-full rounded-full p-4 placeholder:text-gray-400 focus:outline-none focus:ring-2 ${isDark ? 'bg-white border-2 border-solid border-gray-400 text-gray-700 focus:ring-cyan-400' : 'bg-white border-2 border-solid border-black text-gray-800 focus:ring-purple-500'}`} />
            {errors.email && <p className="text-red-500 font-bold ml-4 text-sm">{errors.email}</p>}
          </div>
          <div className="w-full flex flex-col items-start gap-2.5">
            <label className={`rounded-full text-sm font-bold flex items-center justify-center py-1.5 px-5 ${isDark ? 'bg-white text-[#073b4c]' : 'bg-white text-gray-500'}`}>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="********"
              className={`w-full rounded-full p-4 placeholder:text-gray-400 focus:outline-none focus:ring-2 ${isDark ? 'bg-white border-2 border-solid border-gray-400 text-gray-700 focus:ring-cyan-400' : 'bg-white border-2 border-solid border-black text-gray-800 focus:ring-purple-500'}`} />
            {errors.password && <p className="text-red-500 font-bold ml-4 text-sm">{errors.password}</p>}
          </div>
          <div className="w-full flex flex-col items-start gap-2.5">
            <label className={`rounded-full text-sm font-bold flex items-center justify-center py-1.5 px-5 ${isDark ? 'bg-white text-[#073b4c]' : 'bg-white text-gray-500'}`}>Confirm Password</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="********"
              className={`w-full rounded-full p-4 placeholder:text-gray-400 focus:outline-none focus:ring-2 ${isDark ? 'bg-white border-2 border-solid border-gray-400 text-gray-700 focus:ring-cyan-400' : 'bg-white border-2 border-solid border-black text-gray-800 focus:ring-purple-500'}`} />
            {errors.confirmPassword && <p className="text-red-500 font-bold ml-4 text-sm">{errors.confirmPassword}</p>}
          </div>
        </div>

        <div className="w-full flex flex-col items-center justify-center gap-3 text-lg mt-3">
          <button type="submit" className={`w-full rounded-full flex items-center justify-center py-3 px-5 gap-2.5 transition-colors font-extrabold text-xl ${isDark ? 'bg-[#18D2B4] text-[#073b4c] hover:bg-[#14a892]' : 'bg-teal-400 text-white hover:bg-teal-500'}`}>
            <b>Sign Up</b>
            <ArrowRight className="w-6 h-6" />
          </button>
          <div className={`text-center text-base ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
            <b>Already a member? <a href="#" className={`underline cursor-pointer ${isDark ? 'text-[#18D2B4] hover:text-white' : 'text-black hover:text-purple-600'}`}>Log In</a></b>
          </div>
        </div>

        <div className="w-full flex flex-col items-start gap-4">
          <div className="w-full flex items-center gap-4">
            <div className={`flex-1 rounded-full h-0.5 ${isDark ? 'bg-gray-400' : 'bg-gray-300'}`}></div>
            <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}><b>Or Sign Up With</b></div>
            <div className={`flex-1 rounded-full h-0.5 ${isDark ? 'bg-gray-400' : 'bg-gray-300'}`}></div>
          </div>
          <div className="w-full flex flex-col sm:flex-row justify-center items-center gap-4">
             <button type="button" className={`w-full sm:w-auto flex-1 h-16 rounded-full flex justify-center items-center transition-colors ring-4 ring-offset-2 
                ${isDark ? 'bg-white hover:bg-gray-200 ring-offset-transparent ring-[#3498db]' : 'bg-white hover:bg-gray-100 ring-offset-purple-200 ring-cyan-400'}`}>
              <FcGoogle size={32} />
            </button>
            <button type="button" className={`w-full sm:w-auto flex-1 h-16 rounded-full flex justify-center items-center transition-colors ring-4 ring-offset-2
                ${isDark ? 'bg-white hover:bg-gray-200 ring-offset-transparent ring-[#e74c3c]' : 'bg-white hover:bg-gray-100 ring-offset-purple-200 ring-red-500'}`}>
              <FaMicrosoft size={28} color="#00A4EF" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignUpPage;