package com.example.OrderingSystem.service;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.example.OrderingSystem.helper.PaginationHelper;
import com.example.OrderingSystem.model.InputModel.InsOrder;
import com.example.OrderingSystem.model.InputModel.InsOrderItem;
import com.example.OrderingSystem.model.InputModel.InsOrderUpdate;
import com.example.OrderingSystem.model.InputModel.InsPaymentMethodOrder;
import com.example.OrderingSystem.model.OutputModel.OFilterTable;
import com.example.OrderingSystem.model.OutputModel.OIDNAME;
import com.example.OrderingSystem.model.OutputModel.OOrder;
import com.example.OrderingSystem.model.OutputModel.OOrderFull;
import com.example.OrderingSystem.model.OutputModel.OOrderItem;
import com.example.OrderingSystem.model.OutputModel.OrderFilter;
import com.example.OrderingSystem.model.OutputModel.OrderResponse;
import com.example.OrderingSystem.model.QueryModel.QOrder;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.OrderingSystem.model.QueryModel.QID;

import java.sql.*;
import java.util.*;

@Service
public class OrderService {

    private final JdbcTemplate jdbcTemplate;
    private final NotificationService notificationService;

    public OrderService(JdbcTemplate jdbcTemplate, NotificationService notificationService) {
        this.jdbcTemplate = jdbcTemplate;
        this.notificationService = notificationService;
    }

    public OOrder updOrder(InsOrderUpdate input) {
        String sql = "{call UpdOrderStatus(?, ?, ?)}";
        OOrder oOder = new OOrder();

        try (Connection connection = jdbcTemplate.getDataSource().getConnection();
                CallableStatement callableStatement = connection.prepareCall(sql)) {

            callableStatement.setString(1, input.getRid());
            callableStatement.setString(2, input.getStatus());
            callableStatement.setString(3, input.getMessage());

            try (ResultSet resultSet = callableStatement.executeQuery()) {
                while (resultSet.next()) {
                    oOder.setId(resultSet.getInt("id"));
                    oOder.setRid(resultSet.getString("rid"));
                    oOder.setStatus(resultSet.getString("status"));
                    oOder.setDatetime(resultSet.getString("datetime"));
                    oOder.setNote(resultSet.getString("note"));
                    oOder.setMessage(resultSet.getString("message"));
                    oOder.setBranchId(resultSet.getInt("branchId"));
                    oOder.setClientId(resultSet.getString("clientId"));
                    oOder.setTotalPrice(resultSet.getDouble("totalPrice"));
                    oOder.setPaymentMethod(resultSet.getString("paymentMethod"));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException("Database error", e);
        }
        notificationService.sendOrderUpdate(oOder);
        return oOder;
    }

    public String UpdPaymentOrder(InsPaymentMethodOrder input) {
        String sql = "{call up_PaymentMethodOrder(?, ?)}";
        String message = "";

        try (Connection connection = jdbcTemplate.getDataSource().getConnection();
                CallableStatement callableStatement = connection.prepareCall(sql)) {

            callableStatement.setString(1, input.getRid());
            callableStatement.setString(2, input.getPaymentMethod());

            try (ResultSet resultSet = callableStatement.executeQuery()) {
                while (resultSet.next()) {
                    message = resultSet.getString("message");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return e.getMessage();
        }
        return message;
    }

    public OOrder insertOrder(InsOrder input) {
        String sql = "{call insOrder(?, ?, ?, ?, ?, ?, ?)}";
        OOrder oOder = new OOrder();

        try (Connection connection = jdbcTemplate.getDataSource().getConnection();
                CallableStatement callableStatement = connection.prepareCall(sql)) {

            callableStatement.setInt(1, input.getTableId());
            callableStatement.setString(2, input.getClientId());
            callableStatement.setInt(3, input.getBranchId());
            callableStatement.setString(4, input.getStatus());
            callableStatement.setString(5, input.getNote());
            callableStatement.setString(6, input.getPaymentMethod());
            callableStatement.setString(7, convertItemsToJson(input.getItems()));

            try (ResultSet resultSet = callableStatement.executeQuery()) {
                while (resultSet.next()) {
                    oOder.setId(resultSet.getInt("id"));
                    oOder.setRid(resultSet.getString("rid"));
                    oOder.setStatus(resultSet.getString("status"));
                    oOder.setDatetime(resultSet.getString("datetime"));
                    oOder.setNote(resultSet.getString("note"));
                    oOder.setMessage(resultSet.getString("message"));
                    oOder.setBranchId(resultSet.getInt("branchId"));
                    oOder.setClientId(resultSet.getString("clientId"));
                    oOder.setTotalPrice(resultSet.getDouble("totalPrice"));
                    oOder.setPaymentMethod(resultSet.getString("paymentMethod"));
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException("Database error", e);
        }
        notificationService.sendOrderUpdate(oOder);
        return oOder;
    }

    public OrderResponse getAllOrder(QOrder query) {
        String sql = "{call get_Order(?, ?, ?, ?, ?, ?, ?)}";
        OrderResponse output = new OrderResponse();

        try (Connection connection = jdbcTemplate.getDataSource().getConnection();
                CallableStatement callableStatement = connection.prepareCall(sql)) {

            callableStatement.setInt(1, query.getOrderId());
            callableStatement.setString(2, query.getRid());
            callableStatement.setInt(3, query.getTableId());
            callableStatement.setInt(4, query.getBranchId());
            callableStatement.setString(5, query.getStatus());
            callableStatement.setString(6, query.getDate());
            callableStatement.setInt(7, query.getUserId());

            boolean hasResults = callableStatement.execute();

            List<OOrderFull> listOrder = new ArrayList<>();
            if (hasResults) {
                try (ResultSet resultSet = callableStatement.getResultSet()) {
                    while (resultSet.next()) {
                        OOrderFull ooOrderFull = new OOrderFull();
                        ooOrderFull.setRid(resultSet.getString("rid"));
                        ooOrderFull.setOrder_id(resultSet.getInt("order_id"));
                        ooOrderFull.setBranch_id(resultSet.getInt("branch_id"));
                        ooOrderFull.setBranch_name(resultSet.getString("branch_name"));
                        ooOrderFull.setTable_id(resultSet.getInt("table_id"));
                        ooOrderFull.setTable_name(resultSet.getString("table_name"));
                        ooOrderFull.setOrder_status(resultSet.getString("order_status"));
                        ooOrderFull.setOrder_note(resultSet.getString("order_note"));
                        ooOrderFull.setOrder_message(resultSet.getString("order_message"));
                        ooOrderFull.setOrder_time(resultSet.getString("order_time"));
                        ooOrderFull.setTotalPrice(resultSet.getDouble("totalPrice"));
                        ooOrderFull.setPayment_method(resultSet.getString("payment_method"));
                        listOrder.add(ooOrderFull);
                    }
                }
            }
            var response = PaginationHelper.paginate(listOrder, query.getPage(), query.getLimit());
            hasResults = callableStatement.getMoreResults();

            List<OOrderItem> listOrderItem = new ArrayList<>();
            if (hasResults) {
                try (ResultSet resultSet = callableStatement.getResultSet()) {
                    while (resultSet.next()) {
                        OOrderItem oOrderItem = new OOrderItem();
                        oOrderItem.setRid(resultSet.getString("rid"));
                        oOrderItem.setOrder_id(resultSet.getInt("order_id"));
                        oOrderItem.setOrder_item_id(resultSet.getInt("order_item_id"));
                        oOrderItem.setItem_id(resultSet.getInt("item_id"));
                        oOrderItem.setItem_name(resultSet.getString("item_name"));
                        oOrderItem.setCategory_id(resultSet.getInt("category_id"));
                        oOrderItem.setCategory_name(resultSet.getString("category_name"));
                        oOrderItem.setQuantity(resultSet.getInt("quantity"));
                        oOrderItem.setPrice(resultSet.getDouble("price"));
                        oOrderItem.setNote(resultSet.getString("note"));
                        oOrderItem.setImage(resultSet.getString("image"));
                        oOrderItem.setDate_create(resultSet.getString("date_create"));
                        listOrderItem.add(oOrderItem);
                    }
                }
            }
            output.setListOrder(response);
            output.setListOrderItem(listOrderItem);
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException("Database error", e);
        }

        return output;
    }

    public OrderFilter getFilterOrder(QID input) {
        String sql = "{call getFilter_Order(?)}";
        OrderFilter output = new OrderFilter();

        try (Connection connection = jdbcTemplate.getDataSource().getConnection();
                CallableStatement callableStatement = connection.prepareCall(sql)) {

            callableStatement.setInt(1, input.getId());

            boolean hasResults = callableStatement.execute();

            List<OIDNAME> listBranch = new ArrayList<>();
            if (hasResults) {
                try (ResultSet resultSet = callableStatement.getResultSet()) {
                    while (resultSet.next()) {
                        OIDNAME oFilterBranch = new OIDNAME();
                        oFilterBranch.setId(resultSet.getInt("id"));
                        oFilterBranch.setName(resultSet.getString("name"));
                        listBranch.add(oFilterBranch);
                    }
                }
            }

            hasResults = callableStatement.getMoreResults();

            List<OFilterTable> listTable = new ArrayList<>();
            if (hasResults) {
                try (ResultSet resultSet = callableStatement.getResultSet()) {
                    while (resultSet.next()) {
                        OFilterTable oFilterTable = new OFilterTable();
                        oFilterTable.setId(resultSet.getInt("id"));
                        oFilterTable.setName(resultSet.getString("name"));
                        oFilterTable.setBranchId(resultSet.getInt("branchId"));
                        listTable.add(oFilterTable);
                    }
                }
            }

            hasResults = callableStatement.getMoreResults();

            List<OIDNAME> listStatus = new ArrayList<>();
            if (hasResults) {
                try (ResultSet resultSet = callableStatement.getResultSet()) {
                    while (resultSet.next()) {
                        OIDNAME status = new OIDNAME();
                        status.setId(resultSet.getInt("id"));
                        status.setName(resultSet.getString("name"));
                        listStatus.add(status);
                    }
                }
            }

            hasResults = callableStatement.getMoreResults();

            List<OIDNAME> listDate = new ArrayList<>();
            if (hasResults) {
                try (ResultSet resultSet = callableStatement.getResultSet()) {
                    while (resultSet.next()) {
                        OIDNAME date = new OIDNAME();
                        date.setId(resultSet.getInt("id"));
                        date.setName(resultSet.getString("name"));
                        listDate.add(date);
                    }
                }
            }

            output.setListBranch(listBranch);
            output.setListTable(listTable);
            output.setListStatus(listStatus);
            output.setListDate(listDate);

        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException("Database error", e);
        }

        return output;
    }

    private String convertItemsToJson(List<InsOrderItem> items) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.writeValueAsString(items);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return "[]";
        }
    }
}
