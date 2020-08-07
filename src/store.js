const bookmarks = [];
let error = null;
let hideCheckeditems = false;
let showAddBookmarks = false;
let adding = true;
let filtered = "";



const findById = function (id) {
  return this.bookmarks.find(currentBookmark => currentBookmark.id === id);
};

const addBookmark = function (bookmark) {
  this.bookmarks.push(bookmark);
};

const filterBookmarks = function (rating) {
  return this.bookmarks.filter(bookmark => {
    return bookmark.rating >= rating
  })
};


const findAndDelete = function (id) {
  this.bookmarks = this.bookmarks.filter(currentBookmark => currentBookmark.id !== id);
};

const toggleCheckedFilter = function () {
  this.hideCheckedItems = !this.hideCheckedItems;
};

const findAndUpdate = function (id, newData) {
  const currentBookmark = this.findById(id);
  Object.assign(currentBookmark, newData);
};

const setError = function (error) {
  this.error = error;
};

export default {
  bookmarks,
  error,
  hideCheckeditems,
  findById,
  addBookmark,
  findAndDelete,
  toggleCheckedFilter,
  findAndUpdate,
  setError,
  filterBookmarks,
  showAddBookmarks,
  filtered,
  adding
};