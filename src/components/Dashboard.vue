<template>
  <div class="min-h-screen bg-gradient-to-br from-[#032D42] via-[#0a4a5c] to-[#032D42] text-white relative overflow-hidden">
    <!-- Profile Dropdown (kanan atas) -->
    <div class="absolute top-6 right-8 z-30">
      <div class="relative">
        <button
          @click="toggleProfileDropdown"
          class="flex items-center space-x-3 bg-[#0a4a5c] hover:bg-[#00AAFF]/80 px-4 py-2 rounded-full shadow transition focus:outline-none"
        >
          <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#2EB67D] text-white font-bold text-lg uppercase">
            {{ userInitials }}
          </span>
          <span class="font-medium text-white">{{ userName || 'User' }}</span>
          <svg :class="['w-4 h-4 transition-transform', showProfileDropdown ? 'rotate-180' : '']" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>
        <transition name="fade">
          <div
            v-if="showProfileDropdown"
            class="absolute right-0 mt-2 w-40 bg-[#032D42] border border-[#00AAFF]/30 rounded-lg shadow-lg py-2 z-40"
          >
            <div class="px-4 py-2 text-gray-300 text-sm border-b border-[#00AAFF]/10">
              Signed in as<br>
              <span class="font-semibold text-white">{{ userName || 'User' }}</span><br>
              <span class="text-xs text-gray-400">{{ userEmail }}</span>
            </div>
            <button
              @click="logout"
              class="w-full text-left px-4 py-2 text-red-400 hover:bg-[#0a4a5c] hover:text-red-300 transition-colors duration-150"
            >
              Logout
            </button>
          </div>
        </transition>
      </div>
    </div>
    <!-- Background decorative elements -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute top-20 left-10 w-32 h-32 bg-[#00AAFF] rounded-lg transform rotate-12"></div>
      <div class="absolute bottom-20 right-10 w-24 h-24 bg-[#2EB67D] rounded-lg transform -rotate-12"></div>
      <div class="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-lg transform rotate-45"></div>
      <div class="absolute top-1/3 right-1/3 w-20 h-20 bg-[#00AAFF] rounded-lg transform -rotate-45"></div>
    </div>

    <div class="relative z-10 container mx-auto px-6 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-2">Daily Intern Tasks</h1>
        <p class="text-gray-300 text-lg">Stay organized with tasks, your way.</p>
      </div>

      <!-- Navigation Tabs + New Task Button -->
      <div class="mb-8 flex items-center space-x-2">
        <div class="flex space-x-1 bg-[#032D42]/50 p-1 rounded-lg w-fit">
          <button
            @click="activeTab = 'all'"
            :class="[
              'px-6 py-2 rounded-md font-medium transition-all duration-200',
              activeTab === 'all' 
                ? 'bg-[#00AAFF] text-white shadow-lg' 
                : 'text-gray-400 hover:text-white hover:bg-[#032D42]/30'
            ]"
          >
            All Tasks
          </button>
        </div>
        <button
          @click="showAddTaskModal = true"
          class="flex items-center space-x-2 text-[#2EB67D] hover:text-[#2EB67D]/80 transition-colors duration-200 group px-4 py-2 rounded-md font-medium bg-[#032D42]/50 border border-[#2EB67D]/30"
        >
          <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          <span>New Task</span>
        </button>
      </div>

      <!-- Tasks Table -->
      <div class="bg-[#032D42]/80 backdrop-blur-sm border border-[#00AAFF]/30 rounded-2xl overflow-hidden shadow-2xl">
        <!-- Table Header -->
        <div class="bg-[#032D42]/60 px-2 md:px-6 py-4 border-b border-[#00AAFF]/20">
          <div class="grid grid-cols-16 gap-2 text-base font-medium text-gray-300 uppercase tracking-wider">
            <div class="col-span-1 text-center">No</div>
            <div class="col-span-3">Task title</div>
            <div class="col-span-2 text-center">Status</div>
            <div class="col-span-2 text-center">Due date</div>
            <div class="col-span-2 text-center">Priority</div>
            <div class="col-span-5">Description</div>
            <div class="col-span-1"></div>
          </div>
        </div>

        <!-- Table Body -->
        <div class="divide-y divide-[#00AAFF]/10">
          <div
            v-for="(task, idx) in paginatedTasks"
            :key="task.id"
            class="px-4 py-3 hover:bg-[#0a4a5c]/30 transition-colors duration-200"
          >
            <div class="grid grid-cols-16 gap-2 items-center text-base">
              <!-- Index -->
              <div class="col-span-1 text-center font-semibold">{{ idx + 1 }}</div>
              <!-- Task title -->
              <div class="col-span-3">
                <div v-if="editingTaskId === task.id && editingField === 'title'">
                  <!-- Use textarea for wrapping input -->
                  <textarea
                    v-model="editTask.title"
                    ref="titleTextarea"
                    rows="1"
                    class="bg-[#0a4a5c] text-white border border-[#00AAFF]/40 rounded px-2 py-1 w-full text-base resize-none"
                    style="min-width: 0; white-space: pre-line; word-break: break-word; overflow:hidden;"
                    @blur="saveEditTask(task.id)"
                    @keydown.enter.prevent="saveEditTask(task.id)"
                    @input="autoResizeTitle"
                    autofocus
                  ></textarea>
                </div>
                <div
                  v-else
                  class="text-white font-medium text-start cursor-pointer break-words whitespace-pre-line"
                  :title="task.title"
                  @click="startInlineEdit(task, 'title')"
                  tabindex="0"
                  @keydown.enter.prevent="startInlineEdit(task, 'title')"
                  style="white-space: pre-line; word-break: break-word;"
                >{{ task.title || '-' }}</div>
              </div>

              <!-- Status -->
              <div class="col-span-2 min-w-0 flex justify-center">
                <div v-if="editingTaskId === task.id && editingField === 'status'" class="w-full">
                  <select
                    v-model="editTask.status"
                    @blur="saveEditTask(task.id)"
                    @change="saveEditTask(task.id)"
                    class="bg-[#0a4a5c] text-white border border-[#00AAFF]/40 rounded px-2 py-1 w-full text-base"
                    style="appearance: none; min-width: 0;"
                    autofocus
                  >
                    <option class="bg-[#0a4a5c] text-white" value="Not Started">Not Started</option>
                    <option class="bg-[#0a4a5c] text-white" value="In Progress">In Progress</option>
                    <option class="bg-[#0a4a5c] text-white" value="Done">Done</option>
                  </select>
                </div>
                <div
                  v-else
                  class="cursor-pointer w-full flex justify-center"
                  :title="task.status"
                  @click="startInlineEdit(task, 'status')"
                  tabindex="0"
                  @keydown.enter.prevent="startInlineEdit(task, 'status')"
                >
                  <span
                    :class="[
                      'inline-block px-2 py-1 rounded text-base',
                      task.status === 'Done' ? 'bg-green-700 text-white' : '',
                      task.status === 'In Progress' ? 'bg-blue-500 text-white' : '',
                      task.status === 'Not Started' ? 'bg-gray-600 text-white' : '',
                    ]"
                    style="min-width: 60px; text-align: center;"
                  >
                    {{ task.status }}
                  </span>
                </div>
              </div>

              <!-- Due Date -->
              <div class="col-span-2 min-w-0 flex justify-center">
                <div v-if="editingTaskId === task.id && editingField === 'date'" class="w-full">
                  <input
                    v-model="editTask.date"
                    type="date"
                    class="bg-[#0a4a5c] text-white border border-[#00AAFF]/40 rounded px-2 py-1 w-full text-base"
                    style="min-width: 0;"
                    @blur="saveEditTask(task.id)"
                    @keydown.enter.prevent="saveEditTask(task.id)"
                    autofocus
                  />
                </div>
                <div
                  v-else
                  class="text-gray-300 cursor-pointer w-full text-center text-base"
                  :title="task.date"
                  @click="startInlineEdit(task, 'date')"
                  tabindex="0"
                  @keydown.enter.prevent="startInlineEdit(task, 'date')"
                  style="white-space: pre-line; word-break: break-word;"
                >
                  {{ task.date || '-' }}
                </div>
              </div>

              <!-- Priority -->
              <div class="col-span-2 min-w-0 flex items-center justify-center">
                <div v-if="editingTaskId === task.id && editingField === 'priority'" class="w-full">
                  <select
                    v-model="editTask.priority"
                    @blur="saveEditTask(task.id)"
                    @change="saveEditTask(task.id)"
                    class="bg-[#0a4a5c] text-white border border-[#00AAFF]/40 rounded px-2 py-1 w-full text-base"
                    style="appearance: none; min-width: 0;"
                    autofocus
                  >
                    <option class="bg-[#0a4a5c] text-white" value="">Select priority</option>
                    <option class="bg-[#0a4a5c] text-white" value="Low">Low</option>
                    <option class="bg-[#0a4a5c] text-white" value="Medium">Medium</option>
                    <option class="bg-[#0a4a5c] text-white" value="High">High</option>
                  </select>
                </div>
                <span
                  v-else
                  :class="[
                    'inline-block px-2 py-1 rounded text-base font-medium break-words',
                    task.priority === 'High' ? 'bg-red-700 text-white' : '',
                    task.priority === 'Medium' ? 'bg-yellow-600 text-white' : '',
                    task.priority === 'Low' ? 'bg-green-700 text-white' : '',
                  ]"
                  style="min-width: 60px; text-align: center; white-space: normal; word-break: break-word;"
                  :title="task.priority"
                  @click="startInlineEdit(task, 'priority')"
                  tabindex="0"
                  @keydown.enter.prevent="startInlineEdit(task, 'priority')"
                >
                  {{ task.priority || '-' }}
                </span>
              </div>

              <!-- Description -->
              <div class="col-span-5 min-w-0 flex items-center">
                <div v-if="editingTaskId === task.id && editingField === 'description'" class="flex-1">
                  <textarea
                    v-model="editTask.description"
                    rows="2"
                    class="w-full bg-[#0a4a5c] text-white border border-[#00AAFF]/40 rounded px-2 py-1 text-base resize-none"
                    style="min-width: 0; white-space: normal; word-break: break-word;"
                    @blur="saveEditTask(task.id)"
                    @keydown.enter.prevent="saveEditTask(task.id)"
                    autofocus
                  ></textarea>
                </div>
                <span
                  v-else
                  class="text-gray-300 text-base flex-1 cursor-pointer break-words whitespace-pre-line"
                  :title="task.description"
                  @click="startInlineEdit(task, 'description')"
                  tabindex="0"
                  @keydown.enter.prevent="startInlineEdit(task, 'description')"
                  style="white-space: pre-line; word-break: break-word;"
                >{{ task.description || '-' }}</span>
              </div>

              <!-- Delete Action -->
              <div class="col-span-1 flex justify-center items-center">
                <button
                  @click="openDeleteModal(task.id)"
                  class="ml-4 text-red-400 hover:text-red-200 transition-colors duration-200 opacity-80 hover:opacity-100"
                  title="Delete"
                  tabindex="0"
                >
                  <!-- Trash icon SVG (Font Awesome style) -->
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 md:h-6 md:w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H20.25v13A2.25 2.25 0 0 1 18 22.5H6A2.25 2.25 0 0 1 3.75 20.5v-13H3.75A.75.75 0 0 1 3 6.75zm2.25 1.5v12.25c0 .414.336.75.75.75h12a.75.75 0 0 0 .75-.75V8.25H5.25zm3.75 2.25a.75.75 0 0 1 1.5 0v7.5a.75.75 0 0 1-1.5 0v-7.5zm4.5 0a.75.75 0 0 1 1.5 0v7.5a.75.75 0 0 1-1.5 0v-7.5zM9.75 3.75A.75.75 0 0 1 10.5 3h3a.75.75 0 0 1 .75.75V4.5h5.25a.75.75 0 0 1 0 1.5H4.5a.75.75 0 0 1 0-1.5H9.75V3.75z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination Controls -->
        <div v-if="totalPages > 1" class="flex justify-center items-center py-4 space-x-2 bg-[#032D42]/60 border-t border-[#00AAFF]/20">
          <button
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-1 rounded bg-[#0a4a5c] text-white hover:bg-[#00AAFF]/80 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Prev
          </button>
          <button
            v-for="page in totalPages"
            :key="page"
            @click="goToPage(page)"
            :class="[
              'px-3 py-1 rounded',
              currentPage === page
                ? 'bg-[#00AAFF] text-white font-bold'
                : 'bg-[#0a4a5c] text-white hover:bg-[#00AAFF]/80'
            ]"
          >
            {{ page }}
          </button>
          <button
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 rounded bg-[#0a4a5c] text-white hover:bg-[#00AAFF]/80 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      <!-- Add Task Modal -->
      <transition name="fade">
        <div v-if="showAddTaskModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div class="bg-[#032D42] rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-8 relative border border-[#00AAFF]/30">
            <button
              @click="closeAddTaskModal"
              class="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
              title="Close"
            >&times;</button>
            <h2 class="text-2xl font-bold mb-4 text-white flex items-center">
              <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
              </svg>
              Add New Task
            </h2>
            <form @submit.prevent="addNewTask" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Task title</label>
                  <!-- Use textarea for wrapping input -->
                  <textarea
                    v-model="newTask.title"
                    ref="addTitleTextarea"
                    required
                    placeholder="Enter task title"
                    class="w-full bg-[#032D42]/50 border border-[#2EB67D]/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00AAFF] focus:border-transparent transition-all duration-200 resize-none"
                    maxlength="100"
                    rows="1"
                    style="white-space: pre-line; word-break: break-word; overflow:hidden;"
                    @input="autoResizeAddTitle"
                  ></textarea>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Due Date</label>
                  <input
                    v-model="newTask.date"
                    type="date"
                    class="w-full bg-[#032D42]/50 border border-[#2EB67D]/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#00AAFF] focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                  <select
                    v-model="newTask.priority"
                    class="w-full bg-[#0a4a5c] border border-[#2EB67D]/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#2EB67D] focus:border-[#2EB67D] transition-all duration-200"
                    style="appearance: none;"
                  >
                    <option class="bg-[#0a4a5c] text-white" value="">Select priority</option>
                    <option class="bg-[#0a4a5c] text-white" value="Low">Low</option>
                    <option class="bg-[#0a4a5c] text-white"  value="Medium">Medium</option>
                    <option class="bg-[#0a4a5c] text-white"  value="High">High</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <select
                    v-model="newTask.status"
                    class="w-full bg-[#0a4a5c] border border-[#2EB67D]/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#00AAFF] focus:border-[#00AAFF] transition-all duration-200"
                    style="appearance: none;"
                  >
                    <option class="bg-[#0a4a5c] text-white" value="Not Started">Not Started</option>
                    <option class="bg-[#0a4a5c] text-white" value="In Progress">In Progress</option>
                    <option class="bg-[#0a4a5c] text-white" value="Done">Done</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  v-model="newTask.description"
                  rows="3"
                  placeholder="Enter task description"
                  class="w-full bg-[#032D42]/50 border border-[#2EB67D]/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00AAFF] focus:border-transparent transition-all duration-200 resize-none"
                  maxlength="200"
                  style="white-space: normal; word-break: break-word;"
                ></textarea>
              </div>

              <div class="flex justify-end space-x-3">
                <button
                  type="button"
                  @click="closeAddTaskModal"
                  class="px-6 py-2 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="px-6 py-2 bg-[#2EB67D] text-white rounded-lg hover:bg-[#2EB67D]/80 transition-all duration-200 font-medium"
                >
                  Add Task
                </button>
              </div>
              <div v-if="formError" class="text-red-400 text-sm mt-2">{{ formError }}</div>
            </form>
          </div>
        </div>
      </transition>

      <!-- Delete Confirmation Modal -->
      <transition name="fade">
        <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div class="bg-[#032D42] rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-8 relative border border-[#00AAFF]/30">
            <button
              @click="closeDeleteModal"
              class="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
              title="Close"
            >&times;</button>
            <div class="flex flex-col items-center">
              <svg class="w-12 h-12 text-red-400 mb-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              <h2 class="text-xl font-bold mb-2 text-white">Delete Task</h2>
              <p class="text-gray-300 mb-6 text-center">Are you sure you want to delete this task?</p>
              <div class="flex space-x-4">
                <button
                  @click="closeDeleteModal"
                  class="px-6 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-500 transition"
                >Cancel</button>
                <button
                  @click="confirmDeleteTask"
                  class="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500 transition"
                >Delete</button>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00AAFF]"></div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && filteredTasks.length === 0" class="text-center py-12">
        <p class="text-gray-400 text-lg font-medium">No tasks found</p>
        <p class="text-gray-500 mt-2">Add a new task to get started!</p>
      </div>
      <div v-if="apiError" class="text-center text-red-400 mt-4">
        {{ apiError }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { getTasks, createTask, updateTask, deleteTask, getMe } from '../api.js'

const router = useRouter()

const activeTab = ref('all')
const loading = ref(false)
const showAddTaskForm = ref(false) // legacy, not used anymore
const showAddTaskModal = ref(false)
const showDeleteModal = ref(false)
const deleteTaskId = ref(null)
const tasks = ref([])

const formError = ref('')
const apiError = ref('')

const newTask = ref({
  title: '',
  status: 'Not Started',
  date: '',
  priority: '',
  description: ''
})

const editingTaskId = ref(null)
const editingField = ref('')
const editTask = ref({})

// Refs for auto-resize textareas
const titleTextarea = ref(null)
const addTitleTextarea = ref(null)

const currentPage = ref(1)
const pageSize = ref(5) // Number of tasks per page

const userName = ref('')
const userEmail = ref('')
const userId = ref('')

// Sort tasks by createdAt (or id if createdAt not available) descending
const filteredTasks = computed(() => {
  let arr = tasks.value.slice()
  // Sort by createdAt desc, fallback to id desc if no createdAt
  arr.sort((a, b) => {
    if (a.createdAt && b.createdAt) {
      return new Date(b.createdAt) - new Date(a.createdAt)
    } else if (a.id && b.id) {
      // fallback: assume id is numeric or string that can be compared
      if (!isNaN(Number(b.id)) && !isNaN(Number(a.id))) {
        return Number(b.id) - Number(a.id)
      }
      return String(b.id).localeCompare(String(a.id))
    }
    return 0
  })
  if (activeTab.value === 'all') {
    return arr
  }
  // Filtering for 'my' tasks can be added here if needed
  return arr
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredTasks.value.length / pageSize.value))
})

const paginatedTasks = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredTasks.value.slice(start, start + pageSize.value)
})

function goToPage(page) {
  if (page < 1) page = 1
  if (page > totalPages.value) page = totalPages.value
  currentPage.value = page
}

// --- Profile Dropdown & User Name Logic ---
const showProfileDropdown = ref(false)
const userInitials = computed(() => {
  if (!userName.value) return 'U'
  const parts = userName.value.split(' ')
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || 'U'
  return (parts[0][0] + (parts[1][0] || '')).toUpperCase()
})

function toggleProfileDropdown() {
  showProfileDropdown.value = !showProfileDropdown.value
}
function closeProfileDropdown(e) {
  // Close dropdown if click outside
  if (!e.target.closest('.absolute.top-6.right-8')) {
    showProfileDropdown.value = false
  }
}
onMounted(() => {
  document.addEventListener('click', closeProfileDropdown)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', closeProfileDropdown)
})

async function fetchUserProfile() {
  const token = localStorage.getItem('token')
  if (!token) return
  try {
    // Decode userId from JWT
    const payload = JSON.parse(atob(token.split('.')[1]))
    userId.value = payload.id || payload.userId || ''
    // Fetch user data from /auth/me
    const user = await getMe(token)
    userName.value = user.name || user.username || user.email || 'User'
    userEmail.value = user.email || ''
  } catch (e) {
    userName.value = 'User'
    userEmail.value = ''
  }
}

const fetchTasks = async () => {
  loading.value = true
  apiError.value = ''
  try {
    const token = localStorage.getItem('token')
    let data
    try {
      data = await getTasks(token)
    } catch (err) {
      if (typeof err === 'object' && err !== null && err.message && err.message.includes('Unexpected token <')) {
        apiError.value = 'Server returned invalid JSON. Please check your API endpoint.'
        tasks.value = []
        return
      } else {
        throw err
      }
    }
    if (Array.isArray(data)) {
      tasks.value = data
    } else if (data && Array.isArray(data.tasks)) {
      tasks.value = data.tasks
    } else if (data && typeof data === 'object') {
      tasks.value = [data]
    } else {
      tasks.value = []
    }
    // Reset to first page if tasks change
    currentPage.value = 1
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      error.message &&
      (error.message.includes('Unexpected token <') || error.message.includes('is not valid JSON'))
    ) {
      apiError.value = 'API response is not valid JSON. Please check your backend.'
    } else {
      apiError.value = error?.message || 'Error fetching tasks'
    }
    tasks.value = []
  } finally {
    loading.value = false
  }
}

const validPriorities = ['Low', 'Medium', 'High']
const validStatuses = ['Not Started', 'In Progress', 'Done']

const addNewTask = async () => {
  formError.value = ''
  apiError.value = ''
  if (!newTask.value.title.trim()) {
    formError.value = 'Title is required'
    return
  }
  if (newTask.value.priority && !validPriorities.includes(newTask.value.priority)) {
    formError.value = 'Priority must be Low, Medium, or High'
    return
  }
  if (newTask.value.status && !validStatuses.includes(newTask.value.status)) {
    formError.value = 'Status must be Not Started, In Progress, or Done'
    return
  }
  if (newTask.value.date && !/^\d{4}-\d{2}-\d{2}$/.test(newTask.value.date)) {
    formError.value = 'Date must be in YYYY-MM-DD format'
    return
  }
  const payload = {
    title: newTask.value.title,
    description: newTask.value.description || undefined,
    date: newTask.value.date || undefined,
    priority: newTask.value.priority || undefined,
    status: newTask.value.status || undefined
  }
  try {
    const token = localStorage.getItem('token')
    let created
    try {
      created = await createTask(payload, token)
    } catch (err) {
      if (typeof err === 'object' && err !== null && err.message && err.message.includes('Unexpected token <')) {
        apiError.value = 'Server returned invalid JSON. Please check your API endpoint.'
        return
      } else {
        throw err
      }
    }
    await fetchTasks()
    // Setelah fetchTasks, currentPage sudah direset ke 1 (lihat fetchTasks)
    // Tidak perlu set currentPage lagi di sini
    closeAddTaskModal()
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      error.message &&
      (error.message.includes('Unexpected token <') || error.message.includes('is not valid JSON'))
    ) {
      apiError.value = 'API response is not valid JSON. Please check your backend.'
    } else {
      apiError.value = error?.message || 'Error adding task'
    }
  }
}

const cancelAddTask = () => {
  showAddTaskForm.value = false
  formError.value = ''
  newTask.value = {
    title: '',
    status: 'Not Started',
    date: '',
    priority: '',
    description: ''
  }
}
function closeAddTaskModal() {
  showAddTaskModal.value = false
  formError.value = ''
  newTask.value = {
    title: '',
    status: 'Not Started',
    date: '',
    priority: '',
    description: ''
  }
}

// Delete modal logic
function openDeleteModal(id) {
  deleteTaskId.value = id
  showDeleteModal.value = true
}
function closeDeleteModal() {
  showDeleteModal.value = false
  deleteTaskId.value = null
}
async function confirmDeleteTask() {
  if (!deleteTaskId.value) return
  try {
    const token = localStorage.getItem('token')
    await deleteTask(deleteTaskId.value, token)
    await fetchTasks()
    closeDeleteModal()
  } catch (e) {
    apiError.value = e?.message || 'Failed to delete task'
    closeDeleteModal()
  }
}

// Auto-resize for edit title textarea
function autoResizeTitle(e) {
  let el = e?.target || titleTextarea.value
  if (el) {
    el.style.height = 'auto'
    el.style.height = (el.scrollHeight) + 'px'
  }
}
function autoResizeAddTitle(e) {
  let el = e?.target || addTitleTextarea.value
  if (el) {
    el.style.height = 'auto'
    el.style.height = (el.scrollHeight) + 'px'
  }
}

function checkAuth() {
  if (!localStorage.getItem('token')) {
    router.replace('/')
  }
}

function logout() {
  localStorage.removeItem('token')
  router.replace('/')
}

// Inline edit logic for title, status, date, priority, and description
function startInlineEdit(task, field) {
  editingTaskId.value = task.id
  editingField.value = field
  editTask.value = { ...task }
  nextTick(() => {
    // Try to focus the input/select/textarea after rendering
    let selector = null
    if (field === 'status') {
      selector = `select[autofocus]`
    } else if (field === 'date') {
      selector = `input[type="date"][autofocus]`
    } else if (field === 'title') {
      selector = `textarea[autofocus]`
    } else if (field === 'description') {
      selector = `textarea[autofocus]`
    } else if (field === 'priority') {
      selector = `select[autofocus]`
    }
    if (selector) {
      const el = document.querySelector(selector)
      if (el) {
        el.focus()
        // auto-resize for title textarea
        if (field === 'title') {
          el.style.height = 'auto'
          el.style.height = (el.scrollHeight) + 'px'
        }
      }
    }
  })
}

async function saveEditTask(id) {
  if (!editingTaskId.value) return
  try {
    const token = localStorage.getItem('token')
    // Only update the field being edited
    const payload = { [editingField.value]: editTask.value[editingField.value] }
    await updateTask(id, payload, token)
    editingTaskId.value = null
    editingField.value = ''
    editTask.value = {}
    await fetchTasks()
  } catch (e) {
    apiError.value = e?.message || 'Failed to update task'
    editingTaskId.value = null
    editingField.value = ''
    editTask.value = {}
  }
}

onMounted(() => {
  checkAuth()
  fetchUserProfile()
  fetchTasks()
  // Auto-resize for add task title textarea if already has value
  nextTick(() => {
    if (addTitleTextarea.value) {
      addTitleTextarea.value.style.height = 'auto'
      addTitleTextarea.value.style.height = (addTitleTextarea.value.scrollHeight) + 'px'
    }
  })
})
</script>