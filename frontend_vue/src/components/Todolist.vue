<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Jujutsu Database</h1>
      <div class="flex items-center gap-4">
        <div class="relative">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search by name..."
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
        <div class="relative">
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
              v-if="selectedRole || selectedSchool"
              class="bg-slate-500 text-white text-xs px-2 py-1 rounded-full"
            >
              {{ (selectedRole ? 1 : 0) + (selectedSchool ? 1 : 0) }}
            </span>
          </button>

          <!-- Filter Dropdown -->
          <div
            v-if="showFilterMenu"
            class="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border p-4 z-10"
          >
            <!-- Role Filter -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select
                v-model="selectedRole"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                <option value="">All Roles</option>
                <option v-for="role in uniqueRoles" :key="role" :value="role">
                  {{ role }}
                </option>
              </select>
            </div>

            <!-- School Filter -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">School</label>
              <select
                v-model="selectedSchool"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                <option value="">All Schools</option>
                <option v-for="school in uniqueSchools" :key="school" :value="school">
                  {{ school }}
                </option>
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
            <th
              class="px-6 py-3 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider"
            >
              Name
            </th>
            <th
              class="px-6 py-3 text-left text-sm font-medium text-slate-600 uppercase tracking-wider"
            >
              Role
            </th>
            <th
              class="px-6 py-3 text-left text-sm font-medium text-slate-600 uppercase tracking-wider"
            >
              Email
            </th>
            <th
              class="px-6 py-3 text-left text-sm font-medium text-slate-600 uppercase tracking-wider"
            >
              School
            </th>
            <th
              class="px-6 py-3 text-left text-sm font-medium text-slate-600 uppercase tracking-wider"
            >
              Created Date
            </th>
            <th
              class="px-6 py-3 text-left text-sm font-medium text-slate-600 uppercase tracking-wider"
            ></th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <!-- Empty state message -->
          <tr v-if="filteredContacts.length === 0">
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
                <p class="text-xl font-medium text-gray-500">No contacts found</p>
                <p class="text-sm text-gray-400">
                  {{
                    selectedRole || selectedSchool || searchQuery
                      ? 'Try adjusting your filters or search query'
                      : 'Add a contact to get started'
                  }}
                </p>
              </div>
            </td>
          </tr>
          <!-- Table rows for contacts -->
          <tr
            v-else
            v-for="contact in paginatedContacts"
            :key="contact.email"
            class="hover:bg-gray-100"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div
                  class="w-8 h-8 rounded-full bg-gray-500 text-white flex items-center justify-center font-medium"
                >
                  {{ contact.name.charAt(0) }}
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">{{ contact.name }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <span
                :class="{
                  'text-purple-800 font-semibold': contact.role.toLowerCase().includes('teacher'),
                  'text-cyan-400 font-semibold': contact.role.toLowerCase().includes('1st year'),
                  'text-blue-500 font-semibold': contact.role.toLowerCase().includes('2nd year'),
                  'text-indigo-800 font-semibold': contact.role.toLowerCase().includes('3rd year'),
                  'text-red-600 font-semibold': contact.role.toLowerCase().includes('curse'),
                  'text-gray-500 font-semibold':
                    contact.role.toLowerCase().includes('alumnus') ||
                    contact.role.toLowerCase().includes('former'),
                  'text-emerald-600 font-semibold': contact.role.toLowerCase().includes('medical'),
                  'text-amber-600 font-semibold': contact.role.toLowerCase().includes('principal'),
                  'text-gray-300': !contact.role
                    .toLowerCase()
                    .match(
                      /(teacher|instructor|1st year|2nd year|3rd year|curse|alumnus|former|medical|principal)/,
                    ),
                }"
              >
                {{ contact.role }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ contact.email }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <div class="flex items-center gap-2">
                <span v-if="contact.school.includes('Kyoto')" class="text-lg">🎌</span>
                <span v-else-if="contact.school.includes('Tokyo')" class="text-lg">⛩</span>
                {{ contact.school }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ contact.createdDate }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex items-center justify-end gap-2">
                <button
                  @click="editContact(contact)"
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
                  @click="deleteContact(contact)"
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

      <!-- Pagination -->
      <div class="px-6 py-4 bg-white border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-500">
            {{
              filteredContacts.length === 0
                ? 'No results'
                : `Showing ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, filteredContacts.length)} of ${filteredContacts.length} results`
            }}
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="currentPage = Math.max(1, currentPage - 1)"
              :disabled="currentPage === 1"
              :class="[
                'px-3 py-1 rounded-lg border',
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50',
              ]"
            >
              Previous
            </button>
            <div class="flex items-center gap-1">
              <button
                v-for="page in totalPages"
                :key="page"
                @click="currentPage = page"
                :class="[
                  'px-3 py-1 rounded-lg border',
                  currentPage === page
                    ? 'bg-slate-600 text-white border-slate-600'
                    : 'bg-white text-gray-700 hover:bg-gray-50',
                ]"
              >
                {{ page }}
              </button>
            </div>
            <button
              @click="currentPage = Math.min(totalPages, currentPage + 1)"
              :disabled="currentPage === totalPages"
              :class="[
                'px-3 py-1 rounded-lg border',
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50',
              ]"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center"
    >
      <div class="relative bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 class="text-xl font-bold mb-6">{{ isEditing ? 'Edit member' : 'Add new member' }}</h2>
        <form @submit.prevent="addContact">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                v-model="newContact.name"
                required
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                v-model="newContact.role"
                required
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                <option value="">Select Role</option>
                <option v-for="role in uniqueRoles" :key="role" :value="role">
                  {{ role }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                v-model="newContact.email"
                required
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">School</label>
              <select
                v-model="newContact.school"
                required
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                <option value="">Select School</option>
                <option v-for="school in uniqueSchools" :key="school" :value="school">
                  {{ school }}
                </option>
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
        <h2 class="text-xl font-bold mb-4">Delete member</h2>
        <p class="text-gray-600 mb-6">
          Are you sure you want to delete this member? This action cannot be undone.
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
import { ref, computed } from 'vue'

interface Contact {
  name: string
  role: string
  email: string
  school: string
  createdDate: string
}

const contacts = ref<Contact[]>([
  {
    name: 'Yuji Itadori',
    role: '1st Year Student',
    email: 'yuji_itadori@jujutsu.tokyo.ac.jp',
    school: 'Tokyo Jujutsu High',
    createdDate: '2023-06-14',
  },
  {
    name: 'Megumi Fushiguro',
    role: '1st Year Student',
    email: 'megumi_fushiguro@jujutsu.tokyo.ac.jp',
    school: 'Tokyo Jujutsu High',
    createdDate: '2023-06-15',
  },
  {
    name: 'Nobara Kugisaki',
    role: '1st Year Student',
    email: 'nobara_kugisaki@jujutsu.tokyo.ac.jp',
    school: 'Tokyo Jujutsu High',
    createdDate: '2023-07-01',
  },
  {
    name: 'Satoru Gojo',
    role: 'Teacher',
    email: 'satoru_gojo@jujutsu.tokyo.ac.jp',
    school: 'Tokyo Jujutsu High',
    createdDate: '2022-05-28',
  },
  {
    name: 'Ryomen Sukuna',
    role: 'Special Grade Curse',
    email: 'ryomen_sukuna@curse.realm',
    school: '-',
    createdDate: '2023-03-03',
  },
  {
    name: 'Toge Inumaki',
    role: '2nd Year Student',
    email: 'toge_inumaki@jujutsu.tokyo.ac.jp',
    school: 'Tokyo Jujutsu High',
    createdDate: '2023-04-10',
  },
  {
    name: 'Maki Zenin',
    role: '2nd Year Student',
    email: 'maki_zenin@jujutsu.tokyo.ac.jp',
    school: 'Tokyo Jujutsu High',
    createdDate: '2023-04-11',
  },
  {
    name: 'Panda',
    role: '2nd Year Student',
    email: 'panda@jujutsu.tokyo.ac.jp',
    school: 'Tokyo Jujutsu High',
    createdDate: '2023-04-12',
  },
  {
    name: 'Kento Nanami',
    role: 'Alumnus',
    email: 'kento_nanami@jujutsu.tokyo.ac.jp',
    school: 'Tokyo Jujutsu High',
    createdDate: '2022-10-20',
  },
  {
    name: 'Suguru Geto',
    role: 'Former Student',
    email: 'suguru_geto@ex.jujutsu.tokyo.ac.jp',
    school: 'Tokyo Jujutsu High',
    createdDate: '2021-12-12',
  },
  {
    name: 'Shoko Ieiri',
    role: 'Medical Staff',
    email: 'shoko_ieiri@jujutsu.tokyo.ac.jp',
    school: 'Tokyo Jujutsu High',
    createdDate: '2022-11-07',
  },
  {
    name: 'Aoi Todo',
    role: '3rd Year Student',
    email: 'aoi_todo@jujutsu.kyoto.ac.jp',
    school: 'Kyoto Jujutsu High',
    createdDate: '2023-01-08',
  },
  {
    name: 'Mai Zenin',
    role: '2nd Year Student',
    email: 'mai_zenin@jujutsu.kyoto.ac.jp',
    school: 'Kyoto Jujutsu High',
    createdDate: '2023-01-12',
  },
  {
    name: 'Kasumi Miwa',
    role: '2nd Year Student',
    email: 'kasumi_miwa@jujutsu.kyoto.ac.jp',
    school: 'Kyoto Jujutsu High',
    createdDate: '2023-01-20',
  },
  {
    name: 'Noritoshi Kamo',
    role: '2nd Year Student',
    email: 'noritoshi_kamo@jujutsu.kyoto.ac.jp',
    school: 'Kyoto Jujutsu High',
    createdDate: '2023-01-22',
  },
  {
    name: 'Kinji Hakari',
    role: '3rd Year Student',
    email: 'kinji_hakari@jujutsu.tokyo.ac.jp',
    school: 'Tokyo Jujutsu High',
    createdDate: '2023-02-03',
  },
  {
    name: 'Yuta Okkotsu',
    role: '2nd Year Student',
    email: 'yuta_okkotsu@jujutsu.tokyo.ac.jp',
    school: 'Tokyo Jujutsu High',
    createdDate: '2023-02-10',
  },
  {
    name: 'Rika Orimoto',
    role: 'Cursed Spirit',
    email: 'rika_orimoto@curse.realm',
    school: '-',
    createdDate: '2022-09-09',
  },
  {
    name: 'Utahime Iori',
    role: 'Teacher',
    email: 'utahime_iori@jujutsu.kyoto.ac.jp',
    school: 'Kyoto Jujutsu High',
    createdDate: '2022-06-30',
  },
  {
    name: 'Masamichi Yaga',
    role: 'Principal',
    email: 'masamichi_yaga@jujutsu.tokyo.ac.jp',
    school: 'Tokyo Jujutsu High',
    createdDate: '2022-03-15',
  },
])

const showModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const editingContact = ref<Contact | null>(null)
const contactToDelete = ref<Contact | null>(null)

const newContact = ref<Contact>({
  name: '',
  role: '',
  email: '',
  school: '',
  createdDate: new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }),
})

const searchQuery = ref('')
const showFilterMenu = ref(false)
const selectedRole = ref('')
const selectedSchool = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

// Default values for roles and schools
const defaultRoles = [
  '1st Year Student',
  '2nd Year Student',
  '3rd Year Student',
  'Teacher',
  'Principal',
  'Medical Staff',
  'Alumnus',
  'Former Student',
  'Special Grade Curse',
  'Cursed Spirit',
]

const defaultSchools = ['Tokyo Jujutsu High', 'Kyoto Jujutsu High', '-']

// สร้าง unique roles และ schools สำหรับ filter
const uniqueRoles = computed(() => {
  const roles = new Set([...defaultRoles, ...contacts.value.map((contact) => contact.role)])
  return Array.from(roles).sort()
})

const uniqueSchools = computed(() => {
  const schools = new Set([...defaultSchools, ...contacts.value.map((contact) => contact.school)])
  return Array.from(schools).sort()
})

// กรองข้อมูลตาม search query และ filters
const filteredContacts = computed(() => {
  return contacts.value.filter((contact) => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesRole = !selectedRole.value || contact.role === selectedRole.value
    const matchesSchool = !selectedSchool.value || contact.school === selectedSchool.value
    return matchesSearch && matchesRole && matchesSchool
  })
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredContacts.value.length / itemsPerPage)),
)

const paginatedContacts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredContacts.value.slice(start, end)
})

const editContact = (contact: Contact) => {
  editingContact.value = { ...contact }
  isEditing.value = true
  showModal.value = true
  // Set form data for editing
  newContact.value = { ...contact }
}

const deleteContact = (contact: Contact) => {
  contactToDelete.value = contact
  showDeleteModal.value = true
}

const confirmDelete = () => {
  if (contactToDelete.value) {
    const index = contacts.value.findIndex((c) => c.email === contactToDelete.value?.email)
    if (index !== -1) {
      contacts.value.splice(index, 1)
    }
    showDeleteModal.value = false
    contactToDelete.value = null
  }
}

const cancelDelete = () => {
  showDeleteModal.value = false
  contactToDelete.value = null
}

const openModal = () => {
  isEditing.value = false
  editingContact.value = null
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  editingContact.value = null
  // Reset form
  newContact.value = {
    name: '',
    role: '',
    email: '',
    school: '',
    createdDate: new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
  }
}

const addContact = () => {
  if (isEditing.value && editingContact.value) {
    const index = contacts.value.findIndex((c) => c.email === editingContact.value?.email)
    if (index !== -1) {
      contacts.value[index] = { ...newContact.value }
    }
  } else {
    contacts.value.push({ ...newContact.value })
  }
  closeModal()
}

const clearFilters = () => {
  selectedRole.value = ''
  selectedSchool.value = ''
  searchQuery.value = ''
  currentPage.value = 1
}
</script>
