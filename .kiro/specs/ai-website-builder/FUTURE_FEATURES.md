# Future Features - Too Complex for Now

## 🚫 NOT IMPLEMENTING NOW (Save for Later)

These features are from Bolt.DIY analysis but are TOO COMPLEX or NOT NEEDED for MVP.

---

## 1. WebContainer API Integration ⭐⭐⭐⭐⭐

### What It Is:
- Runs Node.js directly in browser
- Execute `npm install`, `npm run dev`
- Full development environment client-side
- Powers React/Vue/Node.js apps

### Why Not Now:
- ❌ Requires StackBlitz partnership/license ($$$)
- ❌ Very complex to implement (weeks of work)
- ❌ Performance limitations in browser
- ❌ Not all npm packages work
- ❌ Our current focus is static sites (HTML/CSS/JS)

### When to Add:
- **v2.0** - If users demand React/Vue/Node apps
- **After** we have 1000+ users
- **If** we can afford StackBlitz license

### Alternative:
- Keep generating static sites
- Add React/Vue templates that compile to static HTML
- Use CDN versions of frameworks (no build step needed)

---

## 2. Monaco Code Editor ⭐⭐⭐⭐

### What It Is:
- VS Code's editor in browser
- Syntax highlighting
- Code completion
- Multi-file editing

### Why Not Now:
- ❌ Complex integration (3-5 days)
- ❌ Need file system state management
- ❌ Large bundle size (~5MB)
- ❌ Users don't need to edit code in MVP
- ❌ Can download and edit locally

### When to Add:
- **Phase 5+** - If users request code editing
- **After** core generation works perfectly
- **If** users complain about not being able to edit

### Alternative:
- Show generated code in read-only view
- Add "Copy Code" button
- Let users download and edit locally

---

## 3. Terminal Emulator ⭐⭐⭐⭐

### What It Is:
- Shows build output
- npm commands
- Error messages
- Real terminal in browser

### Why Not Now:
- ❌ Requires WebContainer (see #1)
- ❌ Complex xterm.js integration
- ❌ Not needed for static sites
- ❌ No build process to show

### When to Add:
- **Only if** we add WebContainer
- **Only if** we support Node.js apps

### Alternative:
- Show generation progress in chat
- Display errors as user-friendly messages
- Logs panel (already have this)

---

## 4. Git Integration ⭐⭐⭐⭐

### What It Is:
- Initialize git repo
- Commit changes
- Push to GitHub
- Version control

### Why Not Now:
- ❌ Complex GitHub API integration
- ❌ Need OAuth authentication
- ❌ Need to manage git state
- ❌ Users can download and git init locally

### When to Add:
- **Phase 6+** - For power users
- **After** 5000+ users
- **If** users request it frequently

### Alternative:
- Download as ZIP
- Users can manually create GitHub repo
- Provide instructions for git setup

---

## 5. Real-time Collaboration ⭐⭐⭐⭐⭐

### What It Is:
- Multiple users edit same project
- Live cursor positions
- Real-time updates
- Like Google Docs for code

### Why Not Now:
- ❌ Extremely complex (weeks/months)
- ❌ Requires WebSocket infrastructure
- ❌ Complex state synchronization
- ❌ Conflict resolution needed
- ❌ Not MVP feature

### When to Add:
- **v3.0+** - If we become team-focused
- **Only if** we pivot to team collaboration
- **After** everything else works

### Alternative:
- Share preview links (read-only)
- Export/import projects
- One user per project

---

## 6. Custom Deployment ⭐⭐⭐⭐

### What It Is:
- One-click deploy to Netlify
- Auto-deploy to Vercel
- Custom domain setup
- CI/CD pipeline

### Why Not Now:
- ❌ Need Netlify/Vercel API integration
- ❌ Complex deployment pipeline
- ❌ Need to manage deployments
- ❌ Users can deploy manually

### When to Add:
- **Phase 7+** - For convenience
- **After** 10,000+ users
- **If** deployment is major pain point

### Alternative:
- Download as ZIP
- Provide deployment instructions
- Link to Netlify/Vercel docs

---

## 7. Package Management ⭐⭐⭐⭐

### What It Is:
- Add/remove npm packages
- Dependency management
- Package.json editing
- npm install in browser

### Why Not Now:
- ❌ Requires WebContainer
- ❌ Complex dependency resolution
- ❌ Not needed for static sites

### When to Add:
- **Only if** we add WebContainer
- **Only if** we support Node.js apps

### Alternative:
- Use CDN for libraries (unpkg, jsdelivr)
- Include common libraries by default
- No package management needed

---

## 8. AI Model Selection ⭐⭐⭐

### What It Is:
- Choose between GPT-4, Claude, Gemini
- Switch models mid-conversation
- Compare outputs

### Why Not Now:
- ❌ Adds complexity to UI
- ❌ Confuses users
- ❌ One good model is enough
- ❌ Can add later easily

### When to Add:
- **Phase 8+** - For power users
- **If** one model consistently fails
- **If** users request it

### Alternative:
- Use best available model automatically
- Fallback to other models on error
- Keep it simple

---

## 9. Advanced Templates System ⭐⭐⭐⭐

### What It Is:
- User-created templates
- Template marketplace
- Custom template editor
- Template versioning

### Why Not Now:
- ❌ Complex template management
- ❌ Need template validation
- ❌ Marketplace infrastructure
- ❌ 5 templates enough for MVP

### When to Add:
- **v2.0+** - If users want customization
- **After** we validate core concept
- **If** templates become limiting

### Alternative:
- Start with 5 good templates
- Add more templates ourselves
- Let users download and modify

---

## 10. Analytics & Telemetry ⭐⭐⭐

### What It Is:
- Track user behavior
- Error reporting
- Usage statistics
- A/B testing

### Why Not Now:
- ❌ Not core functionality
- ❌ Privacy concerns
- ❌ Can add anytime
- ❌ Focus on building first

### When to Add:
- **Phase 9+** - For product improvement
- **After** we have users
- **If** we need data for decisions

### Alternative:
- Manual user feedback
- Simple error logging
- Google Analytics (basic)

---

## 11. Multi-language Support ⭐⭐⭐⭐

### What It Is:
- Generate sites in multiple languages
- i18n support
- Translation management
- RTL support

### Why Not Now:
- ❌ Complex translation system
- ❌ Need translation API
- ❌ English is enough for MVP
- ❌ Can add later

### When to Add:
- **v2.0+** - For international expansion
- **After** we validate in English market
- **If** we expand globally

### Alternative:
- English only for now
- Users can translate manually
- AI can generate in other languages if asked

---

## 12. Advanced AI Features ⭐⭐⭐⭐

### What It Is:
- AI suggests improvements
- Auto-fix errors
- Smart refactoring
- Code optimization

### Why Not Now:
- ❌ Complex AI orchestration
- ❌ Expensive (many API calls)
- ❌ Basic generation first
- ❌ Can add incrementally

### When to Add:
- **Phase 10+** - For advanced users
- **After** basic generation is perfect
- **If** users want more AI help

### Alternative:
- Focus on good initial generation
- Let users iterate with new prompts
- Simple error messages

---

## 13. Version History & Time Travel ⭐⭐⭐⭐

### What It Is:
- Undo/redo system
- File history
- Restore previous versions
- Diff viewer

### Why Not Now:
- ❌ Complex state management
- ❌ Large storage requirements
- ❌ Not critical for MVP
- ❌ We have site history (simpler)

### When to Add:
- **Phase 11+** - For power users
- **After** we add code editing
- **If** users lose work frequently

### Alternative:
- Save each generation (already planned)
- Users can load previous generations
- Download backups

---

## 14. Custom Styling System ⭐⭐⭐⭐

### What It Is:
- Visual theme editor
- Color picker
- Font selector
- Layout customizer

### Why Not Now:
- ❌ Complex UI builder
- ❌ Need design system
- ❌ AI can handle styling
- ❌ Not MVP feature

### When to Add:
- **v2.0+** - For customization
- **After** AI styling is good
- **If** users want more control

### Alternative:
- AI generates styled sites
- Users can edit CSS after download
- Provide style variations

---

## 15. SEO & Performance Tools ⭐⭐⭐

### What It Is:
- SEO analyzer
- Performance metrics
- Lighthouse scores
- Optimization suggestions

### Why Not Now:
- ❌ Not core functionality
- ❌ Can add later easily
- ❌ Focus on generation first
- ❌ Users can use external tools

### When to Add:
- **Phase 12+** - For quality
- **After** generation is perfect
- **If** users care about SEO

### Alternative:
- Generate SEO-friendly HTML
- Include meta tags
- Users can optimize after download

---

## 📊 PRIORITY MATRIX

### Must Have (Doing Now):
- ✅ AI generation
- ✅ Per-app chat
- ✅ Site persistence
- ✅ Preview functionality

### Should Have (Phase 2-4):
- ⏳ Better AI prompts
- ⏳ More templates
- ⏳ Download sites
- ⏳ Error handling

### Nice to Have (Phase 5+):
- 📅 Code editor
- 📅 Git integration
- 📅 Deployment
- 📅 Analytics

### Won't Have (v2.0+):
- ❌ WebContainer
- ❌ Collaboration
- ❌ Custom templates
- ❌ Advanced AI

---

## 🎯 DECISION CRITERIA

**Add a feature when:**
1. ✅ Core functionality is perfect
2. ✅ Users explicitly request it
3. ✅ We have resources (time/money)
4. ✅ It's technically feasible
5. ✅ It adds significant value

**Don't add a feature if:**
1. ❌ It's too complex
2. ❌ It breaks existing functionality
3. ❌ Users don't need it
4. ❌ It's expensive to maintain
5. ❌ There's a simpler alternative

---

## 💡 REMEMBER

**Ship fast, iterate based on feedback.**

Don't build features users don't want.
Don't add complexity users don't need.
Focus on core value proposition.

**Your MVP is:**
"Type a description → Get a unique website → Download it"

Everything else is extra.
