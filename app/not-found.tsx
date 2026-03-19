import Link from 'next/link'
import { HiArrowLeft } from 'react-icons/hi2'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f3f4f6] bg-grid-pattern flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border-4 border-black rounded-[24px] shadow-[8px_8px_0_0_#000000] p-8 text-center">
        <h1 className="text-8xl sm:text-[120px] font-black text-[#B9FF66] mb-2 leading-none" style={{ WebkitTextStroke: '4px black' }}>
          404
        </h1>
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-4">Page Not Found</h2>
        <p className="text-zinc-600 font-medium mb-8 text-sm sm:text-base">
          The icon you're looking for must have been deleted, or this url doesn't exist. Get back to generating.
        </p>
        <Link href="/">
          <Button className="w-full h-14 bg-black text-white hover:bg-[#B9FF66] hover:text-black border-2 border-black rounded-xl text-lg font-bold transition-all shadow-[4px_4px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] hover:translate-y-0.5 hover:translate-x-0.5 uppercase tracking-wide">
            <HiArrowLeft className="mr-2 h-6 w-6" /> Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
