import React, { useEffect, useRef, useState } from 'react'
import './CustomCursor.css'

export default function CustomCursor() {
    const cursorRef = useRef(null)
    const followerRef = useRef(null)
    const [hovered, setHovered] = useState(false)
    const pos = useRef({ x: 0, y: 0 })
    const followerPos = useRef({ x: 0, y: 0 })
    const rafRef = useRef(null)

    useEffect(() => {
        const move = (e) => {
            pos.current = { x: e.clientX, y: e.clientY }
            if (cursorRef.current) {
                cursorRef.current.style.left = e.clientX + 'px'
                cursorRef.current.style.top = e.clientY + 'px'
            }
        }

        const lerp = (a, b, t) => a + (b - a) * t
        const tick = () => {
            followerPos.current.x = lerp(followerPos.current.x, pos.current.x, 0.12)
            followerPos.current.y = lerp(followerPos.current.y, pos.current.y, 0.12)
            if (followerRef.current) {
                followerRef.current.style.left = followerPos.current.x + 'px'
                followerRef.current.style.top = followerPos.current.y + 'px'
            }
            rafRef.current = requestAnimationFrame(tick)
        }

        window.addEventListener('mousemove', move)
        rafRef.current = requestAnimationFrame(tick)

        const addHover = () => {
            document.querySelectorAll('a, button, .btn, .skill-card, .portfolio-item, .cursor-pointer').forEach(el => {
                el.addEventListener('mouseenter', () => setHovered(true))
                el.addEventListener('mouseleave', () => setHovered(false))
            })
        }
        addHover()
        const observer = new MutationObserver(addHover)
        observer.observe(document.body, { childList: true, subtree: true })

        return () => {
            window.removeEventListener('mousemove', move)
            cancelAnimationFrame(rafRef.current)
            observer.disconnect()
        }
    }, [])

    return (
        <>
            <div ref={cursorRef} className={`cursor ${hovered ? 'hover' : ''}`} />
            <div ref={followerRef} className={`cursor-follower ${hovered ? 'hover' : ''}`} />
        </>
    )
}
