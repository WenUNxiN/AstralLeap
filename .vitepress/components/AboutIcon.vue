<script setup>
defineProps({ name: { type: String, required: true } })

// Shared outline icons keep this page consistent without a new dependency.
const paths = {
  arrow: ['M5 12h14m-6-6 6 6-6 6'],
  search: ['M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Zm-2 5 6 6'],
  'arrow-up': ['M7 17 17 7M7 7h10v10'],
  camera: ['M14 4h-4L8 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-4l-2-3Z', 'M16 13a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z'],
  sliders: ['M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3M1 14h6m2-6h6m2 8h6'],
  film: ['M4 3h16v18H4zM4 8h16M4 16h16M8 3v18M16 3v18'],
  radio: ['M5 5a10 10 0 0 0 0 14M19 5a10 10 0 0 1 0 14M8 8a6 6 0 0 0 0 8m8-8a6 6 0 0 1 0 8', 'M14 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z'],
  chip: ['M6 6h12v12H6zM9 9h6v6H9zM9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m-4 6h4m12-6h4m-4 6h4'],
  code: ['m8 6-6 6 6 6m8-12 6 6-6 6M14 3l-4 18'],
  sparkles: ['m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3ZM4 2v4M2 4h4m14 14v4m-2-2h4'],
  terminal: ['M3 4h18v16H3zM7 9l3 3-3 3m6 0h4'],
  sprout: ['M12 22v-9M12 17C6 17 3 13 3 7c6 0 9 4 9 10Zm0-4c0-6 3-10 9-10 0 6-3 10-9 10Z'],
  book: ['M12 5v16M12 5C8 2 4 3 2 4v15c3-1 7-1 10 2 3-3 7-3 10-2V4c-2-1-6-2-10 1Z'],
  flask: ['M9 3h6m-5 0v7L4 20a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1l-6-10V3M7 16h10'],
  bug: ['M8 10a4 4 0 0 1 8 0v6a4 4 0 0 1-8 0v-6Zm1-3V5a3 3 0 0 1 6 0v2M12 10v10M4 13h4m8 0h4M4 6l4 4m8 0 4-4M4 20l4-3m8 0 4 3'],
  layers: ['m12 3 10 5-10 5L2 8l10-5ZM2 12l10 5 10-5M2 16l10 5 10-5'],
  message: ['M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-3 3V11.5A8.5 8.5 0 0 1 9.5 3h3a8.5 8.5 0 0 1 8.5 8.5ZM7 10h8m-8 4h5'],
  copy: ['M9 9h12v12H9zM15 9V3H3v12h6'],
  focus: ['M3 9V3h6m6 0h6v6m0 6v6h-6m-6 0H3v-6'],
  check: ['m5 12 4 4L19 6']
}
</script>

<template>
  <svg class="about-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
    <path v-for="(d, index) in paths[name]" :key="index" :d="d" />
  </svg>
</template>
