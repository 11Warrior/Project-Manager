
import jwt from "jsonwebtoken"

export const generateToken = (userId, res) => {
  try {
    const token = jwt.sign({userId}, process.env.JWT_SECRET)

    res.cookie("token", token, {
      maxAge : 3600 * 15 * 24 * 1000,
      httpOnly: true,
      sameSite : "lax" 
    })
  } catch (error) {
    console.log("Error in generate Token method", error) 
    return res.status(500).json({error: "Server error in generating token"})
  }
}