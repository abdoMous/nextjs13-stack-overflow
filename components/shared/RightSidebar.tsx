import Image from "next/image";
import Link from "next/link";
import React from "react";
import RenderTag from "./RenderTag";

const hotQuestions = [
  {
    _id: "1",
    title: "how do I use express as a custom server in NextJS?",
  },
  {
    _id: "2",
    title: "how do I use express as a custom server in NextJS?",
  },
  {
    _id: "3",
    title: "how do I use express as a custom server in NextJS?",
  },
  {
    _id: "4",
    title: "how do I use express as a custom server in NextJS?",
  },
  {
    _id: "5",
    title: "how do I use express as a custom server in NextJS?",
  },
];

const popularTags = [
  { _id: "1", name: "javascript", totalQuestions: 5 },
  { _id: "2", name: "react", totalQuestions: 2 },
  { _id: "3", name: "next", totalQuestions: 4 },
  { _id: "4", name: "mongo", totalQuestions: 6 },
  { _id: "5", name: "android", totalQuestions: 1 },
];

const RightSidebar = () => {
  return (
    <section className="background-light900_dark200 light-border custom-scrollbar sticky left-0 top-0 flex h-screen flex-col justify-between overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]">
      <div className="">
        <h3 className="h3-bold text-dark200_light900">Top Question</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {hotQuestions.map((question) => {
            return (
              <Link
                href="/"
                key={question._id}
                className="flex cursor-pointer items-center justify-between gap-7">
                <p className="body-medium text-dark500_light700 ">
                  {question.title}
                </p>
                <Image
                  src="/assets/icons/chevron-right.svg"
                  alt="chevron right"
                  width={20}
                  height={20}
                  className="invert-colors"
                />
              </Link>
            );
          })}
        </div>
      </div>
      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
        <div className="mt-7 flex flex-col gap-4">
          {popularTags.map((tag) => (
            <RenderTag
              key={tag._id}
              _id={tag._id}
              name={tag.name}
              totalQuestions={tag.totalQuestions}
              showCount
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
