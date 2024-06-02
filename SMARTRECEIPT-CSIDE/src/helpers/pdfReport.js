import { jsPDF } from "jspdf";
import Logo from '../Assets/Logo.png';

const generatePDF = (transactions) => {
  // Create a new jsPDF instance
  const doc = new jsPDF();

  // Set document properties
  doc.setProperties({
    title: "Transaction Report",
    author: "DINA",
    keywords: "transactions, report",
  });

  // Set font size and style
  doc.setFontSize(12);

  // Add logo and system name to the header
  doc.addImage(Logo, "PNG", 10, 10, 30, 30); // Adjust image dimensions and position
  doc.text("MODERN EBM", doc.internal.pageSize.width - 50, 25, null, null, "right"); // Adjust position and alignment

  // Add current date and time
  const currentDate = new Date().toLocaleString();
  doc.text(`Date Printed: ${currentDate}`, doc.internal.pageSize.width - 10, 45, null, null, "right"); // Adjust position and alignment

  // Add a title to the PDF
  doc.setFontSize(16);
  doc.text("Transaction Report", 10, 60);

  // Check if there are transactions
  if (transactions.length === 0) {
    // Add message for no transactions found
    doc.setFontSize(12);
    doc.text("No transactions found.", 10, 80);
  } else {
    // Add table header
    const tableHeader = ["Date", "Buyer", "Product", "Quantity", "Total Price"];
    const tableRows = [];

    // Add transaction details to table
    transactions.forEach((transaction, index) => {
      const { date, buyer, product, quantity, totalPrice } = transaction;
      const row = [date, buyer.username, product ? product.name : "N/A", quantity, totalPrice];
      tableRows.push(row);
    });

    // Add table to PDF
    doc.autoTable({
      head: [tableHeader],
      body: tableRows,
      startY: 80, // Start the table below the title
    });
  }

  // Add footer with automatic report generation message
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.text(10, doc.internal.pageSize.height - 10, `Page ${i} of ${totalPages}`);
    doc.text(10, doc.internal.pageSize.height - 5, "This report was automatically generated.");
  }

  // Save or download the PDF
  doc.save("transaction_report.pdf");
};

export default generatePDF;
