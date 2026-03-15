package com.example.edumap;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Vector;

@SpringBootTest
@Slf4j
class EduMapApplicationTests {

    @Autowired
    VectorStore vectorStore;

    @Test
    void contextLoads() {
        System.out.println("The Spring context loaded perfectly!");
//        List<Document> documents = new ArrayList<>();
////        documents.add(new Document("Spring AI rocks!! Spring AI rocks!! Spring AI rocks!! Spring AI rocks!! Spring AI rocks!!", Map.of("meta1", "meta1")));
////        documents.add(new Document("The World is Big and Salvation Lurks Around the Corner"));
////        documents.add(new Document("You walk forward facing the past and you turn back toward the future.", Map.of("meta2", "meta2")));
//
////        documents.add(new Document("science technology.", Map.of("meta3", "meta3")));
//
////        vectorStore.add(documents);
//
        System.out.println(vectorStore.similaritySearch("ai").stream().findFirst().get());

    }

}