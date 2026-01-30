import { defineStore } from 'pinia'
import axios from 'axios'

export const useIngredientStore = defineStore('ingredients', {
  state: () => ({
    ingredients: [],
    ingredientsWithProfiles: [],
    isLoading: false,
    lastFetched: null,
    lastFetchedProfiles: null,
    cacheTimeout: 5 * 60 * 1000, // 5 minutes in milliseconds
  }),

  getters: {
    // Get ingredient by ID
    getIngredientById: (state) => (id) => {
      return state.ingredients.find((ingredient) => ingredient.id === id)
    },

    // Get ingredient with profiles by ID
    getIngredientWithProfilesById: (state) => (id) => {
      return state.ingredientsWithProfiles.find((ingredient) => ingredient.id === id)
    },

    // Check if basic ingredients cache is valid
    isBasicCacheValid: (state) => {
      if (!state.lastFetched) return false
      return Date.now() - state.lastFetched < state.cacheTimeout
    },

    // Check if profiles cache is valid
    isProfilesCacheValid: (state) => {
      if (!state.lastFetchedProfiles) return false
      return Date.now() - state.lastFetchedProfiles < state.cacheTimeout
    },

    // Get all ingredients
    allIngredients: (state) => state.ingredients,

    // Get all ingredients with nutritional profiles
    allIngredientsWithProfiles: (state) => state.ingredientsWithProfiles,
  },

  actions: {
    // Fetch basic ingredients list from API
    async fetchIngredients(forceRefresh = false) {
      // If cache is valid and not forcing refresh, return cached data
      if (!forceRefresh && this.isBasicCacheValid && this.ingredients.length > 0) {
        return this.ingredients
      }

      this.isLoading = true
      try {
        const response = await axios.get('/api/ingredients')
        this.ingredients = response.data
        this.lastFetched = Date.now()
        return this.ingredients
      } catch (error) {
        console.error('Error fetching ingredients:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Fetch ingredients with nutritional profiles
    async fetchIngredientsWithProfiles(forceRefresh = false) {
      // If cache is valid and not forcing refresh, return cached data
      if (!forceRefresh && this.isProfilesCacheValid && this.ingredientsWithProfiles.length > 0) {
        return this.ingredientsWithProfiles
      }

      this.isLoading = true
      try {
        const response = await axios.get('/api/Ingredients/GetNutritionalProfiles')
        this.ingredientsWithProfiles = response.data
        this.lastFetchedProfiles = Date.now()
        return this.ingredientsWithProfiles
      } catch (error) {
        console.error('Error fetching ingredients with profiles:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Add a new ingredient to the store
    addIngredient(ingredient) {
      this.ingredients.push(ingredient)
    },

    // Update an existing ingredient
    updateIngredient(updatedIngredient) {
      const index = this.ingredients.findIndex((ing) => ing.id === updatedIngredient.id)
      if (index !== -1) {
        this.ingredients[index] = updatedIngredient
      }

      // Also update in the profiles array if it exists there
      const profileIndex = this.ingredientsWithProfiles.findIndex(
        (ing) => ing.id === updatedIngredient.id,
      )
      if (profileIndex !== -1) {
        this.ingredientsWithProfiles[profileIndex] = updatedIngredient
      }
    },

    // Update nutritional profile for an ingredient
    updateNutritionalProfile(ingredientId, updatedProfile) {
      const ingredient = this.ingredientsWithProfiles.find((ing) => ing.id === ingredientId)
      if (ingredient) {
        const profileIndex = ingredient.nutritionalProfiles.findIndex(
          (p) => p.id === updatedProfile.id,
        )
        if (profileIndex !== -1) {
          ingredient.nutritionalProfiles[profileIndex] = updatedProfile
        }
      }
    },

    // Add nutritional profile to an ingredient
    addNutritionalProfile(ingredientId, newProfile) {
      const ingredient = this.ingredientsWithProfiles.find((ing) => ing.id === ingredientId)
      if (ingredient) {
        ingredient.nutritionalProfiles.push(newProfile)
      }
    },

    // Remove an ingredient
    removeIngredient(ingredientId) {
      this.ingredients = this.ingredients.filter((ing) => ing.id !== ingredientId)
      this.ingredientsWithProfiles = this.ingredientsWithProfiles.filter(
        (ing) => ing.id !== ingredientId,
      )
    },

    // Clear cache
    clearCache() {
      this.ingredients = []
      this.ingredientsWithProfiles = []
      this.lastFetched = null
      this.lastFetchedProfiles = null
    },
  },
})
