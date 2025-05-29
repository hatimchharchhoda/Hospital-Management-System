'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDebounceCallback } from 'usehooks-ts';
import { ApiResponse } from '@/types/ApiResponse';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import axios, { AxiosError } from 'axios';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/signUpSchema';
import { motion } from 'framer-motion';

export default function SignUpForm() {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const debounced = useDebounceCallback(setUsername, 600);

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      hospitalName: '',
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage('');
        try {
          const response = await axios.get<ApiResponse>(
            `/api/check-username-unique?username=${username}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? 'Error checking username'
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/signup', data);
      toast({
        title: 'Success',
        description: response.data.message,
      });
      router.replace('/signin');
      setIsSubmitting(false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data.message ||
        'There was a problem with your sign-up. Please try again.';
      toast({
        title: 'Sign Up Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#F5F9FF] via-[#E9F2FA] to-[#D6E9FC] px-4"
    >
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="relative w-full max-w-md p-6 md:p-8 space-y-8 bg-white shadow-lg border border-[#D0E4F7] rounded-2xl backdrop-blur-sm"
      >
        <div className="text-center">
          <motion.h1
            className="text-2xl md:text-3xl font-semibold text-[#1C1F26] tracking-wide mb-2"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            MediConnect
          </motion.h1>
          <p className="text-base text-[#2E86AB]">
            Create your account to manage hospital operations seamlessly
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-muted-foreground">
                    Username
                  </FormLabel>
                  <Input
                    {...field}
                    placeholder="john_doe"
                    onChange={(e) => {
                      field.onChange(e);
                      debounced(e.target.value);
                    }}
                    className="w-full px-4 py-2 rounded-2xl border border-[#76C7C0] focus:outline-none focus:ring-2 focus:ring-[#2E86AB] transition duration-300 ease-in-out"
                  />
                  {isCheckingUsername && (
                    <Loader2 className="animate-spin mt-1 text-[#76C7C0]" />
                  )}
                  {!isCheckingUsername && usernameMessage && (
                    <p
                      className={`mt-1 text-sm transition-colors duration-300 ${
                        usernameMessage === 'Username is unique'
                          ? 'text-green-600'
                          : 'text-yellow-600'
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="hospitalName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-muted-foreground">
                    Hospital Name
                  </FormLabel>
                  <Input
                    {...field}
                    placeholder="City Health Hospital"
                    className="w-full px-4 py-2 rounded-2xl border border-[#76C7C0] focus:outline-none focus:ring-2 focus:ring-[#2E86AB] transition duration-300 ease-in-out"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-muted-foreground">
                    Email
                  </FormLabel>
                  <Input
                    {...field}
                    placeholder="you@example.com"
                    className="w-full px-4 py-2 rounded-2xl border border-[#76C7C0] focus:outline-none focus:ring-2 focus:ring-[#2E86AB] transition duration-300 ease-in-out"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-muted-foreground">
                    Password
                  </FormLabel>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      {...field}
                      placeholder="••••••••"
                      className="w-full px-4 py-2 rounded-2xl border border-[#76C7C0] focus:outline-none focus:ring-2 focus:ring-[#2E86AB] transition duration-300 ease-in-out"
                    />
                    <div
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-[#2E86AB] hover:text-[#76C7C0] transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') setShowPassword((prev) => !prev);
                      }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: '0 0 8px #76C7C0' }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Button
                type="submit"
                className="w-full bg-[#2E86AB] hover:bg-[#247799] text-white py-3 rounded-2xl font-semibold transition-shadow focus:ring-4 focus:ring-offset-2 focus:ring-[#76C7C0]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin inline-block" />
                    Please wait
                  </>
                ) : (
                  'Sign Up'
                )}
              </Button>
            </motion.div>
          </form>
        </Form>

        <div className="text-center mt-6">
          <p className="text-base text-[#1C1F26]">
            Already a member?{' '}
            <Link
              href="/signin"
              className="text-[#76C7C0] hover:underline focus:outline-none focus:ring-2 focus:ring-[#F4D35E]"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}