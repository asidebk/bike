import { Environment, OrbitControls, useAnimations, useGLTF, useScroll } from "@react-three/drei"
import { useEffect, useRef, useState } from "react"
import { Group } from "three"
import { useFrame } from "@react-three/fiber"

useGLTF.preload("bike.glb")

export default function Model() {
  const group = useRef<Group>(null)
  const { scene, animations } = useGLTF("/bike.glb")
  const { actions, names } = useAnimations(animations, scene)
  const scroll = useScroll()
  const [isMobile, setIsMobile] = useState(false)
  const [isReady, setIsReady] = useState(false)

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Pause animations at start and mark as ready
  useEffect(() => {
    if (!actions) return
    Object.values(actions).forEach((action) => {
      if (action) {
        action.reset().play()
        action.paused = true
      }
    })

    // ✅ Run initial scroll position immediately when ready
    if (names.length > 0) {
      names.forEach((name) => {
        const action = actions[name]
        if (action) {
          const duration = action.getClip().duration
          action.time = scroll.offset * duration
        }
      })
    }

    setIsReady(true)
  }, [actions, names, scroll.offset])

  // Scroll controls animation
  useFrame(() => {
    if (!isReady || !actions || names.length === 0) return
    names.forEach((name) => {
      const action = actions[name]
      if (action) {
        const duration = action.getClip().duration
        action.time = scroll.offset * duration
      }
    })
  })

  return (
    <>
      <group ref={group}>
        <primitive object={scene} />
      </group>

      {/* OrbitControls only on desktop */}
      {!isMobile && (
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.1}
          rotateSpeed={0.5}
        />
      )}

      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} />
      <pointLight position={[0, 5, 0]} intensity={0.3} />
      <Environment preset="sunset" />
    </>
  )
}
