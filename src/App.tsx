import './App.css'
import { Hero } from './components/Hero'
import { MaxGallery } from './components/MaxGallery'
import { VerstappenTimeline } from './components/VerstappenTimeline'
import { Footer } from './components/Footer'

function App() {
  return (
    <div className="landing">
      <Hero />
      <MaxGallery />
      <VerstappenTimeline />
      <Footer />
    </div>
  )
}

export default App
