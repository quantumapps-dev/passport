"use client";

import { useState } from "react";
import { AiMode } from "@/components/ai-mode";
import { FormComponent } from "@/components/form-component";
import { Button } from "@/components/ui/button";
import { PanelRightOpen, PanelRightClose } from "lucide-react";

export default function Home() {
  const [isAiModeOpen, setIsAiModeOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Main Content Area */}
        <div 
          className={`flex-1 transition-all duration-300 ease-in-out ${
            isAiModeOpen ? 'mr-96' : 'mr-0'
          }`}
        >
          <div className="p-6 h-full overflow-auto">
            {/* Header with AI Toggle */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                Registration Form
              </h1>
              <Button
                onClick={() => setIsAiModeOpen(!isAiModeOpen)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                {isAiModeOpen ? (
                  <>
                    <PanelRightClose className="h-4 w-4" />
                    Close AI Mode
                  </>
                ) : (
                  <>
                    <PanelRightOpen className="h-4 w-4" />
                    Open AI Mode
                  </>
                )}
              </Button>
            </div>

            {/* Form Component */}
            <FormComponent/>
          </div>
        </div>

        {/* AI Mode Sidebar */}
        <div 
          className={`fixed right-0 top-0 h-full w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
            isAiModeOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="h-full">
            <AiMode onClose={() => setIsAiModeOpen(false)} />
          </div>
        </div>

        {/* Overlay for mobile */}
        {isAiModeOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsAiModeOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
