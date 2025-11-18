// app/page.tsx or a separate component like app/ScenePage.tsx

import Scene from '../components/Scene'

export default function HomePage() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Logo in the top-left */}
     

      {/* 3D Scene */}
      <Scene />
    </div>
  )
}
