import { Layout } from "@/components/Layout";
import Admin from "@/pages/Admin";
import BookDetail from "@/pages/BookDetail";
import Browse from "@/pages/Browse";
import Home from "@/pages/Home";
import Interests from "@/pages/Interests";
import PostBook from "@/pages/PostBook";
import Profile from "@/pages/Profile";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const browseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/browse",
  component: Browse,
});

const bookDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/book/$id",
  component: BookDetail,
});

const postRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/post",
  component: PostBook,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: Profile,
});

const interestsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/interests",
  component: Interests,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: Admin,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  browseRoute,
  bookDetailRoute,
  postRoute,
  profileRoute,
  interestsRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
