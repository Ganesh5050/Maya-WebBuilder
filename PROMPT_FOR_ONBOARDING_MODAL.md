
# IMPLEMENTATION PROMPT: Premium User Onboarding Modal

**Objective:** 
Create a premium, visually stunning "User Onboarding" modal component for a React application. This modal should serve as a "Welcome Guide" for first-time users, educating them about key features like Chat, Code Editor, Design Variations, and Export.

**Technical Requirements:**
1. **Component Name:** `OnboardingModal`
2. **Tech Stack:** React (TypeScript), Tailwind CSS, Lucide React (for icons).
3. **State Management:**
   - Use `useState` for tracking the current slide step.
   - Use `localStorage` to persist a flag (e.g., `has_seen_onboarding`) so the modal ONLY appears once per user device.
   - Use `useEffect` to trigger the modal automatically after a short delay (1.5s) on the main app page if the flag is missing.

**Design & UI Specifications:**
- **Layout:** A centered modal with a 50/50 split layout:
  - **Left Side:** High-quality illustrative image (use Unsplash URLs) with a dark gradient overlay and the slide title.
  - **Right Side:** Clean white background containing the icon, description, and navigation controls.
- **Aesthetics:** 
  - Rounded corners (`rounded-2xl`), deep drop shadows (`shadow-2xl`).
  - Smooth entrance animations (Zoom-in + Fade-in).
  - "Glassmorphism" effect for badges (e.g., "New Version 2.0").
- **Navigation:**
  - Progress indicators (dots/bars) at the bottom.
  - "Next" / "Back" buttons.
  - The final button should say "Get Started" and close the modal.

**Content Steps (Array Data):**
1. **Welcome:** Intro to the app. Image: [Abstract Technology]. Icon: `Sparkles`.
2. **Describe & Generate:** Explain the chat feature. Image: [AI/Chat concept]. Icon: `MessageSquare`.
3. **Pro Code Editor:** Explain the VS Code-like experience. Image: [Coding screen]. Icon: `Code`.
4. **Variations & Export:** Explain design options and downloading. Image: [Design tools]. Icon: `Download`.

**Implementation details:**
- Create the generic `OnboardingModal` component first.
- Then, show how to integrate it into the main parent page (e.g., `AppBuilder.tsx` or `Dashboard.tsx`).
- Ensure the `z-index` is high (`z-50` or `z-100`) so it sits on top of everything.
- Add a "Close" (X) button in the top right corner.

**Example Behavior:**
When a user visits the app for the first time, wait 1.5 seconds, then fade in this modal. They click "Next" through the 4 steps. When they click "Get Started" or "Close", save the flag to localStorage so it never appears again.
