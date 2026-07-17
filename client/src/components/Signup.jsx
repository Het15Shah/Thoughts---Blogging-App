import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../store/authSlice';
import { Button, Input, Logo } from './index';
import { useDispatch } from 'react-redux';
import authService from '../appwrite/auth';
import { useForm } from 'react-hook-form';

function Signup() {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [serverError, setServerError] = useState('');

  const onSubmit = async (data) => {
    setServerError('');
    try {
      const response = await authService.createAccount(data);
      if (response) {
        const userData = await authService.getCurrentUser();
        if (userData) {
          dispatch(login({ userData }));
          navigate('/');
        }
      }
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen px-4 pt-[72px] bg-gray-50/50 -mt-[72px]">
      
      {/* Curvy Wave Header */}
      <div className="absolute top-0 left-0 w-full bg-brand-purple pt-[120px] pb-24 overflow-hidden z-0">
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform translate-y-[1px]">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px] md:h-[70px]">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.06,158.51,122.5,224.89,105.5Z" fill="#F9FAFB"></path>
          </svg>
        </div>
      </div>

      <div className="w-full max-w-md animate-fade-in-up relative z-10">

        {/* Card */}
        <div className="p-8 sm:p-10">

          {/* Logo + heading */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 mb-4 rounded-2xl bg-brand-purple/10 flex items-center justify-center shadow-sm">
              <Logo className="w-9 h-9" />
            </div>
            <h1 className="text-2xl font-black text-brand-dark tracking-tight">Create your account</h1>
            <p className="text-sm text-gray-500 font-semibold mt-1">
              Already a member?&nbsp;
              <Link to="/login" className="text-brand-purple hover:text-purple-700 transition-colors underline underline-offset-2">
                Sign in
              </Link>
            </p>
          </div>

          {/* Server error */}
          {serverError && (
            <div className="mb-6 flex items-center gap-2 p-3.5 bg-red-50 border border-red-100 rounded-xl text-sm font-bold text-red-600">
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {serverError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <Input
              label="Full name"
              type="text"
              placeholder="Jane Doe"
              error={errors.name?.message}
              {...register('name', { required: 'Name is required' })}
            />
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
                  message: 'Please enter a valid email',
                },
              })}
            />
            <Input
              label="Password"
              type="password"
              placeholder="At least 8 characters"
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Password must be at least 8 characters' },
              })}
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Creating account…' : 'Create account'}
              </Button>
            </div>

            <p className="text-center text-xs text-gray-400 font-medium">
              By signing up you agree to our&nbsp;
              <span className="text-brand-purple cursor-pointer hover:underline">Terms of Service</span>.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
