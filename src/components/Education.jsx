import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import './Education.css'

gsap.registerPlugin(ScrollTrigger)

export default function Education() {
    const sectionRef = useRef(null)
    const cardRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(cardRef.current,
                { opacity: 0, y: 60 },
                {
                    opacity: 1, y: 0, duration: 1, ease: 'power3.out',
                    scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' }
                }
            )
        }, sectionRef)
        return () => ctx.revert()
    }, [])

    return (
        <section id="education" ref={sectionRef} className="education">
            <div className="edu-inner">
                <div className="edu-label">
                    <span className="section-label">Academic Background</span>
                    <h2>Education</h2>
                </div>

                <div ref={cardRef} className="edu-card">
                    <div className="edu-icon">
                        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 4L38 14L20 24L2 14L20 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                            <path d="M2 14V26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M8 17V30C8 30 12 36 20 36C28 36 32 30 32 30V17" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className="edu-content">
                        <div className="edu-degree">Diploma of Civil Engineering</div>
                        <div className="edu-school">Hasani College of Technology</div>
                        <div className="edu-years">2022 – 2025</div>
                        <p className="edu-desc">
                            Comprehensive civil engineering education spanning design theory, spatial planning,
                            structural systems, and digital visualization. Built a strong foundation in
                            both design aesthetics and technical precision.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
