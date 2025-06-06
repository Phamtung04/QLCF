package com.example.OrderingSystem.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.example.OrderingSystem.model.InputModel.InsEmail;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${email.from.name}")
    private String fromName;

    @Value("${email.from.address}")
    private String fromAddress;

    public void sendEmail(InsEmail emailDetails) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
        String[] toEmails = emailDetails.getToEmail().split(",");
        for (int i = 0; i < toEmails.length; i++) {
            toEmails[i] = toEmails[i].trim();
        }
        helper.setTo(toEmails);
        helper.setSubject(emailDetails.getSubject());
        helper.setText(emailDetails.getHtmlContent(), true);

        helper.setFrom(fromName + " <" + fromAddress + ">");

        mailSender.send(mimeMessage);
    }
}
