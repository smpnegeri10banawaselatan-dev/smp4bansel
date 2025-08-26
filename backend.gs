// ===== KONFIGURASI =====
const SHEET_ID = '1SVtLNZouu5qEQ4g8VXmgsDZL1uZqxgXRjQYLYznkaGY';
const SHEET_NAME = 'data';
const FOLDER_ID = '1zHJ0BXe2AUGogJk7qAg9NHJwJHdMw1-F';

// ===== UTIL =====
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet_() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) throw new Error('Sheet "' + SHEET_NAME + '" tidak ditemukan.');
  return sh;
}

// ===== ROUTES =====
function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || '';
  if (action === 'list') return listGuru_();
  return jsonResponse({ ok: true, message: 'Web App aktif' });
}

function listGuru_() {
  const sh = getSheet_();
  const values = sh.getDataRange().getValues();
  if (values.length < 2) return jsonResponse({ ok: true, data: [] });

  const headers = values[0];
  const idxNo = headers.indexOf('No');
  const idxNama = headers.indexOf('Nama Guru');
  const idxNIP = headers.indexOf('NIP');
  const idxMedia = headers.indexOf('Media');

  const rows = [];
  for (let r = 1; r < values.length; r++) {
    rows.push({
      no: values[r][idxNo] || '',
      nama: values[r][idxNama] || '',
      nip: values[r][idxNIP] || '',
      media: values[r][idxMedia] || ''
    });
  }
  return jsonResponse({ ok: true, data: rows });
}

function doPost(e) {
  try {
    if (!e || !e.postData) throw new Error('Tidak ada data POST.');

    const parts = Utilities.parseMultipart(e.postData.getAs('binary'), e.postData.type);
    let filePart = null;
    const fields = {};

    parts.forEach(p => {
      if (p.name === 'file') {
        filePart = p;
      } else {
        fields[p.name] = p.contents ? p.contents.trim() : '';
      }
    });

    if (!filePart) throw new Error('File tidak ditemukan.');

    const nip = fields['nip'] || '';
    const no = fields['no'] || '';
    const nama = fields['nama'] || '';

    const folder = DriveApp.getFolderById(FOLDER_ID);
    const safeName = (nip || no || 'upload') + '_' + (filePart.fileName || 'berkas');
    const blob = filePart.blob || filePart;
    blob.setName(safeName);
    const created = folder.createFile(blob);

    created.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    const fileUrl = created.getUrl();

    const sh = getSheet_();
    const values = sh.getDataRange().getValues();
    const headers = values[0];
    const idxNo = headers.indexOf('No');
    const idxNama = headers.indexOf('Nama Guru');
    const idxNIP = headers.indexOf('NIP');
    const idxMedia = headers.indexOf('Media');

    let rowIndex = -1;
    if (nip) {
      for (let r = 1; r < values.length; r++) {
        if (String(values[r][idxNIP]).trim() === String(nip).trim()) {
          rowIndex = r + 1;
          break;
        }
      }
    }
    if (rowIndex === -1 && no) {
      for (let r = 1; r < values.length; r++) {
        if (String(values[r][idxNo]).trim() === String(no).trim()) {
          rowIndex = r + 1;
          break;
        }
      }
    }

    if (rowIndex === -1) {
      const row = new Array(headers.length).fill('');
      if (idxNo >= 0) row[idxNo] = no || '';
      if (idxNama >= 0) row[idxNama] = nama || '';
      if (idxNIP >= 0) row[idxNIP] = nip || '';
      if (idxMedia >= 0) row[idxMedia] = fileUrl;
      sh.appendRow(row);
    } else {
      sh.getRange(rowIndex, idxMedia + 1).setValue(fileUrl);
    }

    return jsonResponse({ ok: true, url: fileUrl, message: 'Upload berhasil' });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message });
  }
}
