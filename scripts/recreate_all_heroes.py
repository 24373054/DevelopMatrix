#!/usr/bin/env python3
"""
Recreate all blog hero images with proper mixed font support.
"""

from PIL import Image, ImageDraw, ImageFilter
import math
import sys
sys.path.insert(0, '/home/ubuntu/yz/Web3/刻熵科技官网/scripts')
from draw_text_mixed_fonts import draw_text_mixed

# Canvas setup
WIDTH = 1920
HEIGHT = 1080
MARGIN = 120

# Common colors
BG_DARK = (15, 23, 42)
WHITE_SOFT = (248, 250, 252)
GRAY_MID = (148, 163, 184)

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

# 1. Web3 Security Trends 2025
print("Creating web3-security-trends-2025-hero.png...")
img = Image.new('RGB', (WIDTH, HEIGHT), (12, 17, 35))
draw = ImageDraw.Draw(img, 'RGBA')

RED_ALERT = (239, 68, 68)
ORANGE_WARN = (249, 115, 22)
BLUE_SECURE = (59, 130, 246)
CYAN_TECH = (34, 211, 238)

for x, y, r, c1, c2, a in [
    (WIDTH * 0.2, HEIGHT * 0.25, 350, RED_ALERT, ORANGE_WARN, 30),
    (WIDTH * 0.8, HEIGHT * 0.75, 400, BLUE_SECURE, CYAN_TECH, 35),
    (WIDTH * 0.5, HEIGHT * 0.5, 300, CYAN_TECH, BLUE_SECURE, 20),
]:
    draw_gradient_circle(draw, (int(x), int(y)), int(r), c1, c2, a)

center_x, center_y = WIDTH // 2, HEIGHT // 2 + 50
shield_width = 280
shield_height = 320

shield_points = [
    (center_x, center_y - shield_height // 2),
    (center_x + shield_width // 2, center_y - shield_height // 4),
    (center_x + shield_width // 2, center_y + shield_height // 4),
    (center_x, center_y + shield_height // 2),
    (center_x - shield_width // 2, center_y + shield_height // 4),
    (center_x - shield_width // 2, center_y - shield_height // 4),
]

for offset in range(30, 0, -2):
    alpha = int(40 * (1 - offset / 30))
    expanded_points = [
        (x + (x - center_x) * offset / shield_width, 
         y + (y - center_y) * offset / shield_height)
        for x, y in shield_points
    ]
    draw.polygon(expanded_points, fill=BLUE_SECURE + (alpha,))

draw.polygon(shield_points, fill=(30, 58, 138, 100), outline=BLUE_SECURE + (200,), width=4)

num_nodes = 8
node_radius = 200
for i in range(num_nodes):
    angle = (i / num_nodes) * 2 * math.pi
    x = center_x + node_radius * math.cos(angle)
    y = center_y + node_radius * math.sin(angle)
    
    draw.line([x, y, center_x, center_y], fill=CYAN_TECH + (60,), width=2)
    
    for r in range(20, 0, -2):
        alpha = int(80 * (1 - r / 20))
        draw.ellipse([x - r, y - r, x + r, y + r], fill=CYAN_TECH + (alpha,))
    draw.ellipse([x - 8, y - 8, x + 8, y + 8], fill=CYAN_TECH, outline=WHITE_SOFT, width=2)

corner_size = 120
draw.line([MARGIN, MARGIN, MARGIN + corner_size, MARGIN], fill=RED_ALERT + (100,), width=2)
draw.line([MARGIN, MARGIN, MARGIN, MARGIN + corner_size], fill=RED_ALERT + (100,), width=2)
draw.line([WIDTH - MARGIN, HEIGHT - MARGIN, WIDTH - MARGIN - corner_size, HEIGHT - MARGIN], 
          fill=BLUE_SECURE + (100,), width=2)
draw.line([WIDTH - MARGIN, HEIGHT - MARGIN, WIDTH - MARGIN, HEIGHT - MARGIN - corner_size], 
          fill=BLUE_SECURE + (100,), width=2)

img = img.filter(ImageFilter.GaussianBlur(radius=0.5))
draw = ImageDraw.Draw(img, 'RGBA')

title_y = HEIGHT * 0.12
draw_text_mixed(draw, (WIDTH // 2, title_y + 2), "2025年Web3安全趋势展望", 68, (0, 0, 0, 120), align='center')
draw_text_mixed(draw, (WIDTH // 2, title_y), "2025年Web3安全趋势展望", 68, WHITE_SOFT, align='center')
draw_text_mixed(draw, (WIDTH // 2, title_y + 85), "Web3 Security Trends 2025", 30, CYAN_TECH + (200,), align='center')
draw_text_mixed(draw, (WIDTH // 2, HEIGHT - MARGIN - 40), "新兴威胁与防护策略", 22, GRAY_MID + (180,), align='center')

img.save('/home/ubuntu/yz/Web3/刻熵科技官网/public/blog-images/web3-security-trends-2025-hero.png', 'PNG', quality=95)
print("✓ Created: web3-security-trends-2025-hero.png")

# 2. Smart Contract Audit Guide
print("Creating smart-contract-audit-guide-hero.png...")
img = Image.new('RGB', (WIDTH, HEIGHT), (17, 24, 39))
draw = ImageDraw.Draw(img, 'RGBA')

GREEN_SUCCESS = (34, 197, 94)
EMERALD_CODE = (16, 185, 129)
AMBER_CAUTION = (245, 158, 11)
PURPLE_LOGIC = (168, 85, 247)

for i in range(15):
    y = MARGIN + i * 60
    line_length = 200 + (i % 3) * 150
    x_start = MARGIN + (i % 2) * 100
    draw.rectangle([x_start, y, x_start + line_length, y + 3], 
                  fill=GREEN_SUCCESS + (20 + i * 2,))

for i in range(15):
    y = MARGIN + i * 60
    line_length = 180 + (i % 4) * 120
    x_start = WIDTH - MARGIN - line_length - (i % 2) * 80
    draw.rectangle([x_start, y, x_start + line_length, y + 3], 
                  fill=PURPLE_LOGIC + (20 + i * 2,))

center_x, center_y = WIDTH // 2, HEIGHT // 2 + 30
checklist_items = 6
item_height = 50
item_width = 500

for i in range(checklist_items):
    y = center_y - (checklist_items * item_height) // 2 + i * item_height
    
    box_size = 28
    box_x = center_x - item_width // 2
    draw.rectangle([box_x, y, box_x + box_size, y + box_size], 
                  outline=GREEN_SUCCESS + (150,), width=2)
    
    if i < 4:
        draw.line([box_x + 6, y + 14, box_x + 12, y + 20], 
                 fill=GREEN_SUCCESS, width=3)
        draw.line([box_x + 12, y + 20, box_x + 22, y + 8], 
                 fill=GREEN_SUCCESS, width=3)
    
    line_x = box_x + box_size + 20
    line_width = item_width - box_size - 30
    alpha = 120 if i < 4 else 60
    draw.rectangle([line_x, y + 10, line_x + line_width, y + 18], 
                  fill=EMERALD_CODE + (alpha,))

for x, y, r, color in [
    (WIDTH * 0.15, HEIGHT * 0.25, 200, GREEN_SUCCESS),
    (WIDTH * 0.85, HEIGHT * 0.75, 180, AMBER_CAUTION),
    (WIDTH * 0.5, HEIGHT * 0.85, 150, PURPLE_LOGIC),
]:
    draw_gradient_circle(draw, (int(x), int(y)), int(r), color, color, 30)

img = img.filter(ImageFilter.GaussianBlur(radius=0.5))
draw = ImageDraw.Draw(img, 'RGBA')

title_y = HEIGHT * 0.12
draw_text_mixed(draw, (WIDTH // 2, title_y + 2), "智能合约审计完全指南", 68, (0, 0, 0, 120), align='center')
draw_text_mixed(draw, (WIDTH // 2, title_y), "智能合约审计完全指南", 68, WHITE_SOFT, align='center')
draw_text_mixed(draw, (WIDTH // 2, title_y + 85), "Complete Guide to Smart Contract Auditing", 30, GREEN_SUCCESS + (200,), align='center')
draw_text_mixed(draw, (WIDTH // 2, HEIGHT - MARGIN - 40), "从入门到精通的审计方法论", 22, GRAY_MID + (180,), align='center')

img.save('/home/ubuntu/yz/Web3/刻熵科技官网/public/blog-images/smart-contract-audit-guide-hero.png', 'PNG', quality=95)
print("✓ Created: smart-contract-audit-guide-hero.png")

# 3. DeFi Risk Management
print("Creating defi-risk-management-hero.png...")
img = Image.new('RGB', (WIDTH, HEIGHT), (20, 20, 31))
draw = ImageDraw.Draw(img, 'RGBA')

RED_DANGER = (239, 68, 68)
ORANGE_RISK = (249, 115, 22)
BLUE_SAFE = (59, 130, 246)
CYAN_STABLE = (6, 182, 212)
YELLOW_WARN = (234, 179, 8)

for x, y, r, c1, c2, a in [
    (WIDTH * 0.25, HEIGHT * 0.3, 380, RED_DANGER, ORANGE_RISK, 35),
    (WIDTH * 0.75, HEIGHT * 0.7, 350, BLUE_SAFE, CYAN_STABLE, 40),
    (WIDTH * 0.5, HEIGHT * 0.5, 280, YELLOW_WARN, ORANGE_RISK, 25),
]:
    draw_gradient_circle(draw, (int(x), int(y)), int(r), c1, c2, a)

center_x, center_y = WIDTH // 2, HEIGHT // 2 + 40

beam_width = 400
beam_height = 8
draw.rectangle([center_x - beam_width // 2, center_y - beam_height // 2,
               center_x + beam_width // 2, center_y + beam_height // 2],
              fill=CYAN_STABLE, outline=WHITE_SOFT, width=2)

pivot_size = 30
draw.polygon([
    (center_x, center_y + 40),
    (center_x - pivot_size, center_y),
    (center_x + pivot_size, center_y)
], fill=BLUE_SAFE, outline=WHITE_SOFT, width=2)

left_x = center_x - beam_width // 2 + 50
left_y = center_y + 80
pan_width = 120
pan_height = 15

draw.line([left_x, center_y, left_x, left_y - 30], fill=RED_DANGER + (150,), width=3)
draw.ellipse([left_x - pan_width // 2, left_y - pan_height,
             left_x + pan_width // 2, left_y + pan_height],
            fill=(60, 20, 20, 100), outline=RED_DANGER, width=3)

for r in range(40, 0, -3):
    alpha = int(60 * (1 - r / 40))
    draw.ellipse([left_x - r, left_y - r, left_x + r, left_y + r], 
                fill=RED_DANGER + (alpha,))

right_x = center_x + beam_width // 2 - 50
right_y = center_y - 20

draw.line([right_x, center_y, right_x, right_y - 30], fill=BLUE_SAFE + (150,), width=3)
draw.ellipse([right_x - pan_width // 2, right_y - pan_height,
             right_x + pan_width // 2, right_y + pan_height],
            fill=(20, 40, 80, 100), outline=BLUE_SAFE, width=3)

for r in range(35, 0, -3):
    alpha = int(60 * (1 - r / 35))
    draw.ellipse([right_x - r, right_y - r, right_x + r, right_y + r], 
                fill=BLUE_SAFE + (alpha,))

triangle_size = 40
for x, y, color in [
    (MARGIN + 60, MARGIN + 60, YELLOW_WARN),
    (WIDTH - MARGIN - 60, MARGIN + 60, ORANGE_RISK),
]:
    draw.polygon([
        (x, y - triangle_size),
        (x - triangle_size, y + triangle_size // 2),
        (x + triangle_size, y + triangle_size // 2)
    ], outline=color + (150,), width=3)
    draw_text_mixed(draw, (x, y - 15), "!", 32, color, align='center')

img = img.filter(ImageFilter.GaussianBlur(radius=0.5))
draw = ImageDraw.Draw(img, 'RGBA')

title_y = HEIGHT * 0.12
draw_text_mixed(draw, (WIDTH // 2, title_y + 2), "DeFi风险管理最佳实践", 68, (0, 0, 0, 120), align='center')
draw_text_mixed(draw, (WIDTH // 2, title_y), "DeFi风险管理最佳实践", 68, WHITE_SOFT, align='center')
draw_text_mixed(draw, (WIDTH // 2, title_y + 85), "DeFi Risk Management Best Practices", 30, CYAN_STABLE + (200,), align='center')
draw_text_mixed(draw, (WIDTH // 2, HEIGHT - MARGIN - 40), "识别风险，保护资产", 22, GRAY_MID + (180,), align='center')

img.save('/home/ubuntu/yz/Web3/刻熵科技官网/public/blog-images/defi-risk-management-hero.png', 'PNG', quality=95)
print("✓ Created: defi-risk-management-hero.png")

print("\n✓ All hero images recreated successfully with proper font support!")
