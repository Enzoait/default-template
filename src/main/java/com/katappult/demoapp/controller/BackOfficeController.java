
package com.katappult.demoapp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class BackOfficeController {

    @RequestMapping("/backOffice")
    public String backOffice() {
        return "adminPage";
    }
}
