// Rapor Oluşturma
document.getElementById("generate-report-button").addEventListener("click", () => {
    updateExpenseReport();  // Rapor butonuna tıklanınca raporu güncelle
  });
  
  // Expense Report güncelleme fonksiyonu
  function updateExpenseReport() {
    const startDate = new Date(document.getElementById("start-date").value);
    const endDate = new Date(document.getElementById("end-date").value);
  
    if (isNaN(startDate) || isNaN(endDate)) {
      alert("Please select valid start and end dates.");
      return;
    }
  
    if (startDate > endDate) {
      alert("Start date cannot be after end date.");
      return;
    }
  
    // Seçilen zaman aralığındaki satın alma kayıtlarını filtreleme
    const filteredPurchases = purchases.filter(purchase => {
      const purchaseDate = new Date(purchase.date);
      return purchaseDate >= startDate && purchaseDate <= endDate;
    });
  
    if (filteredPurchases.length === 0) {
      alert("No purchases found for the selected period.");
      document.getElementById("total-expense").textContent = `Total Expense: 0.00 USD`;
      return;
    }
  
    // Toplam gider hesaplama
    const totalExpense = filteredPurchases.reduce((sum, purchase) => sum + purchase.totalCost, 0);
  
    // Rapor sonuçlarını göster
    document.getElementById("total-expense").textContent = `Total Expense: ${totalExpense.toFixed(2)} USD`;
  }