import * as XLSX from "xlsx";

/**
 * Exports an array of plain row objects to a downloaded .xlsx file.
 * Column order/headers come from `columns` rather than object key order,
 * so callers control exactly what appears in the sheet.
 *
 * @param {{ filename: string, sheetName?: string, columns: { key: string, header: string }[], rows: object[] }} options
 */
export function exportToExcel({ filename, sheetName = "Sheet1", columns, rows }) {
  const data = rows.map((row) => {
    const record = {};
    for (const { key, header } of columns) {
      record[header] = row[key] ?? "";
    }
    return record;
  });

  const worksheet = XLSX.utils.json_to_sheet(data, { header: columns.map((c) => c.header) });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  const safeName = filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`;
  XLSX.writeFile(workbook, safeName);
}
