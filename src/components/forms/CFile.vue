<template>
  <div :class="['form-group', props.class]">
    <label class="block text-sm font-medium text-gray-700 mb-1">
      {{ label || fieldLabel }}
    </label>

    <!-- Dropzone -->
    <div
      class="relative border-2 border-dashed p-4 text-center transition-colors"
      :class="[
        rectangular ? 'rounded-none' : 'rounded-lg',
        dragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-white',
        hasError ? 'border-red-500' : ''
      ]"
      @dragenter.prevent="onDragEnter"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
      @click="openFileDialog"
      role="button"
      tabindex="0"
      @keydown.enter.prevent="openFileDialog"
      @keydown.space.prevent="openFileDialog"
    >
      <input
        ref="fileInput"
        type="file"
        class="hidden"
        :multiple="multiple"
        :accept="normalisedAccept"
        @change="onFileChange"
      />

      <div class="flex flex-col items-center gap-1 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M3 15a4 4 0 004 4h10a4 4 0 100-8h-1M7 15l5-5 5 5" />
        </svg>
        <p class="text-sm text-gray-600">
          <span class="font-medium">Click to choose</span> or drag & drop files here
        </p>
        <p v-if="normalisedAccept" class="text-xs text-gray-400">
          Accepted: {{ normalisedAccept }}
        </p>
      </div>
    </div>

    <!-- Previews / list -->
<div v-if="initialDisplay.length || filesDisplay.length" class="mt-3">
  <div
    :class="props.multiple
      ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3'
      : 'w-full'"
  >
    <!-- Existing from form/initial -->
    <div
      v-for="(it, i) in initialDisplay"
      :key="it.key"
      class="relative group"
      :class="props.multiple ? '' : 'w-full'"
    >
      <div
        v-if="it.isImage"
        :class="[
          props.multiple
            ? 'aspect-video w-full overflow-hidden border bg-white'
            : 'w-full overflow-hidden border bg-white',
          rectangular ? 'rounded-none' : 'rounded'
        ]"
      >
        <img :src="it.url" alt="" class="h-full w-full object-cover" />
      </div>
      <div
        v-else
        class="w-full border p-3 text-xs bg-gray-50"
        :class="rectangular ? 'rounded-none' : 'rounded'"
      >
        <p class="font-medium truncate" :title="it.name">{{ it.name }}</p>
        <p class="text-gray-500 truncate">{{ it.ext?.toUpperCase() }}</p>
      </div>
      <span
        class="absolute left-1 top-1 text-[10px] bg-white/90 border px-1"
        :class="rectangular ? 'rounded-none' : 'rounded'"
      >Existing</span>
    </div>

    <!-- Newly selected files -->
    <div
      v-for="(it, idx) in filesDisplay"
      :key="it.key"
      class="relative group"
      :class="props.multiple ? '' : 'w-full'"
    >
      <div
        v-if="it.isImage"
        :class="[
          props.multiple
            ? 'aspect-video w-full overflow-hidden border'
            : 'w-full overflow-hidden border',
          rectangular ? 'rounded-none' : 'rounded'
        ]"
      >
        <img :src="it.previewUrl" alt="" class="h-full w-full object-cover" />
      </div>
      <div v-else class="w-full border p-3 text-xs bg-gray-50" :class="rectangular ? 'rounded-none' : 'rounded'">
        <p class="font-medium truncate" :title="it.file.name">{{ it.file.name }}</p>
        <p class="text-gray-500 truncate">{{ prettySize(it.file.size) }}</p>
      </div>

      <button
        v-if="props.multiple"
        type="button"
        class="absolute -top-2 -right-2 hidden group-hover:block bg-white border p-1 shadow"
        :class="rectangular ? 'rounded-none' : 'rounded-full'"
        @click.stop="removeAt(idx)"
        aria-label="Remove file"
        title="Remove"
      >✕</button>
    </div>
  </div>

  <div v-if="multiple" class="mt-2 text-xs text-gray-500">
    {{ initialDisplay.length + filesDisplay.length }} file(s) selected
  </div>
</div>


    <!-- Errors -->
    <div v-if="hasError" class="mt-1 text-xs text-red-600">
      {{ form.errors[field] }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'

const props = defineProps({
  form: { type: Object, required: true },
  field: { type: String, required: true },
  label: { type: String, default: '' },
  multiple: { type: Boolean, default: false },
  accept: { type: [String, Array], default: '' }, // e.g. 'image/*,.pdf' or ['image/*','.pdf']
  class: { type: [String, Array, Object], default: '' },
  initial: { type: Array, default: () => [] },
  rectangular: { type: Boolean, default: false }
})

const fileInput = ref(null)
const dragging = ref(false)
const objectUrls = new Set()

const fieldLabel = props.field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

const hasError = computed(() => !!props.form?.errors?.[props.field])

const normalisedAccept = computed(() => {
  if (Array.isArray(props.accept)) return props.accept.join(',')
  return props.accept || ''
})

const isUrlOrPath = (v) => {
  if (typeof v !== 'string' || !v.trim()) return false
  // http(s), protocol-relative, or looks like a path with a slash and an extension
  return /^(https?:)?\/\//i.test(v) || /\/[^/]+\.[a-z0-9]+$/i.test(v)
}
const fileNameFromUrl = (url) => {
  try {
    const u = new URL(url, window.location.origin)
    const base = u.pathname.split('/').pop() || 'file'
    return decodeURIComponent(base)
  } catch {
    return (url || '').split('/').pop() || 'file'
  }
}
const extFromName = (name) => {
  const parts = (name || '').split('.')
  return parts.length > 1 ? parts.pop() : ''
}
const isImageUrl = (url, type) => {
  if (type?.startsWith?.('image/')) return true
  return /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(url || '')
}
// 1) NEW: derive existing items from form[field] if it has URL(s)
const existingFromForm = computed(() => {
  const v = props.form?.[props.field]
  if (props.multiple) {
    const arr = Array.isArray(v) ? v : []
    return arr
      .filter(isUrlOrPath)
      .map((url, i) => {
        const name = fileNameFromUrl(url)
        return {
          key: `form-existing-${i}-${name}`,
          url,
          name,
          ext: extFromName(name),
          isImage: isImageUrl(url)
        }
      })
  } else {
    if (!isUrlOrPath(v)) return []
    const name = fileNameFromUrl(v)
    return [{
      key: `form-existing-${name}`,
      url: v,
      name,
      ext: extFromName(name),
      isImage: isImageUrl(v)
    }]
  }
})
const initialDisplay = computed(() => {
  const items = (props.initial || []).map((item, i) => {
    const obj = typeof item === 'string' ? { url: item } : item || {}
    const name = obj.name || fileNameFromUrl(obj.url)
    return {
      key: `initial-${obj.id ?? i}-${name}`,
      url: obj.url,
      name,
      ext: extFromName(name),
      isImage: isImageUrl(obj.url, obj.type),
      raw: obj
    }
  })

  const merged = [...items]
  const seen = new Set(items.map(x => x.url))
  existingFromForm.value.forEach(x => {
    if (!seen.has(x.url)) {
      merged.push(x)
      seen.add(x.url)
    }
  })
  return merged
})

const currentFiles = computed({
  get() {
    const v = props.form[props.field]
    if (props.multiple) return Array.isArray(v) ? v.filter(x => x instanceof File) : []
    return v instanceof File ? [v] : []
  },
  set(newArr) {
    if (props.multiple) {
      props.form[props.field] = newArr.filter(x => x instanceof File)
    } else {
      props.form[props.field] = newArr[0] instanceof File ? newArr[0] : null
    }
  }
})

const filesDisplay = computed(() =>
  currentFiles.value.map((f, i) => {
    const isImage = f?.type?.startsWith('image/')
    const previewUrl = isImage ? makeObjectUrl(f) : ''
    return {
      key: `${f?.name || 'file'}-${i}-${f?.lastModified || ''}`,
      file: f,
      isImage,
      previewUrl
    }
  })
)

const openFileDialog = () => fileInput.value?.click()

const onFileChange = e => {
  const picked = Array.from(e.target.files || [])
  applyFiles(picked)
  // reset the input so selecting the same file again still triggers change
  e.target.value = ''
}

const onDragEnter = () => dragging.value = true
const onDragOver = () => dragging.value = true
const onDragLeave = () => dragging.value = false

const onDrop = e => {
  dragging.value = false
  const dropped = Array.from(e.dataTransfer?.files || [])
  const filtered = filterByAccept(dropped, normalisedAccept.value)
  applyFiles(filtered)
}

const applyFiles = files => {
  if (!files.length) return
  if (props.multiple) {
    currentFiles.value = [...currentFiles.value, ...files]
  } else {
    currentFiles.value = [files[0]]
  }
}

const removeAt = idx => {
  const arr = [...currentFiles.value]
  const removed = arr.splice(idx, 1)
  currentFiles.value = arr
  // revoke each removed preview url
  removed.forEach(f => {
    if (f && f instanceof File) {
      const tmp = URL.createObjectURL(f)
      URL.revokeObjectURL(tmp) // fallback, but better to track the created url
    }
  })
}

const prettySize = bytes => {
  if (!bytes && bytes !== 0) return ''
  const units = ['B','KB','MB','GB']
  let i = 0
  let n = bytes
  while (n >= 1024 && i < units.length - 1) {
    n = n / 1024
    i++
  }
  return `${n.toFixed(1)} ${units[i]}`
}

// Accept filter for drag & drop
const filterByAccept = (files, acceptStr) => {
  if (!acceptStr) return files
  const tokens = acceptStr.split(',').map(s => s.trim()).filter(Boolean)
  return files.filter(f => matchesAnyToken(f, tokens))
}

const matchesAnyToken = (file, tokens) => {
  const { type, name } = file
  return tokens.some(t => {
    if (t.endsWith('/*')) {
      const base = t.slice(0, -2)
      return type.startsWith(base + '/')
    }
    if (t.startsWith('.')) {
      return name.toLowerCase().endsWith(t.toLowerCase())
    }
    return type === t
  })
}

// object URL helpers
const makeObjectUrl = f => {
  const url = URL.createObjectURL(f)
  objectUrls.add(url)
  return url
}
const revokeObjectUrl = fOrUrl => {
  const url = typeof fOrUrl === 'string' ? fOrUrl : null
  if (url && objectUrls.has(url)) {
    URL.revokeObjectURL(url)
    objectUrls.delete(url)
  }
}
onBeforeUnmount(() => {
  objectUrls.forEach(u => URL.revokeObjectURL(u))
  objectUrls.clear()
})
</script>
