<template>
  <div class="form-group">
    <label :for="field" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label || fieldLabel }}
    </label>

    <input
      :id="field"
      type="number"
      :required="required"
      :disabled="disabled"
      :placeholder="placeholder"
      v-model="inputValue"
      @input="onInput"
      @blur="onBlur"
      class="w-full px-3 py-2 border border-gray-400 focus:outline-none focus:ring focus:ring-opacity-50"
      :class="[
        rectangular ? 'rounded-none' : 'rounded-xl',
        form?.errors?.[field] ? 'border-red-500' : 'border-gray-300'
      ]"
      :aria-invalid="!!form?.errors?.[field]"
      :aria-describedby="form?.errors?.[field] ? `${field}-error` : undefined"
    />

    <div v-if="form?.errors?.[field]" :id="`${field}-error`" class="mt-1 text-xs text-red-600">
      {{ form.errors[field] }}
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
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
  placeholder: {
    type: String,
    default: ''
  },
  rectangular: {
    type: Boolean,
    default: false
  }
})

const inputValue = ref('')

const fieldLabel = props.field
  .replace(/_/g, ' ')
  .replace(/\b\w/g, l => l.toUpperCase())

watch(() => props.form[props.field], (val) => {
  inputValue.value = val !== null && val !== undefined ? val.toString() : ''
}, { immediate: true })

const onInput = (e) => {
  let val = e.target.value

  // Remove all characters except digits, dot, and minus
  val = val.replace(/[^0-9.-]/g, '')

  // Only allow one dot
  const parts = val.split('.')
  if (parts.length > 2) {
    val = parts[0] + '.' + parts.slice(1).join('')
  }

  // Only allow one minus at the beginning
  val = val.replace(/(?!^)-/g, '')

  inputValue.value = val
}

const onBlur = () => {
  const num = parseFloat(inputValue.value)
  if (!isNaN(num)) {
    props.form[props.field] = num
    inputValue.value = num.toString()
  } else {
    props.form[props.field] = null
    inputValue.value = ''
  }
}
</script>
