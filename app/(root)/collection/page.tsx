import QuestionCard from '@/components/cards/QuestionCard';
import Filter from '@/components/shared/Filter';
import NoResult from '@/components/shared/NoResult';
import LocalSearchbar from '@/components/shared/search/LocalSearchbar';
import { QuestionFilters } from '@/constants/filters';
import { getSavedQuestions } from '@/lib/actions/question.action';
import { SearchParamsProps } from '@/types';
import { auth } from '@clerk/nextjs';
import console from 'console';

export default async function Page({ searchParams }: SearchParamsProps) {
    const { userId } = auth();
    if (!userId) return <div>loading...</div>;
    console.log(`userId`, userId);
    const result = await getSavedQuestions({
        searchQuery: searchParams.q,
        filter: searchParams.filter,
        clerkId: userId,
    });

    console.log(`result`, result);

    return (
        <>
            <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>

            <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
                <LocalSearchbar
                    route="/"
                    iconPosition="left"
                    imgSrc="/assets/icons/search.svg"
                    placeHolder="Search for questions"
                    otherClasses="flex-1"
                />
                <Filter
                    filters={QuestionFilters}
                    otherClasses="min-h-[56px] sm:min-w-[170px]"
                />
            </div>

            <div className="mt-10 flex w-full flex-col gap-6">
                {result.questions.length > 0 ? (
                    result.questions.map((question: any) => (
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
                        title="There is no saved question to show"
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
}
