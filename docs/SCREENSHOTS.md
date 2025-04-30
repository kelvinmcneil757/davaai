# Dava AI - Screenshots Documentation

## Overview
This document provides guidelines for capturing and maintaining screenshots of the Dava AI interface. Screenshots should be updated whenever significant UI changes are made.

## Required Screenshots

### 1. Home Page
- Full page view
- Hero section
- Features section
- About section
- CTA section

### 2. Analyze Page
- Empty state
- File upload interface
- Context input form
- Analysis results view
- Error states

### 3. Responsive Views
- Mobile view (320px)
- Tablet view (768px)
- Desktop view (1024px)

## Screenshot Guidelines

### Technical Requirements
- Resolution: 1920x1080 minimum
- Format: PNG
- Color space: sRGB
- File naming: `page-name_view-type.png`

### Capture Instructions
1. Use browser dev tools to set viewport size
2. Ensure all content is visible
3. Hide any sensitive information
4. Use consistent browser theme
5. Capture in incognito mode

### File Structure
```
docs/
└── screenshots/
    ├── home/
    │   ├── full-page.png
    │   ├── hero.png
    │   └── features.png
    ├── analyze/
    │   ├── empty-state.png
    │   ├── upload.png
    │   └── results.png
    └── responsive/
        ├── mobile.png
        ├── tablet.png
        └── desktop.png
```

## Updating Screenshots

### When to Update
- After UI/UX changes
- When adding new features
- After responsive design updates
- When fixing visual bugs

### Update Process
1. Capture new screenshots
2. Compare with existing ones
3. Update documentation if needed
4. Commit changes with descriptive message

## Best Practices
- Keep screenshots up to date
- Use consistent styling
- Include error states
- Document any special setup
- Optimize file sizes

## Tools
- Browser Dev Tools
- Screenshot tools (e.g., Lightshot)
- Image optimization tools
- Version control system 