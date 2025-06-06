package com.example.OrderingSystem.controller;

import com.example.OrderingSystem.helper.PaginationHelper;
import com.example.OrderingSystem.model.InputModel.InsStatusNotification;
import com.example.OrderingSystem.model.QueryModel.QNotification;
import com.example.OrderingSystem.model.SideModel.Response;
import com.example.OrderingSystem.model.OutputModel.ONotification;
import com.example.OrderingSystem.service.NotificationsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationsController {

    @Autowired
    private NotificationsService notificationsService;

    @PostMapping("/GetAllNotifications")
    public ResponseEntity<Response<List<ONotification>>> getAllNotifications(@RequestBody QNotification query) {
        try {
            List<ONotification> resultList = notificationsService.getAllNotifications(query);
            var response = PaginationHelper.paginate(resultList, query.getPage(), query.getLimit());
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            var errorResponse = PaginationHelper.error(new ArrayList<ONotification>(), ex.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @PostMapping("/UpNotifications")
    public ResponseEntity<Response<InsStatusNotification>> upTTNotifications(@RequestBody InsStatusNotification input) {
        try {
            String result = notificationsService.updateNotificationStatus(input);
            var response = PaginationHelper.paginate(input, result);
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            var errorResponse = PaginationHelper.error(input, ex.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
}
