import expressAsyncHandler from 'express-async-handler';
import nodemailer from 'nodemailer';

//data must be pass b4 req
//data means dynamic datas e.g array,object
export const sendEmail = expressAsyncHandler(async (data, req, res) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.MAIL_ID, //email here
      pass: process.env.MP,
    },
  });

  const info = await transporter.sendMail({
    from: '"Hey 👻" <abc@gmail.com>', // sender address
    to: data.to, // list of receivers
    subject: data.subject, // Subject line
    text: data.text, // plain text body
    html: data.htm, // html body
  });
});
