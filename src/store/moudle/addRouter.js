import {
  getStorage,
  setStorage,
  removeStorage,
  clearStorage,
  checkNotNull
} from "@/lib";
import {
  layoutView,
  routerPath
} from "@/router/_import";
import {
  constantRouters
} from "@/router";
import router from "@/router";

/**
 * 递归过滤异步路由表
 * @param routes
 */
function filterAsyncRoutes(routes, routeLevel = 1, parentPath) {
  const res = [];
  routes.forEach(route => {
    const tmp = {
      ...route
    };

    if (checkNotNull(tmp.children)) {
      // if (routeLevel == 0) {
      //   tmp.parentPath = "";
      //   // tmp.parentPath = tmp.router;
      // } else {
      //   tmp.parentPath = parentPath + "/" + tmp.router;
      // }

      if (routeLevel == 0) {
        tmp.component = routerPath(tmp.parent, tmp.router);
      } else {
        tmp.component = layoutView("layoutView");
      }

      tmp.redirect = tmp.parent + "/" + tmp.children[0]["router"];
      tmp.children = filterAsyncRoutes(tmp.children, 1, tmp.redirect);
    } else {
      tmp.component = routerPath(tmp.parent, tmp.router);
    }

    if (routeLevel == 0) {
      tmp.path = "/" + tmp.router;
    } else {
      tmp.path = tmp.router;
    }
    tmp.name = tmp.router;

    tmp.meta = {
      title: tmp.title
    };
    res.push({
      ...tmp
    });
  });
  return res;
}

/**
 * 获得默认路由
 * @param routes
 */
function getRedirectRoutes(routes) {
  routes.forEach(m => {
    if (checkNotNull(m.children)) {
      return getRedirectRoutes(m.children);
    }
  })

  
}

export default {
  state: {
    token: getStorage("token") || "",
    hasRouters: false, // 路由是否存在
    userInfo: {},
    routes: [], // 总路由
    menus: [], // 菜单
    addRouters: {}, // 新添加的路由
    isHasSysMgt: true,
    systemRouter: ""
  },
  getters: {
    systemMenus: function (state) {
      let currSysIndex = state.menus.findIndex(m => m["router"] == state.systemRouter);
      return state.menus[currSysIndex]["children"] || [];
    }
  },
  mutations: {
    UPDATE_SYS_STATUS: (state, code) => {
      if (code == -1) {
        state.isHasSysMgt = false;
      } else {
        state.isHasSysMgt = true;
      }
    },
    LOGOUT: (state, code) => {
      router.push("/login");
      clearStorage();
      state.token = "";
      state.hasRouters = false;
      state.routes = [];
      state.menus = [];
      state.addRouters = {};
      state.userInfo = {};
    },
    CLEAR_ROUTES: (state, code) => {
      clearStorage();
      state.token = "";
      state.hasRouters = false;
      state.routes = [];
      state.menus = [];
      state.addRouters = {};
      state.userInfo = {};
    },
    SET_MENU: (state, code) => {
      state.menus = code;
    },
    SET_USER_INFO: (state, code) => {
      state.userInfo = code;
    },
    SET_TOKEN: (state, code) => {
      setStorage("token", code);
      state.token = code;
    },
    SET_HAS_ROUTERS: (state, code) => {
      state.hasRouters = code;
    },
    SET_SYSTEM_ROUTER: (state, code) => {
      state.systemRouter = code;
    },
    SET_ROUTES: (state, routes) => {
      // 默认路由路径
      // var defaultPath = getRedirectRoutes(routes);
      var defaultRoute = [
        // {
        //   path: "noNetwork",
        //   name: "noNetwork",
        //   component: layoutView("noNetwork")
        // },
        // {
        //   path: "noPermission",
        //   name: "noPermission",
        //   component: layoutView("noPermission")
        // },
        // {
        //   path: "*",
        //   meta: {
        //     title: "404"
        //   },
        //   component: layoutView("notfound")
        // }
      ];


      // 设置默认路由
      routes = [
        ...routes,
        ...defaultRoute
      ];
      state.addRouters = routes;
      state.routes = [...constantRouters, ...state.addRouters];
    }
  },
  actions: {
    generateRoutes({
      commit
    }, asyncRoutes) {
      return new Promise(resolve => {
        let accessedRoutes = filterAsyncRoutes(asyncRoutes, 0);
        commit("SET_MENU", accessedRoutes);
        commit("SET_ROUTES", accessedRoutes);
        resolve(accessedRoutes);
      });
    }
  }
};
