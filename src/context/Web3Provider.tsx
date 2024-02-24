"use client";

import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { cookieStorage, createStorage } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { ReactNode } from 'react'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { WagmiProvider } from 'wagmi'



export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID
if (!projectId) throw new Error('Project ID is not defined')
 
const metadata = {
  name: 'A4ideo',
  description: 'A4ideo is an interactive fragment learning gathering.',
  url: process.env.NEXT_PUBLIC_SERVER_URL!, // origin must match your domain & subdomain
  icons: ['/a4ideo_logo.ico']
}

// Create wagmiConfig
export const Web3config = defaultWagmiConfig({
    chains: [mainnet, sepolia], // required
    projectId, // required
    metadata, // required
    ssr: true,
    storage: createStorage({
        storage: cookieStorage
    }),
    enableWalletConnect: true, // Optional - true by default
    enableInjected: true, // Optional - true by default
    enableEIP6963: true, // Optional - true by default
    enableCoinbase: true, // Optional - true by default
})

const queryClient = new QueryClient()

createWeb3Modal({
    wagmiConfig: Web3config,
    projectId: projectId!,
    enableAnalytics: true, // Optional - defaults to your Cloud configuration
    themeVariables: {
      '--w3m-font-size-master': '10px',
      '--w3m-accent': '#0349fc',
      '--w3m-border-radius-master': '0.1rem',
    }
  })

export function Web3provider({
  children,
}: {
  children: ReactNode
}) {
  return (
    <WagmiProvider config={Web3config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
