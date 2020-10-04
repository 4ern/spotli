<template>
  <div>
    <div v-show="!deleteBm" @click="preventClick">
      <div
          style="display: flex; gap: 12px; align-items: baseline; position: relative"
      >
        <!-- favicon -->
        <img
            :src="getFavicon(bookmark.url)"
            alt="favicon"
            style="max-height: 40px; align-self: center;"
        />

        <div style="flex: 1 1 auto; align-self: auto; min-width: 0;}">
          <div>
            <!-- title -->
            <div
                v-if="!edit"
                class="title"
                v-html="markSearchInput(bookmark.title)"
            />
            <v-text-field
                v-if="edit"
                v-model="bookmark.title"
                @focus="$event.target.select()"
                autofocus
                hide-details
                outlined
                flat
                label="Title"
            ></v-text-field>
          </div>

          <!-- url -->
          <div>
            <div
                v-if="!edit"
                class="url"
                v-html="markSearchInput(bookmark.url)"
            />
            <v-text-field
                v-if="edit"
                v-model="bookmark.url"
                @focus="$event.target.select()"
                hide-details
                outlined
                flat
                label="Url"
                style="margin-top: 16px"
            ></v-text-field>
          </div>
        </div>

        <div class="actions">

          <v-btn
              icon
              v-if="!edit"
              @click.stop="edit = true">
            <v-icon small>mdi-pencil</v-icon>
          </v-btn>

          <v-btn
              icon
              v-if="edit"
              color="success"
              @click.stop="saveBookmark(bookmark)">
            <v-icon small>mdi-content-save</v-icon>
          </v-btn>

          <v-btn
              icon
              v-if="edit"
              color="error"
              @click.stop="deleteBm = true">
            <v-icon small>mdi-delete</v-icon>
          </v-btn>

          <v-btn
              icon
              v-if="edit"
              @click.stop="edit = false">
            <v-icon small>mdi-close-circle</v-icon>
          </v-btn>

        </div>
      </div>
      <tags :bookmark="bookmark"/>
    </div>

    <v-card v-show="deleteBm" class="mx-auto">
      <v-card-text>
        <div class="title">Do you really want to delete this bookmark?</div>
      </v-card-text>
      <v-card-actions>
        <v-btn depressed color="error" @click.stop="deleteBookmark">YES</v-btn>
        <v-btn depressed @click.stop="deleteBm = false" >NO</v-btn>
      </v-card-actions>
    </v-card>

  </div>
</template>

<script>
import tags from "./tags";

export default {
  props: ["bookmark"],

  components: {
    tags
  },

  computed: {
    searchInput() {
      return this.$store.state.searchInput;
    }
  },

  data() {
    return {
      edit: false,
      deleteBm: false
    };
  },

  methods: {
    getFavicon(url) {
      return `chrome://favicon/size/32@1x/${url}`;
    },

    markSearchInput(value) {
      if (this.$store.state.settings.markInput) {
        let pattern = new RegExp(this.searchInput, 'gi');
        return value.replace(pattern, `<mark>${this.searchInput}</mark>`);
      }
      return value;
    },

    saveBookmark() {
      this.$store.commit("saveBookmark", this.bookmark);
      this.edit = false;
    },

    deleteBookmark() {
      this.$store.commit("deleteBookmark", this.bookmark.id);
      this.deleteBm = false;
    },

    preventClick(e) {
      if (this.edit) e.stopPropagation();
    }
  }
};
</script>

<style lang="scss">
mark {
  background-color: #E2FBFD;
}

.url {
  font-size: 12px;
  color: #757584;
}

.actions {
  display: flex;
  flex-direction: column;

  .delete {
    color: #757584;

    &:hover {
      color: #ff4e50;
    }
  }

  .save {
    color: #757584;

    &:hover {
      color: #00d683;
    }
  }
}

</style>
