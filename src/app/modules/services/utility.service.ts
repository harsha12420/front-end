import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { EventEmitter } from "@angular/core";
import { jsPDF } from "jspdf";
import * as moment from 'moment';
import autoTable from 'jspdf-autotable'
import { BehaviorSubject } from 'rxjs';
import * as XLSX from 'xlsx';
@Injectable({
  providedIn: 'root',
})
export class UtilityService {

  headerData = new EventEmitter();
  userProfileData = new BehaviorSubject(null)
  constructor(private toastr: ToastrService, private spinner: NgxSpinnerService) { }

  clearStorage() {
    return localStorage.clear();
  }

  showLoading() {
    this.spinner.show();
  }

  hideLoading() {
    this.spinner.hide();
  }

  hideSpinner() {
    setTimeout(() => { this.spinner.hide(); }, 500);
  }

  showSuccessToast(msg: any) {
    this.toastr.success(msg);
  }

  showErrorToast(msg: any) {
    this.toastr.error(msg);
  }

  showInfoToast(msg: any) {
    this.toastr.info(msg);
  }

  // Emit data
  getHeaderData(data: any) {
    this.headerData.emit(data);
  }

  downloadPDF(name: any, col: any, data: any, headerText: any) {
    const doc = new jsPDF('l', 'mm', [350, 210])
    col = [col];
    autoTable(doc, {
      head: col,
      body: data,
      margin: { top: 20 },
      didDrawPage: function (data) {
          // Add header text to each page
          doc.setFontSize(12);
          doc.text(headerText, data.settings.margin.left, 10);
      },
    });
    const date: any = moment(new Date()).format('YYYY-MM-DD HH:mm')
    name = `${name}_${date}`
    doc.save(name);
  }

  downloadCSV(name: any, col: any, data: any, format: any) {
    const date: any = moment(new Date()).format('YYYY-MM-DD HH:mm');
    name = `${name}_${date}`;
    const csvData = [col, ...data]; // Assuming `col` is an array of column names
    let blobData;
    if (format === 'xlsx') {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(csvData); // Use `aoa_to_sheet` to convert array of arrays to worksheet
      // Calculate the maximum width for each column
        const columnWidths = csvData.reduce((acc, row) => {
          row.forEach((cell:any, colIndex:any) => {
              const cellWidth = (cell.toString().length + 2) * 1; // Assuming 8 pixels per character
              if (!acc[colIndex] || cellWidth > acc[colIndex]) {
                  acc[colIndex] = cellWidth;
              }
          });
          return acc;
      }, []);
      ws["!cols"] = columnWidths.map((width:any) => ({ wch: width })); // Set the width for each column
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      const excelData = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      blobData = new Blob([excelData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    } else {
      const ws = XLSX.utils.json_to_sheet(csvData);
      blobData = XLSX.utils.sheet_to_csv(ws, {
        FS: ',',
      });
    }

    const url = window.URL.createObjectURL(new Blob([blobData]));
    const extension = format;
    const fileName = `${name}.${extension}`;
    this.downloadFile(url, fileName);
  }

  downloadFile(url:any, fileName: any) {
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
  }

}
