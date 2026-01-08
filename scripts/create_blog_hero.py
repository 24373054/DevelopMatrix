#!/usr/bin/env python3
"""
Create a sophisticated hero image for the Benign Arbitrage Theory article.
Following the Equilibrium Dynamics design philosophy.
"""

from PIL import Image, ImageDraw, ImageFilter
import math
import sys
sys.path.insert(0, '/home/ubuntu/yz/Web3/刻熵科技官网/scripts')
from draw_text_mixed_fonts import draw_text_mixed, get_text_width

# Canvas setup - 16:9 aspect ratio for hero image
WIDTH = 1920
HEIGHT = 1080
MARGIN = 120

# Color palette - equilibrium dynamics
BG_COLOR = (15, 23, 42)  # Deep blue-gray
CYAN_PRIMARY = (34, 211, 238)  # Bright cyan
CYAN_SECONDARY = (56, 189, 248)  # Medium cyan
BLUE_DEEP = (30, 58, 138)  # Deep blue
AMBER_WARM = (251, 191, 36)  # Warm amber
GOLD_ACCENT = (245, 158, 11)  # Gold
WHITE_SOFT = (248, 250, 252)  # Soft white
GRAY_MID = (148, 163, 184)  # Mid gray

# Create canvas
img = Image.new('RGB', (WIDTH, HEIGHT), BG_COLOR)
draw = ImageDraw.Draw(img, 'RGBA')

# Helper function for smooth gradients
def draw_gradient_circle(draw, center, radius, color_start, color_end, alpha=80):
    """Draw a radial gradient circle"""
    for r in range(radius, 0, -2):
        progress = 1 - (r / radius)
        current_alpha = int(alpha * (1 - progress))
        current_color = tuple([
            int(color_start[i] + (color_end[i] - color_start[i]) * progress)
            for i in range(3)
        ]) + (current_alpha,)
        draw.ellipse(
            [center[0] - r, center[1] - r, center[0] + r, center[1] + r],
            fill=current_color
        )

# Background: Subtle gradient orbs suggesting energy fields
draw_gradient_circle(draw, (WIDTH * 0.25, HEIGHT * 0.3), 400, CYAN_PRIMARY, BLUE_DEEP, 40)
draw_gradient_circle(draw, (WIDTH * 0.75, HEIGHT * 0.7), 350, AMBER_WARM, GOLD_ACCENT, 35)
draw_gradient_circle(draw, (WIDTH * 0.5, HEIGHT * 0.5), 300, CYAN_SECONDARY, BLUE_DEEP, 25)

# Central composition: Circular flow diagram suggesting arbitrage cycles
center_x, center_y = WIDTH // 2, HEIGHT // 2
main_radius = 280

# Draw orbital rings - representing market cycles
for i, (radius, color, width) in enumerate([
    (main_radius, CYAN_PRIMARY, 3),
    (main_radius - 60, CYAN_SECONDARY, 2),
    (main_radius - 120, BLUE_DEEP, 2),
]):
    draw.ellipse(
        [center_x - radius, center_y - radius, center_x + radius, center_y + radius],
        outline=color + (120,), width=width
    )

# Draw connecting nodes - equilibrium points
num_nodes = 6
node_radius = 12
for i in range(num_nodes):
    angle = (i / num_nodes) * 2 * math.pi - math.pi / 2
    x = center_x + main_radius * math.cos(angle)
    y = center_y + main_radius * math.sin(angle)
    
    # Node glow
    for glow_r in range(25, 0, -3):
        glow_alpha = int(60 * (1 - glow_r / 25))
        draw.ellipse(
            [x - glow_r, y - glow_r, x + glow_r, y + glow_r],
            fill=CYAN_PRIMARY + (glow_alpha,)
        )
    
    # Node core
    draw.ellipse(
        [x - node_radius, y - node_radius, x + node_radius, y + node_radius],
        fill=CYAN_PRIMARY, outline=WHITE_SOFT, width=2
    )

# Draw flow arrows between nodes
arrow_offset = 40
for i in range(num_nodes):
    angle1 = (i / num_nodes) * 2 * math.pi - math.pi / 2
    angle2 = ((i + 1) / num_nodes) * 2 * math.pi - math.pi / 2
    
    x1 = center_x + (main_radius - arrow_offset) * math.cos(angle1)
    y1 = center_y + (main_radius - arrow_offset) * math.sin(angle1)
    x2 = center_x + (main_radius - arrow_offset) * math.cos(angle2)
    y2 = center_y + (main_radius - arrow_offset) * math.sin(angle2)
    
    # Curved arrow path
    mid_angle = (angle1 + angle2) / 2
    curve_offset = 20
    mx = center_x + (main_radius - arrow_offset - curve_offset) * math.cos(mid_angle)
    my = center_y + (main_radius - arrow_offset - curve_offset) * math.sin(mid_angle)
    
    # Draw curved line
    draw.line([x1, y1, mx, my], fill=AMBER_WARM + (100,), width=2)
    draw.line([mx, my, x2, y2], fill=AMBER_WARM + (100,), width=2)
    
    # Arrow head
    arrow_size = 8
    arrow_angle = math.atan2(y2 - my, x2 - mx)
    arrow_points = [
        (x2, y2),
        (x2 - arrow_size * math.cos(arrow_angle - 0.5), 
         y2 - arrow_size * math.sin(arrow_angle - 0.5)),
        (x2 - arrow_size * math.cos(arrow_angle + 0.5), 
         y2 - arrow_size * math.sin(arrow_angle + 0.5))
    ]
    draw.polygon(arrow_points, fill=AMBER_WARM + (150,))

# Central core - the equilibrium point
core_radius = 45
for glow_r in range(80, 0, -4):
    glow_alpha = int(40 * (1 - glow_r / 80))
    draw.ellipse(
        [center_x - glow_r, center_y - glow_r, center_x + glow_r, center_y + glow_r],
        fill=GOLD_ACCENT + (glow_alpha,)
    )

draw.ellipse(
    [center_x - core_radius, center_y - core_radius, 
     center_x + core_radius, center_y + core_radius],
    fill=GOLD_ACCENT, outline=WHITE_SOFT, width=3
)

# Decorative geometric elements - suggesting mathematical precision
# Top left corner
corner_size = 150
draw.line([MARGIN, MARGIN, MARGIN + corner_size, MARGIN], 
          fill=CYAN_PRIMARY + (80,), width=2)
draw.line([MARGIN, MARGIN, MARGIN, MARGIN + corner_size], 
          fill=CYAN_PRIMARY + (80,), width=2)

# Bottom right corner
draw.line([WIDTH - MARGIN, HEIGHT - MARGIN, WIDTH - MARGIN - corner_size, HEIGHT - MARGIN], 
          fill=AMBER_WARM + (80,), width=2)
draw.line([WIDTH - MARGIN, HEIGHT - MARGIN, WIDTH - MARGIN, HEIGHT - MARGIN - corner_size], 
          fill=AMBER_WARM + (80,), width=2)

# Apply subtle blur for depth
img = img.filter(ImageFilter.GaussianBlur(radius=0.5))

# Add text overlay
draw = ImageDraw.Draw(img, 'RGBA')

# Title - positioned in upper third
title_text = "良性套利论"
title_y = HEIGHT * 0.15
draw_text_mixed(draw, (WIDTH // 2, title_y + 3), title_text, 72, (0, 0, 0, 120), align='center')
draw_text_mixed(draw, (WIDTH // 2, title_y), title_text, 72, WHITE_SOFT, align='center')

# Subtitle
subtitle_text = "Benign Arbitrage Theory"
subtitle_y = title_y + 90
draw_text_mixed(draw, (WIDTH // 2, subtitle_y), subtitle_text, 32, CYAN_PRIMARY + (200,), align='center')

# Bottom label - sparse annotation
label_text = "当\"贪婪\"成为去中心化世界的稳定器"
label_y = HEIGHT - MARGIN - 40
draw_text_mixed(draw, (WIDTH // 2, label_y), label_text, 20, GRAY_MID + (180,), align='center')

# Save the masterpiece
img.save('/home/ubuntu/yz/Web3/刻熵科技官网/public/blog-images/benign-arbitrage-theory-hero.png', 'PNG', quality=95)
print("✓ Hero image created: public/blog-images/benign-arbitrage-theory-hero.png")
