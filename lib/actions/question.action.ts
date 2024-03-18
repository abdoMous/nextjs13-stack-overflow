'use server';

import Question from '@/database/question.model';
import { connectToDatabase } from '../mongoose';
import Tag, { ITag } from '@/database/tag.model';
import {
    CreateQuestionParams,
    DeleteQuestionParams,
    EditQuestionParams,
    GetQuestionByIdParams,
    GetQuestionsByTagIdParams,
    GetQuestionsParams,
    GetSavedQuestionsParams,
    GetUserStatsParams,
    QuestionVoteParams,
} from './shared.types';
import User from '@/database/user.model';
import { revalidatePath } from 'next/cache';
import { FilterQuery } from 'mongoose';
import Answer from '@/database/answer.model';
import Interaction from '@/database/interaction.model';
import { title } from 'process';

export async function getQuestions(params: GetQuestionsParams) {
    // const { page = 1, pageSize = 10, searchQuery = "", filter = "" } = params;
    try {
        const { searchQuery, filter } = params;
        const query: FilterQuery<typeof Question> = {};
        if (searchQuery) {
            query.$or = [
                { title: { $regex: new RegExp(searchQuery, 'i') } },
                { content: { $regex: new RegExp(searchQuery, 'i') } },
            ];
        }

        let sortOption = {};
        switch (filter) {
            case 'newest':
                sortOption = { createdAt: -1 };
                break;
            // case 'recommended':
            //     break;
            case 'frequent':
                sortOption = { views: -1 };
                break;
            case 'unanswered':
                query.answers = { $size: 0 };
                break;

            default:
                break;
        }

        connectToDatabase();
        const questions = await Question.find(query)
            .maxTimeMS(100000)
            .populate({ path: 'tags', model: Tag })
            .populate({ path: 'author', model: User })
            .sort(sortOption);

        return questions;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
    // const { page = 1, pageSize = 10, searchQuery = "", filter = "" } = params;
    try {
        connectToDatabase();

        const {
            clerkId,
            // page = 1,
            // pageSize = 10,
            filter,
            searchQuery,
        } = params;

        const query: FilterQuery<typeof Question> = searchQuery
            ? { title: { $regex: new RegExp(searchQuery, 'i') } }
            : {};

        let sortOption = {};
        switch (filter) {
            case 'most_recent':
                sortOption = { createAt: -1 };
                break;
            case 'oldest':
                sortOption = { createAt: 1 };
                break;
            case 'most_voted':
                sortOption = { upvotes: -1 };
                break;
            case 'most_viewed':
                sortOption = { views: -1 };
                break;
            case 'most_answered':
                sortOption = { answers: -1 };
                break;
            default:
                sortOption = { createAt: -1 };
                break;
        }

        const user = await User.findOne({ clerkId }).populate({
            path: 'saved',
            match: query,
            options: {
                sort: sortOption,
            },
            populate: [
                { path: 'tags', model: Tag, select: '_id name' },
                {
                    path: 'author',
                    model: User,
                    select: '_id clerkId name picture',
                },
            ],
        });

        if (!user) {
            throw new Error('User not found');
        }

        return { questions: user.saved };
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function createQuestion(params: CreateQuestionParams) {
    try {
        connectToDatabase();
        const { title, content, tags, author, path } = params;

        // Create the question
        const question = await Question.create({
            title,
            content,
            author,
        });

        const tagDocuments = [];

        for (const tag of tags) {
            const existingTag = await Tag.findOneAndUpdate(
                { name: { $regex: new RegExp(`^${tag}$`, 'i') } },
                {
                    $setOnInsert: { name: tag },
                    $push: { questions: question._id },
                },
                { upsert: true, new: true }
            );

            tagDocuments.push(existingTag._id);
        }

        await Question.findByIdAndUpdate(question._id, {
            $push: { tags: { $each: tagDocuments } },
        });

        // Create an interaction record for the users's ask_question action
        // Increment author's  reputation by +5 for creating a question

        revalidatePath(path);
    } catch (error) {
        console.log(error);
    }
}

export async function getQuestionById(params: GetQuestionByIdParams) {
    try {
        connectToDatabase();
        const question = await Question.findById(params.questionId)
            .maxTimeMS(100000)
            .populate({ path: 'tags', model: Tag, select: '_id name' })
            .populate({
                path: 'author',
                model: User,
                select: '_id clerkId name picture',
            });

        return question;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function voteQuestion(params: QuestionVoteParams) {
    try {
        connectToDatabase();

        const { questionId, userId, voteType, hasupVoted, hasdownVoted, path } =
            params;
        let updateQuery = {};

        if (voteType === 'upvote') {
            if (hasupVoted) {
                updateQuery = { $pull: { upvotes: userId } };
            } else if (hasdownVoted) {
                updateQuery = {
                    $pull: { downvotes: userId },
                    $push: { upvotes: userId },
                };
            } else {
                updateQuery = { $addToSet: { upvotes: userId } };
            }
        } else if (voteType === 'downvote') {
            if (hasdownVoted) {
                updateQuery = { $pull: { downvotes: userId } };
            } else if (hasupVoted) {
                updateQuery = {
                    $pull: { upvotes: userId },
                    $push: { downvotes: userId },
                };
            } else {
                updateQuery = { $addToSet: { downvotes: userId } };
            }
        }

        const question = await Question.findByIdAndUpdate(
            questionId,
            updateQuery,
            {
                new: true,
            }
        );

        if (!question) {
            throw new Error('Question not found');
        }
        // todo increment author's reputation
        revalidatePath(path);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
    try {
        connectToDatabase();
        const { tagId, page = 1, pageSize = 10, searchQuery } = params;
        const tagFilter: FilterQuery<ITag> = { _id: tagId };

        const tag = await Tag.findOne(tagFilter).populate({
            path: 'questions',
            model: Question,
            match: searchQuery
                ? { title: { $regex: new RegExp(searchQuery, 'i') } }
                : {},
            options: {
                sort: { createdAt: -1 },
            },
            populate: [
                { path: 'tags', model: Tag, select: '_id name' },
                {
                    path: 'author',
                    model: User,
                    select: '_id clerkId name picture',
                },
            ],
        });

        if (!tag) {
            throw new Error('Tag not found');
        }

        return { tagTitle: tag.name, questions: tag.questions };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getUserQuestions(params: GetUserStatsParams) {
    try {
        connectToDatabase();

        const { userId, page = 1, pageSize = 10 } = params;
        const totalQuestions = await Question.countDocuments({
            author: userId,
        });
        const userQuestions = await Question.find({ author: userId })
            .sort({
                views: -1,
                upvotes: -1,
            })
            .populate('tags', '_id name')
            .populate('author', '_id clerkId name picture');

        return { totalQuestions, questions: userQuestions };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
    try {
        connectToDatabase();
        const { questionId, path } = params;

        await Question.findByIdAndDelete(questionId);
        await Answer.deleteMany({ question: questionId });
        await Interaction.deleteMany({ question: questionId });
        await Tag.updateMany(
            { questions: questionId },
            { $pull: { questions: questionId } }
        );

        revalidatePath(path);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function editQuestion(params: EditQuestionParams) {
    try {
        connectToDatabase();

        const { questionId, title, content, path } = params;

        const question = await Question.findByIdAndUpdate(questionId).populate({
            path: 'tags',
            model: Tag,
        });

        if (!question) {
            throw new Error('Question not found');
        }

        question.title = title;
        question.content = content;

        await question.save();

        revalidatePath(path);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getHotQuestions() {
    try {
        connectToDatabase();

        const hotQuestions = await Question.find({})
            .sort({ views: -1, upvotes: -1 }) // decending order
            .limit(5);

        return hotQuestions;
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
