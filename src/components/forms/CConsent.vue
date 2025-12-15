<template>
  <div class="form-group">
    <label :for="id ?? field" class="flex items-start space-x-2 cursor-pointer select-none">
      <input
        type="checkbox"
        :id="id ?? field"
        v-model="form[field]"
        :disabled="disabled"
        :required="required"
        class="mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring focus:ring-opacity-50"
        :aria-invalid="!!form?.errors?.[field]"
        :aria-describedby="form?.errors?.[field] ? `${field}-error` : undefined"
      />
      <div>
        <span class="text-sm font-medium text-gray-700 mb-3">
          {{ label || fieldLabel }}
        </span>
        <p v-if="description" class="text-sm text-gray-500 mt-1 normal-case">
          {{ description }}
        </p>
      </div>
    </label>

    <div v-if="form?.errors?.[field]" :id="`${field}-error`" class="mt-1 text-xs text-red-600">
      {{ form.errors[field] }}
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

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
  description: {
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
  defaultValue: {
    type: Boolean,
    default: false
  }
})

const fieldLabel = field =>
  field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) 

onMounted(() => {
  if (props.form[props.field] === null || props.form[props.field] === undefined || props.form[props.field] === '') {
    props.form[props.field] = props.defaultValue

    // console.log('final', props.form[props.field])
  } else if (props.form[props.field] === '') {
    props.form[props.field] = false
  }
})
</script>
