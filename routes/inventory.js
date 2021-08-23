const express = require("express");
const router = express.Router();
const data = require("../data");
const xss = require("xss");
const userdata = data.users;
const inventorydata = data.inventory;



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
        res.render("pages/addInventory");
    } else {
        res.status(500).redirect("/login");
    }
});

router.get("/", async (req, res) => {
    res.render("pages/addInventory");
});

router.post("/", async (req, res) => {
    let newInventory = JSON.parse(JSON.stringify(req.body));

    if (!req.body) {
        res.status(400).json({ error: "You must provide body" });
        return;
    }
    if (!newInventory.productName) {
        res.status(400).json({ error: "You must provide ProductName" });
        return;
    }
    if (!newInventory.productType) {
        res.status(400).json({ error: "You  must provide productType" });
        return;
    }
    if (!newInventory.color) {
        res.status(400).json({ error: "You must provide color" });
        return;
    }
    if (!newInventory.manufacturer) {
        res.status(400).json({ error: "You must provide manufacturer" });
        return;
    }
    if (!newInventory.stock) {
        res.status(400).json({ error: "You must provide stock" });
        return;
    }
    if (!newInventory.price) {
        res.status(400).json({ error: "You must provide price" });
        return;
    }
    if (!newInventory.productId) {
        res.status(400).json({ error: "You must provide ProductId" });
        return;
    }


    try {
        // check if product is existed already by unique productId
        if (await inventorydata.getInventoryByProductId(newInventory.productId)) {
            await inventorydata.addInventory(
                xss(newInventory.productName),
                xss(newInventory.productType),
                xss(newInventory.color),
                xss(newInventory.manufacturer),
                xss(newInventory.stock),
                xss(newInventory.price),
                xss(newInventory.productId)
            );
            //req.session.user = await userdata.getUserByEmail(newUser.email);
            //res.cookie("name", "auth_cookie");
            res.redirect("/inventory/all");
        } else {
            res.status(401).render('pages/addInventory', { title: 'Error In AddInventory', error: "ProductId is Unique and there is already a product Exist of same ProductId!" });
        }
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.get("/all", async (req, res) => {
    if (req.session.user) {

        const allInventory = await inventorydata.getAllInventory();
        
        res.render("pages/inventoryList", {
            inventory: allInventory,
        });
    } else {
        res.status(500).redirect("/private");
    }
});

router.get("/deleteInventory/:pid", async (req, res) => {
    if (req.session.user) {
        try {
            const curr_inventory = await inventorydata.removeInventory(req.params.pid);
            if (curr_inventory) {
                return res.redirect("/inventory/all");

            } else {
            
                    res.status(401).render('pages/inventoryList', { title: 'Failed', error: "Product cannot delete" });
            
            }
        } catch (error) {
            console.log(error);
        }

    } else {
        return res.status(500).redirect("/login");
    }
});

//Individual inventory page
router.get("/:p_id", async (req, res) => {
    try {
        const curr_inventory = await inventorydata.getInventoryById(req.params.p_id);
        
        return res.render("pages/inventory_page", {
            productName: curr_inventory.productName,
            productType: curr_inventory.productType,
            color: curr_inventory.color,
            manufacturer: curr_inventory.manufacturer,
            stock: curr_inventory.stock,
            price: curr_inventory.price,
            productId: curr_inventory.productId,
            
        });
    } catch (e) {
        console.log(e);
        return res.status(400).render("errors/common_error", {
            error: { message: "Could not find the inventory of given ID." },
        });
    }
});


// to buy product

router.get("/buyInventory/:gameId", async (req, res) => {
    const inventoryToBuy = await inventorydata.getInventoryById(req.params.gameId);
    if (req.session.user) {
      try {
        if (gametoRent.available == false && gametoRent.isBorrowed == false) {
          res.render("pages/addRentGame");
        } else {
          res.status(500).redirect("/private");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      res.status(500).redirect("/login");
    }
  });
  router.post("/addRentGame/:gameId", async (req, res) => {
    let rentGame = JSON.parse(JSON.stringify(req.body));
    if (!req.body) {
      res.status(400).json({ error: "You must provide body" });
      return;
    }
    if (!rentGame.rentprice || !rentGame.rentprice.trim()) {
      if (isNaN(rentGame.rentprice)) {
        res.status(400).render("errors/common_error", {
          error: { message: "Invalid rent price passed." },
        });
      }
      res.status(400).json({ error: "You must provide rentprice" });
      return;
    }
    if (!rentGame.duration || !rentGame.duration.trim()) {
      if (isNaN(rentGame.rentprice)) {
        res.status(400).render("errors/common_error", {
          error: { message: "Invalid duration passed." },
        });
      }
      res.status(400).json({ error: "You must provide duration" });
      return;
    }
  
    try {
      let gameId = req.params.gameId;
      await rentgamedata.addRentedGame(
        xss(gameId),
        xss(rentGame.rentprice),
        xss(rentGame.duration),
        xss(req.session.user._id)
      );
      const rentedgame = await gamedata.getGameById(req.params.gameId);
      rentedgame.available = true;
      await gamedata.updateGame(gameId, rentedgame);
      res.redirect("/private");
    } catch (e) {
      res.status(500).json({ error: e });
    }
  });

module.exports = router;
