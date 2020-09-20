import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    bookmarks: [],
    searchInput: '',
    searchResults: [],
    selected: null,
    open: false
  },

  getters: {
    getBookmarks(state) {
      return state.bookmarks;
    },

    searchResultsByTitle(state) {
      return state.bookmarks.filter((bookmark) => {
        const search = state.searchInput.replace(':title', '').trim().toLocaleLowerCase();
        const title = bookmark.title.toLocaleLowerCase().trim()
        return search.length < 3 ? false : !!title.includes(search);
      });
    },

    searchResultsByUrl(state) {
      return state.bookmarks.filter((bookmark) => {
        const search = state.searchInput.replace(':url', '').trim().toLocaleLowerCase();
        const url = bookmark.url.toLocaleLowerCase().trim()
        return search.length < 3 ? false : !!url.includes(search);
      });
    },

    searchResultsByTag(state) {
      return state.bookmarks.filter((bookmark) => {
        let search = state.searchInput.replace(':tag', '').trim().toLocaleLowerCase();
        let hasTag = bookmark.tag.find((tag) => {
          if (search.length === 0) return false;
          return tag.toLowerCase().includes(search)
        });
        return !!hasTag;
      });
    }
  },

  mutations: {

    updateOpenBookmark(state, data) {
      state.open = data
    },

    updateSelectedBookmark(state, item) {
      state.selected = item;
    },

    updateBookmarks(state, bookmarks) {
      state.bookmarks = bookmarks;
    },

    updateSearchInput(state, searchValue) {
      state.searchInput = searchValue;
    },

    searchByTitleUrl(state, data) {
      state.searchResults = data;
    },

    searchByUrl(state, data) {
      state.searchResults = data;
    },

    searchByTag(state, data) {
      state.searchResults = data
    },

    searchByAll(state, data) {
      state.searchResults = data.reduce((acc, current) => {
        const x = acc.find(item => item.id === current.id);
        return !x ? acc.concat([current]) : acc;
      }, []);
    },

    addNewTag(state, {bookmark, tag}) {
      state.bookmarks = state.bookmarks.map((bm) => {
        if (bm.id === bookmark.id) {
          const hasTag = bm.tag.find((t) => t === tag);
          if (!hasTag) bm.tag.push(tag);
        }
        return bm;
      })
    },

    deleteTag(state, {bookmark, tag}) {
      state.bookmarks = state.bookmarks.map((bm) => {
        if (bm.id === bookmark.id) {
          const index = bm.tag.findIndex((t) => t === tag);
          if (index > -1) bm.tag.splice(index, 1);
        }
        return bm;
      })
    },

    deleteBookmark(state, id) {
      state.bookmarks = state.bookmarks.filter((bookmark) => bookmark.id !== id);
      state.searchResults = state.searchResults.filter((bookmark) => bookmark.id !== id);
    },

    editBookmark(state, bookmark) {
      state.bookmarks = state.bookmarks.map((bm) => {
        if (bm.id === bookmark.id) {
          return bookmark
        }
        return bm;
      });
    },

    saveBookmarks(state) {
      chrome.storage.local.remove('spotli_bookmarks');
      chrome.storage.local.set({'spotli_bookmarks': state.bookmarks});
    }
  },

  actions: {

    loadBookmarks({ commit }) {
      chrome.storage.local.get(['spotli_bookmarks'], (bm) => {
        commit('updateBookmarks', bm['spotli_bookmarks'])
      });
    },

    search({ state, commit, getters }) {

      if (state.searchInput <= 2) return state.searchResults = [];

      /**
       * search by command
       */
      if (state.searchInput.startsWith(':')) {
        if (state.searchInput.startsWith(':title')) {
          return commit('searchByTitle', getters.searchResultsByTitle);
        }

        if (state.searchInput.startsWith(':url')) {
          return commit('searchByUrl', getters.searchResultsByUrl);
        }

        if (state.searchInput.startsWith(':tag')) {
          return commit('searchByTag', getters.searchResultsByTag);
        }
      }

      /**
       * full search
       */
      const searchByTitle = getters.searchResultsByTitle;
      const searchByUrl = getters.searchResultsByUrl;
      const searchByTag = getters.searchResultsByTag;
      commit('searchByAll', [...searchByTitle, ...searchByUrl, ...searchByTag]);
    }
  },
});
