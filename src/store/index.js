import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    bookmarks: []
  },

  getters: {
    getBookmarks(state) {
      return state.bookmarks;
    }
  },

  mutations: {
    storeBookmarks(state, bookmarks) {
      state.bookmarks = bookmarks;
    }
  },

  actions: {
    loadBookmarks({ commit }) {
      chrome.storage.local.get(['spotli_bookmarks'], (bm) => {
        commit('storeBookmarks', bm['spotli_bookmarks'])
      });
    }
  },
});
