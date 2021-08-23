const mongoCollections = require("../config/mongoCollection");
const user = mongoCollections.user;
const inventory = mongoCollections.inventory;
const order = mongoCollections.order;


const rentGameData = mongoCollections.game_rent;
const sellGameData = mongoCollections.game_sell;
// const commentData = require("./comment");
var BSON = require("mongodb");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

let exportedMethods = {

    async getAllOrder() {
        const orderCollection = await order();
        const allOrder = await orderCollection.find({}).toArray();
        if (!allOrder) throw "empty database";
        return allOrder;
    },

    async getOrderById(id) {
        const orderCollection = await order();
        const order = await orderCollection.findOne({ _id: ObjectId(id) });
        if (!order) throw "Game not found";
        return order;
    },
    async getGameByUserId(id) {
        const orderCollection = await order();
        const order = await orderCollection.find({ sellerId: id }).toArray();
        if (!order) throw "user has no game";
        return order;
    },

    async addOrder(sellerId, productId, totalQty, order_cost, address, deliveryDate) {
        if (!ObjectId.isValid(sellerId)) throw "invalid sellerId";
        if (typeof totalQty != "string") throw "invalid name";
        if (typeof order_cost != "string") throw "invalid genre";
        if (typeof address != "string") throw "invalid gameDetail";
        if (typeof deliveryDate != "string") throw "invalid releaseDate";

        const orderCollection = await order();

        let newOrder = {
            sellerId: sellerId,
            productId: productId,
            totalQty: totalQty,
            order_cost: order_cost,
            address: address,
            deliveryDate: deliveryDate,
        };

        const newInsertInformation = await orderCollection.insertOne(newOrder);
        if (newInsertInformation.insertedCount === 0) throw "Insert failed!";
        return newInsertInformation.insertedId;
    },
    async removeOrder(id) {
        const orderCollection = await order();
        // const userCollection = await user();


        curr_order = await this.getOrderById(id);
        if (curr_order) {
            const deleteOrder = await orderCollection.removeOne({ _id: ObjectId(id) });
            if (deleteOrder) {
                return true;
            } else {
                throw 'Order cannot be deleted';
            }
        }
        else {
            throw 'Given order id does not exist';
        }

    },


    async updateOrder(id, updatedOrder) {
        let updateOrder = {
            sellerId: updatedOrder.sellerId,
            productId: updatedOrder.productId,
            totalQty: updatedOrder.totalQty,
            order_cost: updatedOrder.order_cost,
            address: updatedOrder.address,
            deliveryDate: updatedOrder.deliveryDate,

        };

        const orderCollection = await order();
        const updatedInfo = await orderCollection.updateOne(
            { _id: ObjectId(id) },
            { $set: updateGame }
        );
        if (!updatedInfo.matchedCount && !updatedInfo.modifiedCount)
            throw "Update failed";

        return;
    },


};

module.exports = exportedMethods;
