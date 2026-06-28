import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';

// Premium Components
import { AnimatedBackground } from '../../components/auth/premium/AnimatedBackground';
import { AIWorkspaceAnimation } from '../../components/auth/premium/AIWorkspaceAnimation';
import { GlassmorphicCard } from '../../components/auth/premium/GlassmorphicCard';
import { FloatingLabelInput } from '../../components/auth/premium/FloatingLabelInput';
import { PremiumButton } from '../../components/auth/premium/PremiumButton';
import { SocialAuthButton } from '../../components/auth/premium/SocialAuthButton';
import { Divider } from '../../components/auth/premium/Divider';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const PremiumLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const emailValue = watch('email') || '';
  const passwordValue = watch('password') || '';

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);
      await login({ email: data.email, password: data.password });
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Failed to sign in. Please check your credentials.';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialAuth = (provider: 'google' | 'github') => {
    window.location.href = `/api/auth/${provider}/login`;
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - AI Workspace Animation (Hidden on mobile) */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="hidden lg:flex lg:w-1/2 xl:w-3/5 items-center justify-center p-8"
        >
          <div className="w-full max-w-2xl">
            <AIWorkspaceAnimation />
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-6 sm:p-8 lg:p-12">
          <div className="w-full max-w-md">
            {/* Logo & Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              {/* Logo */}
              <motion.div
                whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center justify-center w-16 h-16 mb-6 relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-60" />
                <div className="relative w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl sm:text-5xl font-bold mb-3 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent"
              >
                Welcome back
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-gray-400 text-base"
              >
                Sign in to <span className="font-semibold text-white">CodeForge AI</span>
              </motion.p>
            </motion.div>

            {/* Login Card */}
            <GlassmorphicCard className="p-8 group">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Email Input */}
                <FloatingLabelInput
                  id="email"
                  type="email"
                  label="Email address"
                  value={emailValue}
                  error={errors.email?.message}
                  icon={Mail}
                  {...register('email')}
                  autoComplete="email"
                  required
                />

                {/* Password Input */}
                <FloatingLabelInput
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  value={passwordValue}
                  error={errors.password?.message}
                  icon={Lock}
                  rightIcon={
                    <motion.button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </motion.button>
                  }
                  {...register('password')}
                  autoComplete="current-password"
                  required
                />

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <motion.label
                    whileHover={{ x: 2 }}
                    className="flex items-center gap-2 cursor-pointer group/checkbox"
                  >
                    <input
                      {...register('rememberMe')}
                      type="checkbox"
                      className="w-4 h-4 rounded bg-gray-800 border-2 border-gray-600 text-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 focus:ring-offset-gray-900 transition-all cursor-pointer"
                    />
                    <span className="text-sm text-gray-400 group-hover/checkbox:text-gray-300 transition-colors">
                      Remember me
                    </span>
                  </motion.label>

                  <Link
                    to="/auth/forgot-password"
                    className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors relative group/link"
                  >
                    <span>Forgot password?</span>
                    <motion.span
                      className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-400 group-hover/link:w-full transition-all duration-300"
                    />
                  </Link>
                </div>

                {/* Submit Button */}
                <PremiumButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  icon={!isSubmitting ? ArrowRight : undefined}
                >
                  {isSubmitting ? 'Signing in...' : 'Sign in'}
                </PremiumButton>

                {/* Divider */}
                <Divider text="or continue with" />

                {/* Social Auth Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <SocialAuthButton
                    provider="google"
                    onClick={() => handleSocialAuth('google')}
                    disabled={isSubmitting}
                  />
                  <SocialAuthButton
                    provider="github"
                    onClick={() => handleSocialAuth('github')}
                    disabled={isSubmitting}
                  />
                </div>
              </form>
            </GlassmorphicCard>

            {/* Sign Up Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-6"
            >
              <p className="text-gray-400 text-sm">
                Don't have an account?{' '}
                <Link
                  to="/auth/register"
                  className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors relative group/signup"
                >
                  <span>Create account</span>
                  <motion.span
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-400 group-hover/signup:w-full transition-all duration-300"
                  />
                </Link>
              </p>
            </motion.div>

            {/* Footer Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center mt-8 space-x-4 text-xs text-gray-500"
            >
              <a href="#" className="hover:text-gray-400 transition-colors">
                Terms
              </a>
              <span>•</span>
              <a href="#" className="hover:text-gray-400 transition-colors">
                Privacy
              </a>
              <span>•</span>
              <a href="#" className="hover:text-gray-400 transition-colors">
                Help
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-indigo-400/20 rounded-full"
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 100 - 50, 0],
            opacity: [0, 0.5, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            delay: i * 0.2,
            ease: 'easeInOut',
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
};
