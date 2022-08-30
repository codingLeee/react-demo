<template>
    <div class="bs_panel">
        {{title}}
    </div>
</template>

<script>
export default {
  name: "BsPanel",
  data() {
    return {};
  },
  props: {
    title: {
      type: String,
      default: "标题"
    }
  }
};
</script>

<style lang="scss" scoped>
.bs_panel {
  width: 100%;
  height: 35px;
  line-height: 35px;
  background: url(/static/BigScreenStatistics/img/panle_bg.png) no-repeat center
    center;
  background-size: 100% 100%;
  padding-left: 41px;

  font-size: 19px;
  color: #76edff;
}
</style>
