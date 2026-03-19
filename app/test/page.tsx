"use client"

import Image from "next/image"
import { KetupatLebaran } from "@/components/icons"

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
  {
    png: "cute-kawaii-character-icon.png",
    svg: "cute-kawaii-character-icon.svg",
  },
]

export default function TestPage() {
  return (
    <div className="min-h-screen bg-zinc-100 p-8">
      <h1 className="text-2xl font-bold mb-2">Test PNG vs SVG</h1>
      <p className="text-zinc-500 mb-8">Compare transparency between PNG and SVG</p>

      {/* Icon Component Examples */}
      <section className="mb-12 p-6 bg-white rounded-xl border-3 border-black shadow-[4px_4px_0px_0px_#000000]">
        <h2 className="text-xl font-bold mb-4">Icon Component Examples</h2>
        <p className="text-zinc-500 mb-6">Use <code className="bg-zinc-100 px-2 py-1 rounded">KetupatLebaran</code> component anywhere in your app:</p>

        <div className="space-y-6">
          {/* Different Sizes */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-700 mb-3">Different Sizes</h3>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex flex-col items-center gap-1">
                <KetupatLebaran className="h-4 w-4 text-black" />
                <span className="text-xs text-zinc-500">h-4 w-4</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <KetupatLebaran className="h-5 w-5 text-black" />
                <span className="text-xs text-zinc-500">h-5 w-5</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <KetupatLebaran className="h-6 w-6 text-black" />
                <span className="text-xs text-zinc-500">h-6 w-6</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <KetupatLebaran className="h-8 w-8 text-black" />
                <span className="text-xs text-zinc-500">h-8 w-8</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <KetupatLebaran className="h-10 w-10 text-black" />
                <span className="text-xs text-zinc-500">h-10 w-10</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <KetupatLebaran className="h-12 w-12 text-black" />
                <span className="text-xs text-zinc-500">h-12 w-12</span>
              </div>
            </div>
          </div>

          {/* Different Colors */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-700 mb-3">Different Colors</h3>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex flex-col items-center gap-1">
                <div className="p-2 bg-white border-2 border-black rounded-lg">
                  <KetupatLebaran className="h-6 w-6 text-black" />
                </div>
                <span className="text-xs text-zinc-500">black</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="p-2 bg-white border-2 border-black rounded-lg">
                  <KetupatLebaran className="h-6 w-6" style={{ color: '#B9FF66' }} />
                </div>
                <span className="text-xs text-zinc-500">lime</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="p-2 bg-white border-2 border-black rounded-lg">
                  <KetupatLebaran className="h-6 w-6 text-red-500" />
                </div>
                <span className="text-xs text-zinc-500">red</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="p-2 bg-white border-2 border-black rounded-lg">
                  <KetupatLebaran className="h-6 w-6 text-blue-500" />
                </div>
                <span className="text-xs text-zinc-500">blue</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="p-2 bg-white border-2 border-black rounded-lg">
                  <KetupatLebaran className="h-6 w-6 text-purple-500" />
                </div>
                <span className="text-xs text-zinc-500">purple</span>
              </div>
            </div>
          </div>

          {/* In Buttons */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-700 mb-3">In Buttons</h3>
            <div className="flex items-center gap-3 flex-wrap">
              <button className="flex items-center gap-2 bg-white border-3 border-black px-4 py-2 rounded-lg shadow-[2px_2px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
                <KetupatLebaran className="h-4 w-4" />
                <span className="text-sm font-medium">Default</span>
              </button>
              <button className="flex items-center gap-2 bg-[#B9FF66] border-3 border-black px-4 py-2 rounded-lg shadow-[2px_2px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
                <KetupatLebaran className="h-4 w-4 text-black" />
                <span className="text-sm font-bold text-black">Primary</span>
              </button>
              <button className="flex items-center gap-2 bg-red-500 border-3 border-black px-4 py-2 rounded-lg shadow-[2px_2px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
                <KetupatLebaran className="h-4 w-4 text-white" />
                <span className="text-sm font-bold text-white">Danger</span>
              </button>
              <button className="flex items-center gap-2 bg-black border-3 border-black px-4 py-2 rounded-lg shadow-[2px_2px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
                <KetupatLebaran className="h-4 w-4 text-white" />
                <span className="text-sm font-bold text-white">Dark</span>
              </button>
            </div>
          </div>

          {/* Icon Only Buttons */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-700 mb-3">Icon Only Buttons</h3>
            <div className="flex items-center gap-3">
              <button className="p-2 bg-white border-3 border-black rounded-lg shadow-[2px_2px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
                <KetupatLebaran className="h-5 w-5" />
              </button>
              <button className="p-2 bg-[#B9FF66] border-3 border-black rounded-lg shadow-[2px_2px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
                <KetupatLebaran className="h-5 w-5 text-black" />
              </button>
              <button className="p-2 bg-black border-3 border-black rounded-lg shadow-[2px_2px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
                <KetupatLebaran className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>

          {/* Code Example */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-700 mb-3">Usage</h3>
            <pre className="bg-zinc-900 text-zinc-100 p-4 rounded-lg text-xs overflow-x-auto">
{`import { KetupatLebaran } from "@/components/icons"

// With text
<button className="flex items-center gap-2">
  <KetupatLebaran className="h-4 w-4" />
  <span>Click me</span>
</button>

// Icon only
<button>
  <KetupatLebaran className="h-5 w-5" />
</button>

// Custom color
<KetupatLebaran className="h-6 w-6" style={{ color: '#B9FF66' }} />`}
            </pre>
          </div>
        </div>
      </section>

      <h2 className="text-2xl font-bold mb-4 mt-12">PNG vs SVG Comparison</h2>

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
                      unoptimized
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
                      unoptimized
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
                      unoptimized
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
                      unoptimized
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
