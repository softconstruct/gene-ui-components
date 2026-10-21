# gene-ui-components — `release/3.0.0`

`@geneui/components` — the Gene UI design system React library for SoftConstruct BI tools. This file describes the
**3.0.0** line (TypeScript rewrite, token-based styling). The `release/2.x` branches use a different, legacy codebase:
do not port patterns between them.

This file is for contributors to this repo and is **not shipped**: `npm publish` runs from `dist/`, and
`scripts/utils.js → copyStaticFilesToDist` copies only `package.json`, `README.md`, `CHANGELOG.md`, `LICENSE`. Never add
`CLAUDE.md` to that list or move it under `src/`.

## Rules

- **Never run a git command that writes** (`add`, `commit`, `push`, `checkout`, `stash`, `merge`, branch creation).
  Edit files; the developer drives git. Prefix read-only git with `GIT_OPTIONAL_LOCKS=0`.
- **Don't run `npm install`** on your own. Change `package.json` and let the developer install.
- **Don't run `npm run build` without `--pure`.** The default build runs `fix-code-style` over the whole repo and
  `semantic-release`, which rewrites `CHANGELOG.md` and the version. Use `npm run build -- --pure`.
- **Don't run `npm run lint-scripts` / `fix-code-style`** to check your work — they `--fix` the entire `src/`. Lint only
  the files you touched (see Commands).
- **Never edit `node_modules/`.** Upstream issues in `@geneui/tokens` / `@geneui/icons` live in sibling repos
  (`../gene-ui-tokens`, `../gene-ui-icons`) — say so instead of patching around them silently.
- Don't leave scratch files in the repo.

## Stack

- **React 16.8+** is the peer range — no `useId`, `useTransition`, `useSyncExternalStore` or other React 18 APIs. Use
  `nanoid` for ids.
- **TypeScript** (strict), **SCSS**, `classnames`
- **@geneui/tokens** — CSS custom properties `--guit-*` (themes via `light-dark()`)
- **@geneui/icons** — React icon components (`IconProps`)
- **@floating-ui/react** — all popovers/tooltips/dropdowns positioning
- **@tanstack/react-table**, **@tanstack/react-virtual** — `DataTable`, virtualised lists
- **@atlaskit/pragmatic-drag-and-drop** — drag and drop
- **highcharts** (peer) — `charts/`
- Build: `tsc` (declarations only) + **rollup** → `dist/`, one entry per component folder
- Docs: **Storybook 8** (`react-docgen-typescript` reads prop JSDoc)
- Tests: **Jest 29** + **Enzyme** (`enzyme-adapter-react-16`), jsdom

## Commands

```bash
npm start                       # runs jest first, then Storybook on :6006
npm run create-component        # interactive: scaffold component + story + test + scss, export in src/index.ts
npx jest src/components/atoms/Button          # run tests for one component
npx eslint --config ./.eslintrc.json <files>  # lint only what you changed (batch files in one call)
npx stylelint --config ./.stylelintrc.json <files.scss>
npx tsc --noEmit -p ./tsconfig.json           # type check
npm run build -- --pure         # build dist/ without lint/semantic-release
```

## Layout

```
src/
  components/
    atoms/ molecules/ organisms/ charts/   one folder per component (atomic design level)
    providers/GeneUIProvider               context: theme, tokens, breakpoint, deviceInfo, portal root
  _internal/components/   shared building blocks NOT exported publicly (ChartLegend, ChartTooltip, …)
  hooks/                  public hooks, each its own rollup entry (useClickOutside, useBreakpoint, …)
  helpers/ constants/ types/
  assets/styles/          mixins.scss, reset.scss, utils.scss
  index.ts                the public API — every exported component and its props interface
stories/                  mdx pages + storybook.globals (args, propCategory)
tests/                    jest setup and mocks
```

Path aliases: `@components/*`, `@internal/*`, `@hooks/*`, `@assets/*`, `@types`. Use them instead of deep relative
imports (except SCSS `@use` of `assets/styles/mixins`, which is relative).

## Component anatomy

`npm run create-component` is interactive (inquirer), so an agent can't drive it: either ask the developer to run it, or
create the files by hand mirroring the templates in `scripts/createComponent.js`. A component folder holds:

```
Button/
  Button.tsx          implementation + I<Name>Props interface
  Button.scss         styles (imported by Button.tsx)
  Button.stories.tsx  Storybook
  Button.test.tsx     Jest/Enzyme
  index.tsx           export { IButtonProps, default } from "./Button";
```

Canonical examples to copy: `atoms/Button` (simple, `forwardRef`), `atoms/Popover` (compound + floating-ui + portal),
`molecules/TextField` (form field, `constants.ts`), `organisms/DataTable` (complex organism).

### TypeScript / props

- Interface name `I<Component>Props`; export it next to the component and from `src/index.ts`.
- **Every prop has a JSDoc comment.** It is the Storybook docs and ends up in the published `.d.ts` — it is the only
  documentation consumers (and their AI tools) get. For unions write `Possible values: \`a | b\``; add `@default`
  when a default exists.
- String-literal unions, not enums. Defaults go in the destructuring, not `defaultProps`.
- A one-line JSDoc above the component itself describing when to use it.
- Follow the prop vocabulary from `CONTRIBUTING.md` (content / states / validation / actions / functionality /
  appearance): `size`, `appearance`, `disabled`, `readOnly`, `loading`, `onChange`, `onClose`, `className`…
  Check how sibling components name the same concept before inventing a new name.
- `className` is for placement relative to the parent only — never a styling escape hatch.
- Icons are passed as components: `Icon?: FC<IconProps>` from `@geneui/icons`, rendered with a size from the design.
- Pass through `aria-*` props where meaningful; jsx-a11y is enforced.
- Use `forwardRef` for components that render a focusable/measurable root element.
- `@typescript-eslint/no-explicit-any` is a warning — don't add new `any`.

### Compound components

Parent/child APIs (`Popover` → `PopoverBody`/`PopoverFooter`, `Tabs` → `Tab`, `Menu` → `MenuItem`…) are enforced by the
`enforce-children` ESLint rule. When you add a compound component, **register it in `.eslintrc.json`** under
`enforce-children/enforce-children.rules`.

### Overlays and portals

Floating UI (popovers, tooltips, modals, drawers, notifications) must portal into the provider node, not `document.body`:

```tsx
const { geneUIProviderRef } = useContext(GeneUIDesignSystemContext);
return geneUIProviderRef.current ? createPortal(content, geneUIProviderRef.current) : null;
```

Otherwise the theme (`color-scheme`) and tokens set on `.gene-ui-provider` don't apply. Position with
`@floating-ui/react`, not hand-written coordinates.

### Imports

Order is enforced by `simple-import-sort`: react → third-party → `@geneui/*` → `@components` → `@internal` → `@hooks` →
`@types` → `@assets` → relative → `.scss` → images. Section comments (`// Components`, `// Types`, `// Styles`) follow
existing files.

## Styling — design system rules

- **Tokens only.** No raw hex/rgb colors, no px/rem magic numbers for spacing, radius, typography, shadows, sizes.
  - Use semantic tokens first: `--guit-sem-color-{background,foreground,border}-*`, `--guit-sem-font-*`,
    `--guit-sem-dimension-*`, `--guit-sem-shadow-*`.
  - Reference tokens only where no semantic one exists: `--guit-ref-spacing-*`, `--guit-ref-border-width-*`,
    `--guit-ref-border-style-*`, `--guit-ref-radius-*`, `--guit-ref-motion-*`.
  - **Never use `--guit-ref-color-*` directly** — reference colors don't switch with the theme.
  - If the design needs a value with no token, stop and ask; the fix belongs in `gene-ui-tokens`.
  - Existing offenders (`Tabs.scss`, `Rate.scss` hex colors) are debt, not precedent.
- **Theming is automatic.** Semantic color tokens use `light-dark()` driven by `color-scheme` on the provider. Don't write
  `.dark` / `[data-theme]` selectors or JS theme branches for colors.
- **State colors come in token families**: `…-hover`, `…-pressed`, `…-disabled`, `…-focus`. Use the matching token for
  each state instead of opacity or filters.
- Wrap `:hover` in `@include mixins.media-hover { … }` (no sticky hover on touch). Focus ring comes from the global
  `*:focus-visible` in `utils.scss` — don't override it per component.
- **BEM, lowercase-camel block**: `.button`, element `.button__icon`, modifier `.button_size_large` /
  `.button_loading`. Use `$this: &;` for cross-modifier selectors. Build class lists with `classnames`.
- Prefer logical properties (`margin-inline-start`, `inset-inline-end`, `padding-block`) — the library supports RTL.
- `html { font-size: 10px }` is set by the provider, so `1rem = 10px` in any unavoidable literal.
- Responsive behavior reads `breakpoint` from `GeneUIDesignSystemContext` (`useBreakpoint`), breakpoints come from
  tokens — don't hardcode media query widths.

## Stories

- `title: "<Level>/<Name>"` (e.g. `"Atoms/Button"`), `component`, typed `Meta<I<Name>Props>`.
- Every prop gets an `argTypes` entry through `args({ control, ...propCategory.<category> })` from
  `stories/assets/storybook.globals`. Categories: `content`, `states`, `validation`, `action`, `functionality`,
  `appearance`, `others`.
- `export const Default: Story = {}` plus one story per meaningful variant. Use realistic data from `stories/data` /
  `@faker-js/faker`.

## Tests

- `Component.test.tsx` next to the component; Enzyme `mount`, with `{ wrappingComponent: GeneUIProvider }` for anything
  that uses context or portals.
- First case is always `renders without crashing`; then props (positive/negative), then state. Names follow
  `renders <prop> prop correctly` / `should have <value> <prop>`. Use `it.each` for union values.
- Assert on BEM classes and rendered output, not implementation details.

## Public API

- A new component is public only once exported from `src/index.ts` (component **and** its props interface).
  `create-component` adds only `export { default as <Name> }` — add `I<Name>Props` to that line yourself.
- `_internal/` is never exported. Moving something out of it is an API decision — ask.
- Removing/renaming a prop, prop value or export is a breaking change: call it out explicitly.

## Git flow (for messages you draft)

- Branch from `release/3.0.0`: `feature/<kebab-name>` or `fix/<kebab-name>`; PRs target `release/3.0.0`.
- Conventional commits, scope = PascalCase component: `feat(DataTable): add row statuses`,
  `fix(Scrollbar): track-hiding timer start upon unmounting`. Breaking changes go in a `BREAKING CHANGE:` footer.
- PR title uses the same format.
