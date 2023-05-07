import React, { useRef } from 'react'
import { AnimateSharedLayout, motion, useAnimation } from 'framer-motion'
import { fit } from 'utils/fit'

export default function Hero() {
  const containerRef = useRef()
  const imageRef = useRef()

  return (
    <Layout
      left={
        <div ref={containerRef} className="lg:-mr-18">
          <AnimateSharedLayout>
            <div className="">
              <div>
                <motion.img
                  ref={imageRef}
                  // layout={layout}
                  // transition={TRANSITION}
                  src={require('img/sarah-dayan.jpg').default.src}
                  decoding="async"
                  alt=""
                  // className={clsx('absolute max-w-none object-cover bg-slate-100', {
                  //   'rounded-full': finished && !md,
                  // })}
                  // style={
                  //   finished
                  //     ? { top: 0, left: 0, width: '100%', height: '100%' }
                  //     : step >= 13 && md
                  //     ? fit(192, containerRect.height, 384, 512)
                  //     : step >= 12 && md
                  //     ? fit(192, 96, 384, 512)
                  //     : fit(96, 96, 384, 512)
                  // }
                  style={fit(96, 96, 384, 512)}
                />
              </div>
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
      }
      right={<div>code</div>}
    ></Layout>
  )
}

function Layout({ left, right }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8  mt-20 sm:mt-24 lg:mt-32 lg:grid lg:gap-8 lg:grid-cols-12 lg:items-center">
      <div className="relative row-start-1 col-start-1 col-span-5 xl:col-span-6 -mt-10">
        <div className="h-[24.25rem] max-w-xl mx-auto lg:max-w-none flex items-center justify-center">
          <div className="w-full flex-none">{left}</div>
        </div>
      </div>
      <div className="relative row-start-1 col-start-6 xl:col-start-7 col-span-7 xl:col-span-6">
        <div className="-mx-4 sm:mx-0">{right}</div>
      </div>
    </div>
  )
}
