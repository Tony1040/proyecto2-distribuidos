// src/main.js
import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";

import App from "./App.vue";

import "./css/normalize.css";
import "./css/skeleton.css";

import trailerIndex from "./trailerIndex.vue";
// import albumDetails from "./album/details.vue";

const routes = [
  // Routing Albums
  { path: "/trailer", component: trailerIndex, props: true },
//   { path: "/album/show/:id", component: albumDetails, props: { show: true } },
//   { path: "/album/edit/:id", component: albumDetails, props: { edit: true } },
//   { path: "/album/create", component: albumDetails, props: { create: true } },
//   {
//     path: "/album/delete/:id",
//     component: albumDetails,
//     props: { delete: true },
//   },

  // Home Routing
  { path: "/", component: trailerIndex, props: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

let app = createApp(App);

app.use(router);

app.mount("#app");