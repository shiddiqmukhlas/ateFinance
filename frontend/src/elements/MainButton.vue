<template>
  <button
    @click="onClick"
    :class="['!px-4 !py-2 rounded-lg !shadow-lg border border-bg-gray-300 cursor-pointer', hoverClass, bgClass, textClass]"
  >
    <slot>Default Text</slot>
  </button>
</template>

<script setup>
const props = defineProps({
  bgClass: {
    type: String,
    default: 'bg-[#F43C6E]', // Warna background default dari Tailwind
  },
  hoverClass: {
    type: String,
    default: 'hover:bg-rose-500', // Warna background default dari Tailwind
  },
  textClass: {
    type: String,
    default: 'text-white', // Warna teks default dari Tailwind
  },
});

const emit = defineEmits(['click']);

const onClick = () => {
  emit('click');
};
</script>
