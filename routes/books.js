const express = require('express');
const router = express.Router();
const { Book } = require('../models');
const { Op } = require("sequelize");

/* Handler function to wrap each route. */
function asyncHandler(callback) {
	return async (req, res, next) => {
		try {
			await callback(req, res, next);
		} catch (error) {
			console.log(error);
			res.locals.message = error.message;
			res.status(error.status || 500);
			res.render('books/error');
		}
	};
}

/* GET books listing. */
router.get('/', asyncHandler(async (req, res) => {
	let books = [];
	let searchStr = req.query.search;
  if (searchStr) {
    console.log(searchStr)
    books = await Book.findAll({
      where: {
        [Op.or]: [
          {
            title: {
              [Op.like]: `%${searchStr}%`
            }
          },
          {
            author: {
              [Op.like]: `%${searchStr}%`
            }
          },
          {
            genre: {
              [Op.like]: `%${searchStr}%`
            }
          },
          {
            year: {
              [Op.like]: `%${searchStr}%`
            }
          }
        ]
      }
    });
	} else {
		searchStr= '';
	  // get all books in the database and order alphabetically
    books = await Book.findAll({ order: [ [ 'title', 'ASC' ] ] });
  }
  res.render('books/index', {
		books,
		title: 'Library Catalog',
		searchStr 
	 });
}));

/* Create a new book page. */
router.get('/new', (req, res) => {
	res.render('books/new-book', { book: {}, title: 'New Book' }); // passing in an empty object for book so pug form doesn't throw undefined error
});

/* POST create book. */
router.post('/', asyncHandler(async (req, res) => {
		let book;
		try {
			book = await Book.create(req.body);
			res.redirect('/books');
		} catch (error) {
			if (error.name === 'SequelizeValidationError') {
				book = await Book.build(req.body);
				res.render('books/new-book', { book, errors: error.errors, title: 'New Book' });
			} else {
				throw Error('Oh dear, there was a problem with saving that book.');
			}
		}
	})
);

/* Show a book. */
router.get('/:id', asyncHandler(async (req, res, next) => {
		const book = await Book.findByPk(req.params.id);
		if (book) {
			res.render('books/update-book', { book, title: book.title });
		} else {
			throw Error('Our sincerest apologies, we could not find that book.');
		}
	})
);

/* Update a book. */
router.post('/:id',	asyncHandler(async (req, res) => {
		let book;
		let title;
		try {
			book = await Book.findByPk(req.params.id);
			if (book) {
				await book.update(req.body);
				res.redirect('/books');
			} else {
				throw Error('Our sincerest apologies, we could not find that book and thus we could not update it.');
			}
		} catch (error) {
			if (error.name === 'SequelizeValidationError') {
				title = book.title;
				book = await Book.build(req.body);
				book.id = req.params.id;
				res.render('books/update-book', { book, errors: error.errors, title });
			} else {
				throw Error("We're so sorry, there was a problem with updating that book.");
			}
		}
	})
);

/* Delete individual book. */
router.post('/:id/delete', asyncHandler(async (req, res) => {
		const book = await Book.findByPk(req.params.id);
		if (book) {
			await book.destroy();
			res.redirect('/books');
		} else {
			throw Error(
				"We regret to inform you that there was a problem trying to delete that book. Perhaps instead you'd like to set it on fire?"
			);
		}
	})
);

module.exports = router;
