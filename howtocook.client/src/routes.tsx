import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from "./routes/index";
import AboutPage from "./routes/about";
import RootLayout from "./routes/__layout";
import CategoryDetailsPage from "./routes/category/[id]";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="category">
            <Route path=":id" element={<CategoryDetailsPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
