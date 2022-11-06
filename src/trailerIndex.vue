<!-- src/albumIndex.vue -->
<template>
  <div class="row">
    <div style="margin-top: 5%">
      <h2>{{ title }}</h2>
      <div v-for="(category, key) in categories" :key="category._id">
        <p>{{ key }}</p>
        <ul>
          <li>
            {{ key }}
            <ul v-for="trailer in category" :key="trailer._id">
              <li>{{ trailer }}</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      categories: {},
      trailers: [],
      title: "Movie Trailers",
    };
  },
  methods: {
    allTrailers() {
      fetch("/.netlify/functions/trailer", {
        headers: { Accept: "application/json" },
      })
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          result.forEach((trailer) => {
            console.log("result: ", trailer);
            if (!(trailer["category"] in this.categories)) {
              console.log("Adding category", trailer["category"]);
              this.categories[trailer["category"]] = [];
            }
            this.categories[trailer["category"]].push(trailer);
          });
          console.log(this.categories);
          //   this.categories = result;
        });
    },
  },
  mounted() {
    this.allTrailers();
  },
};
</script>
