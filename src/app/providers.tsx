// app/providers.tsx
'use client'
import { MantineProvider } from '@mantine/core';

import { ChakraProvider } from '@chakra-ui/react'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'

export function Providers({ children, session }: { children: React.ReactNode, session: Session | null }) {

  return (
    <ChakraProvider>

      <MantineProvider>
        <SessionProvider session={session}>

          {children}
        </SessionProvider>

      </MantineProvider>
    </ChakraProvider>
  )
}
