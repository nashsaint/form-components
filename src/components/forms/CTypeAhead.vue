<template>
  <div class="form-group">
    <label :for="field" class="block text-[10px] text-gray-700 mb-1">
      {{ label || fieldLabel }}
    </label>

    <div class="relative">
      <div
        class="flex items-center gap-2 border bg-white border"
        :class="[
          rectangular ? 'rounded-none' : 'rounded-xl',
          hasError ? 'border-red-500' : 'border-[#aeaeae]'
        ]"
        role="combobox"
        :aria-expanded="open ? 'true' : 'false'"
        :aria-owns="listboxId"
        :aria-controls="listboxId"
        :aria-haspopup="'listbox'"
      >
        <input
          :id="field"
          ref="inputEl"
          v-model="query"
          :placeholder="placeholder"
          :disabled="disabled"
          class="w-full outline-none !border-0 px-3 py-[12px] !text-xs text-gray-900 placeholder:text-[10px] placeholder-gray-400 placeholder:uppercase"
          @focus="open = true"
          @keydown.down.prevent="move(1)"
          @keydown.up.prevent="move(-1)"
          @keydown.enter.prevent="confirmActive()"
          @keydown.esc.prevent="close()"
        />

        <!-- Clear -->
        <button
          v-if="clearable && selected"
          type="button"
          class="text-gray-400 hover:text-gray-600 pr-2"
          @click="clearSelection"
          aria-label="Clear selection"
        >✕</button>
      </div>

      <!-- Panel -->
      <div
        v-show="open"
        class="absolute z-10 mt-1 w-full border border-gray-400 bg-white shadow-lg"
        :class="rectangular ? 'rounded-none' : 'rounded-xl'"
        @mousedown.prevent
      >
        <div v-if="loading" class="p-3 text-sm text-gray-500">Searching…</div>

        <ul
          v-else
          :id="listboxId"
          role="listbox"
          class="max-h-60 overflow-auto py-1 list-none ml-0 pl-0"
        >
          <li
            v-for="(opt, idx) in visibleOptions"
            :key="optKey(opt, idx)"
            role="option"
            :aria-selected="idx === activeIndex ? 'true' : 'false'"
            @mouseenter="activeIndex = idx"
            @mousedown.prevent="select(opt)"
            class="px-3 py-2 cursor-pointer text-xs"
            :class="idx === activeIndex ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'"
          >
            {{ optText(opt) }}
          </li>

          <li v-if="!visibleOptions.length" class="px-3 py-2 text-sm text-gray-500 text-xs">
            {{ emptyText }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Error -->
    <div v-if="hasError" class="mt-1 text-xs text-red-600">
      {{ form.errors[field] }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  form: { type: Object, required: true },
  field: { type: String, required: true },
  label: { type: String, default: '' },
  options: { type: [Array, Function], required: true },
  valueKey: { type: String, default: 'id' },
  textKey: { type: String, default: 'name' },
  placeholder: { type: String, default: 'Start typing…' },
  minChars: { type: Number, default: 0 },
  maxItems: { type: Number, default: 50 },
  debounceMs: { type: Number, default: 200 },
  disabled: { type: Boolean, default: false },
  clearable: { type: Boolean, default: true },
  emptyText: { type: String, default: 'No results' },
  rectangular: { type: Boolean, default: false }
})

const inputEl = ref(null)
const open = ref(false)
const query = ref('')
const activeIndex = ref(-1)
const loading = ref(false)
const listboxId = `listbox-${Math.random().toString(36).slice(2, 8)}`

const fieldLabel = props.field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
const hasError = computed(() => !!props.form?.errors?.[props.field])

// move this up so it exists before it's read anywhere
const localOptions = ref(Array.isArray(props.options) ? props.options : [])

// helpers
const valueOf = opt => (opt && typeof opt === 'object') ? opt[props.valueKey] : opt
const optText = opt => (opt && typeof opt === 'object') ? (opt[props.textKey] ?? '') : String(opt ?? '')
const optKey = (opt, i) => `${valueOf(opt)}-${i}`

const selectedValue = computed(() => props.form[props.field] ?? null)

// now it's safe to compute `selected`
const selected = computed(() => {
  if (!selectedValue.value) return null
  const arr = Array.isArray(localOptions.value) ? localOptions.value : []
  const match = arr.find(o => valueOf(o) === selectedValue.value)
  return match || null
})

const queryTouchedByUser = ref(false)

watch(selected, s => {
  if (s && !queryTouchedByUser.value) {
    query.value = optText(s)
  }
})

let t = null
watch(query, q => {
  queryTouchedByUser.value = true
  if (t) clearTimeout(t)
  t = setTimeout(async () => {
    await performSearch(q)
  }, props.debounceMs)
})

const performSearch = async q => {
  if (typeof props.options === 'function') {
    if (q.length < props.minChars) { localOptions.value = []; return }
    loading.value = true
    try {
      const res = await props.options(q)
      localOptions.value = Array.isArray(res) ? res : []
    } finally {
      loading.value = false
    }
  } else {
    const base = props.options || []
    if (!q || q.length < props.minChars) {
      localOptions.value = base
    } else {
      const lower = q.toLowerCase()
      localOptions.value = base.filter(o => optText(o).toLowerCase().includes(lower))
    }
  }
  activeIndex.value = localOptions.value.length ? 0 : -1
}

const visibleOptions = computed(() => (localOptions.value || []).slice(0, props.maxItems))

// selection
const select = (opt) => {
  const val = valueOf(opt)
  props.form[props.field] = val
  query.value = optText(opt)
  open.value = false
}

const clearSelection = () => {
  props.form[props.field] = null
  query.value = ''
  activeIndex.value = -1
  inputEl.value?.focus()
}

// keyboard nav
const move = (delta) => {
  if (!open.value) open.value = true
  const len = visibleOptions.value.length
  if (!len) return
  activeIndex.value = (activeIndex.value + delta + len) % len
}

const confirmActive = () => {
  if (activeIndex.value < 0) return
  const opt = visibleOptions.value[activeIndex.value]
  if (opt) select(opt)
}

const close = () => { open.value = false }

// Click outside to close
const onDocClick = (e) => {
  if (!e.composedPath().includes(inputEl.value?.parentNode)) {
    open.value = false
  }
}
onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))

// initial populate (show label for existing value)
onMounted(() => {
  performSearch('')
  if (selected.value) query.value = optText(selected.value)
})
</script>
