// app.js
const contentDiv = document.getElementById('app-content');

async function loadPage(pageName) {
  try {
    const response = await fetch(`pages/${pageName}.html`);
    const html = await response.text();
    contentDiv.innerHTML = html;
    
    // Inisialisasi event listener setelah HTML masuk
    if(pageName === 'login') initLoginPage();
    if(pageName === 'products') initProductsPage();
  } catch(e) {
    contentDiv.innerHTML = "<h1>Halaman 404</h1>";
  }
}

// Deteksi hash change untuk routing
window.addEventListener('hashchange', () => {
  const page = window.location.hash.substring(1) || 'login';
  loadPage(page);
});

// Init awal
window.addEventListener('DOMContentLoaded', async () => {
  await db.init(); // Inisialisasi IndexedDB
  
  // Cek apakah sudah login (ada storeId)
  const storeId = await db.getSetting('storeId');
  if(storeId) {
    loadPage('dashboard');
  } else {
    loadPage('login');
  }
});
