const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass

//CREATE ORDER
function create(req, res) {
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
  const newOrder = {
    id: nextId(),
    deliverTo,
    mobileNumber,
    status,
    dishes,
  };
  orders.push(newOrder);
  res.status(201).json({ data: newOrder });
}

//VALIDATE: ORDER EXISTS
function orderExists(req, res, next) {
  const orderId = req.params.orderId;
  const foundOrder = orders.find((order) => order.id === orderId);
  if (foundOrder) {
    res.locals.order = foundOrder;
    return next();
  }
  next({ status: 404, message: `Order id not found: ${req.params.orderId}` });
}
//VALIDATE: HAS DELIVER_TO
function hasDeliverTo(req, res, next) {
  const { data: { deliverTo } = {} } = req.body;

  if (deliverTo) {
    return next();
  }
  next({ status: 400, message: "Order must include a deliverTo." });
}

//VALIDATE: HAS MOBILE NUMBER
function hasMobileNumber(req, res, next) {
  const { data: { mobileNumber } = {} } = req.body;

  if (mobileNumber) {
    return next();
  }
  next({ status: 400, message: "Order must include a mobileNumber." });
}

//VALIDATE: HAS STATUS
function hasStatus(req, res, next) {
  const validStatus = ["pending", "preparing", "out-for-delivery", "delivered"];
  const { data: { status } = {} } = req.body;
  if (!status) {
    next({
      status: 400,
      message:
        "Order must have a status of pending, preparing, out-for-delivery, delivered",
    });
  }
  if (!validStatus.includes(status)) {
    next({
      status: 400,
      message: `The 'status' property must be one of ${validStatus}. Received: ${status}`,
    });
  }
  if (status === "delivered") {
    next({
      status: 400,
      message: "A delivered order cannot be changed",
    });
  }
  return next();
}

//VALIDATE: HAS DISHES
function hasDishes(req, res, next) {
  const { data: { dishes } = {} } = req.body;

  if (dishes) {
    return next();
  }
  next({ status: 400, message: "Order must include a dish." });
}

//VALIDATE: HAS DISHES
function dishesIsValid(req, res, next) {
  const { data: { dishes } = {} } = req.body;

  if (!Array.isArray(dishes) || dishes.length <= 0) {
    next({ status: 400, message: "Order must include at least one dish." });
  }
  next();
}

//VALIDATE: DISH HAS VALID QUANTITY
function hasValidDishQuantity(req, res, next) {
  const { data: { dishes } = {} } = req.body;

  dishes.forEach((dish) => {
    if (
      !dish.quantity ||
      dish.quantity <= 0 ||
      typeof dish.quantity !== "number"
    ) {
      next({
        status: 400,
        message: `Dish ${dish.id} must have a quantity ${dish.quantity}that is an integer greater than 0.`,
      });
    }
  });
  return next();
}

//LIST ORDER
function list(req, res) {
  res.json({ data: orders });
}

//CHECK IF ORDER EXISTS
function orderExists(req, res, next) {
  const orderId = req.params.orderId;
  const foundOrder = orders.find((order) => order.id === orderId);
  if (foundOrder) {
    return next();
  }
  next({
    status: 404,
    message: `Order id not found: ${req.params.orderId}`,
  });
}

function orderPending(req, res, next) {
  const orderId = req.params.orderId;
  const foundOrder = orders.find((order) => order.id === orderId);
  if (foundOrder.status !== "pending") {
    next({
      status: 400,
      message: "An order cannot be deleted unless it is pending",
    });
  }
  return next();
}
//READ EXISTING ORDER DATA
function read(req, res) {
  const { orderId } = req.params;
  const foundOrder = orders.find((order) => (order.id = orderId));
  res.json({ data: foundOrder });
}
//REQUEST ID MATCHES ROUTE
function matchID(req, res, next) {
  const { data: { id } = {} } = req.body;
  const { orderId } = req.params;
  if (id && orderId != id) {
    return next({
      status: 400,
      message: `Order id does not match route id. Order: ${id}, Route: ${orderId}`,
    });
  }
  next();
}
//UPDATE ORDER
function update(req, res) {
  const { orderId } = req.params;
  const foundOrder = orders.find((order) => order.id === orderId);

  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;

  foundOrder.deliverTo = deliverTo;
  foundOrder.mobileNumber = mobileNumber;
  foundOrder.status = status;
  foundOrder.dishes = dishes;

  res.json({ data: foundOrder });
}
function destroy(req, res) {
  const { orderId } = req.params;
  const index = orders.findIndex((order) => order.id === Number(orderId));
  if (index > -1) {
    notes.splice(index, 1);
  }
  res.sendStatus(204);
}

module.exports = {
  create: [
    hasDeliverTo,
    hasMobileNumber,
    hasDishes,
    dishesIsValid,
    hasValidDishQuantity,
    create,
  ],
  list,
  read: [orderExists, read],
  update: [
    orderExists,
    hasDeliverTo,
    hasMobileNumber,
    hasStatus,
    hasDishes,
    dishesIsValid,
    hasValidDishQuantity,
    matchID,
    update,
  ],
  delete: [orderExists, orderPending, destroy],
};
