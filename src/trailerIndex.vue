<!-- src/albumIndex.vue -->
<template>
  <div class="row">
    <div style="margin-top: 5%">
      <h2>{{ title }}</h2>
      <div class="accordion" id="allTrailersAccordion">
        <div
          class="accordion-item"
          v-for="(category, key, index) in categories"
          :key="category._id"
        >
          <h2
            class="accordion-header"
            v-bind:id="'panelsStayOpen-Heading' + index"
          >
            <button
              class="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              v-bind:data-bs-target="'#panelsStayOpen-Collapse' + index"
              aria-expanded="true"
              v-bind:aria-controls="'panelsStayOpen-' + index"
            >
              {{ key }}
            </button>
          </h2>
          <div
            v-bind:id="'panelsStayOpen-Collapse' + index"
            class="accordion-collapse collapse show"
            v-bind:aria-labelledby="'panelsStayOpen-Heading' + index"
          >
            <div class="accordion-body">
              <ul class="list" v-for="trailer in category" :key="trailer._id">
                <router-link v-bind:to="'/trailer/show/' + trailer._id">{{
                  trailer.name
                }}</router-link>
              </ul>
              <a
                class="button mt-5"
                type="button"
                v-on:click="deleteCategory(key)"
              >
                Delete Category
              </a>
            </div>
          </div>
        </div>
      </div>
      <router-link class="button mt-5" type="button" to="/trailer/create">
        New
      </router-link>
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
    deleteCategory(name) {
      const delete_category = confirm(
        "Are you sure you want to delete this category with all the videos in it?"
      );
      if (delete_category) {
        console.log("deteing the whole section ", name);
        fetch("/.netlify/functions/deleteCategory/" + name, {
          headers: { Accept: "application/json" },
          method: "DELETE",
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("This is the data for this categories: ", data);
          });
      }
    },
  },
  mounted() {
    this.allTrailers();
  },
};
</script>
