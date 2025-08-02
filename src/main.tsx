import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

import "./index.css";
import Composer from "./pages/Composer.tsx";
import Timeline from "./pages/Timeline.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Timeline />,
  },
  {
    path: "/post",
    element: <Composer />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <hr />
    <div>
      <a href="https://github.com/sodle/fridge-social" target="_blank">
        View Source Code
      </a>
    </div>
  </StrictMode>
);
