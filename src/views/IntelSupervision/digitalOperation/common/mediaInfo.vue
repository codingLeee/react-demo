<template>
    <div class="media_info">
        <mediaTest activeName="mediaInfo" :properties="properties"/>
    </div>
</template>

<script>
import mediaTest from "./mediaTest.vue";
export default {
  components: { mediaTest },
  data(){
      return{
          properties:{
              panelName:"mediaInfo",
              type:"video",
              prefix:"检测视频/"
          }
      }
  }
};
</script>


<style lang="scss" scoped>
.media_info {
}
</style>
