"use client"

import { useState, useEffect, useMemo } from "react"

interface PromptTemplate {
  template: string
  keywords: string[]
}

const PROMPT_TEMPLATES: PromptTemplate[] = [
  // Character-based
  { template: "{subject} as a brave warrior with sword and shield", keywords: ["warrior", "brave", "sword", "shield", "fantasy"] },
  { template: "{subject} as a cute kawaii character with big sparkly eyes", keywords: ["cute", "kawaii", "big eyes", "sparkly", "anime"] },
  { template: "{subject} wearing a fancy formal suit and bow tie", keywords: ["formal", "suit", "tuxedo", "fancy", "gentleman"] },
  { template: "{subject} as a ninja with mask and weapons", keywords: ["ninja", "mask", "stealth", "fighter"] },
  { template: "{subject} as a chef cooking in the kitchen", keywords: ["chef", "cooking", "kitchen", "food"] },
  { template: "{subject} dressed as a superhero with cape", keywords: ["superhero", "cape", "hero", "powerful"] },
  { template: "{subject} as a medieval knight in armor", keywords: ["knight", "armor", "medieval", "sword"] },
  { template: "{subject} as a pirate with treasure map", keywords: ["pirate", "treasure", "adventure", "map"] },
  { template: "{subject} as a wizard with magic staff", keywords: ["wizard", "magic", "staff", "fantasy", "spell"] },
  { template: "{subject} as a DJ at a party with headphones", keywords: ["DJ", "party", "music", "headphones", "fun"] },
  
  // Scene-based
  { template: "{subject} relaxing at the beach with sunglasses", keywords: ["beach", "vacation", "summer", "relax"] },
  { template: "{subject} celebrating birthday with cake and balloons", keywords: ["birthday", "celebration", "party", "cake"] },
  { template: "{subject} playing soccer at the stadium", keywords: ["soccer", "football", "sports", "stadium"] },
  { template: "{subject} exploring outer space with planets and stars", keywords: ["space", "astronaut", "planets", "stars", "cosmic"] },
  { template: "{subject} working in a cozy coffee shop", keywords: ["coffee", "cafe", "work", "cozy", "barista"] },
  { template: "{subject} dancing at a disco with disco ball", keywords: ["disco", "dance", "party", "70s", "retro"] },
  { template: "{subject} fishing by the lakeside at sunset", keywords: ["fishing", "sunset", "lake", "peaceful", "nature"] },
  { template: "{subject} riding a motorcycle on the highway", keywords: ["motorcycle", "speed", "highway", "adventure"] },
  { template: "{subject} studying in the library with books", keywords: ["study", "library", "books", "scholar"] },
  { template: "{subject} having a picnic in the park", keywords: ["picnic", "park", "nature", "relaxing"] },
  
  // Style-based
  { template: "{subject} in pixel art style retro game character", keywords: ["pixel", "retro", "8bit", "game"] },
  { template: "{subject} in chibi anime style with big head", keywords: ["chibi", "anime", "cute", "big head"] },
  { template: "{subject} as a realistic 3D rendered character", keywords: ["realistic", "3D", "render", "detailed"] },
  { template: "{subject} in graffiti street art style", keywords: ["graffiti", "street", "urban", "art"] },
  { template: "{subject} as a paper cutout craft design", keywords: ["paper", "cutout", "craft", "layered"] },
]

interface UsePromptSuggestionsOptions {
  minLength?: number
  maxSuggestions?: number
}

export function usePromptSuggestions(input: string, options?: UsePromptSuggestionsOptions) {
  const { minLength = 2, maxSuggestions = 6 } = options || {}
  
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const cleanedInput = useMemo(() => {
    return input.trim()
  }, [input])

  useEffect(() => {
    if (cleanedInput.length < minLength) {
      setSuggestions([])
      return
    }

    const generateSuggestions = () => {
      setIsLoading(true)
      
      // Extract the main subject from input
      const words = cleanedInput.toLowerCase().split(/\s+/)
      let mainSubject = words[words.length - 1] || cleanedInput.toLowerCase()
      
      // Capitalize for display
      const displaySubject = mainSubject.charAt(0).toUpperCase() + mainSubject.slice(1)
      
      // Find templates that match keywords in input
      const matchingTemplates = PROMPT_TEMPLATES.filter(template => {
        const inputLower = cleanedInput.toLowerCase()
        return template.keywords.some(keyword => 
          inputLower.includes(keyword) || keyword.includes(inputLower)
        )
      })
      
      // If no matches, pick random templates
      let selectedTemplates = matchingTemplates
      if (selectedTemplates.length === 0) {
        selectedTemplates = [...PROMPT_TEMPLATES].sort(() => Math.random() - 0.5).slice(0, maxSuggestions)
      } else {
        // Shuffle matching and add some random
        selectedTemplates = selectedTemplates.sort(() => Math.random() - 0.5).slice(0, Math.ceil(maxSuggestions * 0.7))
        const remaining = maxSuggestions - selectedTemplates.length
        if (remaining > 0) {
          const others = PROMPT_TEMPLATES
            .filter(t => !selectedTemplates.includes(t))
            .sort(() => Math.random() - 0.5)
            .slice(0, remaining)
          selectedTemplates = [...selectedTemplates, ...others]
        }
      }
      
      // Generate suggestions from templates
      const results = selectedTemplates.slice(0, maxSuggestions).map(template => {
        return template.template.replace("{subject}", displaySubject)
      })
      
      setTimeout(() => {
        setSuggestions(results)
        setIsLoading(false)
      }, 100)
    }

    const timeoutId = setTimeout(generateSuggestions, 300)
    
    return () => clearTimeout(timeoutId)
  }, [cleanedInput, minLength, maxSuggestions])

  return { suggestions, isLoading }
}
