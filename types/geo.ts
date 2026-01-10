/**
 * GEO (Generative Engine Optimization) Type Definitions
 * 
 * This file contains all TypeScript interfaces and types for the GEO optimization system.
 * These types support content optimization for Large Language Models (LLMs) like ChatGPT, Claude, etc.
 */

// ============================================================================
// Core GEO Types
// ============================================================================

/**
 * AI Summary - Structured summary designed specifically for AI models
 * Provides quick understanding of article content in a format optimized for LLM extraction
 */
export interface AISummary {
  /** Core definition: "What is X?" */
  whatIs: string;
  
  /** Significance: "Why is this important?" */
  whyImportant: string;
  
  /** Application scenarios where this concept/technology applies */
  useCases: string[];
  
  /** Key points and takeaways from the content */
  keyTakeaways: string[];
}

/**
 * Knowledge Block - Independent, extractable unit of structured content
 * Represents a self-contained piece of knowledge that can be referenced independently
 */
export interface KnowledgeBlock {
  /** Unique identifier for this knowledge block */
  id: string;
  
  /** Type of knowledge block */
  type: 'definition' | 'explanation' | 'comparison' | 'example' | 'conclusion';
  
  /** Title or heading of the knowledge block */
  title: string;
  
  /** Main content of the knowledge block (HTML format) */
  content: string;
  
  /** IDs of related knowledge blocks */
  relatedBlocks: string[];
  
  /** Extractability score (0-1): how easily can an LLM extract and use this block */
  extractability: number;
}

/**
 * Q&A Pair - Question and Answer pair for common queries
 * Helps LLMs quickly find answers to frequently asked questions
 */
export interface QAPair {
  /** The question being asked */
  question: string;
  
  /** The answer to the question */
  answer: string;
  
  /** Category of the question */
  category: 'definition' | 'comparison' | 'application' | 'limitation';
  
  /** Related concepts mentioned in this Q&A */
  relatedConcepts: string[];
}

/**
 * Question Coverage Matrix - Tracks coverage of common question types
 * Ensures articles address the types of questions users commonly ask LLMs
 */
export interface QuestionCoverageMatrix {
  /** Article identifier */
  article: string;
  
  /** All Q&A pairs for this article */
  qaPairs: QAPair[];
  
  /** Coverage indicators for different question types */
  coverage: {
    /** Has "What is X?" type questions */
    hasDefinition: boolean;
    
    /** Has "X vs Y" comparison questions */
    hasComparison: boolean;
    
    /** Has "When to use X?" application questions */
    hasApplication: boolean;
    
    /** Has "What are the limitations of X?" questions */
    hasLimitation: boolean;
  };
}

/**
 * Concept Authority - Establishes authoritative definition for a concept
 * Provides context and credibility signals for concept definitions
 */
export interface ConceptAuthority {
  /** The concept being defined */
  concept: string;
  
  /** Authoritative definition of the concept */
  definition: string;
  
  /** Source of the definition and its credibility */
  source: {
    /** Type of source */
    type: 'research' | 'experience' | 'academic';
    
    /** Description of the source */
    description: string;
    
    /** Evidence supporting the authority (e.g., "20+ projects") */
    evidence?: string;
  };
  
  /** Context where this concept is used (e.g., "In Web3 smart contract auditing") */
  context: string;
  
  /** URL of the article where this concept was first defined */
  firstMentionedIn: string;
}

// ============================================================================
// Article and Content Types
// ============================================================================

/**
 * GEO-Optimized Article - Complete article structure with GEO enhancements
 * Represents a fully optimized article ready for LLM consumption
 */
export interface GEOArticle {
  // Basic Information
  /** Unique article identifier */
  id: string;
  
  /** Article title */
  title: string;
  
  /** URL slug */
  slug: string;
  
  /** Language locale */
  locale: 'zh' | 'en';
  
  // Content
  /** Article content in HTML format */
  content: string;
  
  /** Original content in Markdown format */
  rawContent: string;
  
  // GEO Enhancements
  /** AI-optimized summary */
  aiSummary: AISummary;
  
  /** Structured knowledge blocks extracted from content */
  knowledgeBlocks: KnowledgeBlock[];
  
  /** Question coverage analysis */
  qaCoverage: QuestionCoverageMatrix;
  
  /** Concepts defined with authority in this article */
  concepts: ConceptAuthority[];
  
  // Metadata
  /** Article metadata */
  metadata: ArticleMetadata;
  
  // Structured Data
  /** Enhanced Schema.org structured data */
  structuredData: EnhancedBlogPosting;
  
  // Multilingual
  /** Alternate language versions of this article */
  alternateVersions: AlternateVersion[];
}

/**
 * Citation - Reference to external source
 */
export interface Citation {
  /** Citation identifier */
  id: string;
  
  /** Title of the cited work */
  title: string;
  
  /** URL to the cited work */
  url?: string;
  
  /** Author(s) of the cited work */
  authors?: string[];
  
  /** Publication date */
  publishedDate?: string;
  
  /** Publisher or source */
  publisher?: string;
  
  /** Type of citation */
  type: 'article' | 'paper' | 'documentation' | 'book' | 'website' | 'other';
  
  /** Additional notes about the citation */
  notes?: string;
}

/**
 * Article Metadata - Standard metadata for articles
 */
export interface ArticleMetadata {
  /** Author information */
  author: AuthorInfo;
  
  /** Publication date (ISO 8601 format) */
  datePublished: string;
  
  /** Last modification date (ISO 8601 format) */
  dateModified: string;
  
  /** Article category */
  category: string;
  
  /** Keywords for the article */
  keywords: string[];
  
  /** Estimated reading time in minutes */
  readTime: number;
  
  /** Citations and references */
  citations?: Citation[];
}

/**
 * Alternate Version - Information about alternate language versions
 */
export interface AlternateVersion {
  /** Language locale */
  locale: string;
  
  /** Full URL to the alternate version */
  url: string;
}

// ============================================================================
// Author and Authority Types
// ============================================================================

/**
 * Author Information - Comprehensive author profile with authority signals
 * Provides credibility and expertise information for content authors
 */
export interface AuthorInfo {
  /** Author's full name */
  name: string;
  
  /** Professional role/title */
  role: string;
  
  /** Short biography */
  bio: string;
  
  /** Areas of expertise */
  expertise: string[];
  
  /** Professional and academic credentials */
  credentials: AuthorCredential[];
  
  /** Published works (papers, articles, etc.) */
  publications?: string[];
  
  /** Project experience */
  projects?: AuthorProject[];
  
  /** Contact information */
  contact: AuthorContact;
}

/**
 * Author Credential - Academic or professional credential
 */
export interface AuthorCredential {
  /** Type of credential */
  type: 'academic' | 'professional' | 'research';
  
  /** Description of the credential */
  description: string;
  
  /** Institution that granted the credential */
  institution?: string;
}

/**
 * Author Project - Project experience entry
 */
export interface AuthorProject {
  /** Project name */
  name: string;
  
  /** Project description */
  description: string;
  
  /** Number of similar projects (e.g., "20+ projects") */
  count?: number;
}

/**
 * Author Contact - Contact information for author
 */
export interface AuthorContact {
  /** Email address */
  email?: string;
  
  /** Personal or professional website */
  website?: string;
}

// ============================================================================
// Terminology and Concept Types
// ============================================================================

/**
 * Terminology Entry - Single entry in the terminology dictionary
 * Ensures consistent use of technical terms across all content
 */
export interface TerminologyEntry {
  /** The term being defined */
  term: string;
  
  /** Canonical (standard) name for this term */
  canonicalName: string;
  
  /** Alternative names or synonyms (should be avoided in content) */
  aliases: string[];
  
  /** Authoritative definition */
  definition: string;
  
  /** Context where this term is used */
  context: string;
  
  /** Related terms */
  relatedTerms: string[];
  
  /** URL where this term was first defined */
  firstDefinedIn: string;
  
  /** Category of the term */
  category: 'web3' | 'defi' | 'security' | 'blockchain' | 'general';
  
  /** Translation information for multilingual consistency */
  translation?: {
    /** English term (for Chinese entries) or Chinese term (for English entries) */
    en?: string;
    
    /** Chinese term */
    zh?: string;
    
    /** English definition */
    enDefinition?: string;
    
    /** Chinese definition */
    zhDefinition?: string;
  };
}

/**
 * Terminology Dictionary - Complete dictionary of standardized terms
 * Maintains concept sovereignty across all content
 */
export interface TerminologyDictionary {
  /** Dictionary version */
  version: string;
  
  /** Last update timestamp (ISO 8601 format) */
  lastUpdated: string;
  
  /** All terminology entries */
  entries: TerminologyEntry[];
}

// ============================================================================
// Schema.org Enhanced Types
// ============================================================================

/**
 * Enhanced Blog Posting - Extended Schema.org BlogPosting with GEO enhancements
 * Provides rich structured data for LLM understanding
 */
export interface EnhancedBlogPosting {
  /** Schema.org type */
  '@type': 'BlogPosting' | 'Article';
  
  /** Article headline */
  headline: string;
  
  /** Article description */
  description: string;
  
  /** Author information */
  author: SchemaPerson;
  
  /** Publication date (ISO 8601) */
  datePublished: string;
  
  /** Last modification date (ISO 8601) */
  dateModified: string;
  
  /** Article image */
  image?: string | SchemaImageObject;
  
  /** Publisher information */
  publisher?: SchemaOrganization;
  
  // GEO Enhancement Fields
  /** Core concepts discussed in the article */
  about?: SchemaDefinedTerm[];
  
  /** Knowledge points taught in the article */
  teaches?: string[];
  
  /** Technologies, tools, or concepts mentioned */
  mentions?: SchemaThing[];
  
  /** Part of a series or collection */
  isPartOf?: SchemaCreativeWorkSeries;
  
  /** Citations and references */
  citation?: SchemaCreativeWork[];
  
  /** Q&A structure */
  mainEntity?: SchemaQuestion[];
  
  /** Language of the content */
  inLanguage?: string;
}

/**
 * Schema.org Person
 */
export interface SchemaPerson {
  '@type': 'Person';
  name: string;
  description?: string;
  jobTitle?: string;
  url?: string;
  email?: string;
  affiliation?: SchemaOrganization;
}

/**
 * Schema.org Organization
 */
export interface SchemaOrganization {
  '@type': 'Organization';
  name: string;
  logo?: SchemaImageObject;
  url?: string;
}

/**
 * Schema.org Image Object
 */
export interface SchemaImageObject {
  '@type': 'ImageObject';
  url: string;
  width?: number;
  height?: number;
}

/**
 * Schema.org Defined Term
 */
export interface SchemaDefinedTerm {
  '@type': 'DefinedTerm';
  name: string;
  description: string;
  inDefinedTermSet?: string;
}

/**
 * Schema.org Thing (base type)
 */
export interface SchemaThing {
  '@type': string;
  name: string;
  description?: string;
}

/**
 * Schema.org Creative Work Series
 */
export interface SchemaCreativeWorkSeries {
  '@type': 'CreativeWorkSeries';
  name: string;
}

/**
 * Schema.org Creative Work
 */
export interface SchemaCreativeWork {
  '@type': 'CreativeWork';
  name: string;
  url?: string;
}

/**
 * Schema.org Question
 */
export interface SchemaQuestion {
  '@type': 'Question';
  name: string;
  acceptedAnswer: SchemaAnswer;
}

/**
 * Schema.org Answer
 */
export interface SchemaAnswer {
  '@type': 'Answer';
  text: string;
}

// ============================================================================
// Validation and Quality Types
// ============================================================================

/**
 * Content Quality Report - Assessment of content quality for GEO
 */
export interface ContentQualityReport {
  /** Article being assessed */
  articleId: string;
  
  /** Overall quality score (0-100) */
  overallScore: number;
  
  /** Individual quality metrics */
  metrics: {
    /** Has clear definition sentences */
    hasDefinitions: boolean;
    
    /** Has clear conclusion markers */
    hasConclusions: boolean;
    
    /** Uses proper list structures */
    hasProperLists: boolean;
    
    /** Paragraphs are appropriately sized */
    paragraphLengthOk: boolean;
    
    /** Avoids vague language */
    avoidsVagueTerms: boolean;
    
    /** Avoids hyperbole */
    avoidsHyperbole: boolean;
    
    /** Has author information */
    hasAuthorInfo: boolean;
    
    /** Has AI Summary */
    hasAISummary: boolean;
    
    /** Has Q&A coverage */
    hasQACoverage: boolean;
    
    /** Has citations or references */
    hasCitations: boolean;
  };
  
  /** Issues found during assessment */
  issues: QualityIssue[];
  
  /** Recommendations for improvement */
  recommendations: string[];
}

/**
 * Quality Issue - Specific quality problem found in content
 */
export interface QualityIssue {
  /** Severity of the issue */
  severity: 'error' | 'warning' | 'info';
  
  /** Type of issue */
  type: string;
  
  /** Description of the issue */
  message: string;
  
  /** Location in content where issue was found */
  location?: string;
}

/**
 * Validation Result - Result of validating structured data or content
 */
export interface ValidationResult {
  /** Whether validation passed */
  valid: boolean;
  
  /** Validation errors */
  errors: string[];
  
  /** Validation warnings */
  warnings?: string[];
}

/**
 * Parity Report - Comparison of multilingual content parity
 */
export interface ParityReport {
  /** Whether language versions have feature parity */
  hasParity: boolean;
  
  /** Issues found in parity check */
  issues: string[];
  
  /** Comparison details */
  details?: {
    zhFeatures: string[];
    enFeatures: string[];
    missingInZh: string[];
    missingInEn: string[];
  };
}

/**
 * Conflict Report - Report of terminology conflicts
 */
export interface ConflictReport {
  /** The term with conflicts */
  term: string;
  
  /** Canonical definition from dictionary */
  canonicalDefinition: string;
  
  /** Definition found in article */
  articleDefinition: string;
  
  /** Article where conflict was found */
  articleId: string;
}
