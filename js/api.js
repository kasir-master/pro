// api.js
const GAS_URL = 'https://script.google.com/macros/s/ID_DEPLOY_WEB_APP_ANDA/exec';

async function postToGAS(payload) {
  try {
    const response = await fetch(GAS_URL, {
      method: 'POST',
      mode: 'no-cors', // Wajib no-cors untuk GAS Web App dari GH Pages
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    // Karena no-cors, response tidak bisa dibaca langsung. 
    // Kita asumsikan sukses jika tidak error jaringan.
    return { status: true, message: "Request terkirim" };
  } catch (error) {
    console.error('GAS API Error:', error);
    return { status: false, message: error.message };
  }
}
