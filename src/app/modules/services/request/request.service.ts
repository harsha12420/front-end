import { Injectable } from '@angular/core';
import { HttpRequestsService } from '../http-requests.service';

@Injectable({
    providedIn: 'root'
})
export class RequestService {

	constructor(private http: HttpRequestsService,
	) { }

	getAssetType() {
		return this.http.get(`/asset/v1/getAllAsset`)
	}

	getRequests(params:any) {
		return this.http.get(`/request/v1/getAllRequest`,params)
	}
	
	addRequest(data: any) {
		return this.http.post(`/request/v1/addRequest`,data)
	}

	getRequestDetails(iRequestId: any) {
		return this.http.get(`/request/v1/getRequestById/${iRequestId}`)
	}

	acceptRejectRequest(iRequestId: any, data: any) {
		return this.http.put(`/request/v1/acceptRejectRequest/${iRequestId}`,data)
	}

	closeRequest(data: any) {
		const formData: FormData = new FormData();
		formData.append("iRequestId", data.iRequestId);
		formData.append("vBillNo", data.vBillNo);
		formData.append("vVendorDetails", data.vVendorDetails);
		formData.append("vBillImage", data.vBillImage);

		return this.http.post(`/request/v1/closeRequest`,formData)
	}
}
