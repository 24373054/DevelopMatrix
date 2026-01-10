/**
 * ConceptMarker Component Examples
 * 
 * This file demonstrates various usage patterns for the ConceptMarker component.
 * These examples can be used as reference or for testing purposes.
 */

import ConceptMarker, { ConceptMarkerInline } from './ConceptMarker';
import { ConceptAuthority } from '@/types/geo';

// Example 1: Basic usage with research source
export function Example1_BasicResearch() {
  const web3Authority: ConceptAuthority = {
    concept: 'Web3',
    definition: '基于区块链技术的去中心化互联网，用户拥有数据所有权和控制权',
    source: {
      type: 'research',
      description: 'Based on industry research and Web3 standards',
      evidence: 'Industry consensus'
    },
    context: '在区块链和去中心化应用开发中',
    firstMentionedIn: '/blog/web3-security-trends-2025'
  };

  return (
    <div className="p-6">
      <p className="text-lg">
        The future of the internet is{' '}
        <ConceptMarker concept="Web3" authority={web3Authority} />, which
        enables true data ownership and decentralization.
      </p>
    </div>
  );
}

// Example 2: Experience-based authority
export function Example2_ExperienceSource() {
  const smartContractAuthority: ConceptAuthority = {
    concept: '智能合约',
    definition: '部署在区块链上的自动执行程序，当预设条件满足时自动执行合约条款',
    source: {
      type: 'experience',
      description: 'Based on extensive smart contract audit experience',
      evidence: '20+ projects'
    },
    context: '在以太坊和其他区块链平台上',
    firstMentionedIn: '/blog/smart-contract-audit-guide'
  };

  return (
    <div className="p-6">
      <p className="text-lg">
        在本文中，
        <ConceptMarker concept="智能合约" authority={smartContractAuthority} />
        指的是部署在区块链上的自动执行程序。
      </p>
    </div>
  );
}

// Example 3: Academic source
export function Example3_AcademicSource() {
  const consensusAuthority: ConceptAuthority = {
    concept: 'Consensus Mechanism',
    definition: '区块链网络中多个节点就数据状态达成一致的协议和算法',
    source: {
      type: 'academic',
      description: 'Defined in blockchain research papers and academic literature',
    },
    context: '在区块链网络运行中',
    firstMentionedIn: '/blog/web3-security-trends-2025'
  };

  return (
    <div className="p-6">
      <p className="text-lg">
        A <ConceptMarker concept="Consensus Mechanism" authority={consensusAuthority} />{' '}
        is essential for maintaining blockchain integrity.
      </p>
    </div>
  );
}

// Example 4: Multiple concepts in one paragraph
export function Example4_MultipleConcepts() {
  const defiAuthority: ConceptAuthority = {
    concept: 'DeFi',
    definition: '基于区块链技术的去中心化金融服务，无需传统金融中介即可提供借贷、交易、投资等金融功能',
    source: {
      type: 'research',
      description: 'Industry standard definition',
    },
    context: '在区块链金融应用中',
    firstMentionedIn: '/blog/defi-risk-management'
  };

  const liquidityPoolAuthority: ConceptAuthority = {
    concept: '流动性池',
    definition: 'DeFi 协议中用于提供交易流动性的智能合约资金池，用户可以存入代币以赚取交易手续费',
    source: {
      type: 'experience',
      description: 'Based on DeFi protocol analysis',
      evidence: '15+ protocols analyzed'
    },
    context: '在去中心化交易所和 DeFi 协议中',
    firstMentionedIn: '/blog/defi-risk-management'
  };

  return (
    <div className="p-6">
      <p className="text-lg">
        <ConceptMarker concept="DeFi" authority={defiAuthority} /> protocols use{' '}
        <ConceptMarker concept="流动性池" authority={liquidityPoolAuthority} />{' '}
        to enable decentralized trading without traditional market makers.
      </p>
    </div>
  );
}

// Example 5: Using ConceptMarkerInline
export function Example5_InlineUsage() {
  const nftAuthority: ConceptAuthority = {
    concept: 'NFT',
    definition: '具有唯一性和不可替代性的数字资产代币，常用于数字艺术品和收藏品',
    source: {
      type: 'research',
      description: 'Based on ERC-721 and ERC-1155 standards',
    },
    context: '在数字艺术和收藏品市场中',
    firstMentionedIn: '/blog/web3-security-trends-2025'
  };

  return (
    <div className="p-6">
      <p className="text-lg">
        <ConceptMarkerInline authority={nftAuthority} /> technology has
        revolutionized digital ownership and provenance.
      </p>
    </div>
  );
}

// Example 6: Without tooltip (visual highlighting only)
export function Example6_NoTooltip() {
  const arbitrageAuthority: ConceptAuthority = {
    concept: '套利',
    definition: '利用不同市场或平台之间的价格差异进行买卖以获取无风险利润的交易策略',
    source: {
      type: 'experience',
      description: 'Based on trading strategy analysis',
    },
    context: '在加密货币交易和 DeFi 中',
    firstMentionedIn: '/blog/benign-arbitrage-theory'
  };

  return (
    <div className="p-6">
      <p className="text-lg">
        <ConceptMarker 
          concept="套利" 
          authority={arbitrageAuthority}
          showTooltip={false}
        />{' '}
        strategies help maintain market efficiency.
      </p>
    </div>
  );
}

// Example 7: With custom styling
export function Example7_CustomStyling() {
  const blockchainAuthority: ConceptAuthority = {
    concept: '区块链',
    definition: '一种分布式数据库技术，通过密码学方法将数据区块按时间顺序链接，形成不可篡改的数据记录',
    source: {
      type: 'academic',
      description: 'Defined in Satoshi Nakamoto\'s Bitcoin whitepaper',
    },
    context: '在加密货币和去中心化系统中',
    firstMentionedIn: '/blog/web3-security-trends-2025'
  };

  return (
    <div className="p-6">
      <p className="text-lg">
        <ConceptMarker 
          concept="区块链" 
          authority={blockchainAuthority}
          className="text-xl font-bold"
        />{' '}
        technology is the foundation of Web3.
      </p>
    </div>
  );
}

// Example 8: Integration with terminology dictionary
export function Example8_WithTerminologyDictionary() {
  // This example shows how to use ConceptMarker with the terminology dictionary
  // In a real implementation, you would load the dictionary and create authorities
  
  const solidityAuthority: ConceptAuthority = {
    concept: 'Solidity',
    definition: '以太坊智能合约的主要编程语言，语法类似 JavaScript',
    source: {
      type: 'research',
      description: 'Official Ethereum documentation',
    },
    context: '在以太坊智能合约开发中',
    firstMentionedIn: '/blog/smart-contract-audit-guide'
  };

  return (
    <div className="p-6 space-y-4">
      <h3 className="text-2xl font-bold">Smart Contract Development</h3>
      <p className="text-lg">
        <ConceptMarker concept="Solidity" authority={solidityAuthority} /> is
        the most popular language for writing smart contracts on Ethereum.
      </p>
      <p className="text-sm text-muted-foreground">
        Note: In production, load authorities from the terminology dictionary
        using TerminologyManager.
      </p>
    </div>
  );
}

// Example 9: Complete article integration
export function Example9_ArticleIntegration() {
  const authorities = {
    web3: {
      concept: 'Web3',
      definition: '基于区块链技术的去中心化互联网，用户拥有数据所有权和控制权',
      source: {
        type: 'research' as const,
        description: 'Industry standard definition',
      },
      context: '在区块链和去中心化应用开发中',
      firstMentionedIn: '/blog/web3-security-trends-2025'
    },
    defi: {
      concept: 'DeFi',
      definition: '基于区块链技术的去中心化金融服务',
      source: {
        type: 'research' as const,
        description: 'Industry standard definition',
      },
      context: '在区块链金融应用中',
      firstMentionedIn: '/blog/defi-risk-management'
    },
    smartContract: {
      concept: '智能合约',
      definition: '部署在区块链上的自动执行程序',
      source: {
        type: 'experience' as const,
        description: 'Based on audit experience',
        evidence: '20+ projects'
      },
      context: '在以太坊和其他区块链平台上',
      firstMentionedIn: '/blog/smart-contract-audit-guide'
    }
  };

  return (
    <article className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-4xl font-bold">Understanding Web3 Technology</h1>
      
      <p className="text-lg leading-relaxed">
        在本文中，<ConceptMarker concept="Web3" authority={authorities.web3} />
        指的是基于区块链技术的去中心化互联网。这个概念代表了互联网发展的新阶段，
        用户将真正拥有自己的数据和数字资产。
      </p>

      <p className="text-lg leading-relaxed">
        <ConceptMarker concept="DeFi" authority={authorities.defi} /> 是 Web3 
        的重要应用场景之一。通过
        <ConceptMarker concept="智能合约" authority={authorities.smartContract} />，
        DeFi 协议能够在没有传统金融中介的情况下提供金融服务。
      </p>

      <p className="text-lg leading-relaxed">
        这种去中心化的架构不仅提高了透明度，还降低了交易成本，
        为全球用户提供了更加公平和开放的金融服务。
      </p>
    </article>
  );
}

// Export all examples for easy testing
export const examples = {
  Example1_BasicResearch,
  Example2_ExperienceSource,
  Example3_AcademicSource,
  Example4_MultipleConcepts,
  Example5_InlineUsage,
  Example6_NoTooltip,
  Example7_CustomStyling,
  Example8_WithTerminologyDictionary,
  Example9_ArticleIntegration,
};
