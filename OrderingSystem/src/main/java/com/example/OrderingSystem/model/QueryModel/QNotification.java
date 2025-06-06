package com.example.OrderingSystem.model.QueryModel;

import com.example.OrderingSystem.model.SideModel.Query;

public class QNotification extends Query {
    private String rid;
    private int userId;
    private int branchId;
    private int tableId;
    private String clientId;
    private int statusAdmin;
    private int statusClient;

    public String getRid() {
        return rid;
    }

    public void setRid(String rid) {
        this.rid = rid;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getBranchId() {
        return branchId;
    }

    public void setBranchId(int branchId) {
        this.branchId = branchId;
    }

    public int getTableId() {
        return tableId;
    }

    public void setTableId(int tableId) {
        this.tableId = tableId;
    }

    public String getClientId() {
        return clientId;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public int getStatusAdmin() {
        return statusAdmin;
    }

    public void setStatusAdmin(int statusAdmin) {
        this.statusAdmin = statusAdmin;
    }

    public int getStatusClient() {
        return statusClient;
    }

    public void setStatusClient(int statusClient) {
        this.statusClient = statusClient;
    }

}
