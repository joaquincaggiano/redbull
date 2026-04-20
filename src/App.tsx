import "./App.css";
import { Analytics } from "@vercel/analytics/react";
import {
  Footer,
  Hero,
  MaxGallery,
  VerstappenTimeline,
} from "./components/sections";

function App() {
  return (
    <div className="landing">
      <Hero />
      <MaxGallery />
      <VerstappenTimeline />
      <Footer />
      <Analytics />
    </div>
  );
}

export default App;
