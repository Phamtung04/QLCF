package com.example.OrderingSystem.model.OutputModel;

public class OFilterBranch {
    private int id;
    private String name;
    private String managerEmails;
    
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
    public String getManagerEmails() {
        return managerEmails;
    }
    public void setManagerEmails(String managerEmails) {
        this.managerEmails = managerEmails;
    }
}
