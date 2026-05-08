import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateInvoicePDF = (invoice: any) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(24);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text('SMARTSTACK SOLUTIONS', 14, 25);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text('Digital Intelligence & Automation Agency', 14, 32);
  
  // Invoice Details
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('INVOICE', 160, 25, { align: 'right' });
  
  doc.setFontSize(10);
  doc.text(`#${invoice.invoiceNo}`, 160, 32, { align: 'right' });
  doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`, 160, 39, { align: 'right' });
  if (invoice.dueDate) {
    doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, 160, 46, { align: 'right' });
  }

  // Client Info
  doc.setFontSize(11);
  doc.text('BILL TO:', 14, 60);
  doc.setFontSize(10);
  doc.text(invoice.client.companyName || invoice.client.contactName, 14, 67);
  doc.text(invoice.client.email, 14, 73);
  if (invoice.client.phone) {
    doc.text(invoice.client.phone, 14, 79);
  }

  // Items Table
  const tableColumn = ["Description", "Quantity", "Rate", "Amount"];
  const tableRows: any[] = [];

  const items = Array.isArray(invoice.items) ? invoice.items : JSON.parse(invoice.items as string);
  
  items.forEach((item: any) => {
    const itemData = [
      item.description,
      (item.qty || item.quantity || 0).toString(),
      `₹${item.rate.toLocaleString()}`,
      `₹${item.amount.toLocaleString()}`,
    ];
    tableRows.push(itemData);
  });

  autoTable(doc, {
    startY: 95,
    head: [tableColumn],
    body: tableRows,
    theme: 'striped',
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontSize: 10 },
    styles: { fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 100 },
      1: { cellWidth: 20, halign: 'center' },
      2: { cellWidth: 35, halign: 'right' },
      3: { cellWidth: 35, halign: 'right' },
    }
  });

  // Totals
  const finalY = ((doc as any).lastAutoTable?.finalY || 150) + 10;
  
  doc.setFontSize(10);
  doc.text('Subtotal:', 140, finalY);
  doc.text(`₹${invoice.subtotal.toLocaleString()}`, 190, finalY, { align: 'right' });
  
  doc.text('Tax:', 140, finalY + 7);
  doc.text(`₹${invoice.tax.toLocaleString()}`, 190, finalY + 7, { align: 'right' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL:', 140, finalY + 16);
  doc.text(`₹${invoice.total.toLocaleString()}`, 190, finalY + 16, { align: 'right' });

  // Notes
  if (invoice.notes) {
    const notesY = finalY + 40;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Notes:', 14, notesY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(invoice.notes, 14, notesY + 7, { maxWidth: 180 });
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Thank you for your business!', 105, 280, { align: 'center' });
  doc.text('Smartstack Solutions - Digital Intelligence & Automation', 105, 285, { align: 'center' });

  // Save the PDF
  doc.save(`Invoice_${invoice.invoiceNo}.pdf`);
};
