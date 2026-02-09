import { QuestionsAnswers } from "@/components/pages/dashboard/questionsAnswers";
import { useSocket } from "@/context/socketContext";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/_dashboard/dashboard/questions")({
  component: QuestionPage,
});

function QuestionPage() {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.emit("join:questions-feed");

    return () => {
      socket.emit("leave:questions-feed");
    };
  }, [socket]);
  return <QuestionsAnswers />;
}
