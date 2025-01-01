const taxRate = 0.18; // Vergi oranı (%18 KDV) kafamdan belirledim


function calculateFinancials() {
  
  const totalIncome = orders.reduce((sum, order) => sum + order.totalPrice, 0);

  
  const totalExpenses = purchases.reduce((sum, purchase) => sum + purchase.totalCost, 0);

  
  const tax = totalIncome * taxRate;

  
  const netProfit = totalIncome - totalExpenses - tax;


  displayFinancialReport(totalIncome, totalExpenses, tax, netProfit);
}


function displayFinancialReport(income, expenses, tax, profit) {
  const reportContainer = document.getElementById("financial-report");
  reportContainer.innerHTML = `
    <h3>Finansal Rapor</h3>
    <p><strong>Toplam Gelir:</strong> ${income.toFixed(2)} TL</p>
    <p><strong>Toplam Gider:</strong> ${expenses.toFixed(2)} TL</p>
    <p><strong>Vergi (%${(taxRate * 100).toFixed(0)}):</strong> ${tax.toFixed(2)} TL</p>
    <p><strong>Net Kâr:</strong> ${profit.toFixed(2)} TL</p>
  `;
}


document.getElementById("generate-financial-report").addEventListener("click", calculateFinancials);
