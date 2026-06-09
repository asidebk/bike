"use client"

import { useScroll } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useRef } from "react"

type Part = {
  /** Big number / label shown in the corner of the box */
  index: string
  title: string
  description: string
  /** Spec rows shown inside the box */
  specs: { label: string; value: string }[]
  /** Vertical placement, in viewport heights (0 = first page, 1 = second, ...) */
  page: number
  /** Which side of the screen the box sits on */
  side: "left" | "right"
  /** Scroll window [start, length] (0..1 of total scroll) where the card is visible */
  range: [number, number]
}

// Tuned for ScrollControls pages={3}. Each card fades in/out as the matching
// part of the bike separates during the scroll-driven explode animation.
const PARTS: Part[] = [
  {
    index: "01",
    title: "Frame & Geometry",
    description:
      "Hydroformed aluminium main triangle — the backbone everything else hangs off of. Tuned for a stiff bottom bracket and a compliant rear end.",
    specs: [
      { label: "Material", value: "6061-T6 Alloy" },
      { label: "Weight", value: "1.85 kg" },
      { label: "Sizes", value: "S · M · L · XL" },
    ],
    page: 0,
    side: "left",
    range: [0, 0.34],
  },
  {
    index: "02",
    title: "Wheels & Tires",
    description:
      "Tubeless-ready rims laced to sealed-bearing hubs, wrapped in grippy all-condition rubber for confident cornering on road and trail.",
    specs: [
      { label: "Rim", value: "700c Tubeless" },
      { label: "Spokes", value: "28 / 28 J-bend" },
      { label: "Tire", value: "40 mm All-Road" },
    ],
    page: 1,
    side: "right",
    range: [0.3, 0.4],
  },
  {
    index: "03",
    title: "Drivetrain",
    description:
      "A wide-range single-ring drivetrain with a hardened chain and precise indexed shifting — fewer parts, less to maintain, more to ride.",
    specs: [
      { label: "Gearing", value: "1 × 12 Speed" },
      { label: "Cassette", value: "10–52T" },
      { label: "Crank", value: "175 mm Forged" },
    ],
    page: 1.6,
    side: "left",
    range: [0.55, 0.4],
  },
  {
    index: "04",
    title: "Cockpit & Brakes",
    description:
      "Ergonomic alloy bar and stem paired with hydraulic disc brakes for all-weather, one-finger stopping power and total control.",
    specs: [
      { label: "Brakes", value: "Hydraulic Disc" },
      { label: "Rotors", value: "160 mm F / R" },
      { label: "Bar", value: "760 mm Alloy" },
    ],
    page: 2.2,
    side: "right",
    range: [0.78, 0.22],
  },
]

function PartCard({ part }: { part: Part }) {
  const ref = useRef<HTMLDivElement>(null)
  const scroll = useScroll()

  useFrame(() => {
    if (!ref.current) return
    // curve() ramps 0 -> 1 -> 0 across the window, so the card fades in
    // as its part separates and fades back out as the next one arrives.
    const visibility = scroll.curve(part.range[0], part.range[1])
    ref.current.style.opacity = `${visibility}`
    // Slide + lift slightly toward the viewer as it appears.
    const offset = (1 - visibility) * 40 * (part.side === "left" ? -1 : 1)
    ref.current.style.transform = `translateX(${offset}px)`
    ref.current.style.pointerEvents = visibility > 0.5 ? "auto" : "none"
  })

  return (
    <div
      className="part-card"
      ref={ref}
      style={{
        position: "absolute",
        top: `calc(${part.page * 100}vh + 50vh)`,
        [part.side]: "clamp(1.25rem, 6vw, 6rem)",
        transform: "translateY(-50%)",
        opacity: 0,
      }}
    >
      <span className="part-card__index">{part.index}</span>
      <h2 className="part-card__title">{part.title}</h2>
      <p className="part-card__desc">{part.description}</p>
      <ul className="part-card__specs">
        {part.specs.map((spec) => (
          <li key={spec.label}>
            <span>{spec.label}</span>
            <span>{spec.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function BikeParts() {
  return (
    <>
      {/* Intro heading on the first page */}
      <div className="parts-intro">
        <p className="parts-intro__eyebrow">Anatomy of the Ride</p>
        <h1 className="parts-intro__title">Built from the ground up</h1>
        <p className="parts-intro__hint">Scroll to take it apart ↓</p>
      </div>

      {PARTS.map((part) => (
        <PartCard key={part.index} part={part} />
      ))}
    </>
  )
}
