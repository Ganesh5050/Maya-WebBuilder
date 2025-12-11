# Testing Guide - AI Website Builder

## 🚀 Quick Start

**Dev Server**: http://localhost:5174/

## ✅ What to Test

### 1. Chat Interface
- [ ] User messages appear in blue bubbles on the right
- [ ] Assistant messages appear in gray bubbles on the left
- [ ] Messages auto-scroll to bottom
- [ ] Smooth fade-in animations

### 2. Stop Button
- [ ] Send button visible when not generating
- [ ] Stop button (red with X) appears during generation
- [ ] Clicking stop cancels generation
- [ ] Cancellation message appears in chat
- [ ] Send button returns after stopping

### 3. Loading States
- [ ] "🤔 Thinking..." appears when starting
- [ ] "🚀 Building your website..." during generation
- [ ] Loading spinner shows in preview area
- [ ] Status text updates in preview

### 4. Progress Messages
- [ ] Progress messages accumulate in single assistant message
- [ ] Shows file operations: "Creating index.html", "Creating styles.css", etc.
- [ ] No duplicate messages
- [ ] Final success message with file count

### 5. Code Tab
- [ ] Shows "Generated Files (3)" or similar
- [ ] Lists all generated files (index.html, styles.css, script.js)
- [ ] Clicking a file shows its content
- [ ] Selected file is highlighted in blue
- [ ] Copy button copies code to clipboard
- [ ] Empty state shows when no files exist

### 6. Website Quality
- [ ] Website matches the user's request
- [ ] Multiple sections (not just "Welcome")
- [ ] Modern design (gradients, shadows, animations)
- [ ] Real content (not placeholders)
- [ ] Responsive layout
- [ ] Interactive elements work

## 📝 Test Scenarios

### Scenario 1: Generate Portfolio Website

**Steps**:
1. Open http://localhost:5174/
2. Create or open an app
3. Type: "Create a portfolio website"
4. Click send or press Enter

**Expected Results**:
- ✅ Chat bubble appears with your message (blue, right)
- ✅ Stop button appears (red with X)
- ✅ Loading animation in preview
- ✅ Progress messages: "Creating index.html", "Creating styles.css", "Creating script.js"
- ✅ Website appears with:
  - Hero section with name/title
  - About section
  - Projects/portfolio section
  - Skills section
  - Contact form
  - Navigation menu
  - Modern design with gradients
- ✅ Code tab shows 3 files
- ✅ Can view and copy each file's code

### Scenario 2: Test Stop Button

**Steps**:
1. Start generating a website
2. Immediately click the red Stop button

**Expected Results**:
- ✅ Generation stops
- ✅ Message appears: "⏹️ Generation stopped by user"
- ✅ Send button returns
- ✅ Can send new message

### Scenario 3: View Generated Code

**Steps**:
1. Generate a website
2. Click "Code" tab
3. Click different files in the list
4. Click "Copy" button

**Expected Results**:
- ✅ See list of files: index.html, styles.css, script.js
- ✅ Clicking a file shows its content
- ✅ Selected file is highlighted
- ✅ Copy button copies code
- ✅ Code is properly formatted

### Scenario 4: Test Different Prompts

Try these prompts and verify quality:

1. **"Create a restaurant website"**
   - Should have: Menu, About, Reservations, Contact
   - Should include: Food images, menu items, reservation form

2. **"Create a landing page for a SaaS product"**
   - Should have: Hero, Features, Pricing, Testimonials, CTA
   - Should include: Feature cards, pricing tables, sign-up form

3. **"Create a blog website"**
   - Should have: Header, Blog posts, Sidebar, Footer
   - Should include: Post cards, categories, search

4. **"Create a fitness gym website"**
   - Should have: Hero, Classes, Trainers, Pricing, Contact
   - Should include: Class schedule, trainer profiles, membership plans

### Scenario 5: Test Error Handling

**Steps**:
1. Disconnect internet (or simulate error)
2. Try to generate a website

**Expected Results**:
- ✅ Error message appears in chat
- ✅ Retry button available
- ✅ Credits refunded
- ✅ UI returns to ready state

## 🐛 Common Issues & Solutions

### Issue: Website shows "Welcome" only
**Solution**: This was fixed! The AI now generates complete websites. Try generating a new one.

### Issue: Code tab is empty
**Solution**: Make sure you've generated a website first. The Code tab only shows files after generation.

### Issue: Stop button doesn't appear
**Solution**: Check browser console for errors. Make sure the dev server is running.

### Issue: Messages don't scroll
**Solution**: Refresh the page. The auto-scroll should work automatically.

### Issue: AI generates generic content
**Solution**: Be more specific in your prompt. Instead of "create a website", try "create a portfolio website with projects section and contact form".

## 📊 Quality Checklist

For each generated website, verify:

### Design Quality
- [ ] Modern color scheme (not just black/white)
- [ ] Gradients or visual interest
- [ ] Proper spacing and typography
- [ ] Shadows and depth
- [ ] Smooth animations/transitions

### Content Quality
- [ ] Multiple sections (4-6 minimum)
- [ ] Real, meaningful content
- [ ] No "Your content here" placeholders
- [ ] Specific to user's request
- [ ] Professional copy

### Functionality
- [ ] Navigation menu works
- [ ] Smooth scrolling
- [ ] Mobile menu toggle
- [ ] Forms work (if present)
- [ ] Buttons are clickable
- [ ] Interactive elements respond

### Responsiveness
- [ ] Works on desktop
- [ ] Works on mobile (use browser dev tools)
- [ ] Navigation adapts to mobile
- [ ] Content reflows properly
- [ ] Images scale correctly

### Code Quality
- [ ] Valid HTML (proper DOCTYPE, structure)
- [ ] Modern CSS (flexbox, grid, custom properties)
- [ ] Clean JavaScript (ES6+, no errors)
- [ ] Proper indentation
- [ ] Semantic HTML tags

## 🎯 Success Criteria

A successful test means:

1. ✅ **Chat works**: Bubbles, stop button, progress messages
2. ✅ **Generation works**: Creates complete, professional website
3. ✅ **Code tab works**: Shows files, can view and copy
4. ✅ **Quality is high**: Modern design, real content, responsive
5. ✅ **No errors**: Console is clean, no crashes

## 📸 Screenshots to Take

Document your testing with screenshots of:

1. Chat interface with bubbles
2. Stop button during generation
3. Loading animation in preview
4. Generated website (full page)
5. Code tab with files
6. Mobile view of website

## 🔄 Regression Testing

After any changes, re-test:

- [ ] Basic generation flow
- [ ] Stop button functionality
- [ ] Code tab display
- [ ] Different website types
- [ ] Error handling

## 📝 Bug Report Template

If you find issues, report with:

```
**Issue**: [Brief description]
**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected**: [What should happen]
**Actual**: [What actually happened]
**Browser**: [Chrome/Firefox/Safari]
**Console Errors**: [Any errors in console]
**Screenshot**: [If applicable]
```

## 🎉 Happy Testing!

The AI website builder is now fully functional with:
- Professional chat interface
- Stop button control
- Real-time progress updates
- Dynamic code viewing
- High-quality website generation

**Everything should work smoothly!** 🚀
