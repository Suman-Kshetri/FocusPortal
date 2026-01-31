import { QuestionCard } from "./questionCard";

const mockQuestions = [
  {
    id: "1",
    title: "How does MongoDB indexing work?",
    content: "I'm trying to optimize my MongoDB queries and I've heard that indexing can help. Can someone explain how indexing works in MongoDB and what are the best practices for creating indexes?",
    category: "Databases",
    tags: ["mongodb", "database", "indexing", "performance"],
    images: [],
    author: {
      name: "Alex Johnson",
      avatar: "",
    },
    createdAt: "2 hours ago",
    likes: 24,
    dislikes: 2,
    commentsCount: 8,
  },
  {
    id: "2",
    title: "React useEffect cleanup function not working",
    content: "I have a React component where I'm setting up a WebSocket connection in useEffect. The cleanup function should close the connection when the component unmounts, but it's not being called. Here's my code:\n\nuseEffect(() => {\n  const ws = new WebSocket('ws://localhost:8080');\n  return () => ws.close();\n}, []);\n\nWhat am I doing wrong?",
    category: "Frontend",
    tags: ["react", "hooks", "useEffect", "websocket"],
    images: ["https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80"],
    author: {
      name: "Sarah Chen",
      avatar: "",
    },
    createdAt: "5 hours ago",
    likes: 45,
    dislikes: 3,
    commentsCount: 12,
  },
  {
    id: "3",
    title: "Best practices for Docker multi-stage builds?",
    content: "I'm working on optimizing our Docker images and want to implement multi-stage builds. What are the best practices and common pitfalls to avoid?",
    category: "DevOps",
    tags: ["docker", "devops", "containers"],
    images: [
      "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&q=80",
      "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&q=80"
    ],
    author: {
      name: "Mike Rodriguez",
      avatar: "",
    },
    createdAt: "1 day ago",
    likes: 67,
    dislikes: 5,
    commentsCount: 23,
  },
];

export const QuestionsFeed = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-4 py-6">
      
      {mockQuestions.map((question) => (
        <QuestionCard key={question.id} question={question} />
      ))}
    </div>
  );
};