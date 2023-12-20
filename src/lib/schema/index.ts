import { IVisibility } from '@/types';
import { z } from 'zod';

export const SignupFormSchema = z
  .object({
    name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
    email: z.string().email({ message: 'Invalid email address' }),
    alias: z
      .string()
      .min(3, { message: 'Alias must be at least 3 characters' })
      .refine((alias) => !alias.includes(' '), {
        message: 'Alias must not contain spaces'
      }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    passwordConfirmation: z.string().min(6, { message: 'Confirm password must be at least 6 characters' })
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation']
  });

export const SigninFormSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password must not be empty' })
});

export const PostFormSchema = z.object({
  content: z
    .string()
    .min(5, { message: 'Content must be at least 5 characters' })
    .max(1000, { message: 'Content must be at most 1000 characters' }),
  image: z.custom<File>().refine((image) => image.name !== '', { message: 'Select one image' }),
  location: z.string().min(1, { message: 'Select your location' }),
  visibility: z.custom<IVisibility>(),
  tags: z
    .string()
    .min(1, { message: 'Tags must not be empty' })
    .refine(
      (tags) =>
        !tags.includes('.') ||
        !tags.includes('!') ||
        !tags.includes('?') ||
        !tags.includes(':') ||
        !tags.includes(';') ||
        !tags.includes("'") ||
        !tags.includes('"') ||
        !tags.includes('[') ||
        !tags.includes(']') ||
        !tags.includes('{') ||
        !tags.includes('}') ||
        !tags.includes('(') ||
        !tags.includes(')') ||
        !tags.includes('<') ||
        !tags.includes('>') ||
        !tags.includes('/'),
      {
        message: 'Tag must not contain special characters'
      }
    )
});

export const UpdateUserSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  bio: z.string().min(5, { message: 'Bio must be at least 5 characters' }),
  alias: z.string().min(3, { message: 'Alias must be at least 3 characters' }),
  image: z.custom<File>()
});

export const CommentSchema = z.object({
  content: z.string().min(1, { message: 'Comment must not be empty' })
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  code: z.string()
});

export const ResetPasswordSchema = z
  .object({
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    passwordConfirmation: z.string().min(6, { message: 'Confirm password must be at least 6 characters' })
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation']
  });
