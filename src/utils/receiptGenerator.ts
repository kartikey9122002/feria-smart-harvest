
import { Product, Order } from "@/types";

export const generateProductReceipt = (product: Product) => {
  const receiptData = {
    title: "Product Receipt",
    date: new Date().toLocaleDateString(),
    productName: product.name,
    productId: product.id,
    price: product.price,
    seller: product.sellerName,
    status: product.status,
    category: product.category
  };

  // Generate receipt HTML
  const receiptHTML = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; margin-bottom: 30px; }
          .receipt-item { margin: 10px 0; }
          .footer { margin-top: 30px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${receiptData.title}</h1>
          <p>Date: ${receiptData.date}</p>
        </div>
        <div class="receipt-item">
          <strong>Product:</strong> ${receiptData.productName}
        </div>
        <div class="receipt-item">
          <strong>Product ID:</strong> ${receiptData.productId}
        </div>
        <div class="receipt-item">
          <strong>Price:</strong> ₹${receiptData.price}
        </div>
        <div class="receipt-item">
          <strong>Seller:</strong> ${receiptData.seller}
        </div>
        <div class="receipt-item">
          <strong>Category:</strong> ${receiptData.category}
        </div>
        <div class="receipt-item">
          <strong>Status:</strong> ${receiptData.status}
        </div>
        <div class="footer">
          <p>Thank you for using our platform!</p>
        </div>
      </body>
    </html>
  `;

  // Create blob and download
  const blob = new Blob([receiptHTML], { type: 'text/html' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `receipt-${product.id}.html`;
  a.click();
  window.URL.revokeObjectURL(url);
};

export const generateOrderReceipt = (order: Order) => {
  const receiptData = {
    title: "Order Receipt",
    date: new Date().toLocaleDateString(),
    orderId: order.id,
    totalAmount: order.totalAmount,
    items: order.items,
    status: order.status,
    shippingAddress: order.shippingAddress
  };

  // Generate receipt HTML
  const receiptHTML = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; margin-bottom: 30px; }
          .receipt-item { margin: 10px 0; }
          .items-list { margin: 20px 0; }
          .footer { margin-top: 30px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${receiptData.title}</h1>
          <p>Date: ${receiptData.date}</p>
        </div>
        <div class="receipt-item">
          <strong>Order ID:</strong> ${receiptData.orderId}
        </div>
        <div class="items-list">
          <strong>Items:</strong>
          ${receiptData.items.map(item => `
            <div class="receipt-item">
              - Product ID: ${item.productId}
              - Quantity: ${item.quantity}
              - Price: ₹${item.price}
            </div>
          `).join('')}
        </div>
        <div class="receipt-item">
          <strong>Total Amount:</strong> ₹${receiptData.totalAmount}
        </div>
        <div class="receipt-item">
          <strong>Status:</strong> ${receiptData.status}
        </div>
        <div class="receipt-item">
          <strong>Shipping Address:</strong> ${receiptData.shippingAddress}
        </div>
        <div class="footer">
          <p>Thank you for your purchase!</p>
        </div>
      </body>
    </html>
  `;

  // Create blob and download
  const blob = new Blob([receiptHTML], { type: 'text/html' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `order-receipt-${order.id}.html`;
  a.click();
  window.URL.revokeObjectURL(url);
};
