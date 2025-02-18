const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, userId } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ userId });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password before saving
        // const hashedPassword = await bcrypt.hash(password, 10);

        user = new User({  username, userId  });
        await user.save();
        console.log("User saved to MongoDB:", user);
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;
// const express = require('express');
// const bcrypt = require('bcryptjs');
// const User = require('../models/User');

// const router = express.Router();

// router.post('/register', async (req, res) => {
//     const { name, email, password } = req.body;

//     try {
//         // Check if user already exists
//         let user = await User.findOne({ email });
//         if (user) {
//             return res.status(400).json({ message: "User already exists" });
//         }

//         // Hash password before saving
//         const hashedPassword = await bcrypt.hash(password, 10);

//         user = new User({ name, email, password: hashedPassword });
//         await user.save();
//         console.log("User saved to MongoDB:", user);
//         res.status(201).json({ message: "User registered successfully" });
//     } catch (error) {
//         res.status(500).json({ message: "Server error", error });
//     }
// });

// module.exports = router;