package com.example.OrderingSystem.model.OutputModel;

import java.util.List;

public class OrderFilter {
    private List<OIDNAME> listBranch;
    private List<OFilterTable> listTable;
    private List<OIDNAME> listStatus;
    private List<OIDNAME> listDate;

    public List<OIDNAME> getListBranch() {
        return listBranch;
    }

    public void setListBranch(List<OIDNAME> listBranch) {
        this.listBranch = listBranch;
    }

    public List<OFilterTable> getListTable() {
        return listTable;
    }

    public void setListTable(List<OFilterTable> listTable) {
        this.listTable = listTable;
    }

    public List<OIDNAME> getListStatus() {
        return listStatus;
    }

    public void setListStatus(List<OIDNAME> listStatus) {
        this.listStatus = listStatus;
    }

    public List<OIDNAME> getListDate() {
        return listDate;
    }

    public void setListDate(List<OIDNAME> listDate) {
        this.listDate = listDate;
    }
}
