<template>
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
</template>

<script>
export default {
  name: 'layoutView',
  data(){
    return{
    }
  },
  methods:{
  }
}
</script>

<style lang="scss" scoped>
  .layoutView{
    height: 100%;
  }
</style>


