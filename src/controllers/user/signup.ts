import type { NextFunction, Request, Response } from 'express';
import { hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import User from '../../database/user';
import CustomError from '../../helpers';
import { SECRET_KEY } from '../../config';

const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, email, password, weight, height, gender, goalweight, role } = req.body;

    const emailExist = await User.findOne({ email });
    if (emailExist) {
      throw new CustomError(400, 'Email already exist');
    }
    const hashedPassword = await hash(password, 10);
    const userData = await User.create({
      username,
      email,
      password: hashedPassword,
      weight,
      height,
      gender,
      goalweight,
      role,
    });

    const token = sign({
      username: userData.username,
      id: userData._id,
      role: userData.role,
    }, SECRET_KEY);
    res.cookie('token', token).status(201).json({ massage: 'user created successfully' });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    next(new CustomError(400, error.message));
  }
};

export default signup;
