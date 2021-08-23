const registerRoute = require("./register");
const loginRoute = require("./login");
const privateRoute = require("./private");
const logoutRoute = require("./logout");
const userUpdateRoute = require("./userUpdateRoute");
const inventoryRoutes = require("./inventory");
const inventoryUpdateRoute = require("./inventoryUpdate");


const constructorMethod = (app) => {
  app.get("/", function (req, res) {
    res.render("pages/index");
  });
  app.use("/register", registerRoute);
  app.use("/login", loginRoute);
  app.use("/logout", logoutRoute);
  app.use("/private", privateRoute);
  app.use("/userUpdate", userUpdateRoute);
  app.use("/inventoryUpdate", inventoryUpdateRoute);
  app.use("/inventory", inventoryRoutes);
  app.get("/getSession", async (req, res) => {
    if (req.session.user) {
      res.json({ result: true, name: req.session.user.email });
      return;
    }
    res.json({ result: false });
    return;
  });
};

module.exports = constructorMethod;
