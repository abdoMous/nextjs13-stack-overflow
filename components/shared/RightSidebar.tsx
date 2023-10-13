import Link from "next/link";
import React from "react";

const hotQuestions = [
  {
    _id: 1,
    title: "how do I use express as a custom server in NextJS?",
  },
  {
    _id: 2,
    title: "how do I use express as a custom server in NextJS?",
  },
  {
    _id: 3,
    title: "how do I use express as a custom server in NextJS?",
  },
  {
    _id: 4,
    title: "how do I use express as a custom server in NextJS?",
  },
  {
    _id: 5,
    title: "how do I use express as a custom server in NextJS?",
  },
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
              </Link>
            );
          })}
        </div>
      </div>
      <div className="mt-16">test2</div>
    </section>
  );
};

export default RightSidebar;
