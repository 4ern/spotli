<template>

  <ul v-if="searchResults.length !== 0" class="search-results" @keyup.enter="open">
    <li
      v-for="(item, index) in searchResults"
      :key="item.url"
      :class="{ 'active-item': currentItem === index }"
      @click="clickOnItem(item)"
    >
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
      this.currentItem = 0;
    }
  },

  methods: {
    nextItem() {
      if (
        event.keyCode === 40 &&
        this.currentItem === this.searchResults.length - 1
      ) {
        return (this.currentItem = 0);
      }

      if (event.keyCode === 38 && this.currentItem > 0) {
        this.currentItem--;
        this.$store.commit(
          "updateSelectedBookmark",
          this.searchResults[this.currentItem]
        );
      }

      if (
        event.keyCode === 40 &&
        this.currentItem < this.searchResults.length - 1
      ) {
        this.currentItem++;
        this.$store.commit(
          "updateSelectedBookmark",
          this.searchResults[this.currentItem]
        );
      }
    },

    clickOnItem(item) {
      this.$store.commit("updateSelectedBookmark", item);
      this.$store.commit("updateCommand", item.id);
      this.open();
    },

    open() {
      this.$emit('open')
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
    position: relative;
    padding: 16px;
    color: #ffffff;
    font-size: 16px;
    cursor: pointer;

    &.active-item {
      background-color: #009daf;

      .url {
        color: #e2fbfd;
      }

      .v-input__prepend-inner {
        .v-icon {
          color: #e2fbfd;
        }
      }

      .theme--dark {
        &.v-chip:not(.v-chip--active) {
          &.matched {
            background-color: #007C8A;
          }
        }
      }

    }

    &:hover {
      background-color: #53535f;
      .theme--dark {
        &.v-chip:not(.v-chip--active) {
          &.nomatch {
            background-color: #303038;
          }
        }
      }
    }
  }
}
</style>
