<template>
  <div class="form-group">
    <label class="block text-sm font-medium text-gray-700 mb-1">
      {{ label || fieldLabel }}
    </label>

    <div
      class="flex w-full overflow-hidden border border-gray-300 shadow-sm"
      :class="rectangular ? 'rounded-none' : 'rounded-md'"
    >
      <button
        type="button"
        class="flex-1 px-4 py-2 text-sm focus:outline-none"
        :class="{
          'bg-primary text-white': form?.[field] === true,
          'bg-white text-gray-700 hover:bg-gray-50': form?.[field] !== true
        }"
        @click="() => form[field] = true"
      >
        Yes
      </button>

      <button
        type="button"
        class="flex-1 px-4 py-2 text-sm focus:outline-none border-l border-gray-300"
        :class="{
          'bg-primary text-white': form?.[field] === false,
          'bg-white text-gray-700 hover:bg-gray-50': form?.[field] !== false
        }"
        @click="() => form[field] = false"
      >
        No
      </button>
    </div>

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
  form: {
    type: Object,
    required: true
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
