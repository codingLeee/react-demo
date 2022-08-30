<template>
    <div class="statistics_content">
        <div class="statistics_content_left">
            <leftContent></leftContent>
        </div>
        <div class="statistics_content_right">
            <rightContent></rightContent>
        </div>
    </div>
</template>

<script>
import leftContent from "./leftContent.vue";
import rightContent from "./rightContent.vue";
export default {
  components: { leftContent, rightContent },
  data() {
    return {};
  }
};
</script>


<style lang="scss" scoped>
.statistics_content {
  width: 100%;
  height: 100%;
  padding: 53px 18px 21px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  background-color: rgba(5, 38, 85, 1);
}

.statistics_content_left,
.statistics_content_right {
  width: 23.18%;
  height: 100%;
}
</style>
