import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import WelcomeAnimation from "../views/WelcomeAnimation.vue";
import WelcomeSetup from "@/views/WelcomeSetup.vue";
import Settings from "@/views/Settings.vue";
import Home from "@/views/Home.vue";
import Terminal from "@/views/Terminal.vue";
import AudioContent from "@/views/AudioContent.vue";
import ImageContent from "@/views/ImageContent.vue";
import JournalContent from "@/views/JournalContent.vue";
import NoteContent from "@/views/NoteContent.vue";

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
      },
      {
        path: "audio/:url",
        component: AudioContent,
        props: true,
        meta: { transition: "fade" },
      },
      {
        path: "image/:url",
        component: ImageContent,
        props: true,
        meta: { transition: "fade" }
      },
      {
        path: "journal/:url",
        component: JournalContent,
        props: true,
        meta: { transition: "fade" }
      },
      {
        path: "note/:url",
        component: NoteContent,
        props: true,
        meta: { transition: "fade" }
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
