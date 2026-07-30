export function openWhatsAppChat(phone: string = '7338447753', message?: string) {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  const defaultText = 'Hi TREDNY, I would like to place an order or inquire about your collection.';
  const encodedText = encodeURIComponent(message || defaultText);
  
  window.open(`https://wa.me/${formattedPhone}?text=${encodedText}`, '_blank');
}

export function buildCartWhatsAppMessage(
  cartItems: Array<{ product: { name: string; price: number }; quantity: number; selectedSize?: string }>,
  totalPriceFormatted: string,
  customerName?: string,
  deliveryAddress?: string
): string {
  let text = `*New TREDNY Order Request*\n\n`;
  text += `*Items:*\n`;
  cartItems.forEach((item, index) => {
    text += `${index + 1}. ${item.product.name} (Qty: ${item.quantity}${item.selectedSize ? `, Size: ${item.selectedSize}` : ''})\n`;
  });
  
  text += `\n*Total Amount:* ${totalPriceFormatted}\n`;
  if (customerName) text += `*Name:* ${customerName}\n`;
  if (deliveryAddress) text += `*Address:* ${deliveryAddress}\n`;
  text += `\nPlease confirm availability and payment details. Thank you!`;
  
  return text;
}
