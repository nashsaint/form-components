<template>
  <div class="form-group w-fit">
    <label :for="id ?? field" class="flex text-xs items-center space-x-3 cursor-pointer select-none">
      <input
        type="checkbox"
        :id="id ?? field"
        :checked="form?.[field]"
        @change="e => form[field] = e.target.checked"
        :disabled="disabled"
        :required="required"
        :class="[
          'h-5 w-5 rounded-full border-2 border-gray-300 bg-white text-indigo-600',
          'transition duration-150 ease-out',
          'focus:outline-none focus:ring-0 focus:ring-offset-0',
          'checked:bg-indigo-600 checked:border-indigo-600 checked:shadow-[0_0_0_3px_rgba(79,70,229,0.15)]',
          'hover:border-indigo-400',
          inputClass,
        ]"
        :aria-invalid="!!form?.errors?.[field]"
        :aria-describedby="form?.errors?.[field] ? `${field}-error` : undefined"
      />
      <span class="text-xs text-gray-800 font-medium whitespace-nowrap">
        {{ displayLabel }}
      </span>
    </label>

    <div v-if="form?.errors?.[field]" :id="`${field}-error`" class="mt-1 text-xs text-red-600">
      {{ form.errors[field] }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  id: {
    type: String,
    default: null
  },
  field: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  form: {
    type: Object,
    required: true
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  inputClass: {
    type: [String, Array, Object],
    default: ''
  }
})

const fieldLabel = field => field
  .replace(/_/g, ' ')

const displayLabel = computed(() => (props.label || fieldLabel(props.field)).toLowerCase())
</script>
