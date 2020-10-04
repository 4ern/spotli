<template>
  <v-app class="spotli">
    <searchbar @open="openBookmark"/>
    <results-list @open="openBookmark"/>
  </v-app>
</template>

<script>
import searchbar from "../components/popup/searchbar";
import resultsList from "../components/popup/results-list";

export default {
  components: {
    searchbar,
    resultsList
  },

  created() {
    this.$store.dispatch("loadBookmarks");
    this.$store.dispatch(("loadSettings"));
  },

  computed: {
    bookmarks() {
      return this.$store.state.bookmarks;
    },

    searchInput() {
      return this.$store.state.searchInput;
    },

    open() {
      return this.$store.state.open;
    }
  },

  watch: {
    searchInput() {
      this.$store.dispatch("search");
    },

    bookmarks() {
      this.$store.commit("saveBookmarks");
    }
  },

  methods: {
    async openBookmark() {

      /**
       * abort if empts
       */
      if (this.searchInput.length < 3) return;

      let url =
        this.$store.state.selected === null
          ? null
          : this.$store.state.selected.url;
      const selected = this.$store.state.selected;
      const searchResult = this.$store.state.searchResults;

      /**
       * search youtube
       */
      if (this.open === ':yt') {
        url = encodeURI(`https://www.youtube.com/results?search_query=${this.searchInput.replace(':yt', '').trim()}`);
        this.$store.commit('updateOpenBookmark', false)
        return chrome.tabs.create({ url: url });
      }

      /**
       * search in google
       */
      if (this.$store.state.settings.autoGoogle) {
        if ( (selected === null && searchResult.length === 0 ) || this.open === ':g') {
          url = encodeURI(`https://www.google.com/search?q=${this.searchInput.replace(':g', '').trim()}`);
          this.$store.commit('updateOpenBookmark', false)
          return chrome.tabs.create({ url: url });
        }
      }

      /**
       * enter without selection
       */
      if (selected === null && searchResult.length !== 0) {
        url = searchResult[0].url;
      }

      /**
       * reopen tab if its exists
       */
      if (this.$store.state.settings.focusTab) {
        if (await this.reOpen(url)) return;
      }

      /**
       * open new tab
       */
      if (url !== null) {
        chrome.tabs.create({ url: url });
      }
      this.$store.commit('updateOpenBookmark', false)
    },

    reOpen(url) {
      let searchUrl = url.split('#')[0] + '*'
      return new Promise(resolve => {
        chrome.tabs.query({
          url: searchUrl,
          currentWindow: true
        }, resp => {
          if (resp.length > 0) {
            chrome.tabs.update(resp[0].id, { active: true });
            resolve(true);
          }
          resolve(false);
        });
      });
    }
  }
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,300;0,400;0,600;0,800;1,300;1,400;1,600;1,800&display=swap");

html {
  width: 600px;
  height: auto;
  background-color: #303038;
  font-family: "Nunito", sans-serif;
}

body {
  margin: 0;
}

.spotli {
  .v-application--wrap {
    min-height: 56px;
  }

}

.v-application ul, .v-application ol {
  padding-left: 0;
}
</style>
