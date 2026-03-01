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
    const [imageLoaded, setImageLoaded] = useState(false)
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

    // Lock/unlock body scroll when modal opens/closes
    useEffect(() => {
        if (activeProject) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [activeProject])

    const openProject = (project) => {
        setActiveProject(project)
        setCurrentImageIndex(0)
        setImageLoaded(false)
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
                    setImageLoaded(false)
                }
            })
        } else {
            setActiveProject(null)
            setCurrentImageIndex(0)
            setImageLoaded(false)
        }
    }

    const nextImage = (e) => {
        e.stopPropagation();
        if (activeProject && activeProject.images.length > 0) {
            setImageLoaded(false)
            setCurrentImageIndex((prev) => (prev + 1) % activeProject.images.length)
        }
    }

    const prevImage = (e) => {
        e.stopPropagation();
        if (activeProject && activeProject.images.length > 0) {
            setImageLoaded(false)
            setCurrentImageIndex((prev) => (prev === 0 ? activeProject.images.length - 1 : prev - 1))
        }
    }

    // Keyboard navigation
    useEffect(() => {
        if (!activeProject) return
        const handleKey = (e) => {
            if (e.key === 'Escape') closeProject()
            if (e.key === 'ArrowRight') nextImage(e)
            if (e.key === 'ArrowLeft') prevImage(e)
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [activeProject])

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
                            <div className="portfolio-thumb">
                                <img
                                    src={project.images[0]}
                                    alt={project.title}
                                    className="portfolio-thumb-img"
                                    loading="lazy"
                                />
                                <div className="portfolio-thumb-overlay" style={{
                                    background: `linear-gradient(180deg, transparent 30%, ${project.color}ee 100%)`
                                }} />
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

                        {/* Hero with actual render image */}
                        <div className="modal-hero">
                            <img
                                src={activeProject.images[0]}
                                alt={activeProject.title}
                                className="modal-hero-bg"
                            />
                            <div className="modal-hero-gradient" style={{
                                background: `linear-gradient(180deg, transparent 10%, ${activeProject.color}cc 60%, ${activeProject.accent} 100%)`
                            }} />
                            <div className="modal-hero-title">
                                <span className="modal-category">{activeProject.category}</span>
                                <h2>{activeProject.title}</h2>
                                <div className="modal-hero-meta">
                                    {activeProject.software.map(s => (
                                        <span key={s} className="modal-hero-tag">{s}</span>
                                    ))}
                                    <span className="modal-hero-count">{activeProject.images.length} Render{activeProject.images.length > 1 ? 's' : ''}</span>
                                </div>
                            </div>
                        </div>

                        {/* Slideshow body */}
                        <div className="modal-body">
                            <p className="modal-desc">{activeProject.desc}</p>

                            <div className="modal-slideshow">
                                {activeProject.images.length > 1 && (
                                    <button className="slider-btn prev-btn" onClick={prevImage}>❮</button>
                                )}
                                <div className="slideshow-image-container">
                                    {!imageLoaded && (
                                        <div className="slideshow-loader">
                                            <div className="loader-spinner" />
                                        </div>
                                    )}
                                    <img
                                        src={activeProject.images[currentImageIndex]}
                                        alt={`${activeProject.title} render ${currentImageIndex + 1}`}
                                        className={`slideshow-image ${imageLoaded ? 'loaded' : ''}`}
                                        onLoad={() => setImageLoaded(true)}
                                    />
                                </div>
                                {activeProject.images.length > 1 && (
                                    <button className="slider-btn next-btn" onClick={nextImage}>❯</button>
                                )}

                                {/* Image counter */}
                                {activeProject.images.length > 1 && (
                                    <div className="slideshow-counter">
                                        {currentImageIndex + 1} / {activeProject.images.length}
                                    </div>
                                )}
                            </div>

                            {/* Dot navigation */}
                            {activeProject.images.length > 1 && (
                                <div className="slideshow-dots">
                                    {activeProject.images.map((_, idx) => (
                                        <span
                                            key={idx}
                                            className={`dot ${idx === currentImageIndex ? 'active' : ''}`}
                                            onClick={(e) => { e.stopPropagation(); setImageLoaded(false); setCurrentImageIndex(idx); }}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Thumbnail strip for quick navigation */}
                            {activeProject.images.length > 1 && (
                                <div className="slideshow-thumbnails">
                                    {activeProject.images.map((img, idx) => (
                                        <div
                                            key={idx}
                                            className={`thumb-item ${idx === currentImageIndex ? 'active' : ''}`}
                                            onClick={(e) => { e.stopPropagation(); setImageLoaded(false); setCurrentImageIndex(idx); }}
                                        >
                                            <img src={img} alt={`Thumbnail ${idx + 1}`} loading="lazy" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}
