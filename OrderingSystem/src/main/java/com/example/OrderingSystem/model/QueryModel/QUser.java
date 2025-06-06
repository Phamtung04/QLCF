package com.example.OrderingSystem.model.QueryModel;

import com.example.OrderingSystem.model.SideModel.Query;

public class QUser extends Query {
    private String rid;
    private String name;
    private Integer branchId;

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

    public Integer getBranchId() {
        return branchId;
    }

    public void setBranchId(Integer branchId) {
        this.branchId = branchId;
    }
}
