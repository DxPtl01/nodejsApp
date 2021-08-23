const mongoCollections = require("../config/mongoCollection");
const inventory = mongoCollections.inventory;


var BSON = require("mongodb");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

let exportedMethods = {

    async getAllInventory() {
        const inventoryCollection = await inventory();
        const allInventory = await inventoryCollection.find({}).toArray();
        if (!allInventory) throw "empty database - getAllInventory";
        return allInventory;
    },

    async getInventoryById(id) {
        const inventoryCollection = await inventory();
        const item = await inventoryCollection.findOne({ _id: ObjectId(id) });
        if (!item) throw "inventory not found - getInventoryById";
        return item;
    },

    async getInventoryByProductId(productId) {
        const inventoryCollection = await inventory();
        const item = await inventoryCollection.findOne({ productId: productId });
        if (item != null) {
            return false;
        } else {
            return true;
        }
    },


    async addInventory(productName, productType, color, manufacturer, stock, price, productId) {

        if (typeof productName != "string") throw "invalid name - addInventory";
        if (typeof productType != "string") throw "invalid productType - addInventory";
        if (typeof color != "string") throw "invalid color - addInventory";
        if (typeof manufacturer != "string") throw "invalid manufacturer - addInventory";
        if (typeof stock != "string") throw "invalid stock - addInventory";
        if (typeof price != "string") throw "invalid price - addInventory";
        if (typeof productId != "string") throw "invalid productId - addInventory";

        let newInventory = {
            productName: productName,
            productType: productType,
            color: color,
            manufacturer: manufacturer,
            stock: stock,
            price: price,
            productId: productId,
        };

        const inventoryCollection = await inventory();
        const newInsertInformation = await inventoryCollection.insertOne(newInventory);
        if (newInsertInformation.insertedCount === 0) throw "Insert failed! - addInventory";
        return newInsertInformation.insertedId;
    },

    async removeInventory(id) {
        if (!id || typeof(id) !== 'string') throw `inventoryID: ${id} is Invalid. Please provide a BookId of string DataType.`;
        const inventoryCollection = await inventory();

        //const sellCollection = await sellGameData();
        const deletedInventory = await inventoryCollection.removeOne({
            _id: ObjectId(id),
        });


        if (deletedInventory.deletedCount === 0) {
            throw `Could not delete inventory with id of ${id} -  deletedInventory`;
        }
        return true;
    },


    // async updateInventory(id, updatedInventory) {
    //     let oldInventory = await this.getInventoryById(id);
    //     let updateInventory = {
    //       productName: oldInventory.productName,
    //       productType: oldInventory.productType,
    //       color: oldInventory.color,
    //       manufacturer: oldInventory.manufacturer,
    //       stock: oldInventory.stock,
    //       price: oldInventory.price,
    //     };
    //     if (updatedInventory.email != "" && typeof updatedInventory.email == "string") {
    //         updateInventory.email = updatedInventory.email.toLowerCase();
    //     }
    //     if (updatedInventory.password != "" && typeof updatedInventory.password == "string") {
    //       let newpass = await bcrypt.hash(updatedInventory.password, saltRounds);
    //       updateInventory.password = newpass;
    //     }
    //     if (updatedInventory.firstname != "" && typeof updaupdatedInventorytedUser.firstname == "string") {
    //         updateInventory.firstName = updatedInventory.firstname;
    //     }
    //     if (updatedInventory.lastname != "" && typeof updatedInventory.lastname == "string") {
    //         updateInventory.lastName = updatedInventory.lastname;
    //     }
    //     if (updatedInventory.address != "" && typeof updatedInventory.address == "string") {
    //         updateInventory.address = updatedInventory.address;
    //     }
    //     if (updatedInventory.userRole != "" && typeof updatedInventory.userRole == "string") {
    //         updateInventory.userRole = updatedInventory.userRole;
    //     }
    
    //     const inventoryData = await inventory();
    
    //     const updatedInfo = await inventoryData.updateOne(
    //       { _id: ObjectId(id) },
    //       { $set: updateInventory }
    //     );
    
    //     if (updatedInfo.matchedCount && updatedInfo.modifiedCount){
    //        return true;
    //     }
    //     else{
    //         return false;
    //     }
    //   },
    async updateInventory(id, updatedInventory) {
        let updateInventory = {
            productName: updatedInventory.productName,
            productType: updatedInventory.productType,
            color: updatedInventory.color,
            manufacturer: updatedInventory.manufacturer,
            stock: updatedInventory.stock,
            price: updatedInventory.price,
            productId: updatedInventory.productId,
        };

        const inventoryCollection = await inventory();
        const updatedInfo = await inventoryCollection.updateOne(
            { _id: ObjectId(id) },
            { $set: updateInventory }
        );
        if (updatedInfo.modifiedCount){
            return true;
        }
        else{
            return false;
        }

    },

};

module.exports = exportedMethods;
