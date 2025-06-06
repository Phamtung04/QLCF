package com.example.OrderingSystem.model.QueryModel;

import com.example.OrderingSystem.model.SideModel.Query;

public class QMenuCategories extends Query {
    private String rid;
    private String name;

    public String getRid() {
        return rid;
    }

    public void setRid(String rid) {
        this.rid = rid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
