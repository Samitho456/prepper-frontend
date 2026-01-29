<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const instructions = ref(props.modelValue)

// Watch for external changes to modelValue
watch(
  () => props.modelValue,
  (newVal) => {
    instructions.value = newVal
  },
)

// Update parent when instructions change
watch(
  instructions,
  (newVal) => {
    emit('update:modelValue', newVal)
  },
  { deep: true },
)

const instruction = ref('')

// Editing state for inline instruction edits
const editingInstructionIndex = ref(-1)
const editedInstruction = ref('')

// Drag-and-drop state for instructions
const draggedInstructionIndex = ref(-1)
const dropIndex = ref(-1)

function addInstruction(stepText) {
  const newInstruction = {
    step: instructions.value.length + 1,
    instructionText: String(stepText).trim(),
  }
  instructions.value.push(newInstruction)
  instruction.value = ''
}

function editInstruction(index) {
  const ins = instructions.value[index]
  editedInstruction.value = ins.instructionText
  editingInstructionIndex.value = index
}

function saveEditedInstruction(index) {
  const text = String(editedInstruction.value).trim()
  if (!text) return
  instructions.value[index] = { instructionText: text }
  editingInstructionIndex.value = -1
  editedInstruction.value = ''
}

function cancelInstructionEdit() {
  editingInstructionIndex.value = -1
  editedInstruction.value = ''
}

function onInstructionDragStart(index, event) {
  draggedInstructionIndex.value = index
  try {
    event.dataTransfer && event.dataTransfer.setData('text/plain', '')
  } catch (e) {
    // Ignore error for browsers that do not support setData
    console.warn('Drag start setData error:', e)
  }
}

function onInstructionDragOver(index, event) {
  const el = event.currentTarget
  const rect = el.getBoundingClientRect()
  const offset = event.clientY - rect.top
  const insertAt = offset < rect.height / 2 ? index : index + 1
  dropIndex.value = insertAt
}

function onInstructionDragLeave() {
  dropIndex.value = -1
}

function onInstructionDrop() {
  const from = draggedInstructionIndex.value
  const to = dropIndex.value
  if (from === -1 || to === -1) {
    draggedInstructionIndex.value = -1
    dropIndex.value = -1
    return
  }
  if (from === to || from + 1 === to) {
    // no meaningful move
    draggedInstructionIndex.value = -1
    dropIndex.value = -1
    return
  }
  const moved = instructions.value.splice(from, 1)[0]
  const insertAt = from < to ? to - 1 : to
  instructions.value.splice(insertAt, 0, moved)
  draggedInstructionIndex.value = -1
  dropIndex.value = -1
}

function onInstructionDragEnd() {
  draggedInstructionIndex.value = -1
  dropIndex.value = -1
}

function removeInstruction(index) {
  instructions.value.splice(index, 1)
}
</script>

<template>
  <div class="instruction-section">
    <label for="instructions">Instructions:</label>
    <div v-for="(item, index) in instructions" :key="index">
      <div
        class="draggable-instruction"
        :class="{
          'dragging-item': draggedInstructionIndex === index,
          'show-drop-before': dropIndex === index,
          'show-drop-after': dropIndex === instructions.length && index === instructions.length - 1,
        }"
        draggable="true"
        @dragstart="onInstructionDragStart(index, $event)"
        @dragover.prevent="onInstructionDragOver(index, $event)"
        @dragleave="onInstructionDragLeave"
        @drop="onInstructionDrop"
        @dragend="onInstructionDragEnd"
      >
        <div class="instruction-item">
          <template v-if="editingInstructionIndex === index">
            <textarea
              v-model="editedInstruction"
              placeholder="e.g. Cook spaghetti"
              rows="3"
            ></textarea>
            <button type="button" class="edit-btn" @click="saveEditedInstruction(index)">
              Save
            </button>
            <button type="button" class="remove-instruction-btn" @click="cancelInstructionEdit">
              Cancel
            </button>
          </template>
          <template v-else>
            <p class="added-instruction">Step {{ index + 1 }}: {{ item.instructionText }}</p>
            <button type="button" class="remove-instruction-btn" @click="removeInstruction(index)">
              x
            </button>
            <button type="button" class="edit-btn" @click="editInstruction(index)">edit</button>
          </template>
        </div>
      </div>
    </div>
    <div class="add-instruction-container">
      <textarea
        v-model="instruction"
        id="instruction"
        placeholder="e.g. Cook spaghetti according to package instructions."
        rows="3"
        style="width: 500px"
      ></textarea>
      <button
        type="button"
        :disabled="!instruction || instruction.trim() === ''"
        @click="addInstruction(instruction)"
      >
        Add Instruction
      </button>
    </div>
  </div>
</template>

<style scoped>
.instruction-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.instruction-section label {
  color: var(--font-color);
  font-weight: bold;
}

.add-instruction-container {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-top: 8px;
}

.instruction-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.added-instruction {
  color: var(--font-color);
  margin: 0;
}

.draggable-instruction {
  position: relative;
}

.draggable-instruction.dragging-item {
  opacity: 0.5;
}

.draggable-instruction.show-drop-before::before,
.draggable-instruction.show-drop-after::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #ffc107, #ff9800);
  pointer-events: none;
  border-radius: 2px;
  z-index: 10;
}

.draggable-instruction.show-drop-before::before {
  top: 0;
  transform: translateY(-50%);
}

.draggable-instruction.show-drop-after::after {
  bottom: 0;
  transform: translateY(50%);
}

.remove-instruction-btn {
  padding: 4px 8px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.remove-instruction-btn:hover {
  background-color: #c82333;
}

.edit-btn {
  padding: 4px 8px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.edit-btn:hover {
  background-color: #0056b3;
}

input,
textarea {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  font-family: inherit;
}

textarea {
  resize: vertical;
  min-height: 60px;
}

button {
  padding: 11px 16px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover:not(:disabled) {
  background-color: #218838;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
