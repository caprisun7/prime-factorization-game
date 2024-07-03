import dynamic from 'next/dynamic'

const PrimeFactorizationGame = dynamic(() => import('@/components/PrimeFactorizationGame'), { ssr: false })

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <PrimeFactorizationGame />
    </main>
  )
}