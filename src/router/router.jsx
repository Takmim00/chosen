import { createBrowserRouter } from "react-router";
import Home from "../components/Home";
import RootLayout from "../layout/RootLayout";
import AiChatbot from "../components/AiChatbot";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "chatbot",
        Component: AiChatbot,
      },
      {
        path: "ai-assistant",
        Component: AiChatbot,
      },
    ],
  },
]);
export default router;
