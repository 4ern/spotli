<template>
  <ul v-if="list.length !== 0" class="search-results">
    <li
      v-for="(item, index) in list"
      :key="item.url"
      :class="{ 'active-item': currentItem === index }"
      @click="clickOnItem(item.url)"
    >

      <div style="display: flex; gap: 12px; align-items: baseline; position: relative">
        <img :src="getFavicon(item.url)" alt="favicon" style="max-height: 40px; align-self: center;">

        <div @click.stop="" style="flex: 1 1 auto; align-self: auto; min-width: 0;}">
          <div>
            <div v-if="!edit" class="title" v-html="markSearchInput(item.title)" />
            <input v-if="edit" v-model="item.title" id="title" type="text" style="font-size: 16px">
          </div>

          <div>
            <div v-if="!edit" class="url" v-html="markSearchInput(item.url)" />
            <input v-if="edit" v-model="item.url" id="url" type="text">
          </div>
        </div>

        <div class="actions">
          <font-awesome-icon v-if="!edit" class="edit" @click.stop="toggleEdit" icon="edit"/>
          <font-awesome-icon class="delete" @click.stop="deleteBookmark(item.id)" icon="trash"/>
          <font-awesome-icon v-if="edit" class="save" icon="save"/>
        </div>

      </div>

      <tags
          :tags="item.tag"
          :search-input="searchInput"
          @newTag="saveNewTag($event, item.id)"
          @deleteTag="deleteTag($event, item.id)"
      />

    </li>
  </ul>
</template>

<script>

import tags from "./tags";
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { faSave } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faTrash, faEdit, faSave)

export default {
  props: ["searchResults", "searchInput"],

  components: {
    tags,
    FontAwesomeIcon
  },

  data() {
    return {
      currentItem: 0,
      list: [],
      edit: false
    };
  },

  mounted() {
    document.addEventListener("keydown", this.nextItem);
  },

  watch: {
    searchResults() {
      this.list = this.searchResults
      this.currentItem = 0
    }
  },

  methods: {
    nextItem() {
      if ((event.keyCode === 40) && this.currentItem === this.list.length - 1) {
        return this.currentItem = 0;
      }

      if (event.keyCode === 38 && this.currentItem > 0) {
        this.currentItem--;
        this.$emit("selected", this.currentItem);
      }

      if (
        event.keyCode === 40 &&
        this.currentItem < this.list.length - 1
      ) {
        this.currentItem++;
        this.$emit("selected", this.currentItem);
      }

    },

    clickOnItem(url) {
      chrome.tabs.create({ url: url });
      this.$emit('openBookmark', url)
    },

    saveNewTag(tag, id) {
      this.$emit('newTag', {
        tag: tag,
        id: id
      })
    },

    deleteTag(tag, id) {
      this.$emit('deleteTag', {
        tag: tag,
        id: id
      })
    },

    getFavicon(url) {
      return `chrome://favicon/size/32@1x/${url}`
    },

    deleteBookmark(id) {
      chrome.bookmarks.remove(id);
      this.list = this.list.filter((item) => item.id !== id);
      this.$emit('deleteBookmark', id)
    },

    toggleEdit() {
      return this.edit = !this.edit;
    },

    markSearchInput(value) {
      return value.replace(this.searchInput, `<mark>${this.searchInput}</mark>`)
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

    .url {
      margin-top: 4px;
      font-size: 12px;
      color: #757584;
    }

    .actions {
      display: flex;
      margin-left: auto;
      gap: 8px;
      text-align: right;

      .delete {
        color: #757584;
        &:hover {
          color: #FF4E50;
        }
      }

      .edit {
        color: #757584;
        &:hover {
          color: #009daf;
        }
      }
    }

    input {
      background-color: transparent;
      color: #E2FBFD;
      font-size: 12px;
      flex-grow: 1;
      border: solid 2px #009daf;
      border-radius: 8px;
      padding: 4px;
      width: 90%;
      margin: 4px 0;
      &:focus {
        outline: none;
      }
    }

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

      .tags {
        .delete {
          color: #94949E;
        }
      }
    }

    &:hover {
      background-color: #53535f;

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
