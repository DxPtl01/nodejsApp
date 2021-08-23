const express = require("express");
const router = express.Router();
const data = require("../data");
const userdata = data.users;
const inventorydata = data.user;
const orderdata = data.order;
const xss = require("xss");

router.get("/", async (req, res) => {
  if (req.session.user) {
    
    const user = await userdata.getUserById(req.session.user._id);
    const user_info = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      userRole: user.userRole,
      address: user.address,
      
    };
    res.render("pages/private", {
      user: user_info,
    });
  } else {
    res.status(500).redirect("/login");
  }
});


router.get("/buyInventory/:pId", async (req, res) => {
  // to get product id,
  // userid,
});

router.post("/buyInventory/:pId", async (req, res) => {
  // to post on personal page
  
});
module.exports = router;
