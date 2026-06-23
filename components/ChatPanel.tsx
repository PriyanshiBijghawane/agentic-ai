"use client";

import { Message, StatusStep } from '@/types/workspace';
import React, { useRef, useState } from 'react'


interface ChatPanelProps {
    messages: Message[];
    isGenerating: boolean;
    isImproving: boolean;
    statusLog: StatusStep[];
    credits: number;
    initialPrompt: string | null;
    onGenerate: (prompt: string, imageUrl?: string) => Promise<void>;
    userId: string;
    workspaceId: string| null;
}
const ChatPanel = ({
    messages,
    isGenerating,
    isImproving,
    statusLog,
    credits,
    initialprompt,
    onGenerate,
    userid,
    workspaceId,
}: ChatPanelProps) => {
   const scrollRef = useRef<HTMLDivElement>(null);
   const textareaRef = useRef<HTMLTextAreaElement>(null);
   const [input, setInput] = useState("");

   const hasAutoSubmittedRef = useRef(false);
   const noCredits = credits <= 0;
   const canSubmit =
      input.trim().length > 0 && !isGenerating && !isImproving && !noCredits;
  return (
    <div className="flex w-[320px] shrink-0 flex-col bg-[#0d0d0d]">
        ChatPanel
        </div>
  )
};

export default ChatPanel