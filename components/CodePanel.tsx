"use client";

import { FileData, StatusStep } from "@/types/workspace";
import { useState, useEffect, useRef } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
  useSandpack,
} from "@codesandbox/sandpack-react";
import { dracula } from "@codesandbox/sandpack-themes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code2, Eye } from "lucide-react";

const PLACEHOLDER_FILES = {
  "/App.js": {
    code: `export default function App() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "system-ui, sans-serif",
    }}>
      <div style={{ textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>⚡</div>
        <p style={{ fontSize: 14 }}>Your app will appear here</p>
      </div>
    </div>
  );
}`,
  },
};

const BASE_DEPENDENCIES: Record<string, string> = {
  "react-is": "latest",
  "react-router-dom": "latest",
  "lucide-react": "latest",
  recharts: "latest",
  "date-fns": "latest",
  "framer-motion": "latest",
  "react-hook-form": "latest",
  "@hookform/resolvers": "latest",
  zod: "latest",
  "@radix-ui/react-dialog": "latest",
  "@radix-ui/react-dropdown-menu": "latest",
  "@radix-ui/react-tabs": "latest",
  "@radix-ui/react-tooltip": "latest",
  "@radix-ui/react-accordion": "latest",
  "@radix-ui/react-select": "latest",
  axios: "latest",
  clsx: "latest",
  "class-variance-authority": "latest",
  "tailwind-merge": "latest",
};

type ActiveTab = "preview" | "code";

interface CodePanelProps {
  fileData: FileData | null;
  isGenerating: boolean;
  statusLog: StatusStep[];
  onFilePatch: (patches: FileData) => void;
}

function SandpackInner({
  fileData,
  isGenerating,
  activeTab,
  setActiveTab,
}: {
  fileData: FileData | null;
  isGenerating: boolean;
  activeTab: ActiveTab;
  setActiveTab: (t: ActiveTab) => void;
}) {
  const { sandpack } = useSandpack();
  const prevFilesRef = useRef<Record<string, { code: string }>>({});

  useEffect(() => {
    if (!fileData?.files) return;

    for (const [path, { code }] of Object.entries(fileData.files)) {
      if (prevFilesRef.current[path]?.code !== code) {
        sandpack.updateFile(path, code);
      }
    }

    prevFilesRef.current = fileData.files;
  }, [fileData?.files, sandpack]);

  return (
    <Tabs
      value={activeTab}
      onValueChange={(v) => setActiveTab(v as ActiveTab)}
      className="flex h-full min-h-0 w-full flex-1 flex-col gap-0 overflow-visible"
    >
      <div className="flex items-center justify-between border-b border-white/6 px-2">
        <TabsList
          variant="line"
          className="h-auto gap-0 rounded-none bg-transparent p-0"
        >
          <TabsTrigger className="border-b-2 pt-2" value="code">
            <Code2 className="h-3.5 w-3.5" />
            Code
          </TabsTrigger>
          <TabsTrigger className="border-b-2 pt-2" value="preview">
            <Eye className="h-3.5 w-3.5" />
            Preview
          </TabsTrigger>
        </TabsList>
      </div>

      <div className="relative flex flex-1 min-h-0 w-full overflow-visible">
        <TabsContent
          value="preview"
          keepMounted
          className="mt-0 flex flex-1 h-full w-full overflow-visible data-[state=inactive]:hidden"
        >
          <SandpackPreview
            style={{
              flex: 1,
              width: "100%",
              height: "100%",
            }}
          />
        </TabsContent>

        <TabsContent
          value="code"
          keepMounted
          className="mt-0 h-full w-full flex-1 overflow-visible data-[state=inactive]:hidden"
        >
          <SandpackLayout
            style={{
              display: "flex",
              flex: 1,
              height: "100%",
              width: "100%",
              border: "none",
              borderRadius: 0,
            }}
          >
            <SandpackFileExplorer
              style={{
                width: "180px",
                borderRight: "0.5px solid rgba(255,255,255,0.08)",
              }}
            />

            <SandpackCodeEditor
              style={{
                flex: 1,
                height: "100%",
              }}
              showTabs
              showLineNumbers
              showInlineErrors
              closableTabs
              readOnly
            />
          </SandpackLayout>
        </TabsContent>
      </div>
    </Tabs>
  );
}

export function CodePanel({
  fileData,
  isGenerating,
  statusLog,
  onFilePatch: onFilePatch,
}: CodePanelProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("code");
  const files = fileData?.files ?? PLACEHOLDER_FILES;
  const dependencies = {
    ...BASE_DEPENDENCIES,
    ...(fileData?.dependencies ?? {}),
  };
  const filePathKey = Object.keys(files).sort().join("|");

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-visible relative">
      <SandpackProvider
        key={filePathKey}
        template="react"
        theme={dracula}
        files={files}
        customSetup={{ dependencies }}
        options={{
          externalResources: ["https://cdn.tailwindcss.com"],
          recompileMode: "delayed",
          recompileDelay: 500,
        }}
      >
        <SandpackInner
          fileData={fileData}
          isGenerating={isGenerating}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </SandpackProvider>
    </div>
  );
}
