import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { Group } from "../models/group.model.js";
import { Transaction } from "../models/transaction.model.js";

// Connect to MongoDB
console.log(process.env.MONGODB_URI);
mongoose.connect("mongodb+srv://divykasodariya2006:divy123@cluster0.jn8jddl.mongodb.net",{
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Clear existing data
await User.deleteMany({});
await Group.deleteMany({});
await Transaction.deleteMany({});

// Create sample users
const users = await User.insertMany([
  {
    username: "alice",
    email: "alice@example.com",
    password: "hashed_password_1",
    avatar: "https://i.pravatar.cc/150?img=1"
  },
  {
    username: "bob",
    email: "bob@example.com",
    password: "hashed_password_2",
    avatar: "https://i.pravatar.cc/150?img=2"
  },
  {
    username: "charlie",
    email: "charlie@example.com",
    password: "hashed_password_3",
    avatar: "https://i.pravatar.cc/150?img=3"
  },
  {
    username: "dave",
    email: "dave@example.com",
    password: "hashed_password_4",
    avatar: "https://i.pravatar.cc/150?img=4"
  }
]);

// Create sample groups
const groups = await Group.insertMany([
  {
    name: "Roommates",
    users: [users[0]._id, users[1]._id, users[2]._id],
    groupAvatar: "https://i.pravatar.cc/300?img=60"
  },
  {
    name: "Road Trip Gang",
    users: [users[1]._id, users[2]._id, users[3]._id],
    groupAvatar: "https://i.pravatar.cc/300?img=61"
  }
]);

// Create sample transactions
const transactions = await Transaction.insertMany([
  // Roommates group transactions
  {
    group: groups[0]._id,
    description: "Electricity Bill",
    amount: 3000,
    payer: users[0]._id,
    currency: "INR",
    splitDetails: [
      { user: users[0]._id, share: 1000, isPaid: true },
      { user: users[1]._id, share: 1000, isPaid: false },
      { user: users[2]._id, share: 1000, isPaid: false }
    ]
  },
  {
    group: groups[0]._id,
    description: "Groceries",
    amount: 1500,
    payer: users[1]._id,
    currency: "INR",
    splitDetails: [
      { user: users[0]._id, share: 500, isPaid: false },
      { user: users[1]._id, share: 500, isPaid: true },
      { user: users[2]._id, share: 500, isPaid: false }
    ]
  },
  // Road Trip Gang transactions
  {
    group: groups[1]._id,
    description: "Hotel Booking",
    amount: 200,
    payer: users[3]._id,
    currency: "USD",
    splitDetails: [
      { user: users[1]._id, share: 66.67, isPaid: false },
      { user: users[2]._id, share: 66.67, isPaid: false },
      { user: users[3]._id, share: 66.66, isPaid: true }
    ]
  },
  {
    group: groups[1]._id,
    description: "Gas",
    amount: 75,
    payer: users[2]._id,
    currency: "USD",
    splitDetails: [
      { user: users[1]._id, share: 25, isPaid: true },
      { user: users[2]._id, share: 25, isPaid: true },
      { user: users[3]._id, share: 25, isPaid: false }
    ]
  }
]);

// Update groups with transaction references
await Group.updateMany(
  { _id: groups[0]._id },
  { $set: { transactions: [transactions[0]._id, transactions[1]._id] } }
);

await Group.updateMany(
  { _id: groups[1]._id },
  { $set: { transactions: [transactions[2]._id, transactions[3]._id] } }
);

// Update users with their group and transaction references
await User.updateMany(
  { _id: users[0]._id },
  { 
    $set: { 
      groups: [groups[0]._id],
      transactions: [transactions[0]._id, transactions[1]._id]
    } 
  }
);

await User.updateMany(
  { _id: users[1]._id },
  { 
    $set: { 
      groups: [groups[0]._id, groups[1]._id],
      transactions: [transactions[0]._id, transactions[1]._id, transactions[2]._id, transactions[3]._id]
    } 
  }
);

await User.updateMany(
  { _id: users[2]._id },
  { 
    $set: { 
      groups: [groups[0]._id, groups[1]._id],
      transactions: [transactions[0]._id, transactions[1]._id, transactions[2]._id, transactions[3]._id]
    } 
  }
);

await User.updateMany(
  { _id: users[3]._id },
  { 
    $set: { 
      groups: [groups[1]._id],
      transactions: [transactions[2]._id, transactions[3]._id]
    } 
  }
);

console.log("Database seeded successfully!");
mongoose.disconnect();