# Debug: Website Persistence Issue

## Problem
Websites disappear when the AppBuilder page is reloaded. The preview shows empty state even though a website was previously generated.

## Investigation Steps

### 1. Added Comprehensive Logging

#### AppBuilder.tsx - Load Operation
- Added detailed logging when loading latest generation
- Shows whether data was found, HTML length, prompt preview, and creation timestamp
- Distinguishes between "no data" vs "empty HTML"

#### AppBuilder.tsx - Save Operation
- Added logging before save with parameters
- Logs success with record IDs
- Added verification step that immediately loads back the saved data
- Catches and logs any save errors

#### databaseService.ts - getLatestWebsiteGeneration
- Logs all query parameters
- Distinguishes between PGRST116 (no rows - expected) vs actual errors
- Logs success/failure clearly

#### databaseService.ts - saveWebsiteGeneration
- Logs all save parameters including data lengths
- Logs success with generated ID
- Logs errors with full details

### 2. What to Check Next

When you test the app, open the browser console (F12) and look for:

1. **On page load**: Look for these logs:
   ```
   🔄 Loading app data for appId: xxx
   ✅ App loaded: AppName
   🔍 Attempting to load latest generation...
   🔍 getLatestWebsiteGeneration called: {appId, userId}
   ```

2. **If website loads successfully**:
   ```
   ✅ getLatestWebsiteGeneration success: Found
   📦 Generation data: {hasHtml: true, htmlLength: 12345, ...}
   ✅ Setting generated website, length: 12345
   ```

3. **If website doesn't load**:
   ```
   ⚠️ getLatestWebsiteGeneration error: message
   OR
   ⚠️ No website generation found in database
   ```

4. **When generating a new website**:
   ```
   💾 Saving to database...
   📝 Save params: {appId, userId, htmlLength, promptLength}
   💾 saveWebsiteGeneration called: {...}
   ✅ saveWebsiteGeneration success: record-id
   ✅ Website generation saved: record-id
   ✅ Chat message saved: record-id
   🔍 Verification load: Success
   ```

### 3. Possible Issues to Look For

1. **User ID mismatch**: Check if `user.id` is the same on save and load
2. **App ID mismatch**: Check if `appId` is consistent
3. **Database permissions**: Supabase RLS policies might be blocking reads
4. **Timing issue**: Save might not be completing before page reload
5. **Empty HTML**: Generation might be saving empty string

### 4. Next Steps Based on Console Output

**If you see "PGRST116" error on load:**
- This means no records exist in database
- Check if save operation actually completed
- Check Supabase dashboard to see if records exist

**If you see "Verification load: Failed":**
- Save is completing but immediate read-back fails
- Likely a database permission issue (RLS policies)
- Check Supabase RLS policies for `website_generations` table

**If you see different user IDs:**
- Authentication state might be changing
- Check if user is being logged out/in between operations

**If HTML length is 0:**
- Generation is producing empty output
- Check the `generateSmartWebsite` function

## ROOT CAUSE IDENTIFIED ✅

**Problem**: Using `.single()` with `.limit(1)` in Supabase causes a 406 error when zero rows exist.

**Error**: `GET .../website_generations?...&limit=1 406 (Not Acceptable)` with code `PGRST116`

**Solution**: Changed `.single()` to `.maybeSingle()` in `getLatestWebsiteGeneration()` function.

### Why This Happened

- `.single()` expects EXACTLY one row and throws error if zero rows
- `.maybeSingle()` returns `null` if zero rows, which is what we want
- This is why verification worked (data existed) but initial load failed (no data yet)

## Files Modified

1. `src/react-app/pages/AppBuilder.tsx` - Added detailed logging for load and save operations
2. `src/services/databaseService.ts` - Fixed query to use `.maybeSingle()` and added logging

## Testing Instructions

1. Open the app in browser
2. Open Developer Console (F12)
3. Create a new app with a prompt
4. Watch the website generate
5. **Reload the page** (Ctrl+R or F5)
6. The website should now persist! ✅

The fix ensures that when loading a website, if no generations exist yet, it returns `null` gracefully instead of throwing a 406 error.
