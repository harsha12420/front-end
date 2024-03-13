import { Injectable } from '@angular/core';
import { HttpRequestsService } from '../http-requests.service';

@Injectable({
    providedIn: 'root'
})
export class BillService {

    constructor(private http: HttpRequestsService,
    ) { }



    addBill(data: any) {
        return this.http.post(`/bill/v1/addBill`, data)
    }

    getAllBillList(param: any) {
        return this.http.get('/bill/v1/getAllBill', param)
    }

    deleteBill(id: any) {
        return this.http.delete(`/bill/v1/deleteBill/${id}`)
    }

    getBillDetailsById(id: any) {
        return this.http.get(`/bill/v1/getBillById/${id}`)
    }

    updateBill(data: any, id: any) {
        return this.http.put(`/bill/v1/updateBill/${id}`, data)
    }
}
