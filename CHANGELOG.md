# Changelog

## 0.2.0

### Features
- mark search input in title and url is now optional
- highlight matched tag is now optional
- youtube search command ":yt"

### Bugfix
- remove unused data attributes
- the search only starts with at least 3 characters in the input
- solve stopPropagation is undefined error
- space in tags replaced with "-"
- if the url had a hash tag, the function searching for an already existing tab, could not find the tab
