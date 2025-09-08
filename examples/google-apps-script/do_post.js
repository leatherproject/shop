function doPost(e) {
  const phone = e.parameter.phone;
  const cart = JSON.parse(e.parameter.cart || "[]");
  const secret = e.parameter.secret;

  if (secret !== "kru56Zdf09m3Jkh4hHOJDjkhoer65249erGd34X") {
    return ContentService.createTextOutput("Unauthorized")
      .setMimeType(ContentService.MimeType.TEXT);
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("orders_list");
  if (!sheet) {
    return ContentService.createTextOutput("Sheet not found")
      .setMimeType(ContentService.MimeType.TEXT);
  }

  const now = new Date(); 

  cart.forEach(item => {
    sheet.appendRow([
      now,
      phone,
      item.model || '',
      item.name || '',
      item.price || '',
      item.count || '',
      item.selectedColor || '',
      item.selectedWidth || '',
      item.customizedValue || ''
    ]);
  });

  //sheet.appendRow([new Date(), phone, JSON.stringify(cart)]);

  return ContentService.createTextOutput("OK")
    .setMimeType(ContentService.MimeType.TEXT);
}

