<template>
  <div @click.stop="" class="tags">

    <div class="tag"
         v-for="tag in tags"
         :class="{ active: tag.toLowerCase().trim().includes(isSearchTag(searchInput)) }"
         :key="tag">
      {{ tag }}
      <button @click.stop="deleteTag(tag)" class="delete">x</button>
    </div>

    <button class="add-btn" v-show="!showInput" @click.stop="addTag">
      <span>+</span>
    </button>

    <input
      v-show="showInput"
      class="add-tag"
      ref="addTagInput"
      type="text"
      @keyup.enter.stop="saveTag"
      v-model="tag"
    />
  </div>
</template>

<script>
export default {
  props: ['tags', 'searchInput'],

  data() {
    return {
      showInput: false,
      tag: ''
    };
  },

  methods: {
    addTag() {
      this.showInput = true;
      setTimeout(() => this.$refs.addTagInput.focus(), 100)
    },

    deleteTag(tag) {
      this.$emit('deleteTag', tag)
    },

    saveTag() {
      if (this.tag.length >= 3) {
        this.$emit('newTag', this.tag);
        this.tag = '';
      }
      this.showInput = false;
    },

    isSearchTag(tag) {
      let searchTag = tag.replace(':tag', '').trim();
      searchTag = searchTag.replace(':title', '').trim();
      return searchTag.replace(':url', '').trim();
    }
  }
}
</script>

<style lang="scss" scoped>
.tags {
  margin-top: 12px;
  display: flex;
  align-items: center;

  .tag {
    display: flex;
    font-size: 12px;
    padding: 4px 4px 4px 8px;
    background-color: #53535f;
    margin-right: 4px;
    border-radius: 2px;
    align-items: center;

    .delete {
      display: flex;
      text-decoration: none;
      background-color: transparent;
      border: none;
      margin-top: 1px;
      font-weight: 300;
      margin-left: 4px;
      font-family: Arial, sans-serif;
      font-size: 12px;
      color: #94949E;
      width: 18px;
      height: 18px;
      cursor: pointer;
      padding-top: 2px;

      &:hover {
        color: #009daf;
      }

    }

    &.active {
      background-color: #FFCC00;
      color: #303038;

      .delete {
        color: #303038;
      }
    }
  }

  .add-btn {
    display: flex;
    text-decoration: none;
    color: #757584;
    font-size: 18px;
    background-color: transparent;
    border: none;
    margin-top: 1px;
    cursor: pointer;

    span {
      display: inline-flex;
      margin-top: 2px;
    }

    &:after {
      transition: visibility, opacity 300ms;
      content: "add Tag";
      display: inline-flex;
      font-size: 10px;
      align-self: center;
      margin-left: 4px;
      visibility: hidden;
      opacity: 0;
    }

    &:hover {
      color: #009daf;

      &:after {
        visibility: visible;
        opacity: 1;
        color: #E2FBFD;
      }
    }

  }

  .add-tag {
    background-color: transparent;
    border: solid 1px #757584;
    padding: 4px;
    color: #ffffff;

    &:focus {
      outline: none;
    }

  }

}
</style>
