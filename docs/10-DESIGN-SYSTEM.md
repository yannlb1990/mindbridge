# MindBridge Design System

## Brand Identity

### Name
**MindBridge** - Connecting clinicians and clients on the path to mental wellness

### Tagline Options
- "Your bridge to better mental health"
- "Connecting care, empowering recovery"
- "Professional care, personal support"

---

## Color Palette

### Primary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Sage Green** (Primary) | `#7C9885` | rgb(124, 152, 133) | Main brand, buttons, headers |
| **Sage Light** | `#A8C5B0` | rgb(168, 197, 176) | Hover states, accents |
| **Sage Dark** | `#5A7360` | rgb(90, 115, 96) | Text on light, emphasis |

### Secondary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Warm Sand** | `#F5F0E8` | rgb(245, 240, 232) | Background, cards |
| **Cream** | `#FAF8F5` | rgb(250, 248, 245) | Page background |
| **Warm Beige** | `#E8E0D5` | rgb(232, 224, 213) | Borders, dividers |

### Accent Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Soft Coral** | `#E8A598` | rgb(232, 165, 152) | Alerts, important actions |
| **Calm Blue** | `#8BA4B4` | rgb(139, 164, 180) | Links, info states |
| **Gentle Gold** | `#D4B896` | rgb(212, 184, 150) | Highlights, achievements |

### Semantic Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Success** | `#7C9885` | Positive states, completions |
| **Warning** | `#D4A574` | Caution, attention needed |
| **Error** | `#C97B7B` | Errors, critical alerts |
| **Info** | `#8BA4B4` | Information, tips |

### Text Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Primary Text** | `#2D3436` | Main body text |
| **Secondary Text** | `#636E72` | Captions, labels |
| **Muted Text** | `#9CA3A8` | Placeholders, hints |
| **Light Text** | `#FFFFFF` | Text on dark backgrounds |

### Risk Level Colors

| Level | Hex | Usage |
|-------|-----|-------|
| **Low Risk** | `#7C9885` | Low risk indicators |
| **Moderate Risk** | `#D4A574` | Moderate risk |
| **High Risk** | `#C97B7B` | High risk |
| **Critical** | `#9B4D4D` | Critical/imminent risk |

---

## Typography

### Font Family
```css
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-display: 'Plus Jakarta Sans', 'Inter', sans-serif;
```

### Font Sizes
```css
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */
```

### Font Weights
```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

---

## Spacing

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
```

---

## Border Radius

```css
--radius-sm: 0.25rem;   /* 4px */
--radius-md: 0.5rem;    /* 8px */
--radius-lg: 0.75rem;   /* 12px */
--radius-xl: 1rem;      /* 16px */
--radius-2xl: 1.5rem;   /* 24px */
--radius-full: 9999px;  /* Pill shape */
```

---

## Shadows

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
```

---

## Component Styles

### Buttons

**Primary Button**
```css
.btn-primary {
  background: #7C9885;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: background 0.2s;
}
.btn-primary:hover {
  background: #5A7360;
}
```

**Secondary Button**
```css
.btn-secondary {
  background: transparent;
  color: #7C9885;
  border: 1px solid #7C9885;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
}
```

### Cards
```css
.card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}
```

### Input Fields
```css
.input {
  border: 1px solid #E8E0D5;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  transition: border-color 0.2s;
}
.input:focus {
  border-color: #7C9885;
  outline: none;
  box-shadow: 0 0 0 3px rgba(124, 152, 133, 0.1);
}
```

---

## Mood Colors (Client App)

| Mood | Emoji | Color | Hex |
|------|-------|-------|-----|
| Great | 😊 | Green | `#7C9885` |
| Good | 🙂 | Light Green | `#A8C5B0` |
| Neutral | 😐 | Beige | `#D4B896` |
| Low | 😕 | Light Coral | `#E8A598` |
| Struggling | 😢 | Coral | `#C97B7B` |

---

## Iconography

### Recommended Icon Set
- **Lucide Icons** (open source, consistent style)
- Stroke width: 1.5-2px
- Size: 20px (default), 16px (small), 24px (large)

### Key Icons
- Dashboard: `LayoutDashboard`
- Clients: `Users`
- Calendar: `Calendar`
- Notes: `FileText`
- Messages: `MessageCircle`
- Settings: `Settings`
- Safety: `Shield`
- Mood: `Smile` / `Frown`
- Journal: `BookOpen`
- Exercise: `Dumbbell` (activities)

---

## Accessibility

### Contrast Ratios
All text must meet WCAG 2.1 AA standards:
- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum

### Focus States
All interactive elements must have visible focus indicators:
```css
*:focus-visible {
  outline: 2px solid #7C9885;
  outline-offset: 2px;
}
```

### Motion
Respect user preferences:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Dark Mode (Optional - Phase 2)

| Element | Light | Dark |
|---------|-------|------|
| Background | `#FAF8F5` | `#1A1A1A` |
| Card | `#FFFFFF` | `#2D2D2D` |
| Primary Text | `#2D3436` | `#F5F0E8` |
| Border | `#E8E0D5` | `#404040` |
