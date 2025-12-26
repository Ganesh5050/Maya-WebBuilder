
# 🧠 AI Brain Testing Guide

The "Brain" of the website builder consists of the `IntentEngine` (Analyzer) and `LayoutStrategist` (Planner). You can test these components in isolation to verify their logic.

## 1. Quick Test Script
We have created a dedicated test script at `scripts/test_brain.ts`.

**Run command:**
```bash
npx tsx scripts/test_brain.ts
```

**What it does:**
1.  **Simulates a User Prompt**: Uses a hardcoded prompt (e.g., "crypto trading portfolio").
2.  **Runs Intent Analysis**: Converts text -> `IntentManifest` JSON.
3.  **Runs Layout Strategy**: Converts Manifest -> Layout Decisions (Hero, Features, Footer).
4.  **Runs Design Architect**: Selects a prototype color system.

**How to Modify:**
Open `scripts/test_brain.ts` and change the `prompt` variable to test different industries (e.g., "Sushi Restaurant", "Yoga Studio", "SaaS Dashboard").

## 2. Testing in the App (Live)
The Brain is fully integrated into the `EnhancedWebsiteGenerator`.

1.  Open the App Builder (`npm run dev`).
2.  Enter a prompt in the chat (e.g., "I want a luxury watch store").
3.  Watch the **Logs/Thinking Indicator**:
    *   You will see: `Brain Analysis: Targeted E-commerce for High Net Worth...`
    *   You will see: `Applying Cognitive Layout Strategy...`
4.  **Verify Result**: The generated website should reflect the strategy (e.g., Luxury = Minimalist Hero, Conversion = Split Screen).

## 3. Heuristic Fallback
If the OpenAI API key is missing or invalid (`.env`), the Brain automatically switches to **Heuristic Mode**.
*   **Log Message**: `⚠️ Brain failed, using heuristic fallback...`
*   It uses keyword matching to guess the industry and layout, ensuring the system never crashes.
