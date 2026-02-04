# Privacy Policy Page

A professional, enterprise-grade Privacy Policy page built with SOLID principles, featuring a modern design system with glassmorphism effects and micro-animations.

## Architecture

```
PrivacyPolicy/
├── PrivacyPolicy.jsx          # Main page component
├── PrivacyPolicy.module.css   # Page-level styles
├── index.js                   # Barrel export
├── README.md                  # This file
├── constants/
│   └── index.js               # Centralized content & config
└── components/
    ├── index.js               # Component barrel export
    ├── HeroSection/           # Page hero with decorative elements
    ├── TableOfContents/       # Sticky sidebar navigation
    └── PolicySection/         # Reusable content sections
```

## SOLID Principles

| Principle | Implementation                                       |
| --------- | ---------------------------------------------------- |
| **SRP**   | Each component handles a single concern              |
| **OCP**   | Components extensible via props without modification |
| **LSP**   | Consistent PropTypes interfaces across components    |
| **ISP**   | Components receive only required props               |
| **DIP**   | Content abstracted to constants file                 |

## Features

- **Modern Design**: Glassmorphism, gradients, micro-animations
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation
- **Performance**: React.memo, IntersectionObserver, lazy loading
- **Responsive**: Mobile-first with collapsible ToC
- **Print-friendly**: Optimized print styles

## Usage

```jsx
import PrivacyPolicy from "./pages/PrivacyPolicy";

// In router
<Route path="/privacy-policy" element={<PrivacyPolicy />} />;
```

## Customization

Edit `constants/index.js` to update:

- Policy content sections
- Contact information
- Animation timings
- Theme colors
