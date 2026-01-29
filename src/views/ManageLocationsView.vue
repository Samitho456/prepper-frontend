<script setup>
import router from '@/router'
import { useLocationStore } from '@/stores/counter'
import axios from 'axios'
import { onMounted, ref } from 'vue'
import Vuefeather from 'vue-feather'
import { useToast } from 'vue-toastification'

const toast = useToast()
const locationStore = useLocationStore()

const selectedLocation = ref(null)
const newLocationName = ref('')
const showAddLocation = ref(false)
const showPopupAlert = ref(false)
async function addLocation() {
  axios
    .post('/api/locations', {
      name: newLocationName.value,
    })
    .then((response) => {
      locationStore.locations.push(response.data)
      newLocationName.value = ''
      showAddLocation.value = false
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

onMounted(() => {
  document.title = 'Prepper - Manage Locations'
  if (locationStore.locations.length === 0) {
    axios
      .get('/api/locations')
      .then((response) => {
        locationStore.setLocations(response.data)
      })
      .catch((error) => {
        console.error('Error fetching locations:', error)
      })
  }
})
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
            <input class="input-field" type="text" v-model="newLocationName" />
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
        <tr>
          <td v-if="showAddLocation">
            <input type="text" v-model="newLocationName" placeholder="New location name" />
          </td>
          <td v-if="showAddLocation">
            <button @click="addLocation" class="action-button">Add Location</button>
            <button
              @click="((showAddLocation = false), (newLocationName = ''))"
              class="cancel-button"
            >
              Cancel
            </button>
          </td>
          <td v-else colspan="2">
            <button @click="showAddLocation = true" class="action-button">Add New Location</button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
  <!-- Popup 'Are you sure you want to delete this item?' -->
  <div class="popup-overlay" v-if="showPopupAlert" @click="showPopupAlert = false"></div>
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

.data-table {
  table-layout: fixed;
  width: 100%;
}

.data-table th:first-child,
.data-table td:first-child {
  width: 60%;
}

.data-table th:last-child,
.data-table td:last-child {
  width: 40%;
}
</style>
