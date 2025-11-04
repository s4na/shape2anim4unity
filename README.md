# Unity Animation Editor

https://s4na.github.io/unity-animation-editor/

A web-based tool for Unity developers to edit and manipulate Unity animation files (.anim) directly in the browser. No installation required - everything runs locally in your browser.

## Features

### 1. Text to File Converter
- Paste Unity animation YAML content
- Real-time syntax validation
- Download as .anim file
- Auto-extract filename from animation name

### 2. Remove Zeros Tool
- Upload .anim files
- Remove zero-value keyframes to optimize file size
- Configurable options:
  - Exact zero removal (value === 0)
  - Near-zero removal with adjustable threshold
  - Preserve first/last keyframes
  - Remove empty curves
  - Select specific curve types to process
- View statistics and size reduction
- Download optimized file

### 3. BlendShape Import
- Import Unity BlendShapeWeights from GenericPropertyJSON format
- Convert blend shape data to Unity animation files
- Support for both single-frame (static pose) and multi-frame animations
- Automatic filtering of zero-value blend shapes
- Configurable options:
  - Custom animation name
  - Mesh path in hierarchy
  - Sample rate (FPS)
  - Animation duration
- Real-time validation and statistics
- Direct download as .anim file

### 4. Additional Features
- Dark/Light theme toggle
- Drag and drop file upload
- Privacy-focused (all processing happens locally)
- Mobile-responsive design
- Multi-language support (English/Japanese)

## Getting Started

### Option 1: Use Online
Visit the GitHub Pages deployment: [https://s4na.github.io/unity-animation-editor/](https://s4na.github.io/unity-animation-editor/)

### Option 2: Run Locally
1. Clone this repository:
   ```bash
   git clone https://github.com/s4na/unity-animation-editor.git
   cd unity-animation-editor
   ```

2. Serve the files with a local web server. You can use any of these methods:

   **Using Python 3:**
   ```bash
   python -m http.server 8000
   ```

   **Using Node.js (with npx):**
   ```bash
   npx serve
   ```

   **Using PHP:**
   ```bash
   php -S localhost:8000
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

## Usage Guide

### Text to File Converter

1. **Go to the "Text to File" tab**
2. **Paste your animation content:**
   - Copy the YAML content from your Unity .anim file
   - Paste it into the text editor
3. **Validation:**
   - The tool will automatically validate the format
   - Green indicator = valid format
   - Red indicator = invalid format (see error messages below the editor)
4. **Set filename:**
   - The tool will auto-extract the animation name
   - Or manually enter a filename
5. **Download:**
   - Click "Download .anim" to save the file

### Remove Zeros Tool

1. **Go to the "Remove Zeros" tab**
2. **Upload your animation file:**
   - Drag and drop a .anim file, or
   - Click "Browse Files" to select a file
3. **Configure options:**
   - **Remove exact zeros:** Removes keyframes where value === 0
   - **Remove near-zeros:** Removes keyframes within a threshold (adjustable)
   - **Preserve first/last:** Keeps the first and last keyframes of each curve
   - **Remove empty curves:** Removes curves that have no keyframes after processing
   - **Curve types:** Select which curve types to process (Float, Position, Rotation, Scale)
4. **Process:**
   - Click "Process Animation"
   - View statistics showing keyframes removed and file size reduction
5. **Download:**
   - Click "Download Processed File" to save the optimized animation

## Browser Compatibility

This tool works on modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Technical Details

### Technology Stack
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid and Flexbox
- **Vanilla JavaScript (ES6+)** - No frameworks, modular architecture
- **File API** - For reading and downloading files
- **Blob API** - For file creation

### File Structure
```
unity-animation-editor/
├── index.html              # Main HTML file
├── README.md              # This file
├── plan.md                # Project plan and specifications
├── css/
│   ├── main.css          # Base styles
│   ├── layout.css        # Layout and grid
│   ├── components.css    # Component styles
│   └── themes.css        # Color themes
└── js/
    ├── main.js           # Application entry point
    ├── config.js         # Configuration constants
    ├── parsers/
    │   ├── AnimationParser.js      # Parse Unity animation format
    │   └── AnimationSerializer.js  # Serialize to Unity format
    ├── processors/
    │   └── ZeroRemover.js          # Remove zero keyframes
    ├── ui/
    │   ├── TabManager.js           # Tab navigation
    │   ├── ThemeManager.js         # Theme switching
    │   ├── TextToFileUI.js         # Text to file converter UI
    │   └── RemoveZerosUI.js        # Remove zeros tool UI
    └── utils/
        └── FileHandler.js          # File I/O operations
```

### Unity Animation File Format

Unity animation files (.anim) are YAML-based text files with the following structure:

```yaml
%YAML 1.1
%TAG !u! tag:unity3d.com,2011:
--- !u!74 &7400000
AnimationClip:
  m_ObjectHideFlags: 0
  m_Name: MyAnimation
  m_SampleRate: 60
  m_WrapMode: 0
  m_FloatCurves:
  - curve:
      m_Curve:
      - serializedVersion: 3
        time: 0
        value: 1
        inSlope: 0
        outSlope: 0
        tangentMode: 136
        weightedMode: 0
        inWeight: 0.33333334
        outWeight: 0.33333334
    attribute: m_IsActive
    path: GameObject/Path
    classID: 1
  # ... more curves and settings
```

## Privacy & Security

- **No Server Communication:** All processing happens entirely in your browser
- **No Data Collection:** We don't track or store any user data
- **No Analytics:** No external analytics or tracking scripts
- **Local Only:** Your animation files never leave your computer

## Known Limitations

1. **File Size:** Maximum file size is 10MB
2. **Complex Parsing:** Very complex or unusual Unity animation formats may not parse correctly
3. **Unity Version:** Tested with Unity 2019.x - 2023.x animation formats
4. **Browser Required:** Requires a modern browser with JavaScript enabled

## Future Enhancements

Planned features for future versions:
- Animation curve visualizer
- Keyframe editor
- Animation merger
- Sample rate converter
- Batch processing
- Animation validation and reporting

See [plan.md](plan.md) for detailed feature specifications.

## Contributing

Contributions are welcome! Please feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## Development

To contribute to this project:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests: `npm test`
5. Test thoroughly in multiple browsers
6. Commit your changes: `git commit -m "Add feature"`
7. Push to the branch: `git push origin feature-name`
8. Submit a pull request

### Running Tests

This project includes a comprehensive test suite using Jest and Playwright.

```bash
# Install dependencies
npm install

# Run unit and integration tests with Jest
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run E2E tests with Playwright (headless browser)
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run E2E tests in headed mode (visible browser)
npm run test:e2e:headed
```

#### Test Coverage

- **Unit Tests**: Parser, serializer, and processor logic
- **Integration Tests**: BlendShape weight import workflow from text file to animation
- **E2E Tests**: Full browser-based testing of UI interactions (Playwright)

The integration test suite includes comprehensive testing of the BlendShape import feature:
- Parsing Unity GenericPropertyJSON format from text files
- Generating valid Unity animation files
- Multi-frame animation support
- Data integrity validation
- End-to-end workflow verification

Tests are automatically run on push and pull requests via GitHub Actions.

### Coding Standards
- Use ES6+ JavaScript features
- Follow existing code structure and naming conventions
- Comment complex logic
- Ensure responsive design
- Test on Chrome, Firefox, and Safari

## License

MIT License - See [LICENSE](LICENSE) file for details

## Acknowledgments

- Built for the Unity developer community
- Inspired by the need for quick animation file manipulation without opening Unity Editor

## Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the [plan.md](plan.md) for technical details

## Changelog

### Version 1.0.0 (Initial Release)
- Text to file converter
- Remove zeros tool with configurable options
- Dark/light theme support
- Drag and drop file upload
- Real-time validation
- Statistics and size reduction display

---

**Made with ❤️ for Unity Developers**
