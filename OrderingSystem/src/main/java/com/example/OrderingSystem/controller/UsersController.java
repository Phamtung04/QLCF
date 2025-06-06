package com.example.OrderingSystem.controller;

import com.example.OrderingSystem.helper.PaginationHelper;
import com.example.OrderingSystem.model.InputModel.InsStatusUser;
import com.example.OrderingSystem.model.InputModel.InsUser;
import com.example.OrderingSystem.model.OutputModel.OUser;
import com.example.OrderingSystem.model.QueryModel.QUser;
import com.example.OrderingSystem.model.SideModel.Response;
import com.example.OrderingSystem.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UsersController {

    @Autowired
    private UserService userService;
    
    @PreAuthorize("hasAuthority('SUPERADMIN') or hasAuthority('ADMIN')")
    @PostMapping("/InsOrUpdUsers")
    public ResponseEntity<Response<InsUser>> insOrUpdUsers(@RequestBody InsUser input) {
        try {
            String result = userService.insOrUpdUsers(input);
            var response = PaginationHelper.paginate(input, result);
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            var errorResponse = PaginationHelper.error(input, ex.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @PreAuthorize("hasAuthority('SUPERADMIN') or hasAuthority('ADMIN')")
    @PostMapping("/GetAllUsers")
    public ResponseEntity<Response<List<OUser>>> getAllUsers(@RequestBody QUser query) {
        try {
            List<OUser> resultList = userService.getUsers(query);
            var response = PaginationHelper.paginate(resultList, query.getPage(), query.getLimit());
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            var errorResponse = PaginationHelper.error(new ArrayList<OUser>(), ex.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @PreAuthorize("hasAuthority('SUPERADMIN') or hasAuthority('ADMIN')")
    @PostMapping("/UpTTUser")
    public ResponseEntity<Response<InsStatusUser>> upTTUser(@RequestBody InsStatusUser input) {
        try {
            String result = userService.upTTUser(input);
            var response = PaginationHelper.paginate(input, result);
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            var errorResponse = PaginationHelper.error(input, ex.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
}
