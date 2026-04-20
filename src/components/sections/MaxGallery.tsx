import { useEffect } from 'react'
import Lenis from 'lenis'
import { ZoomParallax } from './ui/zoom-parallax'

const MAX_IMAGES = [
    { src: '/img/max/max-1.jpg', alt: 'Max Verstappen – imagen 1' },
    { src: '/img/max/max-2.jpg', alt: 'Max Verstappen – imagen 2' },
    { src: '/img/max/max-3.jpg', alt: 'Max Verstappen – imagen 3' },
    { src: '/img/max/max-4.jpg', alt: 'Max Verstappen – imagen 4' },
    { src: '/img/max/max-5.jpg', alt: 'Max Verstappen – imagen 5' },
    { src: '/img/max/max-6.jpg', alt: 'Max Verstappen – imagen 6' },
    { src: '/img/max/max-7.jpg', alt: 'Max Verstappen – imagen 7' },
]

export function MaxGallery() {
    useEffect(() => {
        const lenis = new Lenis()

        function raf(time: number) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)

        return () => {
            lenis.destroy()
        }
    }, [])

    return (
        <section>
            <div className="relative flex h-[50vh] items-center justify-center bg-[#06060A]">
                <h2
                    className="text-center text-4xl font-bold tracking-widest text-white"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2rem, 6vw, 5rem)' }}
                >
                    MAX VERSTAPPEN
                </h2>
            </div>
            <ZoomParallax images={MAX_IMAGES} />
            <div className="h-[50vh] bg-[#06060A]" />
        </section>
    )
}
