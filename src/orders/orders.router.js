const router = require("express").Router();
const { create, list, read, update } = require("./orders.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");
const controller = require("./orders.controller");

// TODO: Implement the /orders routes needed to make the tests pass
router
  .route("/:orderId")
  .get(read)
  .put(update)
  .delete(controller.delete)
  .all(methodNotAllowed);

router.route("/").get(list).post(create).all(methodNotAllowed);

module.exports = router;
