package com.cinevault.config;

import com.cinevault.entity.*;
import com.cinevault.entity.enums.SeatCategory;
import com.cinevault.entity.enums.UserRole;
import com.cinevault.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Seeds the database with initial development data.
 * Only seeds if the database is empty (checks movie count).
 * Demonstrates: Collections, Generics, Streams, Lambda, Constructors,
 * Method calls, Encapsulation, Enums.
 */
@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner seedDatabase(
            UserRepository userRepository,
            MovieRepository movieRepository,
            TheatreRepository theatreRepository,
            ScreenRepository screenRepository,
            SeatRepository seatRepository,
            ShowRepository showRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {
            // Only seed if database is empty
            if (movieRepository.count() > 0) {
                System.out.println("[DataSeeder] Database already seeded. Skipping.");
                return;
            }

            System.out.println("[DataSeeder] Seeding database with initial data...");

            // ── 1. USERS ──────────────────────────────────────────────
            User admin = new User("Admin", "admin@cinevault.com",
                    passwordEncoder.encode("admin123"), UserRole.ADMIN);
            User testUser = new User("Bhanu Prakash", "bhanu@gmail.com",
                    passwordEncoder.encode("user123"));
            User testUser2 = new User("Ravi Kumar", "ravi@gmail.com",
                    passwordEncoder.encode("user123"));

            userRepository.saveAll(List.of(admin, testUser, testUser2));
            System.out.println("[DataSeeder] Created " + 3 + " users (1 admin, 2 regular)");

            // ── 2. MOVIES ─────────────────────────────────────────────
            List<Movie> movies = createMovies();
            movieRepository.saveAll(movies);
            System.out.println("[DataSeeder] Created " + movies.size() + " movies");

            // ── 3. THEATRES ───────────────────────────────────────────
            List<Theatre> theatres = createHyderabadTheatres();
            theatreRepository.saveAll(theatres);
            System.out.println("[DataSeeder] Created " + theatres.size() + " theatres");

            // ── 4. SCREENS & SEATS ────────────────────────────────────
            List<Screen> allScreens = new ArrayList<>();
            List<Seat> allSeats = new ArrayList<>();

            for (Theatre theatre : theatres) {
                List<Screen> screens = createScreensForTheatre(theatre);
                allScreens.addAll(screens);
                for (Screen screen : screens) {
                    allSeats.addAll(createSeatsForScreen(screen));
                }
            }

            screenRepository.saveAll(allScreens);
            seatRepository.saveAll(allSeats);
            System.out.println("[DataSeeder] Created " + allScreens.size() + " screens and " + allSeats.size() + " seats");

            // ── 5. SHOWS ──────────────────────────────────────────────
            List<Show> allShows = createShows(movies, allScreens);
            showRepository.saveAll(allShows);
            System.out.println("[DataSeeder] Created " + allShows.size() + " shows");

            System.out.println("[DataSeeder] ✓ Database seeding complete!");
        };
    }

    // ══════════════════════════════════════════════════════════════════
    // MOVIE DATA (matches frontend's existing data structure)
    // ══════════════════════════════════════════════════════════════════
    private List<Movie> createMovies() {
        List<Movie> movies = new ArrayList<>();

        movies.add(buildMovie("Neon Drift", "Speed has a new color.",
                "In a dystopian future, underground racers compete in anti-gravity vehicles. A young prodigy must win the ultimate race to save her family.",
                "Action,Sci-Fi", 125, 8.4, "2024-05-20", "English", "PG-13",
                "Elena Rostova", "Mia Thorne,Julian Vance,Kaelen Rigg",
                "https://picsum.photos/seed/movie1/400/600", "https://picsum.photos/seed/movie1bg/1200/500",
                true, "now_showing"));

        movies.add(buildMovie("The Silent Code", "Some secrets should remain encrypted.",
                "A cybersecurity expert uncovers a conspiracy hidden within the global banking network. Now, she is the target of a ruthless syndicate.",
                "Thriller,Mystery", 110, 7.9, "2024-04-12", "English", "R",
                "Marcus Lin", "Sarah Jenkins,David Oyelowo,Ken Watanabe",
                "https://picsum.photos/seed/movie2/400/600", "https://picsum.photos/seed/movie2bg/1200/500",
                true, "now_showing"));

        movies.add(buildMovie("Whispers of the Forest", "Nature has its own voice.",
                "A grieving father retreats to an isolated cabin, only to discover the forest is inhabited by mythical creatures who need his help.",
                "Fantasy,Drama", 135, 8.7, "2024-06-01", "Spanish", "U/A",
                "Guillermo Valdez", "Antonio Banderas,Penelope Cruz,Javier Bardem",
                "https://picsum.photos/seed/movie3/400/600", "https://picsum.photos/seed/movie3bg/1200/500",
                true, "coming_soon"));

        movies.add(buildMovie("Laugh Out Loud", "Life is a joke. Just laugh.",
                "Three friends decide to start a comedy club in their small town, facing hilarious obstacles and unexpected success along the way.",
                "Comedy", 95, 7.2, "2024-03-05", "English", "PG-13",
                "Samantha Ray", "Kevin Hart,Tiffany Haddish,Jack Black",
                "https://picsum.photos/seed/movie4/400/600", "https://picsum.photos/seed/movie4bg/1200/500",
                true, "now_showing"));

        movies.add(buildMovie("Shadows of the Past", "You cannot outrun your history.",
                "A retired detective is pulled back into the fray when a copycat killer mimics his most famous, unsolved case.",
                "Crime,Thriller", 140, 8.1, "2024-07-15", "French", "R",
                "Luc Pierre", "Jean Reno,Marion Cotillard,Vincent Cassel",
                "https://picsum.photos/seed/movie5/400/600", "https://picsum.photos/seed/movie5bg/1200/500",
                false, "coming_soon"));

        movies.add(buildMovie("Cosmic Journeys", "To the edge of the universe and back.",
                "A documentary exploring the latest discoveries in astrophysics, featuring breathtaking visuals of black holes and distant galaxies.",
                "Documentary,Sci-Fi", 120, 9.0, "2024-02-28", "English", "PG",
                "Neil Tyson", "Morgan Freeman (Narrator)",
                "https://picsum.photos/seed/movie6/400/600", "https://picsum.photos/seed/movie6bg/1200/500",
                false, "now_showing"));

        movies.add(buildMovie("Love in Verona", "A modern romance in an ancient city.",
                "An American architect travels to Italy for work and unexpectedly falls for a local artisan, but their different worlds threaten to tear them apart.",
                "Romance,Drama", 115, 7.5, "2024-08-10", "English", "PG-13",
                "Sofia Romano", "Anne Hathaway,Oscar Isaac,Stanley Tucci",
                "https://picsum.photos/seed/movie7/400/600", "https://picsum.photos/seed/movie7bg/1200/500",
                false, "coming_soon"));

        movies.add(buildMovie("Nightmare Hollow", "Don't go into the woods.",
                "A group of teenagers camping in a remote valley encounter a terrifying urban legend brought to life.",
                "Horror", 105, 6.8, "2024-09-30", "English", "R",
                "James Wan", "Taissa Farmiga,Patrick Wilson,Vera Farmiga",
                "https://picsum.photos/seed/movie8/400/600", "https://picsum.photos/seed/movie8bg/1200/500",
                false, "coming_soon"));

        movies.add(buildMovie("The Great Bake Off", "May the best baker win.",
                "Amateur bakers from across the country compete in a high-stakes competition where friendships are forged and soufflés fall.",
                "Comedy,Family", 90, 7.0, "2024-01-15", "English", "PG",
                "Paul Hollywood", "Melissa McCarthy,Steve Carell,Emma Stone",
                "https://picsum.photos/seed/movie9/400/600", "https://picsum.photos/seed/movie9bg/1200/500",
                false, "now_showing"));

        movies.add(buildMovie("Cyber Samurai", "Honor in the digital age.",
                "An animated epic following a rogue samurai hacker who fights against a mega-corporation controlling the neon-lit metropolis.",
                "Animation,Action,Sci-Fi", 118, 8.9, "2024-11-20", "Japanese", "U/A",
                "Hayao Miyazaki", "Kenjiro Tsuda,Aoi Yuki,Takahiro Sakurai",
                "https://picsum.photos/seed/movie10/400/600", "https://picsum.photos/seed/movie10bg/1200/500",
                false, "coming_soon"));

        movies.add(buildMovie("Ocean Deep", "Explore the unknown.",
                "A deep-sea exploration team discovers an ancient, underwater city, but they are not alone in the depths.",
                "Adventure,Sci-Fi", 130, 8.2, "2024-10-05", "English", "PG-13",
                "James Cameron", "Zoe Saldana,Sam Worthington,Sigourney Weaver",
                "https://picsum.photos/seed/movie11/400/600", "https://picsum.photos/seed/movie11bg/1200/500",
                false, "coming_soon"));

        movies.add(buildMovie("The Royal Scandal", "Crowns will fall.",
                "A historical drama detailing the political intrigue and secret romances of a 18th-century European court.",
                "Drama,History", 150, 8.5, "2024-12-25", "English", "R",
                "Ridley Scott", "Olivia Colman,Colin Firth,Helena Bonham Carter",
                "https://picsum.photos/seed/movie12/400/600", "https://picsum.photos/seed/movie12bg/1200/500",
                false, "coming_soon"));

        return movies;
    }

    private Movie buildMovie(String title, String tagline, String description,
                             String genre, int duration, double rating, String releaseDate,
                             String language, String certification, String director,
                             String cast, String poster, String backdrop,
                             boolean featured, String status) {
        Movie movie = new Movie(title, genre, duration, language);
        movie.setTagline(tagline);
        movie.setDescription(description);
        movie.setRating(rating);
        movie.setReleaseDate(LocalDate.parse(releaseDate));
        movie.setCertification(certification);
        movie.setDirector(director);
        movie.setCastMembers(cast);
        movie.setPosterUrl(poster);
        movie.setBackdropUrl(backdrop);
        movie.setFeatured(featured);
        movie.setStatus(status);
        return movie;
    }

    // ══════════════════════════════════════════════════════════════════
    // HYDERABAD THEATRES - realistic Hyderabad/Secunderabad cinemas
    // ══════════════════════════════════════════════════════════════════
    private List<Theatre> createHyderabadTheatres() {
        List<Theatre> theatres = new ArrayList<>();

        // Major Multiplexes
        theatres.add(buildTheatre("PVR INOX Nexus Mall", "Kukatpally", "Nexus Mall, KPHB, Kukatpally",
                "IMAX,Dolby Atmos,Recliner Seating,Food Court"));
        theatres.add(buildTheatre("PVR INOX GVK One", "Banjara Hills", "GVK One Mall, Road No. 1, Banjara Hills",
                "IMAX,Dolby Atmos,4DX,Premium Dining"));
        theatres.add(buildTheatre("PVR INOX Irrum Manzil", "Banjara Hills", "Near Irrum Manzil Metro Station",
                "Dolby Atmos,Recliner Seating,Food & Beverage"));
        theatres.add(buildTheatre("INOX Maheshwari Parmeshwari Mall", "Kachiguda", "MP Mall, Kachiguda",
                "Standard 2D,3D,Dolby Sound"));

        // AMB Cinemas
        theatres.add(buildTheatre("AMB Cinemas", "Gachibowli", "Beside IKEA, Gachibowli, Hyderabad",
                "IMAX,Dolby Atmos,Dolby Vision,Luxury Recliner,Gourmet Dining,Valet Parking"));

        // Asian Cinemas
        theatres.add(buildTheatre("Asian Radhika Multiplex", "Ameerpet", "S.P. Road, Ameerpet",
                "Standard 2D,3D,Dolby Sound,Snack Bar"));
        theatres.add(buildTheatre("Asian Mukta A2 Cinemas", "Erramanzil", "Erramanzil Colony, Banjara Hills",
                "Standard 2D,3D,Food & Beverage"));
        theatres.add(buildTheatre("Asian Cinemas Uppal", "Uppal", "Uppal Ring Road, Uppal",
                "Standard 2D,3D,Dolby Sound"));

        // Cinepolis
        theatres.add(buildTheatre("Cinepolis Sudha Cinemas", "Kukatpally", "Manjeera Mall, KPHB, Kukatpally",
                "Dolby Atmos,3D,VIP Lounge,Food Court"));
        theatres.add(buildTheatre("Cinepolis Mantra Mall", "Attapur", "Mantra Mall, Attapur",
                "3D,Dolby Sound,Snack Bar"));

        // Miraj Cinemas
        theatres.add(buildTheatre("Miraj Cinemas Raghavendra", "Kukatpally", "Kukatpally Housing Board",
                "Standard 2D,3D,Snack Bar"));
        theatres.add(buildTheatre("Miraj Cinemas ECIL", "ECIL", "ECIL X Roads, Secunderabad",
                "Standard 2D,3D,Food Court"));

        // Sudarshan
        theatres.add(buildTheatre("Sudarshan 35mm", "RTC X Roads", "RTC Cross Roads, Hyderabad",
                "Standard 2D,70mm Screen,Heritage Cinema"));

        // Prasads
        theatres.add(buildTheatre("Prasads Multiplex IMAX", "Necklace Road", "NTR Gardens, Necklace Road, Hyderabad",
                "IMAX,Dolby Atmos,Large Format,Food Court,Parking"));

        // Sandhya
        theatres.add(buildTheatre("Sandhya 70mm", "RTC X Roads", "RTC Cross Roads, Hyderabad",
                "70mm Screen,Standard 2D,Heritage Cinema"));

        // GPR IMAX
        theatres.add(buildTheatre("GPR IMAX 3D Multiplex", "Miyapur", "Near Miyapur Metro Station",
                "IMAX,3D,Dolby Sound,Food Court"));

        // Platinum Movietime
        theatres.add(buildTheatre("Platinum Movietime", "Dilsukhnagar", "Moosarambagh, Dilsukhnagar",
                "Standard 2D,3D,Dolby Sound"));

        // PVR INOX Forum Sujana Mall
        theatres.add(buildTheatre("PVR INOX Forum Sujana Mall", "Kukatpally", "Forum Sujana Mall, KPHB",
                "Dolby Atmos,3D,Recliner Seating,Food Court"));

        // Carnival Cinemas
        theatres.add(buildTheatre("Carnival Cinemas BigLife", "Ameerpet", "Near Ameerpet Metro Station",
                "Standard 2D,3D,BigLife Premium"));

        // PVR INOX Sarath City
        theatres.add(buildTheatre("PVR INOX Sarath City Capital Mall", "Gachibowli", "Sarath City Capital Mall, Gachibowli",
                "IMAX,Dolby Atmos,4DX,Luxury Recliner,Premium Dining"));

        return theatres;
    }

    private Theatre buildTheatre(String name, String location, String address, String facilities) {
        Theatre theatre = new Theatre(name, location, address);
        theatre.setFacilities(facilities);
        return theatre;
    }

    // ══════════════════════════════════════════════════════════════════
    // SCREENS - create 2-3 screens per theatre
    // ══════════════════════════════════════════════════════════════════
    private List<Screen> createScreensForTheatre(Theatre theatre) {
        List<Screen> screens = new ArrayList<>();
        String facilities = theatre.getFacilities() != null ? theatre.getFacilities() : "";

        // Screen 1 - standard or best type available
        String screen1Type = "Standard";
        if (facilities.contains("IMAX")) screen1Type = "IMAX";
        else if (facilities.contains("Dolby Atmos")) screen1Type = "Dolby Atmos";
        screens.add(new Screen("Screen 1", screen1Type, 120, theatre));

        // Screen 2
        String screen2Type = "Standard";
        if (facilities.contains("Dolby Atmos") && !screen1Type.equals("Dolby Atmos"))
            screen2Type = "Dolby Atmos";
        else if (facilities.contains("3D")) screen2Type = "3D";
        screens.add(new Screen("Screen 2", screen2Type, 100, theatre));

        // Screen 3 (only for major multiplexes with IMAX or 4DX)
        if (facilities.contains("4DX") || facilities.contains("IMAX")) {
            String screen3Type = facilities.contains("4DX") ? "4DX" : "Standard";
            screens.add(new Screen("Screen 3", screen3Type, 80, theatre));
        }

        return screens;
    }

    // ══════════════════════════════════════════════════════════════════
    // SEATS - create seat layout for each screen
    // Matches frontend layout: rows A-J, 12 seats per row
    // A-B: Premium, C-H: Regular, I-J: Regular (Economy equivalent)
    // ══════════════════════════════════════════════════════════════════
    private List<Seat> createSeatsForScreen(Screen screen) {
        List<Seat> seats = new ArrayList<>();
        String[] rowLabels = {"A", "B", "C", "D", "E", "F", "G", "H", "I", "J"};
        int seatsPerRow = 12;

        for (int r = 0; r < rowLabels.length; r++) {
            SeatCategory category;
            if (r < 2) {
                category = SeatCategory.PREMIUM;  // Rows A, B
            } else if (r >= 8) {
                category = SeatCategory.REGULAR;   // Rows I, J (front rows, cheapest)
            } else {
                category = SeatCategory.REGULAR;   // Rows C-H
            }

            // For screens with IMAX/Dolby, last 2 rows could be recliners
            if (r < 2 && screen.getScreenType() != null &&
                    (screen.getScreenType().contains("IMAX") || screen.getScreenType().contains("4DX"))) {
                category = SeatCategory.RECLINER;
            }

            for (int s = 1; s <= seatsPerRow; s++) {
                seats.add(new Seat(rowLabels[r], s, category, screen));
            }
        }

        return seats;
    }

    // ══════════════════════════════════════════════════════════════════
    // SHOWS - create shows for next 5 days, matching frontend pattern
    // ══════════════════════════════════════════════════════════════════
    private List<Show> createShows(List<Movie> movies, List<Screen> screens) {
        List<Show> shows = new ArrayList<>();
        LocalDate today = LocalDate.now();

        // Show times matching the frontend
        LocalTime[] showTimes = {
                LocalTime.of(10, 30),  // 10:30 AM
                LocalTime.of(13, 45),  // 1:45 PM
                LocalTime.of(16, 30),  // 4:30 PM
                LocalTime.of(19, 15),  // 7:15 PM
                LocalTime.of(22, 0)    // 10:00 PM
        };

        // Base prices by screen type (realistic Hyderabad pricing in INR)
        // Frontend uses smaller numbers but shows ₹ symbol - we'll use realistic INR prices

        // Only create shows for "now_showing" movies
        List<Movie> nowShowing = movies.stream()
                .filter(m -> "now_showing".equals(m.getStatus()))
                .toList();

        int screenIndex = 0;
        for (Movie movie : nowShowing) {
            // Assign each movie to a few screens (rotating)
            for (int day = 0; day < 5; day++) {
                LocalDate showDate = today.plusDays(day);

                // Each movie shows on 3-5 screens
                int screensForMovie = Math.min(5, screens.size());
                for (int i = 0; i < screensForMovie; i++) {
                    Screen screen = screens.get((screenIndex + i) % screens.size());

                    // 3 shows per screen per day
                    int numShows = 3;
                    for (int t = 0; t < numShows; t++) {
                        LocalTime time = showTimes[t % showTimes.length];
                        BigDecimal basePrice = getBasePrice(screen.getScreenType(), time);

                        shows.add(new Show(movie, screen, showDate, time, basePrice));
                    }
                }
            }
            screenIndex += 3; // Rotate through different screens
        }

        return shows;
    }

    /**
     * Calculates base price based on screen type and show time.
     * Realistic Hyderabad pricing.
     * Demonstrates: method with conditional logic, BigDecimal usage.
     */
    private BigDecimal getBasePrice(String screenType, LocalTime time) {
        // Base pricing by screen type
        double base;
        if (screenType == null) screenType = "Standard";

        base = switch (screenType) {
            case "IMAX" -> 350.0;
            case "Dolby Atmos" -> 280.0;
            case "4DX" -> 400.0;
            case "3D" -> 220.0;
            default -> 150.0; // Standard
        };

        // Time-based surcharge
        int hour = time.getHour();
        if (hour >= 18) { // Evening shows (6 PM onwards) cost more
            base += 50.0;
        } else if (hour <= 11) { // Morning shows cheaper
            base -= 30.0;
        }

        return BigDecimal.valueOf(base);
    }
}
