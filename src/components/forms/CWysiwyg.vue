<template>
  <div class="form-group" :class="customClass">
    <label :for="field" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label || fieldLabel }}
    </label>

    <div class="border border-gray-300 rounded-md">
      <div class="flex gap-2 p-2 border-b border-b-gray-200 text-sm">
        <button
          type="button"
          class="p-1 rounded hover:bg-gray-200"
          :class="{ 'text-blue-600': editor.isActive('bold') }"
          @click="editor.chain().focus().toggleBold().run()"
        >
          <Bold class="w-4"/>
        </button>

        <button
          type="button"
          class="p-1 rounded hover:bg-gray-200"
          :class="{ 'text-blue-600': editor.isActive('italic') }"
          @click="editor.chain().focus().toggleItalic().run()"
        >
          <Italic class="w-4" />
        </button>

        <button
          type="button"
          class="p-1 rounded hover:bg-gray-200"
          :class="{ 'text-blue-600': editor.isActive('bulletList') }"
          @click="editor.chain().focus().toggleBulletList().run()"
        >
          <List class="w-5 h-5" />
        </button>

        <button
          type="button"
          class="p-1 rounded hover:bg-gray-200"
          :class="{ 'text-blue-600': editor.isActive('orderedList') }"
          @click="editor.chain().focus().toggleOrderedList().run()"
        >
          <ListOrdered class="w-5 h-5" />
        </button>
      </div>

      <EditorContent :editor="editor" class="p-3 min-h-[200px]" />
    </div>

    <div v-if="form?.errors?.[field]" :id="`${field}-error`" class="mt-1 text-xs text-red-600">
      {{ form.errors[field] }}
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import {
    Bold,
    Italic,
    List,
    ListOrdered,
} from 'lucide-vue-next'

const props = defineProps({
  field: String,
  label: { type: String, default: '' },
  form: Object,
  required: Boolean,
  disabled: Boolean,
  placeholder: { type: String, default: '' },
  class: { type: [String, Array, Object], default: '' }
})

const customClass = props.class
const fieldLabel = props.field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

const editor = new Editor({
  content: props.form[props.field] || '',
  extensions: [StarterKit],
  editorProps: {
    attributes: {
      class: 'outline-none prose max-w-none',
      placeholder: props.placeholder
    }
  },
  onUpdate({ editor }) {
    props.form[props.field] = editor.getHTML()
  }
})

watch(() => props.form[props.field], (val) => {
  if (editor.getHTML() !== val) {
    editor.commands.setContent(val || '', false)
  }
})

onBeforeUnmount(() => {
  editor.destroy()
})
</script>

<style lang="css">
.ProseMirror {
  min-height: 200px;
}

.ProseMirror p:only-child {
  min-height: 200px;
}

.ProseMirror p {
    font-size: .8rem;
}
</style>