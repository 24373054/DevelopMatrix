#!/usr/bin/env python3
"""
Helper function to draw text with mixed fonts (Chinese + English/Numbers)
"""

from PIL import ImageFont

CHINESE_FONT = "/usr/share/fonts/truetype/droid/DroidSansFallbackFull.ttf"
ENGLISH_FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

def draw_text_mixed(draw, pos, text, size, color, align='left'):
    """
    Draw text using appropriate fonts for each character.
    Chinese characters use Chinese font, ASCII uses English font.
    
    Args:
        draw: PIL ImageDraw object
        pos: (x, y) tuple for text position
        text: Text string to draw
        size: Font size
        color: Text color (RGB tuple or RGBA tuple)
        align: 'left', 'center', or 'right'
    
    Returns:
        Final x position after drawing (useful for chaining)
    """
    try:
        font_cn = ImageFont.truetype(CHINESE_FONT, size)
        font_en = ImageFont.truetype(ENGLISH_FONT, size)
    except:
        font_cn = font_en = ImageFont.load_default()
    
    # Calculate total width for alignment
    if align != 'left':
        total_width = 0
        for char in text:
            current_font = font_en if ord(char) < 128 else font_cn
            bbox = draw.textbbox((0, 0), char, font=current_font)
            total_width += (bbox[2] - bbox[0]) + 1
    
    x, y = pos
    
    # Adjust starting position for alignment
    if align == 'center':
        x -= total_width // 2
    elif align == 'right':
        x -= total_width
    
    # Draw each character with appropriate font
    for char in text:
        current_font = font_en if ord(char) < 128 else font_cn
        draw.text((x, y), char, font=current_font, fill=color)
        bbox = draw.textbbox((x, y), char, font=current_font)
        x = bbox[2] + 1
    
    return x

def get_text_width(draw, text, size):
    """Calculate the width of text when rendered with mixed fonts"""
    try:
        font_cn = ImageFont.truetype(CHINESE_FONT, size)
        font_en = ImageFont.truetype(ENGLISH_FONT, size)
    except:
        font_cn = font_en = ImageFont.load_default()
    
    total_width = 0
    for char in text:
        current_font = font_en if ord(char) < 128 else font_cn
        bbox = draw.textbbox((0, 0), char, font=current_font)
        total_width += (bbox[2] - bbox[0]) + 1
    
    return total_width
