# REMON Font Files

Place your REMON font files here:

## Required Files
- `Remon-Regular.woff2` (Primary)
- `Remon-Regular.woff` (Fallback)
- `Remon-Bold.woff2` (Primary)
- `Remon-Bold.woff` (Fallback)

## Font Configuration
The fonts are configured in `src/styles/globals.css` with the following @font-face declarations:

```css
@font-face {
  font-family: 'Remon';
  src: url('/fonts/Remon-Regular.woff2') format('woff2'),
       url('/fonts/Remon-Regular.woff') format('woff');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

## Usage
Use the `font-remon` class for headings:
```html
<h1 class="font-remon">Heading Text</h1>
```

Or with Tailwind:
```tsx
<h1 className="font-remon text-4xl font-bold">Heading</h1>
```
