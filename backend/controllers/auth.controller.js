import User from "../models/userModel.js";
import bcrypt from "bcrypt"
import {generateToken} from "../lib/generateToken.js"

export const signUp = async(req, res) => {
  try {
    const {fullName, userName, email, password} = req.body
    console.log(req.body)
    const regex =   /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      return res.status(400).json({error: "Invalid email"});
    }
    const existingUser = await User.findOne({userName})
    if (existingUser) {
      return res.status(400).json({error: "UserName exists"})
    }
    const existingEmail = await User.findOne({email});
    if (existingEmail) {
      return res.status(400).json({error: "Email already exists !"});
    }

    if (password.length < 6) {
      return res.status(400).json({error: "Password must be atleast 6 characters long, try again"})
    }
    //hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = await User.create({
      userName,
      fullName, 
      email,
      password: hashedPassword
    })

    if (newUser) {
      generateToken(newUser._id, res)
      await newUser.save()

      res.status(201).json({
        _id: newUser._id,
        fullName : newUser.fullName,
        userName : newUser.userName,
        email : newUser.email,
      })
    }

  } catch (error) {
    console.log(error);
    return res.status(500).json({message: "Server Error in signup controller"})
  }

}


export const logIn = async (req, res) => {
  try {
    const {userName, password} = req.body

    if (!userName || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const user = await User.findOne({ userName : userName });
    console.log(user)


    if (!user) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      userName: user.userName,
      email: user.email,
    });
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error in login controller" });
  }
};

export const logOut = (req, res) => {
  try {
    res.cookie("token", "", {maxAge : 0})
    res.status(200).json({message: "Logged out successfully"})
  } catch (error) {
    console.log(error);
    return res.status(500).json({message: "Server Error in logout controller"}) 
  }
}

export const getAuthUser = async (req, res) =>{
  try {
		const user = await User.findById(req.user._id).select("-password");
		res.status(200).json(user);
	} catch (error) {
		console.log("Error in getMe controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
}
