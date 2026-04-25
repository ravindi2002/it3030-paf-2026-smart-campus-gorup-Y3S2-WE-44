package com.smartcampus.api.config;

import com.smartcampus.api.model.User;
import com.smartcampus.api.model.Ticket;
import com.smartcampus.api.model.Resource;
import com.smartcampus.api.model.Booking;
import com.smartcampus.api.enums.RoleType;
import com.smartcampus.api.enums.Priority;
import com.smartcampus.api.enums.TicketStatus;
import com.smartcampus.api.enums.ResourceStatus;
import com.smartcampus.api.enums.BookingStatus;
import com.smartcampus.api.repository.UserRepository;
import com.smartcampus.api.repository.TicketRepository;
import com.smartcampus.api.repository.ResourceRepository;
import com.smartcampus.api.repository.BookingRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.time.LocalDateTime;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(
            UserRepository userRepository, 
            TicketRepository ticketRepository,
            ResourceRepository resourceRepository,
            BookingRepository bookingRepository) {
        return args -> {
            System.out.println("=== Checking for existing data ===");
            System.out.println("User count: " + userRepository.count());
            
            // Always recreate data
            userRepository.deleteAll();
            resourceRepository.deleteAll();
            
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            String passwordHash = encoder.encode("admin123");
            
            // Admin user
            User admin = userRepository.save(User.builder()
                    .username("ravindisasanika12")
                    .email("ravindisasanika12@gmail.com")
                    .password(passwordHash)
                    .fullName("Ravindi Rathnayake")
                    .role(RoleType.ADMIN)
                    .build());
            
            passwordHash = encoder.encode("admin123");
            
            // Default admin
            userRepository.save(User.builder()
                    .username("admin")
                    .email("admin@smartcampus.lk")
                    .password(passwordHash)
                    .fullName("Admin User")
                    .role(RoleType.ADMIN)
                    .build());
            
            // Technician
            User tech = userRepository.save(User.builder()
                    .username("technician")
                    .email("tech@smartcampus.lk")
                    .password(passwordHash)
                    .fullName("Technician User")
                    .role(RoleType.TECHNICIAN)
                    .build());
            
            // Student user
            User student = userRepository.save(User.builder()
                    .username("student")
                    .email("student@sliit.lk")
                    .password(passwordHash)
                    .fullName("Test Student")
                    .role(RoleType.USER)
                    .build());
            
            // ========== MODULE A: Resources Catalog ==========
            resourceRepository.save(Resource.builder()
                    .name("Lecture Hall A")
                    .resourceType("Lecture Hall")
                    .location("Building A, Floor 1")
                    .capacity(100)
                    .status(ResourceStatus.ACTIVE)
                    .description("Large lecture hall with 100 seats and modern projector")
                    .build());
            
            resourceRepository.save(Resource.builder()
                    .name("Computer Lab 101")
                    .resourceType("Lab")
                    .location("Building B, Floor 1")
                    .capacity(30)
                    .status(ResourceStatus.ACTIVE)
                    .description("Computer lab with 30 workstations")
                    .build());
            
            resourceRepository.save(Resource.builder()
                    .name("Meeting Room 201")
                    .resourceType("Meeting Room")
                    .location("Building A, Floor 2")
                    .capacity(10)
                    .status(ResourceStatus.ACTIVE)
                    .description("Small meeting room with video conferencing")
                    .build());
            
            resourceRepository.save(Resource.builder()
                    .name("Auditorium")
                    .resourceType("Auditorium")
                    .location("Building C, Floor 1")
                    .capacity(500)
                    .status(ResourceStatus.ACTIVE)
                    .description("Main auditorium with stage and sound system")
                    .build());
            
            resourceRepository.save(Resource.builder()
                    .name("Projector Set 1")
                    .resourceType("Equipment")
                    .location("Equipment Room")
                    .capacity(1)
                    .status(ResourceStatus.ACTIVE)
                    .description("Portable projector with screen")
                    .build());
            
            resourceRepository.save(Resource.builder()
                    .name("Camera Set 1")
                    .resourceType("Equipment")
                    .location("Equipment Room")
                    .capacity(1)
                    .status(ResourceStatus.OUT_OF_SERVICE)
                    .description("Video camera for recording - currently being repaired")
                    .build());
            
            // ========== Demo Tickets ==========
            ticketRepository.save(Ticket.builder()
                    .title("Projector Not Working in Room 301")
                    .description("The projector in Lecture Hall A is showing no signal.")
                    .category("Equipment")
                    .priority(Priority.HIGH)
                    .status(TicketStatus.OPEN)
                    .location("Building A, Room 301")
                    .user(student)
                    .build());
            
            ticketRepository.save(Ticket.builder()
                    .title("WiFi Connection Issue")
                    .description("Internet is very slow in the computer lab.")
                    .category("Internet/Network")
                    .priority(Priority.MEDIUM)
                    .status(TicketStatus.IN_PROGRESS)
                    .location("Building B, Lab 201")
                    .user(student)
                    .assignedTo(tech)
                    .build());
            
            System.out.println("=== Demo Data Created ===");
            System.out.println("Resources: " + resourceRepository.count());
            System.out.println("Users: " + userRepository.count());
            System.out.println("Admin: ravindisasanika12 / admin123");
        };
    }
}