const express = require('express');
const router = express.Router();
const { Book } = require('../models');


/* Handler function to wrap each route. */
function asyncHandler(callback){
  return async(req, res, next) => {
    try {
      await callback(req, res, next)
    } catch(error){
      res.status(500).send(error);
    }
  }
}

// TODO review every route
/* GET books listing. */
router.get('/', asyncHandler(async (req, res) => {
  console.log('hello')
  const books = await Book.findAll();
  res.render("books/index", {  books, title: "Library Catalog" });
}));

/* Create a new book form. */
router.get('/new', (req, res) => {
  res.render("books/new", { book: {}, title: "New Book" });  // passing in an empty object for book so pug form doesn't throw undefined error
});

/* POST create book. */
router.post('/', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/books/" + book.id);
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render("books/new", { book, errors:error.errors, title: "New Book" });
    } else {
      throw error; // error to be caught in asyncHandler's catch block
    }
  }
}));

/* Edit book form. */
router.get("/:id/edit", asyncHandler(async(req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render("books/edit", { book, title: "Edit Book" });
  } else {
    res.sendStatus(404);
  }
}));

/* GET individual book. */
router.get("/:id", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render("books/show", { book, title: book.title }); 
  } else {
    res.sendStatus(404);
  }
}));

/* Update an book. */
router.post('/:id/edit', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect("/books/" + book.id);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render("books/edit", { book, errors:error.errors, title: "New Book" });
    } else {
      throw error; // error to be caught in asyncHandler's catch block
    }
  }
}));

/* Delete book form. */
router.get("/:id/delete", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render("books/delete", { book, title: "Delete Book" });
  } else {
    res.sendStatus(404);
  }
}));

/* Delete individual book. */
router.post('/:id/delete', asyncHandler(async (req ,res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    await book.destroy();
    res.redirect("/books");
  } else {
    res.sendStatus(404);
  }
}));

module.exports = router;