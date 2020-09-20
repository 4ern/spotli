<template>
  <div class="spotli" @keyup.enter="openBookmark">
    <button @click="optionPage">test</button>
<!--    <searchbar />-->
<!--    <results-list ref="resultsList" />-->
  </div>
</template>

<script>
import searchbar from "../components/popup/searchbar";
import resultsList from "../components/popup/results-list";

export default {
  components: {
    searchbar,
    resultsList
  },

  data() {
    return {
      searchResults: [],
      searchBarInfo: ''
    };
  },

  created() {
    this.$store.dispatch('loadBookmarks');
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
      this.$store.dispatch('search');
    },

    open() {
      if (this.open) this.openBookmark()
    },

    bookmarks() {
      this.$store.commit('saveBookmarks');
    }
  },

  methods: {

    async openBookmark() {
      let url = this.$store.state.selected === null ? null : this.$store.state.selected.url;
      const selected = this.$store.state.selected;
      const searchResult = this.$store.state.searchResults;

      /**
       * search in google
       */
      if (selected === null && searchResult.length === 0) {
        url = encodeURI(`https://www.google.com/search?q=${this.searchInput}`);
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
      if (await this.reOpen(url)) return;

      /**
       * open new tab
       */
      chrome.tabs.create({ url: url });

    },

    /**
     * Todo: Make optional
     */
    reOpen(url) {
      return new Promise((resolve) => {
        chrome.tabs.query({url: url, active: false }, (resp) => {
          if (resp.length > 0) {
            chrome.tabs.update(resp[0].id, {active: true})
            resolve(true)
          }
          resolve(false);
        });
      })
    },

    optionPage() {
      if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
      } else {
        window.open(chrome.runtime.getURL('options.html'));
      }
    }
  },
}
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
  display: flex;
  flex-flow: column;
  min-height: 56px;

  button {
    &:focus {
      outline: none;
    }
  }
}
</style>
