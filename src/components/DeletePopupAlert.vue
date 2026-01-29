<script setup>
defineOptions({
  name: 'DeletePopupAlert',
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
  itemToDelete: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <div class="popup-overlay" @click="emit('cancel')"></div>
  <div class="popup-alert">
    <div>
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
    </div>
    <button @click="emit('cancel')" class="action-button">Cancel</button>
    <button @click="emit('confirm', itemToDelete)" class="cancel-button">Delete</button>
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
