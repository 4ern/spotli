<template>
  <div class="spotli" @keyup.enter="openBookmark">
    <searchbar v-model="searchInput" :info="searchResults.length" />
    <results-list
        ref="resultsList"
        :search-results="searchResults"
        :search-input="searchInput"
        @selected="selectedItem"
        @deleteTag="deleteTag"
        @newTag="addNewTag"
        @openBookmark="openBookmark"
        @deleteBookmark="deleteBookmark"
    />
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
      searchInput: '',
      selected: undefined,
      bookmarks: [],
      searchResults: [],
      searchBarInfo: ''
    };
  },

  mounted() {
    chrome.storage.local.get(['spotli_bookmarks'], (res) => {
      this.bookmarks = res['spotli_bookmarks'];
    });
  },

  watch: {
    searchInput(newInput) {
      if (newInput.length >= 2) {
        this.searchBookmarks();
      } else {
        this.searchResults = [];
      }
    }
  },

  methods: {

    selectedItem(index) {
      this.selected = this.searchResults[index];
    },

    /**
     * Tags
     */

    addNewTag(payload) {
      const newBookmarks = this.bookmarks.map((bookmark) => {
        if (bookmark.id === payload.id) {
          let hasTag = bookmark.tag.find((tag) => tag === payload.tag);
          if (!hasTag) {
            bookmark.tag.push(payload.tag);
          }
        }
        return bookmark;
      })
      this.saveBookmarks(newBookmarks);
    },

    deleteTag(payload) {
      const newBookmarks = this.bookmarks.map((bm) => {
        if (bm.id === payload.id) {
          let index = bm.tag.findIndex((tag) => tag === payload.tag);
          if (index > -1) {
            bm.tag.splice(index, 1);
          }
        }
        return bm;
      })
      this.saveBookmarks(newBookmarks);
    },

    /**
     * Bookmarks
     */

    saveBookmarks(bookmarks) {
      console.log(bookmarks)
      this.bookmarks = bookmarks;
      chrome.storage.local.remove('spotli_bookmarks');
      chrome.storage.local.set({'spotli_bookmarks': bookmarks});
    },

    searchBookmarks() {

      if (this.searchInput.startsWith(':')) {
        if (this.searchInput.startsWith(':tag')) {
          return this.searchResults = this.bookmarks.filter((bookmark) => {
            let search = this.searchInput.replace(':tag', '').trim().toLocaleLowerCase();
            let hasTag = bookmark.tag.find((tag) => {
              if (search.length === 0) return false;
              return tag.toLowerCase().includes(search)
            });
            return !!hasTag;
          });
        }

        if (this.searchInput.startsWith(':url')) {
          return this.searchResults = this.bookmarks.filter((bookmark) => {
            const search = this.searchInput.replace(':url', '').trim().toLocaleLowerCase();
            const url = bookmark.url.toLocaleLowerCase().trim()
            return search.length < 3 ? false : !!url.includes(search);
          });
        }

        if (this.searchInput.startsWith(':title')) {
          return this.searchResults = this.bookmarks.filter((bookmark) => {
            const search = this.searchInput.replace(':title', '').trim().toLocaleLowerCase();
            const title = bookmark.title.toLocaleLowerCase().trim()
            return search.length < 3 ? false : !!title.includes(search);
          });
        }

      } else {

        const search = this.searchInput.toLowerCase().trim();

        let titleResults = this.bookmarks.filter((bookmark) => bookmark.title.includes(search));
        let tagResults = this.bookmarks.filter((bookmark) => {
          let hasTag = bookmark.tag.find((tag) => tag.toLowerCase() === search);
          return !!hasTag;
        })
        let urlResults= this.bookmarks.filter((bookmark) => {
          const search = this.searchInput.replace(':url', '').trim().toLocaleLowerCase();
          const url = bookmark.url.toLocaleLowerCase().trim()
          return search.length < 3 ? false : !!url.includes(search);
        });

        this.searchResults = [...titleResults, ...tagResults, ...urlResults].reduce((acc, current) => {
          const x = acc.find(item => item.id === current.id);
          return !x ? acc.concat([current]) : acc;
        }, []);

      }
    },

    deleteBookmark(id) {
      this.bookmarks = this.bookmarks.filter((bookmark) => bookmark.id !== id);
      this.searchResults = this.searchResults.filter((bookmark) => bookmark.id !== id);
    },

    /**
     * chrome tabs
     */

    async openBookmark(url) {

      let selectedUrl;

      if (typeof url === 'string') {
        selectedUrl = url;
      } else if (this.searchResults.length === 0) {
        selectedUrl = encodeURI(`https://www.google.com/search?q=${this.searchInput}`);
      } else {
        if (typeof this.selected === 'undefined') this.selected = this.searchResults[0];
        selectedUrl = this.selected.url
      }

      /**
       * reopen tab if its exists
       */
      const reOpenTab = await this.reOpen(selectedUrl);
      if (reOpenTab) return;

      /**
       * open new tab
       */
      chrome.tabs.create({ url: selectedUrl });
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
