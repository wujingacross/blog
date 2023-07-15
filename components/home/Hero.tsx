import React, { useRef, useEffect, useState } from 'react'
import { AnimateSharedLayout, motion, useAnimation } from 'framer-motion'
import clsx from 'clsx'
import { fit } from 'utils/fit'
import { createInViewPromise } from 'utils/createInViewPromise'
import { wait } from 'utils/wait'
import { CodeWindow, Token } from 'components/codeWindow'
import { tokens, code } from '../../samples/hero.html?highlight'

const CHAR_DELAY = 75
const GROUP_DELAY = 1000

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

// console.log('tokens=', tokens)

export default function Hero() {
  const [step, setStep] = useState(-1) // 第几步
  const [state, setState] = useState({ group: -1, char: -1 }) // 动效的控制， group： 每组动效样式的控制， char：每组里样式的每个字符的控制
  const [finished, setFinished] = useState(false)

  const mounted = useRef(true) // 标记组件是否加载
  const inViewRef = useRef() // 代码展示区域
  const containerRef = useRef() // 样式预览区域
  const imageRef = useRef() // 头像图片DOM

  const layout = !finished

  // 组件是否加载
  useEffect(() => {
    return () => {
      mounted.current = false
    }
  }, [])

  // 监听图片加载、代码区域Dom是否进入到可视区中间
  useEffect(() => {
    let current = true

    const { promise: inViewPromise, disconnect } = createInViewPromise(inViewRef.current, {
      threshold: 0.5,
    })

    const promises = [
      wait(1000),
      inViewPromise,
      new Promise((resolve) => {
        // ？？？ 这个Promise不太懂
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(resolve)
        } else {
          window.setTimeout(resolve, 0)
        }
      }),
      new Promise((resolve) => {
        if (imageRef.current.complete) {
          resolve()
        } else {
          imageRef.current.addEventListener('load', resolve)
        }
      }),
    ]

    Promise.all(promises).then(() => {
      console.log('动效开始 =======>', current)
      if (current) {
        // setState({ group: 0, char: 0 })
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
            <motion.div
              layout={layout}
              className="relative z-10 rounded-lg shadow-xl text-slate-900 dark:text-slate-300 mx-auto sm:w-[23.4375rem]"
            >
              <motion.div
                layout={layout}
                className={clsx(
                  'bg-white rounded-lg overflow-hidden ring-1 ring-slate-900/5 dark:bg-slate-800 dark:highlight-white/5 dark:ring-0',
                  {
                    flex: false,
                    'p-8': false,
                    'text-center': false,
                  }
                )}
              >
                {/* 1. cicle */}
                <div></div>
                {/* 2. img */}
                <motion.div
                  layout={layout}
                  className={clsx('relative z-10 overflow-hidden flex-none', 'w-24', 'h-24')}
                >
                  <motion.img
                    ref={imageRef}
                    layout={layout}
                    // transition={TRANSITION}
                    src={require('img/sarah-dayan.jpg').default.src}
                    decoding="async"
                    // alt=""
                    className={clsx('absolute max-w-none object-cover bg-slate-100', {
                      'rounded-full': false,
                    })}
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
                </motion.div>
                {/* 3. text */}
                <motion.div layout={layout} className="pt-6">
                  <div className="mb-4">
                    <Words>
                      {/* `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  */}
                      “Tailwind CSS is the only framework that I&apos;ve seen scale on large teams.
                      It&rsquo;s easy to customize, adapts to any design, and the build size is
                      tiny.”
                    </Words>
                  </div>
                  <motion.div layout={layout} className="flex flex-col">
                    <motion.p layout={layout}>Sarah Dayan</motion.p>
                    <motion.p layout={layout}>Staff Engineer, Algolia</motion.p>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimateSharedLayout>
        </div>
      }
      right={
        <CodeWindow className="!h-auto max-h-[none]">
          <CodeWindow.Code
            ref={inViewRef}
            tokens={tokens}
            tokenComponent={HeroToken} // 将tokenProps传到了tokenComponent组件中，即传到了HeroToken组件中
            tokenProps={{
              currentGroup: state.group,
              currentChar: state.char,
              onCharComplete(charIndex) {
                // 每个字符完事后的处理
                // console.log('onCharComplete=', charIndex)
                if (!mounted.current) return
                setState((state) => ({ ...state, char: charIndex + 1 }))
              },
              async onGroupComplete(groupIndex) {
                // 每组样式完事后的处理
                console.log(
                  'onGroupComplete=',
                  groupIndex,
                  ranges[groupIndex + 1] && ranges[groupIndex + 1].immediate
                )
                if (!mounted.current) return
                // setStep(groupIndex)

                // if (groupIndex === 7) {
                //   if (!supportsMd) return
                //   await cursorControls.start({ opacity: 0.5, transition: { delay: 1 } })
                //   if (!mounted.current) return
                //   setWide(true)
                //   setIsMd(true)
                //   await cursorControls.start({ opacity: 0, transition: { delay: 0.5 } })
                // }

                if (!mounted.current) return

                if (ranges[groupIndex + 1] && ranges[groupIndex + 1].immediate) {
                  setState({ char: 0, group: groupIndex + 1 })
                } else {
                  window.setTimeout(() => {
                    if (!mounted.current) return
                    setState({ char: 0, group: groupIndex + 1 })
                  }, GROUP_DELAY)
                }
              },
            }}
          />
        </CodeWindow>
      }
    ></Layout>
  )
}

/**
 * ******** 代码动效的处理 ********
 */
function AnimatedToken({ isActiveToken, onComplete, children }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (visible) {
      onComplete()
    }
  }, [visible])

  useEffect(() => {
    if (isActiveToken) {
      setVisible(true)
      let id = window.setTimeout(() => {
        setVisible(true)
      }, CHAR_DELAY) // 控制代码动效的节奏，不然太快了
      return () => {
        window.clearTimeout(id)
      }
    }
  }, [isActiveToken])

  return (
    <>
      <span className={visible ? undefined : 'hidden'}>{children}</span>
    </>
  )
}

function HeroToken({ currentGroup, currentChar, onCharComplete, onGroupComplete, ...props }) {
  const { token } = props

  // ******** char: 开头的是需要动效的部分，即上面ranges参数，整体可以输出 augment(tokens)后的tokens参数值 ********
  if (token[0].startsWith('char:')) {
    // console.log('char: =>', token, token[0])
    // token[0] char:8:0
    // [NaN, 8, 0]
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

  // console.log('no char: =>', token)
  return <Token {...props} />
}

function Layout({ left, right }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-20 sm:mt-24 lg:mt-32 lg:grid lg:gap-8 lg:grid-cols-12 lg:items-center mb-[112rem]">
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
