'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class Book extends Sequelize.Model {}
  Book.init({
    title: {
      type: Sequelize.STRING,
      validate: {
        notEmpty: {
          msg: "Please include a title."
        }
      }
    },
    author: {
      type: Sequelize.STRING,
      validate: {
        notEmpty: {
          msg: "Please include an author."
        }
      }
    },
    genre: Sequelize.STRING,
    year: {
      type: Sequelize.INTEGER,
      validate: {
        max: {
          args: 9999,
          msg: "Year must not be in the future."
        }
      }
    }
  }, { sequelize });

  return Book;
};