package com.example.OrderingSystem.model.SideModel;

public class Response<T> {
    private boolean status;
    private T result;
    private String message;
    private int total;
    private int page;
    private int limit;
    
    // Constructor, getters, and setters
    public Response(boolean status, T result, String message, int total, int page, int limit) {
        this.status = status;
        this.result = result;
        this.message = message;
        this.total = total;
        this.page = page;
        this.limit = limit;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public T getResult() {
        return result;
    }

    public void setResult(T result) {
        this.result = result;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getLimit() {
        return limit;
    }

    public void setLimit(int limit) {
        this.limit = limit;
    }
}

