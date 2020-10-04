<template>
  <div @click.stop="" class="tag">
    <v-combobox
        @keyup.enter="updateTag"
        @keyup.tab="updateTag"
        @keyup.esc="selectSearch"
        v-model="bm.tag"
        small-chips
        deletable-chips
        multiple
        flat
        hide-details
        hide-no-data
        append-icon=""
        hide-selected >
        <template v-slot:prepend-inner>
          <v-icon small>mdi-tag-plus</v-icon>
        </template>

        <template v-slot:selection="data">
          <v-chip
              :input-value="data.selected"
              @click:close="removeTag(data.item)"
              small
              close
              :class="isSearchTag(data.item)">
            {{ data.item }}
          </v-chip>
        </template>
    </v-combobox>

  </div>
</template>

<script>
export default {
  props: ["bookmark"],

  data() {
    return {
      bm: this.bookmark
    }
  },

  computed: {
    searchInput() {
      return this.$store.state.searchInput;
    }
  },

  methods: {
    updateTag(e) {
      if (typeof e !== 'undefined') e.stopPropagation();
      this.bm.tag = this.bm.tag.map((tag) => tag.trim().split(' ').join('-'))
      this.$store.commit("updateTags", this.bm );
    },

    removeTag(tag) {
      this.bm.tag = this.bm.tag.filter((t) => t !== tag);
      this.updateTag();
    },

    isSearchTag(tag) {
      if ( !this.$store.state.settings.highlightTag ) return 'nomatch';
      let input = this.searchInput.replace(":tag", "").trim();
      input = input.replace(":title", "").trim();
      input = input.replace(":url", "").trim();
      if (tag.toLowerCase().trim().includes(input)) return 'matched'
      return 'nomatch'
    },

    selectSearch() {
      document.getElementById('searchInput').focus();
    }
  }
};
</script>

<style lang="scss">

.theme--dark.v-text-field > .v-input__control > .v-input__slot:before {
  border: none;
}

.v-application--is-ltr .v-text-field .v-input__prepend-inner {
  align-self: center;
}

.v-input__prepend-inner {
  .v-icon {
    color: #757584;
  }
}

.theme--dark {
  &.v-chip:not(.v-chip--active) {

    &.nomatch {
      background-color: #53535F;
    }

    &.matched {
      background-color: #0AB3C7;
    }
  }
}

</style>
