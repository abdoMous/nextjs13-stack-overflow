'use client';

import React from 'react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { formUrlQuery } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';

interface Props {
    filters: {
        name: string;
        value: string;
    }[];
    otherClasses?: string;
    containerClasses?: string;
}

const Filter = ({ filters, otherClasses, containerClasses }: Props) => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const paramFilter = searchParams.get('filter');

    const handleUpdateParams = (value: string) => {
        const newUrl = formUrlQuery({
            params: searchParams.toString(),
            key: 'filter',
            value,
        });
        router.push(newUrl, { scroll: false });
    };
    return (
        <div className={`relative ${containerClasses}`}>
            <Select
                onValueChange={handleUpdateParams}
                defaultValue={paramFilter || undefined}>
                <SelectTrigger
                    className={`${otherClasses} body-regular light-border background-light800_dark300 text-dark500_light700 px-5 py-2.5`}>
                    <SelectValue placeholder="Select a Filter" />
                </SelectTrigger>
                <div className="line-clamp-1 flex-1 text-left">
                    <SelectContent>
                        <SelectGroup>
                            {filters.map((filter, index) => (
                                <SelectItem key={index} value={filter.value}>
                                    {filter.name}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </div>
            </Select>
        </div>
    );
};

export default Filter;
