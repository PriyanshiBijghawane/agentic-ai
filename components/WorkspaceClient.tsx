"use client";

import { FileData, Message, StatusStep } from '@/types/workspace';
import React, { useCallback, useState } from 'react'
import { CodePanel } from './CodePanel';
import ChatPanel from './ChatPanel';
import { MIN_CREDITS_TO_GENERATE } from '@/lib/constants';

interface WorkspaceClientProps {
  initialPrompt: string | null;
  userCredits: number;
  userId: string;
  userPlan: string;
}

const WorkspaceClient = ({ 
  initialPrompt,
   userCredits, 
   userId, 
   userPlan,
}: WorkspaceClientProps) => {
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const[messages, setMessages] = useState<Message[]>([]);
  const [credits, setCredits] = useState(userCredits);

  const [fileData, setFileData] = useState<FileData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusLog, setStatusLog] = useState<StatusStep[]>([]);

  const handleFilePatch = useCallback((patches: FileData) => {
    setFileData(patches);
  }, []);
  const handleGenerate = useCallback(
    async (prompt: string, imageUrl?: string) => {
      if (isgenerating) return;
      if (credits < MIN_CREDITS_TO_GENERATE) return;
    },
     [credits, isGenerating, userId],
);
  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden
    bg-[#0a0a0a]">
      
          <ChatPanel
      messages={messages}
      isGenerating={isGenerating}
      isImproving={false}
      statusLog={statusLog}
      credits={credits}
      initialPrompt={initialPrompt}
      onGenerate={handleGenerate}
      userId={userId}
      workspaceId={workspaceId}
      appTitle={'Test Title'}
      />
    <CodePanel
        fileData={fileData}
        isGenerating={isGenerating}
        statusLog={statusLog}
        onFilePatch={handleFilePatch}
    />
</div>
      
  );
};

export default WorkspaceClient