import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import './Hero.css'

const LETTERS = 'USAID ALI'.split('')

// ─── CONFIG ────────────────────────────────────────────────────────────────
// 1. Place your .glb file inside:  d:\Usaid\Web\ArtisticGalaxy\public\
// 2. Update the path below to match your filename, e.g. '/chair.glb'
const GLB_MODEL_PATH = '/House.glb'

// Tweak these if your model appears too big / small / fast
const MODEL_SCALE = 2.2           // overall size multiplier
const MODEL_ROTATION_SPEED = 0.004 // radians per frame (lower = slower)
const MODEL_FLOAT_AMPLITUDE = 0.12 // up/down float distance
// ───────────────────────────────────────────────────────────────────────────

export default function Hero() {
    const canvasRef = useRef(null)
    const sectionRef = useRef(null)
    const lettersRef = useRef([])
    const subtitleRef = useRef(null)
    const ctaRef = useRef(null)
    const scrollHintRef = useRef(null)

    /* ── Three.js scene ── */
    useEffect(() => {
        const canvas = canvasRef.current
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.setSize(canvas.clientWidth, canvas.clientHeight)
        renderer.shadowMap.enabled = true
        renderer.outputColorSpace = THREE.SRGBColorSpace
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = 1.2

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 200)
        camera.position.set(0, 0, 5.5)

        // ── Controls ──
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controls.dampingFactor = 0.05
        controls.enablePan = false
        controls.autoRotate = true
        controls.autoRotateSpeed = 0.8
        controls.minDistance = 3
        controls.maxDistance = 10
        controls.maxPolarAngle = Math.PI / 1.6 // Don't see under the house

        // ── Lights (Dramatic Dark Palette) ──
        scene.add(new THREE.AmbientLight(0xffffff, 0.4)) // Lower ambient for dark look
        const dir = new THREE.DirectionalLight(0xffffff, 2.0)
        dir.position.set(4, 6, 4)
        dir.castShadow = true
        scene.add(dir)
        const fill = new THREE.DirectionalLight(0x403D3E, 0.6)
        fill.position.set(-4, -2, 3)
        scene.add(fill)
        const rim = new THREE.PointLight(0xFFFCD0, 1.8, 30) // Vanilla as rim light accent
        rim.position.set(-3, 3, -2)
        scene.add(rim)

        // ── Ground shadow disc ──
        const disc = new THREE.Mesh(
            new THREE.CircleGeometry(1.5, 64),
            new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.15 })
        )
        disc.rotation.x = -Math.PI / 2
        disc.position.y = -2.4
        scene.add(disc)

        // ── Model group (holds whichever object is showing) ──
        const modelGroup = new THREE.Group()
        scene.add(modelGroup)

        // Fallback icosahedron (shown until / if GLB loads)
        const fallbackGeo = new THREE.IcosahedronGeometry(1.4, 1)
        const fallbackMat = new THREE.MeshStandardMaterial({
            color: 0x807E83, roughness: 0.85, metalness: 0.05,
            emissive: 0x1a1818, emissiveIntensity: 0.2,
        })
        const fallbackMesh = new THREE.Mesh(fallbackGeo, fallbackMat)
        const wireOverlay = new THREE.Mesh(
            new THREE.IcosahedronGeometry(1.42, 1),
            new THREE.MeshBasicMaterial({ color: 0x9a9080, wireframe: true, transparent: true, opacity: 0.18 })
        )
        modelGroup.add(fallbackMesh)
        modelGroup.add(wireOverlay)

        // ── Load the custom GLB ──
        const loader = new GLTFLoader()
        loader.load(
            GLB_MODEL_PATH,
            (gltf) => {
                // Remove fallback shapes
                modelGroup.remove(fallbackMesh)
                modelGroup.remove(wireOverlay)

                const model = gltf.scene

                // 1. Force matrix update to ensure internal transforms are accounted for
                model.updateMatrixWorld(true)

                // 2. Auto-scale to a normalized size first
                const box = new THREE.Box3().setFromObject(model)
                const size = box.getSize(new THREE.Vector3())
                const maxDim = Math.max(size.x, size.y, size.z)
                model.scale.setScalar(MODEL_SCALE / maxDim)

                // 3. Re-calculate center after scale and force update again
                model.updateMatrixWorld(true)
                const box2 = new THREE.Box3().setFromObject(model)
                const center = box2.getCenter(new THREE.Vector3())

                // 4. Center the model by subtracting the calculated center
                model.position.sub(center)

                // 5. Shadows + material tweaks
                model.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true
                        child.receiveShadow = true
                    }
                })

                // Start invisible, fade in
                model.traverse(c => {
                    if (c.isMesh) {
                        c.material = c.material.clone()
                        c.material.transparent = true
                        c.material.opacity = 0
                    }
                })
                modelGroup.add(model)

                gsap.to({ val: 0 }, {
                    val: 1, duration: 1.4, ease: 'power2.out',
                    onUpdate: function () {
                        model.traverse(c => { if (c.isMesh) c.material.opacity = this.targets()[0].val })
                    },
                })
            },
            undefined,
            () => {
                console.info(
                    `[Hero] No GLB found at "${GLB_MODEL_PATH}". ` +
                    'Place your .glb file in d:\\Usaid\\Web\\ArtisticGalaxy\\public\\ and update GLB_MODEL_PATH above.'
                )
            }
        )

        // ── Resize ──
        const onResize = () => {
            renderer.setSize(canvas.clientWidth, canvas.clientHeight)
            camera.aspect = canvas.clientWidth / canvas.clientHeight
            camera.updateProjectionMatrix()
        }
        window.addEventListener('resize', onResize)

        // ── Render loop ──
        let frameId, time = 0
        const animate = () => {
            frameId = requestAnimationFrame(animate)
            time += 0.01

            controls.update()

            // Subtle base float that adds to the rotation
            modelGroup.position.y = Math.sin(time * 0.8) * MODEL_FLOAT_AMPLITUDE

            renderer.render(scene, camera)
        }
        animate()

        return () => {
            cancelAnimationFrame(frameId)
            window.removeEventListener('resize', onResize)
            controls.dispose()
            renderer.dispose()
        }
    }, [])

    /* ── GSAP entry animation ── */
    useEffect(() => {
        const tl = gsap.timeline({ delay: 0.3 })
        tl.fromTo(sectionRef.current,
            { backgroundColor: '#000000' },
            { backgroundColor: '#262323', duration: 1.8, ease: 'power2.inOut' }
        )
        tl.fromTo(lettersRef.current,
            { opacity: 0, y: 80, rotateX: -60 },
            { opacity: 1, y: 0, rotateX: 0, duration: 1.2, stagger: 0.07, ease: 'expo.out' },
            '-=0.8'
        )
        tl.fromTo(subtitleRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
            '-=0.4'
        )
        tl.fromTo(ctaRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
            '-=0.5'
        )
        tl.fromTo(scrollHintRef.current,
            { opacity: 0 },
            { opacity: 0.5, duration: 0.6 },
            '-=0.3'
        )
    }, [])

    const scrollTo = (id) => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <section id="hero" ref={sectionRef} className="hero">
            <canvas ref={canvasRef} className="hero-canvas" />

            <div className="hero-content">
                <div className="hero-title" aria-label="USAID ALI">
                    {LETTERS.map((char, i) => (
                        <span
                            key={i}
                            ref={el => lettersRef.current[i] = el}
                            className={`hero-letter ${char === ' ' ? 'space' : ''}`}
                        >
                            {char === ' ' ? '\u00A0' : char}
                        </span>
                    ))}
                </div>

                <p ref={subtitleRef} className="hero-subtitle">
                    3D Visualizer &nbsp;|&nbsp; Architectural Rendering Specialist
                </p>

                <div ref={ctaRef} className="hero-cta">
                    <button className="btn btn-primary" onClick={() => scrollTo('portfolio')}>
                        View My Work
                    </button>
                    <button className="btn btn-secondary" onClick={() => scrollTo('contact')}>
                        Contact Me
                    </button>
                </div>
            </div>

            <div ref={scrollHintRef} className="scroll-hint">
                <span>Scroll</span>
                <div className="scroll-line"><div className="scroll-dot" /></div>
            </div>
        </section>
    )
}
