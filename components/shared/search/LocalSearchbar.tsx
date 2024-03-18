'use client';

import { Input } from '@/components/ui/input';
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils';
import Image from 'next/image';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface CustomInputProps {
    route: string;
    iconPosition: 'left' | 'right';
    imgSrc: string;
    placeHolder: string;
    otherClasses?: string;
}

const LocalSearchbar = ({
    route,
    iconPosition,
    imgSrc,
    placeHolder,
    otherClasses,
}: CustomInputProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const query = searchParams.get('q');

    const [search, setSearch] = useState(query || '');

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search) {
                const newUrl = formUrlQuery({
                    params: searchParams.toString(),
                    key: 'q',
                    value: search,
                });
                router.push(newUrl, { scroll: false });
            } else {
                if (pathname === route) {
                    const newUrl = removeKeysFromQuery({
                        params: searchParams.toString(),
                        keysToRemove: ['q'],
                    });
                    router.push(newUrl, { scroll: false });
                }
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [search, route, pathname, route, searchParams, query]);

    return (
        <div
            className={`background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}>
            {iconPosition === 'left' && (
                <Image src={imgSrc} alt="search icon" width={24} height={24} />
            )}

            <Input
                type="text"
                placeholder={placeHolder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="paragraph-regular no-focus placeholder background-light800_darkgradient border-none shadow-none outline-none"
            />
            {iconPosition === 'right' && (
                <Image src={imgSrc} alt="search icon" width={24} height={24} />
            )}
        </div>
    );
};

export default LocalSearchbar;
