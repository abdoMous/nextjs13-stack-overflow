'use server';

import User from '@/database/user.model';
import { connectToDatabase } from '../mongoose';
import { GetAllTagsParams, GetTopInteractedTagsParams } from './shared.types';
import Tag from '@/database/tag.model';

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
    try {
        connectToDatabase();
        const { userId } = params;
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // find interaction for the user and group by tag

        return [
            { _id: '1', name: 'tag1' },
            { _id: '2', name: 'tag2' },
            { _id: '3', name: 'tag3' },
        ];
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getAllTags(params: GetAllTagsParams) {
    try {
        connectToDatabase();

        const tags = await Tag.find({});
        return { tags };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getPopularTags() {
    try {
        connectToDatabase();

        const tags = await Tag.aggregate([
            {
                $project: {
                    name: 1,
                    numberOfQuestions: { $size: '$questions' },
                },
            },
            {
                $sort: { numberOfQuestions: -1 },
            },
            {
                $limit: 5,
            },
        ]);
        return tags;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
