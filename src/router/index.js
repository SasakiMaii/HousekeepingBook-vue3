import { createRouter, createWebHistory } from "vue-router";

import TopView from "../views/TopView.vue";
import LoginView from "../views/LoginView.vue";
import UpdateView from "../views/UpdateView.vue";
import RegisterView from "../views/RegisterView.vue";
import ErrorPage from "../views/ErrorPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "TopView",
      component: TopView,
      meta: { requiresAuth: true },
    },
    {
      path: "/update",
      name: "UpdateView",
      component: UpdateView,
    },
    {
      path: "/login",
      name: "LoginView",
      component: LoginView,
    },
    {
      path: "/register",
      name: "RegisterView",
      component: RegisterView,
    },
    {
      path: "/:catchAll(.*)",
      name: "ErrorPage",
      component: ErrorPage,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  if (requiresAuth) {
    if (localStorage.length === 0) {
      next({
        path: "/login",
        query: { redirect: to.fullPath },
      });
    } else {
      next();
    }
  } else {
    next(); // next() を常に呼び出すようにしてください!
  }
});

export default router;
