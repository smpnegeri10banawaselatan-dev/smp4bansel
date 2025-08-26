
const SPREADSHEET_ID = "1SVtLNZouu5qEQ4g8VXmgsDZL1uZqxgXRjQYLYznkaGY";
const SHEET_NAME = "data";
const FOLDER_ID = "1NhyI9OpNAFJXONbSPZMPEXs6VPIMttZz";

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
    Logger.log("Raw e: " + JSON.stringify(e));
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({status:"error", message:"Data tidak diterima"}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    const data = JSON.parse(e.postData.contents);
    const folder = DriveApp.getFolderById(FOLDER_ID);
    const contentType = data.file.substring(data.file.indexOf(":")+1, data.file.indexOf(";"));
    const bytes = Utilities.base64Decode(data.file.split(",")[1]);
    const blob = Utilities.newBlob(bytes, contentType, data.nama_guru + "_" + new Date().getTime());
    const file = folder.createFile(blob);
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    sheet.appendRow([new Date(), data.nama_guru, data.nip, file.getUrl()]);
    return ContentService.createTextOutput(JSON.stringify({status:"success", url:file.getUrl()}))
             .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    Logger.log("Terjadi kesalahan: " + err.message);
    return ContentService.createTextOutput(JSON.stringify({status: "error", message: err.message}))
             .setMimeType(ContentService.MimeType.JSON);
  }
}
