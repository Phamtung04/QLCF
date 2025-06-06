package com.example.OrderingSystem.controller;

import com.example.OrderingSystem.helper.PaginationHelper;
import com.example.OrderingSystem.model.InputModel.InsMenuCategory;
import com.example.OrderingSystem.model.InputModel.InsRID;
import com.example.OrderingSystem.model.OutputModel.OMenuCategories;
import com.example.OrderingSystem.model.QueryModel.QMenuCategories;
import com.example.OrderingSystem.model.SideModel.Response;
import com.example.OrderingSystem.service.MenuCategoryService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/menuCategories")
public class MenuCategoriesController {

    @Autowired
    private MenuCategoryService menuCategoryService;
    
    @PreAuthorize("hasAuthority('SUPERADMIN') or hasAuthority('ADMIN')")
    @PostMapping("/InsOrUpdMenuCategorie")
    public ResponseEntity<Response<InsMenuCategory>> insOrUpdMenuCategorie(@RequestBody InsMenuCategory input) {
        try {
            String result = menuCategoryService.insOrUpdMenuCategorie(input);
            var response = PaginationHelper.paginate(input, result);
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            var errorResponse = PaginationHelper.error(input, ex.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @PreAuthorize("hasAuthority('SUPERADMIN') or hasAuthority('ADMIN')")
    @PostMapping("/DelMenuCategories")
    public ResponseEntity<Response<InsRID>> delMenuCategories(@RequestBody InsRID id) {
        try {
            String result = menuCategoryService.delMenuCategories(id);
            var response = PaginationHelper.paginate(id, result);
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            var errorResponse = PaginationHelper.error(id, ex.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @PostMapping("/GetAllMenuCategories")
    public ResponseEntity<Response<List<OMenuCategories>>> getAllMenuCategories(@RequestBody QMenuCategories query) {
        try {
            List<OMenuCategories> resultList = menuCategoryService.getAllMenuCategories(query);
            var response = PaginationHelper.paginate(resultList, query.getPage(), query.getLimit());
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            var errorResponse = PaginationHelper.error(new ArrayList<OMenuCategories>(), ex.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
}
