import axios from "axios";

export async function GetTokenMiddleware(request, response, next) {
  const tokenUrl =
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
  try {
    const encodedCredentials = Buffer.from(
      `${process.env.CONSUMER_KEY}:${process.env.SECRET_KEY}`,
    ).toString("base64");

    const res = await axios.get(tokenUrl, {
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
      },
    });

    // console.log("Token Generated:", res.data);

    // Store token in request object for use in next middleware/controller
    request.safaricom_access_token = res.data.access_token;

    next(); // Proceed to next middleware/controller
  } catch (error) {
    console.error(
      "Token Generation Error:",
      error.response?.data || error.message,
    );
    response.status(500).json({ error: "Failed to generate token" });
  }
}
