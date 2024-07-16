import jsPDF from 'jspdf';
import Logo from '../Assets/Logo.png';
import 'jspdf-autotable';
import { formatDate } from "./reportDateHelper";

const GenerateRwandaRevenuePDFReport = (transactions, ownerName) => {
  const unit = 'mm';
  const size = 'a4';
  const orientation = 'portrait';
  const doc = new jsPDF(orientation, unit, size);
  const pageWidth = doc.internal.pageSize.getWidth();

  // Logo in the top-left corner
  doc.addImage(Logo, "PNG", 10, 5, 30, 30);

  // Current Date in the top-right corner
  const currentDate = formatDate(new Date());
  const dateText = `Date: ${currentDate}`;
  const dateTextWidth = doc.getTextWidth(dateText);
  const dateTextX = pageWidth - dateTextWidth - 15;
  doc.setFontSize(15);
  doc.text(dateText, dateTextX, 25);

  // Page Title
  const titleText = "RWANDA REVENUE AUTHORITY REPORT";
  doc.setFontSize(15);
  doc.text(titleText, 15, 45);

  // Business Owner's Name
  doc.setFontSize(12);

  // Separator Line
  doc.setLineWidth(0.5);
  doc.line(15, 60, pageWidth - 15, 60);

  // Map transactions to the data format
  const printData = transactions.map((transaction, index) => {
    const customerName = transaction.buyer?.username || "N/A";
    const businessName = transaction.business?.businessName || "N/A";
    const businessLocation = transaction.business?.businessLocation || "N/A";
    const totalPrice = transaction.totalPrice.toLocaleString();
    const date = new Date(transaction.date).toLocaleDateString();
    const status = transaction.status;

    return [index + 1, customerName,businessName,businessLocation, totalPrice, date, status];
  });

  // Auto-generate a table in the PDF using autoTable
  doc.autoTable({
    head: [['No.', 'Client Name','business Name','business Location', 'Total Price', 'Date', 'Status']],
    body: printData,
    startY: 75,
    margin: { top: 5, bottom: 5 },
  });

  // Signature
  const lineHeight = 15;
  const signatureText = "Rwanda Revenue Report";
  doc.setFontSize(11);
  doc.text(signatureText, 15, doc.autoTable.previous.finalY + lineHeight);

  // Final Line
  doc.setDrawColor('#739900');
  doc.line(15, doc.autoTable.previous.finalY + lineHeight * 2, pageWidth - 15, doc.autoTable.previous.finalY + lineHeight * 2);

  // Address Text
  const addressText = 'KN 25 Rd, KG 1 Ave, P.O. Box 0033, Nyarugenge, Kigali, Rwanda';
  const textFontSize = 8;
  const addressTextWidth = doc.getTextWidth(addressText);
  const addressTextX = (pageWidth - addressTextWidth) / 2;

  doc.setFontSize(textFontSize);
  doc.text(addressText, addressTextX, doc.autoTable.previous.finalY + lineHeight * 3);

  // Save PDF
  doc.save(`rwanda-revenue-transaction-Report-${currentDate}.pdf`);
};

export default GenerateRwandaRevenuePDFReport;
