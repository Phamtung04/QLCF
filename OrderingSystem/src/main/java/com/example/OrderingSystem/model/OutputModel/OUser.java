package com.example.OrderingSystem.model.OutputModel;

public class OUser {
    private int id;
    private String name;
    private String email;
    private String permission;
    private String rid;
    private boolean lockUp;
    private String listBranchId;
    private String listNameBranch;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPermission() {
        return permission;
    }

    public void setPermission(String permission) {
        this.permission = permission;
    }

    public String getRid() {
        return rid;
    }

    public void setRid(String rid) {
        this.rid = rid;
    }

    public boolean isLockUp() {
        return lockUp;
    }

    public void setLockUp(boolean lockUp) {
        this.lockUp = lockUp;
    }

    public String getListBranchId() {
        return listBranchId;
    }

    public void setListBranchId(String listBranchId) {
        this.listBranchId = listBranchId;
    }

    public String getListNameBranch() {
        return listNameBranch;
    }

    public void setListNameBranch(String listNameBranch) {
        this.listNameBranch = listNameBranch;
    }
}
