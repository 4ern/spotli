import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    bookmarks: [],
    searchInput: "",
    searchResults: [],
    selected: null,
    command: false,
    settings: {}
  },

  getters: {
    getBookmarks(state) {
      return state.bookmarks;
    },

    searchResultsByTitle(state) {
      return state.bookmarks.filter(bookmark => {
        const search = state.searchInput
          .replace(":title", "")
          .trim()
          .toLocaleLowerCase();
        const title = bookmark.title.toLocaleLowerCase().trim();
        return search.length < 3 ? false : !!title.includes(search);
      });
    },

    searchResultsByUrl(state) {
      return state.bookmarks.filter(bookmark => {
        const search = state.searchInput
          .replace(":url", "")
          .trim()
          .toLocaleLowerCase();
        const url = bookmark.url.toLocaleLowerCase().trim();
        return search.length < 3 ? false : !!url.includes(search);
      });
    },

    searchResultsByTag(state) {
      return state.bookmarks.filter(bookmark => {
        let search = state.searchInput
          .replace(":tag", "")
          .trim()
          .toLowerCase();

        let hasTag = bookmark.tag.find(tag => {
          if (search.length === 0) return false;
          let found = false
          search.split(' ').forEach((searchTag) => {
            found = tag.toLowerCase().includes(searchTag);
          })
          return found;
        });
        return !!hasTag;
      });
    },
  },

  mutations: {
    updateCommand(state, data) {
      state.command = data;
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
      state.searchResults = data;
    },

    searchByAll(state, data) {
      state.searchResults = data.reduce((acc, current) => {
        const x = acc.find(item => item.url === current.url);
        return !x ? acc.concat([current]) : acc;
      }, []);
    },

    addNewTag(state, { bookmark, tag }) {
      state.bookmarks = state.bookmarks.map(bm => {
        if (bm.id === bookmark.id) {
          const hasTag = bm.tag.find(t => t === tag);
          if (!hasTag) bm.tag.push(tag);
        }
        return bm;
      });
    },

    updateTags(state, bookmark) {
      state.bookmarks = state.bookmarks.map((bm) => {
        if (bm.id === bookmark.id) bm.tag = bookmark.tag
        return bm;
      });
    },

    deleteBookmark(state, id) {
      state.bookmarks = state.bookmarks.filter(bookmark => bookmark.id !== id);
      state.searchResults = state.searchResults.filter(
        bookmark => bookmark.id !== id
      );
      chrome.bookmarks.removeTree(id)
    },

    saveBookmark(state, bookmark) {
      state.bookmarks = state.bookmarks.map(bm => {
        if (bm.id === bookmark.id) {
          return bookmark;
        }
        return bm;
      });
      chrome.bookmarks.update(bookmark.id, {title: bookmark.title, url: bookmark.url})
    },

    saveBookmarks(state) {
      chrome.storage.local.set({ spotli_bookmarks: state.bookmarks });
    },

    setSettings(state, settings) {
      state.settings = settings;
    }
  },

  actions: {

    loadBookmarks({ commit }) {
      chrome.storage.local.get(["spotli_bookmarks"], bm => {
        commit("updateBookmarks", bm["spotli_bookmarks"]);
      });
    },

    loadSettings({ commit, dispatch }) {
      let settings = {};
      chrome.storage.local.get(['spotli_setting'], (res) => {
        if (typeof res.spotli_setting === 'undefined') return
        settings.focusTab = res.spotli_setting.focusTab;
        settings.autoGoogle = res.spotli_setting.autoGoogle;
        settings.matchTags = res.spotli_setting.matchTags;
        settings.markInput = res.spotli_setting.markInput;
        settings.highlightTag = res.spotli_setting.highlightTag;
        settings.searchInTabs = res.spotli_setting.searchInTabs;
        commit('setSettings', settings)

        if (settings.matchTags.active) {
          dispatch('matchTags')
        }
      })
    },

    matchTags({state, commit}) {
      const matchTags = state.settings.matchTags.select;
      state.bookmarks.forEach((bookmark) => {
        const url = bookmark.url;
        const title = bookmark.title;
        matchTags.forEach((tag) => {
          if (url.includes(tag) || title.includes(tag)) commit('addNewTag', { bookmark, tag })
        })
      })
    },

    search({ state, commit, getters }) {
      if (state.searchInput.length < 3) return (state.searchResults = []);

      /**
       * search by command
       */
      if (state.searchInput.startsWith(":")) {
        if (state.searchInput.startsWith(":title")) {
          return commit("searchByTitle", getters.searchResultsByTitle);
        }

        if (state.searchInput.startsWith(":url")) {
          return commit("searchByUrl", getters.searchResultsByUrl);
        }

        if (state.searchInput.startsWith(":tag")) {
          return commit("searchByTag", getters.searchResultsByTag);
        }

        if (state.searchInput.startsWith(":options") || state.searchInput.startsWith(":option") || state.searchInput.startsWith(":config")) {
          if (chrome.runtime.openOptionsPage) {
            chrome.runtime.openOptionsPage();
          } else {
            window.open(chrome.runtime.getURL("options.html"));
          }
        }

        if (state.searchInput.startsWith(":g")) {
          commit('updateCommand', ':g');
        }

        if (state.searchInput.startsWith(":yt")) {
          commit('updateCommand', ':yt');
        }
      }

      /**
       * search in tabs
       */
      if (state.settings.searchInTabs) {
        chrome.tabs.query({ currentWindow: true}, resp => {
          let openTabs = resp.filter((tabs) => {
            if (tabs.url.toLowerCase().includes(state.searchInput.toLowerCase())) return true;
            return tabs.title.toLowerCase().includes(state.searchInput.toLowerCase());
          }).map((tab) => {
            return {
              title: tab.title,
              url: tab.url,
              id: tab.id,
              isBookmark: false
            }
          })

          /**
           * full search
           */
          const searchByTitle = getters.searchResultsByTitle;
          const searchByUrl = getters.searchResultsByUrl;
          const searchByTag = getters.searchResultsByTag;
          commit("searchByAll", [...openTabs, ...searchByTag, ...searchByTitle, ...searchByUrl]);

        });
      } else {

        /**
         * full search
         */
        const searchByTitle = getters.searchResultsByTitle;
        const searchByUrl = getters.searchResultsByUrl;
        const searchByTag = getters.searchResultsByTag;
        commit("searchByAll", [...searchByTag, ...searchByTitle, ...searchByUrl]);
      }


    },

  }
});
