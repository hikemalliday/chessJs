function setTokens(access, refresh) {
  localStorage.setItem("accessToken", access);
  localStorage.setItem("refreshToken", refresh);
}

function clearTokens() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}
