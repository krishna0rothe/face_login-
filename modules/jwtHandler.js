// jwtHandler.js

let jwtToken = null;

function setJwtToken(token) {
  jwtToken = token;
}

function getJwtToken() {
  return jwtToken;
}

module.exports = {
  setJwtToken,
  getJwtToken,
};
