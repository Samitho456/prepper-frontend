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
        <img src="/prepper-logo-text.png" alt="Prepper Logo" width="150" />
      </RouterLink>
      <ul>
        <li>
          <RouterLink to="/Recipes">Recipes</RouterLink>
        </li>
        <li>
          <RouterLink to="/MealPlanner">MealPlanner</RouterLink>
        </li>
      </ul>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 200px;
  height: 100vh;
  background-color: #1e1f20;
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
  padding-left: 15px;
  padding-block: 10px;
}

.sidebar li:hover {
  background-color: #348b9f;
}

.sidebar a {
  margin: 10px;
  color: #fff;
  text-decoration: none;
  font-size: 1.4rem;
}
</style>
