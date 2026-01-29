<script setup>
import { ref } from 'vue'

defineOptions({
  name: 'ChooseAndConfirmPopupAlert',
})

defineProps({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  itemSelectLabel: {
    type: String,
    required: true,
  },
  selectionItems: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['confirm', 'cancel'])
const selectedItem = ref(null)
</script>

<template>
  <div class="popup-overlay" @click="emit('cancel')"></div>
  <div class="popup-alert">
    <form @submit.prevent="emit('confirm', selectedItem)">
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
      <div v-if="selectionItems && selectionItems.length > 0">
        <label for="item-select">{{ itemSelectLabel }}</label>
        <select id="item-select" v-model="selectedItem" name="item-select" required>
          <option v-for="item in selectionItems" :key="item.id" :value="item">
            {{ item.name || item.title }}
          </option>
        </select>
      </div>
      <button type="submit" class="action-button">Add</button>
      <button type="button" @click="emit('cancel')" class="cancel-button">Cancel</button>
    </form>
  </div>
</template>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.63);
  z-index: 1999;
}

.popup-alert {
  width: 400px;
  height: 300px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--content-card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--container-border-radius);
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 2000;
}

.popup-alert select {
  width: 100%;
  margin-bottom: 10px;
  padding: 4px 8px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
}

.popup-alert div {
  margin-bottom: 10px;
}
.popup-alert button {
  margin-right: 10px;
}
</style>
