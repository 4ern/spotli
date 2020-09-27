class installBookmarks {
  bookmarks = [];
  matchTags = [];

  constructor() {
    chrome.runtime.onInstalled.addListener(() => {
      chrome.bookmarks.getTree(tree => {
        this.recursiveLoop(tree[0].children);
      });
      this.saveToStorage();
    });
  }

  recursiveLoop(bookmarks) {
    bookmarks.forEach(bookmark => {
      if (this.addBookmark(bookmark)) {
        this.recursiveLoop(bookmark.children);
      }
    });
  }

  addBookmark(node) {
    if (Object.prototype.hasOwnProperty.call(node, "children")) return true;
    this.bookmarks.push({
      id: node.id,
      title: node.title,
      url: node.url,
      tag: []
    });
    return false;
  }

  saveToStorage() {
    chrome.storage.local.get(["spotli_bookmarks"], res => {
      if (res.spotli_bookmarks === undefined) {
        chrome.storage.local.set({ spotli_bookmarks: this.bookmarks });
      }
    });
  }

}

class crudBookmarks {
  bookmarks = [];
  constructor() {
    this.getBookmarks();

    chrome.bookmarks.onCreated.addListener((id, node) => {
      this.onCreate(node);
    });

    chrome.bookmarks.onChanged.addListener((id, node) => {
      this.onUpdate(id, node);
    });

    chrome.bookmarks.onRemoved.addListener(id => {
      this.onDelete(id);
    });
  }

  getBookmarks() {
    chrome.storage.local.get(["spotli_bookmarks"], bm => {
      this.bookmarks = bm["spotli_bookmarks"];
    });
  }

  onCreate(node) {
    this.bookmarks.push({
      id: node.id,
      title: node.title,
      url: node.url,
      tag: []
    });
    this.updateLocalBookmarks();
  }

  onUpdate(id, node) {
    this.bookmarks = this.bookmarks.map(bookmark => {
      if (bookmark.id === id) {
        bookmark.url = node.url;
        bookmark.title = node.title;
      }
      return bookmark;
    });
    this.updateLocalBookmarks();
  }

  onDelete(id) {
    this.bookmarks = this.bookmarks.filter(bookmark => bookmark.id !== id);
    this.updateLocalBookmarks();
  }

  updateLocalBookmarks() {
    chrome.storage.local.remove("spotli_bookmarks");
    chrome.storage.local.set({ spotli_bookmarks: this.bookmarks });
  }
}

/**
 * on Install hook
 */
new installBookmarks();

new crudBookmarks();
