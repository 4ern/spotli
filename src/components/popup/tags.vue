<template>
  <div @click.stop="" class="tags">
    <v-combobox
        v-model="bm.tag"
        small-chips
        deletable-chips
        multiple
        flat
        hide-details
        hide-no-data
        append-icon="add_circle"
        hide-selected >
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
    updateTag() {
      this.$store.commit("updateTags", this.bm );
    },

    removeTag(tag) {
      this.bm.tag = this.bm.tag.filter((t) => t !== tag);
      this.updateTag();
    },

    isSearchTag(tag) {
      let input = this.searchInput.replace(":tag", "").trim();
      input = input.replace(":title", "").trim();
      input = input.replace(":url", "").trim();
      if (tag.toLowerCase().trim().includes(input)) return 'matched'
      return 'nomatch'
    }
  }
};
</script>

<style lang="scss">

.theme--dark.v-text-field > .v-input__control > .v-input__slot:before {
  border: none;
}

//.v-input__append-inner {
//  display: none !important;
//}

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
