import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import './Contact.css'

gsap.registerPlugin(ScrollTrigger)

export default function Contact() {
    const sectionRef = useRef(null)
    const headingRef = useRef(null)
    const formRef = useRef(null)
    const infoRef = useRef(null)
    const [submitted, setSubmitted] = useState(false)
    const [form, setForm] = useState({ name: '', email: '', message: '' })

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(headingRef.current,
                { opacity: 0, y: 50 },
                {
                    opacity: 1, y: 0, duration: 1, ease: 'power3.out',
                    scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' }
                }
            )
            gsap.fromTo(infoRef.current,
                { opacity: 0, x: -50 },
                {
                    opacity: 1, x: 0, duration: 1, ease: 'power3.out',
                    scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' }
                }
            )
            gsap.fromTo(formRef.current,
                { opacity: 0, x: 50 },
                {
                    opacity: 1, x: 0, duration: 1, ease: 'power3.out',
                    scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' }
                }
            )
        }, sectionRef)
        return () => ctx.revert()
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        gsap.to(formRef.current, {
            scale: 0.98, duration: 0.15, ease: 'power2.in',
            onComplete: () => {
                setSubmitted(true)
                gsap.fromTo(formRef.current,
                    { scale: 0.95, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.4)' }
                )
            }
        })
    }

    const contactItems = [
        { icon: '📞', label: 'Phone', value: '0312 2107129', href: 'tel:+923122107129' },
        { icon: '✉', label: 'Email', value: 'usaidali204@gmail.com', href: 'mailto:usaidali204@gmail.com' },
        { icon: '📍', label: 'Location', value: 'Karachi, Pakistan', href: null },
    ]

    return (
        <section id="contact" ref={sectionRef} className="contact">
            {/* Animated gradient background */}
            <div className="contact-gradient" />

            <div className="contact-inner">
                <div ref={headingRef} className="contact-heading">
                    <span className="section-label" style={{ color: 'var(--dark-accent)', opacity: 0.6 }}>Get In Touch</span>
                    <h2>Let's Create <em>Together</em></h2>
                    <p className="contact-sub">
                        Ready to bring your vision to life? Whether you need architectural visualization,
                        interior renders, or real-time experiences — let's talk.
                    </p>
                </div>

                <div className="contact-grid">
                    <div ref={infoRef} className="contact-info">
                        {contactItems.map((item, i) => (
                            <div key={i} className="contact-item">
                                <div className="contact-item-icon">{item.icon}</div>
                                <div>
                                    <div className="contact-item-label">{item.label}</div>
                                    {item.href ? (
                                        <a href={item.href} className="contact-item-value">{item.value}</a>
                                    ) : (
                                        <div className="contact-item-value">{item.value}</div>
                                    )}
                                </div>
                            </div>
                        ))}

                        <div className="availability-badge">
                            <span className="avail-dot" />
                            Available for freelance projects
                        </div>
                    </div>

                    <div ref={formRef} className="contact-form-wrap">
                        {!submitted ? (
                            <form className="contact-form" onSubmit={handleSubmit}>
                                <div className="field">
                                    <label htmlFor="c-name">Your Name</label>
                                    <input
                                        id="c-name"
                                        type="text"
                                        required
                                        placeholder="John Smith"
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                    />
                                </div>
                                <div className="field">
                                    <label htmlFor="c-email">Email Address</label>
                                    <input
                                        id="c-email"
                                        type="email"
                                        required
                                        placeholder="john@example.com"
                                        value={form.email}
                                        onChange={e => setForm({ ...form, email: e.target.value })}
                                    />
                                </div>
                                <div className="field">
                                    <label htmlFor="c-msg">Message</label>
                                    <textarea
                                        id="c-msg"
                                        required
                                        rows={5}
                                        placeholder="Tell me about your project..."
                                        value={form.message}
                                        onChange={e => setForm({ ...form, message: e.target.value })}
                                    />
                                </div>
                                <button type="submit" className="btn-submit">
                                    Send Message
                                    <span className="submit-arrow">→</span>
                                </button>
                            </form>
                        ) : (
                            <div className="success-state">
                                <div className="success-icon">✓</div>
                                <h3>Message Sent!</h3>
                                <p>Thank you for reaching out. I'll get back to you within 24 hours.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="contact-footer">
                    <div className="footer-copy">
                        © 2024 Usaid Ali. All rights reserved.
                    </div>
                    <div className="footer-made">
                        Crafted with precision &amp; passion
                    </div>
                </div>
            </div>
        </section>
    )
}
