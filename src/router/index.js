import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/MealPlanner',
      name: 'mealplanner',
      component: () => import('../views/MealPlannerView.vue'),
    },
    {
      path: '/Recipes',
      name: 'recipes',
      component: () => import('../views/RecipesView.vue'),
    },
    {
      path: '/Recipe/:id',
      name: 'recipe',
      component: () => import('../views/RecipeView.vue'),
    },
    {
      path: '/:catchAll(.*)',
      name: 'notfound',
      component: () => import('../views/NotFoundView.vue'),
    },
    {
      path: '/AddRecipe',
      name: 'addrecipe',
      component: () => import('../views/AddRecipeView.vue'),
    },
    {
      path: '/Ingredients',
      name: 'ingredients',
      component: () => import('../views/IngredientsView.vue'),
    },
  ],
})

export default router
