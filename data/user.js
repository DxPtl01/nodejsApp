const bcrypt = require("bcrypt");
const saltRounds = 8;
var BSON = require("mongodb");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const mongoCollections = require("../config/mongoCollection");
const users = mongoCollections.user;
const order = mongoCollections.order;

let exportedMethods = {

  async getAllUsers() {
    const userData = await users();
    const allusers = await userData.find({}).toArray();
    if (!allusers) throw "empty database";
    return allusers;
  },

  async getUserById(id) {
    const userData = await users();
    const user = await userData.findOne({ _id: ObjectId(id) });
    if (!user) throw "User not found";
    return user;
  },

  async getUserByEmail(email) {
    const userData = await users();
    const user = await userData.findOne({ email: email });
    if (!user) throw "User not found hahah";
    const cookie = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    return cookie;
  },

  async checkuserByEmail(email) {
    if (typeof email != "string") {
      throw "email type is error.";
    }
    const usersCollection = await users();
    const repe = await usersCollection.findOne({ email: email });
    if (repe != null) {
      return false;
    } else {
      return true;
    }
  },

  async checkUser(email, password) {
    if (typeof email != "string") {
      throw "email type is error.";
    }
    const usersCollection = await users();
    const repe = await usersCollection.findOne({ email: email });
    if (repe == null) {
      return false;
    }
    const db_password = repe.password;
    let authenticated = await bcrypt.compare(password, db_password);
    if (authenticated) {
      return true;
    } else {
      return false;
    }
  },


  async addUser(email, password, firstName, lastName, userRole, address) {
    const userData = await users();

    //error check
    if (typeof email != "string") throw "invalid email";
    if (typeof password != "string") throw "invalid password";
    if (typeof firstName != "string") throw "invalid firstname";
    if (typeof lastName != "string") throw "invalid lastName";
    if (typeof address != "string") throw "invalid address";
    if (typeof userRole != "string") throw "invalid userRole";

    //bcrypt the password
    let newpass = await bcrypt.hash(password, saltRounds);

    let newUser = {
      email: email,
      password: newpass,
      firstName: firstName,
      lastName: lastName,
      userRole: userRole,
      address: address,
      orderId: [],

    };

    const insertUser = await userData.insertOne(newUser);
    if (insertUser.insertedCount === 0) throw "Insert failed!";
    return await this.getUserById(insertUser.insertedId);
  },

  async removeUser(id) {
    const userData = await users();
    const deletedUser = await userData.removeOne({
      _id: BSON.ObjectID.createFromHexString(id),
    });
    if (deletedUser.deletedCount === 0) {
      throw `Could not delete user with id of ${id}`;
    }
    return true;
  },
  async updateUser(id, updatedUser) {
    let oldUser = await this.getUserById(id);
    let updateUser = {
      email: oldUser.email,
      password: oldUser.password,
      firstName: oldUser.firstName,
      lastName: oldUser.lastName,
      userRole: oldUser.userRole,
      address: oldUser.address,
      orderId: oldUsery.orderId
    };
    if (updatedUser.email != "" && typeof updatedUser.email == "string") {
      updateUser.email = updatedUser.email.toLowerCase();
    }
    if (updatedUser.password != "" && typeof updatedUser.password == "string") {
      let newpass = await bcrypt.hash(updatedUser.password, saltRounds);
      updateUser.password = newpass;
    }
    if (
      updatedUser.firstname != "" &&
      typeof updatedUser.firstname == "string"
    ) {
      updateUser.firstName = updatedUser.firstname;
    }
    if (updatedUser.lastname != "" && typeof updatedUser.lastname == "string") {
      updateUser.lastName = updatedUser.lastname;
    }
    if (updatedUser.address != "" && typeof updateUser.address == "string") {
      updateUser.address = updatedUser.address;
    }
    if (updatedUser.userRole != "" && typeof updateUser.userRole == "string") {
      updateUser.userRole = updatedUser.userRole;
    }

    const userData = await users();

    const updatedInfo = await userData.updateOne(
      { _id: id },
      { $set: updateUser }
    );

    if (!updatedInfo.matchedCount && !updatedInfo.modifiedCount)
      throw "Update failed";
    return;
  },

  // user interactive with order (add order)
  async addOrderToUser(userId, orderID) {
    const userCollection = await users();
    const updateInfo = await userCollection.updateOne(
      { _id: ObjectId(userId) },
      { $addToSet: { orderId: { id: ObjectId(orderID) } } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw "Add order to user failed";

    return;
  },

  // remove the order
  async removeOwnedOrderId(userId, orderID) {
    const userCollection = await users();
    const updateInfo = await userCollection.updateOne(
      { _id: ObjectId(userId) },
      { $pull: { orderId: { id: ObjectId(orderID) } } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw "Update failed";

    return;
  },


};

module.exports = exportedMethods;
