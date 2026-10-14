package com.campus.bus.config;

import java.net.URI;
import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

@Configuration
public class DataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSourceConfig.class);

    @Value("${DB_URL:#{null}}")
    private String dbUrl;

    @Value("${DATABASE_URL:#{null}}")
    private String databaseUrl;

    @Value("${MYSQL_URL:#{null}}")
    private String mysqlUrl;

    @Value("${MYSQL_PRIVATE_URL:#{null}}")
    private String mysqlPrivateUrl;

    @Value("${MYSQLHOST:localhost}")
    private String host;

    @Value("${MYSQLPORT:3306}")
    private String port;

    @Value("${MYSQLDATABASE:campus_bus}")
    private String database;

    @Value("${DB_USERNAME:#{null}}")
    private String dbUsername;

    @Value("${MYSQLUSER:root}")
    private String mysqlUser;

    @Value("${DB_PASSWORD:#{null}}")
    private String dbPassword;

    @Value("${MYSQLPASSWORD:}")
    private String mysqlPassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        HikariConfig config = new HikariConfig();

        // Check for Railway / Cloud connection strings
        String rawUrl = null;
        if (mysqlPrivateUrl != null && !mysqlPrivateUrl.isBlank()) {
            rawUrl = mysqlPrivateUrl.trim();
            log.info("Detected Railway MYSQL_PRIVATE_URL");
        } else if (mysqlUrl != null && !mysqlUrl.isBlank()) {
            rawUrl = mysqlUrl.trim();
            log.info("Detected Railway MYSQL_URL");
        } else if (databaseUrl != null && !databaseUrl.isBlank()) {
            rawUrl = databaseUrl.trim();
            log.info("Detected DATABASE_URL");
        } else if (dbUrl != null && !dbUrl.isBlank()) {
            rawUrl = dbUrl.trim();
            log.info("Detected DB_URL");
        }

        if (rawUrl != null && (rawUrl.startsWith("mysql://") || rawUrl.startsWith("jdbc:mysql://"))) {
            try {
                String clean = rawUrl.startsWith("jdbc:") ? rawUrl.substring(5) : rawUrl;
                URI uri = new URI(clean);

                String h = uri.getHost();
                int p = uri.getPort() > 0 ? uri.getPort() : 3306;
                String path = uri.getPath();
                String db = (path != null && path.length() > 1) ? path.substring(1) : (database != null ? database : "campus_bus");

                String jdbcUrl = "jdbc:mysql://" + h + ":" + p + "/" + db +
                        "?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
                config.setJdbcUrl(jdbcUrl);

                if (uri.getUserInfo() != null && !uri.getUserInfo().isBlank()) {
                    String[] userParts = uri.getUserInfo().split(":", 2);
                    config.setUsername(userParts[0]);
                    if (userParts.length > 1) {
                        config.setPassword(userParts[1]);
                    }
                } else {
                    config.setUsername(dbUsername != null ? dbUsername : mysqlUser);
                    config.setPassword(dbPassword != null ? dbPassword : mysqlPassword);
                }
            } catch (Exception e) {
                log.warn("Failed parsing connection URI: {}. Using standard fallback.", e.getMessage());
                String jdbcUrl = rawUrl.startsWith("jdbc:") ? rawUrl : "jdbc:" + rawUrl;
                config.setJdbcUrl(jdbcUrl);
                config.setUsername(dbUsername != null ? dbUsername : mysqlUser);
                config.setPassword(dbPassword != null ? dbPassword : mysqlPassword);
            }
        } else {
            String jdbcUrl = "jdbc:mysql://" + host + ":" + port + "/" + database +
                    "?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
            config.setJdbcUrl(jdbcUrl);
            config.setUsername(dbUsername != null ? dbUsername : mysqlUser);
            config.setPassword(dbPassword != null ? dbPassword : mysqlPassword);
        }

        config.setDriverClassName("com.mysql.cj.jdbc.Driver");
        config.setMaximumPoolSize(5);
        config.setMinimumIdle(1);
        config.setConnectionTimeout(30000);
        config.setIdleTimeout(600000);
        config.setMaxLifetime(1800000);

        log.info("Initialized DataSource for host/port in JDBC URL: {}", config.getJdbcUrl().replaceAll("password=([^&]*)", "password=***"));
        return new HikariDataSource(config);
    }
}
