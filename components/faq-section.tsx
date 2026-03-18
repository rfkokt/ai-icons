"use client"

import { useRef } from "react"
import { Accordion, AccordionItemWithWrapper as AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Section } from "@/components/section"
import { SectionBadge } from "@/components/section-badge"
import { HiQuestionMarkCircle } from "react-icons/hi2"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

interface FAQItem {
  id: string
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    id: "faq-1",
    question: "Apa itu AI Icon Generator?",
    answer: "AI Icon Generator adalah tool yang menggunakan kecerdasan buatan untuk membuat icon custom dari deskripsi text. C tulis apa yang kamu butuhkan, dan AI akan generate icon yang sesuai."
  },
  {
    id: "faq-2",
    question: "Format apa saja yang tersedia?",
    answer: "Kami support SVG, PNG, dan React component (.tsx). SVG direkomendasikan untuk scalability terbaik, PNG untuk kebutuhan spesifik, dan React component untuk langsung dipakai di project."
  },
  {
    id: "faq-3",
    question: "Apakah icon yang dihasilkan bisa untuk commercial use?",
    answer: "Ya! Semua icon yang kamu generate sepenuhnya milik kamu. Bisa digunakan untuk commercial project, client work, atau apapun kebutuhanmu tanpa attribution."
  },
  {
    id: "faq-4",
    question: "Bagaimana dengan kualitas icon?",
    answer: "Icon dihasilkan dalam high resolution (1024x1024 untuk PNG, vector untuk SVG). Kami terus improve model AI untuk hasil yang semakin bagus dan konsisten."
  },
  {
    id: "faq-5",
    question: "Apakah ada refund policy?",
    answer: "Kami menawarkan 3 icon gratis untuk trial. Jika setelah purchase kamu tidak puas, hubungi support dalam 7 hari untuk refund."
  },
  {
    id: "faq-6",
    question: "Bisa request custom style?",
    answer: "Untuk plan Enterprise, kami menawarkan custom model training. Style spesifik brand kamu bisa dipelajari AI untuk generate icon yang consistent."
  }
]

export default function FAQSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<HTMLDivElement>(null)

  // GSAP ScrollTrigger animation
  ;(async () => {
    if (typeof window === "undefined") return
    const { ScrollTrigger } = await import("gsap/ScrollTrigger")
    gsap.registerPlugin(ScrollTrigger)

    if (sectionRef.current && itemsRef.current) {
      // Header animation
      gsap.from(sectionRef.current.querySelector(".faq-header"), {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%"
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.2)"
      })

      // Accordion items stagger animation
      gsap.from(itemsRef.current.children, {
        scrollTrigger: {
          trigger: itemsRef.current,
          start: "top 80%"
        },
        y: 80,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "back.out(1.2)"
      })
    }
  })()

  return (
    <Section ref={sectionRef} size="default" border>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="faq-header text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <SectionBadge variant="primary" rotate={-2}>FAQ</SectionBadge>
            <HiQuestionMarkCircle className="w-8 h-8 text-[#B9FF66]" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tighter mb-4">
            Pertanyaan yang Sering<br />
            <span className="text-[#B9FF66]">Ditanyakan</span>
          </h2>
          <p className="text-lg text-zinc-600">
            Jawaban untuk pertanyaan umum seputar AI Icon Generator
          </p>
        </div>

        {/* Accordion */}
        <div ref={itemsRef}>
          <Accordion defaultValue="faq-1">
            {faqData.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger variant="brutalist">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent variant="brutalist">
                  <p className="text-base leading-relaxed">
                    {item.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* CTA untuk pertanyaan lain */}
        <div className="mt-12 text-center">
          <p className="text-zinc-600 mb-4">
            Masih punya pertanyaan?
          </p>
          <a
            href="mailto:support@aiicons.com"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-black rounded-xl brutalist-shadow-sm hover:shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-0.5 transition-all duration-300 font-bold"
          >
            Hubungi Support
            <HiQuestionMarkCircle className="w-5 h-5" />
          </a>
        </div>
      </div>
    </Section>
  )
}
