package com.campus.bus.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Value("${app.cors.frontend-url:https://smart-campus-git-main-vishnuvardhan2929.vercel.app}")
    private String customFrontendUrl;

    private static final List<String> ALLOWED_ORIGINS = Arrays.asList(
            "https://smart-campus-git-main-vishnuvardhan2929.vercel.app",
            "https://smart-campus-seven-sage.vercel.app",
            "http://localhost:5173",
            "http://localhost:3000",
            "http://localhost:8080"
    );

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                        "https://smart-campus-git-main-vishnuvardhan2929.vercel.app",
                        "https://smart-campus-seven-sage.vercel.app",
                        "http://localhost:5173",
                        "http://localhost:3000"
                )
                .allowedOriginPatterns(
                        "https://*.vercel.app",
                        "http://localhost:*"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH")
                .allowedHeaders("*")
                .exposedHeaders("Authorization", "Content-Type")
                .allowCredentials(true)
                .maxAge(3600);
    }

    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE)
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowCredentials(true);
        config.addAllowedOrigin("https://smart-campus-git-main-vishnuvardhan2929.vercel.app");
        config.addAllowedOrigin("https://smart-campus-seven-sage.vercel.app");
        if (customFrontendUrl != null && !customFrontendUrl.isBlank()) {
            config.addAllowedOrigin(customFrontendUrl.trim().replaceAll("/+$", ""));
        }
        config.addAllowedOrigin("http://localhost:5173");
        config.addAllowedOrigin("http://localhost:3000");
        config.addAllowedOriginPattern("https://*.vercel.app");
        config.addAllowedOriginPattern("http://localhost:*");

        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        config.addExposedHeader("Authorization");
        config.addExposedHeader("Content-Type");
        config.setMaxAge(3600L);

        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
