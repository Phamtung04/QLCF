package com.example.OrderingSystem.controller;

import com.example.OrderingSystem.helper.PaginationHelper;
import com.example.OrderingSystem.model.InputModel.InsEmail;
import com.example.OrderingSystem.model.SideModel.Response;
import com.example.OrderingSystem.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.mail.MessagingException;

@RestController
@RequestMapping("/api/email")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/sendEmail")
    public ResponseEntity<Response<InsEmail>> sendEmail(@RequestBody InsEmail emailDetails) {
        try {
            emailService.sendEmail(emailDetails);
            var response = PaginationHelper.paginate(emailDetails, "Email sent successfully");
            return ResponseEntity.ok(response);
        } catch (MessagingException ex) {
            var errorResponse = PaginationHelper.error(emailDetails, ex.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
}
