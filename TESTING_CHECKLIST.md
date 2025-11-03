# Testing Checklist

Use this checklist to verify all features are working correctly.

## Initial Setup

- [ ] Start local web server
- [ ] Open application in browser
- [ ] Check console for any errors
- [ ] Verify page loads correctly
- [ ] Check responsive design (resize browser window)

## Theme System

### Light Theme (Default)
- [ ] Application starts in light theme
- [ ] Colors are appropriate for light theme
- [ ] Text is readable

### Dark Theme
- [ ] Click theme toggle button
- [ ] Theme switches to dark mode
- [ ] Colors are appropriate for dark theme
- [ ] Text is readable
- [ ] Reload page - theme preference should persist

### Theme Toggle
- [ ] Toggle back to light theme
- [ ] Animation is smooth
- [ ] All elements transition properly
- [ ] Reload page - light theme persists

## Tab Navigation

- [ ] "Text to File" tab is active by default
- [ ] Click "Remove Zeros" tab - switches correctly
- [ ] Click "About" tab - switches correctly
- [ ] Click "Text to File" tab - returns to first tab
- [ ] Active tab has visual indicator
- [ ] Content changes when switching tabs

## Text to File Converter

### Empty State
- [ ] Textarea is empty
- [ ] Validation shows "No content"
- [ ] Status indicator is gray
- [ ] Download button is disabled
- [ ] Filename shows "animation.anim"

### Invalid Content
- [ ] Paste invalid text (e.g., "hello world")
- [ ] Validation shows "Invalid format"
- [ ] Status indicator is red
- [ ] Error messages appear below textarea
- [ ] Download button is disabled

### Valid Content
- [ ] Copy content from `assets/examples/sample-animation.anim`
- [ ] Paste into textarea
- [ ] Validation shows "Valid Unity animation format"
- [ ] Status indicator is green
- [ ] No error messages
- [ ] Download button is enabled
- [ ] Filename auto-updates to "SampleAnimation.anim"

### Validation Edge Cases
- [ ] Paste content without YAML header - shows error
- [ ] Paste content without AnimationClip - shows error
- [ ] Paste very long content - validation still works (may take a moment)

### Filename Input
- [ ] Change filename to "test"
- [ ] Download button still works
- [ ] Clear filename
- [ ] Enter "myanimation.anim"

### Download Functionality
- [ ] Click "Download .anim" button
- [ ] File downloads successfully
- [ ] Downloaded file has correct name
- [ ] Open downloaded file in text editor - content matches input
- [ ] Status bar shows "Downloaded: [filename]"

### Clear Functionality
- [ ] Click "Clear" button
- [ ] Textarea clears
- [ ] Validation resets to "No content"
- [ ] Filename resets to "animation.anim"
- [ ] Download button is disabled

## Remove Zeros Tool

### Upload Section - Browse
- [ ] Click "Browse Files" button
- [ ] File picker opens
- [ ] Select `assets/examples/sample-animation.anim`
- [ ] Upload zone is hidden
- [ ] File info appears with correct name and size
- [ ] Options section appears
- [ ] Action buttons appear

### Upload Section - Drag & Drop
- [ ] Reset the tool (if needed)
- [ ] Drag the sample animation file over the upload zone
- [ ] Upload zone highlights/changes appearance
- [ ] Drop the file
- [ ] File uploads successfully
- [ ] UI updates as above

### File Validation
- [ ] Try uploading a non-.anim file (e.g., .txt)
- [ ] Should show error message
- [ ] Try uploading a very large file (> 10MB if available)
- [ ] Should show error message

### Options - Default State
- [ ] "Remove exact zero values" is checked
- [ ] "Remove near-zero values" is unchecked
- [ ] Threshold control is hidden
- [ ] "Preserve first and last keyframes" is checked
- [ ] "Remove empty curves" is checked
- [ ] All curve types are checked (Float, Position, Rotation, Scale)

### Options - Near-Zero Threshold
- [ ] Check "Remove near-zero values"
- [ ] Threshold control appears
- [ ] Slider shows 0.0001
- [ ] Move slider left - value decreases
- [ ] Move slider right - value increases
- [ ] Value updates in real-time

### Options - Curve Type Selection
- [ ] Uncheck "Float Curves"
- [ ] Uncheck "Position"
- [ ] Uncheck "Rotation"
- [ ] Uncheck "Scale"
- [ ] Check them all again

### Processing
- [ ] Click "Process Animation" button
- [ ] Status bar shows "Processing..."
- [ ] Results section appears
- [ ] Statistics show:
  - Original Keyframes: 10
  - Keyframes Removed: (depends on options)
  - Remaining Keyframes: (depends on options)
  - Size Reduction: (percentage)
- [ ] Processing status shows success message
- [ ] Process button hides
- [ ] Download button appears

### Processing with Different Options

#### Test 1: Exact Zeros Only
- [ ] Reset and upload sample animation
- [ ] Keep only "Remove exact zero values" checked
- [ ] Process animation
- [ ] Verify statistics (should remove middle keyframes from second curve)

#### Test 2: Near-Zero with Threshold
- [ ] Reset and upload sample animation
- [ ] Check "Remove near-zero values"
- [ ] Set threshold to 0.1
- [ ] Process animation
- [ ] Verify different results

#### Test 3: Don't Preserve First/Last
- [ ] Reset and upload sample animation
- [ ] Uncheck "Preserve first and last keyframes"
- [ ] Process animation
- [ ] Should remove more keyframes

#### Test 4: Keep Empty Curves
- [ ] Reset and upload sample animation
- [ ] Uncheck "Remove empty curves"
- [ ] Process animation
- [ ] File should be larger (empty curves retained)

### Download Processed File
- [ ] Click "Download Processed File"
- [ ] File downloads with "_processed" suffix
- [ ] Open downloaded file in text editor
- [ ] Verify structure is still valid Unity animation format
- [ ] Verify zero-value keyframes are removed
- [ ] Status bar updates

### Change File
- [ ] Click "Change File" button
- [ ] File picker opens
- [ ] Select same or different file
- [ ] UI resets to show new file
- [ ] Options remain as configured
- [ ] Results section hides

### Reset
- [ ] Click "Reset" button
- [ ] UI returns to initial upload state
- [ ] All sections hide except upload zone
- [ ] Status bar shows "Ready"

## About Tab

- [ ] Click "About" tab
- [ ] Content displays correctly
- [ ] All sections are readable
- [ ] Links work (if any)
- [ ] Scroll through entire content
- [ ] Text is properly formatted

## Status Bar

- [ ] Check initial status: "Ready"
- [ ] Upload file - status updates
- [ ] Process animation - status shows "Processing..."
- [ ] Complete processing - status shows "Processing complete"
- [ ] Download file - status shows "Downloaded: [filename]"
- [ ] Status updates are visible and readable

## Responsive Design

### Desktop (> 1024px)
- [ ] Full layout displays correctly
- [ ] All elements properly spaced
- [ ] Text readable at normal size

### Tablet (768px - 1024px)
- [ ] Layout adapts appropriately
- [ ] No horizontal scrolling
- [ ] Touch targets are adequate size

### Mobile (< 768px)
- [ ] Tab navigation scrolls horizontally if needed
- [ ] Buttons stack vertically
- [ ] Text remains readable
- [ ] Touch targets are large enough
- [ ] Statistics grid adjusts (2 columns)
- [ ] No horizontal scrolling

## Browser Compatibility

Test on each browser:

### Chrome/Edge
- [ ] All features work
- [ ] No console errors
- [ ] Performance is good
- [ ] File upload/download works

### Firefox
- [ ] All features work
- [ ] No console errors
- [ ] Performance is good
- [ ] File upload/download works

### Safari
- [ ] All features work
- [ ] No console errors
- [ ] Performance is good
- [ ] File upload/download works

### Mobile Safari (iOS)
- [ ] All features work
- [ ] Touch interactions work
- [ ] File upload works
- [ ] File download works

### Chrome Mobile (Android)
- [ ] All features work
- [ ] Touch interactions work
- [ ] File upload works
- [ ] File download works

## Performance

- [ ] Page loads in < 2 seconds
- [ ] Validation responds quickly (< 300ms)
- [ ] File upload processes quickly
- [ ] Animation processing completes in reasonable time
- [ ] Theme switching is instant
- [ ] No lag in UI interactions
- [ ] Large files (close to 10MB) still work

## Error Handling

### File Errors
- [ ] Upload invalid file type - shows error
- [ ] Upload too large file - shows error
- [ ] Upload corrupted file - shows error

### Content Errors
- [ ] Paste invalid YAML - shows validation errors
- [ ] Paste incomplete animation - shows errors
- [ ] Paste very long text - handles gracefully

### Edge Cases
- [ ] Try to download with no content - button disabled
- [ ] Try to process with no file - shouldn't be possible
- [ ] Rapid clicking of buttons - handles gracefully
- [ ] Switch tabs while processing - handles gracefully

## Accessibility

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Focus indicators are visible
- [ ] Can activate buttons with Enter/Space
- [ ] Can navigate tabs with keyboard
- [ ] No keyboard traps

### Visual
- [ ] Text has sufficient contrast
- [ ] Focus indicators are clear
- [ ] Color is not the only indicator
- [ ] Icons have text alternatives

### Screen Reader (if available)
- [ ] Buttons have descriptive labels
- [ ] Form inputs have labels
- [ ] Status updates are announced
- [ ] Navigation is logical

## Integration Tests

### Complete Workflow 1: Text to File
1. [ ] Open application
2. [ ] Paste sample animation content
3. [ ] Verify validation passes
4. [ ] Change filename
5. [ ] Download file
6. [ ] Verify downloaded file is correct
7. [ ] Clear editor
8. [ ] Upload the downloaded file in Remove Zeros tab
9. [ ] Verify it processes correctly

### Complete Workflow 2: Remove Zeros
1. [ ] Open application
2. [ ] Go to Remove Zeros tab
3. [ ] Upload sample animation
4. [ ] Configure options
5. [ ] Process animation
6. [ ] Verify statistics
7. [ ] Download processed file
8. [ ] Go to Text to File tab
9. [ ] Paste processed file content
10. [ ] Verify it validates correctly
11. [ ] Verify keyframes were actually removed

### Complete Workflow 3: Theme Persistence
1. [ ] Open application (light theme)
2. [ ] Switch to dark theme
3. [ ] Use application features
4. [ ] Close browser tab
5. [ ] Reopen application
6. [ ] Verify dark theme persists

## Final Checks

- [ ] No console errors or warnings
- [ ] All links work
- [ ] All buttons work
- [ ] File operations work correctly
- [ ] Validation works correctly
- [ ] Processing works correctly
- [ ] Theme switching works
- [ ] Tab navigation works
- [ ] Status updates work
- [ ] Responsive design works
- [ ] Performance is acceptable
- [ ] Error handling is graceful

## Bug Tracking

Document any issues found:

| Issue | Severity | Browser | Description | Status |
|-------|----------|---------|-------------|--------|
|       |          |         |             |        |

## Test Results Summary

- **Date Tested:** _______________
- **Tester:** _______________
- **Browsers Tested:** _______________
- **Issues Found:** _______________
- **Critical Issues:** _______________
- **Overall Status:** PASS / FAIL

## Notes

Add any additional observations or comments:

_________________________________________________
_________________________________________________
_________________________________________________
