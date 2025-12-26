import { ChainOfThought, ChainOfThoughtContent, ChainOfThoughtItem, ChainOfThoughtStep, ChainOfThoughtTrigger } from "./chain-of-thought"
import { CodeBlock, CodeBlockCode } from "./code-block"
import { Search, Target, Zap } from "lucide-react"

export function NoScrollTest() {
  return (
    <div className="w-full max-w-md mx-auto p-4 border rounded-lg bg-white">
      <h3 className="text-lg font-semibold mb-4">No Horizontal Scroll Test</h3>
      
      <ChainOfThought>
        <ChainOfThoughtStep>
          <ChainOfThoughtTrigger leftIcon={<Search className="size-4" />}>
            Testing very long text that should wrap properly without causing horizontal scrolling issues in the chat interface
          </ChainOfThoughtTrigger>
          <ChainOfThoughtContent>
            <ChainOfThoughtItem>
              This is a very long line of text that should wrap properly and not cause any horizontal scrolling issues in the chat interface. It should break words appropriately and stay within the container bounds.
            </ChainOfThoughtItem>
            <ChainOfThoughtItem>
              <strong>Code Example:</strong>
              <CodeBlock className="mt-2">
                <CodeBlockCode
                  code={`// This is a very long line of code that should wrap properly
const veryLongVariableName = "This is a very long string that should not cause horizontal scrolling";
function aVeryLongFunctionNameThatShouldWrapProperly() {
  return "No horizontal scrolling should occur";
}`}
                  language="javascript"
                />
              </CodeBlock>
            </ChainOfThoughtItem>
            <ChainOfThoughtItem>
              Another very long text item to test word wrapping and ensure that the content stays within the bounds of the container without causing any horizontal overflow or scrolling issues.
            </ChainOfThoughtItem>
          </ChainOfThoughtContent>
        </ChainOfThoughtStep>
        
        <ChainOfThoughtStep>
          <ChainOfThoughtTrigger leftIcon={<Target className="size-4" />}>
            File List Test with Long Paths
          </ChainOfThoughtTrigger>
          <ChainOfThoughtContent>
            <ChainOfThoughtItem>
              <strong>Generated Files:</strong>
              <CodeBlock className="mt-2">
                <CodeBlockCode
                  code={`src/components/very-long-component-name-that-might-cause-scrolling/VeryLongComponentName.tsx
src/pages/another-very-long-page-name-for-testing/AnotherVeryLongPageName.tsx
src/utils/helpers/very-long-utility-function-names/veryLongUtilityFunctionName.ts
src/styles/components/very-long-stylesheet-names/veryLongStylesheetName.css`}
                  language="text"
                />
              </CodeBlock>
            </ChainOfThoughtItem>
          </ChainOfThoughtContent>
        </ChainOfThoughtStep>
        
        <ChainOfThoughtStep>
          <ChainOfThoughtTrigger leftIcon={<Zap className="size-4" />}>
            Progress: Testing completion with very long status messages that should wrap properly
          </ChainOfThoughtTrigger>
          <ChainOfThoughtContent>
            <ChainOfThoughtItem>
              <strong>Status:</strong> Generating very complex components with extremely long names and detailed configurations that should not cause horizontal scrolling
            </ChainOfThoughtItem>
            <ChainOfThoughtItem>
              <strong>✅ Complete!</strong> All files have been successfully created with very long names and paths, and the interface should handle them gracefully without horizontal scrolling.
            </ChainOfThoughtItem>
          </ChainOfThoughtContent>
        </ChainOfThoughtStep>
      </ChainOfThought>
    </div>
  )
}