<script setup>
import { computed } from 'vue'

defineOptions({
  name: 'UnitSelector',
})

const props = defineProps({
  modelValue: String,
  availableUnits: Array,
  searchValue: String,
  showDropdown: Boolean,
  filteredUnits: Array,
})

const emit = defineEmits([
  'update:modelValue',
  'update:searchValue',
  'update:showDropdown',
  'filter',
  'add-new-unit',
  'select',
])

const handleInputChange = (e) => {
  emit('update:searchValue', e.target.value)
  emit('filter')
}

const handleSelectUnit = (unit) => {
  emit('select', unit)
  emit('update:modelValue', unit)
  emit('update:searchValue', unit)
  emit('update:showDropdown', false)
}

const handleAddNewUnit = () => {
  if (props.searchValue && !props.availableUnits.includes(props.searchValue)) {
    emit('add-new-unit', props.searchValue)
    emit('update:modelValue', props.searchValue)
    emit('update:searchValue', props.searchValue)
    emit('update:showDropdown', false)
  } else if (props.searchValue && props.availableUnits.includes(props.searchValue)) {
    handleSelectUnit(props.searchValue)
  }
}
</script>

<template>
  <div class="unit-search-wrapper">
    <input
      :value="searchValue"
      type="text"
      class="unit-search-input"
      placeholder="Search or add unit"
      @input="handleInputChange"
      @keydown.enter="handleAddNewUnit"
    />
    <div v-if="showDropdown" class="unit-dropdown">
      <div
        v-for="unit in filteredUnits"
        :key="unit"
        class="unit-option"
        @click="handleSelectUnit(unit)"
      >
        {{ unit }}
      </div>
      <div class="unit-option unit-option-add" @click="handleAddNewUnit">
        + Add "{{ searchValue }}"
      </div>
    </div>
  </div>
</template>

<style scoped>
.unit-search-wrapper {
  flex: 0.5;
  position: relative;
}

.unit-search-input {
  width: 100%;
  padding: 0.4rem;
  background: rgba(17, 24, 39, 0.9);
  border: 1px solid rgba(59, 130, 246, 0.5);
  border-radius: 4px;
  color: #d1d5db;
  font-size: 0.9rem;
}

.unit-search-input:focus {
  outline: none;
  border-color: #3b82f6;
  background: rgba(17, 24, 39, 1);
}

.unit-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(17, 24, 39, 0.95);
  border: 1px solid rgba(59, 130, 246, 0.5);
  border-top: none;
  border-radius: 0 0 4px 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
}

.unit-option {
  padding: 0.6rem 0.75rem;
  color: #d1d5db;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
}

.unit-option:hover {
  background: rgba(59, 130, 246, 0.2);
}

.unit-option-add {
  background: rgba(34, 197, 94, 0.1);
  color: #86efac;
  border-top: 1px solid rgba(75, 85, 99, 0.3);
  font-weight: 500;
}

.unit-option-add:hover {
  background: rgba(34, 197, 94, 0.2);
}
</style>
