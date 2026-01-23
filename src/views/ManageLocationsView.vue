<script setup>
import router from '@/router'
import { useLocationStore } from '@/stores/counter'
import axios from 'axios'
import { ref } from 'vue'
import Vuefeather from 'vue-feather'
import { useToast } from 'vue-toastification'

const toast = useToast()
const locationStore = useLocationStore()

const selectedLocation = ref(null)
const newLocationName = ref('')
const showPopupAlert = ref(false)
async function addLocation() {
  axios
    .post('/api/locations', {
      name: newLocationName.value,
    })
    .then((response) => {
      locationStore.locations.push(response.data)
      newLocationName.value = ''
      toast.success('Location added successfully')
    })
    .catch((error) => {
      console.error('Error adding location:', error)
      toast.error('Error adding location')
    })
}

async function updateLocation() {
  axios
    .put(`/api/locations/${selectedLocation.value}`, {
      name: newLocationName.value,
    })
    .then((response) => {
      const index = locationStore.locations.findIndex((loc) => loc.id === selectedLocation.value)
      if (index !== -1) {
        locationStore.locations[index] = response.data
      }
      selectedLocation.value = null
      newLocationName.value = ''
      toast.success('Location updated successfully')
    })
    .catch((error) => {
      console.error('Error updating location:', error)
      toast.error('Error updating location')
    })
}
async function deleteLocation() {
  axios
    .delete(`/api/locations/${selectedLocation.value}`)
    .then(() => {
      locationStore.locations = locationStore.locations.filter(
        (loc) => loc.id !== selectedLocation.value,
      )
      selectedLocation.value = null
      showPopupAlert.value = false
      toast.success('Location deleted successfully')
    })
    .catch((error) => {
      console.error('Error deleting location:', error)
      toast.error('Error deleting location')
    })
}
</script>

<template>
  <section class="manage-locations-view">
    <button @click="router.go(-1)" class="back-button">
      <vuefeather type="arrow-left" size="30" />
    </button>
    <h1>Manage Locations</h1>
    <table class="data-table">
      <thead>
        <tr>
          <th>Location Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="location in locationStore.locations" :key="location.id">
          <td v-if="selectedLocation === location.id">
            <input type="text" v-model="newLocationName" />
          </td>
          <td v-else>{{ location.name }}</td>
          <td v-if="selectedLocation === location.id">
            <button class="action-button" @click="updateLocation">Save</button>
            <button @click="selectedLocation = null" class="cancel-button">Cancel</button>
          </td>
          <td v-else>
            <!-- Future actions like edit/delete can be added here -->
            <button
              @click="((selectedLocation = location.id), (newLocationName = location.name))"
              class="action-button"
            >
              Edit
            </button>
            <button
              @click="((showPopupAlert = true), (selectedLocation = location.id))"
              class="cancel-button"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
  <!-- Popup 'Are you sure you want to delete this item?' -->
  <div class="popup-alert" v-if="showPopupAlert">
    <div>
      <h3>Delete Location</h3>
      <p>{{ locationStore.locations.find((loc) => loc.id === selectedLocation)?.name }}</p>
    </div>
    <p>Are you sure you want to delete this item?</p>
    <button @click="showPopupAlert = false" class="action-button">Cancel</button>
    <button @click="deleteLocation" class="cancel-button">Delete</button>
  </div>
</template>

<style scoped>
.manage-locations-view {
  padding: 30px;
}
.back-button {
  background: none;
  border: none;
  cursor: pointer;
}
.popup-alert {
  width: 300px;
  height: 200px;
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
