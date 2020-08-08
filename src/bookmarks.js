import $ from "jquery"
import cuid from "cuid"
import store from "./store"
import api from "./api"



const generateItemElement = function (bookmark, index) {
    if (bookmark.expanded) {
      return `
        <section class="bookmark-view">
          <h1 class="bookmark-paragraph bookmark-title" id="${bookmark.id}">${bookmark.title}</h1>
          <button class="btn"><a href=${bookmark.url} target="_blank">Visit ${bookmark.title}</a></button>
          <p>${bookmark.rating}</p>
          <p>${bookmark.desc}</p>
          <button class="delete-bookmark btn">Delete</button>
        </section>
        `
    } else {
    return `
    <div class="bookmark-paragraph" id="${bookmark.id}" tabindex=${index}>
      <p>${bookmark.title} ${bookmark.rating}</p>
    </div>
      `
  }
}

const generateBookmarkString = function (bookmarks) {
  if (store.showAddBookmarks) {
    return `
      <h1>Add new bookmark</h1>
      <form id="bookmark-form">
        <input placeholder="url" id="url" type="url" required />
        <br/>
        <textarea id="description" placeholder="description"></textarea>
        <br/>
        <input id="title" placeholder="title" type="text" required />
        <br/>
        <input id="rating" placeholder="rating" type="number" min="1" max="5" required />
        <br/>
        <button class="submit" type="submit">Submit</button>
        <button class="cancel" type="button">Cancel</button>
  
      </form>
      `
  } else {
    let items = bookmarks.map((item, index) => generateItemElement(item, index))

    items = items.join("")
    return `
    <div class ="main">
    <button id="new-bookmark">New</button>
    <!-- <label for="filter-bookmark">Choose rating</label> -->
    <select id="filter-bookmark">
      <option value="">Rating</option>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
    </select>
    <section class="bookmarks">${items}</section>
    </div>
    `
  }
}

const handleExpandBookmark = function () {
  $(".container").on("click", ".bookmark-paragraph", (event) => {
    let id = $(event.currentTarget).attr("id")
    let current = store.findById(id)
    current.expanded = !current.expanded
    render()
  })
}


const generateError = function (message) {
  return `
      <section class="error-content">
        <button id="cancel-error">X</button>
        <p>${message}</p>
      </section>
    `
}

const renderError = function () {
  if (store.error) {
    const el = generateError(store.error)
    $(".error-container").html(el)
  } else {
    $(".error-container").empty()
  }
}

const handleCloseError = function () {
  $(".error-container").on("click", "#cancel-error", () => {
    store.setError(null)
    renderError()
  })
}

const render = function (data = [...store.bookmarks]) {
  renderError()
  console.log(store.bookmarks)
  let bookmarks = data
  if (store.hideCheckedItems) {
    bookmarks = bookmarks.filter((item) => !item.checked)
  }
  const bookmarkString = generateBookmarkString(bookmarks)
  $(".bookmarks").html(bookmarkString)
}

const getItemIdFromElement = function (item) {
  return $(item).closest(".js-item-element").data("item-id")
}

const handleDeleteItemClicked = function () {
  $(".js-shopping-list").on("click", ".js-item-delete", (event) => {
    const id = getItemIdFromElement(event.currentTarget)

    api
      .deleteItem(id)
      .then(() => {
        store.findAndDelete(id)
        render()
      })
      .catch((error) => {
        console.log(error)
        store.setError(error.message)
        renderError()
      })
  })
}


const handleFilterRating = function () {
  $(".container").on("change", "#filter-bookmark", (event) => {
    let rating = parseInt($(event.currentTarget).val())
    let filtered = store.filterBookmarks(rating)
    render(filtered)
  })
}

const handleNewBookmark = function () {
  $(".container").on("click", "#new-bookmark", (event) => {
    store.showAddBookmarks = true
    render()
  })
}


const handleItemCheckClicked = function () {
  $(".js-shopping-list").on("click", ".js-item-toggle", (event) => {
    const id = getItemIdFromElement(event.currentTarget)
    const item = store.findById(id)
    api
      .updateItem(id, { checked: !item.checked })
      .then(() => {
        store.findAndUpdate(id, { checked: !item.checked })
        render()
      })
      .catch((error) => {
        store.setError(error.message)
        renderError()
      })
  })
}



const handleSubmit = function () {
  $(".container").on("submit", "#bookmark-form", (event) => {
    event.preventDefault()
    let url = $("#url").val()
    let desc = $("#description").val()
    let title = $("#title").val()
    let rating = $("#rating").val()
    const newBookmark = {
      id: cuid(),
      url,
      desc,
      rating,
      title,
    }
    api.createBookmark(newBookmark).then((bookmark) => {
      console.log(bookmark)
      store.addBookmark(bookmark)
      store.showAddBookmarks = false
      render()
    })
  })
}

const handleCancel = function () {
  $(".container").on("click", ".cancel", (event) => {
    store.showAddBookmarks = false
    render()
  })
}

const handleDeleteBookmark = function () {
  $(".container").on("click", ".delete-bookmark", (event) => {
    let id = $(event.currentTarget).parent().find('.bookmark-paragraph').attr('id')
    console.log(id)
    api.deleteBookmark(id)
    .then(() => {
      store.findAndDelete(id)
      render()
    }) 
  })
}



const bindEventListeners = function () {
  handleItemCheckClicked()
  handleDeleteItemClicked()
  handleCloseError()
  handleFilterRating()
  handleNewBookmark()
  handleSubmit()
  handleCancel()
  handleExpandBookmark()
  handleDeleteBookmark()
}


export default {
  render,
  bindEventListeners,
}
