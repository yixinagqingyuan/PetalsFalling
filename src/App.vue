<script setup lang="ts">
import MotherDay from "./components/MotherDay.vue";
const option = {
  flakeCount: 30, //设置爱心数目
}
</script>

<template>
  <MotherDay :option="option" />
</template>

<style>
* {
  margin: 0px;
  padding: 0px;
}

#app {

  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
