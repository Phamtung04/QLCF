package com.example.OrderingSystem.controller;

import com.example.OrderingSystem.helper.PaginationHelper;
import com.example.OrderingSystem.model.InputModel.InsMenuItem;
import com.example.OrderingSystem.model.InputModel.InsRID;
import com.example.OrderingSystem.model.InputModel.InsStatusMenuItem;
import com.example.OrderingSystem.model.OutputModel.OMenuItem;
import com.example.OrderingSystem.model.QueryModel.QID;
import com.example.OrderingSystem.model.QueryModel.QMenuItem;
import com.example.OrderingSystem.model.SideModel.Response;
import com.example.OrderingSystem.service.MenuItemsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/menuItems")
public class MenuItemsController {

    @Autowired
    private MenuItemsService menuItemsService;

    @PostMapping("/GetAllFilterMenuItems")
    public ResponseEntity<Response<Object>> getAllFilterMenuItems(@RequestBody QID input) {
        try {
            Object result = menuItemsService.getAllFilterMenuItems(input);
            var response = PaginationHelper.paginate(result,"Data fetched successfully" );
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            var errorResponse = PaginationHelper.error(new Object(),ex.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
    
    @PreAuthorize("hasAuthority('SUPERADMIN') or hasAuthority('ADMIN')")
    @PostMapping("/InsOrUpdMenuItems")
    public ResponseEntity<Response<InsMenuItem>> insOrUpdMenuItems(@RequestBody InsMenuItem input) {
        try {
            String result = menuItemsService.insOrUpdMenuItems(input);
            var response = PaginationHelper.paginate(input, result);
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            var errorResponse = PaginationHelper.error(input, ex.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @PreAuthorize("hasAuthority('SUPERADMIN') or hasAuthority('ADMIN')")
    @PostMapping("/DelMenuItems")
    public ResponseEntity<Response<InsRID>> delMenuItems(@RequestBody InsRID id) {
        try {
            String result = menuItemsService.delMenuItems(id);
            var response = PaginationHelper.paginate(id, result);
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            var errorResponse = PaginationHelper.error(id, ex.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @PreAuthorize("hasAuthority('SUPERADMIN') or hasAuthority('ADMIN')")
    @PostMapping("/UpTTMenuItems")
    public ResponseEntity<Response<InsStatusMenuItem>> upTTMenuItems(@RequestBody InsStatusMenuItem input) {
        try {
            String result = menuItemsService.updateMenuItemStatus(input);
            var response = PaginationHelper.paginate(input, result);
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            var errorResponse = PaginationHelper.error(input, ex.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @PostMapping("/GetAllMenuItems")
    public ResponseEntity<Response<List<OMenuItem>>> getAllMenuItems(@RequestBody QMenuItem query) {
        try {
            List<OMenuItem> resultList = menuItemsService.getAllMenuItems(query);
            var response = PaginationHelper.paginate(resultList, query.getPage(), query.getLimit());
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            var errorResponse = PaginationHelper.error(new ArrayList<OMenuItem>(), ex.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
}
