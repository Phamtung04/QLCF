package com.example.OrderingSystem.model.SideModel;

public class Query {
    private Integer limit;
    private Integer page;

    // Getters and setters
    public Integer getLimit() {
        return limit;
    }

    public void setLimit(Integer limit) {
        this.limit = limit;
    }

    public Integer getPage() {
        return page;
    }

    public void setPage(Integer page) {
        this.page = page;
    }
}