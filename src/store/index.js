import Vue from "vue";
import Vuex from "vuex";
import addRouter from "./moudle/addRouter";
import IntelSupervison from "./moudle/IntelSupervison";


Vue.use(Vuex);
export default new Vuex.Store({
  modules: {
    addRouter,
    IntelSupervison
  }
});
