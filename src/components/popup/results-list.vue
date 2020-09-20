<template>
  <ul v-if="searchResults.length !== 0" class="search-results">
    <li
      v-for="(item, index) in searchResults"
      :key="item.url"
      :class="{ 'active-item': currentItem === index }"
      @click="clickOnItem(item)" >
        <list-item :bookmark="item" />
    </li>
  </ul>
</template>

<script>

import listItem from "./result-list-item";

export default {

  components: {
    listItem
  },

  data() {
    return {
      currentItem: 0
    };
  },

  mounted() {
    document.addEventListener("keydown", this.nextItem);
  },

  computed: {
    searchResults() {
      return this.$store.state.searchResults;
    }
  },

  watch: {
    searchResults() {
      this.currentItem = 0
    }
  },

  methods: {
    nextItem() {
      if ((event.keyCode === 40) && this.currentItem === this.searchResults.length - 1) {
        return this.currentItem = 0;
      }

      if (event.keyCode === 38 && this.currentItem > 0) {
        this.currentItem--;
        this.$store.commit('updateSelectedBookmark', this.searchResults[this.currentItem])
      }

      if (
        event.keyCode === 40 &&
        this.currentItem < this.searchResults.length - 1
      ) {
        this.currentItem++;
        this.$store.commit('updateSelectedBookmark', this.searchResults[this.currentItem])
      }

    },

    clickOnItem(item) {
      this.$store.commit('updateSelectedBookmark', item)
      this.$store.commit('updateOpenBookmark', true)
    }
  }
};
</script>

<style lang="scss">
.search-results {
  list-style: none;
  margin: 0;
  padding: 0;
  margin-top: 56px;

  li {
    padding: 16px;
    color: #ffffff;
    font-size: 16px;
    cursor: pointer;

    &.active-item {
      background-color: #009daf;

      .url {
        color: #E2FBFD;
      }

      .delete {
        color: #E2FBFD;
        &:hover{
          color: #FF4E50;
        }
      }

      .edit {
        color: #E2FBFD;
        &:hover {
          color: #009daf;
        }
      }

      .save {
        color: #E2FBFD;
        &:hover {
          color: #00D683;
        }
      }

      .tags {
        .delete {
          color: #94949E;
        }
      }

      input, textarea {
        border: solid 1px #E2FBFD;
      }
    }

    &:hover {
      background-color: #53535f;

      &.active-item {
        input, textarea {
          border: solid 1px #009daf;
        }
      }

      .tags {
        .tag {
          background-color: #303038;

          .delete {
            &:hover {
              color: #E2FBFD;
            }
          }

          &.active {
            background-color: #FFCC00;
            color: #303038;

            .delete {
              color: #303038;
              &:hover {
                color: #E2FBFD;
              }
            }
          }
        }
      }
    }

  }
}
</style>
