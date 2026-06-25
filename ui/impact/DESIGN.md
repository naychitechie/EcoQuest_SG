---
name: EcoPrecision
colors:
  surface: '#fbf9f2'
  surface-dim: '#dcdad3'
  surface-bright: '#fbf9f2'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f4ec'
  surface-container: '#f0eee7'
  surface-container-high: '#eae8e1'
  surface-container-highest: '#e4e2dc'
  on-surface: '#1b1c18'
  on-surface-variant: '#42493b'
  inverse-surface: '#30312c'
  inverse-on-surface: '#f3f1ea'
  outline: '#727969'
  outline-variant: '#c2c9b7'
  surface-tint: '#386a0e'
  primary: '#275300'
  on-primary: '#ffffff'
  primary-container: '#3b6d11'
  on-primary-container: '#b2ed83'
  inverse-primary: '#9dd770'
  secondary: '#0061a2'
  on-secondary: '#ffffff'
  secondary-container: '#68b3fe'
  on-secondary-container: '#004473'
  tertiary: '#862a00'
  on-tertiary: '#ffffff'
  tertiary-container: '#ae3900'
  on-tertiary-container: '#ffd3c5'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b8f389'
  primary-fixed-dim: '#9dd770'
  on-primary-fixed: '#0c2000'
  on-primary-fixed-variant: '#265100'
  secondary-fixed: '#d1e4ff'
  secondary-fixed-dim: '#9dcaff'
  on-secondary-fixed: '#001d35'
  on-secondary-fixed-variant: '#00497c'
  tertiary-fixed: '#ffdbcf'
  tertiary-fixed-dim: '#ffb59b'
  on-tertiary-fixed: '#380d00'
  on-tertiary-fixed-variant: '#812800'
  background: '#fbf9f2'
  on-background: '#1b1c18'
  surface-variant: '#e4e2dc'
  mrt-teal: '#1D9E75'
  grab-rust: '#993C1D'
  success-mint-bg: '#E1F5EE'
  success-mint-text: '#085041'
  info-blue-bg: '#E6F1FB'
  info-blue-text: '#0C447C'
  warning-amber-bg: '#FAEEDA'
  warning-amber-text: '#633806'
  accent-indigo-bg: '#EEEDFE'
  accent-indigo-text: '#3C3489'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.7'
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.08em
  data-value:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: '1'
  code-snippet:
    fontFamily: Courier Prime
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gap-xs: 4px
  gap-sm: 10px
  gap-md: 12px
  gap-lg: 14px
  container-padding-x: 20px
  container-padding-y: 16px
  section-divider: 24px
---

## Brand & Style

The design system is engineered for the modern commuter who values sustainability as much as efficiency. It adopts a **Corporate/Modern** aesthetic with a **"Dashboard-lite"** philosophy, emphasizing high-density information through a lens of precision and transparency.

The visual language is rooted in the "engineered" look of Singapore's urban infrastructure—clean, reliable, and meticulously organized. By utilizing hairline borders, subtle tonal shifts, and a palette inspired by both nature and transit networks, the system fosters a sense of calm authority. The goal is to make complex carbon data feel approachable and actionable, encouraging users toward greener choices through clarity rather than friction.

## Colors

This design system utilizes a palette that bridges the gap between environmental sustainability and urban transit.

- **Primary (Eco Green):** Used for navigation, primary CTAs, and positive environmental impact indicators.
- **Secondary (Transit Blue):** Associated with reliability and the public bus network; used for secondary actions and technical info.
- **Tertiary (Solar Orange):** Reserved for high-energy items like car-based travel alerts or urgent carbon warnings.
- **Neutral:** A warm, "Stone" grey used for surfaces and backgrounds to reduce eye strain compared to pure white.

Specific Singapore-specific transit colors (MRT Teal, Bus Blue) and Carbon Visualization shades (Walk/Cycle Green to Grab Rust) are integrated to provide instant mental mapping for the local user base.

## Typography

The typography strategy leverages **Plus Jakarta Sans** for display and headings to introduce a friendly, approachable character, while **Inter** handles the heavy lifting of data-dense layouts.

The system relies on high-density settings, with body text and data labels set at 13px to maximize information visibility on mobile screens. We use `Medium (500)` or `SemiBold (600)` weights to establish hierarchy within technical lists and tables. For technical paths or API-related metadata, a monospaced font ensures character-level clarity.

## Layout & Spacing

This design system uses a **Fluid Grid** model optimized for high-information density. The layout rhythm is tight, utilizing a baseline 4px/2px modular scale to align data points precisely.

- **Mobile:** Single column with 16px side margins. Cards span the full width to maximize data real estate.
- **Tablet/Desktop:** A 12-column grid with 20px gutters. Content is often organized into "Phase Rows" or "Data Stacks" that reflow from vertical stacks on mobile to horizontal side-by-side comparisons on larger screens.
- **Density:** We prioritize visibility over whitespace. Elements are grouped in tight clusters (10px–12px gaps) to allow users to compare multiple transit routes at a glance.

## Elevation & Depth

Depth in this system is achieved through **Tonal Layering** rather than traditional shadows. This maintains a clean, technical "blueprint" feel.

- **Primary Surface:** Uses the neutral background color.
- **Secondary Surface:** Uses a slightly lighter or darker tint (e.g., `#FFFFFF` for cards on a `#F1EFE8` background) to signify containment.
- **Borders:** A consistent `0.5px` (hairline) solid border is the primary tool for separation. Use `--color-border-tertiary` for all card outlines and dividers.
- **Interactive Depth:** On hover or active states, elements should shift background color slightly rather than rising in elevation. This keeps the data-driven UI feeling grounded and precise.

## Shapes

The shape language is **Soft** and restrained. We use a 0.25rem (4px) base radius for technical elements like code blocks and data bars to maintain a sense of precision. 

Large containers like cards use an 8px radius (`rounded-lg`) to provide a modern, friendly feel without becoming overly "bubbly." Functional elements like status badges and sequence indicators use a circular/pill shape (999px) to differentiate them from the structural grid of the data tables.

## Components

- **Buttons:** Use the primary Eco Green for main actions. Shapes are softly rounded (4px). Labels use `label-caps` for a professional, "tool-like" appearance.
- **Carbon Bars (Data Viz):** Proportional-width inline bars. These are the core of the app. They use the specific data viz colors (e.g., MRT Teal) with a 4px border radius. No shadows; just flat color fills.
- **Status Chips:** Use the Phase Indicator color pairs (e.g., Success Mint BG with Success Mint Text). Text is 11px Medium.
- **Cards:** White background with a 0.5px border. Padding is strictly `16px 20px`.
- **Input Fields:** High-contrast text against a subtle gray background with a 0.5px border that thickens to 1px on focus using Transit Blue.
- **Transit Lists:** Use horizontal stacks with dividers. Left-aligned icons/mode indicators, center-aligned route details, and right-aligned carbon/cost data.
- **MRT/Bus Badges:** Mode-specific colors as backgrounds with white text, using pill shapes for MRT lines and soft-rectangles for Bus services.