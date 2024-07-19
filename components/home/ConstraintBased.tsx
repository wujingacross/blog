import { useState } from 'react'
import defaultConfig from 'defaultConfig'
import { IconContainer, Caption, BigText, Widont, Paragraph, Link } from 'components/home/common'
import { Tabs } from 'components/Tabs'
import { GridLockup } from 'components/GridLockup'

type ConstraintBasedProps = {}

const tabs = {
  Sizing: (selected) => (
    <>
      <rect
        x="5"
        y="5"
        width="28"
        height="28"
        rx="4"
        fill="currentColor"
        fillOpacity={selected ? '.1' : '0'}
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M5 41h28M33 39v4M5 39v4M39 5h4M39 33h4M41 33V5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  Colors: (selected) => (
    <>
      <path
        d="M17.687 42.22 40.57 29.219a4 4 0 0 0 1.554-5.36L39 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M27.477 7.121a1 1 0 1 0-.954 1.758l.954-1.758Zm5.209 3.966.477-.879-.477.88Zm1.555 5.515-.866-.5-.003.006.87.494ZM26.523 8.88l5.686 3.087.954-1.758-5.686-3.087-.954 1.758Zm6.849 7.23-12.616 22.21 1.738.987 12.617-22.21-1.74-.988Zm-1.163-4.143a3 3 0 0 1 1.166 4.136l1.732 1a5 5 0 0 0-1.944-6.894l-.954 1.758Z"
        fill="currentColor"
      />
      <path
        d="M5 9a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v25a9 9 0 1 1-18 0V9Z"
        fill="currentColor"
        fillOpacity={selected ? '.1' : '0'}
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle
        cx="14"
        cy="34"
        r="3"
        fill={selected ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </>
  ),
  Typography: (selected) => (
    <>
      <path
        d="M5 13a8 8 0 0 1 8-8h22a8 8 0 0 1 8 8v22a8 8 0 0 1-8 8H13a8 8 0 0 1-8-8V13Z"
        fill="currentColor"
        fillOpacity={selected ? '.1' : '0'}
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M15.5 25h9M13 31l5.145-12.748c.674-1.67 3.036-1.67 3.71 0L27 31"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M31 13s2 0 2 1.833v18.334C33 35 31 35 31 35M35 13s-2 0-2 1.833v18.334C33 35 35 35 35 35M31 24h4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </>
  ),
  Shadows: (selected) => (
    <>
      <path
        d="M24 43c10.493 0 19-8.507 19-19S34.493 5 24 5m-4 .422C11.427 7.259 5 14.879 5 24c0 9.121 6.427 16.741 15 18.578"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M24 42.819V5.181c0-.1.081-.181.181-.181C34.574 5 43 13.607 43 24c0 10.394-8.426 19-18.819 19a.181.181 0 0 1-.181-.181Z"
        fill="currentColor"
        fillOpacity={selected ? '.1' : '0'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M28 10h3M28 14h7M28 18h10M28 22h11M28 26h10M28 30h9M28 34h7M28 38h3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </>
  ),
}

function Bars({ sizes, className = '' }) {
  return (
    <div className={`relative font-mono text-xs pt-6 space-y-4 ${className}`}>
      {sizes.map((size) => (
        <div
          key={size}
          className="h-6 origin-left bg-white ring-slate-700/5 shadow px-1 flex items-center dark:bg-indigo-500 dark:text-white dark:highlight-white/10"
          style={{ width: defaultConfig.theme.width[size], borderRadius: 4 }}
        >
          <div className="flex-none w-0.5 h-1 bg-slate-300 dark:bg-white" />
          <span className="flex-auto text-center">w-{size}</span>
          <div className="w-0.5 h-1 bg-slate-300 dark:bg-white" />
        </div>
      ))}
    </div>
  )
}

function Sizing() {
  return (
    <>
      <Bars
        sizes={[96, 80, 72, 64, 60, 56, 52, 48]}
        className="hidden sm:block lg:hidden xl:block"
      />
      <Bars sizes={[64, 60, 56, 52, 48, 44, 40, 36]} className="sm:hidden lg:block xl:hidden" />
    </>
  )
}

const ConstraintBased: React.FC<ConstraintBasedProps> = () => {
  const [tab, setTab] = useState('Sizing')

  return (
    <section id="constraint-based" className="relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div>
          <IconContainer
            light={require('img/icons/home/constraint-based.png').default.src}
            dark={require('img/icons/home/dark/constraint-based.png').default.src}
          />
          <Caption className="text-indigo-500 dark:text-indigo-400">Constraint-based</Caption>
        </div>
        <div>
          <BigText>
            <Widont>An API for your design system.</Widont>
          </BigText>
          <Paragraph>
            Utility classes help you work within the constraints of a system instead of littering
            your stylesheets with arbitrary values. They make it easy to be consistent with color
            choices, spacing, typography, shadows, and everything else that makes up a
            well-engineered design system.
          </Paragraph>
        </div>
        <Link href="/docs/utility-first" color="indigo" darkColor="gray">
          learn more<span className="sr-only">, utility-first fundamentals</span>
        </Link>
        <div className="mt-10">
          <Tabs
            tabs={tabs}
            selected={tab}
            onChange={(tab) => setTab(tab)}
            className="text-indigo-600 dark:text-indigo-400"
            iconClassName="text-indigo-500 dark:text-indigo-400"
          />
        </div>
      </div>
      <GridLockup
        className="mt-10 xl:mt-2"
        left={
          <div className="relative bg-white rounded-lg shadow-xl px-6 py-5 my-auto xl:mt-18 dark:bg-slate-800">
            {/* 上下两条边线 */}
            <div className="absolute inset-x-0 inset-y-5 border-t border-b border-slate-100 pointer-events-none dark:border-slate-700" />
            {/* 左右两条边线 */}
            <div className="absolute inset-x-6 inset-y-0 border-l border-r border-slate-100 pointer-events-none dark:border-slate-700" />
            {/* 中间区域 */}
            <div className="bg-slate-50 flex overflow-hidden h-[22rem] dark:bg-slate-900/50">
              <div className="relative bg-white/40 w-64 sm:w-[28rem] lg:w-64 xl:w-[28rem] mx-auto border-r border-slate-100 dark:bg-transparent dark:border-slate-100/5">
                {/* 背景-虚线实线间隔线条 白天 */}
                <div
                  className="absolute inset-0 dark:hidden"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 6'%3E%3Crect x='32' width='1' height='1' fill='%23cbd5e1'/%3E%3Crect width='1' height='6' fill='%23f1f5f9'/%3E%3C/svg%3E")`,
                    backgroundSize: '4rem 0.375rem',
                  }}
                />
                {/* 背景-虚线实线间隔线条 夜间 */}
                <div
                  className="hidden absolute inset-0 opacity-5 dark:block"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 6'%3E%3Crect x='32' width='1' height='1' fill='%23f1f5f9'/%3E%3Crect width='1' height='6' fill='%23f1f5f9'/%3E%3C/svg%3E")`,
                    backgroundSize: '4rem 0.375rem',
                  }}
                />
                {/* 实际内容 */}
                {tab === 'Sizing' && <Sizing key="sizing" />}
              </div>
            </div>
          </div>
        }
        right={<div>right</div>}
      />
    </section>
  )
}

export default ConstraintBased
