const { logEvent } = require("../utils/utils");
const axios = require("axios");

// Function to generate a random student ID
const generateRandomID = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Function to check for potential VPN or proxy use
const detectVPNOrProxy = async (ip) => {
  try {
    const response = await axios.get(`https://ipapi.co/${ip}/json`);
    return response.data.security && response.data.security.is_vpn;
  } catch (error) {
    logEvent("Error detecting VPN/Proxy: " + error.message);
    return false;
  }
};

// Fetch and store user's IP information with additional network checks
/**
 * Fetches IP data from ipinfo.io and stores it along with student information.
 * Checks for VPN or proxy and logs relevant events.
 * @returns {Promise<void>} A promise that resolves when the IP data is fetched and stored successfully.
 */
const fetchAndStoreIP = async () => {
  try {
    const response = await axios.get("https://ipinfo.io/json");
    const ipData = response.data;
    const userData = {
      studentID: generateRandomID(),
      ip: ipData.ip,
      city: ipData.city,
      region: ipData.region,
      country: ipData.country,
      location: ipData.loc,
      postal: ipData.postal,
    };

    // Log the IP data immediately
    logEvent("Fetched IP data: " + JSON.stringify(userData));

    // Check for VPN or proxy
    const isVPNOrProxy = await detectVPNOrProxy(ipData.ip);
    if (isVPNOrProxy) {
      logEvent(
        "VPN/Proxy detected: " +
          JSON.stringify(ipData) +
          " Of Student: " +
          userData.studentID
      );
      throw new Error("VPN/Proxy detected");
    }

    logEvent("Student joined in with " + JSON.stringify(userData));
    console.log("Data stored successfully");
  } catch (error) {
    logEvent(
      "Error in network integrity check or data storage: " + error.message
    );
    console.error("Error fetching and storing data:", error);
  }
};

module.exports = { fetchAndStoreIP };
