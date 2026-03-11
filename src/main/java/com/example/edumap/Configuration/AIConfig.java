package com.example.edumap.Configuration;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AIConfig {

    @Bean
    public ChatClient.Builder openaiChatClientBuilder(OpenAiChatModel model) {
        return ChatClient.builder(model);
    }

    @Bean
    public ChatClient openaiChatClient( ChatClient.Builder builder) {
        return builder.build();
    }
}
