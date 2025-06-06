package com.example.OrderingSystem.model.InputModel;

public class InsUser {
    private String rid;
    private String userName;
    private String password;
    private Integer branchId;
    private String email;
    private String permission;
    private boolean lockUp = false;
    
    public String getRid() {
        return rid;
    }
    public void setRid(String rid) {
        this.rid = rid;
    }
    public String getUserName() {
        return userName;
    }
    public void setUserName(String userName) {
        this.userName = userName;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public Integer getBranchId() {
        return branchId;
    }
    public void setBranchId(Integer branchId) {
        this.branchId = branchId;
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
    public boolean isLockUp() {
        return lockUp;
    }
    public void setLockUp(boolean lockUp) {
        this.lockUp = lockUp;
    }
}