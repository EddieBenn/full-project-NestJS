import { transporter } from './nodemailer-config';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

class UtilityService {
  sendPasswordMail = async (email: string, password: string) => {
    try {
      const response = await transporter.sendMail({
        from: 'edidiongndaobong5@gmail.com',
        to: email,
        subject: 'Welcome to Apple Rentals',
        html: `<div width="50%" style="text-align: center; padding: 10px; border-radius: 5px; border: 2px solid gold;">
                  <h1>Welcome to Apple Rentals<h1>
                  <h3 style="font-size: 20px">Here are your login details</h3>
                  <p style="font-size: 20px">You email: ${email}</p>
                  <p style="font-size: 20px">Your Password: <span style="color: red;">${password}</span></p>
                  <p style="font-size: 20px">Thank You</p>
                  </div>`,
      });
      return response;
    } catch (err) {
      console.log(err);
    }
  };

  hashPassword = async (password: string) => {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  };

  generatePassword = (last_name: string) => {
    const newPassword = last_name + Math.floor(1000 + Math.random() * 90000);
    return newPassword;
  };

  validatePassword = (password: string, hashedPassword: string) => {
    return bcrypt.compare(password, hashedPassword);
  };

  getUUID() {
    return uuidv4();
  }
}

export const UtilService = new UtilityService();
