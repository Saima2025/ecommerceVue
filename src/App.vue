<script setup>
import {RouterView } from 'vue-router'
import PageHeader from './components/Header.vue'
</script>

<template>
  
  <header>
    <page-header />
  </header>
  <RouterView />
</template>

<script>
export default {
}
</script>