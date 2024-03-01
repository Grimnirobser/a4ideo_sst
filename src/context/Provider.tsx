'use client'

import { PropsWithChildren, useState } from 'react'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import React, { ReactNode } from 'react'


const Providers = ({ children }: PropsWithChildren) => {
  const queryClient =  new QueryClient()


  return (
    <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
  )
}

export default Providers
