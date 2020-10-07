<template>
  <div>
    <v-app>
      <v-main>

        <v-container class="mt-10">

          <div class="d-flex align-center">
            <h4 class="text-h2">4ern-Spotly</h4>
          </div>

          <p class="title mb-8 mt-2">Thanks for installing 4ern-spotly.</p>

          <!--Commands-->
          <h4 class="text-h4 mb-2">Commands</h4>
          <v-simple-table>
            <template v-slot:default>
              <thead>
              <tr>
                <th class="text-left">Command</th>
                <th class="text-left">Description</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, index) in commands" :key="index+1">
                <td v-html="item.command" />
                <td v-html="item.desc" />
              </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-container>

        <!-- Options -->
        <v-container class="mt-10">
          <h4 class="text-h4">Options</h4>

          <!-- Check Open Tags -->
          <v-row>
            <v-col cols="4">
              <div >
                <p class="text-body-1">
                  4ern-spotly checks if the bookmark is already open in a tab and focuses on it.
                  (if it is already focussed, it will be duplicated)
                </p>
              </div>
            </v-col>
            <v-col cols="6" offset="2">
              <v-switch v-model="focusTab" :label="focusTab ? 'check open Tab and focus' : 'always open new Tab'"></v-switch>
            </v-col>
          </v-row>
          <v-divider />

          <!-- search with google -->
          <v-row>
            <v-col cols="4">
              <div >
                <p class="text-body-1">
                  if your search has no hits, 4ern-spotly automatically google your input
                </p>
              </div>
            </v-col>
            <v-col cols="6" offset="2">
              <v-switch v-model="autoGoogle" :label="autoGoogle ? 'google my input' : 'do nothing'"></v-switch>
            </v-col>
          </v-row>
          <v-divider />

          <!-- mark search input -->
          <v-row>
            <v-col cols="4">
              <div >
                <p class="text-body-1">
                  Mark the input in Title and Url
                </p>
              </div>
            </v-col>
            <v-col cols="6" offset="2">
              <v-switch v-model="markInput" :label="markInput ? 'mark my input' : 'do not mark my input'"></v-switch>
            </v-col>
          </v-row>
          <v-divider />

          <!-- search in window tabs -->
          <v-row>
            <v-col cols="4">
              <div >
                <p class="text-body-1">
                  searching for title & url in your tabs. only tabs in your active chrome window will be searched
                </p>
              </div>
            </v-col>
            <v-col cols="6" offset="2">
              <v-switch v-model="searchInTabs" :label="searchInTabs ? 'search for tabs' : 'no please do not'"></v-switch>
            </v-col>
          </v-row>
          <v-divider />

          <!-- highlight matched tag -->
          <v-row>
            <v-col cols="4">
              <div >
                <p class="text-body-1">
                  If your entry matches a tag, it will be highlighted
                </p>
              </div>
            </v-col>
            <v-col cols="6" offset="2">
              <v-switch v-model="highlightTag" :label="highlightTag ? 'highlight matched Tag' : 'do not highlight'"></v-switch>
            </v-col>
          </v-row>
          <v-divider />

          <!-- auto match Tags -->
          <v-row>
            <v-col cols="4">
              <div >
                <p class="text-body-1">
                  Your bookmarks are scanned and tags are automatically created if the predefined tags appear in url or title.
                </p>
              </div>
            </v-col>
            <v-col cols="6" offset="2">
              <v-switch v-model="matchTags.active" :label="matchTags.active ? 'add Tags' : 'do not add tags'"></v-switch>
              <v-combobox
                  v-if="matchTags.active"
                  v-model="matchTags.select"
                  :items="matchTags.items"
                  label="Match Tags"
                  chips
                  outlined
                  deletable-chips
                  multiple
              ></v-combobox>
            </v-col>
          </v-row>

        </v-container>
      </v-main>
    </v-app>
  </div>
</template>

<script>
export default {

  data() {
    return {
      focusTab: false,
      autoGoogle: false,
      markInput: false,
      searchInTabs: false,
      highlightTag: false,
      matchTags: {
        active: false,
        select: [],
        items: []
      },
      commands: [
        {
          command: '<code>:tag myTag</code>',
          desc: 'Find Bookmarks only by Tag '
        },
        {
          command: '<code>:title myTitle</code>',
          desc: 'Find Bookmarks only by Title'
        },
        {
          command: '<code>:url google.com</code>',
          desc: 'Find Bookmarks only by Url'
        },
        {
          command: '<code>:config</code> or <code>:setting</code> or <code>:settings</code>',
          desc: 'Opening the settings'
        },
        {
          command: '<code>:g</code>',
          desc: 'search in google'
        },
        {
          command: '<code>:yt</code>',
          desc: 'search in youtube'
        },
      ]
    }
  },

  watch: {
    focusTab() {
      this.save()
    },
    autoGoogle() {
      this.save()
    },
    markInput() {
      this.save()
    },
    highlightTag() {
      this.save()
    },
    searchInTabs() {
      this.save()
    },
    matchTags: {
      deep: true,
      handler() {
        this.save()
      }
    }
  },

  mounted() {
    chrome.storage.local.get(['spotli_setting'], (res) => {
      if (typeof res.spotli_setting === 'undefined') return
      this.focusTab = res.spotli_setting.focusTab;
      this.autoGoogle = res.spotli_setting.autoGoogle;
      this.matchTags.active = res.spotli_setting.matchTags.active;
      this.matchTags.items = res.spotli_setting.matchTags.select;
      this.matchTags.select = res.spotli_setting.matchTags.select;
    })
  },

  methods: {
    save() {
      const settings = {
        focusTab: this.focusTab,
        autoGoogle: this.autoGoogle,
        markInput: this.markInput,
        highlightTag: this.highlightTag,
        searchInTabs: this.searchInTabs,
        matchTags: {
          active: this.matchTags.active,
          select: this.matchTags.select
        }
      }
      chrome.storage.local.set({ spotli_setting: settings });
    }

  }
};
</script>

<style lang="scss">

html {
  background-color: #121212;
}

body {
  padding: 16px;
}

</style>
