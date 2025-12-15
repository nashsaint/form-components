<!-- CDateRangePicker.vue -->
<template>
  <div class="form-group">
    <label class="block text-sm font-medium text-gray-700 mb-1">
      {{ label || defaultLabel }}
    </label>

    <DatePicker
      :model-value="range"
      @update:model-value="onRangeUpdate"
      range
      :min-date="safeMinDate"
      :max-date="safeMaxDate"
      :enable-time-picker="false"
      :placeholder="placeholder || 'Select date range'"
      :format="displayFormat"
      :clearable="true"
      class="w-full"
      input-class="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring focus:ring-opacity-50"
      :class="[ hasError ? 'border-red-500' : 'border-gray-300' ]"
      :aria-invalid="hasError ? 'true' : 'false'"
      :aria-describedby="hasError ? `${startField}-error ${endField}-error` : undefined"
    />

    <div v-if="showPresets" class="flex flex-wrap gap-2 mt-2">
      <button
        v-for="p in computedPresets"
        :key="p.label"
        type="button"
        class="text-xs px-2 py-1 rounded border bg-white hover:bg-gray-50"
        @click="applyPreset(p.getRange())"
      >
        {{ p.label }}
      </button>
    </div>

    <div class="mt-1 text-xs text-red-600 space-y-0.5" v-if="form?.errors?.[startField] || form?.errors?.[endField]">
      <p v-if="form?.errors?.[startField]" :id="`${startField}-error`">{{ form.errors[startField] }}</p>
      <p v-if="form?.errors?.[endField]" :id="`${endField}-error`">{{ form.errors[endField] }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import DatePicker from '@vuepic/vue-datepicker'
import { parse, isValid, format as fmtDate } from 'date-fns'
import '@vuepic/vue-datepicker/dist/main.css'

const props = defineProps({
  form: { type: Object, required: true },
  startField: { type: String, required: true },
  endField: { type: String, required: true },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  minDate: { type: [Date, String], default: null },
  maxDate: { type: [Date, String], default: null },
  displayFormat: { type: String, default: 'dd-MM-yyyy' },
  showPresets: { type: Boolean, default: true },
  presets: { type: Array, default: () => [] }
})

const toLabel = key => key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
const defaultLabel = computed(() => `${toLabel(props.startField)} – ${toLabel(props.endField)}`)

// Helpers
const safeToDate = v => {
  if (!v) return null
  if (v instanceof Date) return isValid(v) ? v : null
  if (typeof v === 'string') {
    const s = v.trim()
    if (!s) return null
    const d = parse(s, props.displayFormat, new Date())
    return isValid(d) ? d : null
  }
  return null
}
const fmt = d => {
  if (!(d instanceof Date) || !isValid(d)) return ''
  return fmtDate(d, props.displayFormat)
}

// Internal state for the picker
const range = ref(null)

// Safe min/max
const safeMinDate = computed(() => safeToDate(props.minDate))
const safeMaxDate = computed(() => safeToDate(props.maxDate))

watch(
  () => [props.form[props.startField], props.form[props.endField]],
  ([s, e]) => {
    const start = safeToDate(s)
    const end = safeToDate(e)

    const next = start || end ? [start, end] : null
    if (
      (Array.isArray(range.value) ? range.value[0]?.getTime() : null) !== (start?.getTime() || null) ||
      (Array.isArray(range.value) ? range.value[1]?.getTime() : null) !== (end?.getTime() || null) ||
      (!range.value && !next)
    ) {
      range.value = next
    }
  },
  { immediate: true }
)


// Internal -> external
const onRangeUpdate = val => {
  if (!val) {
    range.value = null
    props.form[props.startField] = ''
    props.form[props.endField] = ''
    return
  }

  const start = Array.isArray(val) ? val[0] ?? null : null
  const end = Array.isArray(val) ? val[1] ?? null : null
  const s = safeToDate(start)
  const e = safeToDate(end)

  range.value = s || e ? [s, e] : null
  props.form[props.startField] = s ? fmt(s) : ''
  props.form[props.endField] = e ? fmt(e) : ''
  // props.form[props.startField] = s ? fmtValue ? fmtValue(s) : fmt(s) : ''
  // props.form[props.endField] = e ? fmtValue ? fmtValue(e) : fmt(e) : ''
}

// Errors
const hasError = computed(() => !!(props.form?.errors?.[props.startField] || props.form?.errors?.[props.endField]))

// Presets
const defaultPresets = computed(() => {
  const today = () => {
    const d = new Date()
    return [d, d]
  }
  const last7 = () => {
    const end = new Date()
    const start = new Date()
    start.setDate(end.getDate() - 6)
    return [start, end]
  }
  const thisMonth = () => {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    return [start, end]
  }
  return [
    { label: 'Today', getRange: today },
    { label: 'Last 7 days', getRange: last7 },
    { label: 'This month', getRange: thisMonth }
  ]
})
const computedPresets = computed(() => {
  const labels = new Set(props.presets.map(p => p.label))
  return [...props.presets, ...defaultPresets.value.filter(p => !labels.has(p.label))]
})

const applyPreset = ([start, end]) => {
  const clamp = d => {
    const x = safeToDate(d)
    if (!x) return null
    if (safeMinDate.value && x < safeMinDate.value) return safeMinDate.value
    if (safeMaxDate.value && x > safeMaxDate.value) return safeMaxDate.value
    return x
  }
  const s = clamp(start)
  const e = clamp(end)
  range.value = s || e ? [s, e] : null
  onRangeUpdate(range.value)
}
</script>
