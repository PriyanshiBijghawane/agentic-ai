
"use client";

import { Badge } from "@/components/ui/badge";
import { HoleBackground } from "@/components/animate-ui/components/backgrounds/HoleBackground";

import { BlueTitle, GrayTitle, SectionHeading, SectionLabel } from "@/components/reusable";
import { cn } from "@/lib/utils";
import { PricingTable, SignInButton, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FEATURES, PLACEHOLDERS, STEPS , SUGGESTIONS} from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight } from "lucide-react";

export default function Home() {

   const { isSignedIn } = useAuth()
     const router =useRouter();
     const textareaRef  = useRef<HTMLTextAreaElement>(null);
   const[prompt, setPrompt] = useState("");
   const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFocused, setIsFocused ] = useState(false);

  useEffect(() => {
    if (!isFocused || prompt) return;
    const t = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(t);
  }, [isFocused, prompt]);
  
  useEffect(() => {
    const el = textareaRef.current;
    if(!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }, [prompt]);

  const handleSubmit = () => {
    if (!prompt.trim() || !isSignedIn) return;
    router.push(`/workspace?prompt=${encodeURIComponent(prompt.trim())}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestion = (s: string) => {
    setPrompt(s);
    textareaRef.current?.focus();
  };

 
  return (
    <main className="min-h-screen bg-black selection:bg-white/20">
      <section className="relative min-h-screen flex flex-col items-center px-4 pb-24 pt-40 text-center">
       <HoleBackground 
      strokeColor="rgba(255, 255, 255,0.02)"
        className="absolute inset-0 h-full w-full"
        style={{
          maskImage:
"linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)",
        }}
      />
      <Badge variant={"outline"} className="gap-2 backdrop-blur-sm">
        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400"/>
        Powered by Gemini 3.5 Flash
      </Badge>
         <div
  className="
    absolute
    top-[58%]
    left-1/2
    -translate-x-1/2
    -translate-y-1/2
    h-[650px]
w-[650px]
rounded-full
bg-gradient-to-r
from-violet-500/45
via-blue-500/35
to-cyan-400/20
blur-[120px]
    -z-0
  "
/>
      <h1 className="mx-auto max-w-3xl text-balance font-serif text-5xl leading-tight tracking-tight sm:text-5xl lg:text-7xl z-10">
        <GrayTitle>From idea to innovation —</GrayTitle>
        <br/>
        <BlueTitle>powered by Vidhyora.</BlueTitle>
      </h1>

      <p className="mx-auto mt-6 max-w-xl text-balance text-base leading-relaxed
      text-slate/40 z-10">
       Describe your vision in plain language. Vidhyora transforms your
       prompt into intelligent applications, workflows, and experiences.
      </p>
      <div className="relative mx-auto mt-12 w-full max-w-2xl">
        <div className={cn(
          "rounded-3xl border border-white/10 bg-black/60 backdrop-blur-xl duration-200",
          isFocused ? " border-white/20 ring-1 ring-white/8"
        : "border-white/8" )}
        >
         <textarea  
          ref={textareaRef} 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          rows={1}
          className="w-full resize-none bg-transparent px-5 pb-4 pt-5 text-sm 
          placeholder:text-white/20 focus:outline-none sm:text-base"
          style={{ minHeight: 56, maxHeight: 200 }}
          placeholder={PLACEHOLDERS[placeholderIndex]}
         />
         
         <div className="flex items-center justify-between border-t border-white/6 
         px-4 py-2.5">
          <span className="text-xs text-white/20">
  Press ↵ to generate • Shift+↵ for new line
</span>

{isSignedIn?(
  <Button 
    onClick={handleSubmit}
    disabled={!prompt.trim()}
    className="h-8 rounded-full px-5 font-semibold"
    variant={prompt.trim() ? "default" : "secondary"}
  >
    Generate</Button>):(
    <SignInButton mode="modal">
      <Button className="h-8 rounded-full bg-white px-5 font-semibold">
        Generate
        <ArrowRight className="h-3.5 w-3.5" />
      </Button>
    </SignInButton>
  )
  }
         </div>
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {SUGGESTIONS.map((s) =>(
            <button
            key={s}
            onClick={() => handleSuggestion(s)}
            className="rounded-full border border-white/8 bg-white/4 px-3 py-1.5
            text-xs text-white/40 hover:border-white/15 hover:bg-white/8
            hover:text-white/70"
            >
             {s}
            </button>
          ))}
        </div>
        
      </div>
      <p className="mt-10 text-xs text-white/20">
        No credit card required. 10 free generatins on sign up
      </p>
      </section>
      <section className="px-4 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-lg bg-[#1a1a1a] shadow-2xl 
          overflow-hidden border border-white/5 ">
            <div className="bg-[#2a2a2a] px-4 py-3 flex 
            items-center gap-3 border-b border-white/5">
            
            <div className="flex gap-2">
              <div className="h-3 w-3 rounded-full
              bg-red-400"/>
              <div className="h-3 w-3 rounded-full
              bg-yellow-400"/>
              <div className="h-3 w-3 rounded-full
              bg-green-400"/>

            </div>
            <div className="flex-1 mx-4">
              <div className="bg-[#1a1a1a] rounded px-3 py-1.5
               text-xs text-white/40">
                app-builder.dev/workspace
              </div>
            </div>
            </div>
                {/* Browser Contnet*/}
            <div className="flex h-[600px] bg-[#0f0f0f]">

              
             {/* Left Panel */}
<div className="w-[28%] border-r border-white/5 flex flex-col">

  <div className="p-4 text-xs font-semibold text-white/60 border-b border-white/5">
    Chat
  </div>

  <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">

                <div className="flex justify-end">
                  <div className="max-w-xs bg-blue-600
                  rounded-lg px-3 py-2">

                    <div className="text-xs text-white">
                      Build me a task manager app with Kanban board and due date reminders.
                    </div>

                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="max-w-xs bg-[#1a1a1a]
                  border border-white/10 rounded-lg px-3
                  py-2">
                    <div className="text-xs text-white/70">
  I&apos;ll create a task manager with a
  Kanban board. Setting up the project...
</div>
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="max-w-xs bg-[#1a1a1a]
                  border border-white/10 rounded-lg px-3
                  py-2">
                    <div className="text-xs text-white/70">
                    Installing dependencies and generating 
                    components. This will be ready in a moment.
                    </div>

                  </div>
                </div>

                <div className="border-t border-white/5 p-3">
                <input 
               type ="text"
               placeholder="Type your message..."
                disabled
                className="w-full bg-[#1a1a1a] border
                border-white/10 rounded px-3 py-2 text-xs
                text-white/50 placeholder:text-white/20"/>
                </div>
                </div>

</div> {/* Left Panel End */}

{/* Right Panel */}
<div className="w-[72%] flex flex-col">
                {/*Tabs*/}
                <div className="border-b border-white/5 flex
                px-4 pt-3">
                  
                  <div className="text-xs font-semibold
                  text-white/60 pb-3 border-b-2 border-blue-500
                  text-white">
                    Preview
                  </div>
                  <div className="ml-4 text-xs font-semibold
                  text-white/40 pb-3">
                    Code
                  </div>
                  </div>

                <div className="flex-1 overflow-hidden p-6">
                    

                      <div className="grid grid-cols-3 gap-8 max-w-5xl">
                        <div className="flex-1 bg-[#1a1a1a]
                        rounded-lg border border-white/10 p-4 min-h-[320px]
                        ">
                          <div className="text-xs font-semibold
                          text-white/70 mb-3">
                            Todo
                          </div>
                          <div className="space-y-3">
  <div className="rounded-lg bg-[#252525] p-3 text-sm text-white/80">
    Design Dashboard UI
  </div>

  <div className="rounded-lg bg-[#252525] p-3 text-sm text-white/80">
    Implement Authentication
  </div>
  <div className="rounded-xl bg-[#232323] border border-white/5 p-4 text-sm text-white/90">
  Create API Routes
</div>
</div>
                        </div>

                        <div className="flex-1 bg-[#1a1a1a]
                        rounded-lg border border-white/10 p-4 min-h-[320px]
                        ">
                          <div className="text-xs font-semibold
                         text-white/70 mb-3">
                              In Progress
                         </div>
<div className="space-y-3">
  <div className="rounded-lg bg-[#252525] p-3 text-sm text-white/80">
    Build Kanban Drag & Drop
  </div>
</div>
                 </div>
                         
        <div className="flex-1 bg-[#1a1a1a] rounded-lg border border-white/10 p-4 min-h-[320px]">
                               <div className="text-xs font-semibold text-white/70 mb-3">
    Done
  </div>

  <div className="space-y-3">
  <div className="rounded-lg bg-[#252525] p-3 text-sm text-white/80">
    Setup Next.js Project
  </div>
</div>
</div>
                                  </div>
                    </div>
                  </div>
                  </div>
                </div>
              </div>

          
       

      </section>
      <section className="px-4 pb-32">
        <div className="mx-auto mb-14 max-w-5xl text-center">
          <SectionLabel>Everything you need</SectionLabel>
          <SectionHeading gray="From prompt" blue="to production."/>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-px overflow-hidden
        rounded-2xl border border-white/6 bg-white/6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, label, desc }) =>{
          return  (
            <div key={label}
             className="group bg-[#0a0a0a] p-7 hover:bg-[#0f0f0f]"
            >
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg 
              border border-white/8 bg-white/4 group-hover:border-white/15 
              group-hover:bg-white/8">
                <Icon className="h-4 w-4 text-white/60 group-hover:text-blue-400/70" />
              </div>
              <p className="mb-2 text-sm on-semibold">{label}</p>
            
              <p className="text-sm leading-relaxed text-white/60">{desc}</p>
            </div>
          );
          })}
        </div>
      </section>

       <section className="px-4 pb-32">
        <div className="mx-auto  max-w-3xl text-center">
          <SectionLabel>How it works</SectionLabel>
          <SectionHeading gray="Four steps" blue="to a working app."/>
        </div>

        <div className="mx-auto grid max-w-3xl ">
         {STEPS.map((step, i) => (
          <div key={step.number} className="flex gap-6">
            <div className="flex flex-col items-center">
            <div className="flex flex-col items-center justify-center
            rounded-full border border-white/10 bg-white/4">
              <span className="font-mpnp text-xs font-semibold text-white/50 ">
                {step.number}
              </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="mt-2 h-full w-px bg-white/6"/>
              )}
              </div>

             <div className="pb-10 pt-1.5">
              <p className="mb-1.5 text-sm font-semibold sm:text-base">
                {step.label}
              </p>
                          
              <p className=" text-sm leading-relaxed text-white/40">
                {step.desc}
              </p>
             </div>
          </div>
         ))}

        </div>
      </section>


       <section className="px-4 pb-32">
        <div className="mx-auto  max-w-3xl text-center">
          <SectionLabel>Simple pricing</SectionLabel>
          <SectionHeading gray="Start free" blue="scale when ready."/>
             
             
              <p className="mx-auto mt-4 max-w-sm text-sm text-white/35">
                No credit card required. Upgrade or downgrade anytime.
              </p>
                      
                  
          </div> 
        <div className="mx-auto max-w-5xl">
          <PricingTable
          checkoutProps={{
            appearance: {
              elements: {
                drawerRoot: {
                  zIndex: 2000,
                },
              },
            },
          }}
           />
        </div>
 </section>
        <section className="relative mx-auto mb-32 max-w-5xl overflow-hidden rounded-2xl
        border border-white/8 px-10 py-24 text-center">
     
           <HoleBackground 
      strokeColor="rgba(255, 255, 255,0.02)"
        className="absolute inset-0 h-full w-full"
        style={{
          maskImage:
"linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)",
        }}
      />
              <SectionHeading gray="Start building," blue="for free." />

              <p className="mb-8 text-sm leading-relaxed text-white/40">
              Get 10 free generations on sign up. No credit card required.
              <br/>
              Upgrade when you&apos;re ready.
              </p>

              <SignInButton mode="modal">
                <Button 
                size="lg"
                className="relative h-11 rounded-full bg-white px-8">
                  Get started free
                  <ChevronRight className="h-4 w-4"/>
                </Button>
              </SignInButton>
        </section>
      <footer className="realtive z-10 border-t border-white/7 py-12 mx-auto px-6
      flex flex-wrap items-center justify-center text-stone-400">
        Made with Priyanshi
      </footer>
    </main>
  );
}

