<template>
  <div class="flex justify-between items-center pt-4">
    <div>
      <label class="mr-2">Items per page:</label>
      <select
        :value="resultsPerPage"
        @change="$emit('update:resultsPerPage', +$event.target.value)"
        class="border px-2 py-1 rounded"
      >
        <option v-for="option in perPageOptions" :key="option" :value="option">{{ option }}</option>
      </select>
    </div>

    <div class="flex items-center space-x-2">
      <button
        @click="$emit('prev-page')"
        :disabled="currentPage === 1"
        class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      >
        Prev
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        @click="$emit('next-page')"
        :disabled="currentPage === totalPages"
        class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaginationControls',
  props: {
    currentPage: Number,
    totalPages: Number,
    resultsPerPage: Number,
    perPageOptions: {
      type: Array,
      default: () => [5, 10, 20, 50],
    },
  },
};
</script>