import { postSignUp } from "../requests/requests.js";

document.getElementById("signup-form").onsubmit = async function (e) {
  e.preventDefault(); // Prevent default form submission

  // Get form data
  const formData = new FormData(this);
  const username = formData.get("username"); // Assuming input name="username"
  const password = formData.get("password"); // Assuming input name="password"

  // Call postSignUp with extracted data
  await postSignUp({ username: username, password: password });
};
