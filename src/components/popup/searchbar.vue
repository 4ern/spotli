<template>
  <div class="searchbar-wrapper">
    <div class="searchbar">
      <v-icon large style="padding: 0 8px;">mdi-magnify</v-icon>

      <input
        :value="searchInput"
        @input="updateSearchInput"
        type="text"
        autocomplete="off"
        autofocus
        id="searchInput"
        @keyup.enter="open"
      />
      <span class="text-caption">{{ searchResults.length }} results</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "searchbar",

  computed: {
    searchInput() {
      return this.$store.state.searchInput;
    },

    searchResults() {
      return this.$store.state.searchResults;
    }
  },

  methods: {
    updateSearchInput(e) {
      this.$store.commit("updateSearchInput", e.target.value);
    },

    open() {
      this.$emit('open')
    }
  }
};
</script>

<style lang="scss" scoped>
.searchbar-wrapper {
  position: fixed;
  width: 100%;
  background-color: #303038;
  z-index: 1;

  .searchbar {
    display: flex;
    flex-flow: row;
    margin: 8px 0;
    align-items: center;

    input {
      background-color: #303038;
      border: none;
      color: #ffffff;
      font-size: 18px;
      flex-grow: 1;

      &:focus {
        outline: none;
      }
    }

    span {
      display: flex;
      margin-right: 16px;
      color: #94949e;
    }
  }
}
</style>
