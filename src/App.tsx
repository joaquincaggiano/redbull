import './App.css'
import { Hero } from './components/Hero'
import { MaxGallery } from './components/MaxGallery'
import { Footer } from './components/Footer'

function App() {
  return (
    <div className="landing">
      <Hero />
      <MaxGallery />
      <Footer />
    </div>
  )
}

export default App
