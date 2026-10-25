const express = require('express');
const router = express.Router();
const {
  getAll,
  create,
  update,
  remove,
} = require('../controllers/budgetController');
const protect = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getAll)
  .post(create);

router.route('/:id')
  .put(update)
  .delete(remove);

module.exports = router;
