# Figma to React – Web Project Instructions

Analyze the attached design (Figma frame or screenshot at folder figma at root) and convert it into React components following the rules and standards defined below.

This project **must be created inside the `web` folder** and **must use Next.js**.

---

## Project Setup

- Framework: **Next.js (App Router)**
- Language: **TypeScript (strict mode enabled)**
- React version: **React 19** (do not use `forwardRef`)
- Package manager: yarn
- The project **must run on port 3001**

### Development Server

- Configure the project so that `yarn dev` (or equivalent) runs on **http://localhost:3001**
- Do not rely on external proxies
- Use an explicit `PORT=3001` configuration (package.json or Next.js config)

---

## Styling & UI Stack

- **Tailwind CSS v4**
  - Use `@theme`
  - Use CSS variables for colors, spacing, and typography
- **Base UI React** (`@base-ui/react`)
  - Use only for headless components (dialogs, menus, popovers, etc.)
- **Tailwind Variants** (`tailwind-variants`)
  - Use for component variants
- **Tailwind Merge** (`tailwind-merge`)
  - Use to safely merge Tailwind classes
- Icons:
  - **Lucide React** or **Phosphor Icons**

---

## Component Architecture

- Convert the Figma design into **small, reusable, composable components**
- Prefer **server components** by default
- Use **client components only when required**
- No inline styles
- No CSS modules
- Styling must be done only with Tailwind CSS

---

## Naming Conventions

### Files

- Use **lowercase with hyphens**
  - Example: `user-card.tsx`
  - Example: `use-modal.ts`
- No PascalCase filenames

### Exports

- **Always use named exports**
- **Never use default exports**

### Folder Rules

- Do **not** create barrel files (`index.ts`) inside internal folders
- Import files directly

---

## Code Quality Rules

- TypeScript must be fully typed
- No `any`
- No unused variables
- No ESLint disable comments unless strictly necessary
- Components should be readable and well-structured

---

## Layout & Pages

- Implement layouts and pages strictly based on the Figma design
- Spacing, typography hierarchy, and alignment must closely match the design
- Use semantic HTML whenever possible

---

## State & Logic

- Keep UI components as presentational as possible
- Extract logic into hooks when needed
- Avoid unnecessary abstractions

---

## Output Expectations

- Fully working Next.js project inside `/web`
- Project starts successfully on **port 3001**
- Clean, consistent, and production-ready code
- Components accurately reflect the provided design

---

Follow these instructions strictly. Do not introduce additional tools, libraries, or patterns unless explicitly requested.
