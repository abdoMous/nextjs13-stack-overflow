import React from "react";
import { TabsContent } from "../ui/tabs";
interface Props {
  value: string;
}
const QuestionTabContent = ({ value }: Props) => {
  return (
    <TabsContent value={value}>Make changes to your account here.</TabsContent>
  );
};

export default QuestionTabContent;
