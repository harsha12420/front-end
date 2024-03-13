import { Injectable } from "@angular/core";
import { HttpRequestsService } from "../http-requests.service";

@Injectable({
  providedIn: "root",
})
export class SystemService {
  constructor(private http: HttpRequestsService) {}

  getInventoryList(id: any) {
    return this.http.get(`/system/v1/getInventoryList/${id}`);
  }

  addSystem(data: any) {
    return this.http.post(`/system/v1/addSystem`, data);
  }

  getAllSystem(param: any) {
    return this.http.get("/system/v1/getAllSystem", param);
  }

  getAllSystemCounts() {
    return this.http.get("/system/v1/dashboard");
  }

  deleteSystemById(id: any) {
    return this.http.delete(`/system/v1/deleteSystem/${id}`);
  }

  getSystemDetailsById(id: any) {
    return this.http.get(`/system/v1/getSystemById/${id}`);
  }

  assignSystem(data: any) {
    return this.http.post(`/system/v1/assignSystemtoUser`, data);
  }

  updateSystem(data: any, id: any) {
    return this.http.put(`/system/v1/updateSystem/${id}`, data);
  }

  getSystemHistory(id: any) {
    return this.http.get(`/system/v1/systemHistory/${id}`);
  }

  unAssignSystem(data: any) {
    return this.http.post(`/system/v1/unassignSystem`, data);
  }
}
