const nodemailer=require('nodemailer')
require('dotenv').config();

async function sendMail(html){
    let transporter=nodemailer.createTransport({
            host:process.env.SMTP_HOST,
            port:process.env.SMTP_PORT,
            secure:false,
            auth:{
                user:process.env.SMTP_USER,
                pass:process.env.SMTP_PASS
            }
    })
    transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
      } else {
        console.log("Server is ready to take our messages");
      }
    });
    try {
        let info = await transporter.sendMail({
          from: "20bcs004@ietdavv.edu.in",
          to: "adityasugandhi1203@gmail.com",
          subject:"Hurray!!! your product is available as per your price.",
          text: "Tap the link below to buy the product...",
          html: html
        });
        return info;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to send email');
      }
}

module.exports=sendMail

    