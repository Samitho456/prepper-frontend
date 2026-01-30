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
  padding: 0.5rem;
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: var(--button-border-radius);
  color: var(--font-color);
  font-size: 0.9rem;
  font-family: var(--body-font);
}

.unit-search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(58, 143, 159, 0.1);
}

.unit-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #ffffff;
  border: 1px solid var(--primary-color);
  border-top: none;
  border-radius: 0 0 var(--button-border-radius) var(--button-border-radius);
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.unit-option {
  padding: 0.6rem 0.75rem;
  color: var(--font-color);
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
  font-family: var(--body-font);
}

.unit-option:hover {
  background: rgba(58, 143, 159, 0.1);
}

.unit-option-add {
  background: rgba(127, 205, 145, 0.1);
  color: var(--secondary-color);
  border-top: 1px solid var(--border-color);
  font-weight: 600;
}

.unit-option-add:hover {
  background: rgba(127, 205, 145, 0.2);
}
</style>
