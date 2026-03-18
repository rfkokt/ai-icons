"use client"

import Image from "next/image"

const icons = [
  {
    png: "chicken-belanja-di-alfamart-bawa-stroller-belanjaan-dengan-wajah-happy-tapi-bawa-senjata-dan-nodong-orang-1.png",
    svg: "chicken-belanja-di-alfamart-bawa-stroller-belanjaan-dengan-wajah-happy-tapi-bawa-senjata-dan-nodong-orang-1.svg",
  },
  {
    png: "chicken-belanja-di-alfamart-bawa-stroller-belanjaan-dengan-wajah-happy-tapi-bawa-senjata-dan-nodong-orang-2.png",
    svg: "chicken-belanja-di-alfamart-bawa-stroller-belanjaan-dengan-wajah-happy-tapi-bawa-senjata-dan-nodong-orang-2.svg",
  },
  {
    png: "chicken-belanja-di-alfamart-bawa-stroller-belanjaan-dengan-wajah-happy-tapi-bawa-senjata-dan-nodong-orang-3.png",
    svg: "chicken-belanja-di-alfamart-bawa-stroller-belanjaan-dengan-wajah-happy-tapi-bawa-senjata-dan-nodong-orang-3.svg",
  },
]

export default function TestPage() {
  return (
    <div className="min-h-screen bg-zinc-100 p-8">
      <h1 className="text-2xl font-bold mb-2">Test PNG vs SVG</h1>
      <p className="text-zinc-500 mb-8">Compare transparency between PNG and SVG</p>
      
      <div className="space-y-12">
        {icons.map((icon, idx) => (
          <div key={idx}>
            <h2 className="text-lg font-semibold mb-4">Icon {idx + 1}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* PNG */}
              <div>
                <h3 className="text-sm font-medium text-zinc-600 mb-2">PNG + Checkerboard</h3>
                <div className="rounded-xl border-3 border-black shadow-[4px_4px_0px_0px_#000000] overflow-hidden inline-block">
                  <div className="relative w-64 h-64">
                    <div className="checkerboard absolute inset-0 z-0" />
                    <Image 
                      src={`/test-icons/new/${icon.png}`} 
                      alt={icon.png} 
                      fill
                      className="object-contain relative z-10"
                    />
                  </div>
                </div>
              </div>

              {/* SVG */}
              <div>
                <h3 className="text-sm font-medium text-zinc-600 mb-2">SVG + Checkerboard</h3>
                <div className="rounded-xl border-3 border-black shadow-[4px_4px_0px_0px_#000000] overflow-hidden inline-block">
                  <div className="relative w-64 h-64">
                    <div className="checkerboard absolute inset-0 z-0" />
                    <Image 
                      src={`/test-icons/new/${icon.svg}`} 
                      alt={icon.svg} 
                      fill
                      className="object-contain relative z-10"
                    />
                  </div>
                </div>
              </div>

            </div>
            
            {/* On Green Background */}
            <div className="mt-4">
              <h3 className="text-sm font-medium text-zinc-600 mb-2">On Green Background (PNG | SVG)</h3>
              <div className="flex gap-4">
                <div className="rounded-xl border-3 border-black shadow-[4px_4px_0px_0px_#000000] overflow-hidden bg-green-400">
                  <div className="relative w-32 h-32">
                    <Image 
                      src={`/test-icons/new/${icon.png}`} 
                      alt={icon.png} 
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="rounded-xl border-3 border-black shadow-[4px_4px_0px_0px_#000000] overflow-hidden bg-green-400">
                  <div className="relative w-32 h-32">
                    <Image 
                      src={`/test-icons/new/${icon.svg}`} 
                      alt={icon.svg} 
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
