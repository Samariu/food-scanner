const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';

function doPost(e) {
  try {
    const data = JSON.parse(e.parameter.payload);
    const sheetName = data.sheetName || 'Sheet1';
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(sheetName);

    if (!sheet) {
      return jsonResponse({ success: false, error: `Sheet "${sheetName}" not found` });
    }

    const price   = parseFloat(data.pricePer100g)   || 0;
    const protein = parseFloat(data.proteinPer100g)  || 0;
    const kcal    = parseFloat(data.kcalPer100g)     || 0;

    const pricePer10gProtein = protein > 0 ? round2(price   / protein * 10) : '';
    const kcalPer10gProtein  = protein > 0 ? round2(kcal    / protein * 10) : '';

    sheet.appendRow([
      data.typeOfFood      || '',
      data.specificProduct || '',
      data.link            || '',
      price   || '',
      kcal    || '',
      protein || '',
      pricePer10gProtein,
      kcalPer10gProtein,
      data.diet    || '',
      data.shop    || '',
      data.comment || ''
    ]);

    return jsonResponse({ success: true });
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
