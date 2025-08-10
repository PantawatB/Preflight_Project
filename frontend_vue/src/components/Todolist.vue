<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Todo List🎯</h1>
      <div class="flex items-center gap-4">
        <!-- Search Bar -->
        <div class="relative">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search todo..."
            class="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
          <svg
            class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>

        <!-- Filter Button -->
        <div class="relative" ref="filterRef">
          <button
            @click="showFilterMenu = !showFilterMenu"
            class="flex items-center gap-2 bg-white border px-4 py-2 rounded-lg hover:bg-gray-50"
          >
            <svg
              class="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <span class="text-gray-700">Filter</span>
            <span
              v-if="selectedStatus"
              class="bg-slate-500 text-white text-xs px-2 py-1 rounded-full"
            >
              1
            </span>
          </button>

          <!-- Filter Dropdown -->
          <div
            v-if="showFilterMenu"
            class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border p-4 z-10"
          >
            <!-- Status Filter -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                v-model="selectedStatus"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                <option value="">All Status</option>
                <option value="done">Done</option>
                <option value="notdone">Not done</option>
              </select>
            </div>
            <!-- Clear Filters -->
            <button
              @click="clearFilters"
              class="w-full px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-700"
            >
              Clear Filters
            </button>
          </div>
        </div>

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
          <tr v-if="filteredTodos.length === 0">
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
            v-for="todo in paginatedTodos"
            :key="todo.id"
            class="hover:bg-gray-100"
          >
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ todo.id }}</td>
            <td class="px-6 py-4 whitespace-normal break-words max-w-xs text-sm text-gray-900" style="word-break: break-word; overflow-wrap: anywhere;">
              {{ todo.todoText }}
            </td>
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
                  @click="viewTodo(todo)"
                  class="flex items-center gap-1 bg-white border border-slate-400 text-slate-600 px-3 py-2 rounded-lg hover:bg-slate-100"
                  title="View"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
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

      <!-- View Modal -->
      <div
        v-if="showViewModal"
        class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50"
      >
        <div class="relative bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <h2 class="text-xl font-bold mb-6">Todo Details</h2>
          <div class="space-y-4">
            <div>
              <span class="font-semibold text-gray-700">ID:</span>
              <span class="ml-2 text-gray-900">{{ viewTodoData?.id }}</span>
            </div>
            <div>
              <span class="font-semibold text-gray-700">Todo:</span>
              <span class="ml-2 text-gray-900 break-words" style="word-break: break-word; overflow-wrap: anywhere;">{{ viewTodoData?.todoText }}</span>
            </div>
            <div>
              <span class="font-semibold text-gray-700">Status:</span>
              <span class="ml-2" :class="viewTodoData?.isDone ? 'text-green-600 font-semibold' : 'text-gray-400'">
                {{ viewTodoData?.isDone ? 'Done' : 'Not done' }}
              </span>
            </div>
            <div>
              <span class="font-semibold text-gray-700">Created At:</span>
              <span class="ml-2 text-gray-900">{{ viewTodoData ? new Date(viewTodoData.createdAt).toLocaleString() : '' }}</span>
            </div>
            <div>
              <span class="font-semibold text-gray-700">Updated At:</span>
              <span class="ml-2 text-gray-900">{{ viewTodoData ? new Date(viewTodoData.updatedAt).toLocaleString() : '' }}</span>
            </div>
          </div>
          <div class="mt-6 flex justify-end gap-3">
            <button
              type="button"
              @click="closeViewModal"
              class="px-4 py-2 border rounded-lg hover:bg-gray-200"
            >
              Close
            </button>
            <button
              v-if="viewTodoData && !viewTodoData.isDone"
              @click="markAsDone(viewTodoData)"
              class="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-800 flex items-center gap-1"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Mark as Done
            </button>
          </div>
        </div>
      </div>

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
                maxlength="255"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                placeholder="Enter todo (max 255 characters)"
              />
              <div class="text-xs text-gray-500 mt-1 text-right">
                {{ newTodo.todoText.length }}/255
              </div>
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import type { TodoItem } from '../models/web.model';
import { getTodos, addTodo, updateTodo, deleteTodo } from '../services/web.service.ts';

const todos = ref<TodoItem[]>([])
const showModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const editingTodo = ref<TodoItem | null>(null)
const todoToDelete = ref<TodoItem | null>(null)
const newTodo = ref({ todoText: '' })
const searchQuery = ref('')
const showFilterMenu = ref(false)
const selectedStatus = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const showViewModal = ref(false)
const viewTodoData = ref<TodoItem | null>(null)

const filteredTodos = computed(() => {
  return todos.value.filter((todo) => {
    const matchesSearch = todo.todoText.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus =
      !selectedStatus.value ||
      (selectedStatus.value === 'done' && todo.isDone) ||
      (selectedStatus.value === 'notdone' && !todo.isDone)
    return matchesSearch && matchesStatus
  })
})

const paginatedTodos = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredTodos.value.slice(start, end)
})

async function fetchTodos() {
  try {
    const data: TodoItem[] = await getTodos();
    todos.value = data;
    // ถ้าต้องการใช้ pagination ในอนาคต สามารถปรับ getTodos ให้ return TodoListResponse แล้วเก็บ pagination ได้
  } catch (e) {
    todos.value = [];
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
  fetchTodos()
})

onBeforeUnmount(() => {
  window.removeEventListener('click', handleClickOutside)
})

const openModal = () => {
  isEditing.value = false
  editingTodo.value = null
  newTodo.value = { todoText: '' }
  showModal.value = true
}

const editTodoModal = (todo: TodoItem) => {
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
  await fetchTodos()
  closeModal()
}

const openDeleteModal = (todo: TodoItem) => {
  todoToDelete.value = todo
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (todoToDelete.value) {
    await deleteTodo(todoToDelete.value.id)
    await fetchTodos()
    showDeleteModal.value = false
    todoToDelete.value = null
  }
}

const cancelDelete = () => {
  showDeleteModal.value = false
  todoToDelete.value = null
}

const clearFilters = () => {
  selectedStatus.value = ''
  searchQuery.value = ''
  currentPage.value = 1
}

// Filter logic
const filterRef = ref<HTMLElement | null>(null)

function handleClickOutside(event: MouseEvent) {
  if (showFilterMenu.value && filterRef.value && !filterRef.value.contains(event.target as Node)) {
    showFilterMenu.value = false
  }
}

const viewTodo = (todo: TodoItem) => {
  viewTodoData.value = { ...todo }
  showViewModal.value = true
}

const closeViewModal = () => {
  showViewModal.value = false
  viewTodoData.value = null
}

const markAsDone = async (todo: TodoItem) => {
  try {
    await updateTodo(todo.id, todo.todoText, true);
    // รีเฟรชข้อมูลใหม่จาก API เพื่อให้สถานะตรงกับ backend
    await fetchTodos();
    showViewModal.value = false;
  } catch (e) {
    // fallback: อัปเดตสถานะใน local ถ้า API error
    const idx = todos.value.findIndex(t => t.id === todo.id);
    if (idx !== -1) {
      todos.value[idx] = {
        ...todos.value[idx],
        isDone: true,
        updatedAt: new Date().toISOString(),
      };
    }
    if (viewTodoData.value && viewTodoData.value.id === todo.id) {
      viewTodoData.value.isDone = true;
      viewTodoData.value.updatedAt = new Date().toISOString();
      showViewModal.value = false;
    }
  }
}
</script>