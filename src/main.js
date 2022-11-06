// src/main.js
import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";

import App from "./App.vue";

import "./css/normalize.css";
import "./css/skeleton.css";

import trailerIndex from "./trailerIndex.vue";
import trailerDetails from "./trailerDetails.vue";

const routes = [
  // Routing Trailers
  { path: "/trailer", component: trailerIndex, props: true },
  {
    path: "/trailer/show/:id",
    component: trailerDetails,
    props: { show: true },
  },
  {
    path: "/trailer/edit/:id",
    component: trailerDetails,
    props: { edit: true },
  },
  {
    path: "/trailer/create",
    component: trailerDetails,
    props: { create: true },
  },
  {
    path: "/trailer/delete/:id",
    component: trailerDetails,
    props: { delete: true },
  },

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
