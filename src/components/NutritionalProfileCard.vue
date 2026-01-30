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
  padding: 1.25rem;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.profile-card:not(:last-child) {
  margin-bottom: 0.5rem;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-color);
}

.profile-number {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--font-color);
  font-family: var(--heading-font);
}

.profile-date {
  font-size: 0.8rem;
  color: var(--secondary-font-color);
}

.profile-actions {
  display: flex;
  gap: 0.5rem;
}

.edit-btn {
  padding: 0.5rem 1rem;
  background: rgba(58, 143, 159, 0.1);
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  border-radius: var(--button-border-radius);
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.2s ease;
  font-family: var(--body-font);
}

.edit-btn:hover {
  background: rgba(58, 143, 159, 0.2);
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
  padding: 1rem;
  background: var(--backgroud-color);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 0.5rem;
  font-family: var(--heading-font);
}

.metric-label {
  font-size: 0.75rem;
  color: var(--secondary-font-color);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
  font-family: var(--body-font);
}

.metric-input {
  width: 100%;
  padding: 0.5rem;
  background: #ffffff;
  border: 1px solid var(--primary-color);
  border-radius: var(--button-border-radius);
  color: var(--font-color);
  font-weight: 600;
  font-size: 1rem;
  text-align: center;
  margin-bottom: 0.5rem;
  font-family: var(--body-font);
}

.metric-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(58, 143, 159, 0.1);
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
  padding: 0.75rem;
  background: var(--backgroud-color);
  border-radius: 8px;
}

.detail-label {
  font-size: 0.75rem;
  color: var(--secondary-font-color);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
  font-family: var(--body-font);
}

.detail-value {
  font-size: 0.95rem;
  color: var(--font-color);
  font-weight: 600;
  font-family: var(--body-font);
}

.detail-edit {
  display: flex;
  gap: 0.5rem;
}

.edit-input {
  flex: 1;
  padding: 0.5rem;
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: var(--button-border-radius);
  color: var(--font-color);
  font-size: 0.9rem;
  font-family: var(--body-font);
}

.edit-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(58, 143, 159, 0.1);
}

.action-buttons {
  display: flex;
  gap: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border-color);
}

.btn-confirm,
.btn-cancel {
  flex: 1;
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: var(--button-border-radius);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: var(--body-font);
}

.btn-confirm {
  background: var(--secondary-color);
  color: #ffffff;
}

.btn-confirm:hover:not(:disabled) {
  background: #6bb57d;
}

.btn-cancel {
  background: #e53e3e;
  color: #ffffff;
}

.btn-cancel:hover:not(:disabled) {
  background: #c53030;
}

.btn-confirm:disabled,
.btn-cancel:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-confirm:active:not(:disabled),
.btn-cancel:active:not(:disabled) {
  transform: scale(0.98);
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
