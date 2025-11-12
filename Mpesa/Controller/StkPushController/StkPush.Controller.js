import axios from "axios";

export async function sendStkPush(request, response) {
  try {
    const StkPushUrl =
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
    const token = request.safaricom_access_token;
    if (!token) {
      return response
        .status(500)
        .json({ success: false, error: "Token not available" });
    }

    const { phoneNumber, amount } = request.body;

    const date = new Date();
    const timestamp =
      date.getFullYear() +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      ("0" + date.getDate()).slice(-2) +
      ("0" + date.getHours()).slice(-2) +
      ("0" + date.getMinutes()).slice(-2) +
      ("0" + date.getSeconds()).slice(-2);

    const stk_password = Buffer.from(
      process.env.SHORTCODE + process.env.PASSKEY + timestamp,
    ).toString("base64");

    const requestBody = {
      BusinessShortCode: process.env.SHORTCODE,
      Password: stk_password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phoneNumber,
      PartyB: process.env.SHORTCODE,
      PhoneNumber: phoneNumber,
      CallBackURL: process.env.CALLBACK_URL,
      AccountReference: "account",
      TransactionDesc: "test payment",
    };

    const stkResponse = await axios.post(StkPushUrl, requestBody, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.status(200).json({ success: true, data: stkResponse.data });
  } catch (error) {
    console.log(error.message);

    console.error("STK Push Error:", error.response?.data || error.message);
    return response
      .status(500)
      .json({ sucess: false, message: "Failed to process STK Push request" });
  }
}
