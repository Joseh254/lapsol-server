export function SendMessageMiddleware(request, response, next) {
  const { phoneNumber, message } = request.body;

  // 1. Check for required fields
  if (!phoneNumber) {
    return response
      .status(400)
      .json({ success: false, message: "Phone number to send to is required" });
  }

  if (!message) {
    return response
      .status(400)
      .json({ success: false, message: "Message to send is required" });
  }

  // 2. Clean and validate phone number
  const cleanedNumber = phoneNumber.replace(/\s+/g, "");

  // Must start with +2547 or +2541 and be 13 characters long
  const isValidKenyanNumber = /^(\+2547\d{8}|\+2541\d{8})$/.test(cleanedNumber);

  if (!isValidKenyanNumber) {
    return response.status(400).json({
      success: false,
      message:
        "Phone number must be a valid Kenyan mobile number (+2547XXXXXXXX or +2541XXXXXXXX)",
    });
  }

  // 3. Replace request body number with cleaned version
  request.body.phoneNumber = cleanedNumber;

  next();
}
