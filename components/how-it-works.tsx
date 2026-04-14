interface Step {
  step: number
  title: string
  description: string
}

interface HowItWorksProps {
  steps: Step[]
  className?: string
}

export function HowItWorks({ steps, className }: HowItWorksProps) {
  return (
    <div className={className}>
      <div className="space-y-4">
        {steps.map((step) => (
          <div key={step.step} className="flex items-start gap-4">
            <div className="w-8 h-8 bg-[#B9FF66] rounded-full flex items-center justify-center text-black font-bold text-sm shrink-0 border-2 border-black dark:border-zinc-600">
              {step.step}
            </div>
            <div>
              <p className="font-medium text-zinc-900 dark:text-zinc-100">{step.title}</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
