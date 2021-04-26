const path = require("path");
const notFound = require("../errors/notFound");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

//CREATE DISH
function create(req, res) {
  const { data: { name, description, price, image_url } = {} } = req.body;
  const newDish = {
    id: nextId(),
    name,
    description,
    price,
    image_url,
  };
  dishes.push(newDish);
  res.status(201).json({ data: newDish });
}

//VALIDATE: HAS NAME
function hasName(req, res, next) {
  const { data: { name } = {} } = req.body;

  if (name) {
    return next();
  }
  next({ status: 400, message: "Dish must include a name" });
}
//VALIDATE: HAS DESCRIPTION
function hasDescription(req, res, next) {
  const { data: { description } = {} } = req.body;

  if (description) {
    return next();
  }
  next({ status: 400, message: "Dish must include a description" });
}
//VALIDATE: HAS PRICE
function hasPrice(req, res, next) {
  const { data: { price } = {} } = req.body;

  if (price) {
    return next();
  }
  next({ status: 400, message: "Dish must include a name" });
}
//VALIDATE: HAS VALID PRICE
function priceIsValid(req, res, next) {
  const { data: { price } = {} } = req.body;

  if (price <= 0 || typeof price !== "number") {
    next({
      status: 400,
      message: "Dish must have a price that is an integer greater than 0",
    });
  }
  next();
}
//VALIDATE: HAS IMAGE URL
function hasURL(req, res, next) {
  const { data: { image_url } = {} } = req.body;

  if (image_url) {
    return next();
  }
  next({ status: 400, message: "Dish must include an image_url" });
}
//LIST DISHES
function list(req, res) {
  res.json({ data: dishes });
}
//CHECK IF DISH EXISTS
function dishExists(req, res, next) {
  const { dishId } = req.params;
  const foundDish = dishes.find((dish) => dish.id === dishId);
  if (foundDish) {
    return next();
  }
  next({
    status: 404,
    message: `Dish id not found: ${req.params.dishId}`,
  });
}
//READ EXISTING DISH DATA
function read(req, res) {
  const dishId = Number(req.params.dishId);
  const foundDish = dishes.find((dish) => (dish.id = dishId));
  res.json({ data: foundDish });
}
function matchID(req, res, next) {
  const { data: { id } = {} } = req.body;
  const { dishId } = req.params;
  if (id && dishId != id) {
    return next({
      status: 400,
      message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`,
    });
  }
  next();
}
//UPDATE DISH
function update(req, res, next) {
  const { dishId } = req.params;
  const { data: { name, description, price, image_url } = {} } = req.body;

  const foundDish = dishes.find((dish) => dish.id === dishId);

  foundDish.name = name;
  foundDish.description = description;
  foundDish.price = price;
  foundDish.image_url = image_url;
  res.json({ data: foundDish });
}

module.exports = {
  create: [hasName, hasDescription, priceIsValid, hasPrice, hasURL, create],
  list,
  read: [dishExists, read],
  update: [
    dishExists,
    hasName,
    hasDescription,
    priceIsValid,
    hasPrice,
    hasURL,
    matchID,
    update,
  ],
};
