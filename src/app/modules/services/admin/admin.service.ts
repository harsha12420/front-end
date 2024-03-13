import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpRequestsService } from "../http-requests.service";
import { NgxSpinnerService } from "ngx-spinner";

@Injectable({
  providedIn: "root",
})
export class AdminService {
  constructor(private http: HttpRequestsService) {}

  dashboardCount() {
    return this.http.get("/common/v1/dashboard-count");
  }

  requestDataCount() {
    return this.http.get("/request/v1/requestDashboard");
  }
  unAssignedInventoyDataCount() {
    return this.http.get("/inventory/v1/UnassignAssetDashboard");
  }
  getAllSystemCounts() {
    return this.http.get("/system/v1/dashboard");
  }

  // Inventory Management api

  getInventoryData(param: any) {
    return this.http.get("/inventory/v1/getAllInventory", param);
  }

  getAssetDetailsById(id: any) {
    return this.http.get(`/inventory/v1/getById/${id}`);
  }

  deleteAssetById(id: any) {
    return this.http.delete(`/inventory/v1/delete/${id}`);
  }

  getAllCounts() {
    return this.http.get(`/inventory/v1/dashboard`);
  }

  getAssetType() {
    return this.http.get(`/asset/v1/getAllAsset`);
  }

  addAsset(data: any) {
    return this.http.post("/inventory/v1/add", data);
  }

  updateAsset(data: any, id: any) {
    return this.http.put(`/inventory/v1/update/${id}`, data);
  }

  getUserDetailsById(id: any) {
    return this.http.get(`/userDetails/v1/${id}`);
  }

  getInventoryHistory(id: any) {
    return this.http.get(`/inventory/v1/inventoryHistory/${id}`);
  }

  assignInventoryToUser(data: any) {
    return this.http.post(`/inventory/v1/assignInventorytoUser`, data);
  }

  unAssignInventory(data: any) {
    return this.http.post(`/inventory/v1/unassignInventory`, data);
  }

  // User setting Apis

  changePassword(data: any) {
    return this.http.post("/common/v1/change-password", data);
  }

  getUserProfile() {
    return this.http.get(`/common/v1/userProfile`);
  }

  updateUserProfile(data: any) {
    return this.http.put("/common/v1/updateProfile", data);
  }

  // IOT Management APIs

  // Inventory Apis
  addIotInventory(data: any) {
    return this.http.post("/iotInventory/v1/addIotInventory", data);
  }

  getIotInventory(param: any) {
    return this.http.get(`/iotInventory/v1/getAllIotInventory`, param);
  }

  getIotInventoryById(id: any) {
    // id = iIotInventoryId
    return this.http.get(`/iotInventory/v1/getIotInventoryById/${id}`);
  }

  updateIotInventoryById(data: any, id: any) {
    // id = iIotInventoryId
    return this.http.put(`/iotInventory/v1/updateIotInventory/${id}`, data);
  }

  deleteIotInventoryById(id: any) {
    // id = iIotInventoryId
    return this.http.delete(`/iotInventory/v1/deleteIotInventory/${id}`);
  }

  getAllIotInventoryCounts() {
    return this.http.get(`/iotInventory/v1/getCount`);
  }

  // Assets Apis

  addIotAsset(data: any) {
    return this.http.post("/iotMaster/v1/add", data);
  }

  getIotAssetsTypes() {
    return this.http.get(`/iotMaster/v1/getAllIotAsset`);
  }

  deleteIotAssetById(id: any) {
    return this.http.delete(`/iotMaster/v1/delete/${id}`);
  }
}
