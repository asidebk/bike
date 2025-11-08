// app/page.tsx or a separate component like app/ScenePage.tsx

import Scene from '../components/Scene'

export default function HomePage() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Logo in the top-left */}
      <img
        src="/abc_logo.png" // Replace with your actual logo path
        alt="Logo"
        className="absolute top-4 left-4 w-64 h-auto z-10"
      />

      {/* 3D Scene */}
      <Scene />
    </div>
  )
}
