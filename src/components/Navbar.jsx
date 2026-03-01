import React, { useEffect, useRef, useState } from 'react'
import './Navbar.css'

const links = ['about', 'skills', 'experience', 'portfolio', 'education', 'contact']

export default function Navbar() {
    const navRef = useRef(null)
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const scrollTo = (id, e) => {
        e.preventDefault()
        setMobileOpen(false)
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <nav ref={navRef} className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <a href="#hero" className="nav-logo" onClick={(e) => scrollTo('hero', e)}>
                UA<span>.</span>
            </a>
            <div className={`nav-links ${mobileOpen ? 'open' : ''}`}>
                {links.map(link => (
                    <a key={link} href={`#${link}`} onClick={(e) => scrollTo(link, e)}>
                        {link}
                    </a>
                ))}
            </div>
            <button
                className={`nav-hamburger ${mobileOpen ? 'open' : ''}`}
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
            >
                <span /><span /><span />
            </button>
        </nav>
    )
}
