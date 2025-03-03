const mongoose = require('mongoose');
const User = require('../models/User');
const Schema = mongoose.Schema;

/*
 * PLEASE READ: I've implemented some basic
 * features for the task class, and I've put in 
 * some basic features for a chores subclass.
 * I've tried my best to outline the basics of 
 * how to use Mongo discriminators to create
 * subclasses. See the Chore class for an
 * example of this in use.
 */





/* 
 * Discriminator enables multiple variants of the  
 * same class each with their own fields and methods.
 * Enables all tasks to be stored in the same collection.
 * Essentially a means of creating a parent class and subclasses.
 */
const options = { discriminatorKey: 'type', collection: 'tasks' };

/* Schema for the task class */
const taskSchema = new mongoose.Schema({
    taskId: Number,
    creatorId: Number
}, options);

taskSchema.methods.notify = function() {
    //TODO: implement this method after notification class is made
};

/* creates the task class */
const Task = mongoose.model('Task', taskSchema)


/* Chore subclass of Task class. It will contain 
 * a schema which shows the new fields not inherited
 * from the task class (order, description, and whoseTurn).
 * Then I have an example of a method for the subclass,
 * and finally we turn the schema into a model
 */
const choreSchema = new mongoose.Schema({
    order: [{ type: Schema.Types.ObjectID, ref: 'User'}], //establishes order as an array of users
    description: String,
    whoseTurn: Number
});

/* method to rotate to the next user */
choreSchema.methods.switchUser = function() {
    if (this.order.length === 0) return null; // No users in the order
    
    this.whoseTurn = (this.whoseTurn + 1) % this.order.length; // Move to the next user
    return this.order[this.whoseTurn]; // Return the new current user's ID
};

/* create model for the chore class using the discriminator and the schema */
const Chore = Task.discriminator('Chore', choreSchema);

/* ADD NEW SUBCLASSES BELOW, FEEL FREE TO USE CHORE AS A GUIDE */


/* Grocery subclass of Task class.*/
const grocerySchema = new mongoose.Schema({
    itemName: String,
    description: String,
    purchaser: { type: Schema.Types.ObjectId, ref: 'User' },
    owed: [Number],
    requesters: [String],
    fulfilled: Boolean,
    paid: Boolean,
});

// Get itemName
grocerySchema.methods.getItemName = function() {
    return this.itemName;
};

// Set itemName
grocerySchema.methods.setItemName = function(itemName) {
    this.itemName = itemName;
    return this.save();
};

// Get description
grocerySchema.methods.getDescription = function() {
    return this.description;
};

// Set description
grocerySchema.methods.setDescription = function(description) {
    this.description = description;
    return this.save();
};

// Get purchaser
grocerySchema.methods.getPurchaser = function() {
    return this.purchaser;
};

// Set purchaser
grocerySchema.methods.setPurchaser = function(purchaserId) {
    this.purchaser = purchaserId;
    return this.save();
};

// Get owed
grocerySchema.methods.getOwed = function() {
    return this.owed;
};

// Set owed
grocerySchema.methods.setOwed = function(owedArray) {
    this.owed = owedArray;
    return this.save();
};

// Get requesters
grocerySchema.methods.getRequesters = function() {
    return this.requesters;
};

// Set requesters
grocerySchema.methods.setRequesters = function(requestersArray) {
    this.requesters = requestersArray;
    return this.save();
};

// Get fulfilled
grocerySchema.methods.getFulfilled = function() {
    return this.fulfilled;
};

// Set fulfilled
grocerySchema.methods.setFulfilled = function(fulfilledStatus) {
    this.fulfilled = fulfilledStatus;
    return this.save();
};

// Get paid
grocerySchema.methods.getPaid = function() {
    return this.paid;
};

// Set paid
grocerySchema.methods.setPaid = function(paidStatus) {
    this.paid = paidStatus;
    return this.save();
};

// Delete grocery
grocerySchema.methods.delete = function() {   
    return this.remove()
}

// Mark as paid
grocerySchema.methods.markAsPaid = function() {
    this.paid = true;
    return this.save()
}

// Mark as fulfilled
grocerySchema.methods.markAsFulfilled = function() {
    this.fulfilled = true;
    return this.save()
}

/* create model for the grocery class */
const Grocery = Task.discriminator('Grocery', grocerySchema);

/*
 * Exports the task class so it can be used in other files.
 * Update this with each new subclass of tasks
 */
module.exports = { Task, Chore, Grocery };

