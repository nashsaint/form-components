<template>
  <div class="form-group px-2" :style="rectangular ? '--form-radius: 0px' : ''">
    <label :for="field" class="block text-[11px] text-gray-700 mb-0">
      {{ label || fieldLabel }} <span v-if="required" class="text-red-600 text-[9px]">(required)</span>
    </label>

    <DatePicker
      :id="field"
      v-model="form[field]"
      :format="format"
      :required="required"
      :disabled="disabled"
      :placeholder="placeholder || 'Select date'"
      :min-date="minDate"
      :max-date="maxDate"
      :class="[
        'w-full',
        form?.errors?.[field] ? 'border-red-500' : 'border-red-300'
      ]"
      input-class="w-full border-gray-400 px-3 py-2 focus:outline-none focus:ring focus:ring-opacity-50"
    />

    <div v-if="form?.errors?.[field]" :id="`${field}-error`" class="mt-1 text-xs text-red-600">
      {{ form.errors[field] }}
    </div>
  </div>
</template>

<script setup>
import DatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

defineProps({
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
  format: {
    type: String,
    default: 'yyyy-MM-dd'
  },
  minDate: {
    type: [Date, String],
    default: null
  },
  maxDate: {
    type: [Date, String],
    default: null
  },
  rectangular: {
    type: Boolean,
    default: false
  }
})

const fieldLabel = field =>
  field
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
</script>

<style>
.dp__input {
  border-color: var(--color-gray-700);
  border-radius: var(--form-radius, var(--radius-xl));
  font-family: var(--dp-font-family);
  border: 1px solid #b1b1b1;
  outline: none;
  transition: border-color .2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
  font-size: 1rem;
  line-height: calc(var(--dp-font-size) * 1.5);
  padding: var(--dp-input-padding);
  padding-block: calc(var(--spacing) * 2.5);
  padding-left: 34px;
  color: var(--dp-text-color);
  box-sizing: border-box;
}
</style>
