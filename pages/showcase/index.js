import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import { showcase } from 'utils/showcase'
import { Footer } from 'components/Footer'

function Bg() {
    return (
        <>
            <Image
                src={require('img/showcase/beams@75.jpg')}
                alt=""
                className="hidden dark:sm:hidden sm:block absolute top-[-6.25rem] left-1/2 max-w-none w-[67.8125rem] ml-[-46.875rem] pointer-events-none"
                priority
                unoptimized
            />
            <Image
                src={require('img/showcase/beams-index-dark@75.jpg')}
                alt=""
                className="hidden dark:block absolute top-[-5rem] left-1/2 max-w-none w-[41.1875rem] ml-[-40rem] pointer-events-none"
                priority
                unoptimized
            />
        </>
    )
}

function Site({ site, priority = false }) {
    let videoContainerRef = useRef()
    let videoRef = useRef()
    let videoDarkRef = useRef()
    let state = useRef('idle')

    /**
     * 视频播放逻辑
     * 视频播放状态初始值为：idle
     * 鼠标进入li标签，更新视频播放状态为playing同时播放、显示视频， 鼠标离开li标签，更新视频播放状态为leaving同时动画0.5s隐藏视频, 隐藏视频动态结束时更新视频播放状态为初始值idle同时视频进度回到第一帧
     * looping状态是鼠标刚离开li标签但是又在隐藏视频动画结束之前又进行了鼠标进入场景，这时候依旧需要从第一帧开始播放视频
     */

    function onEnded() {
        state.current = 'looping'
        hideVideo()
    }

    function forceLayout() {
        void videoRef.current.offsetWidth
    }

    function showVideo() {
        forceLayout()
        videoContainerRef.current.style.opacity = 1
        videoContainerRef.current.style.transition = ''
    }

    function hideVideo(durationSeconds = 0.5) {
        forceLayout()
        videoContainerRef.current.style.opacity = 0
        videoContainerRef.current.style.transition = `opacity ${durationSeconds}s linear`
    }

    function getVideo() {
        // 是否是暗夜模式
        return site.dark && document.documentElement.classList.contains('dark')
            ? videoDarkRef.current
            : videoRef.current
    }


    return (
        <li className='group relative rounded-3xl bg-slate-50 p-6 dark:bg-slate-800/80 dark:highlight-white/5 hover:bg-slate-100 dark:hover:bg-slate-700/50'
            onMouseEnter={() => {
                console.log('onMouseEnter', state.current)
                if (state.current === 'idle') {
                    state.current = 'playing'
                    getVideo().play()
                    showVideo()
                } else if (state.current === 'leaving') {
                    state.current = 'looping'
                }

            }}
            onMouseLeave={() => {
                console.log('onMouseLeave', state.current)
                state.current = 'leaving'
                hideVideo()
            }}
        >
            <div className='relative aspect-[672/494] rounded-md overflow-hidden transform shadow-[0_2px_8px_rgba(15,23,42,0.08)] bg-slate-200 dark:bg-slate-700'>
                <Image
                    src={site.thumbnail}
                    alt=""
                    className={clsx('absolute inset-0 w-full h-full', site.dark && 'dark:hidden')}
                    priority={priority}
                    unoptimized
                />
                {site.dark && (
                    <Image
                        src={site.dark.thumbnail}
                        alt=""
                        className="absolute inset-0 w-full h-full hidden dark:block"
                        priority={priority}
                        unoptimized
                    />
                )}
                <div ref={videoContainerRef}
                    onTransitionEnd={() => {
                        console.log('videoContainerRef onTransitionEnd', state.current)
                        if (state.current === 'leaving') {
                            state.current = 'idle'
                            getVideo().currentTime = 0
                            getVideo().pause()
                        } else if (state.current === 'looping') {
                            state.current = 'playing'
                            getVideo().currentTime = 0
                            getVideo().play()
                            showVideo()
                        }
                    }}>
                    <video
                        ref={videoRef}
                        preload="none"
                        muted
                        playsInline
                        className={clsx(
                            'absolute inset-0 w-full h-full [mask-image:radial-gradient(white,black)]',
                            site.dark && 'dark:hidden'
                        )}
                        onEnded={onEnded}
                    >
                        <source src={site.video} type={site.videoType ?? 'video/mp4'} />
                    </video>
                    {site.dark && (
                        <video
                            ref={videoDarkRef}
                            preload="none"
                            muted
                            playsInline
                            className='absolute inset-0 w-full h-full [mask-image:radial-gradient(white,black)] hidden dark:block'
                        >
                            <source src={site.dark.video} type={site.videoType ?? 'video/mp4'} />
                        </video>
                    )}
                </div>
            </div>
            <div className='mt-6 flex flex-wrap items-center'>
                <h2 className='text-sm leading-6 text-slate-900 dark:text-white font-semibold group-hover:text-sky-500 dark:group-hover:text-sky-400'>
                    <Link href={`/showcase/${site.slug}`}>{site.name}</Link>
                </h2>
                {/* group-hover 在group组悬浮的时候就显示这个svg, 如果只是单纯的hover,只有在svg本身悬浮的时候才会进行显示 */}
                <svg
                    className="w-6 h-6 flex-none opacity-0 group-hover:opacity-100"
                    viewBox="0 0 24 24"
                    fill="none"
                >
                    <path
                        d="M9.75 15.25L15.25 9.75M15.25 9.75H10.85M15.25 9.75V14.15"
                        stroke="#0EA5E9"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                <p className="w-full flex-none text-[0.8125rem] leading-6 text-slate-500 dark:text-slate-400">
                    {site.description}
                </p>
            </div>
        </li>
    )
}

export default function Showcase() {
    return (
        <>
            <main className="mt-16 sm:mt-20 relative">
                <Bg />
                <div className='relative max-w-3xl px-4 sm:px-6 lg:px-8 mx-auto sm:text-center'>
                    <h1 className='text-sm leading-6 font-semibold text-sky-500'>Showcase</h1>
                    <p className='mt-6 text-[2.5rem] leading-none sm:text-6xl tracking-tight font-bold text-slate-900 dark:text-white'>You can build anything with Tailwind CSS.</p>
                    <p className='mt-4 text-lg text-slate-600 dark:text-slate-400'>Well not quite <em>anything</em>, like you can't build a spaceship with it. But you can
                        definitely build the website for the spaceship —{' '}
                        <Link
                            href="/showcase/nasa"
                            className="font-semibold border-b border-sky-300 text-gray-900 hover:border-b-2 dark:text-white dark:border-sky-400"
                        >
                            NASA did
                        </Link>
                        .
                    </p>
                </div>
                <ul className='relative grid max-w-[26rem] sm:max-w-[52.5rem] mt-16 sm:mt-20 md:mt-32 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-auto gap-6 lg:gap-y-8 xl:gap-x-8 lg:max-w-7xl px-4 sm:px-6 lg:px-8'>
                    {showcase.map((site, siteIndex) => {
                        return <Site key={site.name} site={site} priority={siteIndex < 6} />
                    })}
                </ul>
            </main>
            <Footer className="mt-32" /></>
    )
}

Showcase.layoutProps = {
    meta: {
        title: 'Example Showcase',
        description:
            'Beautiful websites built with Tailwind CSS, including marketing sites, SaaS applications, ecommerce stores, and more.',
        ogImage: require('img/showcase/og.jpg'),
    },
}
