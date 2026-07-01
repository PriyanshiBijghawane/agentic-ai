"use client";

import { Message, StatusStep } from '@/types/workspace';
import React, { useEffect, useRef, useState } from 'react';
import { BlueTitle } from './reusable';
import PrincipalModal from './PricingModal';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { ArrowUp, Check, Loader2, Eye, Mic } from 'lucide-react';

interface ChatPanelProps {
  messages: Message[];
  isGenerating: boolean;
  isImproving: boolean;
  statusLog: StatusStep[];
  credits: number;
  initialPrompt: string | null;
  onGenerate: (prompt: string, imageUrl?: string) => Promise<void>;
  userId: string;
  workspaceId: string | null;
  onStop: () => void;
  appTitle: string | null;
}

const ChatPanel = ({
  messages,
  isGenerating,
  isImproving,
  statusLog,
  credits,
  initialPrompt,
  onGenerate,
  userId,
  workspaceId,
  onStop,
  appTitle,
}: ChatPanelProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);

  const noCredits = credits <= 0;
  const canSubmit =
    input.trim().length > 0 && !isGenerating && !isImproving && !noCredits;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, isGenerating, isImproving]);

  const handleSubmit = async () => {
    const trimmed = input.trim();
    if (!trimmed || isGenerating || isImproving || noCredits) return;
    setInput("");
    await onGenerate(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const startVoiceInput = () => {
    console.log("Voice input triggered");
    // TODO: integrate speech-to-text here
  };

  return (
    <div className="flex w-[360px] shrink-0 flex-col bg-[#0d0d0d]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/6 px-4 py-3">
        <BlueTitle>{appTitle}</BlueTitle>
        <PrincipalModal reason={noCredits ? "credits" : "Upgrade"}>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[11px] transition-colors",
              noCredits
                ? "bg-red-500/15 text-red-400/80 hover:bg-red-500/25"
                : "bg-white/6 text-white/30 hover:bg-white/10 hover:text-white/50"
            )}
          >
            {noCredits
              ? "No credits . Upgrade"
              : `${credits} credit${credits !== 1 ? "s" : ""}`}
          </span>
        </PrincipalModal>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-3 py-4 [&::-webkit-scrollbar]:hidden"
      >
        {messages.length === 0 && !isGenerating && (
          <div className="flex h-full items-center justify-center">
            <p className="text-center text-xs text-white/20">
              Describe what you want to build...
            </p>
          </div>
        )}

        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div key={i}>
              {msg.role === "user" ? (
                <div className="flex items-start justify-end gap-2">
                  <div className="max-w-[85%] space-y-1.5">
                    <div className="rounded-2xl rounded-br-sm bg-white/10 px-3.5 py-2.5">
                      <p className="text-[13px] leading-relaxed text-white/80 wrap-break-word">
                        {msg.content}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  <Image
                    src="/logo-short.png"
                    alt="Vidhyora"
                    width={24}
                    height={24}
                    className="mt-0.5 h-6 w-6 shrink-0 rounded-md"
                  />
                  <div className="min-w-0 rounded-2xl rounded-tl-sm bg-white/5 px-3.5 py-2.5">
                    <p className="text-[13px] leading-relaxed text-white/70 wrap-break-word">
                      {msg.content}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Status steps */}
        {isGenerating && (
          <div className="flex items-start gap-2">
            <Image
              src="/logo-short.png"
              alt="Vidhyora"
              width={24}
              height={24}
              className="mt-0.5 h-6 w-6 shrink-0 rounded-md"
            />
            <div className="rounded-2xl rounded-tl-sm bg-white/5 px-3.5 py-3">
              <div className="space-y-2">
                {statusLog.map((step, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="flex h-4 w-4 shrink-0 items-center justify-center">
                      {step.status === "running" ? (
                        <Loader2 className="h-3 w-3 animate-spin text-blue-400/80" />
                      ) : (
                        <Check className="h-3 w-3 text-white/25" />
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-[12px] transition-colors duration-300",
                        step.status === "running"
                          ? "text-white/75"
                          : "text-white/25"
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dual‑Layer Capsule */}
      <div className="sticky bottom-0 w-full z-10 bg-[#0d0d0d] py-4">
        <div className="mx-auto w-full max-w-[360px] bg-[#0F172A] rounded-2xl shadow-inner 
                        focus-within:ring-2 focus-within:ring-blue-500 transition-all duration-300 overflow-visible">

          {/* Top Layer: Input */}
          <div className="px-5 pt-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isGenerating || isImproving || noCredits}
              placeholder={
                noCredits
                  ? "Upgrade to keep building..."
                  : isImproving
                  ? "Vidhyora is improving your app..."
                  : isGenerating
                  ? "Generating..."
                  : "Message Vidhyora"
              }
              className="w-full bg-transparent text-gray-200 placeholder-gray-400 focus:outline-none text-[15px]"
            />
          </div>
          {/* Bottom Layer: Icons Row */}
          <div className="flex items-center justify-between px-5 pb-4 mt-2">
            <div className="flex items-center gap-3">
              {/* Plus icon */}
              <button
                onClick={() => setShowAttachmentModal(true)}
                className="flex items-center justify-center h-8 w-8 rounded-full border border-white/10 text-gray-300 hover:text-white hover:bg-[#1E293B] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                +
              </button>

              {/* Dropdown */}
              <select className="bg-[#1E293B] text-gray-200 rounded-full px-3 py-1 text-[14px] focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>Smart</option>
                <option>Fast</option>
                <option>Creative</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              {/* Eye icon */}
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="text-gray-400 hover:text-white transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
              >
                <Eye className="h-6 w-6" />
              </button>

              {/* Mic icon */}
              <button
                onClick={startVoiceInput}
                className="text-gray-400 hover:text-white transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
              >
                <Mic className="h-6 w-6" />
              </button>

              {/* Send button */}
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={cn(
                  "h-9 w-9 rounded-full flex items-center justify-center transition-all",
                  canSubmit
                    ? "bg-white text-black hover:bg-white/90 active:scale-95"
                    : "bg-white/8 text-white/20 shadow-none"
                )}
              >
                {isGenerating || isImproving ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <ArrowUp className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
