'use client';

import React, { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ProfileSchema } from '@/lib/validations';
import { updateUser } from '@/lib/actions/user.action';
import { usePathname, useRouter } from 'next/navigation';

interface Props {
    clerkId: string;
    user: string;
}
const Profile = ({ clerkId, user }: Props) => {
    const parsedUser = JSON.parse(user);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    // 1. Define your form.
    const form = useForm<z.infer<typeof ProfileSchema>>({
        resolver: zodResolver(ProfileSchema),
        defaultValues: {
            name: parsedUser.name || '',
            username: parsedUser.username || '',
            portfolioWebsite: parsedUser.portfolioWebsite || '',
            location: parsedUser.location || '',
            bio: parsedUser.bio || '',
        },
    });

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof ProfileSchema>) {
        setIsSubmitting(true);
        try {
            await updateUser({
                clerkId,
                updateData: values,
                path: pathname,
            });

            router.back();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-9 flex w-full flex-col gap-9">
                {/* Name Field */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="space-y-3.5">
                            <FormLabel>
                                Name <span className="text-primary-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border"
                                    placeholder="Your name"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* username Field */}
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem className="space-y-3.5">
                            <FormLabel>
                                Username{' '}
                                <span className="text-primary-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border"
                                    placeholder="Your username"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* profolio website field */}
                <FormField
                    control={form.control}
                    name="portfolioWebsite"
                    render={({ field }) => (
                        <FormItem className="space-y-3.5">
                            <FormLabel>Portfolio Link</FormLabel>
                            <FormControl>
                                <Input
                                    type="url"
                                    className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border"
                                    placeholder="Your Portfolio Url"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* location field */}
                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem className="space-y-3.5">
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                                <Input
                                    className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border"
                                    placeholder="Where are you from"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* location field */}
                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem className="space-y-3.5">
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                                <Textarea
                                    className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border"
                                    placeholder="What's special about you?"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="mt-7 flex justify-end">
                    <Button
                        type="submit"
                        className="primary-gradient w-fit"
                        disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save'}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default Profile;
