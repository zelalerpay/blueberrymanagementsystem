let farmers = [];
let purchases = [];

// Toplam blueberry miktarını gösteren fonksiyon
function updateTotalBlueberry() {
  // purchases dizisindeki her bir satın alma için quantity (kg) toplamını alıyoruz
  const totalBlueberry = purchases.reduce((sum, purchase) => sum + purchase.quantity, 0);
  // HTML'deki 'total-blueberry' id'sine bu değeri yansıtıyoruz
  document.getElementById("total-blueberry").textContent = totalBlueberry.toFixed(2);
}

// Farmer Ekleme
document.getElementById("add-farmer-button").addEventListener("click", () => {
  const farmerId = document.getElementById("farmer-id").value.trim();
  const name = document.getElementById("farmer-name").value.trim();
  const contact = document.getElementById("farmer-contact").value.trim();
  const location = document.getElementById("farmer-location").value.trim();

  // Farmer ID'nin sadece sayılardan oluşup oluşmadığını kontrol etme
  if (!/^\d+$/.test(farmerId)) { // ^\d+$, sadece sayılardan oluşan bir regular expression
    alert("Farmer ID must be numeric!");
    return;
  }

  if (farmers.some(farmer => farmer.farmerId === farmerId)) {
    alert("A farmer with this ID already exists!");
    return;
  }

  if (farmerId && name && contact && location) {
    farmers.push({ farmerId, name, contact, location });
    updateFarmerTable();
    document.getElementById("farmer-form").reset();
  } else {
    alert("All fields are required!");
  }
});


// Farmer Tablosunu Güncelle
function updateFarmerTable() {
  const tableBody = document.querySelector("#farmer-table tbody");
  tableBody.innerHTML = "";

  farmers.forEach((farmer, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${farmer.farmerId}</td>
      <td>${farmer.name}</td>
      <td>${farmer.contact}</td>
      <td>${farmer.location}</td>
      <td>
        <button class="update" onclick="updateFarmer(${index})">Update</button>
        <button class="delete" onclick="deleteFarmer(${index})">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Farmer Silme
function deleteFarmer(index) {
  farmers.splice(index, 1);
  updateFarmerTable();
}

// Farmer Güncelleme
function updateFarmer(index) {
  const farmer = farmers[index];
  const newName = prompt("Enter new name:", farmer.name) || farmer.name;
  const newContact = prompt("Enter new contact:", farmer.contact) || farmer.contact;
  const newLocation = prompt("Enter new location:", farmer.location) || farmer.location;

  farmers[index] = { ...farmer, name: newName, contact: newContact, location: newLocation };
  updateFarmerTable();
}

// Farmer Arama
document.getElementById("search-farmer").addEventListener("input", (e) => {
  const searchValue = e.target.value.toLowerCase();
  const tableBody = document.querySelector("#farmer-table tbody");

  tableBody.innerHTML = "";

  farmers
    .filter(farmer => farmer.name.toLowerCase().includes(searchValue))
    .forEach((farmer, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${farmer.farmerId}</td>
        <td>${farmer.name}</td>
        <td>${farmer.contact}</td>
        <td>${farmer.location}</td>
        <td>
          <button class="update" onclick="updateFarmer(${index})">Update</button>
          <button class="delete" onclick="deleteFarmer(${index})">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
});