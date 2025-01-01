// Merkezi stok degiskeni ile stoğu tek merkezden yönetmek için 
let currentStock = 0;
const categoryStock = { small: 0, medium: 0, large: 0, extraLarge: 0, familyPack: 0, bulkPack: 0, premium: 0 };
const stockThreshold = 10; // Minimum stok seviyesi

// Satın Alma Ekleme 
document.getElementById("add-purchase-button").addEventListener("click", () => {
  const purchaseId = document.getElementById("purchase-id").value.trim();
  const farmerId = document.getElementById("purchase-farmer-id").value.trim();
  const date = document.getElementById("purchase-date").value.trim();
  const quantity = parseFloat(document.getElementById("purchase-quantity").value.trim());
  const price = parseFloat(document.getElementById("purchase-price").value.trim());

  // Farmer ID doğrulama ve eğer bu id de farmer yoksa satın alma işlemi yapmayacak
  const farmerExists = farmers.some(farmer => farmer.farmerId === farmerId);

  if (!farmerExists) {
      alert(`Farmer ID "${farmerId}" does not exist. Please add the farmer first.`);
      return;
  }

  if (purchaseId && farmerId && date && quantity > 0 && price > 0) {
      // Aynı Purchase ID ile satın alma eklenmesini engelleme
      const existingPurchase = purchases.find(purchase => purchase.purchaseId === purchaseId);
      if (existingPurchase) {
          alert(`Purchase ID "${purchaseId}" already exists! Please update the existing record.`);
          return;
      }

      const totalCost = quantity * price;

      purchases.push({ purchaseId, farmerId, date, quantity, price, totalCost });
      currentStock += quantity; 
      updatePurchaseTable();
      document.getElementById("purchase-form").reset();
      updateExpenseReport();
      updateStockDisplay(); 
      checkStockThresholds(); 
  } else {
      alert("All fields are required and must be valid!");
  }
});

// Satın Alma Tablosunu Güncelleme
function updatePurchaseTable() {
  const tableBody = document.querySelector("#purchase-table tbody");
  tableBody.innerHTML = "";

  purchases.forEach((purchase, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${purchase.purchaseId}</td>
          <td>${purchase.farmerId}</td>
          <td>${purchase.date}</td>
          <td>${purchase.quantity}</td>
          <td>${purchase.price}</td>
          <td>${purchase.totalCost.toFixed(2)}</td>
          <td>
              <button class="update" onclick="updatePurchase(${index})">Update</button>
              <button class="delete" onclick="deletePurchase(${index})">Delete</button>
          </td>
      `;
      tableBody.appendChild(row);
  });
}

// Satın Alma Güncelleme
function updatePurchase(index) {
  const purchase = purchases[index];
  
  const newQuantity = parseFloat(prompt("Enter new quantity (kg):", purchase.quantity)) || purchase.quantity;
  const newPrice = parseFloat(prompt("Enter new price per kg:", purchase.price)) || purchase.price;
  const quantityDifference = newQuantity - purchase.quantity; // Stok farkı hesaplama

  const totalCost = newQuantity * newPrice;

  purchases[index] = { ...purchase, quantity: newQuantity, price: newPrice, totalCost };

  currentStock += quantityDifference; // Merkezi stok güncelle
  updatePurchaseTable();
  updateExpenseReport();
  updateStockDisplay();
  checkStockThresholds();
}


function deletePurchase(index) {
  const removedQuantity = purchases[index].quantity;
  currentStock -= removedQuantity; // Merkezi stok azaltma
  purchases.splice(index, 1);
  updatePurchaseTable();
  updateExpenseReport();
  updateStockDisplay();
  checkStockThresholds();
}

// Çiftçi ID'sine Göre Satın Alma Filtreleme
document.getElementById("filter-purchases-button").addEventListener("click", () => {
  const filterFarmerId = document.getElementById("filter-farmer-id").value.trim();

  if (!filterFarmerId) {
    alert("Please enter a Farmer ID to filter!");
    return;
  }

  // Girilen çiftçi ID'sine göre satın alma kayıtlarını filtreleme
  const filteredPurchases = purchases.filter(purchase => purchase.farmerId === filterFarmerId);

  if (filteredPurchases.length === 0) {
    alert(`No purchases found for Farmer ID: ${filterFarmerId}`);
  } else {
    // Tabloda sadece ilgili kayıtları göstermek
    updateFilteredPurchaseTable(filteredPurchases);
  }
});

// Filtrelenmiş Satın Alma Tablusunu Güncelleme
function updateFilteredPurchaseTable(filteredPurchases) {
  const tableBody = document.querySelector("#purchase-table tbody");
  tableBody.innerHTML = "";

  filteredPurchases.forEach((purchase, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${purchase.purchaseId}</td>
      <td>${purchase.farmerId}</td>
      <td>${purchase.date}</td>
      <td>${purchase.quantity}</td>
      <td>${purchase.price}</td>
      <td>${purchase.totalCost.toFixed(2)}</td>
      <td>
        <button class="update" onclick="updatePurchase(${index})">Update</button>
        <button class="delete" onclick="deletePurchase(${index})">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Tüm kayıtları yeniden gösterme
document.getElementById("show-all-purchases-button").addEventListener("click", () => {
  updatePurchaseTable(); // Tüm kayıtları göster
  document.getElementById("filter-farmer-id").value = ""; // Arama kutusunu temizle
});


function updateStockDisplay() {
  const remainingStockDisplay = document.getElementById("remaining-stock");
  const totalBlueberryDisplay = document.getElementById("total-blueberry");

  totalBlueberryDisplay.textContent = currentStock.toFixed(2);
  remainingStockDisplay.textContent = currentStock.toFixed(2);
}



const categories = {
  small: { weight: 100, pricePerKg: 1.2 },
  medium: { weight: 250, pricePerKg: 1.1 },
  large: { weight: 500, pricePerKg: 1.0 },
  extraLarge: { weight: 1000, pricePerKg: 0.9 },
  familyPack: { weight: 2000, pricePerKg: 0.8 },
  bulkPack: { weight: 5000, pricePerKg: 0.7 },
  premium: { weight: "custom", pricePerKg: 1.5 },
};

let packagingHistory = [];
const categorySelect = document.getElementById("category-select");
const quantityInput = document.getElementById("quantity-input");
const packageButton = document.getElementById("package-button");
const packagedResultDisplay = document.getElementById("packaged-result");
const stockHistoryDisplay = document.getElementById("stock-history");

packageButton.addEventListener("click", () => {
  const category = categorySelect.value;
  const quantity = parseInt(quantityInput.value);

  if (isNaN(quantity) || quantity <= 0) {
      alert("Please enter a valid quantity!");
      return;
  }

  const categoryData = categories[category];
  const totalWeightNeeded = categoryData.weight * quantity / 1000; // gramdan kg'ye dönüsüm

  if (totalWeightNeeded > currentStock) {
      alert("Not enough stock to package this quantity!");
      return;
  }

  currentStock -= totalWeightNeeded; // Merkezi stok azaltma
  categoryStock[category] += quantity; // Kategori bazında stok ekleme
  packagingHistory.push({ category, quantity });
  updateStockDisplay();
  checkStockThresholds();

  packagedResultDisplay.textContent = `Packaged ${quantity} ${category} packs. Remaining stock: ${currentStock.toFixed(2)} kg.`;
  displayPackagingHistory();
});

function displayPackagingHistory() {
  let historyHTML = "<h3>Packaging History:</h3><ul>";
  packagingHistory.forEach(entry => {
      historyHTML += `<li>${entry.quantity} ${entry.category} pack(s) packaged</li>`;
  });
  historyHTML += "</ul>";
  stockHistoryDisplay.innerHTML = historyHTML;
}

function checkStockThresholds() {
  for (const category in categoryStock) {
    const categoryElement = document.getElementById(`${category}-stock-alert`); // Stok uyarı elemanını seçiyoruz
    if (categoryStock[category] < stockThreshold) {
      // Uyarı mesajını ekliyoruz
      categoryElement.textContent = `Warning: Low stock for ${category}! Current stock: ${categoryStock[category]} packs.`;
      categoryElement.style.color = 'red'; // Kırmızı renkte
      categoryElement.style.fontWeight = 'bold'; // Kalın yazı
      categoryElement.style.fontSize = '16px'; // Yazı boyutunu artırıyoruz
    } else {
      // Yeterli stok varsa, uyarıyı kaldırıyoruz
      categoryElement.textContent = '';
    }
  }
}



updateStockDisplay();
