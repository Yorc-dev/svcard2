/// <reference types="vite/client" />
declare module '*.jsx' {
  import React from 'react'
  const Component: React.ComponentType<any>
  export default Component
}

declare module '*.js' {
  const content: any
  export const logo: any
  export const sygnet: any
}