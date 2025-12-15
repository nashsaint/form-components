# cfcuk-form-components

Extracted Vue 3 form components ready to reuse across projects. Components expect a `form` object with field values and an `errors` bag (compatible with Inertia's `useForm` shape but works with any reactive object).

## Components
CAmount, CCheckbox, CConsent, CDatePicker, CDateRangePicker, CDropdown, CFile, CInput, CNumber, CTagInput, CTextarea, CTypeAhead, CWysiwyg, CYesOrNo

## Using in another project
1. Add this repo as a dependency (after you push it somewhere): `npm install git+ssh://<your-repo-url>.git` or locally during development: `npm install ../cfcuknational/form-components`.
2. Ensure peer/dependencies are installed in the host app: `vue@^3.4`, `@vuepic/vue-datepicker@^11`, `date-fns@^4`, `lucide-vue-next@^0.542`, `@tiptap/vue-3@^3.3`, `@tiptap/starter-kit@^3.3`.
3. Register globally or import ad-hoc:
   ```js
   import { createApp } from 'vue'
   import { FormComponentsPlugin, CInput } from 'cfcuk-form-components'

   const app = createApp(App)
   app.use(FormComponentsPlugin) // registers all components with their C* names
   // or: app.component('CInput', CInput)
   ```
4. The date pickers already import `@vuepic/vue-datepicker/dist/main.css`. Tailwind/utility classes are used for styling; adjust or override in your project as needed.

## Repo layout
- `src/components/forms`: the raw `.vue` single-file components (copied from `resources/js/Components/Forms`).
- `src/index.js`: named exports plus a small plugin installer.

## Notes
- The components are source-first (no build step); Vite will compile the `.vue` files when the package is installed from git/path. If a bundler tries to prebundle with esbuild, add the package to `optimizeDeps.exclude`.
- Feel free to add stories/tests here if you want a tighter contract before publishing to a registry.
