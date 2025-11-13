export async function ValidateInputsMiddleware(request, response, next) {
  const { phoneNumber, amount } = request.body;
  if (!phoneNumber) {
    return response
      .status(404)
      .json({ success: false, message: "Phone Number is Missing" });
  }
  // Validate phone number format: must start with '254' and followed by 9-10 digits
  // Exact 12-digit phone numbers starting with 2547 or 2541
  const phoneRegex = /^254[71]\d{8}$/;

  if (!phoneRegex.test(phoneNumber)) {
    return response.status(400).json({
      success: false,
      message:
        "Phone Number must be exactly 10 digits and start with 2547 or 2541",
    });
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
  next();
}
