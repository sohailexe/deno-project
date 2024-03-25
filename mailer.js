const nodemailer= require("nodemailer");

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'philip.cremin@ethereal.email',
        pass: '8sNTpBBnWDTt9yCs3e'
    }
});



exports.sendmail=function(message){
    async function main() {
    const info = await transporter.sendMail({
        from: '"Maddison Foo Koch 👻" <jerome77@ethereal.email>', // sender address
        to: "sa472811@gmail.com", // list of receivers
        subject: "Hello ✔", // Subject line
        // text: "Hello world?", // plain text body
        html: message, // html body
      });
      
      console.log("Message sent: %s", info.messageId);
      }
      main().catch(err=>console.log(err))
}

