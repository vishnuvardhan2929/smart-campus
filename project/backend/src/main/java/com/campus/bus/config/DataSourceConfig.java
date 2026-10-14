package com.campus.bus.config;

import java.net.InetSocketAddress;
import java.net.Socket;
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
    private String portStr;

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

        // 1. Check for Cloud connection URLs (Railway, Supabase, AWS RDS, etc.)
        String rawUrl = null;
        if (mysqlPrivateUrl != null && !mysqlPrivateUrl.isBlank()) {
            rawUrl = mysqlPrivateUrl.trim();
            log.info("Connecting via Railway MYSQL_PRIVATE_URL");
        } else if (mysqlUrl != null && !mysqlUrl.isBlank()) {
            rawUrl = mysqlUrl.trim();
            log.info("Connecting via Railway MYSQL_URL");
        } else if (databaseUrl != null && !databaseUrl.isBlank()) {
            rawUrl = databaseUrl.trim();
            log.info("Connecting via DATABASE_URL");
        } else if (dbUrl != null && !dbUrl.isBlank()) {
            rawUrl = dbUrl.trim();
            log.info("Connecting via DB_URL");
        }

        // If a remote cloud connection string is provided
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
                config.setDriverClassName("com.mysql.cj.jdbc.Driver");
            } catch (Exception e) {
                log.warn("Error parsing URL: {}. Falling back to default format.", e.getMessage());
                String jdbcUrl = rawUrl.startsWith("jdbc:") ? rawUrl : "jdbc:" + rawUrl;
                config.setJdbcUrl(jdbcUrl);
                config.setUsername(dbUsername != null ? dbUsername : mysqlUser);
                config.setPassword(dbPassword != null ? dbPassword : mysqlPassword);
                config.setDriverClassName("com.mysql.cj.jdbc.Driver");
            }
        } 
        // 2. If separate MYSQLHOST is configured and is NOT default localhost
        else if (host != null && !host.isBlank() && !host.equalsIgnoreCase("localhost") && !host.equals("127.0.0.1")) {
            int port = 3306;
            try {
                port = Integer.parseInt(portStr);
            } catch (NumberFormatException ignored) {}

            String jdbcUrl = "jdbc:mysql://" + host + ":" + port + "/" + database +
                    "?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
            config.setJdbcUrl(jdbcUrl);
            config.setUsername(dbUsername != null ? dbUsername : mysqlUser);
            config.setPassword(dbPassword != null ? dbPassword : mysqlPassword);
            config.setDriverClassName("com.mysql.cj.jdbc.Driver");
            log.info("Connecting to configured remote host: {}:{}", host, port);
        }
        // 3. Fallback: Host is localhost. Test if a local MySQL instance is actually listening.
        else {
            int port = 3306;
            try {
                port = Integer.parseInt(portStr);
            } catch (NumberFormatException ignored) {}

            boolean localhostReachable = false;
            try (Socket socket = new Socket()) {
                socket.connect(new InetSocketAddress("127.0.0.1", port), 600);
                localhostReachable = true;
            } catch (Exception ignored) {
                localhostReachable = false;
            }

            if (localhostReachable) {
                log.info("Local MySQL server detected on port {}. Using MySQL.", port);
                String jdbcUrl = "jdbc:mysql://127.0.0.1:" + port + "/" + database +
                        "?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
                config.setJdbcUrl(jdbcUrl);
                config.setUsername(dbUsername != null ? dbUsername : mysqlUser);
                config.setPassword(dbPassword != null ? dbPassword : mysqlPassword);
                config.setDriverClassName("com.mysql.cj.jdbc.Driver");
            } else {
                // MySQL not configured or not running -> Use embedded H2 file database
                log.warn("==========================================================================");
                log.warn("Cloud MySQL variable (MYSQL_URL) is not linked yet or unreachable.");
                log.warn("Activating embedded database fallback so your Railway service stays online!");
                log.warn("Once you add MYSQL_URL in Railway Variables, it will automatically use MySQL.");
                log.warn("==========================================================================");

                config.setJdbcUrl("jdbc:h2:file:./data/campus_bus;DB_CLOSE_DELAY=-1;MODE=MySQL;DATABASE_TO_LOWER=TRUE");
                config.setDriverClassName("org.h2.Driver");
                config.setUsername("sa");
                config.setPassword("");
            }
        }

        config.setMaximumPoolSize(5);
        config.setMinimumIdle(1);
        config.setConnectionTimeout(30000);
        config.setIdleTimeout(600000);
        config.setMaxLifetime(1800000);

        log.info("DataSource configured successfully: {}", config.getJdbcUrl().replaceAll("password=([^&]*)", "password=***"));
        return new HikariDataSource(config);
    }
}
