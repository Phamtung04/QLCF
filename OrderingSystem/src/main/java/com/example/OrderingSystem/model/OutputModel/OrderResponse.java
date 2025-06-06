package com.example.OrderingSystem.model.OutputModel;

import java.util.List;

import com.example.OrderingSystem.model.SideModel.Response;

public class OrderResponse {
    private Response<List<OOrderFull>> listOrder;
    private List<OOrderItem> listOrderItem;

    public Response<List<OOrderFull>> getListOrder() {
        return listOrder;
    }

    public void setListOrder(Response<List<OOrderFull>> listOrder) {
        this.listOrder = listOrder;
    }

    public List<OOrderItem> getListOrderItem() {
        return listOrderItem;
    }

    public void setListOrderItem(List<OOrderItem> listOrderItem) {
        this.listOrderItem = listOrderItem;
    }
}
