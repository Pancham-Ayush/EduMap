package com.example.edumap.Controller;

import com.example.edumap.DTOs.AddCORequest;
import com.example.edumap.Entity.Course;
import com.example.edumap.Service.CourseService;
import com.example.edumap.Service.ProgramServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CourseController {

    @Autowired
    private CourseService courseService;
    @Autowired
    ProgramServices programServices;


    @PostMapping("/course")
    ResponseEntity<Course> addCourse(@RequestBody Course course) {
        Course temp = courseService.addCourse(course.getCourseCode(),course.getCourseName(), course.getCourseDescription());
        return ResponseEntity.ok(temp);
    }

    @PostMapping("/add-cos")
    public String addCourseOutcomes(@RequestBody AddCORequest request){
        programServices.addPOs(
                request.getCourseId(),
                request.getCos()
        );
        return "COs added successfully";
    }
}
