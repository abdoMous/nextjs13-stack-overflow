import QuestionCard from '@/components/cards/QuestionCard';
import Filter from '@/components/shared/Filter';
import NoResult from '@/components/shared/NoResult';
import LocalSearchbar from '@/components/shared/search/LocalSearchbar';
import { IQuestion } from '@/database/question.model';
import {
    getQuestionById,
    getQuestionsByTagId,
} from '@/lib/actions/question.action';
import { URLProps } from '@/types';
import React from 'react';

const Page = async ({ params, searchParams }: URLProps) => {
    const result = await getQuestionsByTagId({
        tagId: params.id,
        page: 1,
        searchQuery: searchParams.q,
    });

    console.log('result tags', result);

    return (
        <>
            <h1 className="h1-bold text-dark100_light900">{result.tagTitle}</h1>

            <div className="mt-11 w-full">
                <LocalSearchbar
                    route={`/tags/${params.id}`}
                    iconPosition="left"
                    imgSrc="/assets/icons/search.svg"
                    placeHolder="Search tag questions"
                    otherClasses="flex-1"
                />
            </div>

            <div className="mt-10 flex w-full flex-col gap-6">
                {result.questions.length > 0 ? (
                    result.questions.map((question: IQuestion) => (
                        <QuestionCard
                            key={question._id}
                            _id={question._id}
                            title={question.title}
                            tags={question.tags}
                            auther={question.author}
                            upvotes={question.upvotes}
                            views={question.views}
                            answers={question.answers}
                            createdAt={new Date(question.createdAt)}
                        />
                    ))
                ) : (
                    <NoResult
                        title="There is no tag question to show"
                        description="Be the first to break the silence! Ask a question and kickstart the
        discussion. Your query could be the next big thing others learn from.
        Get involved!💡"
                        link="/ask-question"
                        linkTitle="Ask a Question"
                    />
                )}
            </div>
        </>
    );
};

export default Page;
