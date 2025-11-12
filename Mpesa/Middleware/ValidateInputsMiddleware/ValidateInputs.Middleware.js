export async function ValidateInputsMiddleware(request, response, next) {
  const { phoneNumber, amount } = request.body;
  if (!phoneNumber) {
    return response
      .status(404)
      .json({ success: false, message: "Phone Number is Missing" });
  }
  if (!amount) {
    return response
      .status(404)
      .json({ success: false, message: "Amount is Requred" });
  }
  if (amount < 1) {
    return response
      .status(400)
      .json({ success: false, message: "Amount cannot be Less than 1" });
  }
}
