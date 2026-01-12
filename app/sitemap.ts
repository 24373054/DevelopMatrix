import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://develop.matrixlab.work';

  // 中文博客文章 slugs
  const zhBlogSlugs = [
    'web3-security-trends-2025',
    'smart-contract-audit-guide',
    'defi-risk-management',
    'benign-arbitrage-theory',
    'otc的尽头是合规化-反洗钱正成为行业亟须',
    'didai-agent的身份证',
    '把dao打造成区块链的共产主义',
    '隐私计算在区块链时代的真正意义与商业价值',
    '全球web3监管趋势与企业上链合规指南',
    '你的私钥没丢资产却没了深挖智能合约授权的隐形陷阱',
    'rwa-爆发前夜为什么链上合规是机构入场的唯一门票',
    'usdt真的安全吗揭秘稳定币崩盘前的72小时信号',
    '不仅是炒作深扒ai介入链上交易的底层逻辑这3个变化正在发生',
    '你的冷钱包可能并不冷揭秘硬件钱包背后的供应链攻击',
    'tornado-cash被制裁后链上黑钱现在都流向了哪里',
    '巨鲸的假动作链上数据是如何欺骗你的',
    '当ai-agent掌握私钥谁来为它的错误交易负责',
  ];

  // 英文博客文章 slugs
  const enBlogSlugs = [
    'web3-security-trends-2025',
    'smart-contract-audit-guide',
    'defi-risk-management',
    'benign-arbitrage-theory',
    'otc-compliance-aml-imperative',
    'did-the-id-for-ai-agents',
    'dao-blockchain-s-communist-vision',
    'privacy-computing-s-role-in-blockchain-era',
    'global-web3-regulatory-trends-compliance-guide',
    'smart-contract-authorization-hidden-asset-risks',
    'rwa-s-dawn-why-on-chain-compliance-is-key-for-inst',
    'is-usdt-safe-72-hour-crash-warning-signs',
    'beyond-hype-3-key-shifts-in-ai-powered-on-chain-tr',
    'hardware-wallet-supply-chain-attacks-exposed',
    'where-on-chain-black-money-flows-post-tornado-cash',
    'how-on-chain-data-can-deceive-you',
    'ai-agent-private-keys-who-bears-fault-for-errors',
  ];

  // 静态页面路由
  const staticRoutes = [
    { path: '', priority: 1.0, changeFreq: 'daily' as const },
    { path: '/contact', priority: 0.8, changeFreq: 'monthly' as const },
    { path: '/privacy', priority: 0.5, changeFreq: 'yearly' as const },
    { path: '/terms', priority: 0.5, changeFreq: 'yearly' as const },
    { path: '/developers', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/developer', priority: 0.7, changeFreq: 'monthly' as const },
    { path: '/blog', priority: 0.9, changeFreq: 'daily' as const },
    { path: '/products/exchange', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/products/trace', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/products/agent', priority: 0.95, changeFreq: 'weekly' as const },
    { path: '/products/game', priority: 0.9, changeFreq: 'weekly' as const },
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // 生成静态页面条目（中英文）
  for (const lang of ['zh', 'en']) {
    for (const route of staticRoutes) {
      sitemapEntries.push({
        url: `${baseUrl}/${lang}${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.changeFreq,
        priority: route.priority,
      });
    }
  }

  // 生成中文博客文章条目
  for (const slug of zhBlogSlugs) {
    sitemapEntries.push({
      url: `${baseUrl}/zh/blog/${encodeURIComponent(slug)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  }

  // 生成英文博客文章条目
  for (const slug of enBlogSlugs) {
    sitemapEntries.push({
      url: `${baseUrl}/en/blog/${encodeURIComponent(slug)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  }

  return sitemapEntries;
}
