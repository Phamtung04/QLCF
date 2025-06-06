package com.example.OrderingSystem.model.InputModel;

public class InsStatusNotification extends InsRID {
    private int statusAdmin = -1;
    private int statusClient = -1;

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
