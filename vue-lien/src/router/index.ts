import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/form-memoire-volatile",
      name: "Form: mémoire volatile",
      component: () => import("../views/FormMemoireVolatile.vue"),
    },
    {
      path: "/form-memoire-durable-state",
      name: "Form: mémoire durable: state",
      component: () => import("../views/FormMemoireDurableState.vue"),
    },
    {
      path: "/form-memoire-durable-histoire",
      name: "Form: mémoire durable: histoire",
      component: () => import("../views/FormMemoireDurableHistoire.vue"),
    },
    {
      path: "/form-ref-history",
      name: "Form: ref history",
      component: () => import("../views/FormRefHistory.vue"),
    },
    {
      path: "/about",
      name: "About",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
  ],
});

export default router;
