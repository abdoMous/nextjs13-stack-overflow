'use server';

import User from '@/database/user.model';
import { connectToDatabase } from '../mongoose';
import {
    CreateUserParams,
    DeleteUserParams,
    GetAllUsersParams,
    GetUserByIdParams,
    ToggleSaveQuestionParams,
    UpdateUserParams,
} from './shared.types';
import { revalidatePath } from 'next/cache';
import Question from '@/database/question.model';
import { FilterQuery } from 'mongoose';

export async function getUserById(params: any) {
    try {
        connectToDatabase();
        const { userId } = params;
        console.log(`userId: ${userId}`);
        const user = await User.findOne({ clerkId: userId });
        return user;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function createUser(params: CreateUserParams) {
    try {
        connectToDatabase();
        const newUser = await User.create(params);
        return newUser;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function updateUser(params: UpdateUserParams) {
    try {
        connectToDatabase();

        const { clerkId, updateData, path } = params;

        await User.findOneAndUpdate({ clerkId }, updateData, { new: true });

        revalidatePath(path);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function deleterUser(params: DeleteUserParams) {
    try {
        connectToDatabase();

        const { clerkId } = params;

        const user = await User.findOneAndDelete({ clerkId });

        if (!user) {
            throw new Error('User not found');
        }

        // delete user from database, questions, answers, comments, etc.

        // get user questions ads
        // const userQuestions =
        await Question.find({ author: user._id }).distinct('_id');

        await Question.deleteMany({ author: user._id });

        // TODO: delete user answers, comments, etc.

        return user;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getAllUsers(params: GetAllUsersParams) {
    try {
        connectToDatabase();
        // const { page = 1, pageSize = 20, filter, searchQuery } = params;
        const { searchQuery, filter } = params;
        const query: FilterQuery<typeof User> = {};
        if (searchQuery) {
            query.$or = [
                { name: { $regex: new RegExp(searchQuery, 'i') } },
                { username: { $regex: new RegExp(searchQuery, 'i') } },
                { bio: { $regex: new RegExp(searchQuery, 'i') } },
                { location: { $regex: new RegExp(searchQuery, 'i') } },
                { protfolioWebsite: { $regex: new RegExp(searchQuery, 'i') } },
            ];
        }

        let sortOption = {};
        console.log(`filter: ${filter}`);
        switch (filter) {
            case 'new_users':
                sortOption = { joinedAt: -1 };
                break;
            case 'old_users':
                sortOption = { joinedAt: 1 };
                break;
            case 'top_contributors':
                sortOption = { reputation: -1 };
                break;
            default:
                sortOption = { joinedAt: -1 };
                break;
        }

        const users = await User.find(query).sort(sortOption);
        return { users };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
    try {
        connectToDatabase();
        const { userId, questionId, path } = params;
        const user = await User.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        const isQuestionSaved = user.saved.includes(questionId);
        if (isQuestionSaved) {
            await User.findByIdAndUpdate(userId, {
                $pull: { saved: questionId },
            });
        } else {
            await User.findByIdAndUpdate(
                userId,
                {
                    $addToSet: { saved: questionId },
                },
                { new: true }
            );
        }

        revalidatePath(path);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getUserInfo(params: GetUserByIdParams) {
    try {
        connectToDatabase();
        const { userId } = params;

        const user = await User.findOne({ clerkId: userId });
        if (!user) {
            throw new Error('User not found');
        }

        const totalQuestions = await Question.countDocuments({
            author: user._id,
        });
        const totalAnswers = await Question.countDocuments({
            author: user._id,
        });
        return { user, totalQuestions, totalAnswers };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// export async function getAllUsers(params: GetAllUsersParams) {
//   try {
//     connectToDatabase();
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// }
