<!-- bookDetails.vue -->
<template>
  <div class="row">
    <div class="eleven column" style="margin-top: 3%">
      <h2 style="margin-top: 3%">{{ title }}</h2>
      <form>
        <div class="row">
          <div class="four columns">
            <label for="titleInput">Id</label>
            <input
              class="u-full-width"
              type="text"
              v-model="trailer._id"
              readonly
            />
          </div>
        </div>
        <div class="row">
          <div class="four columns">
            <label for="titleInput">Name</label>
            <input class="u-full-width" type="text" v-model="trailer.name" />
          </div>
          <div class="four columns">
            <label for="editionInput">Year</label>
            <input class="u-full-width" type="text" v-model="trailer.year" />
          </div>
          <div class="four columns">
            <label for="copyrightInput">Director</label>
            <input
              class="u-full-width"
              type="text"
              v-model="trailer.director"
            />
          </div>
        </div>
        <div class="row">
          <div class="four columns">
            <label for="phoneInput">Country</label>
            <input class="u-full-width" type="text" v-model="trailer.country" />
          </div>
          <div class="four columns">
            <label for="phoneInput">Category</label>
            <input class="u-full-width" type="text" v-model="trailer.category" />
          </div>
          <div class="four columns">
            <label for="phoneInput">Languaje</label>
            <input class="u-full-width" type="text" v-model="trailer.languaje" />
          </div>
        </div>
        <div class="row">
          <div class="twelve columns">
            <label for="phoneInput">URL</label>
            <input class="u-full-width" type="text" v-model="trailer.url" />
          </div>
        </div>
        <div class="row">
          <div v-if="getVideo" class="twelve columns mb-4 mt-4">
            <video
              class="twelve columns"
              id="videoPlayer"
              width="720"
              controls
              autoplay
            >
              <source
                v-bind:src="
                  'http://mongo-video-streamer.herokuapp.com/video/' +
                  trailer._id
                "
                type="video/mp4"
              />
            </video>
          </div>
        </div>
        <div class="row">
          <br />
          <br />
          <div class="twelve columns">
            <router-link class="button button-primary" to="/">
              Back
            </router-link>
            <a
              v-if="create"
              class="button button-primary"
              style="float: right"
              v-on:click="createTrailer()"
              >Create</a
            >

            <a
              v-if="show"
              class="button button-primary"
              style="float: right"
              v-on:click="deleteTrailer()"
              >Delete</a
            >
            <a
              v-if="edit | show"
              class="button button-primary"
              style="float: right; margin-right: 5px"
              v-on:click="updateTrailer()"
              >Update</a
            >
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { useRoute } from "vue-router";
import { uuid } from "vue-uuid";

export default {
  props: ["create", "edit", "show"],
  data: function () {
    return {
      getVideo: false,
      title: "Informaci??n de un trailer",
      trailer: {
        _id: 0,
        name: "",
        year: "",
        country: "",
        director: "",
        languaje: "",
        url: "",
        category: "",
      },
    };
  },
  created() {
    const route = useRoute();
    if (this.show || this.edit) {
      this.findtrailer(route.params.id);
    }
    if (this.create) {
      this.trailer._id = uuid.v4();
    }
  },
  methods: {
    findtrailer: function (id) {
      fetch("/.netlify/functions/trailer/" + id, {
        headers: { Accept: "application/json" },
      })
        .then((response) => response.json())
        .then((result) => {
          console.log(result, id);
          this.trailer = result[0];
          this.getVideo = true;
        });
    },
    updateTrailer: function () {
      fetch("/.netlify/functions/trailerUpdate/" + this.trailer._id, {
        headers: { "Content-Type": "application/json" },
        method: "PUT",
        body: JSON.stringify(this.trailer),
      }).then((data) => {
        if (data.status != 200) {
          console.log(data);
          alert(JSON.stringify(data));
        } else {
          alert("La peticion para actualizar los detalles del trailer ha sido agregada a la cola");
          this.$router.push("/");
        }
      });
    },
    createTrailer: function () {
      fetch("/.netlify/functions/trailerInsert", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(this.trailer),
      }).then((data) => {
        if (data.status == 303) {
          alert(
            "Ya existe un objeto con este ID, por favor use uno diferente"
          );
        } else {
          alert("El trailer ha sido agregado a la cosa para ser agregado");
          this.$router.push("/");
        }
      });
    },
    deleteTrailer: function () {
      fetch("/.netlify/functions/trailerDelete/" + this.trailer._id, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
      }).then((data) => {
        console.log(data);
        alert("El trailer ha sido agregado a la cola para ser eliminado");
        this.$router.push("/");
      });
    },
  },
};
</script>
