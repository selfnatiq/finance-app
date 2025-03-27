import type * as React from "react"

export function ChfIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M8 16h12" />
      <path d="M10 12h10" />
      <path d="M4 4v14a2 2 0 0 0 2 2h2" />
      <path d="M4 8h12" />
    </svg>
  )
}

