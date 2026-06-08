---
name: Ethos & Essence
colors:
  surface: '#fbf9f9'
  surface-dim: '#dbdad9'
  surface-bright: '#fbf9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#efeded'
  surface-container-high: '#e9e8e7'
  surface-container-highest: '#e4e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#444748'
  inverse-surface: '#303031'
  inverse-on-surface: '#f2f0f0'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#5e5e5b'
  on-secondary: '#ffffff'
  secondary-container: '#e1dfdb'
  on-secondary-container: '#63635f'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#221a11'
  on-tertiary-container: '#8f8274'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474746'
  secondary-fixed: '#e4e2dd'
  secondary-fixed-dim: '#c8c6c2'
  on-secondary-fixed: '#1b1c19'
  on-secondary-fixed-variant: '#474744'
  tertiary-fixed: '#f1e0d0'
  tertiary-fixed-dim: '#d4c4b5'
  on-tertiary-fixed: '#221a11'
  on-tertiary-fixed-variant: '#50453a'
  background: '#fbf9f9'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e2'
  scientific-teal: '#2D4B4B'
  serum-pink: '#FDF0ED'
  glass-border: rgba(26, 26, 26, 0.08)
typography:
  display-lg:
    fontFamily: ebGaramond
    fontSize: 64px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: ebGaramond
    fontSize: 40px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: ebGaramond
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-md:
    fontFamily: ebGaramond
    fontSize: 28px
    fontWeight: '400'
    lineHeight: '1.3'
  body-lg:
    fontFamily: hankenGrotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: hankenGrotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: hankenGrotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.1em
  button:
    fontFamily: hankenGrotesk
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1440px
  gutter: 24px
  margin-desktop: 80px
  margin-mobile: 20px
  section-gap: 120px
---

## Brand & Style

This design system embodies a "Beauty in STEM" philosophy, merging the precision of scientific inquiry with the ethereal elegance of high-end editorial beauty. The target audience is the intellectually curious consumer who values transparency, efficacy, and sophisticated aesthetics.

The design style is **High-End Minimalism**. It prioritizes extreme clarity and generous whitespace to create a "breathable" interface that feels expensive and curated. By combining structured layouts with soft, organic transitions, the UI evokes a sense of calm authority. This is not just a store; it is a digital laboratory of refinement.

## Colors

The palette is built on a foundation of "Atmospheric Neutrals." 

- **Primary (#1A1A1A):** A soft black used for high-contrast typography and core structural elements.
- **Secondary (#F9F7F2):** A warm, parchment-inspired off-white used as the primary canvas to reduce eye strain and feel more premium than pure white.
- **Tertiary (#D4C4B5):** A muted taupe for subtle dividers, secondary backgrounds, and quiet accents.
- **Named Colors:** `scientific-teal` provides a deep, intellectual anchor for call-to-actions, while `serum-pink` offers a soft highlight for promotions or hover states.

Avoid heavy solid fills; favor layering transparent neutrals to create depth.

## Typography

The typographic strategy pairs a graceful, classical serif with a sharp, contemporary sans-serif to bridge the gap between beauty and technology.

- **Headlines:** Use **EB Garamond**. It should always feel airy. For display sizes, use slight negative letter-spacing to create a tighter, editorial look.
- **Body & Technical Info:** Use **Hanken Grotesk**. Its clean, geometric construction ensures legibility for ingredient lists and scientific claims.
- **Labels:** Use uppercase `label-caps` for section headers and micro-copy to provide a structured, "catalogued" feel.

## Layout & Spacing

The design system utilizes a **Fixed Grid** on desktop and a **Fluid Grid** on mobile.

- **Desktop:** A 12-column grid with a 1440px max-width. Use generous 80px side margins to force focus onto the center content.
- **Mobile:** A 4-column grid with 20px margins. 
- **Rhythm:** Spacing follows an 8px base unit. Section gaps are intentionally large (120px+) to distinguish different stories or product collections, reinforcing the minimalist aesthetic. 
- **Alignment:** Use asymmetrical layouts for editorial sections (e.g., text offset from images) to create a dynamic, premium feel.

## Elevation & Depth

This design system avoids traditional heavy shadows in favor of **Tonal Layers** and **Low-Contrast Outlines**.

- **Depth:** Surfaces are distinguished by subtle shifts in background color (e.g., moving from `secondary` to `serum-pink`).
- **Overlays:** Use backdrop blurs (12px - 20px) for navigation bars and modals to maintain a "glass-like" transparency that feels modern and light.
- **Dividers:** Use 1px borders in `glass-border` or `tertiary`. Never use pure black for lines; they should feel like faint architectural guides rather than heavy barriers.

## Shapes

The shape language is primarily **Soft (Level 1)**. 

While the layout is structured and rectangular (reflecting STEM precision), UI elements like buttons and input fields feature a very subtle 0.25rem radius. This "softened edge" prevents the design from feeling too clinical or aggressive, adding the "Beauty" element back into the STEM framework. Larger containers like product cards may remain sharp (0px) to maintain an editorial, grid-aligned look.

## Components

- **Buttons:** Primary buttons are solid `primary-color` with `button` typography in white. Secondary buttons are "Ghost" style with a 1px `primary-color` border. All buttons should have a subtle hover transition that shifts the background color or slightly expands the letter spacing.
- **Product Cards:** Minimalist frames with no borders or shadows. The focus is entirely on high-quality photography. Text is center-aligned below the image using `body-md` for the title and `label-caps` for the price.
- **Input Fields:** Underline-only or very subtle 1px outlines. Labels should float or sit above in `label-caps`. 
- **Chips/Badges:** Small, pill-shaped tags using `serum-pink` backgrounds and `label-caps` text. Used for "New," "Vegan," or "Scientific Result" markers.
- **Transitions:** Every interaction—from page loads to cart drawers—should use a `cubic-bezier(0.2, 0, 0, 1)` timing function for a "weighted," premium motion feel.