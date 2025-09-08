function doGet() {
  const ss = SpreadsheetApp.openById('1IVnH3sKeT9rZQdg4YUqNhJyz3lUE5b4YsL9oJWVQMDA'); // замените на свой ID

  const sheetNames = [
    'ourProducts',
    'gallery',
    'workshop',
    'information'
    
    // Добавляй названия листов, соответствующие страницам
  ];

  let allItems = [];

  sheetNames.forEach(name => {
    const sheet = ss.getSheetByName(name);
    if (sheet) {
      const items = getDataFromSheet(sheet);
      allItems = allItems.concat(items);
    }
  });

  const output = {
    data: allItems
  };
  Logger.log('Итоговый JSON: %s', JSON.stringify(output, null, 2));
  const json = JSON.stringify(output, null, 2);

  // --- сохраняем на Google Диск ---
  const folder = DriveApp.getFolderById('1EvNCOgqx0_-5x_JLh8SKmHvajvpBvhmg'); // укажешь ниже
  //const file = folder.createFile('data.json', json, 'application/json');
  //Logger.log('JSON файл создан: ' + file.getUrl());
  const files = folder.getFilesByName('data.json');
  if (files.hasNext()) {
    const file = files.next();
    file.setContent(json);  // перезаписать файл
    Logger.log('JSON файл перезаписан: ' + file.getUrl());
  } else {
    const file = folder.createFile('data.json', json, 'application/json');
    Logger.log('JSON файл создан: ' + file.getUrl());
  }

  return ContentService
    .createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}

function getDataFromSheet(sheet) {
  const values = sheet.getDataRange().getValues();
  const headers = values.shift(); // первая строка — заголовки
  const page = sheet.getName();

  const items = values.map(row => {
    const item = {};
    headers.forEach((key, i) => {
      const val = row[i];
      if (val !== '' && val !== null && val !== undefined) {
        // --- Точечная правка только для products
        if (key === 'imageModal' && row[headers.indexOf('type')] === 'products') {
          item[key] = val.toString().split(',').map(s => s.trim());
        } else if (key === 'price') {
          const cleaned = val.toString().replace(/,/g, '.').replace(/[^\d.]/g, '');
          item[key] = parseFloat(cleaned);
        } else {
          item[key] = val;
        }
      }
    });

    // в случае пустого поля model в таблице - добавляем уникальность для products, рандомное число + индекс в массиве
    if (item.type === 'products' && !item.model) {
      const index = values.indexOf(row); // индекс строки в массиве
      const randomValue = Math.random().toString().slice(2, 8);
      item.model = `${randomValue}-${index}`;
      //item.model = item.model
       // ? `${item.model}-${randomValue}-${index}`
       // : `${randomValue}-${index}`;
    }

    item.page = page;
    return item;
  });

  return items;
}


