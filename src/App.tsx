import "./App.css";
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
    </div>
  );
}

export default App;
