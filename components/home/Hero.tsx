import React from 'react'
import { AnimateSharedLayout } from 'framer-motion'

export default function Hero() {
  return (
    <div className="flex">
      <div>
        <AnimateSharedLayout>
          <div className="">
            <div>img</div>
            <div>
              “Tailwind CSS is the only framework that I've seen scale on large teams. It’s easy to
              customize, adapts to any design, and the build size is tiny.”
            </div>
            <div>Sarah Dayan</div>
            <div>Staff Engineer, Algolia</div>
          </div>
        </AnimateSharedLayout>
      </div>
      <div>code</div>
    </div>
  )
}
