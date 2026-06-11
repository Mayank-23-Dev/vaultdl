import { RouterProvider } from "react-router";
import { router } from "./routes";
import { QueueProvider } from "./lib/QueueContext";

export default function App() {
  return (
    <QueueProvider>
      <RouterProvider router={router} />
    </QueueProvider>
  );
}