# Build Stage
FROM maven:3.9.9-eclipse-temurin-17-alpine AS builder
WORKDIR /app

# Cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and build jar
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime Stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Security: run as non-root
RUN addgroup -S pecomed && adduser -S pecomed -G pecomed
USER pecomed:pecomed

COPY --from=builder /app/target/pecomed-cap-cdss-1.0.0.jar app.jar

ENV PORT=8080
EXPOSE ${PORT}

ENTRYPOINT ["java", "--enable-native-access=ALL-UNNAMED", "-Dfile.encoding=UTF-8", "-jar", "app.jar"]
