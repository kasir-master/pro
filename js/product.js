// product.js
async function handleAddProduct() {
  const name = document.getElementById('prodName').value;
  const price = parseInt(document.getElementById('prodPrice').value);
  const fileInput = document.getElementById('prodImage');
  
  const productId = 'P_' + Date.now();
  let imageUrl = '';

  // 1. Upload foto jika ada
  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    // Kompres ke Base64 (Ini simulasi, sebaiknya gunakan library compressor di real project)
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = async function(e) {
      const base64Data = e.target.result;
      
      // Simpan secara lokal dulu di IndexedDB sebagai base64 sementara
      imageUrl = base64Data; 
      
      const productData = {
        id: productId,
        name: name,
        price: price,
        stock: 0,
        imageUrl: imageUrl, // Sementara base64 lokal
        createdAt: new Date().toISOString()
      };

      await db.saveProduct(productData); // Simpan Offline
      renderProducts(); // Update UI

      // 2. Upload ke GDrive di background saat online
      if (navigator.onLine) {
        const storeId = await db.getSetting('storeId');
        const uploadPayload = {
          action: 'uploadProductImage',
          storeId: storeId,
          fileData: base64Data,
          fileName: productId + '.jpg'
        };
        
        // Kirim ke GAS
        const uploadResult = await postToGAS(uploadPayload);
        // Catatan: Karena no-cors, kita tak tahu URL lh3 yang dikembalikan GAS secara real-time.
        // Solusi lanjutan: sinkronisasi periodik dari GAS ke Client, atau baca database GAS.
      }
    };
  }
}
