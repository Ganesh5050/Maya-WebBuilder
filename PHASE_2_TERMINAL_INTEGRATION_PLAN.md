# 🚀 PHASE 2: TERMINAL INTEGRATION

## Status: 🔄 IN PROGRESS

**Goal:** Add integrated terminal emulator inside the app for running commands directly in E2B sandboxes

---

## 🎯 What We're Building

### Terminal Features
- ✅ **XTerm.js Integration** - Professional terminal emulator
- ✅ **E2B Connection** - Run commands in cloud sandbox
- ✅ **Real-time Output** - See stdout/stderr live
- ✅ **Command History** - Arrow keys for previous commands
- ✅ **Resizable Terminal** - Adjust height/width
- ✅ **Multiple Sessions** - Per-project terminals

### User Experience
```
User generates React project → E2B sandbox created
User opens terminal tab → Connected to sandbox
User types: npm install lodash
Terminal shows: ✅ lodash installed
User types: npm run dev
Terminal shows: ✅ Dev server restarted
Preview updates automatically!
```

---

## 🔧 Implementation Plan

### Step 1: Install Dependencies
```bash
npm install xterm @xterm/addon-fit @xterm/addon-web-links
```

### Step 2: Create Terminal Service
- `src/services/terminalService.ts` - Terminal management
- Connect to E2B sandbox PTY
- Handle input/output streaming
- Command history management

### Step 3: Create Terminal Component
- `src/react-app/components/Terminal.tsx` - XTerm.js wrapper
- Resizable terminal window
- Professional styling
- Keyboard shortcuts

### Step 4: Create Terminal Hook
- `src/react-app/hooks/useTerminal.ts` - Terminal state management
- Connection handling
- Auto-reconnect logic

### Step 5: Integrate into AppBuilder
- Add terminal tab/panel
- Connect to active E2B sandbox
- Show/hide terminal toggle

---

## 📊 Complexity: ⭐⭐⭐ (Medium)

**Time Estimate:** 2-3 hours
**Risk Level:** Low (well-documented APIs)
**Dependencies:** XTerm.js, E2B PTY API

---

## 🎨 UI Design

### Terminal Panel Layout
```
┌─────────────────────────────────────┐
│ [Build] [Code] [Terminal] [Data]    │
├─────────────────────────────────────┤
│ $ npm install lodash                │
│ added 1 package in 2.3s             │
│ $ npm run dev                       │
│ > vite                              │
│ Local: http://localhost:5173        │
│ $ █                                 │
└─────────────────────────────────────┘
```

### Terminal Features
- **Dark theme** - Professional appearance
- **Syntax highlighting** - Command recognition
- **Auto-complete** - Common commands
- **Resize handle** - Adjustable height
- **Clear button** - Reset terminal
- **Copy/paste** - Standard shortcuts

---

## 🔗 E2B PTY Integration

### Connection Flow
1. User opens terminal
2. Get active E2B sandbox
3. Create PTY session
4. Connect XTerm.js to PTY
5. Stream input/output

### PTY API Usage
```typescript
const pty = await sandbox.pty.create({
  command: '/bin/bash',
  size: { cols: 80, rows: 24 }
});

pty.onData((data) => {
  terminal.write(data);
});

terminal.onData((data) => {
  pty.write(data);
});
```

---

## ✅ Success Criteria

### Functional Requirements
- [ ] Terminal opens and connects to E2B sandbox
- [ ] Commands execute and show output
- [ ] Arrow keys work for command history
- [ ] Terminal is resizable
- [ ] Copy/paste works
- [ ] Terminal persists during session

### User Experience Requirements
- [ ] Professional dark theme
- [ ] Fast response time (<100ms)
- [ ] Clear error messages
- [ ] Intuitive keyboard shortcuts
- [ ] Mobile-friendly (if possible)

---

## 🚀 Let's Start Implementation!

Ready to begin? I'll:
1. Install XTerm.js dependencies
2. Create terminal service
3. Build terminal component
4. Integrate into AppBuilder
5. Test with E2B sandbox

This will give users the power to run any command directly in their cloud sandbox!