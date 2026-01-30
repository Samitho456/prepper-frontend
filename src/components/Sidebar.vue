<script setup>
import { RouterLink } from 'vue-router'
defineOptions({
  name: 'SidebarPanel',
})
</script>

<template>
  <aside class="sidebar">
    <div>
      <RouterLink to="/">
        <div class="logo-container">
          <img src="/Logo-antibg(New).svg" alt="Prepper Logo" width="50" />
          <span class="logo-text">prepper</span>
        </div>
      </RouterLink>
      <ul>
        <li>
          <RouterLink to="/Recipes" active-class="active">Recipes</RouterLink>
        </li>
        <li>
          <RouterLink to="/MealPlanner" active-class="active">MealPlanner</RouterLink>
        </li>
        <li>
          <RouterLink to="/Ingredients" active-class="active">Ingredients</RouterLink>
        </li>
        <li>
          <RouterLink to="/Inventory" active-class="active">Inventory</RouterLink>
        </li>
        <li>
          <RouterLink to="/ShoppingList" active-class="active">Shopping List</RouterLink>
        </li>
      </ul>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 200px;
  height: 100vh;
  background-color: var(--primary-color);
  color: #fff;
}

.sidebar a {
  text-decoration: none;
}

.sidebar a.active {
  background-color: #216e7f;
  border-left: 4px solid var(--tertiary-color);
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-text {
  margin-top: 10px;
  font-size: 1.8rem;
  font-weight: bold;
  color: #fff;
}

.sidebar img {
  margin: 5px 0 0 15px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 20px 0 0 0;
}

.sidebar li {
  margin: 15px 0;
  padding: 0;
}

.sidebar ul a {
  display: block;
  width: 100%;
  box-sizing: border-box;
  padding: 10px 0 10px 15px;
  color: #fff;
  text-decoration: none;
  font-size: 1.4rem;
}

.sidebar ul a:hover {
  background-color: #348b9f;
}
</style>
