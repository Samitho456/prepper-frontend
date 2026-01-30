<script setup>
import UnitSelector from './UnitSelector.vue'

defineOptions({
  name: 'AddProfileForm',
})

const props = defineProps({
  ingredientId: [Number, null],
  newProfileData: Object,
  availableUnits: Array,
  unitSearchAdd: String,
  showUnitDropdownAdd: Boolean,
  filteredUnitsAdd: Array,
})

const emit = defineEmits([
  'save',
  'cancel',
  'update:newProfileData',
  'update:unitSearch',
  'update:showUnitDropdown',
  'filter-units',
  'add-new-unit',
  'select-unit',
])

const updateNewProfileData = (field, value) => {
  emit('update:newProfileData', { ...props.newProfileData, [field]: value })
}
</script>

<template>
  <div class="ingredient-content add-profile-form">
    <div class="form-title">Add New Nutritional Profile</div>

    <!-- Metrics Input -->
    <div class="metrics-row">
      <div class="metric-item">
        <input
          :value="newProfileData.kcal"
          type="number"
          class="metric-input"
          placeholder="kcal"
          @input="
            updateNewProfileData('kcal', $event.target.value ? Number($event.target.value) : null)
          "
        />
        <span class="metric-label">kcal</span>
      </div>
      <div class="metric-item">
        <input
          :value="newProfileData.protein"
          type="number"
          step="0.1"
          class="metric-input"
          placeholder="protein"
          @input="
            updateNewProfileData(
              'protein',
              $event.target.value ? Number($event.target.value) : null,
            )
          "
        />
        <span class="metric-label">protein (g)</span>
      </div>
      <div class="metric-item">
        <input
          :value="newProfileData.fatTotal"
          type="number"
          step="0.1"
          class="metric-input"
          placeholder="fat"
          @input="
            updateNewProfileData(
              'fatTotal',
              $event.target.value ? Number($event.target.value) : null,
            )
          "
        />
        <span class="metric-label">fat (g)</span>
      </div>
      <div class="metric-item">
        <input
          :value="newProfileData.carbohydrateTotal"
          type="number"
          step="0.1"
          class="metric-input"
          placeholder="carbs"
          @input="
            updateNewProfileData(
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
        <div class="detail-edit">
          <input
            :value="newProfileData.unitAmount"
            type="number"
            class="edit-input"
            placeholder="amount"
            @input="
              updateNewProfileData(
                'unitAmount',
                $event.target.value ? Number($event.target.value) : null,
              )
            "
          />
          <UnitSelector
            :model-value="newProfileData.baseUnit"
            :available-units="availableUnits"
            :search-value="unitSearchAdd"
            :show-dropdown="showUnitDropdownAdd"
            :filtered-units="filteredUnitsAdd"
            @update:modelValue="updateNewProfileData('baseUnit', $event)"
            @update:searchValue="$emit('update:unitSearch', $event)"
            @update:showDropdown="$emit('update:showUnitDropdown', $event)"
            @filter="$emit('filter-units', 'add')"
            @add-new-unit="$emit('add-new-unit', $event)"
            @select="$emit('select-unit', $event)"
          />
        </div>
      </div>
      <div class="detail-item">
        <span class="detail-label">Sugar:</span>
        <input
          :value="newProfileData.carbohydrateSugars"
          type="number"
          step="0.1"
          class="edit-input"
          placeholder="sugar"
          @input="
            updateNewProfileData(
              'carbohydrateSugars',
              $event.target.value ? Number($event.target.value) : null,
            )
          "
        />
      </div>
      <div class="detail-item">
        <span class="detail-label">Fiber:</span>
        <input
          :value="newProfileData.fiber"
          type="number"
          step="0.1"
          class="edit-input"
          placeholder="fiber"
          @input="
            updateNewProfileData('fiber', $event.target.value ? Number($event.target.value) : null)
          "
        />
      </div>
      <div class="detail-item">
        <span class="detail-label">Saturated Fat:</span>
        <input
          :value="newProfileData.fatSaturated"
          type="number"
          step="0.1"
          class="edit-input"
          placeholder="saturated fat"
          @input="
            updateNewProfileData(
              'fatSaturated',
              $event.target.value ? Number($event.target.value) : null,
            )
          "
        />
      </div>
      <div class="detail-item">
        <span class="detail-label">Salt:</span>
        <input
          :value="newProfileData.salt"
          type="number"
          step="0.1"
          class="edit-input"
          placeholder="salt"
          @input="
            updateNewProfileData('salt', $event.target.value ? Number($event.target.value) : null)
          "
        />
      </div>
      <div class="detail-item">
        <span class="detail-label">Energy (kJ):</span>
        <input
          :value="newProfileData.kj"
          type="number"
          step="0.1"
          class="edit-input"
          placeholder="energy"
          @input="
            updateNewProfileData('kj', $event.target.value ? Number($event.target.value) : null)
          "
        />
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="action-buttons">
      <button class="btn-confirm" @click="$emit('save')">Create Profile</button>
      <button class="btn-cancel" @click="$emit('cancel')">Cancel</button>
    </div>
  </div>
</template>

<style scoped>
.ingredient-content {
  padding: 1.5rem;
  background: #f7fafc;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.add-profile-form {
  background: #ffffff;
  border: 2px solid var(--secondary-color);
  border-radius: 12px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.form-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--font-color);
  font-family: var(--heading-font);
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 0.5rem;
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
  border: 1px solid var(--border-color);
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
