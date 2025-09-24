"use client"; // Directiva para componente de cliente

import type { NextPage } from 'next';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { FaMicrosoft } from 'react-icons/fa';
import { RiVoiceprintFill } from 'react-icons/ri';

const DarkModeSignUp: NextPage = () => {
  // Estado para manejar los valores de los campos del formulario
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Estado para manejar los errores de validación
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Manejador para actualizar el estado cuando el usuario escribe
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Función para validar el formulario
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Validación de Email
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }

    // Validación de Contraseña
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters long';
    }

    // Validación de Confirmar Contraseña
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    // Devuelve true si no hay errores, de lo contrario false
    return Object.keys(newErrors).length === 0;
  };

  // Manejador para el envío del formulario
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      // Si la validación es exitosa, puedes enviar los datos
      console.log('Form submitted successfully:', formData);
      alert('Sign Up Successful!');
    } else {
      console.log('Form validation failed:', errors);
    }
  };


  return (
    <div className="w-full min-h-screen relative bg-[#232323] overflow-hidden text-white font-cabin flex items-center justify-center p-4 sm:p-6">
      {/* Fondo con desenfoque morado AÑADIDO DE VUELTA */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 bg-[rgba(124,1,246,0.4)] w-full h-full rounded-full [filter:blur(600px)]"></div>
      
      <form
        onSubmit={handleSubmit}
        noValidate
        className="relative z-10 w-full max-w-sm flex flex-col items-start gap-5"
      >
        {/* Encabezado */}
        <div className="w-full flex flex-col items-center justify-center gap-5 mb-3 text-4xl">
          <div className="rounded-full bg-white flex w-full items-center justify-center py-3 px-8 gap-3">
            <RiVoiceprintFill size={36} className="text-[#073b4c]" />
            <b className="relative text-2xl md:text-3xl text-[#073b4c]">QuickSpeak</b>
          </div>
          <div className="self-start text-3xl text-white font-bold">
            <h1 className="relative">Sign Up</h1>
          </div>
        </div>

        {/* Campos del formulario */}
        <div className="w-full flex flex-col items-start gap-4 text-black">
          {/* Email */}
          <div className="w-full flex flex-col items-start gap-2.5">
            <label className="rounded-full bg-white text-sm text-[#073b4c] font-bold flex items-center justify-center py-1.5 px-5">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="FulanitoDeTal@example.com"
              className="w-full rounded-full bg-white border-2 border-solid border-gray-400 p-4 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
             {errors.email && <p className="text-red-500 font-bold ml-4 text-sm">{errors.email}</p>}
          </div>
          {/* Password */}
          <div className="w-full flex flex-col items-start gap-2.5">
            <label className="rounded-full bg-white text-sm text-[#073b4c] font-bold flex items-center justify-center py-1.5 px-5">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
              className="w-full rounded-full bg-white border-2 border-solid border-gray-400 p-4 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            {errors.password && <p className="text-red-500 font-bold ml-4 text-sm">{errors.password}</p>}
          </div>
          {/* Confirm Password */}
          <div className="w-full flex flex-col items-start gap-2.5">
            <label className="rounded-full bg-white text-sm text-[#073b4c] font-bold flex items-center justify-center py-1.5 px-5">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="********"
              className="w-full rounded-full bg-white border-2 border-solid border-gray-400 p-4 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            {errors.confirmPassword && <p className="text-red-500 font-bold ml-4 text-sm">{errors.confirmPassword}</p>}
          </div>
        </div>

        {/* Botón de Sign Up y link de Log In */}
        <div className="w-full flex flex-col items-center justify-center gap-3 text-lg mt-3">
          <button type="submit" className="w-full rounded-full bg-[#18D2B4] flex items-center justify-center py-3 px-5 gap-2.5 hover:bg-[#14a892] transition-colors text-[#073b4c] font-extrabold text-xl">
            <b>Sign Up</b>
            <ArrowRight className="w-6 h-6" />
          </button>
          <div className="text-center text-base text-gray-300">
            <b>
              Already a member?{' '}
              <a href="#" className="underline cursor-pointer text-[#18D2B4] hover:text-white">
                Log In
              </a>
            </b>
          </div>
        </div>

        {/* Separador y botones de redes sociales */}
        <div className="w-full flex flex-col items-start gap-4">
          <div className="w-full flex items-center gap-4">
            <div className="flex-1 rounded-full bg-gray-400 h-0.5"></div>
            <div className="text-gray-300 text-sm">
              <b>Or Sign Up With</b>
            </div>
            <div className="flex-1 rounded-full bg-gray-400 h-0.5"></div>
          </div>
          <div className="w-full flex flex-col sm:flex-row justify-center items-center gap-4">
             <button type="button" className="w-full sm:w-auto flex-1 h-16 bg-white rounded-full flex justify-center items-center hover:bg-gray-200 transition-colors ring-4 ring-offset-2 ring-offset-transparent ring-[#3498db]">
              <FcGoogle size={32} />
            </button>
            <button type="button" className="w-full sm:w-auto flex-1 h-16 bg-white rounded-full flex justify-center items-center hover:bg-gray-200 transition-colors ring-4 ring-offset-2 ring-offset-transparent ring-[#e74c3c]">
              <FaMicrosoft size={28} color="#00A4EF" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DarkModeSignUp;