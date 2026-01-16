<script setup>
import UnitSelector from './UnitSelector.vue'

defineOptions({
  name: 'NutritionalProfileCard',
})

const props = defineProps({
  profile: Object,
  ingredientId: [Number, null],
  isEditing: Boolean,
  editingData: Object,
  availableUnits: Array,
  unitSearchEdit: String,
  showUnitDropdownEdit: Boolean,
  filteredUnitsEdit: Array,
  isSaving: Boolean,
  index: Number,
  hasMultipleProfiles: Boolean,
})

const emit = defineEmits([
  'start-edit',
  'save',
  'cancel-edit',
  'update:unitSearch',
  'update:showUnitDropdown',
  'update:editingData',
  'filter-units',
  'add-new-unit',
  'select-unit',
])

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const getProfileColor = (kcal) => {
  if (!kcal) return '#888'
  if (kcal < 50) return '#22c55e'
  if (kcal < 150) return '#f59e0b'
  return '#ef4444'
}

const updateEditingData = (field, value) => {
  emit('update:editingData', { ...props.editingData, [field]: value })
}
</script>

<template>
  <div class="profile-card">
    <!-- Profile Header if Multiple Profiles -->
    <div v-if="hasMultipleProfiles" class="profile-header">
      <span class="profile-number">Profile {{ index + 1 }}</span>
      <span class="profile-date">{{ formatDate(profile.createdAt) }}</span>
    </div>

    <!-- Edit Button -->
    <div class="profile-actions">
      <button v-if="!isEditing" class="edit-btn" @click="$emit('start-edit', profile)">
        ✏️ Edit
      </button>
    </div>

    <!-- Key Metrics -->
    <div class="metrics-row">
      <div class="metric-item">
        <span
          v-if="!isEditing"
          class="metric-value"
          :style="{ color: getProfileColor(profile.kcal) }"
        >
          {{ profile.kcal || '-' }}
        </span>
        <input
          v-else
          :value="editingData.kcal"
          type="number"
          class="metric-input"
          placeholder="kcal"
          @input="
            updateEditingData('kcal', $event.target.value ? Number($event.target.value) : null)
          "
        />
        <span class="metric-label">kcal</span>
      </div>
      <div class="metric-item">
        <span v-if="!isEditing" class="metric-value">
          {{ profile.protein || '-' }}
        </span>
        <input
          v-else
          :value="editingData.protein"
          type="number"
          step="0.1"
          class="metric-input"
          placeholder="protein"
          @input="
            updateEditingData('protein', $event.target.value ? Number($event.target.value) : null)
          "
        />
        <span class="metric-label">protein (g)</span>
      </div>
      <div class="metric-item">
        <span v-if="!isEditing" class="metric-value">
          {{ profile.fatTotal || '-' }}
        </span>
        <input
          v-else
          :value="editingData.fatTotal"
          type="number"
          step="0.1"
          class="metric-input"
          placeholder="fat"
          @input="
            updateEditingData('fatTotal', $event.target.value ? Number($event.target.value) : null)
          "
        />
        <span class="metric-label">fat (g)</span>
      </div>
      <div class="metric-item">
        <span v-if="!isEditing" class="metric-value">
          {{ profile.carbohydrateTotal || '-' }}
        </span>
        <input
          v-else
          :value="editingData.carbohydrateTotal"
          type="number"
          step="0.1"
          class="metric-input"
          placeholder="carbs"
          @input="
            updateEditingData(
              'carbohydrateTotal',
              $event.target.value ? Number($event.target.value) : null,
            )
          "
        />
        <span class="metric-label">carbs (g)</span>
      </div>
    </div>

    <!-- Details Grid -->
    <div class="details-grid">
      <div class="detail-item">
        <span class="detail-label">Portion:</span>
        <span v-if="!isEditing" class="detail-value">
          {{ profile.unitAmount }} {{ profile.baseUnit }}
        </span>
        <div v-else class="detail-edit">
          <input
            :value="editingData.unitAmount"
            type="number"
            class="edit-input"
            placeholder="amount"
            @input="
              updateEditingData(
                'unitAmount',
                $event.target.value ? Number($event.target.value) : null,
              )
            "
          />
          <UnitSelector
            :model-value="editingData.baseUnit"
            :available-units="availableUnits"
            :search-value="unitSearchEdit"
            :show-dropdown="showUnitDropdownEdit"
            :filtered-units="filteredUnitsEdit"
            @update:modelValue="updateEditingData('baseUnit', $event)"
            @update:searchValue="$emit('update:unitSearch', $event)"
            @update:showDropdown="$emit('update:showUnitDropdown', $event)"
            @filter="$emit('filter-units', 'edit')"
            @add-new-unit="$emit('add-new-unit', $event)"
            @select="$emit('select-unit', $event)"
          />
        </div>
      </div>
      <div class="detail-item">
        <span class="detail-label">Sugar:</span>
        <span v-if="!isEditing" class="detail-value">
          {{ profile.carbohydrateSugars || '-' }}
        </span>
        <input
          v-else
          :value="editingData.carbohydrateSugars"
          type="number"
          step="0.1"
          class="edit-input"
          placeholder="sugar"
          @input="
            updateEditingData(
              'carbohydrateSugars',
              $event.target.value ? Number($event.target.value) : null,
            )
          "
        />
      </div>
      <div class="detail-item">
        <span class="detail-label">Fiber:</span>
        <span v-if="!isEditing" class="detail-value">
          {{ profile.fiber || '-' }}
        </span>
        <input
          v-else
          :value="editingData.fiber"
          type="number"
          step="0.1"
          class="edit-input"
          placeholder="fiber"
          @input="
            updateEditingData('fiber', $event.target.value ? Number($event.target.value) : null)
          "
        />
      </div>
      <div class="detail-item">
        <span class="detail-label">Saturated Fat:</span>
        <span v-if="!isEditing" class="detail-value">
          {{ profile.fatSaturated || '-' }}
        </span>
        <input
          v-else
          :value="editingData.fatSaturated"
          type="number"
          step="0.1"
          class="edit-input"
          placeholder="saturated fat"
          @input="
            updateEditingData(
              'fatSaturated',
              $event.target.value ? Number($event.target.value) : null,
            )
          "
        />
      </div>
      <div class="detail-item">
        <span class="detail-label">Salt:</span>
        <span v-if="!isEditing" class="detail-value">
          {{ profile.salt || '-' }}
        </span>
        <input
          v-else
          :value="editingData.salt"
          type="number"
          step="0.1"
          class="edit-input"
          placeholder="salt"
          @input="
            updateEditingData('salt', $event.target.value ? Number($event.target.value) : null)
          "
        />
      </div>
      <div class="detail-item">
        <span class="detail-label">Energy (kJ):</span>
        <span v-if="!isEditing" class="detail-value">
          {{ profile.kj || '-' }}
        </span>
        <input
          v-else
          :value="editingData.kj"
          type="number"
          step="0.1"
          class="edit-input"
          placeholder="energy"
          @input="updateEditingData('kj', $event.target.value ? Number($event.target.value) : null)"
        />
      </div>
    </div>

    <!-- Action Buttons -->
    <div v-if="isEditing" class="action-buttons">
      <button class="btn-confirm" @click="$emit('save')" :disabled="isSaving">
        {{ isSaving ? 'Saving...' : 'Confirm' }}
      </button>
      <button class="btn-cancel" @click="$emit('cancel-edit')" :disabled="isSaving">Cancel</button>
    </div>
  </div>
</template>

<style scoped>
.profile-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: rgba(31, 41, 55, 0.5);
  border-radius: 6px;
  border-left: 3px solid #3b82f6;
}

.profile-card:not(:last-child) {
  margin-bottom: 0.5rem;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(75, 85, 99, 0.3);
}

.profile-number {
  font-size: 0.9rem;
  font-weight: 600;
  color: #d1d5db;
}

.profile-date {
  font-size: 0.8rem;
  color: #9ca3af;
}

.profile-actions {
  display: flex;
  gap: 0.5rem;
}

.edit-btn {
  padding: 0.5rem 1rem;
  background: rgba(59, 130, 246, 0.2);
  color: #93c5fd;
  border: 1px solid rgba(59, 130, 246, 0.5);
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.edit-btn:hover {
  background: rgba(59, 130, 246, 0.3);
  border-color: #3b82f6;
}

.edit-btn:active {
  transform: scale(0.98);
}

/* Metrics Row */
.metrics-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.metric-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0.75rem;
  background: rgba(17, 24, 39, 0.7);
  border-radius: 6px;
}

.metric-value {
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.metric-label {
  font-size: 0.75rem;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-input {
  width: 100%;
  padding: 0.5rem;
  background: rgba(17, 24, 39, 0.9);
  border: 1px solid rgba(59, 130, 246, 0.5);
  border-radius: 4px;
  color: #d1d5db;
  font-weight: 700;
  font-size: 1rem;
  text-align: center;
  margin-bottom: 0.5rem;
}

.metric-input:focus {
  outline: none;
  border-color: #3b82f6;
  background: rgba(17, 24, 39, 1);
}

/* Details Grid */
.details-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.5rem;
  background: rgba(17, 24, 39, 0.7);
  border-radius: 4px;
}

.detail-label {
  font-size: 0.75rem;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
}

.detail-value {
  font-size: 0.95rem;
  color: #d1d5db;
  font-weight: 600;
}

.detail-edit {
  display: flex;
  gap: 0.5rem;
}

.edit-input {
  flex: 1;
  padding: 0.4rem;
  background: rgba(17, 24, 39, 0.9);
  border: 1px solid rgba(59, 130, 246, 0.5);
  border-radius: 4px;
  color: #d1d5db;
  font-size: 0.9rem;
}

.edit-input:focus {
  outline: none;
  border-color: #3b82f6;
  background: rgba(17, 24, 39, 1);
}

.action-buttons {
  display: flex;
  gap: 0.75rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(75, 85, 99, 0.3);
}

.btn-confirm,
.btn-cancel {
  flex: 1;
  padding: 0.7rem 1.25rem;
  border: none;
  border-radius: 4px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-confirm {
  background: rgba(34, 197, 94, 0.2);
  color: #86efac;
  border: 1px solid rgba(34, 197, 94, 0.5);
}

.btn-confirm:hover:not(:disabled) {
  background: rgba(34, 197, 94, 0.3);
  border-color: #22c55e;
}

.btn-cancel {
  background: rgba(239, 68, 68, 0.2);
  color: #fca5a5;
  border: 1px solid rgba(239, 68, 68, 0.5);
}

.btn-cancel:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.3);
  border-color: #ef4444;
}

.btn-confirm:disabled,
.btn-cancel:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive Design */
@media (max-width: 768px) {
  .metrics-row {
    grid-template-columns: repeat(2, 1fr);
  }

  .details-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .metrics-row {
    grid-template-columns: 1fr;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }
}
</style>
