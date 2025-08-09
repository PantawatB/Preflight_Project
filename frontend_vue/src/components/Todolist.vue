<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Database</h1>
      <div class="flex items-center gap-4">
        <!-- Search removed for todo list -->

        <!-- Filter Button -->
        <!-- Filter removed for todo list -->

        <button
          class="flex items-center gap-2 bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-800"
          @click="openModal"
        >
          <span class="font-semibold">+ Add</span>
        </button>
      </div>
    </div>
    <!-- กล่องข้อมูลของ list -->
    <div class="bg-gray-50 rounded-xl shadow-md overflow-hidden">
      <!-- ส่วน header -->
      <table class="min-w-full divide-y divide-gray-300">
        <!-- สี header -->
        <thead class="bg-gray-100">
          <tr>
            <th class="px-6 py-3 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider">Todo</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider">Created At</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider">Updated At</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <!-- Empty state message -->
          <tr v-if="contacts.length === 0">
            <td colspan="6" class="px-6 py-12 text-center">
              <div class="flex flex-col items-center justify-center space-y-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-12 h-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <p class="text-xl font-medium text-gray-500">No todos found</p>
                <p class="text-sm text-gray-400">
                  Add a todo to get started
                </p>
              </div>
            </td>
          </tr>
          <!-- Table rows for todos -->
          <tr
            v-for="todo in contacts"
            :key="todo.id"
            class="hover:bg-gray-100"
          >
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ todo.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ todo.todoText }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <span :class="todo.isDone ? 'text-green-600 font-semibold' : 'text-gray-400'">
                {{ todo.isDone ? 'Done' : 'Not done' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ new Date(todo.createdAt).toLocaleString() }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ new Date(todo.updatedAt).toLocaleString() }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex items-center justify-end gap-2">
                <button
                  @click="editTodoModal(todo)"
                  class="flex items-center gap-1 bg-slate-600 border text-white px-3 py-2 rounded-lg hover:bg-slate-800"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    ></path>
                  </svg>
                  <span>Edit</span>
                </button>
                <button
                  @click="openDeleteModal(todo)"
                  class="flex items-center gap-1 bg-red-600 border text-white px-3 py-2 rounded-lg hover:bg-red-800"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                  <span>Delete</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination removed for todo list -->
    </div>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center"
    >
      <div class="relative bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 class="text-xl font-bold mb-6">{{ isEditing ? 'Edit Todo' : 'Add new Todo' }}</h2>
        <form @submit.prevent="addOrUpdateTodo">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Todo</label>
              <input
                type="text"
                v-model="newTodo.todoText"
                required
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                placeholder="Enter todo"
              />
            </div>
          </div>
          <div class="mt-6 flex justify-end gap-3">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 border rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-800"
            >
              {{ isEditing ? 'Update' : 'Add' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center"
    >
      <div class="relative bg-white rounded-lg shadow-xl p-8 w-full max-w-md text-center">
        <div class="flex justify-center mb-6">
          <div class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              ></path>
            </svg>
          </div>
        </div>
        <h2 class="text-xl font-bold mb-4">Delete Todo</h2>
        <p class="text-gray-600 mb-6">
          Are you sure you want to delete this todo? This action cannot be undone.
        </p>
        <div class="flex justify-center gap-3">
          <button
            @click="cancelDelete"
            class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            @click="confirmDelete"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-800"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getTodos, addTodo, updateTodo, deleteTodo } from '../services/web.service.ts'

interface Todo {
  id: string
  todoText: string
  isDone: boolean
  createdAt: string
  updatedAt: string
}

const contacts = ref<Todo[]>([])
const showModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const editingTodo = ref<Todo | null>(null)
const todoToDelete = ref<Todo | null>(null)
const newTodo = ref({ todoText: '' })

async function fetchContacts() {
  try {
    const data = await getTodos()
    contacts.value = data
  } catch (e) {
    contacts.value = []
  }
}

onMounted(fetchContacts)

const openModal = () => {
  isEditing.value = false
  editingTodo.value = null
  newTodo.value = { todoText: '' }
  showModal.value = true
}

const editTodoModal = (todo: Todo) => {
  isEditing.value = true
  editingTodo.value = { ...todo }
  newTodo.value = { todoText: todo.todoText }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  editingTodo.value = null
}

const addOrUpdateTodo = async () => {
  if (isEditing.value && editingTodo.value) {
    await updateTodo(editingTodo.value.id, newTodo.value.todoText)
  } else {
    await addTodo(newTodo.value.todoText)
  }
  await fetchContacts()
  closeModal()
}

const openDeleteModal = (todo: Todo) => {
  todoToDelete.value = todo
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (todoToDelete.value) {
    await deleteTodo(todoToDelete.value.id)
    await fetchContacts()
    showDeleteModal.value = false
    todoToDelete.value = null
  }
}

const cancelDelete = () => {
  showDeleteModal.value = false
  todoToDelete.value = null
}
</script>
