import jsPDF from 'jspdf';
import Logo from '../Assets/Logo.png';
import 'jspdf-autotable';
import { formatDate } from "./reportDateHelper";

const GenerateRwandaRevenueBusinessPDFReport = (businesses) => {
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
  const titleText = "RWANDA REVENUE AUTHORITY BUSINESS REPORT";
  doc.setFontSize(15);
  doc.text(titleText, 15, 45);

  // Business Owner's Name
  doc.setFontSize(12);

  // Separator Line
  doc.setLineWidth(0.5);
  doc.line(15, 60, pageWidth - 15, 60);

  // Map transactions to the data format
  const printData = businesses.map((business, index) => {
    const name = business?.businessName || "N/A";
    const location = business?.businessLocation || "N/A";
    const category = business?.businessCategory || "N/A";
    const ownerName=business.user?.username|| "N/A";
    const ownerEmail=business.user?.email|| "N/A";
    const tinNumber = business.businessTINNumber.toLocaleString();
    const establishedOn = new Date(business.createdAt).toLocaleDateString();

    return [index + 1, name,location,category, tinNumber,ownerName,ownerEmail, establishedOn];
  });
  doc.autoTable({
    head: [['No.','business Name','business Location','Category', 'Business TIN NUmber','Owner name','owner email', 'Established on']],
    body: printData,
    startY: 75,
    margin: { top: 5, bottom: 5 },
  });

  // Signature
  const lineHeight = 15;
  const signatureText = "Rwanda Revenue Authority Business Report";
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
  doc.save(`rwanda-revenue-business-Report-${currentDate}.pdf`);
};

export default GenerateRwandaRevenueBusinessPDFReport;
