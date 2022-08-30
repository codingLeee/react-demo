import router from "./router";
import {addNonMenuRoute} from "./router/addNonMenuRoute";
import {
  resetRouter
} from "./router";
import store from "./store";
import {
  getMenus
} from "./api";
import {
  getStorage
} from "./lib";
import { jsonPost } from "./api/request/fetch";

router.beforeEach((to, from, next) => {
  if (to.path === "/login") {
    if(from.path != "/login"){
      store.commit("CLEAR_ROUTES");
    }
    next();
  } else {
    const token = getStorage("token");
    console.log(token);
    const hasRouters = store.state.addRouter.hasRouters;
    if (token) {
      if (hasRouters) {
        next();
      } else {
        getMenus().then(res => {
          let menuList = res.data.menus;
          let systemMgtIndex = -1;

          menuList.forEach((item, index) => {
            if (item.path == "systemMgt") {
              systemMgtIndex = index;
            }
          })
          store.commit("UPDATE_SYS_STATUS", systemMgtIndex);

          if (systemMgtIndex != -1) {
            delete menuList[systemMgtIndex];
          }

          resetRouter();
          store.dispatch("generateRoutes", menuList).then((accessRoutes) => {
            // 设置非菜单外的路由各系统内路由
            accessRoutes = addNonMenuRoute(accessRoutes);
            for(let i = 0, length = accessRoutes.length; i < length; i++){
              const element = accessRoutes[i];
              router.addRoute(element);
            }

            router.options.routes = store.state.addRouter.routes;
            next({
              ...to,
              replace: true
            });
          });
          store.commit("SET_USER_INFO", res.data.user);
        }).catch(() => {
          next("/login");
        });
        store.commit("SET_HAS_ROUTERS", true);
      }
    } else {
      next("/login");
    }
  }
});

router.afterEach(() => {
});
