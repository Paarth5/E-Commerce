const express = require("express");
const mongoose = require("mongoose");
const Product = require("./Models/product");
const Review = require("./Models/reviews");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const { log } = require("console");

mongoose
  .connect("mongodb://127.0.0.1:27017/products")
  .then(() => {
    console.log("Connected to mongo!!");
  })
  .catch((err) => {
    console.log("Error in connecting to Mongo", err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.redirect("/products");
});

app.get("/products", async (req, res) => {
  const items = await Product.find({});
  res.render("products/home", { items });
});
app.post("/products", async (req, res) => {
  const newItem = new Product(req.body.item);
  await newItem.save();
  res.redirect("/products");
});

app.get("/products/new", async (req, res) => {
  res.render("products/new");
});

app.get("/products/:id", async (req, res) => {
  const item = await Product.findById(req.params.id).populate("reviews");
  res.render("products/show", { item });
});
app.get("/products/:id/edit", async (req, res) => {
  const item = await Product.findById(req.params.id);
  res.render("products/edit", { item });
});
app.delete("/products/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  for (let review of product.reviews) {
    await Review.findByIdAndDelete(review);
  }
  await Product.findByIdAndDelete(req.params.id);
  res.redirect("/products");
});
app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  await Product.findByIdAndUpdate(id, { ...req.body.product });
  res.redirect("/products");
});

// for Reviews
app.post("/products/:id/review", async (req, res) => {
  const item = await Product.findById(req.params.id);
  const newReview = new Review(req.body.review);
  const review = await newReview.save();
  item.reviews.push(review);
  await item.save();
  res.redirect(`/products/${req.params.id}`);
});
app.get("/products/:id/review/:reviewid", async (req, res) => {
  const review = await Review.findById(req.params.reviewid);
  const item = await Product.findById(req.params.id);
  res.render("reviews/edit", { item, review });
});
app.put("/products/:id/review/:reviewid", async (req, res) => {
  const editedReview = await Review.findByIdAndUpdate(req.params.reviewid, {
    ...req.body.review,
  });
  res.redirect(`/products/${req.params.id}`);
});
app.delete("/products/:id/review/:reviewid", async (req, res) => {
  await Review.findByIdAndDelete(req.params.reviewid);
  res.redirect(`/products/${req.params.id}`);
});

app.listen(3000, () => {
  console.log("Listening to port 3000!!");
});
