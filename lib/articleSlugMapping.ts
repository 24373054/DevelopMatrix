/**
 * Article slug mapping between Chinese and English versions
 * Used for language switching in Navigation
 */

export const articleSlugMapping: Record<string, { zh: string; en: string }> = {
  'web3-security-trends-2025': {
    zh: 'web3-security-trends-2025',
    en: 'web3-security-trends-2025'
  },
  'smart-contract-audit-guide': {
    zh: 'smart-contract-audit-guide',
    en: 'smart-contract-audit-guide'
  },
  'defi-risk-management': {
    zh: 'defi-risk-management',
    en: 'defi-risk-management'
  },
  'benign-arbitrage-theory': {
    zh: 'benign-arbitrage-theory',
    en: 'benign-arbitrage-theory'
  },
  // OTC article has different slugs in Chinese and English
  'otc的尽头是合规化-反洗钱正成为行业亟须': {
    zh: 'otc的尽头是合规化-反洗钱正成为行业亟须',
    en: 'otc-compliance-aml-imperative'
  },
  'otc-compliance-aml-imperative': {
    zh: 'otc的尽头是合规化-反洗钱正成为行业亟须',
    en: 'otc-compliance-aml-imperative'
  },
  'didai-agent的身份证': {
    zh: 'didai-agent的身份证',
    en: 'did-the-id-for-ai-agents'
  },
  'did-the-id-for-ai-agents': {
    zh: 'didai-agent的身份证',
    en: 'did-the-id-for-ai-agents'
  },
  '把dao打造成区块链的共产主义': {
    zh: '把dao打造成区块链的共产主义',
    en: 'dao-blockchain-s-communist-vision'
  },
  'dao-blockchain-s-communist-vision': {
    zh: '把dao打造成区块链的共产主义',
    en: 'dao-blockchain-s-communist-vision'
  },
  '隐私计算在区块链时代的真正意义与商业价值': {
    zh: '隐私计算在区块链时代的真正意义与商业价值',
    en: 'privacy-computing-s-role-in-blockchain-era'
  },
  'privacy-computing-s-role-in-blockchain-era': {
    zh: '隐私计算在区块链时代的真正意义与商业价值',
    en: 'privacy-computing-s-role-in-blockchain-era'
  },
};

/**
 * Get the corresponding slug in the target locale
 */
export function getMappedSlug(currentSlug: string, targetLocale: 'zh' | 'en'): string {
  const mapping = articleSlugMapping[currentSlug];
  if (mapping) {
    return mapping[targetLocale];
  }
  // If no mapping found, return the original slug
  return currentSlug;
}
