
let inventory = [
    { itemId: "small", category: "Small", quantity: 20, reorderLevel: 10, supplier: "Supplier A" },
    { itemId: "medium", category: "Medium", quantity: 15, reorderLevel: 10, supplier: "Supplier B" },
    { itemId: "large", category: "Large", quantity: 10, reorderLevel: 5, supplier: "Supplier C" },
    { itemId: "extraLarge", category: "Extra Large", quantity: 5, reorderLevel: 5, supplier: "Supplier D" },
    { itemId: "familyPack", category: "Family Pack", quantity: 2, reorderLevel: 2, supplier: "Supplier E" },
    { itemId: "bulkPack", category: "Bulk Pack", quantity: 1, reorderLevel: 2, supplier: "Supplier F" },
  ];
  
  // Kategori Bazlı Stok Kontrolü ve Uyarı Sistemi ile kritik seviyeyi tespit et 
  function checkInventoryLevels() {
    const alertBox = document.getElementById("inventory-alerts");
    alertBox.innerHTML = ""; // Önceki uyarıları temizle
  
    inventory.forEach(item => {
      if (item.quantity <= item.reorderLevel) {
        const alertMessage = document.createElement("div");
        alertMessage.innerHTML = `
          <p><strong>Uyarı:</strong> ${item.category} stoğu kritik seviyede (${item.quantity} kg). 
          Tedarikçi: ${item.supplier}</p>`;
        alertBox.appendChild(alertMessage);
      }
    });
  }
  
  // Stok Tablosunu Güncelle
  function updateInventoryTable() {
    const tableBody = document.querySelector("#inventory-table tbody");
    tableBody.innerHTML = "";
  
    inventory.forEach(item => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.category}</td>
        <td>${item.quantity} kg</td>
        <td>${item.reorderLevel} kg</td>
        <td>${item.supplier}</td>
        <td>
          <button onclick="restock('${item.itemId}')">Restock</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  
    checkInventoryLevels();
  }
  
  // Restock
  function restock(itemId) {
    const item = inventory.find(i => i.itemId === itemId);
    if (item) {
      const amount = parseFloat(prompt(`Kaç kg ${item.category} eklemek istiyorsunuz?`, "10"));
      if (!isNaN(amount) && amount > 0) {
        item.quantity += amount;
        alert(`${amount} kg ${item.category} stoğa eklendi.`);
        updateInventoryTable();
      } else {
        alert("Geçersiz miktar!");
      }
    }
  }
  
  // Paketleme Sonrası Stok Güncelleme
  function updateStockAfterPackaging(categoryId, packagedAmount) {
    const item = inventory.find(i => i.itemId === categoryId);
    if (item) {
      item.quantity -= packagedAmount;
      if (item.quantity < 0) item.quantity = 0; // Negatif stok engelleme
      updateInventoryTable();
    }
  }
  
  // Talep Tahmini Fonksiyonu
  function demandForecasting(days) {
    const forecastResult = document.getElementById("forecastResult");
    let resultHTML = `<h3>Talep Tahmini (${days} gün)</h3><ul>`;
  
    inventory.forEach(item => {
      const avgDailyDemand = Math.random() * 2 + 1; // Rastgele günlük talep verisi
      const nextWeekDemand = avgDailyDemand * 7;
  
      resultHTML += `<li>${item.category}: Haftalık tahmini talep ${nextWeekDemand.toFixed(2)} kg. 
      Mevcut Stok: ${item.quantity} kg. ${item.quantity < nextWeekDemand ? "<strong>Restock Önerilir!</strong>" : "Stok Yeterli"}</li>`;
    });
  
    resultHTML += "</ul>";
    forecastResult.innerHTML = resultHTML;
  }
  
  // Sayfa yüklenince stok tablosunu güncelle
  document.addEventListener("DOMContentLoaded", () => {
    updateInventoryTable();
    checkInventoryLevels();
  });
  