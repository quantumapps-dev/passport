"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Textarea } from "./ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";

interface AiModeProps {
  onClose?: () => void;
}

export function AiMode({ onClose }: AiModeProps = {}) {
  const [input, setInput] = useState("");
  const [formDataOpen, setFormDataOpen] = useState<Record<string, boolean>>({});
  const { messages, sendMessage } = useChat();

  const handleSend = () => {
    sendMessage({ text: input });
    setInput("");
  };

  const parseFormData = (text: string) => {
    const formDataMatch = text.match(/Updated form data:\s*(\{[\s\S]*?\})/);
    if (formDataMatch) {
      try {
        return JSON.parse(formDataMatch[1]);
      } catch {
        return null;
      }
    }
    return null;
  };

  const renderMessageContent = (text: string, messageId: string) => {
    const formData = parseFormData(text);
    const textWithoutFormData = text.replace(/Updated form data:\s*\{[\s\S]*?\}/, '').trim();

    return (
      <div className="space-y-2">
        {textWithoutFormData && <div>{textWithoutFormData}</div>}
        {formData && (
          <Collapsible
            open={formDataOpen[messageId] ?? false}
            onOpenChange={(open) => setFormDataOpen(prev => ({ ...prev, [messageId]: open }))}
          >
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="w-full justify-between">
                <span>Current Form Data</span>
                {formDataOpen[messageId] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">
                {JSON.stringify(formData, null, 2)}
              </pre>
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    );
  };

  return (
    <Card className="h-full flex flex-col border-l">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>AI Mode</CardTitle>
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-3">
        <ScrollArea className="flex-1 rounded border p-3 h-full">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] ${message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"} rounded-lg p-3 whitespace-pre-wrap`}>
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case "text":
                        return <div key={`${message.id}-${i}`}>{renderMessageContent(part.text, message.id)}</div>;
                      case "tool-validateFormData":
                        return (
                          <pre key={`${message.id}-${i}`} className={`text-xs ${message.role === "user" ? "text-blue-100" : "text-gray-600"}`}>
                            Updated form data: {JSON.stringify(part, null, 2)}
                          </pre>
                        );
                      default:
                        return null;
                    }
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your details. Example: My name is Jane Doe, email jane@example.com, I live at 123 Main St, San Francisco, CA 94103."
            className="min-h-[80px]"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button onClick={handleSend}>Send</Button>
        </div>
      </CardContent>
    </Card>
  );
}
