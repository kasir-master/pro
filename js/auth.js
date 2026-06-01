// auth.js
function formatPhoneLocal(phone) {
  if (!phone) return "";
  phone = phone.replace(/\s+/g, '').replace(/[^0-9+]/g, '');
  if (phone.startsWith('+62')) return '62' + phone.substring(3);
  if (phone.startsWith('0')) return '62' + phone.substring(1);
  return phone;
}

async function handleRegister() {
  const email = document.getElementById('regEmail').value;
  const storeName = document.getElementById('regStoreName').value;
  const rawPhone = document.getElementById('regPhone').value;
  const phone = formatPhoneLocal(rawPhone); // Format sebelum kirim

  const payload = {
    action: 'registerStore',
    email: email,
    storeName: storeName,
    phoneNumber: phone
  };

  const result = await postToGAS(payload);
  if(result.status) {
    // Simpan storeId ke IndexedDB lokal
    await db.saveSetting('storeId', result.data.storeId);
    await db.saveSetting('expiryDate', result.data.expiryDate);
    alert('Registrasi Berhasil! Silakan login.');
    loadPage('dashboard');
  }
}
