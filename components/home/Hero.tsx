import React, { useRef, useEffect, useState } from 'react'
import { AnimateSharedLayout, motion, useAnimation } from 'framer-motion'
import { fit } from 'utils/fit'
import { createInViewPromise } from 'utils/createInViewPromise'
import { wait } from 'utils/wait'
import { CodeWindow, Token } from 'components/codeWindow'
import { tokens, code } from '../../samples/hero.html?highlight'

function getRange(text, options = {}) {
  return { start: code.indexOf(text), end: code.indexOf(text) + text.length, ...options }
}

const ranges = [
  getRange(' p-8'), // char:0:0 ' '  char:0:1 'p' char:0:2 '-' char:0:3:last '8'
  getRange(' rounded-full'), // char:1:0 ' '
  getRange(' mx-auto'), // char:2:0 ' '
  getRange(' font-medium'), // char:3:0 ' '
  getRange(' class="font-medium"'), // char:4:0 ' '
  getRange(' class="text-sky-500 dark:text-sky-400"'), // char:5:0 ' '
  getRange(' class="text-slate-700 dark:text-slate-500"'), // char:6:0 ' '
  getRange(' text-center'), // char:7:0 ' '
  getRange('md:flex '), // char:8:0 'm'  char:8:1 'd' char:8:2 ':' char:8:3 'f' char:8:4 'l' char:8:5 'e' char:8:6 'x' char:8:7:last ' '
  getRange(' md:p-0'), // char:9:0 ' '
  getRange(' md:p-8', { immediate: true }), // char:10:0 ' '
  getRange(' md:rounded-none'), // char:11:0 ' '
  getRange(' md:w-48'), // char:12:0 ' '
  getRange(' md:h-auto'), // char:13:0 ' '
  getRange(' md:text-left'), // char:14:0 ' '
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
  const [step, setStep] = useState(-1) // 第几步
  const [state, setState] = useState({ group: -1, char: -1 })
  const [finished, setFinished] = useState(false)

  const mounted = useRef(true) // 标记组件是否加载
  const inViewRef = useRef() // 进入可视区
  const containerRef = useRef()
  const imageRef = useRef()

  console.log('mounted.current', mounted.current, state.group, state.char)

  // 组件是否加载
  useEffect(() => {
    return () => {
      mounted.current = false
    }
  }, [])

  // 监听图片加载、代码区域Dom是否进入到可视区中间
  useEffect(() => {
    let current = true

    console.log('inViewRef.current=', inViewRef.current)
    const { promise: inViewPromise, disconnect } = createInViewPromise(inViewRef.current, {
      threshold: 0.5,
    })

    const promises = [
      wait(1000),
      inViewPromise,
      new Promise((resolve) => {
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(resolve)
        } else {
          window.setTimeout(resolve, 0)
        }
      }),
      new Promise((resolve) => {
        console.log('imageRef.current', imageRef.current, imageRef.current.complete)
        if (imageRef.current.complete) {
          resolve()
        } else {
          imageRef.current.addEventListener('load', resolve)
        }
      }),
    ]

    Promise.all(promises).then(() => {
      console.log('Promise.all resolve =======>', current)
      if (current) {
        setState({ group: 0, char: 0 })
      }
    })

    return () => {
      current = false
      disconnect()
    }
  }, [])

  // 标记动画步骤是否完成
  useEffect(() => {
    if (step === 14) {
      let id = window.setTimeout(() => {
        setFinished(true)
      }, 1000)
      return () => {
        window.clearTimeout(id)
      }
    }
  }, [step])

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
          <CodeWindow.Code
            ref={inViewRef}
            tokens={tokens}
            tokenComponent={HeroToken}
            tokenProps={{
              currentGroup: state.group,
              currentChar: state.char,
            }}
          />
        </CodeWindow>
      }
    ></Layout>
  )
}

function AnimatedToken({ isActiveToken, onComplete, children }) {
  const [visible, setVisible] = useState(false)

  console.log('isActiveToken=', isActiveToken)

  useEffect(() => {
    if (visible) {
      onComplete()
    }
  }, [visible])

  return (
    <>
      <span>{children}</span>
    </>
  )
}

function HeroToken({ currentChar, onCharComplete, currentGroup, onGroupComplete, ...props }) {
  const { token } = props

  if (token[0].startsWith('char:')) {
    // console.log('char: =>', token)
    const [, groupIndex, indexInGroup] = token[0].split(':').map((x) => parseInt(x, 10))
    console.log(
      `HeroToken-------. currentGroup=${currentGroup}, groupIndex=${groupIndex}, currentChar=${currentChar}, indexInGroup=${indexInGroup}`
    )

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

  // console.log('no char: =>', token)
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
