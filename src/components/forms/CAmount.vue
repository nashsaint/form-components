<template>
  <div class="form-group">
    <label :for="field" class="text-[10px] mb-1">
      {{ label || fieldLabel }}
    </label>

    <div class="relative">
      <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-sm pointer-events-none">
        ₤
      </span>

      <input
        :id="field"
        type="text"
        :required="required"
        :disabled="disabled"
        :placeholder="placeholder"
        v-model="inputValue"
        @blur="onBlur"
        class="pl-8 pr-3 py-3 text-sm block w-full border border-gray-400 focus:outline-none focus:ring focus:ring-opacity-50"
        :class="[
          rectangular ? 'rounded-none' : 'rounded-xl',
          form?.errors?.[field] ? 'border-red-500' : 'border-gray-400'
        ]"
        :aria-invalid="!!form?.errors?.[field]"
        :aria-describedby="form?.errors?.[field] ? `${field}-error` : undefined"
      />
    </div>

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
    default: '0.00'
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

const formatWithCommas = (number) => {
  return Number(number).toLocaleString('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

watch(() => props.form[props.field], (val) => {
  inputValue.value = val !== null && val !== undefined && val !== ''
    ? formatWithCommas(val)
    : ''
}, { immediate: true })

const onBlur = () => {
  const raw = inputValue.value.replace(/,/g, '')
  const num = parseFloat(raw)

  if (!isNaN(num)) {
    props.form[props.field] = num
    inputValue.value = formatWithCommas(num)
  } else {
    props.form[props.field] = null
    inputValue.value = ''
  }
}
</script>
