import React, { useRef, useEffect, useState } from 'react'
import { AnimateSharedLayout, motion, useAnimation } from 'framer-motion'
import { fit } from 'utils/fit'
import { createInViewPromise } from 'utils/createInViewPromise'
import { CodeWindow, Token } from 'components/codeWindow'
import { tokens, code } from '../../samples/hero.html?highlight'

function getRange(text, options = {}) {
  return { start: code.indexOf(text), end: code.indexOf(text) + text.length, ...options }
}

const ranges = [
  getRange(' p-8'),
  getRange(' rounded-full'),
  getRange(' mx-auto'),
  getRange(' font-medium'),
  getRange(' class="font-medium"'),
  getRange(' class="text-sky-500 dark:text-sky-400"'),
  getRange(' class="text-slate-700 dark:text-slate-500"'),
  getRange(' text-center'),
  getRange('md:flex '),
  getRange(' md:p-0'),
  getRange(' md:p-8', { immediate: true }),
  getRange(' md:rounded-none'),
  getRange(' md:w-48'),
  getRange(' md:h-auto'),
  getRange(' md:text-left'),
]

function getRangeIndex(index, ranges) {
  for (let i = 0; i < ranges.length; i++) {
    const rangeArr = Array.isArray(ranges[i]) ? ranges[i] : [ranges[i]]
    for (let j = 0; j < rangeArr.length; j++) {
      if (index >= rangeArr[j].start && index < rangeArr[j].end) {
        return [i, index - rangeArr[j].start, index === rangeArr[j].end - 1]
      }
    }
  }
  return [-1]
}

function Words({ children, bolder = false }) {
  return children.split(' ').map((word, i) => {
    return (
      <span key={i} className="relative inline-flex whitespace-pre text-lg">
        {bolder ? <span className="absolute top-0 left-0">{`${word} `}</span> : `${word} `}
      </span>
    )
  })
}

function augment(tokens, index = 0) {
  for (let i = 0; i < tokens.length; i++) {
    if (Array.isArray(tokens[i])) {
      const _type = tokens[i][0]
      const children = tokens[i][1]
      if (Array.isArray(children)) {
        index = augment(children, index)
      } else {
        const str = children
        const result = []
        for (let j = 0; j < str.length; j++) {
          const [rangeIndex, indexInRange, isLast] = getRangeIndex(index, ranges)
          if (rangeIndex > -1) {
            result.push([`char:${rangeIndex}:${indexInRange}${isLast ? ':last' : ''}`, str[j]])
          } else {
            if (typeof result[result.length - 1] === 'string') {
              result[result.length - 1] += str[j]
            } else {
              result.push(str[j])
            }
          }
          index++
        }
        if (!(result.length === 1 && typeof result[0] === 'string')) {
          tokens[i].splice(1, 1, result)
        }
      }
    } else {
      const str = tokens[i]
      const result = []
      for (let j = 0; j < str.length; j++) {
        const [rangeIndex, indexInRange, isLast] = getRangeIndex(index, ranges)
        if (rangeIndex > -1) {
          result.push([`char:${rangeIndex}:${indexInRange}${isLast ? ':last' : ''}`, str[j]])
        } else {
          if (typeof result[result.length - 1] === 'string') {
            result[result.length - 1] += str[j]
          } else {
            result.push(str[j])
          }
        }
        index++
      }
      tokens.splice(i, 1, ...result)
      i += result.length - 1
    }
  }
  return index
}

augment(tokens)

export default function Hero() {
  const mounted = useRef(true) // 标记页面是否加载过
  const [step, setStep] = useState(-1) // 第几步
  const inViewRef = useRef() // 进入可视区
  const containerRef = useRef()
  const imageRef = useRef()

  console.log('www', mounted.current)

  useEffect(() => {
    return () => {
      mounted.current = false
      console.log('eeee', mounted.current)
    }
  }, [])

  useEffect(() => {
    console.log('wwqqq', inViewRef.current)
    const { promise: inViewPromise, disconnect } = createInViewPromise(inViewRef.current, {
      threshold: 0.5,
    })
  }, [])

  return (
    <Layout
      left={
        <div ref={containerRef} className="lg:-mr-18">
          <AnimateSharedLayout>
            <div className="relative z-10 rounded-lg shadow-xl text-slate-900 dark:text-slate-300 mx-auto sm:w-[23.4375rem]">
              <div className="bg-white rounded-lg overflow-hidden ring-1 ring-slate-900/5 dark:bg-slate-800 dark:highlight-white/5 dark:ring-0">
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
                  <div className="mb-4">
                    <Words>
                      {/* `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  */}
                      “Tailwind CSS is the only framework that I&apos;ve seen scale on large teams.
                      It&rsquo;s easy to customize, adapts to any design, and the build size is
                      tiny.”
                    </Words>
                  </div>
                </div>
                <div className="flex flex-col">
                  <p>Sarah Dayan</p>
                  <p>Staff Engineer, Algolia</p>
                </div>
              </div>
            </div>
          </AnimateSharedLayout>
        </div>
      }
      right={
        <CodeWindow className="!h-auto max-h-[none]">
          <CodeWindow.Code ref={inViewRef} tokens={tokens} tokenComponent={HeroToken} />
        </CodeWindow>
      }
    ></Layout>
  )
}

function AnimatedToken({ isActiveToken, onComplete }) {
  return <></>
}

function HeroToken({ currentChar, onCharComplete, currentGroup, onGroupComplete, ...props }) {
  const { token } = props

  if (token[0].startsWith('char:')) {
    const [, groupIndex, indexInGroup] = token[0].split(':').map((x) => parseInt(x, 10))

    return (
      <AnimatedToken
        isActiveToken={currentGroup === groupIndex && currentChar === indexInGroup}
        onComplete={() => {
          if (token[0].endsWith(':last')) {
            onGroupComplete(groupIndex)
          } else {
            onCharComplete(indexInGroup)
          }
        }}
        {...props}
      />
    )
  }

  return <Token {...props} />
}

function Layout({ left, right }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-20 sm:mt-24 lg:mt-32 lg:grid lg:gap-8 lg:grid-cols-12 lg:items-center">
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
