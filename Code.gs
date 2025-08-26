const SPREADSHEET_ID = "1SVtLNZouu5qEQ4g8VXmgsDZL1uZqxgXRjQYLYznkaGY";
const SHEET_NAME = "data";
const FOLDER_ID = "1NhyI9OpNAFJXONbSPZMPEXs6VPIMttZz";

// GET → Ambil semua data
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

// POST → Simpan data + upload file ke Drive
function doPost(e) {
  try {
    Logger.log("Data diterima: " + JSON.stringify(e));

    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    const folder = DriveApp.getFolderById(FOLDER_ID);
    const data = JSON.parse(e.postData.contents);

    // Convert base64 file menjadi Blob
    const contentType = data.file.substring(data.file.indexOf(":")+1, data.file.indexOf(";"));
    const bytes = Utilities.base64Decode(data.file.split(",")[1]);
    const blob = Utilities.newBlob(bytes, contentType, data.nama_guru + "_" + new Date().getTime());
    const file = folder.createFile(blob);

    // Simpan ke Spreadsheet
    sheet.appendRow([new Date(), data.nama_guru, data.nip, file.getUrl()]);

    return ContentService.createTextOutput(JSON.stringify({status:"success", url:file.getUrl()}))
             .setMimeType(ContentService.MimeType.JSON);

  } catch(err){
    Logger.log("Terjadi kesalahan: " + err.message);
    return ContentService.createTextOutput(JSON.stringify({status: "error", message: err.message}))
             .setMimeType(ContentService.MimeType.JSON);
  }
}
