"use client";

import { useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { HiArrowTrendingUp, HiUsers, HiBolt, HiTrophy } from "react-icons/hi2";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const stats = [
  {
    icon: HiArrowTrendingUp,
    value: "10,000+",
    label: "Icons Generated",
    description: "Custom icons created by our users",
  },
  {
    icon: HiUsers,
    value: "2,000+",
    label: "Active Users",
    description: "Designers and developers trust us",
  },
  {
    icon: HiBolt,
    value: "<3s",
    label: "Avg. Generation Time",
    description: "Lightning fast icon creation",
  },
  {
    icon: HiTrophy,
    value: "98%",
    label: "Satisfaction Rate",
    description: "Users love their generated icons",
  },
];

const caseStudies = [
  {
    title: "SaaS Startup",
    result: "50% faster",
    description: "Reduced design time by generating custom icons for their dashboard",
    metric: "Design Time",
  },
  {
    title: "E-commerce Platform",
    result: "200+ icons",
    description: "Created complete icon set for their marketplace in one day",
    metric: "Icons Generated",
  },
  {
    title: "Design Agency",
    result: "3x productivity",
    description: "Scaled their icon creation workflow for multiple clients",
    metric: "Client Projects",
  },
];

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (sectionRef.current) {
      gsap.from(".stat-card", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      });
    }
  }, []);

  return (
    <section id="showcase" ref={sectionRef} className="max-w-7xl mx-auto px-6 py-24 border-t-4 border-black dark:border-zinc-700 border-dashed">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="stat-card bg-card dark:bg-card p-6 lg:p-8 rounded-[20px] border-4 border-black dark:border-zinc-700 brutalist-shadow dark:shadow-[8px_8px_0px_0px_#444] text-center group hover:-translate-y-2 transition-transform"
          >
            <stat.icon className="w-10 h-10 mx-auto mb-4 text-[#B9FF66] bg-black rounded-full p-2" />
            <div className="text-4xl lg:text-5xl font-black tracking-tighter mb-2">
              {stat.value}
            </div>
            <div className="font-bold text-lg mb-1">{stat.label}</div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">{stat.description}</div>
          </div>
        ))}
      </div>

      {/* Case Studies Header */}
      <div className="mb-16 max-w-3xl">
        <Badge
          variant="outline"
          className="bg-card dark:bg-card text-black dark:text-white font-bold px-4 py-2 border-2 border-black dark:border-zinc-700 rounded-lg mb-6 transform rotate-2 brutalist-shadow-sm dark:shadow-[4px_4px_0px_0px_#444] text-base"
        >
          Success Stories
        </Badge>
        <h2 className="text-4xl lg:text-5xl font-black tracking-tighter leading-tight text-foreground">
          See how teams are using AI Icons to accelerate their workflow
        </h2>
      </div>

      {/* Case Studies Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {caseStudies.map((study, index) => (
          <div
            key={index}
            className="bg-black text-white p-10 rounded-[30px] border-4 border-black shadow-[8px_8px_0_0_#B9FF66] flex flex-col justify-between min-h-[350px] transform transition-transform hover:-translate-y-2"
          >
            <div>
              <div className="text-[#B9FF66] font-bold text-sm uppercase tracking-widest mb-4">
                {study.title}
              </div>
              <p className="text-xl leading-relaxed text-zinc-300 dark:text-zinc-400 font-medium mb-8">
                {study.description}
              </p>
            </div>
            <div>
              <div className="text-4xl font-black text-[#B9FF66] mb-2">
                {study.result}
              </div>
              <div className="text-zinc-500 font-bold">{study.metric}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
