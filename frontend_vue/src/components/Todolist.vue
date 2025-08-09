<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Todo {
  id: number
  title: string
  completed: boolean
}

const todos = ref<Todo[]>([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const res = await fetch('/api/todo')
    if (!res.ok) throw new Error('API error')
    todos.value = await res.json()
  } catch (e: any) {
    error.value = e.message || 'Unknown error'
  } finally {
    loading.value = false
  }
})
</script>
<template>
  <h1 class="text-2xl font-bold mb-4">Todo List</h1>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error" class="text-red-500">{{ error }}</div>
  <pre v-else>{{ todos }}</pre>
</template>