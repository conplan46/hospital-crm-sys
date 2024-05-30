// app/providers.tsx
'use client'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ChakraProvider } from '@chakra-ui/react'
import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
export function Providers({ children, session }: { children: React.ReactNode, session: Session | null }) {
	const queryClient = new QueryClient()
	return (
		<QueryClientProvider client={queryClient}>
			<ChakraProvider>

				<SessionProvider session={session}>

					{children}
				</SessionProvider>

			</ChakraProvider>
		</QueryClientProvider>
	)
}
