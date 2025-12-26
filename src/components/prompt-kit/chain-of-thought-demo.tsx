"use client"

import { ChatContainerContent, ChatContainerRoot } from "./chat-container"
import { Markdown } from "./markdown"
import { Message, MessageAvatar, MessageContent } from "./message"
import { ChainOfThought, ChainOfThoughtContent, ChainOfThoughtItem, ChainOfThoughtStep, ChainOfThoughtTrigger } from "./chain-of-thought"
import { CodeBlock, CodeBlockCode } from "./code-block"
import { Button } from "../ui/button"
import { Lightbulb, Search, Target, Zap } from "lucide-react"
import { useState } from "react"

export function ChainOfThoughtDemo() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "user",
      content: "Create a modern e-commerce website for selling handmade jewelry",
    },
    {
      id: 2,
      role: "assistant",
      content: "CHAIN_OF_THOUGHT_GENERATION:" + JSON.stringify({
        type: 'generation_start',
        prompt: 'Create a modern e-commerce website for selling handmade jewelry',
        steps: [
          {
            title: 'Analysis: Understanding your requirements',
            icon: 'Search',
            items: [
              'Analyzing e-commerce requirements for handmade jewelry',
              'Identifying target audience and user personas',
              'Planning product showcase and gallery features',
              'Determining payment and checkout requirements'
            ]
          },
          {
            title: 'Planning: Creating the project blueprint',
            icon: 'Target',
            items: [
              'Designing responsive product catalog layout',
              'Planning shopping cart and checkout flow',
              'Selecting appropriate UI components and styling',
              'Mapping out user authentication and profiles'
            ]
          },
          {
            title: 'Implementation: Building your website',
            icon: 'Zap',
            items: [
              'Generating React components with TypeScript',
              'Implementing Tailwind CSS for modern styling',
              'Creating responsive product grid and details',
              'Adding shopping cart functionality',
              'Optimizing for performance and SEO'
            ]
          }
        ]
      }),
    },
    {
      id: 3,
      role: "assistant",
      content: "CHAIN_OF_THOUGHT_PROGRESS:" + JSON.stringify({
        progress: 75,
        status: 'Generating product components and styling',
        filesCreated: 12,
        fileList: [
          'package.json',
          'src/App.tsx',
          'src/components/ProductCard.tsx',
          'src/components/ShoppingCart.tsx',
          'src/components/Header.tsx',
          'src/components/Footer.tsx',
          'src/pages/ProductCatalog.tsx',
          'src/pages/ProductDetails.tsx',
          'src/utils/cartHelpers.ts',
          'src/styles/globals.css',
          'tailwind.config.js',
          'index.html'
        ],
        isComplete: false
      }),
    }
  ])

  const addMessage = () => {
    // Add a completion message
    setMessages([...messages, {
      id: messages.length + 1,
      role: "assistant",
      content: "CHAIN_OF_THOUGHT_PROGRESS:" + JSON.stringify({
        progress: 100,
        status: 'Website generation complete!',
        filesCreated: 15,
        fileList: [
          'package.json',
          'src/App.tsx',
          'src/components/ProductCard.tsx',
          'src/components/ShoppingCart.tsx',
          'src/components/Header.tsx',
          'src/components/Footer.tsx',
          'src/pages/ProductCatalog.tsx',
          'src/pages/ProductDetails.tsx',
          'src/pages/Checkout.tsx',
          'src/utils/cartHelpers.ts',
          'src/utils/api.ts',
          'src/styles/globals.css',
          'tailwind.config.js',
          'vite.config.ts',
          'index.html'
        ],
        isComplete: true
      })
    }])
  }

  // Function to render Chain of Thought content
  const renderChainOfThought = (content: string) => {
    if (content.includes('CHAIN_OF_THOUGHT_GENERATION:') || content.includes('CHAIN_OF_THOUGHT_PROGRESS:')) {
      try {
        const chainMatch = content.match(/CHAIN_OF_THOUGHT_(?:GENERATION|PROGRESS):(.+?)(?=\n|$)/s);
        if (chainMatch) {
          const chainData = JSON.parse(chainMatch[1]);
          
          const getIconComponent = (iconName: string) => {
            switch (iconName) {
              case 'Search': return <Search className="size-4" />;
              case 'Target': return <Target className="size-4" />;
              case 'Zap': return <Zap className="size-4" />;
              case 'Lightbulb': return <Lightbulb className="size-4" />;
              default: return <Search className="size-4" />;
            }
          };

          if (chainData.type === 'generation_start' && chainData.steps) {
            return (
              <div className="w-full">
                <ChainOfThought>
                  {chainData.steps.map((step: any, stepIndex: number) => (
                    <ChainOfThoughtStep key={stepIndex}>
                      <ChainOfThoughtTrigger leftIcon={getIconComponent(step.icon)}>
                        {step.title}
                      </ChainOfThoughtTrigger>
                      <ChainOfThoughtContent>
                        {step.items?.map((item: string, itemIndex: number) => (
                          <ChainOfThoughtItem key={itemIndex}>
                            {item}
                          </ChainOfThoughtItem>
                        ))}
                      </ChainOfThoughtContent>
                    </ChainOfThoughtStep>
                  ))}
                </ChainOfThought>
              </div>
            );
          } else if (chainData.progress !== undefined) {
            return (
              <div className="w-full">
                <ChainOfThought>
                  <ChainOfThoughtStep>
                    <ChainOfThoughtTrigger leftIcon={<Zap className="size-4" />}>
                      Progress Update: {chainData.status} ({chainData.progress}%)
                    </ChainOfThoughtTrigger>
                    <ChainOfThoughtContent>
                      <ChainOfThoughtItem>
                        <strong>Current Status:</strong> {chainData.status}
                      </ChainOfThoughtItem>
                      <ChainOfThoughtItem>
                        <strong>Progress:</strong> {chainData.progress}% complete
                      </ChainOfThoughtItem>
                      <ChainOfThoughtItem>
                        <strong>Files Created:</strong> {chainData.filesCreated} files
                      </ChainOfThoughtItem>
                      {chainData.fileList && chainData.fileList.length > 0 && (
                        <ChainOfThoughtItem>
                          <strong>Generated Files:</strong>
                          <CodeBlock className="mt-2">
                            <CodeBlockCode
                              code={chainData.fileList.join('\n')}
                              language="text"
                            />
                          </CodeBlock>
                        </ChainOfThoughtItem>
                      )}
                      {chainData.isComplete && (
                        <ChainOfThoughtItem>
                          <strong>✅ Generation Complete!</strong> All files have been successfully created and your website is ready for preview.
                        </ChainOfThoughtItem>
                      )}
                    </ChainOfThoughtContent>
                  </ChainOfThoughtStep>
                </ChainOfThought>
              </div>
            );
          }
        }
      } catch (error) {
        console.error('Error parsing Chain of Thought data:', error);
      }
    }
    
    return <Markdown>{content}</Markdown>;
  }

  return (
    <div className="flex h-[600px] w-full flex-col overflow-hidden border rounded-lg">
      <div className="flex items-center justify-between border-b p-3 bg-gray-50">
        <h3 className="font-semibold">Chain of Thought Demo</h3>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={addMessage}>
            Add Completion
          </Button>
        </div>
      </div>
      
      <ChatContainerRoot className="flex-1">
        <ChatContainerContent className="space-y-4 p-4">
          {messages.map((message) => {
            const isAssistant = message.role === "assistant"
            return (
              <Message
                key={message.id}
                className={message.role === "user" ? "justify-end" : "justify-start"}
              >
                {isAssistant && (
                  <MessageAvatar
                    src="/avatars/ai.png"
                    alt="AI Assistant"
                    fallback="AI"
                  />
                )}
                <div className="max-w-[85%] flex-1 sm:max-w-[75%]">
                  {isAssistant ? (
                    <div className="bg-gray-50 text-gray-900 rounded-lg p-4">
                      {renderChainOfThought(message.content)}
                    </div>
                  ) : (
                    <MessageContent className="bg-blue-600 text-white">
                      {message.content}
                    </MessageContent>
                  )}
                </div>
              </Message>
            )
          })}
        </ChatContainerContent>
      </ChatContainerRoot>
    </div>
  )
}