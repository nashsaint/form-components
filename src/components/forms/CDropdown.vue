<template>
  <div class="form-group">
    <label :for="field" class="block text-[10px] text-gray-700 mb-1">
      {{ label || fieldLabel }}
      <span v-if="required" class="text-red-600 text-[8px]">(required)</span>
    </label>

    <div class="relative">
      <select
        :id="field"
        :required="required"
        :disabled="disabled"
        v-model="model"
        class="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring focus:ring-opacity-50 text-xs text-gray-700 pr-8 appearance-none"
        :class="error ? 'border-red-500' : 'border-gray-300'"
        :aria-invalid="!!error"
        :aria-describedby="error ? `${field}-error` : undefined"
      >
        <option value="" disabled hidden>{{ placeholder }}</option>

        <option
          v-for="option in options"
          :key="option[valueKey]"
          :value="option[valueKey]"
          class="text-sm text-gray-700"
        >
          {{ option[textKey] ?? option.label ?? option.name }}
        </option>
      </select>

      <!-- Chevron (only if no value is selected) -->
      <span
        v-if="!model"
        class="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-400"
      >
        <ChevronDownIcon class="h-4 w-4" />
      </span>

      <!-- Clear button (only if a value is selected) -->
      <button
        v-if="model"
        type="button"
        class="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-600"
        @click="clearSelection"
      >
        <XIcon class="h-4 w-4" />
      </button>
    </div>

    <div v-if="error" :id="`${field}-error`" class="mt-1 text-xs text-red-600">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ChevronDownIcon, XIcon } from 'lucide-vue-next'
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number, null], default: '' },
  field: { type: String, required: true },
  label: { type: String, default: '' },
  options: { type: Array, required: true },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  placeholder: { type: String, default: 'Please select' },
  valueKey: { type: String, default: 'id' },
  textKey: { type: String, default: 'name' },
  number: { type: Boolean, default: false },
  form: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue'])

const model = computed({
  get: () => props.modelValue,
  set: v => {
    const out = props.number && v !== '' ? Number(v) : v
    emit('update:modelValue', out)
  }
})

const error = computed(() => props.form?.errors?.[props.field])

const fieldLabel = props.field
  .replace(/_/g, ' ')
  .replace(/\b\w/g, l => l.toUpperCase())

const clearSelection = () => {
  emit('update:modelValue', '')
}
</script>

<style scoped>
select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: none;
}

/* Match VuePic DatePicker input height exactly */
select {
  padding-block: 10px; /* top & bottom padding */
  padding-left:14px; /* same left padding as dp__input */
  font-size: 1rem;
  line-height: 1.5rem;

  border-radius: 0.75rem; /* rounded-xl */
  height: 46px; /* visually identical to DatePicker’s border height */
  box-sizing: border-box;
}

/* Maintain consistent label spacing */
label {
  margin-bottom: 0.25rem; /* same as mb-1 */
}
</style>
