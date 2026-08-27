package vn.pecomed.cdss;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.Environment;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.net.URI;

@SpringBootApplication
public class PecomedApplication {

    private final Environment env;

    public PecomedApplication(Environment env) {
        this.env = env;
    }

    public static void main(String[] args) {
        // Enable GUI / Desktop integration
        System.setProperty("java.awt.headless", "false");
        SpringApplication.run(PecomedApplication.class, args);
    }

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        String port = env.getProperty("local.server.port", env.getProperty("server.port", "8080"));
        String url = "http://localhost:" + port;

        // 1. Launch standalone desktop app window
        openDesktopAppWindow(url);

        // 2. Setup System Tray icon
        setupSystemTray(url);
    }

    public static void openDesktopAppWindow(String url) {
        String os = System.getProperty("os.name", "").toLowerCase();
        try {
            if (os.contains("win")) {
                // Launch borderless standalone app window on Windows (Edge / Chrome app mode)
                try {
                    new ProcessBuilder("cmd", "/c", "start", "msedge", "--app=" + url).start();
                    return;
                } catch (Exception ignored) {
                    try {
                        new ProcessBuilder("cmd", "/c", "start", "chrome", "--app=" + url).start();
                        return;
                    } catch (Exception ignored2) {}
                }
            } else if (os.contains("linux")) {
                // Launch standalone app window on Linux
                try {
                    new ProcessBuilder("google-chrome", "--app=" + url).start();
                    return;
                } catch (Exception ignored) {
                    try {
                        new ProcessBuilder("chromium", "--app=" + url).start();
                        return;
                    } catch (Exception ignored2) {
                        try {
                            new ProcessBuilder("xdg-open", url).start();
                            return;
                        } catch (Exception ignored3) {}
                    }
                }
            } else if (os.contains("mac")) {
                try {
                    new ProcessBuilder("open", url).start();
                    return;
                } catch (Exception ignored) {}
            }

            // Standard fallback
            if (Desktop.isDesktopSupported() && Desktop.getDesktop().isSupported(Desktop.Action.BROWSE)) {
                Desktop.getDesktop().browse(new URI(url));
            }
        } catch (Exception e) {
            System.err.println("Desktop window auto-open: " + e.getMessage());
        }
    }

    private static void setupSystemTray(String url) {
        try {
            if (!GraphicsEnvironment.isHeadless() && SystemTray.isSupported()) {
                SystemTray tray = SystemTray.getSystemTray();
                Image image = createTrayIconImage();

                PopupMenu popup = new PopupMenu();

                MenuItem openItem = new MenuItem("M\u1edf PECOMED CDSS");
                openItem.addActionListener(e -> openDesktopAppWindow(url));

                MenuItem exitItem = new MenuItem("Tho\u00e1t \u1ee9ng d\u1ee5ng");
                exitItem.addActionListener(e -> System.exit(0));

                popup.add(openItem);
                popup.addSeparator();
                popup.add(exitItem);

                TrayIcon trayIcon = new TrayIcon(image, "PECOMED CAP CDSS", popup);
                trayIcon.setImageAutoSize(true);
                trayIcon.addActionListener(e -> openDesktopAppWindow(url));

                tray.add(trayIcon);
            }
        } catch (Throwable t) {
            // Ignore if headless or tray unsupported
        }
    }

    private static Image createTrayIconImage() {
        int size = 16;
        BufferedImage bi = new BufferedImage(size, size, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g2d = bi.createGraphics();
        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g2d.setColor(new Color(37, 99, 235)); // Medical Blue
        g2d.fillRoundRect(0, 0, size, size, 4, 4);
        g2d.setColor(Color.WHITE);
        g2d.setFont(new Font("SansSerif", Font.BOLD, 10));
        g2d.drawString("P", 4, 12);
        g2d.dispose();
        return bi;
    }
}

