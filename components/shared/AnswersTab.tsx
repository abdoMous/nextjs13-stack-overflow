import React from "react";
import { SearchParamsProps } from "@/types";
import { getUserAnswers } from "@/lib/actions/answer.action";
import AnswerCard from "../cards/AnswerCard";

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const AnswersTab = async ({ searchParams, userId, clerkId }: Props) => {
  const result = await getUserAnswers({
    userId,
    page: 1,
  });
  return (
    <div>
      {result?.answers.map((answer) => (
        <AnswerCard
          key={answer._id}
          clerkId={clerkId}
          _id={answer._id}
          question={answer.question}
          author={answer.author}
          upvotes={answer.upvotes.lenght}
          createdAt={answer.createdAt}
        />
      ))}
    </div>
  );
};

export default AnswersTab;
