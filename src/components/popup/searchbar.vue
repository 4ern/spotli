<template>
  <div class="searchbar-wrapper">
    <div class="searchbar">
      <v-icon large style="padding: 0 8px;">search</v-icon>

      <input
        :value="searchInput"
        @input="updateSearchInput"
        type="text"
        autofocus
        @keyup.enter="open"
      />
      <span>{{ searchResults.length }} results</span>
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

    img {
      padding: 8px;
      height: 24px;
      width: 24px;
      margin-left: 8px;
    }

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
      border-radius: 50%;
      color: #94949e;
    }
  }
}
</style>
