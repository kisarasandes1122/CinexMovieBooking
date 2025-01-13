const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    try {
      const { email, password, firstName, lastName, mobile, birthDate, gender } = req.body;

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
         email,
        password: hashedPassword,
         firstName,
          lastName,
        mobile
      });

        const newUser = await user.save();

      // Send success response
      res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
      res.status(500).json({ message: 'Error registering user', error: error.message });
    }
  };

const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({email});
       if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
       }

        const passwordMatch = await bcrypt.compare(password, user.password)
        if(!passwordMatch){
             return res.status(401).json({ message: 'Invalid credentials' });
        }

       // Generate JWT Token.
         const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "mysecretkey", { expiresIn: '1h' });

        res.status(200).json({ message: 'Logged in Successfully', token })
    } catch (error) {
      res.status(500).json({ message: 'Error logging in user', error: error.message });
    }
  };

  const getUserDetails = async (req, res) => {
    try {
      const userId = req.params.id;

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
        //exclude password from user details.
       const {password, ...userDetails} = user.toObject()
       res.status(200).json(userDetails);
     } catch (error) {
      res.status(500).json({ message: 'Error fetching user details', error: error.message });
    }
  };


module.exports = {
  registerUser,
  loginUser,
  getUserDetails,
};