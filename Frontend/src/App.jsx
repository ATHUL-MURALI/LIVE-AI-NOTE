import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Common } from "./pages/Common";
import { NotFound } from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Common />} />
        {/* <Route path="/Specific" element={<Specific />} /> */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
