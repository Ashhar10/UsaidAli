import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import './About.css'

gsap.registerPlugin(ScrollTrigger)

const counters = [
    { label: 'Years Experience', value: 2, suffix: '+' },
    { label: 'Projects Completed', value: 50, suffix: '+' },
    { label: 'Renders Delivered', value: 100, suffix: '+' },
]

export default function About() {
    const sectionRef = useRef(null)
    const textRef = useRef(null)
    const imageRef = useRef(null)
    const countersRef = useRef([])

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Text slide from left
            gsap.fromTo(textRef.current,
                { opacity: 0, x: -80 },
                {
                    opacity: 1, x: 0, duration: 1.2, ease: 'power3.out',
                    scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' }
                }
            )
            // Shape slide from right
            gsap.fromTo(imageRef.current,
                { opacity: 0, x: 80 },
                {
                    opacity: 1, x: 0, duration: 1.2, ease: 'power3.out',
                    scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' }
                }
            )

            // Animated counters
            countersRef.current.forEach((el, i) => {
                if (!el) return
                const num = el.querySelector('.counter-num')
                gsap.fromTo({ val: 0 }, { val: counters[i].value },
                    {
                        duration: 1.8,
                        ease: 'power2.out',
                        onUpdate: function () { num.textContent = Math.round(this.targets()[0].val) },
                        scrollTrigger: { trigger: el, start: 'top 85%' }
                    }
                )
                gsap.fromTo(el,
                    { opacity: 0, y: 40 },
                    {
                        opacity: 1, y: 0, duration: 0.8, delay: i * 0.15, ease: 'power3.out',
                        scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' }
                    }
                )
            })
        }, sectionRef)
        return () => ctx.revert()
    }, [])

    return (
        <section id="about" ref={sectionRef} className="about">
            <div className="about-inner">
                <div ref={textRef} className="about-text">
                    <span className="section-label">About Me</span>
                    <h2 className="about-heading">
                        Crafting Spaces <em>That Tell Stories</em>
                    </h2>
                    <p className="about-desc">
                        Creative and detail-oriented 3D Visualizer with 2+ years of experience specializing
                        in high-quality architectural visualizations and photorealistic renderings using
                        <strong> 3ds Max</strong>, <strong>Corona Renderer</strong>, and <strong>Unreal Engine</strong>.
                        Every project is an opportunity to merge technical precision with artistic vision —
                        transforming concepts into immersive visual experiences.
                    </p>

                    <div className="counters">
                        {counters.map((c, i) => (
                            <div key={i} ref={el => countersRef.current[i] = el} className="counter-item">
                                <div className="counter-value">
                                    <span className="counter-num">0</span>
                                    <span className="counter-suffix">{c.suffix}</span>
                                </div>
                                <div className="counter-label">{c.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div ref={imageRef} className="about-visual">
                    <div className="about-shape-outer">
                        <div className="about-shape-inner">
                            <div className="about-initials">U.A</div>
                            <div className="about-role">3D Visualizer</div>
                        </div>
                        <div className="about-ring" />
                        <div className="about-ring ring2" />
                    </div>
                    <div className="about-tag tag1">3ds Max</div>
                    <div className="about-tag tag2">Corona Renderer</div>
                    <div className="about-tag tag3">Unreal Engine</div>
                </div>
            </div>
        </section>
    )
}
