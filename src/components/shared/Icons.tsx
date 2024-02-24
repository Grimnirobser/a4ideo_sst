import { LucideProps } from 'lucide-react'
import React from 'react'


export const Icons = {
  logo: (props: LucideProps) => (
    <svg
      {...props}
      viewBox="0 0 425.25 425.25"
    >
      <g>
        <path
          fill="#f00"
          d="M141.75 212.625V70.875C63.464 70.875 0 134.339 0 212.625h141.75z"
        ></path>
        <path
          fill="#00f"
          d="M283.5 212.625v141.75c78.286 0 141.75-63.464 141.75-141.75H283.5z"
        ></path>
        <path
          fill="#0ff"
          d="M283.5 212.625v141.75c-78.286 0-141.75-63.464-141.75-141.75H283.5z"
        ></path>
        <path
          fill="#ff0"
          d="M141.75 212.625V70.875c78.286 0 141.75 63.464 141.75 141.75H141.75z"
        ></path>
        <path fill="#00f" d="M283.5 70.875h141.75v141.75H283.5V70.875z"></path>
        <path fill="#f00" d="M0 212.625h141.75v141.75H0v-141.75z"></path>
      </g>
    </svg>
  ),

  title: (props: LucideProps) => (
    <svg
      {...props}
      viewBox="0 0 1967.59 425.25"
    >
      <g>
      <path fill="#f00" d="M0 207.562h210.704v212.625H0V207.562z"></path>
        <path fill="#00f" d="M421.408 0h210.704v212.625H421.408V0z"></path>
        <path
          fill="#f00"
          d="M210.704 212.625V0C94.335 0 0 95.195 0 212.625h210.704z"
        ></path>
        <path
          fill="#00f"
          d="M421.408 212.625V425.25c116.368 0 210.704-95.195 210.704-212.625H421.408z"
        ></path>
        <path
          fill="#0ff"
          d="M421.408 212.625V425.25c-116.369 0-210.704-95.195-210.704-212.625h210.704z"
        ></path>
        <path
          fill="#ff0"
          d="M210.704 212.625V0c116.369 0 210.704 95.195 210.704 212.625H210.704z"
        ></path>
        <text
          fill="#f00"
          fontFamily="AdobeDevanagari-Bold"
          fontSize="400"
          transform="translate(662.006 54.327)"
        >
          <tspan x="0" y="288" textLength="255.664">
            A
          </tspan>
          <tspan x="255.664" y="288" fill="#0f0" textLength="133.203">
            I
          </tspan>
          <tspan x="388.867" y="288" fill="#00f" textLength="259.57">
            V
          </tspan>
          <tspan x="634.766" y="288" fill="#000" textLength="657.617">
            ideo
          </tspan>
        </text>
      </g>
    </svg>
  ),
}
