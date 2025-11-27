# 刻熵科技官网 (Ke Entropy Technology Website)

A modern, responsive corporate website built with Next.js 14, featuring dark/light mode and bilingual support (Chinese/English).

## Features

- 🌓 **Dark/Light Mode**: System-aware theme with manual toggle
- 🌍 **Bilingual Support**: Chinese and English with easy switching
- 📱 **Responsive Design**: Modern, clean design that works on all devices
- 🎨 **Glassmorphism UI**: Low contrast, fusion-style components with transparency
- ⚡ **Performance**: Built with Next.js 14 for optimal performance
- 🔒 **SSL Ready**: Nginx configuration with Let's Encrypt support

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **i18n**: next-intl
- **Theme**: next-themes

## Quick Start

### Development

```bash
npm run dev
```

Visit http://localhost:3108

### Production

```bash
# Build
npm run build

# Start
./start-all.sh

# Stop
./stop-all.sh
```

## SSL Setup

To enable HTTPS with Let's Encrypt:

```bash
sudo ./setup-ssl.sh
```

This will:
1. Install certbot if needed
2. Obtain SSL certificate for develop.matrixlab.work
3. Configure nginx
4. Setup auto-renewal

## Project Structure

```
├── app/
│   ├── [locale]/          # Localized routes
│   │   ├── layout.tsx     # Root layout with theme provider
│   │   └── page.tsx       # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Navigation.tsx     # Header with theme/language toggle
│   ├── Hero.tsx          # Hero section
│   ├── About.tsx         # About section
│   ├── Business.tsx      # Business areas
│   ├── Team.tsx          # Team members
│   ├── Announcements.tsx # Company announcements
│   ├── Links.tsx         # Related links
│   └── Footer.tsx        # Footer with beian info
├── messages/             # i18n translations
│   ├── zh.json          # Chinese
│   └── en.json          # English
├── public/              # Static assets
├── nginx.conf           # Nginx configuration
├── start-all.sh         # Start script
└── stop-all.sh          # Stop script
```

## Port Configuration

- **Application**: Port 3108
- **HTTP**: Port 80 (redirects to HTTPS)
- **HTTPS**: Port 443

## Links

- **实验室官网**: https://matrixlab.work/
- **旗下平台**: https://exchange.matrixlab.work/
- **旗下游戏**: https://immortal.matrixlab.work/
- **游戏社区**: https://open.matrixlab.work/
- **游戏开源**: https://github.com/24373054/Web3-games
- **创始人简历**: https://24373054.github.io/

## License

© 2024 刻熵科技 版权所有
