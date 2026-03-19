import Link from 'next/link'
import { HiLockClosed } from 'react-icons/hi2'
import { Button } from '@/components/ui/button'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-[#f3f4f6] bg-grid-pattern flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border-4 border-black rounded-[24px] shadow-[8px_8px_0_0_#000000] p-8 text-center flex flex-col items-center">
        <div className="w-24 h-24 mb-6 bg-[#B9FF66] flex items-center justify-center rounded-3xl border-4 border-black shadow-[4px_4px_0_0_#000000] -rotate-3">
          <HiLockClosed className="w-12 h-12 text-black" />
        </div>
        <h1 className="text-8xl sm:text-[100px] font-black text-black mb-2 leading-none tracking-tighter">401</h1>
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight mb-4 text-red-600">Unauthorized Access</h2>
        <p className="text-zinc-600 font-medium mb-8 text-sm sm:text-base">
          You don't have the required brutalist credentials to view this page. Login first.
        </p>
        <Link href="/dashboard" className="w-full">
          <Button className="w-full h-14 bg-black text-white hover:bg-[#B9FF66] hover:text-black border-2 border-black rounded-xl text-lg font-bold transition-all shadow-[4px_4px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] hover:translate-y-0.5 hover:translate-x-0.5 uppercase tracking-wide">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}
