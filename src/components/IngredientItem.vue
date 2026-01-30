<script setup>
import NutritionalProfileCard from './NutritionalProfileCard.vue'
import AddProfileForm from './AddProfileForm.vue'

defineOptions({
  name: 'IngredientItem',
})

const props = defineProps({
  ingredient: Object,
  isExpanded: Boolean,
  editingProfile: [Number, null],
  editingData: Object,
  savingProfile: [Number, null],
  addingProfile: [Number, null],
  newProfileData: Object,
  availableUnits: Array,
  unitSearchEdit: String,
  showUnitDropdownEdit: Boolean,
  filteredUnitsEdit: Array,
  unitSearchAdd: String,
  showUnitDropdownAdd: Boolean,
  filteredUnitsAdd: Array,
})

const emit = defineEmits([
  'toggle-expand',
  'start-edit',
  'cancel-edit',
  'save-profile',
  'start-add-profile',
  'cancel-add-profile',
  'save-new-profile',
  'update:unitSearchEdit',
  'update:showUnitDropdownEdit',
  'update:filteredUnitsEdit',
  'update:editingData',
  'update:unitSearchAdd',
  'update:showUnitDropdownAdd',
  'update:filteredUnitsAdd',
  'update:newProfileData',
  'filter-units-edit',
  'filter-units-add',
  'add-new-unit',
])
</script>

<template>
  <div class="ingredient-item">
    <!-- Ingredient Header Row -->
    <div class="ingredient-header-wrapper">
      <div
        class="ingredient-header"
        @click="ingredient.nutritionalProfiles.length > 0 && $emit('toggle-expand')"
      >
        <div class="header-left">
          <span
            v-if="ingredient.nutritionalProfiles.length > 0"
            class="expand-icon"
            :class="{ expanded: isExpanded }"
          >
            ▶
          </span>
          <span v-else class="expand-icon-placeholder"></span>
          <h3 class="ingredient-name">{{ ingredient.name }}</h3>
        </div>
        <div class="header-right">
          <span class="ingredient-id">#{{ ingredient.id }}</span>
          <span v-if="ingredient.nutritionalProfiles.length > 0" class="profile-badge">
            {{ ingredient.nutritionalProfiles.length }} profile{{
              ingredient.nutritionalProfiles.length > 1 ? 's' : ''
            }}
          </span>
          <span v-else class="no-data-badge">No data</span>
        </div>
      </div>
      <button
        class="add-btn"
        @click.stop="$emit('start-add-profile')"
        :disabled="addingProfile === ingredient.id"
      >
        + Add Profile
      </button>
    </div>

    <!-- Expanded Content -->
    <transition name="expand">
      <div v-if="isExpanded" class="ingredient-content">
        <div v-for="(profile, index) in ingredient.nutritionalProfiles" :key="profile.id">
          <NutritionalProfileCard
            :profile="profile"
            :ingredient-id="ingredient.id"
            :is-editing="editingProfile === profile.id"
            :editing-data="editingData"
            :available-units="availableUnits"
            :unit-search-edit="unitSearchEdit"
            :show-unit-dropdown-edit="showUnitDropdownEdit"
            :filtered-units-edit="filteredUnitsEdit"
            :is-saving="savingProfile === profile.id"
            :index="index"
            :has-multiple-profiles="ingredient.nutritionalProfiles.length > 1"
            @start-edit="$emit('start-edit', $event)"
            @save="$emit('save-profile')"
            @cancel-edit="$emit('cancel-edit')"
            @update:unitSearch="$emit('update:unitSearchEdit', $event)"
            @update:showUnitDropdown="$emit('update:showUnitDropdownEdit', $event)"
            @update:editingData="$emit('update:editingData', $event)"
            @filter-units="$emit('filter-units-edit')"
            @add-new-unit="$emit('add-new-unit', $event)"
            @select-unit="$emit('filter-units-edit')"
          />
        </div>
      </div>
    </transition>

    <!-- Add Profile Form -->
    <transition name="expand">
      <AddProfileForm
        v-if="addingProfile === ingredient.id"
        :ingredient-id="ingredient.id"
        :new-profile-data="newProfileData"
        :available-units="availableUnits"
        :unit-search-add="unitSearchAdd"
        :show-unit-dropdown-add="showUnitDropdownAdd"
        :filtered-units-add="filteredUnitsAdd"
        @save="$emit('save-new-profile')"
        @cancel="$emit('cancel-add-profile')"
        @update:newProfileData="$emit('update:newProfileData', $event)"
        @update:unitSearch="$emit('update:unitSearchAdd', $event)"
        @update:showUnitDropdown="$emit('update:showUnitDropdownAdd', $event)"
        @filter-units="$emit('filter-units-add')"
        @add-new-unit="$emit('add-new-unit', $event)"
        @select-unit="$emit('filter-units-add')"
      />
    </transition>
  </div>
</template>

<style scoped>
.ingredient-item {
  border-bottom: 1px solid var(--border-color);
  transition: background-color 0.2s ease;
}

.ingredient-item:last-child {
  border-bottom: none;
}

.ingredient-item:hover .ingredient-header {
  background-color: #f7fafc;
}

/* Ingredient Header Wrapper */
.ingredient-header-wrapper {
  display: flex;
  align-items: stretch;
  gap: 0;
}

.add-btn {
  padding: 1.25rem 1.5rem;
  background: var(--secondary-color);
  color: #ffffff;
  border: none;
  border-left: 1px solid var(--border-color);
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
  transition: all 0.2s ease;
  font-family: var(--body-font);
}

.add-btn:hover:not(:disabled) {
  background: #6bb57d;
}

.add-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.add-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Ingredient Header Row */
.ingredient-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  background: #ffffff;
  cursor: pointer;
  transition: background-color 0.2s ease;
  flex: 1;
}

.ingredient-header:hover {
  background-color: #f7fafc;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.expand-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: var(--primary-color);
  transition: transform 0.3s ease;
  font-size: 12px;
  cursor: pointer;
}

.expand-icon.expanded {
  transform: rotate(90deg);
}

.expand-icon-placeholder {
  display: inline-block;
  width: 24px;
}

.ingredient-name {
  margin: 0;
  font-size: 1.1rem;
  color: var(--font-color);
  font-weight: 600;
  font-family: var(--heading-font);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.ingredient-id {
  background: rgba(58, 143, 159, 0.1);
  color: var(--primary-color);
  padding: 0.35rem 0.75rem;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 600;
}

.profile-badge {
  background: rgba(127, 205, 145, 0.15);
  color: #2f855a;
  padding: 0.35rem 0.75rem;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 600;
}

.no-data-badge {
  background: rgba(113, 128, 150, 0.1);
  color: var(--secondary-font-color);
  padding: 0.35rem 0.75rem;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 600;
}

/* Expanded Content */
.ingredient-content {
  padding: 1.5rem;
  background: #f7fafc;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Transitions */
.expand-enter-active {
  animation: slideDown 0.3s ease-out;
}

.expand-leave-active {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 1;
    transform: translateY(0);
  }

  to {
    opacity: 0;
    transform: translateY(-10px);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .ingredient-header {
    padding: 1rem;
  }

  .ingredient-content {
    padding: 1rem;
  }

  .header-left {
    gap: 0.75rem;
  }

  .ingredient-name {
    font-size: 1rem;
  }

  .header-right {
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .ingredient-id,
  .profile-badge,
  .no-data-badge {
    padding: 0.25rem 0.5rem;
    font-size: 0.7rem;
  }
}
</style>
