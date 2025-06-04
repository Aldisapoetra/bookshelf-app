document.addEventListener("DOMContentLoaded", () => {
  const bookForm = document.getElementById("bookForm")
  const searchForm = document.getElementById("searchBook")
  const incompleteBookList = document.getElementById("incompleteBookList")
  const completeBookList = document.getElementById("completeBookList")
  const submitForm = document.getElementById("bookFormSubmit")
  const submitRak = document.getElementById("submitRak")
  const checkBox = document.getElementById("bookFormIsComplete")

  checkBox.addEventListener("change", () => {
    if (checkBox.checked) {
      submitRak.innerText = "Selesai dibaca"
    } else {
      submitRak.innerText = "Belum selesai dibaca"
    }
  })

  const STORAGE_KEY = "BOOKSHALF_APP"
  let books = []

  const loadBookFromStorage = () => {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      books = JSON.parse(data)
    }
  }

  const saveBookToStorage = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books))
  }

  const renderBooks = () => {
    incompleteBookList.innerHTML = ""
    completeBookList.innerHTML = ""

    for (const book of books) {
      const bookElement = createBookElement(book)

      if (book.isComplete) {
        completeBookList.appendChild(bookElement)
      } else {
        incompleteBookList.appendChild(bookElement)
      }
    }
  }

  const createBookElement = (book) => {
    const bookDiv = document.createElement("div")
    bookDiv.setAttribute("data-bookid", book.id)
    bookDiv.setAttribute("data-testid", "bookItem")

    const title = document.createElement("h3")
    title.innerText = book.title
    title.setAttribute("data-testid", "bookItemTitle")

    const author = document.createElement("p")
    author.innerText = `Author: ${book.author}`
    author.setAttribute("data-testid", "bookItemAuthor")

    const year = document.createElement("p")
    year.innerText = `Tahun: ${book.year}`
    year.setAttribute("data-testid", "bookItemYear")

    const buttonContainer = document.createElement("div")

    const toggleButton = document.createElement("button")
    toggleButton.innerText = book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"
    toggleButton.setAttribute("data-testid", "bookItemIsCompleteButton")
    toggleButton.addEventListener("click", () => toggleBookCompletion(book.id))

    const deleteBotton = document.createElement("button")
    deleteBotton.innerText = "Hapus buku"
    deleteBotton.setAttribute("data-testid", "bookItemDeleteBotton")
    deleteBotton.addEventListener("click", () => deleteBook(book.id))

    const editButton = document.createElement("button")
    editButton.innerText = "Edit buku"
    editButton.setAttribute("data-testid", "bookItemEditButton")
    editButton.addEventListener("click", () => {
      showEditForm(book)
      bookForm.removeChild(submitForm)
    })

    buttonContainer.appendChild(toggleButton)
    buttonContainer.appendChild(deleteBotton)
    buttonContainer.appendChild(editButton)

    bookDiv.appendChild(title)
    bookDiv.appendChild(author)
    bookDiv.appendChild(year)
    bookDiv.appendChild(buttonContainer)

    const showEditForm = (book) => {
      const titleInput = document.getElementById("bookFormTitle")
      const authorInput = document.getElementById("bookFormAuthor")
      const yearInput = document.getElementById("bookFormYear")
      const isCompleteInput = document.getElementById("bookFormYear")
      const updateButton = document.getElementById("bookFormUpdate")

      // Mengisi form dengan data buku
      titleInput.value = book.title
      authorInput.value = book.author
      yearInput.value = book.year
      isCompleteInput.checked = book.isComplete

      // Menampilkan tombol update buku dan menyembunyikan tombol submit
      updateButton.removeAttribute("hidden")
      submitForm.setAttribute("hidden", true)
      // submitForm.setAttribute("disabled", true)

      updateButton.addEventListener("click", (event) => {
        updateButton.setAttribute("hidden", true)
        submitForm.removeAttribute("hidden")
        editBook(
          book.id,
          titleInput.value,
          authorInput.value,
          parseInt(yearInput.value),
          isCompleteInput.checked
        )

        document.getElementById("bookForm").reset()
        window.location.reload()
      })
    }

    return bookDiv
  }


  const addBook = (title, author, year, isComplete) => {
    const book = {
      id: +new Date(),
      title,
      author,
      year,
      isComplete
    }

    books.push(book)
    saveBookToStorage()
    renderBooks()
  }

  const toggleBookCompletion = (bookId) => {
    const book = books.find((book) => book.id == bookId)
    if (book) {
      book.isComplete = !book.isComplete
      saveBookToStorage()
      renderBooks()
    }
  }

  const deleteBook = (bookId) => {
    books = books.filter((book) => bookId !== book.id)
    saveBookToStorage()
    renderBooks()
  }

  const editBook = (bookId, newTitle, newAuthor, newYear, newIsComplete) => {
    const book = books.find((book) => book.id === bookId)

    if (book) {
      book.title = newTitle;
      book.author = newAuthor;
      book.year = newYear;
      book.isComplete = newIsComplete;
    }

    saveBookToStorage()
    renderBooks()
  }

  const searchBook = (bookTitle) => {
    const filteredBooks = books.filter((book) =>
      book.title.toLowerCase().includes(bookTitle.toLowerCase())
    )

    incompleteBookList.innerHTML = ""
    completeBookList.innerHTML = ""

    for (const book of filteredBooks) {
      const bookElement = createBookElement(book)
      if (book.isComplete) {
        completeBookList.appendChild(bookElement)
      } else {
        incompleteBookList.appendChild(bookElement)
      }
    }
  }

  bookForm.addEventListener("submit", () => {
    const title = document.getElementById("bookFormTitle").value
    const author = document.getElementById("bookFormAuthor").value
    const year = parseInt(document.getElementById("bookFormYear").value)
    const isComplete = document.getElementById("bookFormIsComplete").checked

    addBook(title, author, year, isComplete)
    bookForm.reset()
  })

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault()
    const query = document.getElementById("searchBookTitle").value
    searchBook(query)
  })

  loadBookFromStorage()
  renderBooks()
})