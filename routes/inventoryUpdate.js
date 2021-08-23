const express = require("express");
const router = express.Router();
const data = require("../data");
const userdata = data.users;
const inventorydata = data.inventory;
const { ObjectId } = require("mongodb");

router.get("/:id", async (req, res) => {
    if (req.session.user) {
        res.render("pages/inventoryUpdate");
      } else {
        res.status(500).redirect("/login");
    }
    
});

router.post("/:pid", async (req, res) => {
    let newInventory = JSON.parse(JSON.stringify(req.body));
    try {
        const updateData = await inventorydata.updateInventory(ObjectId(req.params.pid),newInventory);
        if(updateData){
            return  res.redirect("/inventory/all");
        } else {
            return res.render("errors/common_error", {
                error: { message: "The inventory  can not be updated." },
              });
        }
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

module.exports = router;