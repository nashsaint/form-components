<template>
  <div class="form-group border-0">
    <label :for="field" class="block text-[10px] uppercase text-gray-700 mb-1">
      {{ label || fieldLabel }} <span v-if="required" class="text-red-600 text-[9px]">(required)</span>
    </label>

    <input
      :id="field"
      :type="inputType"
      :placeholder="placeholder || label || fieldLabel"
      :required="required"
      :disabled="disabled"
      class="w-full !px-4 py-3 text-gray-800 border border-gray-400 focus:border-indigo-500 focus:ring focus:ring-indigo-400 outline-none text-sm"
      :class="rectangular ? 'rounded-none' : 'rounded-xl'"
      :value="form?.[field]"
      @input="e => form[field] = e.target.value"
      :aria-invalid="!!form?.errors?.[field]"
      :aria-describedby="form?.errors?.[field] ? `${field}-error` : undefined"
    />

    <div v-if="form?.errors?.[field]" :id="`${field}-error`" class="mt-1 text-xs text-red-600">
      {{ form.errors[field] }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  field: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  inputType: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  rectangular: {
    type: Boolean,
    default: false
  },
  form: {
    type: Object,
    required: true
  }
})

const fieldLabel = field => field
  .replace(/_/g, ' ')
  .replace(/\b\w/g, l => l.toUpperCase())
</script>

<style scoped>
[type='text'], [type='email'], [type='url'], [type='password'], [type='number'], [type='date'], [type='datetime-local'], [type='month'], [type='search'], [type='tel'], [type='time'], [type='week'], [multiple], textarea, select {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
</style>
