import $ from 'jquery';

import 'normalize.css';


import api from './api';
import store from './store';
import bookmarks from './bookmarks';

const main = function () {
  api.getBookmarks()
    .then((res) => {
      res.forEach((bookmark) => store.addBookmark(bookmark));
      bookmarks.render();
    });

  bookmarks.bindEventListeners();
  bookmarks.render();
};

$(main);
