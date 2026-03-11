package com.example.edumap.Service;

import com.example.edumap.Entity.Course;
import com.example.edumap.Entity.CourseOutcomes;
import com.example.edumap.Entity.Enum.ProgramOutcome_Constants;
import com.example.edumap.Entity.ProgramOutcomes;
import com.example.edumap.Repository.CourseRepo;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ProgramServices {

    @Value("classpath:prompt/po_co.txt")
    private Resource prompt;

    private final ChatClient chatClient;

    private final CourseRepo courseRepo;
    ProgramServices(ChatClient chatClient, CourseRepo courseRepo) {
        this.chatClient = chatClient;
        this.courseRepo = courseRepo;
    }

    public void addPOs(String courseId, List<String>COs){
        Optional<Course> courseOptional= courseRepo.findById(courseId);
        if(courseOptional.isEmpty())
            return;
        Course course = courseOptional.get();
        for(String co : COs){
            CourseOutcomes courseOutcomes = new CourseOutcomes();
            courseOutcomes.setCourse(course);
            courseOutcomes.setDescription(co);

            List<ProgramOutcomes> outcomes = chatClient
                    .prompt()
                    .user(u -> u
                            .text(prompt)
                            .params(Map.of("CO", co))
                    )
                    .call()
                    .entity(new ParameterizedTypeReference<List<ProgramOutcomes>>() {});
            courseOutcomes.setOutcomes(outcomes);
            course.getCOes().add(courseOutcomes);
        }
        courseRepo.save(course);
    }
}
