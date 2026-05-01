// Email Notification Helper Functions

export const emailNotifications = {
  // Sipariş onayı emaili
  sendOrderConfirmation: (orderData) => {
    const settings = JSON.parse(localStorage.getItem('emailSettings') || '{}');
    if (!settings.orderConfirmation) return;

    console.log('📧 ORDER CONFIRMATION EMAIL');
    console.log('To:', orderData.email);
    console.log('Subject: Siparişiniz onaylandı');
    console.log('Order ID:', orderData.orderId);
    console.log('Items:', orderData.items);
    console.log('Total:', orderData.total);

    // Simüle edilmiş email
    showNotification('Sipariş onayı e-posta ile gönderildi!', 'success');
  },

  // Kargo bildirimi
  sendShippingNotification: (orderData) => {
    const settings = JSON.parse(localStorage.getItem('emailSettings') || '{}');
    if (!settings.orderShipped) return;

    console.log('📧 SHIPPING NOTIFICATION EMAIL');
    console.log('To:', orderData.email);
    console.log('Subject: Siparişiniz kargoya verildi');
    console.log('Tracking Number:', orderData.trackingNumber);

    showNotification('Kargo bildirimi e-posta ile gönderildi!', 'success');
  },

  // Teslimat bildirimi
  sendDeliveryNotification: (orderData) => {
    const settings = JSON.parse(localStorage.getItem('emailSettings') || '{}');
    if (!settings.orderDelivered) return;

    console.log('📧 DELIVERY NOTIFICATION EMAIL');
    console.log('To:', orderData.email);
    console.log('Subject: Siparişiniz teslim edildi');

    showNotification('Teslimat bildirimi e-posta ile gönderildi!', 'success');
  },

  // Yeni mesaj bildirimi
  sendNewMessageNotification: (messageData) => {
    const settings = JSON.parse(localStorage.getItem('emailSettings') || '{}');
    if (!settings.newMessage) return;

    console.log('📧 NEW MESSAGE NOTIFICATION EMAIL');
    console.log('To:', messageData.recipientEmail);
    console.log('From:', messageData.senderName);
    console.log('Subject: Yeni mesaj gönderen: ' + messageData.senderName);
    console.log('Message Preview:', messageData.messagePreview);

    showNotification('Mesaj bildirimi e-posta ile gönderildi!', 'success');
  },

  // Fiyat düşüşü bildirimi
  sendPriceDropNotification: (productData) => {
    const settings = JSON.parse(localStorage.getItem('emailSettings') || '{}');
    if (!settings.priceDrops) return;

    console.log('📧 PRICE DROP NOTIFICATION EMAIL');
    console.log('Subject: Fiyat düştü: ' + productData.title);
    console.log('Old Price:', productData.oldPrice);
    console.log('New Price:', productData.newPrice);
    console.log('Discount:', productData.discount);

    showNotification('Fiyat düşüş bildirimi e-posta ile gönderildi!', 'success');
  },

  // Yeni ilan bildirimi
  sendNewListingNotification: (listingData) => {
    const settings = JSON.parse(localStorage.getItem('emailSettings') || '{}');
    if (!settings.newListings) return;

    console.log('📧 NEW LISTING NOTIFICATION EMAIL');
    console.log('Subject: Yeni ilan: ' + listingData.category);
    console.log('Title:', listingData.title);
    console.log('Price:', listingData.price);

    showNotification('Yeni ilan bildirimi e-posta ile gönderildi!', 'success');
  },

  // Rechnungs-E-Mail
  sendInvoiceNotification: (invoiceData) => {
    const settings = JSON.parse(localStorage.getItem('emailSettings') || '{}');
    // If there's no specific setting for invoice, we assume it's always allowed or belongs to orders
    if (settings.orderConfirmation === false) return;

    console.log('📧 INVOICE NOTIFICATION EMAIL');
    console.log('To:', invoiceData.email);
    console.log('Subject: ExVitrin Faturanız - ' + invoiceData.invoiceNumber);
    console.log('Total:', invoiceData.amount, ' TL');

    showNotification('Fatura başarıyla e-posta ile gönderildi!', 'success');
  },

  // Haftalık özet
  sendWeeklyDigest: (userData) => {
    const settings = JSON.parse(localStorage.getItem('emailSettings') || '{}');
    if (!settings.weeklyDigest) return;

    console.log('📧 WEEKLY DIGEST EMAIL');
    console.log('To:', userData.email);
    console.log('Subject: Haftalık özetiniz');
    console.log('New Listings:', userData.newListingsCount);
    console.log('Messages:', userData.messagesCount);

    showNotification('Haftalık özet e-posta ile gönderildi!', 'success');
  }
};

// Bildirim gösterme fonksiyonu
const showNotification = (message, type = 'info') => {
  // Tarayıcı bildirimi
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('ExVitrin', {
      body: message,
    });
  }

  // Console log
  const emoji = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
  console.log(`${emoji} ${message}`);
};

// Bildirim izni isteme
export const requestNotificationPermission = async () => {
  if ('Notification' in window && Notification.permission === 'default') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return Notification.permission === 'granted';
};

// Email template'leri
export const emailTemplates = {
  orderConfirmation: (orderData) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #ef4444; color: white; padding: 20px; text-align: center; }
        .content { background: #f9fafb; padding: 20px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .button { background: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Sipariş Onayı</h1>
        </div>
        <div class="content">
          <h2>Siparişiniz için teşekkür ederiz!</h2>
          <p>Siparişiniz #${orderData.orderId} başarıyla oluşturuldu.</p>
          <h3>Sipariş Detayları:</h3>
          <ul>
            ${orderData.items.map(item => `<li>${item.title} - ${item.price}</li>`).join('')}
          </ul>
          <p><strong>Toplam Tutar: ${orderData.total}</strong></p>
          <a href="#" class="button">Siparişi Görüntüle</a>
        </div>
        <div class="footer">
          <p>© 2026 ExVitrin. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  newMessage: (messageData) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #ef4444; color: white; padding: 20px; text-align: center; }
        .content { background: #f9fafb; padding: 20px; }
        .message-box { background: white; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
        .button { background: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💬 Yeni Mesaj</h1>
        </div>
        <div class="content">
          <p><strong>${messageData.senderName}</strong> size yeni bir mesaj gönderdi:</p>
          <div class="message-box">
            <p>${messageData.messagePreview}</p>
          </div>
          <a href="#" class="button">Mesajı Görüntüle</a>
        </div>
      </div>
    </body>
    </html>
  `,

  invoice: (invoiceData) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #111827; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .header { border-bottom: 2px solid #F3F4F6; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: 900; color: #EF4444; letter-spacing: -0.05em; font-style: italic; }
        .content { background: #FFFFFF; }
        .invoice-card { background: #F9FAFB; border-radius: 12px; padding: 24px; margin: 20px 0; border: 1px solid #F3F4F6; }
        .invoice-id { font-family: monospace; font-weight: bold; color: #6B7280; font-size: 14px; }
        .amount { font-size: 32px; font-weight: 900; color: #EF4444; margin: 10px 0; }
        .button { background: #111827; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 14px; }
        .footer { margin-top: 40px; border-top: 1px solid #F3F4F6; padding-top: 20px; color: #9CA3AF; font-size: 12px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">EXVITRIN</div>
        </div>
        <div class="content">
          <h1>Faturanız hazır</h1>
          <p>Merhaba ${invoiceData.customerName},</p>
          <p>ExVitrin'den yaptığınız alışveriş için teşekkür ederiz. İşte satın aldığınız tanıtım paketi için faturanız.</p>
          
          <div class="invoice-card">
            <div class="invoice-id">${invoiceData.invoiceNumber}</div>
            <div class="amount">${invoiceData.amount} TL</div>
            <p><strong>Paket:</strong> ${invoiceData.packageType}</p>
            <p><strong>İlan:</strong> ${invoiceData.listingTitle}</p>
          </div>
          
          <p style="margin-top: 30px;">
            <a href="${invoiceData.invoiceUrl}" class="button">Faturayı Online Görüntüle</a>
          </p>
        </div>
        <div class="footer">
          <p>© 2026 ExVitrin | Berlin, Almanya</p>
          <p>Bu e-postayı, platformumuzda ücretli bir tanıtım satın aldığınız için alıyorsunuz.</p>
        </div>
      </div>
    </body>
    </html>
  `
};

export default emailNotifications;
