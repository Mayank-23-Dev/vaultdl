import { createHashRouter } from "react-router";
import { DashboardLayout } from "./components/layouts/DashboardLayout";
import { LandingPage } from "./pages/LandingPage";
import { SetupPage } from "./pages/SetupPage";
import { DownloaderPage } from "./pages/DownloaderPage";
import { QueuePage } from "./pages/QueuePage";
import { HistoryPage } from "./pages/HistoryPage";
import { ThumbnailsPage } from "./pages/ThumbnailsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { AttributionsPage } from "./pages/AttributionsPage";

export const router = createHashRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/setup",
    Component: SetupPage,
  },
  {
    path: "/dashboard",
    Component: DashboardLayout,
    children: [
      { index: true, Component: DownloaderPage },
      { path: "queue", Component: QueuePage },
      { path: "history", Component: HistoryPage },
      { path: "thumbnails", Component: ThumbnailsPage },
      { path: "settings", Component: SettingsPage },
      { path: "attributions", Component: AttributionsPage },
    ],
  },
]);
