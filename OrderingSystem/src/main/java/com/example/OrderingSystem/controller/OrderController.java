package com.example.OrderingSystem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.OrderingSystem.helper.PaginationHelper;
import com.example.OrderingSystem.model.InputModel.InsOrder;
import com.example.OrderingSystem.model.InputModel.InsOrderUpdate;
import com.example.OrderingSystem.model.InputModel.InsPaymentMethodOrder;
import com.example.OrderingSystem.model.OutputModel.OOrder;
import com.example.OrderingSystem.model.OutputModel.OrderFilter;
import com.example.OrderingSystem.model.OutputModel.OrderResponse;
import com.example.OrderingSystem.model.QueryModel.QOrder;
import com.example.OrderingSystem.model.QueryModel.QID;
import com.example.OrderingSystem.model.SideModel.Response;
import com.example.OrderingSystem.service.OrderService;

@RestController
@RequestMapping("/api/order")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/UpdOrder")
    public ResponseEntity<Response<OOrder>> updOrder(@RequestBody InsOrderUpdate input) {
        try {
            OOrder result = orderService.updOrder(input);
            var response = PaginationHelper.paginate(result, "Order updated successfully");
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            var errorResponse = PaginationHelper.error(new OOrder(), ex.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/UpdPaymentOrder")
    public ResponseEntity<Response<InsPaymentMethodOrder>> UpdPaymentOrder(@RequestBody InsPaymentMethodOrder input) {
        try {
            String result = orderService.UpdPaymentOrder(input);
            var response = PaginationHelper.paginate(input, result);
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            var errorResponse = PaginationHelper.error(input, ex.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @PostMapping("/InsertOrder")
    public ResponseEntity<Response<OOrder>> insertOrder(@RequestBody InsOrder input) {
        try {
            OOrder result = orderService.insertOrder(input);
            var response = PaginationHelper.paginate(result, "Order added successfully");
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            var errorResponse = PaginationHelper.error(new OOrder(), ex.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @PostMapping("/GetAllOrder")
    public ResponseEntity<Response<OrderResponse>> getAllOrder(@RequestBody QOrder query) {
        try {
            OrderResponse result = orderService.getAllOrder(query);
            var response = PaginationHelper.paginate(result, "Data fetched successfully");
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            var errorResponse = PaginationHelper.error(new OrderResponse(), ex.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @PostMapping("/GetFilterOrder")
    public ResponseEntity<Response<OrderFilter>> getFilterOrder(@RequestBody QID input) {
        try {
            OrderFilter result = orderService.getFilterOrder(input);
            var response = PaginationHelper.paginate(result, "Data fetched successfully");
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            var errorResponse = PaginationHelper.error(new OrderFilter(), ex.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
}
