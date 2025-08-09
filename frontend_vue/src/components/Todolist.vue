<script setup lang="ts">
import { ref } from 'vue';
import { get, deleteTodo, addTodo, updateTodo } from '../services/web.service.ts';
import type { TodoItem } from '../models/web.model.ts'

const apiResult = ref<TodoItem[] | null>(null);
const error = ref<string | null>(null);

// สำหรับ modal ลบ
const showDeleteModal = ref(false);
const deleteTargetId = ref<string | null>(null);

// สำหรับ modal create/edit
const showModal = ref(false);
const isEditing = ref(false);
const formData = ref({
  todoText: '',
});
const editTodoId = ref<string | null>(null);

function openCreateModal() {
  isEditing.value = false;
  formData.value = { todoText: '' };
  editTodoId.value = null;
  showModal.value = true;
}

function openEditModal(todo: TodoItem) {
  isEditing.value = true;
  formData.value = { todoText: todo.todoText };
  editTodoId.value = todo.id;
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

async function handleSubmit() {
  try {
    if (isEditing.value && editTodoId.value) {
      await updateTodo(editTodoId.value, formData.value.todoText);
    } else {
      await addTodo(formData.value.todoText);
    }
    showModal.value = false;
    editTodoId.value = null;
    await fetchApi();
  } catch (e: any) {
    error.value = e.message || 'Error';
  }
}

async function fetchApi() {
  error.value = null;
  try {
    apiResult.value = await get<TodoItem[]>('/todo');
  } catch (e: any) {
    error.value = e.message || 'Error';
  }
}

fetchApi();

function openDeleteModal(id: string) {
  deleteTargetId.value = id;
  showDeleteModal.value = true;
}

function cancelDelete() {
  showDeleteModal.value = false;
  deleteTargetId.value = null;
}

async function confirmDelete() {
  if (!deleteTargetId.value) return;
  try {
    await deleteTodo(deleteTargetId.value);
    showDeleteModal.value = false;
    deleteTargetId.value = null;
    await fetchApi();
  } catch (e: any) {
    error.value = e.message || 'Error';
  }
}
</script>
<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <button class="text-3xl font-bold">DataBase</button>
      <div class="flex items-center gap-4">
        <!-- Search Box -->
        <div class="relative">
          <!-- q	string	ค้นหา title หรือ content -->
          <input
            type="text"
            
            placeholder="Search by ID, title, or content..."
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
        <div class="relative">
          <button
            
            class="flex items-center gap-2 bg-slate-600 text-white border px-5 py-5 rounded-lg hover:bg-slate-800"
          >
            <svg
              class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-white"
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
          </button>
        </div>

        
        <button
          class="flex items-center gap-2 bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-800"
          @click="openCreateModal"
        >
          <span class="font-semibold">+ Add</span>
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <!-- หัวตาราง -->
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              ID
            </th>
            <th
              class="px-6 py-3 text-middle text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Profile
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Title
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Created At
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Updated At
            </th>
            <th
              class="px-6 py-3 text-middle text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <!-- body ตาราง -->
        <!-- สร้างตัวแปร blog มาดูดข้อมูลที่ได้มาจากการดึง api ที่อยู่ใน  -->
        <!-- ที่ต้องวน loop ใน sortedData เพราะจะต้องมีการอัพเดท Data ทุกครั้งที่มีการ sort หรือ filter -->
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="!apiResult || apiResult.length === 0">
            <td colspan="7" class="px-6 py-12 text-center">
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
                  {{ error || 'No data available.' }}
                </p>
              </div>
            </td>
          </tr>
          <tr v-for="todo in apiResult" :key="todo.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ todo.id }}</td>
            <!-- Profile ↓↓↓ -->
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <div class="flex items-center justify-center">
                <div class="w-12 h-12 relative">
                  <div class="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <svg
                      class="w-6 h-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </td>
            <!-- Profile ^^^^^ -->
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ todo.todoText }}</td>
            <td class="px-6 py-4 text-sm text-gray-900">
              <div class="max-w-xs overflow-hidden text-ellipsis">{{ todo.isDone ? 'Done' : 'Not done' }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ new Date(todo.createdAt).toLocaleString() }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ new Date(todo.updatedAt).toLocaleString() }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex items-center justify-end gap-2">
                
                <!-- Edit Button -->
                <button
                  class="flex items-center gap-1 bg-slate-600 border text-white px-3 py-2 rounded-lg hover:bg-slate-800"
                  @click="openEditModal(todo)"
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
                <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center"
    >
      <div class="relative bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 class="text-xl font-bold mb-6">{{ isEditing ? 'Edit member' : 'Add new member' }}</h2>
        <form >
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                
                required
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                
                required
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                <option value="">Select Role</option>
                
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                
                required
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">School</label>
              <select
                
                required
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                <option value="">Select School</option>
                
              </select>
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

                <!-- Create/Edit Modal Popup -->
                <div
                  v-if="showModal"
                  class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center"
                >
                  <div class="relative bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                    <h2 class="text-xl font-bold mb-6">{{ isEditing ? 'Edit todo' : 'Add new todo' }}</h2>
                    <form @submit.prevent="handleSubmit">
                      <div class="space-y-4">
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1">Todo</label>
                          <input
                            type="text"
                            v-model="formData.todoText"
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
                          :class="isEditing ? 'px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-800' : 'px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-800'"
                        >
                        
                          {{ isEditing ? 'Update' : 'Create' }}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                <!-- Delete Button -->
                <button
                  class="flex items-center gap-1 bg-red-600 border text-white px-3 py-2 rounded-lg hover:bg-red-800"
                  @click="openDeleteModal(todo.id)"
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
              <!-- Delete Modal Popup -->
              <div
                v-if="showDeleteModal"
                class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50"
              >
                <div class="relative bg-white rounded-xl shadow-2xl px-6 py-8 w-full max-w-xs sm:max-w-sm md:max-w-md text-center">
                  <div class="flex justify-center mb-4">
                    <div class="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
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
                  <h2 class="text-lg font-bold mb-2">Delete Todo</h2>
                  <p class="text-gray-600 mb-5 text-sm leading-relaxed">
                     Are you sure you want to delete this Todo ?<br>
                    <span class="text-red-500 font-semibold"> This action cannot be undone.</span>
                  </p>
                  <div class="flex justify-center gap-3 mt-2">
                    <button
                      @click="cancelDelete"
                      class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-200 min-w-[80px]"
                    >
                      Cancel
                    </button>
                    <button
                      @click="confirmDelete"
                      class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-800 min-w-[80px]"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
     
  </div>
  

  
      
    
  

  </template>