import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import ErrorPage from "./pages/Error";
import Navbar from "./components/Navbar";
import MainPage from "./pages/MainPage";
import WritePage, { action as writeAction } from "./pages/WritePage";
import Template from "./components/Template";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Navbar />} errorElement={<ErrorPage />}>
      <Route index element={<HomePage />} />
      <Route path="main" element={<MainPage />} />
      <Route path="write" element={<WritePage />} action={writeAction} />
      <Route path="blog" element={<Template />} /> {/* Blog list page */}
    </Route>
  )
);

export default function App() {
  return <RouterProvider router={router} fallbackElement={<ErrorPage />} />;
}
