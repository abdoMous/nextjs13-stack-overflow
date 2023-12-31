"use server";

import Answer from "@/database/answer.model";
import { CreateAnswerParams, GetAnswersParams } from "./shared.types";
import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import { revalidatePath } from "next/cache";

export async function createAnswer(params: CreateAnswerParams) {
  try {
    connectToDatabase();
    const { content, author, question, path } = params;
    console.log("createing answer params", params);

    const answer = await Answer.create({
      content,
      author,
      question,
    });

    // const answer = new Answer({
    //   content,
    //   author,
    //   question,
    // });
    // console.log({ answer });

    await Question.findByIdAndUpdate(question, {
      $push: { answers: answer._id },
    });

    // TODO: add interaction ...

    revalidatePath(path);
  } catch (error) {
    console.error(error);
  }
}

export async function getAnswers(params: GetAnswersParams) {
  try {
    connectToDatabase();
    const { questionId } = params;
    const answers = await Answer.find({ question: questionId })
      .populate("auther", "_id clerkId name picture")
      .sort({ createdAt: -1 });
    return answers;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
