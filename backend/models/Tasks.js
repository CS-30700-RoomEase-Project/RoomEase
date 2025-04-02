const mongoose = require('mongoose');
const User = require('../models/User');
const Schema = mongoose.Schema;
const Notification = require('../models/Notification');

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
    creatorId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
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
    choreName: String,
    order: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of users
    description: String,
    whoseTurn: Number,
    dueDate: { type: Date, required: false }, // Due date of the chore
    recurringDays: { type: Number, default: 0 }, // Number of days between occurrences (0 = not recurring)
    completed: { type: Boolean, default: false }, // Indicates if the chore is done
    difficulty: { type: String, default: "Easy"}, //indicates how difficult the chore is
    comments: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'choreComment'}], default: []}
});

const choreCommentSchema = new mongoose.Schema({
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    comment: String
});

const choreComment = mongoose.model('choreComment', choreCommentSchema);

choreSchema.methods.commentNotification = async function(message, path) {
    try {
        const notification = await Notification.create({
            description: `Comment added to '${this.choreName}'. Description: '${message}'.`,
            pageID: `/Chores/${path}`,
            usersNotified: this.order,
            notificationType: 'Chore Comment',
            origin: this.creatorId
        });
        await notification.propagateNotification();
    } catch (error) {
        console.error("Error creating notification:", error);
    }
}

choreSchema.methods.createNotification = async function(path) {
    console.log("creating notification");
    try {
        const notification = await Notification.create({
            description: `Chore '${this.choreName}' has been created. Description: '${this.description}'. Due Date: '${this.dueDate}'. First assigned to '${this.order[this.whoseTurn]}'`,
            pageID: `/Chores/${path}`,
            usersNotified: this.order,
            notificationType: 'Chore Assignment',
            origin: this.creatorId
        });
        output = await notification.propagateNotification();
        return output;
    } catch (error) {
        console.error("Error creating notification:", error);
    }
};

choreSchema.methods.switchNotification = async function(path) {
    try {
        const notification = await Notification.create({
            description: `Chore '${this.choreName}' is now your responsibility. Description: '${this.description}'. Due Date: '${this.dueDate}'`,
            pageID: `/Chores/${path}`,
            usersNotified: this.order[this.whoseTurn],
            notificationType: 'Chore Assignment',
            origin: this.creatorId
        });
        await notification.propagateNotification();
    } catch (error) {
        console.error("Error creating notification:", error);
    }
}

choreSchema.methods.overDueNotification = async function(path) {
    try {
        const notification = await Notification.create({
            description: `Chore '${this.choreName}' is Overdue. Description: '${this.description}'. Due Date: '${this.dueDate}'`,
            pageID: `/Chores/${path}`,
            usersNotified: [this.order[this.whoseTurn]],
            notificationType: 'Chore Assignment',
            origin: this.creatorId
        });
        await notification.propagateNotification();
    } catch (error) {
        console.error("Error creating notification:", error);
    }
}

/* Method to get the due date */
choreSchema.methods.getDueDate = function() {
    return this.dueDate;
};

/* Method to set the due date */
choreSchema.methods.setDueDate = function(date) {
    this.dueDate = date;
    return this.save();
};

/* Method to set the recurrence interval */
choreSchema.methods.setRecurringDays = function(days) {
    this.recurringDays = days;
    return this.save();
};

/* Method to mark the chore as complete */
choreSchema.methods.complete = async function(path) {
    console.log("completing");
    if (this.recurringDays === 0) {
        // If not recurring, mark as complete
        console.log("marking");
        this.completed = ! this.completed;
    } else {
        // If recurring, just switch the user and update due date
        await this.switchUser(path);
    }
    return this.save();
};

/* Updated method to switch to the next user and update the due date */
choreSchema.methods.switchUser = async function(path) {
    console.log("switching");
    if (this.order.length === 0) return null; // No users in the order

    console.log(this.whoseTurn+1);
    this.whoseTurn = (this.whoseTurn + 1) % this.order.length; // Move to the next user
    console.log(this.whoseTurn);

    // If the chore is recurring, update the due date
    if (this.recurringDays > 0 && this.dueDate) {
        this.dueDate = new Date(this.dueDate.getTime() + this.recurringDays * 24 * 60 * 60 * 1000);
    }

    this.completed = false; // Reset completed in case it was incorrectly set

    await this.switchNotification(path);

    return this.save(); // Save and return the updated chore
};

choreSchema.methods.setChoreName = function(name) {
    this.choreName = name;
}

choreSchema.methods.setOrder = function(order) {
    this.order = order;
}

choreSchema.methods.setDescription = function(description) {
    this.description = description;
}

choreSchema.methods.setWhoseTurn = function(turn) {
    this.whoseTurn = turn;
}

/* create model for the chore class using the discriminator and the schema */
const Chore = Task.discriminator('Chore', choreSchema);

/* ADD NEW SUBCLASSES BELOW, FEEL FREE TO USE CHORE AS A GUIDE */


/* Grocery subclass of Task class.*/
const grocerySchema = new mongoose.Schema({
    itemName: String,
    description: String,
    purchaser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    cost: Number,
    owed: Number,
    requesters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
    fulfilled: Boolean,
    paid: Boolean,
    quantity: Number,
    purchased: { type: Boolean },
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
    Bills Subclass of Task class
*/
const billSchema = new mongoose.Schema({
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    dueDate: { type: Date },
    responsible: [{
      userId: { type: String, required: true },
      name: { type: String, required: true },
      paid: { type: Boolean, default: false }
    }],
    paymaster: { type: String, default: "" },
    isRecurring: { type: Boolean, default: false },
    frequency: { type: String, enum: ['daily', 'weekly', 'biweekly', 'monthly', 'custom'], default: null },
    customFrequency: { type: Number, default: null },
    isAmountPending: { type: Boolean, default: false },
    isPaid: { type: Boolean, default: false },
    splitBill: { type: Boolean, default: true },
    // New field: whether a recurring bill has been finished.
    isFinished: { type: Boolean, default: false },
    priceHistory: [{
      date: Date,
      amount: Number
    }]
  });

  billSchema.methods.createNotification = async function(roomId) {
    console.log("Creating bill notification");
    try {
      // Import models here to avoid circular dependencies
      const User = require('./User');
      const Notification = require('./Notification');
      
      // For each responsible person, look up the user by your custom userId field
      const usersNotified = await Promise.all(
        this.responsible.map(async (person) => {
          const user = await User.findOne({ userId: person.userId });
          return user ? user._id : null;
        })
      );
      const validUsersNotified = usersNotified.filter(id => id !== null);
      
      // Create a notification for these users with the full URL for the bills page.
      const notification = await Notification.create({
        description: `A new bill "${this.title}" of $${this.amount} has been created with due date ${
          this.dueDate ? this.dueDate.toLocaleDateString() : 'N/A'
        } that you have been marked responsible for.`,
        pageID: `/room/${roomId}/bills`, // Updated URL
        usersNotified: validUsersNotified,
        notificationType: 'Bill Created',
        origin: this.creatorId || null
      });
      const output = await notification.propagateNotification();
      return output;
    } catch (error) {
      console.error("Error creating bill notification:", error);
      throw error;
    }
  };

// Method to create an "edit" notification when a bill is modified
billSchema.methods.createEditNotification = async function(roomId) {
    console.log("Creating bill edit notification");
    try {
      const User = require('./User');
      const Notification = require('./Notification');
      // Look up each responsible user by their custom userId
      const usersNotified = await Promise.all(
        this.responsible.map(async (person) => {
          const user = await User.findOne({ userId: person.userId });
          return user ? user._id : null;
        })
      );
      const validUsersNotified = usersNotified.filter(id => id !== null);
      
      // Create a notification for these users with the bills page URL.
      const notification = await Notification.create({
        description: `The bill "${this.title}" has been updated. Please review the changes.`,
        pageID: `/room/${roomId}/bills`, // URL as in your fixed version
        usersNotified: validUsersNotified,
        notificationType: 'Bill Updated',
        origin: this.creatorId || null
      });
      const output = await notification.propagateNotification();
      return output;
    } catch (error) {
      console.error("Error creating bill edit notification:", error);
      throw error;
    }
  };
  
  // Method to create a "delete" notification when a bill is deleted
  billSchema.methods.createDeleteNotification = async function(roomId) {
    console.log("Creating bill deletion notification");
    try {
      const User = require('./User');
      const Notification = require('./Notification');
      // Look up each responsible user by their custom userId
      const usersNotified = await Promise.all(
        this.responsible.map(async (person) => {
          const user = await User.findOne({ userId: person.userId });
          return user ? user._id : null;
        })
      );
      const validUsersNotified = usersNotified.filter(id => id !== null);
      
      // Create a notification for these users with the bills page URL.
      const notification = await Notification.create({
        description: `The bill "${this.title}" has been deleted.`,
        pageID: `/room/${roomId}/bills`,
        usersNotified: validUsersNotified,
        notificationType: 'Bill Deleted',
        origin: this.creatorId || null
      });
      const output = await notification.propagateNotification();
      return output;
    } catch (error) {
      console.error("Error creating bill deletion notification:", error);
      throw error;
    }
  };

  // Method to create a notification when a bill has been marked as paid
billSchema.methods.createPaidNotification = async function(roomId) {
    console.log("Creating paid notification for bill");
    try {
      const User = require('./User');
      const Notification = require('./Notification');
      
      // Look up each responsible person using the custom userId and get their actual _id.
      const usersNotified = await Promise.all(
        this.responsible.map(async (person) => {
          const user = await User.findOne({ userId: person.userId });
          return user ? user._id : null;
        })
      );
      const validUsersNotified = usersNotified.filter(id => id !== null);
      
      // Build an appropriate description.
      let description;
      if (this.isRecurring && !this.isFinished) {
        description = `Payment for the recurring bill "${this.title}" has been processed. The next cycle is scheduled for ${
          this.dueDate ? new Date(this.dueDate).toLocaleDateString() : 'N/A'
        }.`;
      } else {
        description = `The bill "${this.title}" has been marked as paid.`;
      }
      
      // Create the notification using the roomId to build the pageID.
      const notification = await Notification.create({
        description,
        pageID: `/room/${roomId}/bills`,
        usersNotified: validUsersNotified,
        notificationType: 'Bill Paid',
        origin: this.creatorId || null
      });
      const output = await notification.propagateNotification();
      return output;
    } catch (error) {
      console.error("Error creating paid notification:", error);
      throw error;
    }
  };
  

billSchema.methods.getFormattedDueDate = function() {
    return this.dueDate ? this.dueDate.toLocaleDateString() : "No due date";
};

billSchema.methods.getResponsible = function() {
    return this.responsible;
};

billSchema.methods.markAsPaid = async function () {
    if (this.isRecurring) {
      // For recurring bills, we follow the existing behavior
      const currentDueDate = new Date(this.dueDate);
      if (isNaN(currentDueDate.getTime())) {
        throw new Error("Invalid due date");
      }
      // Record the current cycle in the price history
      this.priceHistory.push({ date: currentDueDate, amount: this.amount || 0 });
      
      // Determine days to add based on frequency
      let daysToAdd = 0;
      switch (this.frequency) {
        case 'daily': 
          daysToAdd = 1; 
          break;
        case 'weekly': 
          daysToAdd = 7; 
          break;
        case 'biweekly': 
          daysToAdd = 14; 
          break;
        case 'monthly': 
          daysToAdd = 30; 
          break;
        case 'custom': 
          daysToAdd = Number(this.customFrequency) || 0; 
          break;
        default: 
          daysToAdd = 0;
      }
      // Calculate new due date
      const newDueDate = new Date(currentDueDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
      this.dueDate = newDueDate;
      this.amount = 0; // Reset amount for the next cycle
      this.isAmountPending = true;
      await this.save();
      return this;
    } else {
      // For non-recurring bills, update responsible persons as paid
      this.responsible = this.responsible.map(person => ({
        ...person,
        paid: true
      }));
      this.isPaid = true;
      await this.save();
      return this;
    }
  };
  
  
  
  


const Bill = Task.discriminator('Bill', billSchema);

/*
 * Exports the task class so it can be used in other files.
 * Update this with each new subclass of tasks.
 */
module.exports = { Task, Chore, Grocery, Bill, choreComment };

