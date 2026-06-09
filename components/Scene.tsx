"use client"

import { Canvas, useThree } from "@react-three/fiber"
import Model from "./Model"
import BikeParts from "./BikeParts"
import { Suspense } from "react"
import { useProgress, Html, ScrollControls, Scroll } from "@react-three/drei"

function Loader() {
  const { progress, active } = useProgress()

  return <Html center>{progress.toFixed(1)} % loaded</Html>
}

export default function Scene() {
  return (
    <Canvas gl={{ antialias: true }} dpr={[1, 1.5]} className="relative h-svh">
      <directionalLight position={[-5, -5, 5]} intensity={4} />
      <Suspense fallback={<Loader />}>
        <ScrollControls damping={0.5} pages={3}>
          <Model />
          {/* HTML overlay that scrolls in sync with the bike explode animation */}
          <Scroll html style={{ width: "100%" }}>
            <BikeParts />
          </Scroll>
        </ScrollControls>
      </Suspense>
    </Canvas>
  )
}
