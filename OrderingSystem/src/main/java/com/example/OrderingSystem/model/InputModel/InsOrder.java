package com.example.OrderingSystem.model.InputModel;

import java.util.List;

public class InsOrder {
    private int tableId;
    private String clientId;
    private int branchId;
    private String note;
    private String status;
    private String paymentMethod;
    private List<InsOrderItem> items;

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

    public int getBranchId() {
        return branchId;
    }

    public void setBranchId(int branchId) {
        this.branchId = branchId;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public List<InsOrderItem> getItems() {
        return items;
    }

    public void setItems(List<InsOrderItem> items) {
        this.items = items;
    }

}
