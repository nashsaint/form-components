<template>
  <div class="form-group">
    <label :for="field" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label || fieldLabel }}
    </label>

    <textarea
      :id="field"
      rows="1"
      :required="required"
      :disabled="disabled"
      :placeholder="placeholder"
      :maxlength="maxlength"
      v-model="inputValue"
      @input="updateValue"
      class="w-full px-3 py-2 h-60 text-gray-700 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring focus:ring-opacity-50 resize-none"
      :class="form?.errors?.[field] ? 'border-red-500' : 'border-gray-300'"
      :aria-invalid="!!form?.errors?.[field]"
      :aria-describedby="form?.errors?.[field] ? `${field}-error` : undefined"
    ></textarea>

    <div class="flex justify-between mt-1 text-xs">
      <span v-if="form?.errors?.[field]" :id="`${field}-error`" class="text-red-600 text-xs">
        {{ form.errors[field] }}
      </span>
      <span class="ml-auto text-xs text-gray-500">
        {{ inputValue.length }} / {{ maxlength }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  field: String,
  label: {
    type: String,
    default: ''
  },
  form: Object,
  required: Boolean,
  disabled: Boolean,
  placeholder: {
    type: String,
    default: ''
  },
  maxlength: {
    type: Number,
    default: 500
  }
})

const inputValue = ref('')

const fieldLabel = props.field
  .replace(/_/g, ' ')
  .replace(/\b\w/g, l => l.toUpperCase())

watch(() => props.form[props.field], (val) => {
  inputValue.value = val ?? ''
}, { immediate: true })

const updateValue = () => {
  props.form[props.field] = inputValue.value
}
</script>
