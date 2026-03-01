import React, { useEffect, useRef } from 'react'

export default function ScrollProgress() {
    const barRef = useRef(null)

    useEffect(() => {
        const update = () => {
            const scrolled = window.scrollY
            const total = document.documentElement.scrollHeight - window.innerHeight
            const progress = total > 0 ? scrolled / total : 0
            if (barRef.current) {
                barRef.current.style.transform = `scaleX(${progress})`
            }
        }
        window.addEventListener('scroll', update, { passive: true })
        return () => window.removeEventListener('scroll', update)
    }, [])

    return <div ref={barRef} className="scroll-progress" style={{ width: '100%' }} />
}
