# Unity Animation Editor - Project Plan

## 1. Project Overview

### Purpose
Create a web-based tool for Unity developers to edit and manipulate Unity animation files directly in the browser. The tool will provide utilities for common animation editing tasks without requiring Unity Editor to be open.

### Target Audience
- Unity game developers
- Technical artists
- Animation programmers who need quick animation file manipulation

### Key Value Propositions
- No installation required - runs entirely in the browser
- Fast, lightweight tool for common animation tasks
- Open source and free to use
- Works offline after initial load (GitHub Pages + service worker)

## 2. Technical Architecture

### Technology Stack
- **HTML5**: Semantic markup, modern APIs (File API, Blob API)
- **CSS3**: Modern layout (CSS Grid, Flexbox), custom properties for theming
- **Vanilla JavaScript (ES6+)**: No frameworks, modular architecture
- **GitHub Pages**: Static hosting

### Browser Compatibility Target
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

### Core Architecture Patterns
```
Model-View-Controller (MVC) Pattern:
- Models: Animation data structures
- Views: UI components and rendering
- Controllers: User interaction handlers and business logic
```

### Module Structure
```javascript
// Core modules
- AnimationParser.js    // Parse Unity animation format
- AnimationSerializer.js // Convert back to Unity format
- AnimationProcessor.js  // Edit operations (remove zeros, etc.)
- FileHandler.js         // File upload/download operations
- UIManager.js           // DOM manipulation and UI updates
- ValidationService.js   // Input validation and error handling
```

## 3. Unity Animation File Format

### Understanding Unity Animation Files (.anim)

Unity animation files are YAML-based text files with the following structure:

```yaml
%YAML 1.1
%TAG !u! tag:unity3d.com,2011:
--- !u!74 &7400000
AnimationClip:
  m_ObjectHideFlags: 0
  m_CorrespondingSourceObject: {fileID: 0}
  m_PrefabInstance: {fileID: 0}
  m_PrefabAsset: {fileID: 0}
  m_Name: AnimationName
  serializedVersion: 6
  m_Legacy: 0
  m_Compressed: 0
  m_UseHighQualityCurve: 1
  m_RotationCurves: []
  m_CompressedRotationCurves: []
  m_EulerCurves: []
  m_PositionCurves: []
  m_ScaleCurves: []
  m_FloatCurves:
  - curve:
      serializedVersion: 2
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
    script: {fileID: 0}
  m_PPtrCurves: []
  m_SampleRate: 60
  m_WrapMode: 0
  m_Bounds:
    m_Center: {x: 0, y: 0, z: 0}
    m_Extent: {x: 0, y: 0, z: 0}
  m_ClipBindingConstant:
    genericBindings: []
    pptrCurveMapping: []
  m_AnimationClipSettings:
    serializedVersion: 2
    m_AdditiveReferencePoseClip: {fileID: 0}
    m_AdditiveReferencePoseTime: 0
    m_StartTime: 0
    m_StopTime: 1
    m_OrientationOffsetY: 0
    m_Level: 0
    m_CycleOffset: 0
    m_HasAdditiveReferencePose: 0
    m_LoopTime: 0
    m_LoopBlend: 0
    m_LoopBlendOrientation: 0
    m_LoopBlendPositionY: 0
    m_LoopBlendPositionXZ: 0
    m_KeepOriginalOrientation: 0
    m_KeepOriginalPositionY: 1
    m_KeepOriginalPositionXZ: 0
    m_HeightFromFeet: 0
    m_Mirror: 0
  m_EditorCurves: []
  m_EulerEditorCurves: []
  m_HasGenericRootTransform: 0
  m_HasMotionFloatCurves: 0
  m_Events: []
```

### Key Components to Parse
- **Animation Curves**: Position, Rotation, Scale, Float curves
- **Keyframes**: Time, value, tangent information
- **Metadata**: Sample rate, wrap mode, loop settings
- **Bindings**: Object paths and property bindings

## 4. Feature Specifications

### Feature 1: Text to Animation File Converter

**User Story**: As a developer, I want to paste Unity animation text and download it as a .anim file.

**Functional Requirements**:
- Large textarea for pasting animation text
- Real-time syntax validation
- Visual feedback for valid/invalid format
- "Download" button to save as .anim file
- File name input field (defaults to animation name from content)
- Clear/Reset button

**Technical Implementation**:
```javascript
// Validation steps:
1. Check YAML header format
2. Verify AnimationClip structure
3. Validate curve data format
4. Check for common syntax errors

// Download process:
1. Create Blob from text content
2. Generate download link
3. Trigger download with proper filename
4. Preserve original formatting
```

**UI Components**:
- Header: "Text to Animation File"
- Textarea (monospace font, line numbers)
- Validation status indicator (green/red/yellow)
- Error message display area
- File name input
- Action buttons (Download, Clear)

**Validation Rules**:
- Must start with "%YAML 1.1"
- Must contain "AnimationClip:" tag
- Proper indentation (2 or 4 spaces)
- Valid curve structure
- Numeric values in proper format

### Feature 2: Remove Zeros from Animation

**User Story**: As an animator, I want to upload an animation file and remove all keyframes with zero values to optimize file size.

**Functional Requirements**:
- File upload area (drag & drop + click to browse)
- Display uploaded file name and size
- Preview of original animation data
- Configuration options:
  - Remove keyframes where value = 0
  - Remove keyframes where value ≈ 0 (with threshold input)
  - Choose which curve types to process (Position/Rotation/Scale/Float)
  - Option to remove entire curves if all values are zero
- Preview of changes (before/after comparison)
- Statistics display (keyframes removed, file size reduction)
- Download processed file

**Technical Implementation**:
```javascript
// Processing algorithm:
1. Parse uploaded file
2. Iterate through all curves
3. For each keyframe:
   - Check if value matches removal criteria
   - Preserve first and last keyframes (configurable)
   - Handle tangent recalculation for surrounding keyframes
4. Remove empty curves (optional)
5. Rebuild animation file
6. Generate statistics

// Edge cases:
- Single keyframe curves
- All-zero curves
- Curves with only start/end keyframes
- Preserve animation timing
```

**UI Components**:
- File upload zone (drag & drop)
- File info display
- Options panel (checkboxes, sliders)
- Before/After comparison view
- Statistics panel
- Action buttons (Process, Download, Cancel)

**Threshold Configuration**:
- Exact zero: value === 0
- Near zero: Math.abs(value) < threshold
- Default threshold: 0.0001
- Adjustable slider (0.00001 to 0.01)

### Feature 3: Animation Curve Visualizer

**User Story**: As a developer, I want to visualize animation curves to understand timing and values.

**Functional Requirements**:
- Load animation from file or text
- Display list of all curves in the animation
- Select curves to visualize
- Interactive graph showing:
  - Time (x-axis)
  - Value (y-axis)
  - Keyframe markers
  - Tangent handles
- Zoom and pan controls
- Export graph as image (PNG)

**Technical Implementation**:
```javascript
// Rendering:
- Use HTML5 Canvas API
- Draw axes with labels
- Plot curves using Bezier paths
- Interactive hover tooltips
- Legend for multiple curves

// Data structure:
{
  curves: [
    {
      name: "Position.x",
      color: "#FF0000",
      keyframes: [{time, value, inSlope, outSlope}]
    }
  ]
}
```

**UI Components**:
- Curve list panel (tree view by object/property)
- Canvas area for visualization
- Control panel (zoom, pan, reset)
- Keyframe inspector (shows details on hover)
- Export button

### Feature 4: Animation Merger

**User Story**: As a developer, I want to merge multiple animation files into one.

**Functional Requirements**:
- Upload multiple animation files
- Preview all curves from all files
- Resolve naming conflicts
- Time offset control for each animation
- Preview merged result
- Download merged animation file

**Technical Implementation**:
```javascript
// Merge algorithm:
1. Load all animation files
2. Extract all curves
3. Check for path/attribute conflicts
4. Apply time offsets
5. Combine curves
6. Update animation duration
7. Rebuild bindings
```

**Conflict Resolution**:
- Same path + attribute: Option to rename or override
- Different sample rates: Option to resample
- Different wrap modes: Use first file's settings

### Feature 5: Keyframe Editor

**User Story**: As an animator, I want to manually edit keyframe values and timing.

**Functional Requirements**:
- Load animation file
- Display all keyframes in a table
- Edit capabilities:
  - Time value
  - Keyframe value
  - Tangent modes
  - In/Out slopes
- Add/Delete keyframes
- Undo/Redo functionality
- Real-time preview (if visualizer enabled)
- Save changes

**Technical Implementation**:
```javascript
// Data binding:
- Two-way binding between table and data model
- Validation on input
- History stack for undo/redo
- Debounced updates for performance

// Constraints:
- Time must be within animation bounds
- Keyframes sorted by time
- Valid numeric values only
```

### Feature 6: Animation Info & Validation

**User Story**: As a developer, I want to see detailed information about an animation file.

**Functional Requirements**:
- Display animation metadata:
  - Name
  - Duration
  - Sample rate
  - Loop settings
  - Number of curves
  - Number of keyframes (total)
  - File size
- Validation checks:
  - Syntax errors
  - Missing required fields
  - Invalid numeric values
  - Curve integrity
  - Binding validity
- Warning/Error reporting
- Export validation report

**Technical Implementation**:
```javascript
// Validation levels:
- Critical: Prevents Unity from loading
- Warning: May cause unexpected behavior
- Info: Best practice suggestions

// Checks:
- YAML syntax
- Unity version compatibility
- Curve continuity
- Reasonable value ranges
- Performance concerns (too many keyframes)
```

### Feature 7: Sample Rate Converter

**User Story**: As a developer, I want to change the sample rate of an animation.

**Functional Requirements**:
- Input target sample rate (30, 60, 120 fps)
- Resample all curves
- Interpolate new keyframes
- Preview changes
- Download resampled animation

**Technical Implementation**:
```javascript
// Resampling algorithm:
1. Determine new time intervals
2. For each new sample point:
   - Evaluate curve at that time
   - Create new keyframe
3. Recalculate tangents
4. Update sample rate metadata
```

## 5. File Structure

```
unity-animation-editor/
├── index.html              # Main HTML file
├── plan.md                 # This file
├── README.md              # Project documentation
├── LICENSE                # MIT License
├── .gitignore            # Git ignore rules
│
├── css/
│   ├── main.css          # Main stylesheet
│   ├── components.css    # Reusable component styles
│   ├── layout.css        # Layout and grid styles
│   └── themes.css        # Color themes (light/dark)
│
├── js/
│   ├── main.js           # Application entry point
│   ├── config.js         # Configuration constants
│   │
│   ├── models/
│   │   ├── Animation.js          # Animation data model
│   │   ├── Curve.js              # Curve data model
│   │   └── Keyframe.js           # Keyframe data model
│   │
│   ├── parsers/
│   │   ├── YAMLParser.js         # YAML parsing utilities
│   │   ├── AnimationParser.js    # Parse Unity animation format
│   │   └── AnimationSerializer.js # Serialize to Unity format
│   │
│   ├── processors/
│   │   ├── ZeroRemover.js        # Remove zero keyframes
│   │   ├── CurveMerger.js        # Merge animations
│   │   ├── SampleRateConverter.js # Change sample rate
│   │   └── KeyframeOptimizer.js  # Optimize keyframes
│   │
│   ├── validators/
│   │   ├── SyntaxValidator.js    # YAML syntax validation
│   │   ├── StructureValidator.js # Animation structure validation
│   │   └── ValueValidator.js     # Value range validation
│   │
│   ├── ui/
│   │   ├── UIManager.js          # Main UI controller
│   │   ├── TabManager.js         # Tab navigation
│   │   ├── FileUploader.js       # File upload component
│   │   ├── TextEditor.js         # Text editor component
│   │   ├── CurveVisualizer.js    # Canvas-based visualizer
│   │   ├── KeyframeTable.js      # Table editor component
│   │   ├── ValidationDisplay.js  # Validation messages
│   │   └── StatisticsPanel.js    # Statistics display
│   │
│   └── utils/
│       ├── FileHandler.js        # File I/O operations
│       ├── BlobUtils.js          # Blob creation utilities
│       ├── MathUtils.js          # Math helper functions
│       ├── CurveEvaluation.js    # Bezier curve evaluation
│       └── ErrorHandler.js       # Global error handling
│
├── assets/
│   ├── images/
│   │   ├── logo.svg              # Application logo
│   │   ├── icon-192.png          # PWA icon
│   │   └── icon-512.png          # PWA icon
│   │
│   └── examples/
│       ├── sample-animation.anim # Example animation file
│       ├── walk-cycle.anim       # Walk cycle example
│       └── README.md             # Examples documentation
│
├── docs/
│   ├── user-guide.md             # User documentation
│   ├── api-reference.md          # Internal API docs
│   └── unity-format.md           # Unity format specification
│
└── tests/
    ├── test-runner.html          # Browser-based test runner
    ├── unit/
    │   ├── parser.test.js        # Parser tests
    │   ├── processor.test.js     # Processor tests
    │   └── validator.test.js     # Validator tests
    └── fixtures/
        ├── valid-animation.anim  # Test fixture
        └── invalid-animation.anim # Test fixture
```

## 6. User Interface Design

### Overall Layout

```
┌────────────────────────────────────────────────────────┐
│ [Logo] Unity Animation Editor          [Theme] [Help]  │
├────────────────────────────────────────────────────────┤
│ [Text→File] [Remove Zeros] [Visualize] [Merge] [Edit] │ <- Tabs
├────────────────────────────────────────────────────────┤
│                                                         │
│                                                         │
│                   Main Content Area                     │
│                   (Tab-specific UI)                     │
│                                                         │
│                                                         │
├────────────────────────────────────────────────────────┤
│ Status Bar: Ready | File: none | Size: 0 KB            │
└────────────────────────────────────────────────────────┘
```

### Color Scheme

**Light Theme**:
- Primary: #1976D2 (Blue)
- Secondary: #424242 (Grey)
- Success: #388E3C (Green)
- Warning: #F57C00 (Orange)
- Error: #D32F2F (Red)
- Background: #FFFFFF
- Surface: #F5F5F5
- Text: #212121

**Dark Theme**:
- Primary: #42A5F5 (Light Blue)
- Secondary: #BDBDBD (Light Grey)
- Success: #66BB6A (Light Green)
- Warning: #FFA726 (Light Orange)
- Error: #EF5350 (Light Red)
- Background: #121212
- Surface: #1E1E1E
- Text: #FFFFFF

### Typography
- Headings: 'Segoe UI', Roboto, sans-serif
- Body: 'Segoe UI', Roboto, sans-serif
- Code: 'Consolas', 'Monaco', monospace

### Component Design Patterns

**Button Styles**:
- Primary action: Filled, primary color
- Secondary action: Outlined
- Danger action: Filled, error color
- Consistent padding: 12px 24px
- Border radius: 4px

**Input Fields**:
- Border: 1px solid (theme-dependent)
- Focus: 2px border, primary color
- Error state: Red border + error message
- Height: 40px
- Padding: 8px 12px

**Cards**:
- Shadow: 0 2px 4px rgba(0,0,0,0.1)
- Border radius: 8px
- Padding: 16px
- Margin: 16px

**File Upload Zone**:
- Dashed border: 2px dashed
- Hover state: Primary color background (light)
- Drag over state: Primary color background (darker)
- Min height: 200px
- Center-aligned content

## 7. Implementation Steps

### Phase 1: Project Setup (Week 1)

**Tasks**:
1. Initialize Git repository
2. Create project structure (folders)
3. Set up GitHub repository
4. Create README.md with project description
5. Add LICENSE file (MIT)
6. Create basic HTML structure
7. Set up CSS architecture (main, layout, components)
8. Create color theme CSS variables
9. Implement dark/light theme toggle
10. Set up GitHub Pages deployment

**Deliverables**:
- Working GitHub Pages site with basic layout
- Theme switcher functional
- Navigation structure in place

### Phase 2: Core Parsing & Serialization (Week 2)

**Tasks**:
1. Implement YAMLParser.js (basic YAML parsing)
2. Create data models (Animation, Curve, Keyframe)
3. Implement AnimationParser.js
   - Parse YAML header
   - Extract animation metadata
   - Parse curve data
   - Parse keyframe data
4. Implement AnimationSerializer.js
   - Rebuild YAML structure
   - Format curves correctly
   - Preserve formatting and comments
5. Create unit tests for parsers
6. Test with real Unity animation files

**Deliverables**:
- Functional parser that can read Unity .anim files
- Serializer that outputs valid Unity format
- Test suite covering common cases

### Phase 3: Feature 1 - Text to File Converter (Week 3)

**Tasks**:
1. Create TextEditor.js component
2. Implement syntax highlighting (basic)
3. Create SyntaxValidator.js
4. Implement real-time validation
5. Create ValidationDisplay.js component
6. Implement FileHandler.js (download)
7. Build UI for Text→File tab
8. Add examples and help text
9. Test with various input formats
10. Add error handling

**Deliverables**:
- Working text-to-file converter
- Validation with helpful error messages
- Download functionality

### Phase 4: Feature 2 - Zero Remover (Week 4)

**Tasks**:
1. Implement ZeroRemover.js
2. Create configuration UI (options panel)
3. Implement FileUploader.js component
4. Add drag-and-drop support
5. Create before/after comparison view
6. Implement StatisticsPanel.js
7. Add threshold slider
8. Implement curve-type filtering
9. Test with various animation files
10. Optimize for large files

**Deliverables**:
- Working zero removal tool
- Statistics showing changes
- Configurable options

### Phase 5: Feature 3 - Curve Visualizer (Week 5)

**Tasks**:
1. Implement CurveVisualizer.js (Canvas-based)
2. Create curve evaluation functions
3. Implement zoom and pan controls
4. Add curve selection UI
5. Implement keyframe markers
6. Add hover tooltips
7. Create legend component
8. Implement graph export (PNG)
9. Add color customization
10. Optimize rendering performance

**Deliverables**:
- Interactive curve visualization
- Multi-curve support
- Export functionality

### Phase 6: Additional Features (Week 6)

**Tasks**:
1. Implement CurveMerger.js
2. Create merge UI with conflict resolution
3. Implement KeyframeTable.js
4. Add keyframe editing functionality
5. Implement undo/redo system
6. Create SampleRateConverter.js
7. Add animation info panel
8. Implement validation report export
9. Create KeyframeOptimizer.js
10. Add batch processing support

**Deliverables**:
- Merge functionality
- Keyframe editor
- Sample rate converter
- Info panel

### Phase 7: Polish & Documentation (Week 7)

**Tasks**:
1. Comprehensive testing on all browsers
2. Performance optimization
3. Accessibility improvements (ARIA labels, keyboard nav)
4. Create user guide documentation
5. Add inline help tooltips
6. Create example animation files
7. Record demo videos/GIFs
8. Write API documentation
9. Add analytics (privacy-focused)
10. Create FAQ section

**Deliverables**:
- Polished, production-ready application
- Complete documentation
- Example files and tutorials

### Phase 8: Advanced Features (Optional)

**Tasks**:
1. Implement PWA support (service worker)
2. Add offline functionality
3. Implement local storage for drafts
4. Create keyboard shortcuts
5. Add export to different formats (JSON, CSV)
6. Implement animation comparison tool
7. Add curve simplification algorithm
8. Create plugin system for extensibility
9. Add collaborative features (share links)
10. Implement animation playback preview

**Deliverables**:
- PWA installable app
- Advanced power-user features
- Extended format support

## 8. Technical Implementation Details

### 8.1 YAML Parsing Strategy

Since Unity animation files use a specific YAML format, we have two options:

**Option A: Full YAML Parser**
- Use a lightweight YAML library (js-yaml)
- Parse entire structure
- Pros: Handles all edge cases
- Cons: Larger file size, dependency

**Option B: Custom Parser**
- Write regex-based parser for Unity format
- Parse only necessary sections
- Pros: No dependencies, smaller size
- Cons: May miss edge cases

**Recommendation**: Start with Option B (custom parser) for lightweight solution, with fallback notes for Option A if needed.

### 8.2 File Handling

```javascript
// Upload
const handleFileUpload = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const content = e.target.result;
    processAnimation(content);
  };
  reader.readAsText(file);
};

// Download
const downloadFile = (content, filename) => {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};
```

### 8.3 Zero Removal Algorithm

```javascript
const removeZeros = (animation, options) => {
  const {
    threshold = 0,
    preserveFirstLast = true,
    curveTypes = ['all'],
    removeEmptyCurves = true
  } = options;
  
  const processed = { ...animation };
  
  // Iterate through each curve type
  ['m_FloatCurves', 'm_PositionCurves', 'm_RotationCurves', 'm_ScaleCurves'].forEach(curveType => {
    if (!processed[curveType]) return;
    
    processed[curveType] = processed[curveType].map(curve => {
      const filteredKeyframes = curve.curve.m_Curve.filter((kf, idx, arr) => {
        // Preserve first and last if option enabled
        if (preserveFirstLast && (idx === 0 || idx === arr.length - 1)) {
          return true;
        }
        
        // Check threshold
        return Math.abs(kf.value) > threshold;
      });
      
      return {
        ...curve,
        curve: {
          ...curve.curve,
          m_Curve: filteredKeyframes
        }
      };
    });
    
    // Remove empty curves if option enabled
    if (removeEmptyCurves) {
      processed[curveType] = processed[curveType].filter(
        curve => curve.curve.m_Curve.length > 0
      );
    }
  });
  
  return processed;
};
```

### 8.4 Curve Visualization with Canvas

```javascript
class CurveVisualizer {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.curves = [];
    this.viewport = { minX: 0, maxX: 1, minY: -1, maxY: 1 };
  }
  
  drawCurve(curve, color = '#1976D2') {
    const { keyframes } = curve;
    if (keyframes.length === 0) return;
    
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    
    for (let i = 0; i < keyframes.length - 1; i++) {
      const kf1 = keyframes[i];
      const kf2 = keyframes[i + 1];
      
      // Draw Bezier curve between keyframes
      this.drawBezier(kf1, kf2);
    }
    
    this.ctx.stroke();
    
    // Draw keyframe markers
    keyframes.forEach(kf => {
      this.drawKeyframe(kf, color);
    });
  }
  
  drawBezier(kf1, kf2) {
    const p1 = this.worldToScreen(kf1.time, kf1.value);
    const p2 = this.worldToScreen(kf2.time, kf2.value);
    
    // Calculate control points from tangents
    const cp1 = this.calculateControlPoint(kf1, true);
    const cp2 = this.calculateControlPoint(kf2, false);
    
    this.ctx.moveTo(p1.x, p1.y);
    this.ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, p2.x, p2.y);
  }
  
  worldToScreen(x, y) {
    const { width, height } = this.canvas;
    const { minX, maxX, minY, maxY } = this.viewport;
    
    return {
      x: ((x - minX) / (maxX - minX)) * width,
      y: height - ((y - minY) / (maxY - minY)) * height
    };
  }
}
```

### 8.5 Validation Rules

```javascript
const validationRules = {
  // YAML header
  yamlHeader: {
    test: (content) => content.startsWith('%YAML 1.1'),
    message: 'File must start with %YAML 1.1'
  },
  
  // AnimationClip structure
  hasAnimationClip: {
    test: (content) => content.includes('AnimationClip:'),
    message: 'File must contain AnimationClip definition'
  },
  
  // Required fields
  requiredFields: [
    'm_Name',
    'm_SampleRate',
    'm_WrapMode'
  ],
  
  // Curve validation
  curveStructure: {
    requiredFields: ['serializedVersion', 'm_Curve'],
    keyframeFields: ['time', 'value', 'inSlope', 'outSlope']
  },
  
  // Value ranges
  valueRanges: {
    time: { min: 0, max: Infinity },
    sampleRate: { min: 1, max: 240 }
  }
};
```

## 9. Performance Considerations

### 9.1 Large File Handling

- **Streaming**: For files > 1MB, process in chunks
- **Web Workers**: Offload parsing to background thread
- **Virtualization**: For large keyframe tables, render only visible rows
- **Debouncing**: Debounce validation on text input (300ms)
- **Lazy Loading**: Load visualizations only when tab is active

### 9.2 Canvas Optimization

- **Culling**: Only render curves in viewport
- **Level of Detail**: Simplify curves when zoomed out
- **Caching**: Cache curve paths when not changing
- **RequestAnimationFrame**: Smooth animations
- **OffscreenCanvas**: For background rendering (when supported)

### 9.3 Memory Management

- **Cleanup**: Clear blob URLs after download
- **Limits**: Warn for files > 5MB
- **GC-friendly**: Remove event listeners when components unmount
- **History limit**: Cap undo/redo to 50 states

## 10. Testing Strategy

### 10.1 Unit Tests

Test coverage for:
- Parser functions (edge cases, malformed input)
- Serializer output validity
- Processing algorithms (zero removal, merging)
- Validation rules
- Math utilities (curve evaluation)

### 10.2 Integration Tests

- End-to-end workflows
- File upload → process → download
- Multi-step operations
- State management

### 10.3 Browser Testing

Test on:
- Chrome (latest, -1, -2 versions)
- Firefox (latest, -1)
- Safari (latest, -1)
- Edge (latest)

### 10.4 Manual Testing Checklist

- [ ] Upload various animation files
- [ ] Test with invalid formats
- [ ] Verify downloads are valid Unity files
- [ ] Test all UI interactions
- [ ] Verify theme switching
- [ ] Test drag and drop
- [ ] Test on mobile browsers
- [ ] Verify accessibility (screen readers, keyboard)
- [ ] Test with large files (> 1MB)
- [ ] Verify all error messages

## 11. Accessibility Requirements

### WCAG 2.1 Level AA Compliance

**Keyboard Navigation**:
- All features accessible via keyboard
- Tab order logical
- Focus visible
- Escape to close modals
- Arrow keys for navigation

**Screen Reader Support**:
- Semantic HTML (header, nav, main, section)
- ARIA labels for buttons
- ARIA live regions for status updates
- Alt text for icons
- Descriptive link text

**Visual**:
- Color contrast ratio ≥ 4.5:1 for text
- Focus indicators visible
- Text resizable to 200%
- No information by color alone
- Support for high contrast mode

**Forms**:
- Labels for all inputs
- Error messages associated with fields
- Required fields indicated
- Clear instructions

## 12. Security Considerations

### Input Validation

- **File size limits**: Max 10MB per file
- **File type check**: Verify .anim extension
- **Content sanitization**: Escape HTML in error messages
- **YAML injection**: Validate structure before parsing
- **XSS prevention**: No innerHTML with user content

### Data Privacy

- **Client-side only**: All processing in browser
- **No tracking**: No external analytics without consent
- **No storage**: Don't store user files on server
- **Local storage**: Clear sensitive data on unload
- **HTTPS**: Ensure GitHub Pages serves over HTTPS

### Dependencies

- **Minimal dependencies**: Reduce attack surface
- **CDN integrity**: Use SRI hashes if using CDN
- **Regular updates**: Keep any dependencies updated
- **License compliance**: Verify all code is MIT compatible

## 13. Deployment Strategy

### GitHub Pages Setup

1. **Repository settings**:
   - Enable GitHub Pages
   - Source: main branch, root folder
   - Custom domain (optional)

2. **Build process**:
   - No build step required (vanilla JS)
   - Direct commit to main branch
   - Automatic deployment by GitHub

3. **URL structure**:
   - `https://username.github.io/unity-animation-editor/`
   - Clean URLs, no hash routing needed

### Continuous Deployment

- Push to main → automatic deployment
- Use GitHub Actions for automated testing (optional)
- Staging branch for testing before production

### Versioning

- **Semantic versioning**: MAJOR.MINOR.PATCH
- **Changelog**: Track all changes
- **Tags**: Create git tags for releases
- **Releases**: Use GitHub Releases for downloads

## 14. Future Enhancements

### Phase 2 Features (Post-Launch)

1. **Animation Retargeting**
   - Remap animation from one rig to another
   - Path replacement tool
   - Batch retargeting

2. **Advanced Curve Editing**
   - Direct curve manipulation in visualizer
   - Tangent handle editing
   - Curve presets (ease-in, ease-out, etc.)

3. **Animation Library**
   - Save animations to browser storage
   - Tag and search animations
   - Export/import library

4. **Collaboration Features**
   - Generate shareable links (encoded in URL)
   - Export to GitHub Gist
   - Comment system

5. **Format Conversion**
   - Export to JSON
   - Export to CSV
   - Export to custom formats

6. **Animation Analysis**
   - Detect redundant keyframes
   - Suggest optimizations
   - Performance scoring

7. **Batch Processing**
   - Process multiple files at once
   - Scripting interface
   - Automation workflows

8. **Integration**
   - Unity package for direct import
   - CLI version
   - API for programmatic access

### Community Features

- **Plugin system**: Allow community extensions
- **Example gallery**: Showcase use cases
- **Tutorial system**: Interactive tutorials
- **Community animations**: Share and download

## 15. Success Metrics

### Primary Metrics

1. **User Adoption**
   - Monthly active users
   - Return user rate
   - Session duration

2. **Feature Usage**
   - Most-used features
   - Feature completion rate
   - Drop-off points

3. **Performance**
   - Page load time < 2s
   - Processing time < 5s for typical file
   - 60 FPS for visualizations

4. **Quality**
   - Error rate < 1%
   - Valid Unity output 100%
   - Browser compatibility 95%

### Secondary Metrics

- GitHub stars
- Community contributions
- Documentation views
- Support requests
- Browser/OS distribution

## 16. Documentation Requirements

### User Documentation

1. **Quick Start Guide**
   - 5-minute introduction
   - Basic workflow examples
   - Video tutorial

2. **Feature Guides**
   - One guide per major feature
   - Step-by-step instructions
   - Screenshots/GIFs
   - Common use cases

3. **FAQ**
   - Common questions
   - Troubleshooting
   - Known limitations

4. **Unity Format Reference**
   - Explain Unity animation structure
   - Field descriptions
   - Example files

### Developer Documentation

1. **Architecture Overview**
   - Module descriptions
   - Data flow diagrams
   - Design decisions

2. **API Reference**
   - Function signatures
   - Parameter descriptions
   - Return values
   - Examples

3. **Contributing Guide**
   - How to set up dev environment
   - Coding standards
   - Pull request process
   - Testing requirements

4. **Release Process**
   - Version numbering
   - Changelog format
   - Deployment steps

## 17. Risk Management

### Technical Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Browser compatibility issues | High | Medium | Thorough testing, polyfills |
| Performance with large files | High | High | Chunking, Web Workers, limits |
| Unity format changes | High | Low | Version detection, warnings |
| YAML parsing edge cases | Medium | Medium | Comprehensive test suite |

### Project Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Scope creep | Medium | High | Phased approach, MVP first |
| Complex Unity format | High | Medium | Start simple, iterate |
| User adoption | High | Medium | Marketing, SEO, examples |
| Maintenance burden | Medium | Medium | Clean code, documentation |

## 18. Launch Checklist

### Pre-Launch

- [ ] All Phase 1-3 features complete
- [ ] Browser testing passed
- [ ] Documentation complete
- [ ] Example files created
- [ ] README with screenshots
- [ ] License file added
- [ ] Security review completed
- [ ] Performance benchmarks met
- [ ] Accessibility audit passed
- [ ] Analytics integrated (opt-in)

### Launch

- [ ] Deploy to GitHub Pages
- [ ] Announce on relevant forums
- [ ] Submit to Unity community
- [ ] Create demo video
- [ ] Blog post/announcement
- [ ] Social media posts
- [ ] Unity subreddit post
- [ ] Game dev communities

### Post-Launch

- [ ] Monitor error reports
- [ ] Collect user feedback
- [ ] Track metrics
- [ ] Plan iteration
- [ ] Update documentation
- [ ] Respond to issues
- [ ] Plan next features

## 19. Maintenance Plan

### Regular Tasks

**Weekly**:
- Monitor GitHub issues
- Review analytics
- Check error logs
- Test on latest browsers

**Monthly**:
- Update dependencies (if any)
- Review documentation
- Check Unity format updates
- Performance review

**Quarterly**:
- Major feature planning
- User survey
- Accessibility audit
- Security review

### Long-term Support

- **Bug fixes**: Priority response < 1 week
- **Security updates**: Immediate
- **Feature requests**: Quarterly planning
- **Unity compatibility**: Test with new Unity versions

## 20. Budget & Resources

### Time Estimate

- **Development**: 6-7 weeks (one developer)
- **Testing**: 1 week
- **Documentation**: Ongoing
- **Launch prep**: 3 days
- **Total**: ~8 weeks

### Skills Required

- **JavaScript (ES6+)**: Advanced
- **HTML/CSS**: Intermediate
- **Canvas API**: Intermediate
- **YAML format**: Learn as needed
- **Unity basics**: Helpful but not required

### Cost

- **Hosting**: Free (GitHub Pages)
- **Domain**: $12/year (optional)
- **Tools**: Free (VS Code, Git, Chrome DevTools)
- **Total**: ~$0-12/year

## 21. Conclusion

This Unity Animation Editor will provide a valuable tool for Unity developers to quickly edit and manipulate animation files without opening Unity Editor. By focusing on common pain points (removing zeros, format conversion, visualization), the tool will save developers time and improve their workflow.

The phased approach ensures a solid foundation with the core features (text conversion and zero removal) before expanding to more advanced features. The vanilla JavaScript approach ensures the tool remains lightweight, fast, and easy to maintain.

Success will be measured by user adoption and feature usage, with continuous iteration based on community feedback. The open-source nature encourages community contributions and ensures long-term sustainability.

**Next Steps**: Begin Phase 1 implementation with project setup and basic architecture.
