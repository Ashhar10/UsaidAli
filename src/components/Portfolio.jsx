import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import portfolioData from '../data/portfolioData.json'
import './Portfolio.css'

gsap.registerPlugin(ScrollTrigger)

export default function Portfolio() {
    const sectionRef = useRef(null)
    const headingRef = useRef(null)
    const itemsRef = useRef([])
    const [activeProject, setActiveProject] = useState(null)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const modalRef = useRef(null)
    const overlayRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(headingRef.current,
                { opacity: 0, y: 50 },
                {
                    opacity: 1, y: 0, duration: 1, ease: 'power3.out',
                    scrollTrigger: { trigger: headingRef.current, start: 'top 80%' }
                }
            )

            itemsRef.current.forEach((item, i) => {
                if (!item) return
                gsap.fromTo(item,
                    { opacity: 0, y: 70 },
                    {
                        opacity: 1, y: 0, duration: 0.9, delay: (i % 3) * 0.15, ease: 'power3.out',
                        scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' }
                    }
                )
            })
        }, sectionRef)
        return () => ctx.revert()
    }, [])

    const openProject = (project) => {
        setActiveProject(project)
        setCurrentImageIndex(0)
        setTimeout(() => {
            if (overlayRef.current && modalRef.current) {
                gsap.fromTo(overlayRef.current,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.4, ease: 'power2.out' }
                )
                gsap.fromTo(modalRef.current,
                    { opacity: 0, y: 60, scale: 0.96 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' }
                )
            }
        }, 10)
    }

    const closeProject = () => {
        if (overlayRef.current && modalRef.current) {
            gsap.to(modalRef.current, { opacity: 0, y: 40, duration: 0.35, ease: 'power2.in' })
            gsap.to(overlayRef.current, {
                opacity: 0, duration: 0.35, delay: 0.15,
                onComplete: () => {
                    setActiveProject(null)
                    setCurrentImageIndex(0)
                }
            })
        } else {
            setActiveProject(null)
            setCurrentImageIndex(0)
        }
    }

    const nextImage = (e) => {
        e.stopPropagation();
        if (activeProject && activeProject.images.length > 0) {
            setCurrentImageIndex((prev) => (prev + 1) % activeProject.images.length)
        }
    }

    const prevImage = (e) => {
        e.stopPropagation();
        if (activeProject && activeProject.images.length > 0) {
            setCurrentImageIndex((prev) => (prev === 0 ? activeProject.images.length - 1 : prev - 1))
        }
    }

    return (
        <section id="portfolio" ref={sectionRef} className="portfolio">
            <div className="portfolio-inner">
                <div ref={headingRef} className="portfolio-heading">
                    <span className="section-label">Selected Work</span>
                    <h2>Portfolio</h2>
                </div>

                <div className="portfolio-grid">
                    {portfolioData.filter(p => p.images && p.images.length > 0).map((project, i) => (
                        <div
                            key={project.id}
                            ref={el => itemsRef.current[i] = el}
                            className="portfolio-item"
                            onClick={() => openProject(project)}
                            style={{ '--accent': project.color }}
                        >
                            <div className="portfolio-thumb" style={{
                                background: `linear-gradient(135deg, ${project.color}88, ${project.accent}88), url(${project.images[0]}) center/cover no-repeat`
                            }}>
                                <div className="portfolio-art">
                                    <div className="art-line" />
                                    <div className="art-box" />
                                    <div className="art-circle" />
                                </div>
                                <div className="portfolio-category-badge">{project.category}</div>
                            </div>
                            <div className="portfolio-info">
                                <h3>{project.title}</h3>
                                <div className="portfolio-tags">
                                    {project.software.map(s => <span key={s} className="tag">{s}</span>)}
                                </div>
                                <div className="portfolio-cta">View Project →</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Project Modal */}
            {activeProject && (
                <div ref={overlayRef} className="modal-overlay" onClick={closeProject}>
                    <div ref={modalRef} className="modal" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeProject}>✕</button>
                        <div
                            className="modal-hero"
                            style={{ background: `linear-gradient(135deg, ${activeProject.color}, ${activeProject.accent})` }}
                        >
                            <div className="modal-art">
                                <div className="art-line" />
                                <div className="art-box" />
                                <div className="art-circle" />
                                <div className="art-line2" />
                            </div>
                            <div className="modal-hero-title">
                                <span className="modal-category">{activeProject.category}</span>
                                <h2>{activeProject.title}</h2>
                            </div>
                        </div>
                        <div className="modal-body">
                            <div className="modal-slideshow">
                                {activeProject.images.length > 1 && (
                                    <button className="slider-btn prev-btn" onClick={prevImage}>❮</button>
                                )}
                                <div className="slideshow-image-container">
                                    <img
                                        src={activeProject.images[currentImageIndex]}
                                        alt={`${activeProject.title} slide ${currentImageIndex + 1}`}
                                        className="slideshow-image"
                                    />
                                </div>
                                {activeProject.images.length > 1 && (
                                    <button className="slider-btn next-btn" onClick={nextImage}>❯</button>
                                )}
                                {activeProject.images.length > 1 && (
                                    <div className="slideshow-dots">
                                        {activeProject.images.map((_, idx) => (
                                            <span
                                                key={idx}
                                                className={`dot ${idx === currentImageIndex ? 'active' : ''}`}
                                                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="modal-tags">
                                {activeProject.software.map(s => (
                                    <span key={s} className="modal-tag">{s}</span>
                                ))}
                            </div>
                            <p className="modal-desc">{activeProject.desc}</p>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}
