import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import './Skills.css'

gsap.registerPlugin(ScrollTrigger)

const skills = [
    { icon: '⬡', title: '3D Modeling', desc: 'Precision mesh creation for architectural and interior spaces' },
    { icon: '◈', title: 'Texturing', desc: 'Photorealistic PBR materials and surface detailing' },
    { icon: '◉', title: 'Lighting & Rendering', desc: 'Corona Renderer lighting setups with cinematic quality' },
    { icon: '▣', title: 'Architectural Viz', desc: 'End-to-end visualization pipeline from concept to final render' },
    { icon: '◫', title: 'Post Processing', desc: 'Color grading and compositing in Photoshop & After Effects' },
]

const software = [
    { name: '3ds Max', level: 95 },
    { name: 'Corona Renderer', level: 90 },
    { name: 'Unreal Engine', level: 75 },
    { name: 'Photoshop', level: 85 },
]

export default function Skills() {
    const sectionRef = useRef(null)
    const headingRef = useRef(null)
    const cardsRef = useRef([])
    const barRefs = useRef([])

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(headingRef.current,
                { opacity: 0, y: 50 },
                {
                    opacity: 1, y: 0, duration: 1, ease: 'power3.out',
                    scrollTrigger: { trigger: headingRef.current, start: 'top 80%' }
                }
            )

            cardsRef.current.forEach((card, i) => {
                if (!card) return
                gsap.fromTo(card,
                    { opacity: 0, y: 60 },
                    {
                        opacity: 1, y: 0, duration: 0.8, delay: i * 0.1, ease: 'power3.out',
                        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' }
                    }
                )
            })

            // Progress bars
            barRefs.current.forEach((bar, i) => {
                if (!bar) return
                gsap.fromTo(bar,
                    { width: '0%' },
                    {
                        width: software[i].level + '%',
                        duration: 1.5,
                        delay: i * 0.15,
                        ease: 'power3.out',
                        scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' }
                    }
                )
            })
        }, sectionRef)
        return () => ctx.revert()
    }, [])

    const handleTilt = (e, card) => {
        const rect = card.getBoundingClientRect()
        const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
        const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)
        card.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-6px)`
    }

    const resetTilt = (card) => {
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)'
    }

    return (
        <section id="skills" ref={sectionRef} className="skills">
            <div className="skills-inner">
                <div ref={headingRef} className="skills-heading">
                    <span className="section-label">Expertise</span>
                    <h2>Skills & <em>Tools</em></h2>
                </div>

                <div className="skills-grid">
                    {skills.map((skill, i) => (
                        <div
                            key={i}
                            ref={el => cardsRef.current[i] = el}
                            className="skill-card"
                            onMouseMove={(e) => handleTilt(e, e.currentTarget)}
                            onMouseLeave={(e) => resetTilt(e.currentTarget)}
                        >
                            <div className="skill-icon">{skill.icon}</div>
                            <h3 className="skill-title">{skill.title}</h3>
                            <p className="skill-desc">{skill.desc}</p>
                            <div className="skill-glow" />
                        </div>
                    ))}
                </div>

                <div className="software-section">
                    <h3 className="software-heading">Software Proficiency</h3>
                    <div className="software-list">
                        {software.map((sw, i) => (
                            <div key={i} className="software-item">
                                <div className="sw-header">
                                    <span className="sw-name">{sw.name}</span>
                                    <span className="sw-level">{sw.level}%</span>
                                </div>
                                <div className="sw-track">
                                    <div ref={el => barRefs.current[i] = el} className="sw-bar" style={{ width: 0 }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
