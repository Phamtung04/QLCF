package com.example.OrderingSystem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.OrderingSystem.helper.PaginationHelper;
import com.example.OrderingSystem.model.QueryModel.QHome;
import com.example.OrderingSystem.model.SideModel.Response;
import com.example.OrderingSystem.service.HomeService;

@RestController
@RequestMapping("/api/home")
public class HomeController {

    @Autowired
    private HomeService homeService;

    @PostMapping("/GetAllFilterHome")
    public ResponseEntity<Response<Object>> getAllFilterHome(@RequestBody QHome input) {
        try {
            Object result = homeService.getAllFilterHome(input);
            var response = PaginationHelper.paginate(result, "Data fetched successfully");
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            var errorResponse = PaginationHelper.error(new Object(), ex.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
}
