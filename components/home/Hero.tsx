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
              {/* `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  */}
              “Tailwind CSS is the only framework that I&apos;ve seen scale on large teams.
              It&rsquo;s easy to customize, adapts to any design, and the build size is tiny.”
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
