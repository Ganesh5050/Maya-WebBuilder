# Design Document: Chat Generation UX Enhancement

## Overview

This design enhances the existing AppBuilder page to provide a smooth, professional chat and generation experience. The enhancement focuses on four key areas:

1. **Message Display** - Proper chat bubbles with clear visual distinction between user and assistant messages
2. **Generation Controls** - Stop button that replaces send button during generation
3. **Loading States** - Clear indicators showing system status ("Thinking...", "Getting ready...")
4. **Progress Feedback** - Real-time progress messages in chat and loading animation in preview area

The design maintains the existing HTML structure and component architecture, only enhancing the visual presentation and user feedback mechanisms.

## Architecture

### Component Structure

The enhancement works within the existing `AppBuilder.tsx` component structure:

```
AppBuilder (existing)
├── Header (existing - no changes)
├── Sidebar (existing - enhanced)
│   ├── Messages Area (enhanced with message bubbles)
│   ├── Action Buttons (existing - no changes)
│   └── Input Area (enhanced with stop button)
└── Preview Area (enhanced with loading animation)
```

### State Management

The existing React state in `AppBuilder.tsx` will be enhanced:

**Existing State (to be used):**
- `isGenerating` - Already tracks generation status
- `messages` - Already stores chat history
- `currentMessage` - Already stores input text
- `generatedWebsite` - Already stores generated HTML

**New State (to be added):**
- `generationStatus` - Tracks current generation phase ('idle' | 'thinking' | 'generating' | 'complete' | 'error')
- `abortController` - Stores AbortController instance for cancelling generation

### Data Flow

```
User Input → Send Message → Update State → Call AI Service → Stream Progress → Update UI
                                                                    ↓
                                                            Update Messages
                                                            Update Preview
                                                            Update Controls
```

## Components and Interfaces

### 1. Message Bubble Component

**Purpose:** Display individual chat messages with proper styling

**Interface:**
```typescript
interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}
```

**Styling Requirements:**
- User messages: Right-aligned, distinct background color
- Assistant messages: Left-aligned, different background color
- Streaming messages: Show typing indicator or animated dots
- Proper spacing between messages
- Markdown support for formatted content

### 2. Input Control Component

**Purpose:** Handle message input with dynamic send/stop button

**Interface:**
```typescript
interface InputControlProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onStop: () => void;
  isGenerating: boolean;
  disabled: boolean;
}
```

**Behavior:**
- Show send button when `isGenerating === false`
- Show stop button when `isGenerating === true`
- Disable input field when `isGenerating === true`
- Handle Enter key for sending
- Handle Shift+Enter for new line

### 3. Preview Loading Component

**Purpose:** Show loading animation in preview area during generation

**Interface:**
```typescript
interface PreviewLoadingProps {
  isVisible: boolean;
  status: string;
}
```

**Styling Requirements:**
- Centered in preview area
- Animated spinner or skeleton
- Status text below animation
- Smooth fade in/out transitions

### 4. Generation Status Indicator

**Purpose:** Show current generation phase in chat

**Interface:**
```typescript
interface GenerationStatusProps {
  status: 'thinking' | 'generating' | 'complete' | 'error';
  message?: string;
}
```

**Display States:**
- Thinking: "🤔 Thinking..."
- Generating: "🚀 Building your website..."
- Complete: "✅ Website generated successfully!"
- Error: "❌ Error: [message]"

## Data Models

### Message Model (Enhanced)

```typescript
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
  isStreaming?: boolean;
  metadata?: {
    filesCreated?: string[];
    filesEdited?: string[];
    imagesGenerated?: string[];
  };
}
```

### Generation Progress Model

```typescript
interface GenerationProgress {
  phase: 'thinking' | 'generating' | 'complete' | 'error';
  currentFile?: string;
  operation?: 'creating' | 'editing' | 'generating';
  filesProcessed: number;
  totalFiles: number;
  message: string;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Button State Consistency
*For any* application state, when `isGenerating` is true, the send button should not be visible and the stop button should be visible; when `isGenerating` is false, the send button should be visible and the stop button should not be visible.
**Validates: Requirements 2.1, 2.3**

### Property 2: Message Order Preservation
*For any* sequence of messages added to the chat, the messages should appear in the order they were added (chronological order).
**Validates: Requirements 1.4, 8.2**

### Property 3: Input Disabled During Generation
*For any* application state where `isGenerating` is true, the message input field should be disabled and not accept user input.
**Validates: Requirements 2.4**

### Property 4: Progress Message Accumulation
*For any* generation session, progress messages should accumulate in the assistant message without creating duplicate messages.
**Validates: Requirements 4.5, 4.6**

### Property 5: Loading Animation Visibility
*For any* application state, the preview loading animation should be visible if and only if `isGenerating` is true and no website has been generated yet in the current session.
**Validates: Requirements 5.1, 5.2, 5.3**

### Property 6: Stop Button Cancellation
*For any* ongoing generation, clicking the stop button should set `isGenerating` to false and abort the generation process.
**Validates: Requirements 2.2, 2.5**

### Property 7: Error State Recovery
*For any* generation error, the system should restore the send button, enable the input field, and display an error message.
**Validates: Requirements 3.5, 7.1**

### Property 8: Chat History Persistence
*For any* page refresh, the chat messages should be restored from the database in the same order they were saved.
**Validates: Requirements 8.5**

## Error Handling

### Generation Errors

**Error Types:**
1. Network errors (API timeout, connection lost)
2. AI service errors (rate limit, invalid response)
3. User cancellation (stop button clicked)

**Handling Strategy:**
- Catch all errors in try-catch block
- Display user-friendly error message in chat
- Restore UI to ready state (show send button, enable input)
- Refund credits if consumed
- Offer retry button for recoverable errors

### UI Error States

**Scenarios:**
1. Message fails to send → Show error toast, keep message in input
2. Generation fails mid-process → Show error in chat, restore previous website
3. Stop button fails → Force state reset after timeout

## Testing Strategy

### Unit Tests

**Message Display Tests:**
- Test message bubble rendering for user messages
- Test message bubble rendering for assistant messages
- Test message ordering
- Test auto-scroll behavior

**Button State Tests:**
- Test send button visibility when not generating
- Test stop button visibility when generating
- Test input field disabled state during generation
- Test button click handlers

**Loading State Tests:**
- Test preview loading animation visibility
- Test status indicator updates
- Test loading animation removal on completion

### Property-Based Tests

**Property Test 1: Button State Consistency**
- Generate random `isGenerating` boolean values
- Verify button visibility matches expected state
- Validates Property 1

**Property Test 2: Message Order Preservation**
- Generate random sequences of messages
- Add them to chat
- Verify they appear in the same order
- Validates Property 2

**Property Test 3: Progress Message Accumulation**
- Generate random progress updates
- Verify they accumulate in single assistant message
- Verify no duplicate messages created
- Validates Property 4

**Property Test 4: Error State Recovery**
- Generate random error scenarios
- Verify UI returns to ready state
- Verify error message displayed
- Validates Property 7

### Integration Tests

**End-to-End Generation Flow:**
1. User sends message
2. Verify send button replaced with stop button
3. Verify loading animation appears
4. Verify progress messages accumulate
5. Verify website appears on completion
6. Verify send button restored

**Stop Button Flow:**
1. Start generation
2. Click stop button mid-generation
3. Verify generation cancelled
4. Verify UI restored to ready state
5. Verify cancellation message displayed

**Error Recovery Flow:**
1. Trigger generation error
2. Verify error message displayed
3. Verify retry button appears
4. Click retry
5. Verify generation restarts

## Implementation Notes

### Existing Code to Preserve

**Do NOT modify:**
- Overall page layout and structure
- Header component
- Sidebar width and resize functionality
- Tab navigation
- File attachment functionality
- Database service calls

**DO modify:**
- Message rendering in messages area
- Input area button logic
- Preview area content during generation
- State management for generation flow

### CSS Approach

**Use existing Tailwind classes** - Do not create new CSS files or modify existing stylesheets. All styling should use Tailwind utility classes that match the existing design system.

**Color Palette (from existing design):**
- Background: `bg-[#fafafa]`, `bg-white`
- Borders: `border-gray-200`, `border-gray-100`
- Text: `text-gray-900`, `text-gray-700`, `text-gray-500`
- Accent: `bg-blue-600`, `text-blue-600`

### Animation Guidelines

**Use CSS transitions** for smooth state changes:
- Button transitions: `transition-all duration-200`
- Message appearance: `transition-opacity duration-300`
- Loading animation: `animate-spin` or `animate-pulse`

### Accessibility

**Requirements:**
- Stop button must have clear aria-label
- Loading states must announce to screen readers
- Keyboard navigation must work for all controls
- Focus management during state changes

## Performance Considerations

### Message Rendering

**Optimization:**
- Use React.memo for message bubbles
- Virtualize message list if > 100 messages
- Debounce scroll-to-bottom calls

### Progress Updates

**Optimization:**
- Batch progress updates (max 10 updates/second)
- Use requestAnimationFrame for smooth animations
- Avoid re-rendering entire message list on progress update

### Preview Loading

**Optimization:**
- Use CSS animations instead of JavaScript
- Lazy load preview iframe
- Cache generated websites

## Security Considerations

### Generation Cancellation

**Requirements:**
- AbortController must properly cancel fetch requests
- Server must handle aborted requests gracefully
- No partial/corrupted websites should be saved

### Input Validation

**Requirements:**
- Sanitize user input before sending to AI
- Validate message length (max 5000 characters)
- Prevent XSS in rendered messages

## Future Enhancements

**Potential additions (not in current scope):**
1. Message editing/deletion
2. Regenerate specific messages
3. Branch conversations
4. Export chat history
5. Voice input
6. Real-time collaboration
7. Custom loading animations
8. Progress percentage indicator
