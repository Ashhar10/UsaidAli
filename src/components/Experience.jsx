import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import DrawSVGPlugin from 'gsap/DrawSVGPlugin'
import './Experience.css'

gsap.registerPlugin(ScrollTrigger)

const bullets = [
    'Developed high-quality architectural visualizations for residential and commercial projects',
    'Created photorealistic interior and exterior renders using 3ds Max & Corona Renderer',
    'Collaborated with architects and designers to translate blueprints into stunning 3D visuals',
    'Produced real-time walkthroughs and interactive presentations using Unreal Engine',
    'Managed complete render pipeline from modeling, texturing, lighting to post-production',
]

export default function Experience() {
    const sectionRef = useRef(null)
    const lineRef = useRef(null)
    const itemRef = useRef(null)
    const bulletsRef = useRef([])

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Timeline line grows
            gsap.fromTo(lineRef.current,
                { scaleY: 0, transformOrigin: 'top center' },
                {
                    scaleY: 1, duration: 1.5, ease: 'power2.inOut',
                    scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', end: 'bottom 60%', scrub: 1 }
                }
            )

            // Experience card
            gsap.fromTo(itemRef.current,
                { opacity: 0, x: 50 },
                {
                    opacity: 1, x: 0, duration: 1, ease: 'power3.out',
                    scrollTrigger: { trigger: itemRef.current, start: 'top 80%' }
                }
            )

            // Bullets stagger
            bulletsRef.current.forEach((b, i) => {
                if (!b) return
                gsap.fromTo(b,
                    { opacity: 0, x: 30 },
                    {
                        opacity: 1, x: 0,
                        duration: 0.7,
                        delay: i * 0.12,
                        ease: 'power3.out',
                        scrollTrigger: { trigger: itemRef.current, start: 'top 75%' }
                    }
                )
            })
        }, sectionRef)
        return () => ctx.revert()
    }, [])

    return (
        <section id="experience" ref={sectionRef} className="experience">
            <div className="exp-inner">
                <div className="exp-heading reveal-up">
                    <span className="section-label">Career</span>
                    <h2>Experience</h2>
                </div>

                <div className="timeline">
                    <div className="timeline-line-track">
                        <div ref={lineRef} className="timeline-line" />
                    </div>

                    <div ref={itemRef} className="timeline-item">
                        <div className="timeline-dot" />
                        <div className="timeline-content">
                            <div className="timeline-meta">
                                <span className="timeline-date">Apr 2022 – Present</span>
                                <span className="timeline-company">Elipse Studio, Karachi</span>
                            </div>
                            <h3 className="timeline-role">3D Visualizer</h3>
                            <ul className="timeline-bullets">
                                {bullets.map((b, i) => (
                                    <li key={i} ref={el => bulletsRef.current[i] = el}>{b}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
