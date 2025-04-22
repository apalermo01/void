import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import WelcomeAnimation from "../views/WelcomeAnimation.vue";
import WelcomeSetup from "@/views/WelcomeSetup.vue";
import Settings from "@/views/Settings.vue";
import Home from "@/views/Home.vue";
import Terminal from "@/views/Terminal.vue";

const routes = [
  {
    path: "/",
    redirect: "home",
    component: Dashboard,
    meta: { transition: "fade" },
    children: [
      {
        path: "settings",
        component: Settings,
        meta: { transition: "slide-left" },
      },
      {
        path: "home",
        component: Home,
        meta: { transition: "fade" },
      },
      {
        path: "code",
        component: Terminal,
        meta: { transition: "fade" },
      }
    ],
  },
  { path: "/welcome", component: WelcomeAnimation },
  { path: "/setup", component: WelcomeSetup },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

export default router;
