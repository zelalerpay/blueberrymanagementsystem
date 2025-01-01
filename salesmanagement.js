// Fiyat kategorileri ve her bir kategorinin fiyatlandırılması (global değişken olarak)
//fiyatlandırma büyük paket almayı daha avantajlı kılacak şekilde yapıldı
let priceCategories = {
    small: { weight: 0.1, price: 8 },  // 100g için 8 TL
    medium: { weight: 0.25, price: 14 }, // 250g için 14 TL
    large: { weight: 0.5, price: 24 },  // 500g için 24 TL
    extraLarge: { weight: 1, price: 38 }, // 1kg için 38 TL
    familyPack: { weight: 2, price: 60 }, // 2kg için 60 TL
    bulkPack: { weight: 5, price: 100 }, // 5kg için 100 TL
    premium: { weight: "custom", price: 0 } // Özel siparişler için manuel fiyat belirlemesi yapılabilir
  };
  
  // Siparişleri tutmak için dizi
  let orders = [];
  
  // Sipariş Ekleme
  document.getElementById("add-order-button").addEventListener("click", () => {
    const orderId = document.getElementById("order-id").value.trim();
    const customerName = document.getElementById("customer-name").value.trim();
    const customerContact = document.getElementById("customer-contact").value.trim();
    const productCategory = document.getElementById("product-category").value.trim();
    const quantity = parseInt(document.getElementById("order-quantity").value.trim());
  
    // Aynı ID'ye sahip sipariş var mı kontrolü
    const existingOrder = orders.find(order => order.orderId === orderId);
    if (existingOrder) {
      alert("Bu ID'ye sahip bir sipariş zaten mevcut. Lütfen farklı bir ID giriniz.");
      return; // İşlemi durdur
    }
  
    // Kategoriye göre fiyatı al (fiyatlar güncellenmiş olmalı)
    const categoryData = priceCategories[productCategory];
    
    // Fiyatın güncel olduğundan emin olalım
    const unitPrice = categoryData ? categoryData.price : 0; // Fiyatın 0 olmasını engelle
  
    if (orderId && customerName && customerContact && quantity > 0 && unitPrice > 0) {
      // Toplam fiyat hesaplama
      const totalPrice = quantity * unitPrice;
  
      // Sipariş ekleme
      const newOrder = {
        orderId,
        customerName,
        customerContact,
        productCategory,
        quantity,
        unitPrice,
        totalPrice,
        status: "Pending" // Varsayılan durum
      };
  
      orders.push(newOrder);
      updateOrderTable();
      document.getElementById("order-form").reset();
    } else {
      alert("Tüm alanlar doldurulmalı ve geçerli değerler girilmelidir!");
    }
  });
  
  
  // Sipariş Tablosunu Güncelleme
  function updateOrderTable() {
    const tableBody = document.querySelector("#order-table tbody");
    tableBody.innerHTML = ""; // Önceki içeriği temizle
  
    orders.forEach(order => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${order.orderId}</td>
        <td>${order.customerName}</td>
        <td>${order.customerContact}</td>
        <td>${order.productCategory}</td>
        <td>${order.quantity}</td>
        <td>${order.totalPrice.toFixed(2)}</td>
        <td>${order.status}</td>
        <td>
          <button class="update" onclick="updateOrder('${order.orderId}')">Update</button>
          <button class="delete" onclick="deleteOrder('${order.orderId}')">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  
    updateRevenue(); // Gelirleri Güncelle
  }
  document.getElementById("generate-report").addEventListener("click", () => {
    alert("Toplam Gelir Raporu hazır!\nKategori Bazlı Gelirleri inceleyebilirsiniz.");
  });
  
  
  // Sipariş Güncelleme
  function updateOrder(orderId) {
    const order = orders.find(o => o.orderId === orderId);
    if (order) {
      // Açılır menü oluştur
      const statusOptions = ["Pending", "Processed", "Shipped", "Delivered"];
      const statusSelect = document.createElement("select");
      statusOptions.forEach(status => {
        const option = document.createElement("option");
        option.value = status;
        option.textContent = status;
        if (status === order.status) option.selected = true; // Mevcut durum seçili olsun
        statusSelect.appendChild(option);
      });
  
      // Açılır menü penceresi
      const modal = document.createElement("div");
      modal.innerHTML = `
        <div style="background: #fff; padding: 20px; border: 1px solid #ddd; position: fixed; top: 30%; left: 40%; z-index: 1000;">
          <h4>Update Order Status</h4>
          <label for="order-status">Select Status:</label>
          <div id="order-status"></div>
          <button id="save-status">Save</button>
          <button id="cancel-status">Cancel</button>
        </div>
      `;
      document.body.appendChild(modal);
      modal.querySelector("#order-status").appendChild(statusSelect);
  
      // Durum kaydetme işlemi
      modal.querySelector("#save-status").addEventListener("click", () => {
        order.status = statusSelect.value; // Yeni durumu kaydet
        updateOrderTable();
        document.body.removeChild(modal); // Modalı kapat
      });
  
      // Cancel butonu
      modal.querySelector("#cancel-status").addEventListener("click", () => {
        document.body.removeChild(modal);
      });
    }
  }
  
  
  // Sipariş Silme
  function deleteOrder(orderId) {
    orders = orders.filter(order => order.orderId !== orderId);
    updateOrderTable();
  }
  
  // Sipariş Arama ve Filtreleme
  document.getElementById("search-order").addEventListener("input", filterOrders);
  document.getElementById("search-status").addEventListener("change", filterOrders);
  
  function filterOrders() {
    const searchOrder = document.getElementById("search-order").value.trim().toLowerCase();
    const searchStatus = document.getElementById("search-status").value;
  
    // Siparişleri filtreleme
    const filteredOrders = orders.filter(order => {
      const matchesOrderId = order.orderId.toLowerCase().includes(searchOrder);
      const matchesCustomerName = order.customerName.toLowerCase().includes(searchOrder);
      const matchesStatus = searchStatus ? order.status.toLowerCase() === searchStatus.toLowerCase() : true;
  
      return (searchOrder ? (matchesOrderId || matchesCustomerName) : true) && matchesStatus;
    });
  
    updateTable(filteredOrders); // Güncellenmiş tabloyu oluştur
  }
  
  
  // Tabloyu güncelleme fonksiyonu
  function updateTable(filteredOrders) {
    const tableBody = document.querySelector("#order-table tbody");
    tableBody.innerHTML = ""; // Önceki içeriği temizle
  
    filteredOrders.forEach(order => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${order.orderId}</td>
        <td>${order.customerName}</td>
        <td>${order.customerContact}</td>
        <td>${order.productCategory}</td>
        <td>${order.quantity}</td>
        <td>${order.totalPrice.toFixed(2)}</td>
        <td>${order.status}</td>
        <td>
          <button class="update" onclick="updateOrder('${order.orderId}')">Update</button>
          <button class="delete" onclick="deleteOrder('${order.orderId}')">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }
  
  // Fiyatı otomatik güncelleme (kategori seçildiğinde)
  document.getElementById("product-category").addEventListener("change", updatePrice);
  document.getElementById("order-quantity").addEventListener("input", updatePrice);
  
  function updatePrice() {
    const category = document.getElementById("product-category").value;
    const quantity = document.getElementById("order-quantity").value;
    const categoryData = priceCategories[category];
  
    // Hesaplama yapalım
    const unitPrice = categoryData.price;
    const totalPrice = unitPrice * quantity;
  
    // Fiyatları güncelle
    document.getElementById("unit-price").value = unitPrice;
    document.getElementById("total-price").value = totalPrice.toFixed(2);
  }
  
  // Fiyatları güncellemek için buton
  document.getElementById("update-prices-button").addEventListener("click", updatePrices);
  
  function updatePrices() {
    priceCategories.small.price = parseFloat(document.getElementById("small-price").value);
    priceCategories.medium.price = parseFloat(document.getElementById("medium-price").value);
    priceCategories.large.price = parseFloat(document.getElementById("large-price").value);
    priceCategories.extraLarge.price = parseFloat(document.getElementById("extra-large-price").value);
    priceCategories.familyPack.price = parseFloat(document.getElementById("family-pack-price").value);
    priceCategories.bulkPack.price = parseFloat(document.getElementById("bulk-pack-price").value);
    priceCategories.premium.price = parseFloat(document.getElementById("premium-price").value);
  
    alert("Fiyatlar başarıyla güncellendi!");
    updatePriceTable();  // Fiyat tablosunu güncelle
  }
  
  // Fiyat Tablosunu Güncelleme
  function updatePriceTable() {
    const tableBody = document.querySelector("#price-table tbody");
    tableBody.innerHTML = ""; // Mevcut içerik temizleniyor
  
    // Kategorilere göre fiyatları tabloya ekleyelim
    for (const [category, { weight, price }] of Object.entries(priceCategories)) {
      const row = document.createElement("tr");
      let totalPrice = price * weight;
      if (category === "premium") {
        totalPrice = "Custom"; // Özel siparişler için manuel hesaplama
      }
  
      row.innerHTML = `
        <td>${category}</td>
        <td>${weight}</td>
        <td>${price}</td>
        <td>${totalPrice}</td>
      `;
      tableBody.appendChild(row);
    }
  }
  
  
  function updateRevenue() {
    let totalRevenue = 0;
    const categoryRevenue = {};
  
    // Kategori bazlı gelirleri hesaplama
    orders.forEach(order => {
      totalRevenue += order.totalPrice;
      if (categoryRevenue[order.productCategory]) {
        categoryRevenue[order.productCategory] += order.totalPrice;
      } else {
        categoryRevenue[order.productCategory] = order.totalPrice;
      }
    });
  
    
    document.getElementById("total-revenue").textContent = totalRevenue.toFixed(2);
  
    
    const revenueList = document.getElementById("category-revenue-list");
    revenueList.innerHTML = "";
    for (const [category, revenue] of Object.entries(categoryRevenue)) {
      const listItem = document.createElement("li");
      listItem.textContent = `${category}: ${revenue.toFixed(2)} TL`;
      revenueList.appendChild(listItem);
    }
  
    // Grafik Güncelle
    updateRevenueChart(categoryRevenue);
  }
  
  let revenueChart; // Grafik nesnesi için global değişken
  
  function updateRevenueChart(categoryRevenue) {
    const ctx = document.getElementById("revenue-chart").getContext("2d");
  
    // Eğer grafik varsa önce yok et
    if (revenueChart) {
      revenueChart.destroy();
    }
  
    // Yeni Grafik Oluştur
    revenueChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: Object.keys(categoryRevenue),
        datasets: [{
          label: "Kategori Bazlı Gelir (TL)",
          data: Object.values(categoryRevenue),
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
  
  
  // CSV formatında rapor dışa aktarma fonksiyonu
  function exportToCSV() {
    // Başlıklar (sütun isimleri)
    const headers = ["Order ID", "Customer Name", "Customer Contact", "Product Category", "Quantity", "Unit Price", "Total Price", "Status"];
    
    // Sipariş verisini CSV formatına dönüştürme
    const rows = orders.map(order => [
      order.orderId,
      order.customerName,
      order.customerContact,
      order.productCategory,
      order.quantity,
      order.unitPrice.toFixed(2),
      order.totalPrice.toFixed(2),
      order.status
    ]);
    
    // CSV içeriğini oluşturma
    const csvContent = [
      headers.join(","), // Başlıkları virgülle ayırarak ekleyin
      ...rows.map(row => row.join(",")) // Her satırdaki veriyi virgülle ayırarak ekleyin
    ].join("\n"); // Her satırı yeni bir satırda göster
  
    // CSV dosyasını indirilebilir hale getirme
    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "sales_report.csv"; // İndirilen dosyanın adı
    link.click(); // Dosyayı indirmek için bağlantıya tıklayın
  }
  
  // CSV dışa aktarma butonuna tıklama olayı
  document.getElementById("export-csv-button").addEventListener("click", exportToCSV);
  
  
  
  
  
  
  
  
  // Sayfa yüklenince fiyat tablosunu güncelle
  updatePriceTable();
  