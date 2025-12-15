<template>
    <div class="space-y-1">
        <label class="block text-xs font-semibold uppercase tracking-wide text-gray-600">
            {{ label }}
        </label>
        <div
            class="flex min-h-[3.5rem] flex-wrap gap-2 rounded-2xl border px-3 py-2 focus-within:border-indigo-500 focus-within:ring focus-within:ring-indigo-200"
            :class="error ? 'border-red-400' : 'border-gray-300'"
        >
            <span
                v-for="(tag, index) in tags"
                :key="`${tag}-${index}`"
                class="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700"
            >
                {{ tag }}
                <button
                    type="button"
                    class="text-indigo-500 hover:text-indigo-700"
                    @click="removeTag(index)"
                >
                    &times;
                </button>
            </span>

            <input
                :value="inputValue"
                :placeholder="placeholder"
                :disabled="disabled || tags.length >= max"
                class="flex-1 min-w-[8rem] border-none bg-transparent text-sm text-gray-700 focus:outline-none"
                @keydown="handleKeydown"
                @input="inputValue = $event.target.value"
                @blur="addTag"
            />
        </div>
        <div class="flex flex-wrap items-center gap-2 text-xs">
            <span v-if="error" class="text-red-500">
                {{ error }}
            </span>
            <span class="text-gray-500">
                Press enter after each tag. {{ tags.length }}/{{ max }} added.
            </span>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    modelValue: {
        type: Array,
        default: () => []
    },
    label: {
        type: String,
        default: 'Tags'
    },
    placeholder: {
        type: String,
        default: 'Add tag'
    },
    disabled: {
        type: Boolean,
        default: false
    },
    max: {
        type: Number,
        default: 10
    },
    error: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['update:modelValue'])

const tags = ref([])
const inputValue = ref('')

watch(
    () => props.modelValue,
    (value) => {
        tags.value = Array.isArray(value) ? [...value] : []
    },
    { immediate: true }
)

function addTag() {
    const value = inputValue.value.replace(/,/g, ' ').trim()
    if (!value || tags.value.length >= props.max) {
        inputValue.value = ''
        return
    }

    const alreadyExists = tags.value.some((tag) => tag.toLowerCase() === value.toLowerCase())
    if (alreadyExists) {
        inputValue.value = ''
        return
    }

    const next = [...tags.value, value]
    sync(next)
    inputValue.value = ''
}

function removeTag(index) {
    const next = tags.value.filter((_, idx) => idx !== index)
    sync(next)
}

function sync(next) {
    tags.value = next
    emit('update:modelValue', next)
}

function handleKeydown(event) {
    if (['Enter', 'Tab', ','].includes(event.key)) {
        event.preventDefault()
        addTag()
        return
    }

    if (event.key === 'Backspace' && inputValue.value === '' && tags.value.length) {
        removeTag(tags.value.length - 1)
    }
}
</script>
