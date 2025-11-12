import jwt, { decode } from "jsonwebtoken";
function AdminAuth(request, response, next) {
  const accessToken = request.cookies.access_token;
  if (!accessToken) {
    return response
      .status(401)
      .json({ success: false, message: "Please login first to continue" });
  }

  try {
    jwt.verify(accessToken, process.env.JWT_SECRET, function (error, decoded) {
      if (error) {
        return response
          .status(401)
          .json({ success: false, message: "Access denied" });
      }
      if (decoded.role !== "admin") {
        return response.status(404).json({
          success: false,
          message: "Only Admins Are Allowed To Perform This Operation",
        });
      }
    });
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    request.user = decoded;
    next();
  } catch (error) {
    console.log("error admin auth", error.message);
    return response
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

export default AdminAuth;
