const axios = require("axios");
const FormData = require("form-data");

/**
 * Send WhatsApp message using 11za API
 * @param {Object} options
 * @param {string} options.authToken - 11za auth token from environment or config
 * @param {string} options.phone - Recipient's phone number (with country code)
 * @param {string} options.name - Recipient's name
 * @param {string} options.templateName - 11za template name
 * @param {string[]} options.data - Array of template data strings
 * @param {string} [options.language="en"] - Language code
 * @param {string} [options.originWebsite="example.com"] - Origin website (optional)
 * @param {number} [options.retries=3] - Max retry attempts
 * @returns {Promise<Object>} Response from 11za or error details
 */
const sendWhatsAppMessage = async ({
  phone,
  name,
  templateName,
  data,
  language = "en",
  originWebsite = "www.clawlaw.in",
  retries = 3,
}) => {
  if (!phone || !templateName || !data || !Array.isArray(data)) {
    throw new Error("Missing or invalid required parameters");
  }

  console.log(data);

  const formData = new FormData();
  formData.append("authToken", process.env.ELEVENZA_AUTH_TOKEN);
  formData.append("sendto", phone);
  formData.append("name", name);
  formData.append("templateName", templateName);
  formData.append("language", language);
  formData.append("originWebsite", originWebsite);
  data.forEach((value, index) => {
    formData.append(`data[${index}]`, value);
  });

  let response;
  let lastError;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`📡 Sending WhatsApp (attempt ${attempt}) to ${phone}`);

      response = await axios.post(
        "https://app.11za.in/apis/template/sendTemplate",
        formData,
        {
          headers: formData.getHeaders(),
          timeout: 60000, // 30 sec timeout
        }
      );

      console.log(`✅ WhatsApp sent successfully to ${phone}`);
      return response.data;
    } catch (error) {
      lastError = error;
      console.error(`❌ Attempt ${attempt} failed:`, error.message);
      if (attempt < retries) {
        console.log("⏳ Retrying in 2s...");
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
  }

  throw lastError;
};

module.exports = sendWhatsAppMessage;
