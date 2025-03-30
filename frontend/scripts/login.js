import { postLogin } from "../requests/requests.js";
document.getElementById("login-form").onsubmit = async function (e) {
  e.preventDefault();
  // Get form data
  const formData = new FormData(this);
  const username = formData.get("username"); // Assuming input name="username"
  const password = formData.get("password"); // Assuming input name="password"

  // Call postSignUp with extracted data
  await postLogin({ username: username, password: password });
};
