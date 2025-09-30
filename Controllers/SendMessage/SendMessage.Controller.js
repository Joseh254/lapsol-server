import AfricasTalking from "africastalking";

const africastalking = AfricasTalking({
  apiKey: process.env.SEND_MESSAGE_APIKEY,
  username: process.env.SEND_MESSAGE_USERNAME,
});
const sms = africastalking.SMS;
export async function SendMessageController(request, response) {
  const { phoneNumber, message } = request.body;
  try {
    const res = await sms.send({
      to: [phoneNumber],
      message: message,
    });
    response
      .status(200)
      .json({ success: true, message: "message sent", data: res });
  } catch (error) {
    console.log(error.message);
    return response
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
}
