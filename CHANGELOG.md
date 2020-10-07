# Changelog

## 0.2.1
### Bugfix
- fix undefined property at the start of the options page

## 0.2.0
### Features
- mark search input in title and url is now optional
- highlight matched tag is now optional
- youtube search command ":yt"
- Result list is sorted first by tabs (if option is active), tags, title and last by url
- it now possible search for several tags, separate by space
- it is also possible to search the active tabs (not bookmarks)

### Bugfix
- remove unused data attributes
- the search only starts with at least 3 characters in the input
- solve stopPropagation is undefined error
- space in tags replaced with "-"
- if the url had a hash tag, the function searching for an already existing tab, could not find the tab
- tags only in lowerCase and tag search convert toLowerCase
- add tags only in lowerCase and search tags convert input to lowercase
