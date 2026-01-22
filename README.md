# nashsaint-form-components

Vue 3 form components that share a common contract: each component reads/writes from a `form` object and shows validation messages from `form.errors`. All names are exported and can be registered globally via the plugin.

## Install & register
1. Install from git/path: `npm install nashsaint-form-components`.
2. Ensure host app dependencies exist: `vue@^3.4`, `@vuepic/vue-datepicker@^11`, `date-fns@^4`, `lucide-vue-next@^0.542`, `@tiptap/vue-3@^3.3`, `@tiptap/starter-kit@^3.3`.
3. Register globally or import ad-hoc:
   ```js
   import { createApp, reactive } from 'vue'
   import { FormComponentsPlugin, CInput } from 'nashsaint-form-components'

   const app = createApp(App)
   app.use(FormComponentsPlugin) // registers all components with their C* names
   // or: app.component('CInput', CInput)
   ```
4. The date pickers import `@vuepic/vue-datepicker/dist/main.css`. Styling uses utility classes—override as needed in your app.

## Form shape used in examples
```js
import { reactive } from 'vue'

const form = reactive({
  name: '',
  email: '',
  // other fields...
  errors: {} // { [field]: 'Message' }
})
```
Each component below mutates `form[field]` (or `form[startField]/form[endField]`) directly unless noted. Date values are strings formatted per each component’s `displayFormat`/`format` prop.

## Component usage & examples
One focused recipe per element in this package. Replace the sample fields with your own.

- **CAmount** — Currency-like number entry with comma formatting.
  ```vue
  <CAmount
    field="budget"
    label="Budget"
    :form="form"
    placeholder="0.00"
    required
  />
  ```

- **CCheckbox** — Simple boolean toggle.
  ```vue
  <CCheckbox
    field="subscribe"
    label="Subscribe to updates"
    :form="form"
    :input-class="['border-gray-300']"
  />
  ```

- **CConsent** — Checkbox with supporting description and default value.
  ```vue
  <CConsent
    field="terms"
    label="Terms and conditions"
    description="I agree to the terms of service."
    :default-value="false"
    :form="form"
    required
  />
  ```

- **CDatePicker** — Single date picker (uses `@vuepic/vue-datepicker`).
  ```vue
  <CDatePicker
    field="start_date"
    label="Start date"
    :form="form"
    :min-date="new Date()"
    format="yyyy-MM-dd"
    placeholder="Select date"
  />
  ```

- **CDateRangePicker** — Two fields with range picker, preset buttons optional.
  ```vue
  <CDateRangePicker
    :form="form"
    start-field="from_date"
    end-field="to_date"
    label="Date range"
    display-format="dd-MM-yyyy"
    :min-date="new Date()"
    :presets="[{ label: 'Next 7 days', getRange: () => {
      const start = new Date()
      const end = new Date()
      end.setDate(start.getDate() + 6)
      return [start, end]
    }}]"
  />
  ```

- **CDropdown** — Select with clear button; `modelValue` drives the chosen value while `form` supplies errors.
  ```vue
  <script setup>
  import { ref } from 'vue'
  const status = ref('')
  const statusOptions = [
    { id: 'draft', name: 'Draft' },
    { id: 'published', name: 'Published' }
  ]
  </script>

  <CDropdown
    v-model="status"
    field="status"
    label="Status"
    :options="statusOptions"
    :form="form"
    placeholder="Pick status"
  />
  ```

- **CFile** — Drag/drop or click to select files. Stores `File` objects on `form[field]`; accepts existing URLs via `form[field]` or `initial`.
  ```vue
  <CFile
    field="attachments"
    label="Upload files"
    :form="form"
    multiple
    :accept="['image/*', '.pdf']"
    :initial="[{ url: 'https://example.com/existing.pdf', name: 'Existing file' }]"
  />
  ```

- **CInput** — Text input with optional type/placeholder.
  ```vue
  <CInput
    field="email"
    label="Email"
    input-type="email"
    placeholder="you@example.com"
    :form="form"
    required
  />
  ```

- **CNumber** — Numeric entry that strips non-numeric characters and stores a Number.
  ```vue
  <CNumber
    field="quantity"
    label="Quantity"
    placeholder="0"
    :form="form"
  />
  ```

- **CTagInput** — Freeform tag chips using `v-model`.
  ```vue
  <script setup>
  import { ref } from 'vue'
  const tags = ref(['Vue', 'Components'])
  </script>

  <CTagInput
    v-model="tags"
    label="Tags"
    placeholder="Add tag"
    :max="8"
    error=""
  />
  ```

- **CTextarea** — Multiline textarea with counter.
  ```vue
  <CTextarea
    field="bio"
    label="Bio"
    :form="form"
    :maxlength="300"
    placeholder="Tell us about yourself"
  />
  ```

- **CTypeAhead** — Async/local typeahead that writes the selected value to `form[field]`.
  ```vue
  <script setup>
  const searchUsers = async (q) => {
    // return [{ id, name }] from API
    return [{ id: 1, name: 'Ada Lovelace' }].filter(u =>
      u.name.toLowerCase().includes(q.toLowerCase())
    )
  }
  </script>

  <CTypeAhead
    field="assignee_id"
    label="Assign to"
    :form="form"
    :options="searchUsers"
    value-key="id"
    text-key="name"
    placeholder="Search users"
    :min-chars="1"
  />
  ```

- **CWysiwyg** — TipTap-based rich text editor that stores HTML in `form[field]`.
  ```vue
  <CWysiwyg
    field="content"
    label="Content"
    :form="form"
    placeholder="Write something great..."
  />
  ```

- **CYesOrNo** — Two-button boolean selector writing true/false to `form[field]`.
  ```vue
  <CYesOrNo
    field="is_active"
    label="Active?"
    :form="form"
  />
  ```

## Repo layout
- `src/components/forms`: the raw `.vue` single-file components.
- `src/index.js`: named exports and the plugin installer.

## Notes
- The components are source-first (no build step); Vite will compile the `.vue` files when the package is installed from git/path. If a bundler tries to prebundle with esbuild, add the package to `optimizeDeps.exclude`.
- Feel free to add stories/tests here if you want a tighter contract before publishing to a registry.

## Rectangular option
All form components accept a `rectangular` boolean to remove border radii.

```vue
<template>
  <CInput field="company_name" label="Company name" :form="form" rectangular />
  <CDateRangePicker
    :form="form"
    start-field="start_date"
    end-field="end_date"
    rectangular
  />
  <CFile :form="form" field="attachments" label="Attachments" multiple rectangular />
</template>
```
