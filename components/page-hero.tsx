import { IconType } from "react-icons"
import { BrutalistIconBox } from "./brutalist-icon-box"

interface PageHeroProps {
  icon: IconType
  title: string
  description: string
  action?: React.ReactNode
}

export function PageHero({ icon: Icon, title, description, action }: PageHeroProps) {
  return (
    <div className="text-center mb-6 lg:mb-8">
      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#B9FF66] rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 border-2 border-black brutalist-shadow-sm">
        <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-black" />
      </div>
      <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 mb-2">
        {title}
      </h1>
      <p className="text-zinc-500 text-sm sm:text-base max-w-md px-4">
        {description}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
