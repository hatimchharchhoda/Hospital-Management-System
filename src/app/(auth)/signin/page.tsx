'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { getSession, signIn } from 'next-auth/react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { signInSchema } from '@/schemas/signInSchema';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function SignInForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const { toast } = useToast();

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    const result = await signIn('credentials', {
      redirect: false,
      email: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      toast({
        title: 'Login Failed',
        description:
          result.error === 'CredentialsSignin'
            ? 'Incorrect username or password'
            : result.error,
        variant: 'destructive',
      });
      setIsSubmitting(false);
    } else {
      router.replace('/Home');
    }

    const session = await getSession();
    if (session) {
      localStorage.setItem('session', JSON.stringify(session));
    }

    router.refresh();
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#F5F9FF] via-[#E8F0F7] to-[#D0E3F7] px-6"
      aria-label="Sign in page background"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-md p-8 space-y-8 bg-white/70 backdrop-blur-sm border border-[#2E86AB] rounded-2xl shadow-lg"
      >
        <div className="text-center">
          <h1
            className="text-3xl md:text-4xl font-semibold text-[#1C1F26] mb-1 select-none"
            aria-label="Welcome to MediConnect"
          >
            Welcome to MediConnect
          </h1>
          <p className="text-sm md:text-base text-[#517D9B] font-medium tracking-wide select-none">
            Connect. Express. Stay Updated.
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
            noValidate
          >
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-[#517D9B] font-medium">
                    Email or Username
                  </FormLabel>
                  <Input
                    {...field}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 border border-[#76C7C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#76C7C0] focus:border-transparent transition-all duration-300"
                    aria-required="true"
                  />
                  <FormMessage className="text-sm text-red-600" />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-[#517D9B] font-medium">
                    Password
                  </FormLabel>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      {...field}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 pr-10 border border-[#76C7C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#76C7C0] focus:border-transparent transition-all duration-300"
                      aria-required="true"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute inset-y-0 right-3 flex items-center text-[#517D9B] hover:text-[#2E86AB] transition-colors duration-300 focus:outline-none"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <FormMessage className="text-sm text-red-600" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#2E86AB] hover:bg-[#256d8c] text-white py-3 rounded-xl font-semibold tracking-wide shadow-md transition-transform duration-300 hover:scale-105 focus:ring-4 focus:ring-offset-2 focus:ring-[#2E86AB]"
              aria-live="polite"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="inline mr-2 h-5 w-5 animate-spin" />
                  Please wait...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm text-[#517D9B] font-medium">
          Not a member yet?{' '}
          <Link
            href="/signup"
            className="text-[#76C7C0] hover:underline hover:text-[#2E86AB]"
          >
            Sign up
          </Link>
        </div>
      </motion.div>
    </div>
  );
}