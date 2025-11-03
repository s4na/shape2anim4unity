# Quick Start Guide

## Running the Application

### Method 1: Python Simple HTTP Server (Easiest)

If you have Python installed:

```bash
# Navigate to the project directory
cd unity-animation-editor

# Python 3
python -m http.server 8000

# Or Python 2
python -m SimpleHTTPServer 8000
```

Then open your browser to: http://localhost:8000

### Method 2: Node.js with npx

If you have Node.js installed:

```bash
cd unity-animation-editor
npx serve
```

Then open the URL shown in the terminal (usually http://localhost:3000)

### Method 3: PHP Built-in Server

If you have PHP installed:

```bash
cd unity-animation-editor
php -S localhost:8000
```

Then open your browser to: http://localhost:8000

### Method 4: VS Code Live Server Extension

1. Install the "Live Server" extension in VS Code
2. Open the project folder in VS Code
3. Right-click on `index.html`
4. Select "Open with Live Server"

## Testing the Application

### Test the Text to File Converter

1. Go to the "Text to File" tab
2. Copy the example animation from `assets/examples/sample-animation.anim`
3. Paste it into the text editor
4. You should see a green "Valid Unity animation format" indicator
5. Click "Download .anim" to download the file

### Test the Remove Zeros Tool

1. Go to the "Remove Zeros" tab
2. Upload the file `assets/examples/sample-animation.anim`
3. Keep the default options
4. Click "Process Animation"
5. You should see statistics showing:
   - Original keyframes: 10
   - Removed keyframes: 3 (the zero-value keyframes in the second curve)
   - Remaining keyframes: 7
6. Click "Download Processed File" to save the optimized animation

### Test Theme Toggle

- Click the sun/moon icon in the header to toggle between light and dark themes
- Your preference will be saved for future visits

## Browser Console

Open your browser's developer console (F12) to see:
- Initialization messages
- Any errors or warnings
- Debug information

## Common Issues

### Blank Page
- Check browser console for errors
- Ensure you're using a web server (not opening the file directly with `file://`)
- Try a different browser

### Module Import Errors
- Make sure you're running the app through a web server
- Modern browsers require a server for ES6 module imports

### File Upload Not Working
- Check that the file is a `.anim` file
- Ensure the file is under 10MB
- Check browser console for specific errors

## Features to Try

1. **Text to File Converter:**
   - Paste animation YAML and download as .anim
   - Try pasting invalid content to see validation errors
   - Edit the animation name and see it auto-update the filename

2. **Remove Zeros Tool:**
   - Upload an animation with zero-value keyframes
   - Try different threshold values
   - Toggle "Preserve first/last keyframes" to see the difference
   - Select specific curve types to process

3. **Theme:**
   - Switch between dark and light themes
   - Notice how your preference is saved

## Next Steps

- Read the full README.md for detailed documentation
- Check plan.md for future features and technical details
- Report any issues on GitHub
- Contribute improvements via pull requests

## Support

If you encounter issues:
1. Check the browser console for errors
2. Review this guide
3. Check the main README.md
4. Open an issue on GitHub with:
   - Browser and version
   - Steps to reproduce
   - Error messages from console
