import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Footer() {
  const navigation = [
    { name: "Documentation", href: "/docs" },
    { name: "Demo", href: "https://demo.nodedrop.app/" },
    { name: "GitHub", href: "https://github.com/naumanahmed19/node-drop" },
  ];

  const social = [
    { name: "Twitter", href: "https://x.com/ausrobdev" },
    { name: "GitHub", href: "https://github.com/naumanahmed19/node-drop" },
  ];

  const legal = [
    { name: "License", href: "/license" },
    { name: "Privacy Policy", href: "/privacy" },
  ];

  return (
    <footer className="flex flex-col items-center gap-14 pt-28 lg:pt-32">
      <div className="container space-y-3 text-center">
        <h2 className="text-2xl tracking-tight md:text-4xl lg:text-5xl">
          Start building with NodeDrop today
        </h2>
        <p className="text-muted-foreground mx-auto max-w-xl leading-snug text-balance">
          NodeDrop is an open source workflow editor built on top of ReactFlow.
          Free to use, customize, and contribute.
        </p>
        <div>
          <Button size="lg" className="mt-4" asChild>
            <a href="https://github.com/naumanahmed19/node-drop">
              Get Started on GitHub
            </a>
          </Button>
        </div>
      </div>

      <nav className="container flex flex-col items-center gap-4">
        <ul className="flex flex-wrap items-center justify-center gap-6">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="font-medium transition-opacity hover:opacity-75"
              >
                {item.name}
              </Link>
            </li>
          ))}
          {social.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="flex items-center gap-0.5 font-medium transition-opacity hover:opacity-75"
              >
                {item.name} <ArrowUpRight className="size-4" />
              </Link>
            </li>
          ))}
        </ul>
        <ul className="flex flex-wrap items-center justify-center gap-6">
          {legal.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="text-muted-foreground text-sm transition-opacity hover:opacity-75"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="text-primary relative mt-10 w-full overflow-hidden md:mt-14 lg:mt-20">
        <svg
          viewBox="0 0 800 150"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <text
            x="400"
            y="100"
            textAnchor="middle"
            className="font-display text-[120px] font-bold"
            fill="currentColor"
          >
            nodedrop
          </text>
        </svg>


        <div className="from-background pointer-events-none absolute inset-0 bg-gradient-to-t from-0% to-80% to-transparent" />
        <div className="from-background pointer-events-none absolute inset-0 bg-gradient-to-t from-0% to-80% to-transparent" />
        <div className="from-background pointer-events-none absolute inset-0 bg-gradient-to-t from-0% to-80% to-transparent" />
        <div className="from-background pointer-events-none absolute inset-0 bg-gradient-to-t from-0% to-80% to-transparent" />
        <div className="from-background pointer-events-none absolute inset-0 bg-gradient-to-t from-0% to-80% to-transparent" />
        <div className="from-background pointer-events-none absolute inset-0 bg-gradient-to-t from-0% to-80% to-transparent" />
      </div>
    </footer>
  );
}
