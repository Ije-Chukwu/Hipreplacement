# Hip Replacement – Patient Information Guide

An accessible static website providing clear information about hip replacement surgery, procedure types, recovery timelines, FAQs, and a consultation booking form.

## Accessibility Features

This project is built to conform to **WCAG 2.1 Level AA**. The key accessibility features include:

### Semantic HTML
- Landmark regions (`<header role="banner">`, `<main>`, `<footer role="contentinfo">`, `<nav>`, `<section>`) help screen-reader users navigate by landmark.
- Correct heading hierarchy (`h1` → `h2` → `h3`) on every page.
- Lists marked up with `<ul>`/`<ol>` and `role="list"` where CSS resets `list-style`.
- Descriptive `<title>` and `<meta name="description">` on every page.

### Skip Navigation
- A visually hidden "Skip to main content" link is the first focusable element on the page, allowing keyboard and screen-reader users to bypass the navigation.

### Keyboard Navigation
- All interactive components (navigation, tabs, accordion, form controls) are fully operable by keyboard alone.
- **Tab widget** follows the [ARIA Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/): Arrow keys move between tabs; Home/End jump to first/last tab.
- **Accordion widget** follows the [ARIA Disclosure Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/): Arrow keys navigate between items; Escape closes items.
- **Mobile nav** can be opened/closed with Enter/Space and dismissed with Escape.
- All touch targets meet the minimum **44 × 44 px** size recommendation.

### ARIA
- `aria-expanded` on the mobile menu toggle and accordion triggers.
- `role="tablist"`, `role="tab"`, `role="tabpanel"` with `aria-selected` and `aria-controls` / `aria-labelledby` pairing.
- `aria-live="polite"` region on the form status area for non-intrusive announcements.
- `aria-live="assertive"` on inline field error spans for immediate error feedback.
- `aria-required="true"` and `aria-invalid="true"` on form fields.
- `aria-describedby` links inputs to their hint and error text.
- `aria-label` on icon-only buttons and SVG illustrations.
- `aria-hidden="true"` on decorative SVGs and step numbers.
- `aria-busy="true"` set on the form during async submission.

### Colour & Contrast
- All foreground/background colour pairs meet the **4.5:1** contrast ratio for normal text (WCAG AA).
- Large text and UI components meet the **3:1** ratio requirement.
- Colour is never the sole means of conveying information (errors also shown via text).

### Focus Styles
- A high-visibility **amber (#f59e0b) 3 px outline** is applied to every focused element via `:focus-visible`, ensuring keyboard users always see a clear focus indicator.
- Focus styles are suppressed for pointer/touch interactions via `:focus:not(:focus-visible)` to avoid visual clutter.

### Reduced Motion
- A `@media (prefers-reduced-motion: reduce)` block disables smooth scrolling and CSS animations/transitions for users who have requested reduced motion in their OS settings.

### High Contrast Mode
- A `@media (forced-colors: active)` block ensures interactive components render correctly in Windows High Contrast Mode.

### Responsive Design
- The layout is fully responsive and adapts to all viewport sizes.
- No information is lost or hidden on small screens; the navigation becomes a mobile menu with a toggle button.

### Forms
- All inputs have a visible `<label>` element associated via `for`/`id`.
- Required fields are marked with both a visual `*` indicator and `aria-required="true"`.
- Inline hint text is linked to inputs with `aria-describedby`.
- Validation errors appear inline next to the relevant field and are announced to screen readers via `aria-live` regions.
- The privacy consent checkbox uses a `<label>` with a visible text description.

### Structured Data & Print
- A basic print stylesheet hides decorative/interactive elements and presents clean readable text for printing.

## Project Structure

```
.
├── index.html   # Main page – semantic HTML with ARIA markup
├── styles.css   # Accessible CSS (WCAG AA colour contrast, focus styles, responsive layout)
├── script.js    # Keyboard-accessible tabs, accordion, mobile nav, and form validation
├── LICENSE      # MIT Licence
└── README.md    # This file
```

## Running Locally

No build step is required. Open `index.html` directly in a browser, or serve it with any static file server:

```bash
# Using Python (built-in)
python3 -m http.server 8080

# Using Node.js (npx)
npx serve .
```

Then visit `http://localhost:8080`.

## Licence

[MIT](LICENSE) © 2026 Ijeoma Nwachukwu
