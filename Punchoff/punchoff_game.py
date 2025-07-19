import pygame
import sys

# --- Init ---
pygame.init()
WIDTH, HEIGHT = 960, 540
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Punchoff 🥊")

# --- Colors ---
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (220, 50, 50)
GREEN = (50, 220, 50)
BLUE = (50, 150, 255)
GRAY = (200, 200, 200)

# --- Fonts ---
font = pygame.font.SysFont("Arial", 30)

# --- Game State ---
player_health = 100
ai_health = 100
round_over = False
winner = ""

# --- Sprites (placeholder) ---
player_rect = pygame.Rect(150, HEIGHT - 300, 100, 200)
ai_rect = pygame.Rect(WIDTH - 250, HEIGHT - 300, 100, 200)

clock = pygame.time.Clock()

# --- Functions ---
def draw_health_bar(x, y, hp, label):
    pygame.draw.rect(screen, GRAY, (x, y, 200, 25))
    pygame.draw.rect(screen, RED, (x, y, max(0, 2 * hp), 25))
    text = font.render(f"{label}: {hp}", True, BLACK)
    screen.blit(text, (x, y - 30))

def draw_winner(text):
    msg = font.render(text, True, BLUE)
    screen.blit(msg, (WIDTH // 2 - msg.get_width() // 2, HEIGHT // 2 - 50))

# --- Main Loop ---
def main():
    global player_health, ai_health, round_over, winner

    while True:
        screen.fill(WHITE)

        # Events
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()

        # Draw Fighters
        pygame.draw.rect(screen, BLUE, player_rect)
        pygame.draw.rect(screen, RED, ai_rect)

        # Health Bars
        draw_health_bar(50, 30, player_health, "Player")
        draw_health_bar(WIDTH - 250, 30, ai_health, "AI")

        # Round Over
        if round_over:
            draw_winner(f"{winner} wins! Press R to restart")

        # Key Check (for testing damage)
        keys = pygame.key.get_pressed()
        if keys[pygame.K_a] and not round_over:
            ai_health -= 10
        if keys[pygame.K_l] and not round_over:
            player_health -= 10

        # Win Logic
        if player_health <= 0:
            winner = "AI"
            round_over = True
        elif ai_health <= 0:
            winner = "Player"
            round_over = True

        if round_over and keys[pygame.K_r]:
            player_health = 100
            ai_health = 100
            round_over = False
            winner = ""

        pygame.display.update()
        clock.tick(30)

if __name__ == "__main__":
    main()
