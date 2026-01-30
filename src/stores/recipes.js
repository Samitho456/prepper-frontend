import { defineStore } from 'pinia'
import axios from 'axios'

export const useRecipeStore = defineStore('recipes', {
  state: () => ({
    recipes: [],
    isLoading: false,
    lastFetched: null,
    cacheTimeout: 5 * 60 * 1000, // 5 minutes in milliseconds
  }),

  getters: {
    // Get recipe by ID
    getRecipeById: (state) => (id) => {
      return state.recipes.find((recipe) => recipe.id === id)
    },

    // Check if cache is still valid
    isCacheValid: (state) => {
      if (!state.lastFetched) return false
      return Date.now() - state.lastFetched < state.cacheTimeout
    },

    // Get all recipes
    allRecipes: (state) => state.recipes,
  },

  actions: {
    // Fetch recipes from API
    async fetchRecipes(forceRefresh = false) {
      // If cache is valid and not forcing refresh, return cached data
      if (!forceRefresh && this.isCacheValid && this.recipes.length > 0) {
        return this.recipes
      }

      this.isLoading = true
      try {
        const response = await axios.get('/api/Recipes')
        this.recipes = response.data
        this.lastFetched = Date.now()
        return this.recipes
      } catch (error) {
        console.error('Error fetching recipes:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Add a new recipe to the store
    addRecipe(recipe) {
      this.recipes.push(recipe)
    },

    // Update an existing recipe
    updateRecipe(updatedRecipe) {
      const index = this.recipes.findIndex((recipe) => recipe.id === updatedRecipe.id)
      if (index !== -1) {
        this.recipes[index] = updatedRecipe
      }
    },

    // Remove a recipe
    removeRecipe(recipeId) {
      this.recipes = this.recipes.filter((recipe) => recipe.id !== recipeId)
    },

    // Clear cache
    clearCache() {
      this.recipes = []
      this.lastFetched = null
    },
  },
})
