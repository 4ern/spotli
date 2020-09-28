<template>
  <div>
    <v-app>
      <v-main>

        <v-container class="mt-10">

          <div class="d-flex align-center">
            <h4 class="text-h2">4ern-Spotly</h4>
          </div>

          <p class="title mb-8 mt-2">Thanks for installing 4ern-spotly.</p>

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

        <v-container class="mt-10">
          <h4 class="text-h4">Options</h4>
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
      focusTab: true,
      autoGoogle: true,
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
    matchTags: {
      deep: true,
      handler() {
        this.save()
      }
    }
  },

  mounted() {
    chrome.storage.local.get(['spotli_setting'], (res) => {
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
