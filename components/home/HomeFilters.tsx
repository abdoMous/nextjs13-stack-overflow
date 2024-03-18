'use client';
import { HomePageFilters } from '@/constants/filters';
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils';

const HomeFilters = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [active, setActive] = useState('');

    const handleTypeClicke = (type: string) => {
        if (active === type) {
            setActive('');
            const newUrl = formUrlQuery({
                params: searchParams.toString(),
                key: 'filter',
                value: null,
            });
            router.push(newUrl, { scroll: false });
        } else {
            setActive(type);
            const newUrl = formUrlQuery({
                params: searchParams.toString(),
                key: 'filter',
                value: type.toLowerCase(),
            });
            router.push(newUrl, { scroll: false });
        }
    };

    return (
        <div className="mt-10 hidden flex-wrap gap-3 md:flex">
            {HomePageFilters.map((item) => (
                <Button
                    key={item.value}
                    onClick={() => {
                        handleTypeClicke(item.value);
                    }}
                    className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none
            ${
                active === item.value
                    ? 'bg-primary-100 text-primary-500'
                    : 'bg-light-800 text-light-500 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-300'
            }
          `}>
                    {item.name}
                </Button>
            ))}
        </div>
    );
};

export default HomeFilters;
