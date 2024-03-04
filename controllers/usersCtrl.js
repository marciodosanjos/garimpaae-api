import User from '../model/User.js';
import bcrypt from 'bcryptjs';

//@desc Register User
//@route POST /api/users/register
//@access Private/Admin

export const registerUserCtrl = async(req, res) => {
    const {fullname, email, password} = req.body

    //check if user exists
    const userExists = await User.findOne({email});
    if (userExists) {
        //throw error
        res.json({
            msg: 'User already exists'
        })
    }  
    
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)

    //create user
    const user = await User.create({
        fullname, email, password: hashedPassword
    })
    
    res.status(201).json({
        status: 'success',
        message: 'User registrated successfully',
        data: user
    })
} 