import * as z from 'zod';

export const QuestionSchema = z.object({
    title: z.string().min(5).max(130),
    explanation: z.string().min(100),
    tags: z.array(z.string().min(1).max(25)).min(1).max(5),
});

export const AnswerSchema = z.object({
    answer: z.string().min(100),
});

export const ProfileSchema = z.object({
    name: z.string().min(3).max(50),
    username: z.string().min(3).max(50),
    portfolioWebsite: z.string().url().optional(),
    location: z.string().min(3).max(50),
    bio: z.string().min(100),
});
