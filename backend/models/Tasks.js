const mongoose = require('mongoose');
const User = require('../models/User');

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
    order: [{ type: Schema.Types.objectID, ref: 'User'}], //establishes order as an array of users
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


/*
 * Exports the task class so it can be used in other files.
 * Update this with each new subclass of tasks
 */
module.exports = { Task, Chore };

