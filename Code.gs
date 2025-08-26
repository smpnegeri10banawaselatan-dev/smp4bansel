const SPREADSHEET_ID = "1SVtLNZouu5qEQ4g8VXmgsDZL1uZqxgXRjQYLYznkaGY";
const SHEET_NAME = "data";
const FOLDER_ID = "1NhyI9OpNAFJXONbSPZMPEXs6VPIMttZz"; // Folder tujuan upload

function doGet() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = [];
  for (let i = 1; i < data.length; i++) {
    const obj = {};
    headers.forEach((h, j) => obj[h] = data[i][j]);
    rows.push(obj);
  }
  return ContentService.createTextOutput(JSON.stringify(rows))
           .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    const folder = DriveApp.getFolderById(FOLDER_ID);
    const data = JSON.parse(e.postData.contents);

    // Data.file → base64 file dari HTML
    const contentType = data.file.substring(data.file.indexOf(":")+1, data.file.indexOf(";"));
    const bytes = Utilities.base64Decode(data.file.split(",")[1]);
    const blob = Utilities.newBlob(bytes, contentType, data.nama_guru + "_" + new Date().getTime());
    const file = folder.createFile(blob);

    // Simpan ke Spreadsheet
    sheet.appendRow([new Date(), data.nama_guru, data.nip, file.getUrl()]);

    return ContentService.createTextOutput(JSON.stringify({status:"success", url:file.getUrl()}))
             .setMimeType(ContentService.MimeType.JSON);
  } catch(err){
    return ContentService.createTextOutput(JSON.stringify({status:"error", message: err.message}))
             .setMimeType(ContentService.MimeType.JSON);
  }
}
