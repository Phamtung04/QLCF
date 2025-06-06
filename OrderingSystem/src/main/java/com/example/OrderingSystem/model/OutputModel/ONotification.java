package com.example.OrderingSystem.model.OutputModel;

public class ONotification {
    private String rid;
    private int notificationId;
    private int orderId;
    private int branchId;
    private String branchName;
    private int tableId;
    private String tableName;
    private String sentTime;
    private int adminStatus;
    private int clientStatus;
    private String orderStatus;
    public String getRid() {
        return rid;
    }
    public void setRid(String rid) {
        this.rid = rid;
    }
    public int getNotificationId() {
        return notificationId;
    }
    public void setNotificationId(int notificationId) {
        this.notificationId = notificationId;
    }
    public int getOrderId() {
        return orderId;
    }
    public void setOrderId(int orderId) {
        this.orderId = orderId;
    }
    public int getBranchId() {
        return branchId;
    }
    public void setBranchId(int branchId) {
        this.branchId = branchId;
    }
    public String getBranchName() {
        return branchName;
    }
    public void setBranchName(String branchName) {
        this.branchName = branchName;
    }
    public int getTableId() {
        return tableId;
    }
    public void setTableId(int tableId) {
        this.tableId = tableId;
    }
    public String getTableName() {
        return tableName;
    }
    public void setTableName(String tableName) {
        this.tableName = tableName;
    }
    public String getSentTime() {
        return sentTime;
    }
    public void setSentTime(String sentTime) {
        this.sentTime = sentTime;
    }
    public int getAdminStatus() {
        return adminStatus;
    }
    public void setAdminStatus(int adminStatus) {
        this.adminStatus = adminStatus;
    }
    public int getClientStatus() {
        return clientStatus;
    }
    public void setClientStatus(int clientStatus) {
        this.clientStatus = clientStatus;
    }
    public String getOrderStatus() {
        return orderStatus;
    }
    public void setOrderStatus(String orderStatus) {
        this.orderStatus = orderStatus;
    }

}
