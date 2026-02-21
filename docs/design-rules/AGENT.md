# Design System Rules for AI Agents

These rules guide AI agents when implementing UI in this React Native project. Follow them to maintain consistency, reusability, and theme responsiveness.

---

## 1. Use React Native Reusables Components Only

**Always prefer existing components from React Native Reusables** (and the project's `components/ui/` layer).

### Available Components

- **Button** — `@/components/ui/button`
- **Input** — `@/components/ui/input`
- **Text** — `@/components/ui/text`
- **Icon** — `@/components/ui/icon`

### Adding New Reusables

To add more components from React Native Reusables:

```bash
npx react-native-reusables/cli@latest add [component-name]
```

Example: `npx react-native-reusables/cli@latest add textarea card badge`

**Rule:** Before implementing any UI element, check if a Reusables component exists. Do not build from scratch what Reusables already provides.

---

## 2. Tell User When New Components Are Needed

When a design or feature requires a component that does not exist in Reusables or `components/ui/`:

1. **Explicitly inform the user** that a new component is needed.
2. **Describe what is needed** (e.g., "A Card component for displaying content blocks").
3. **Suggest options:**
   - Add from React Native Reusables if available
   - Propose a custom component (see Rule 3)

**Example message:**

> "This screen needs a Card component to display content blocks. React Native Reusables provides a Card component. Should I add it with `npx react-native-reusables/cli@latest add card`?"

---

## 3. Ask User Before Creating Custom Components

**Do not create custom components without user approval.**

If no suitable Reusables component exists:

1. **Stop and ask the user** before implementing a custom component.
2. **Explain:**
   - What the component will do
   - Why Reusables does not cover it
   - Where it will live (e.g., `components/ui/` or a feature-specific folder)
3. **Wait for confirmation** before writing the component.

**Example message:**

> "There is no Reusables component for a date range picker. I can create a custom `DateRangePicker` in `components/ui/`. Should I proceed?"

---

## 4. Always Use CSS Theme Variables for Theme Responsiveness

**All styling must use theme variables** defined in `global.css`. Do not hardcode colors, radii, or other theme-dependent values.

### Theme Variables (from `global.css`)

| Variable | Usage |
|----------|--------|
| `--background`, `--foreground` | Page/screen backgrounds and text |
| `--primary`, `--primary-foreground` | Primary actions, brand color |
| `--secondary`, `--secondary-foreground` | Secondary elements |
| `--muted`, `--muted-foreground` | Muted/disabled text and backgrounds |
| `--accent`, `--accent-foreground` | Hover, active, highlighted states |
| `--destructive`, `--destructive-foreground` | Errors, destructive actions |
| `--border`, `--input` | Borders and input backgrounds |
| `--ring` | Focus rings |
| `--radius` | Border radius |
| `--card`, `--popover` | Cards and popovers |

### Tailwind Usage

Use semantic Tailwind classes that map to these variables:

```tsx
// ✅ GOOD — uses theme variables
className="bg-background text-foreground border-border"
className="bg-primary text-primary-foreground"
className="text-muted-foreground"
className="rounded-[var(--radius)]"

// ❌ BAD — hardcoded values
className="bg-white text-black"
className="bg-[#e11d48]"
className="rounded-md"  // Prefer theme radius when available
```

### Dark Mode

Theme variables switch automatically via `.dark:root`. Use semantic tokens so dark mode works without extra logic:

```tsx
// ✅ GOOD — respects light/dark via variables
className="bg-background text-foreground"

// ❌ BAD — manual dark overrides when variables exist
className="bg-white dark:bg-gray-900"
```

---

## 5. Design for Reusability and Future Use

When implementing or proposing components:

1. **Think beyond the current screen** — Could this be used elsewhere?
2. **Use variants** — Prefer `cva` (class-variance-authority) for size, variant, and state.
3. **Compose, don’t duplicate** — Build from existing primitives (Button, Input, Text, etc.).
4. **Keep components generic** — Avoid screen-specific logic; pass behavior via props.
5. **Document usage** — Add JSDoc or comments for non-obvious props and variants.

### Reusability Checklist

- [ ] Can this be reused on another screen?
- [ ] Are variants (size, type, state) handled via props?
- [ ] Is it built from Reusables primitives?
- [ ] Does it use theme variables only?
- [ ] Is it placed in `components/ui/` (or an agreed shared location)?

---

## Quick Reference

| Situation | Action |
|-----------|--------|
| Need a standard UI element | Use Reusables or `components/ui/` |
| Reusables has it | Add via CLI or use existing |
| Reusables doesn’t have it | Ask user before creating custom |
| Styling | Use theme variables via Tailwind |
| New component | Ask first, design for reuse |

---

## File Locations

- **UI components:** `components/ui/`
- **Theme variables:** `global.css`
- **Tailwind config:** `tailwind.config.js` (if present)
