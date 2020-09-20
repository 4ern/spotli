<template>
  <div>
    <div style="display: flex; gap: 12px; align-items: baseline; position: relative">
      <img :src="getFavicon(bookmark.url)" alt="favicon" style="max-height: 40px; align-self: center;">

      <div  style="flex: 1 1 auto; align-self: auto; min-width: 0;}">
        <div>
          <div v-if="!edit" class="title" v-html="markSearchInput(bookmark.title)"/>
          <label>
            <input @click.stop="" ref="titleInput" v-if="edit" v-model="title" type="text" style="font-size: 16px">
          </label>
        </div>

        <div>
          <div v-if="!edit" class="url" v-html="markSearchInput(bookmark.url)"/>
          <label>
            <textarea @click.stop="" v-if="edit" v-model="url"></textarea>
          </label>
        </div>
      </div>

      <div class="actions">
        <font-awesome-icon v-if="!edit" class="edit" @click.stop="toggleEdit" icon="edit"/>
        <font-awesome-icon v-if="!edit" class="delete" @click.stop="deleteBookmark" icon="trash"/>
        <font-awesome-icon v-if="edit" class="save" @click.stop="editBookmark(bookmark)" icon="save"/>
        <font-awesome-icon v-if="edit" class="delete" @click.stop="edit = false" icon="times-circle"/>
      </div>
    </div>

    <tags :bookmark="bookmark"/>

  </div>
</template>

<script>

import tags from "./tags";
import {library} from '@fortawesome/fontawesome-svg-core'
import {faTrash} from '@fortawesome/free-solid-svg-icons'
import {faEdit} from '@fortawesome/free-solid-svg-icons'
import {faSave} from '@fortawesome/free-solid-svg-icons'
import {faTimesCircle} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

library.add(faTrash, faEdit, faSave, faTimesCircle)


export default {

  props: ['bookmark'],

  components: {
    tags,
    FontAwesomeIcon
  },

  data() {
    return {
      edit: false,
      url: this.bookmark.url,
      title: this.bookmark.title
    }
  },

  methods: {
    getFavicon(url) {
      return `chrome://favicon/size/32@1x/${url}`
    },

    markSearchInput(value) {
      return value.replace(this.searchInput, `<mark>${this.searchInput}</mark>`)
    },

    toggleEdit() {
      this.edit = !this.edit
      setTimeout(() => this.$refs.titleInput.focus(), 300)
    },

    editBookmark() {
      this.bookmark.title = this.title;
      this.bookmark.url = this.url;
      this.$store.commit('editBookmark', this.bookmark);
      this.edit = false;
    },

    deleteBookmark() {
      this.$store.commit('deleteBookmark', this.bookmark.id)
    }
  }

}
</script>

<style lang="scss" scoped>

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

  .save {
    color: #757584;

    &:hover {
      color: #00D683;
    }
  }
}

input, textarea {
  background-color: transparent;
  color: #E2FBFD;
  font-size: 12px;
  flex-grow: 1;
  border: solid 1px #009daf;
  padding: 8px;
  width: calc(100% - 16px);
  margin-bottom: 8px;

  &:focus {
    outline: none;
  }
}

</style>
