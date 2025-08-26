function doGet() {
  return HtmlService.createHtmlOutputFromFile('index');
}

// Spreadsheet & Folder tujuan upload
const SPREADSHEET_ID = "PASTE_SPREADSHEET_ID"; // ganti dengan ID Spreadsheet Anda
const SHEET_NAME = "data";
const FOLDER_ID = "1zHJ0BXe2AUGogJk7qAg9NHJwJHdMw1-F"; // hanya ID folder Drive

function getData() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  return sheet.getDataRange().getValues();
}

function uploadFile(data, namaGuru, nip) {
  try {
    const folder = DriveApp.getFolderById(FOLDER_ID);
    const contentType = data.substring(5, data.indexOf(';'));
    const bytes = Utilities.base64Decode(data.split(",")[1]);
    const blob = Utilities.newBlob(bytes, contentType, "MediaPembelajaran_" + new Date().getTime());

    // Upload file ke Drive
    const file = folder.createFile(blob);

    // Simpan ke Spreadsheet
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    const lastRow = sheet.getLastRow() + 1;
    sheet.getRange(lastRow, 1).setValue(lastRow - 1); // NO
    sheet.getRange(lastRow, 2).setValue(namaGuru);   // Nama Guru
    sheet.getRange(lastRow, 3).setValue(nip);        // NIP
    sheet.getRange(lastRow, 4).setValue(file.getUrl()); // Link File

    return "Upload berhasil: " + file.getUrl();
  } catch (e) {
    return "Error: " + e.message;
  }
}
