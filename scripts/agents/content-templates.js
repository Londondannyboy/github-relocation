/**
 * Content Templates for Different Article Types
 * Each template provides structure and specific requirements
 */

export const contentTemplates = {
  countryGuide: {
    name: "Comprehensive Country Guide",
    description: "Complete guide to relocating to a specific country",
    structure: [
      {
        section: "Hook",
        instructions: "Start with a compelling reason why this country is attracting record numbers of expats/investors in 2025",
        wordCount: 100
      },
      {
        section: "Country Overview",
        instructions: "Brief overview including population, language, currency, timezone, and what makes it unique for expats",
        wordCount: 200
      },
      {
        section: "Visa & Residency Options",
        instructions: "Detail ALL available visa types with requirements, costs, and processing times. Use a comparison table.",
        wordCount: 600,
        requirements: [
          "Include tourist visa → residency pathway if applicable",
          "Mention which visas lead to citizenship",
          "Specify income/investment requirements in USD",
          "Note family inclusion rules"
        ]
      },
      {
        section: "Tax System Explained",
        instructions: "Break down the tax system including income tax rates, capital gains, wealth tax, and special regimes",
        wordCount: 500,
        requirements: [
          "Include tax rate tables",
          "Explain territorial vs worldwide taxation",
          "Mention tax treaties with major countries",
          "Calculate example tax for $100k, $250k, $1M income"
        ]
      },
      {
        section: "Cost of Living Analysis",
        instructions: "Detailed breakdown of living costs in major cities with specific examples",
        wordCount: 400,
        requirements: [
          "Compare 3 lifestyle levels: Budget, Comfortable, Luxury",
          "Include rent, utilities, food, transport, healthcare",
          "Compare to NYC, London, Singapore costs",
          "Mention hidden costs expats discover"
        ]
      },
      {
        section: "Best Cities & Regions",
        instructions: "Profile top 3-5 locations with specifics on why each suits different expat profiles",
        wordCount: 500,
        requirements: [
          "Include climate, infrastructure, expat community size",
          "Mention international schools if family-friendly",
          "Note proximity to airports for travel",
          "Specify internet speeds for remote workers"
        ]
      },
      {
        section: "Banking & Finance",
        instructions: "Practical guide to opening accounts and managing finances",
        wordCount: 300,
        requirements: [
          "List foreigner-friendly banks",
          "Document requirements for account opening",
          "Mention if crypto-friendly",
          "Include money transfer options"
        ]
      },
      {
        section: "Healthcare System",
        instructions: "Overview of public and private healthcare options",
        wordCount: 300,
        requirements: [
          "Public vs private costs",
          "Insurance requirements and costs",
          "Quality ratings and wait times",
          "English-speaking providers"
        ]
      },
      {
        section: "Education Options",
        instructions: "Schools and universities for expat families",
        wordCount: 250,
        requirements: [
          "International school costs and curricula",
          "Public school accessibility for expats",
          "University options and costs",
          "Language learning resources"
        ]
      },
      {
        section: "Cultural Integration",
        instructions: "Honest assessment of integration challenges and opportunities",
        wordCount: 300,
        requirements: [
          "Language requirements reality",
          "Social integration tips",
          "Common cultural surprises",
          "Expat community resources"
        ]
      },
      {
        section: "Pros and Cons",
        instructions: "Balanced assessment with 5 genuine pros and 5 real cons",
        wordCount: 300
      },
      {
        section: "Action Steps",
        instructions: "Month-by-month timeline for making the move",
        wordCount: 400
      }
    ],
    totalWords: 4150,
    seoRequirements: {
      keywordDensity: "1-2%",
      headings: "H2 for each section, H3 for subsections",
      internalLinks: 5,
      externalLinks: 3
    }
  },

  visaComparison: {
    name: "Visa Program Comparison",
    description: "Detailed comparison of similar visa programs across countries",
    structure: [
      {
        section: "Hook",
        instructions: "Start with the key decision factors that matter most to applicants",
        wordCount: 100
      },
      {
        section: "Executive Summary",
        instructions: "One paragraph on each program with the main selling point",
        wordCount: 300
      },
      {
        section: "Comparison Table",
        instructions: "Comprehensive table comparing all key factors",
        wordCount: 500,
        requirements: [
          "Investment requirements",
          "Processing time",
          "Residency requirements",
          "Path to citizenship",
          "Tax implications",
          "Family inclusion",
          "Travel freedom",
          "Total costs"
        ]
      },
      {
        section: "Deep Dive per Program",
        instructions: "400 words on each program with unique advantages and hidden considerations",
        wordCount: 1600
      },
      {
        section: "Decision Framework",
        instructions: "Help readers choose based on their priorities",
        wordCount: 400,
        requirements: [
          "If speed is priority → recommend X",
          "If cost is priority → recommend Y",
          "If citizenship goal → recommend Z",
          "If tax optimization → recommend A"
        ]
      },
      {
        section: "Application Tips",
        instructions: "Insider tips for each program",
        wordCount: 400
      },
      {
        section: "Common Mistakes",
        instructions: "What causes rejections in each program",
        wordCount: 300
      },
      {
        section: "FAQ",
        instructions: "Address top 10 questions about these programs",
        wordCount: 500
      }
    ],
    totalWords: 4100,
    seoRequirements: {
      focusKeyword: "[Program A] vs [Program B] vs [Program C]",
      comparisonSchema: true,
      tables: "Must be mobile-responsive"
    }
  },

  companyFormation: {
    name: "Company Formation Guide",
    description: "Step-by-step guide to forming a company in a specific jurisdiction",
    structure: [
      {
        section: "Hook",
        instructions: "Lead with the main benefit (0% tax, EU access, etc.)",
        wordCount: 100
      },
      {
        section: "Why This Jurisdiction",
        instructions: "Unique advantages for international businesses",
        wordCount: 300
      },
      {
        section: "Company Types Explained",
        instructions: "Compare available structures with pros/cons",
        wordCount: 500,
        requirements: [
          "Free zone vs mainland (if applicable)",
          "LLC vs Corporation equivalents",
          "Minimum capital requirements",
          "Shareholder/director requirements"
        ]
      },
      {
        section: "Step-by-Step Process",
        instructions: "Detailed walkthrough with exact requirements",
        wordCount: 800,
        requirements: [
          "Pre-incorporation requirements",
          "Document checklist with attestation needs",
          "Government fees at each step",
          "Timeline for each phase",
          "Online vs in-person requirements"
        ]
      },
      {
        section: "Costs Breakdown",
        instructions: "Complete cost analysis",
        wordCount: 400,
        requirements: [
          "Government fees",
          "Agent fees (if required)",
          "Office/address costs",
          "Banking costs",
          "Ongoing compliance costs",
          "Hidden costs often missed"
        ]
      },
      {
        section: "Banking Reality",
        instructions: "Honest assessment of banking options",
        wordCount: 500,
        requirements: [
          "Which banks accept this company type",
          "Requirements for account opening",
          "Typical approval timeframes",
          "Alternative payment solutions"
        ]
      },
      {
        section: "Tax Implications",
        instructions: "Tax treatment in jurisdiction and internationally",
        wordCount: 500
      },
      {
        section: "Compliance Requirements",
        instructions: "Ongoing obligations and costs",
        wordCount: 400
      },
      {
        section: "Use Cases",
        instructions: "3 real examples of businesses thriving here",
        wordCount: 400
      },
      {
        section: "Alternatives to Consider",
        instructions: "Compare with 2 other jurisdictions",
        wordCount: 300
      }
    ],
    totalWords: 4200
  },

  taxStrategy: {
    name: "Tax Optimization Strategy Guide",
    description: "Deep dive into specific tax strategies or programs",
    structure: [
      {
        section: "Hook",
        instructions: "Lead with potential tax savings in real numbers",
        wordCount: 100
      },
      {
        section: "Strategy Overview",
        instructions: "Explain the mechanism and legal basis",
        wordCount: 400
      },
      {
        section: "Eligibility Requirements",
        instructions: "Detailed requirements with edge cases",
        wordCount: 400
      },
      {
        section: "Tax Calculations",
        instructions: "Multiple scenarios with real numbers",
        wordCount: 600,
        requirements: [
          "Salary income examples",
          "Investment income examples",
          "Business income examples",
          "Before and after comparisons"
        ]
      },
      {
        section: "Application Process",
        instructions: "Step-by-step with timelines",
        wordCount: 500
      },
      {
        section: "Maintaining Compliance",
        instructions: "Ongoing requirements and pitfalls",
        wordCount: 400
      },
      {
        section: "Exit Strategies",
        instructions: "How to properly exit the program",
        wordCount: 300
      },
      {
        section: "Case Studies",
        instructions: "2-3 real scenarios with outcomes",
        wordCount: 500
      },
      {
        section: "Professional Advice",
        instructions: "When and how to get help",
        wordCount: 200
      }
    ],
    totalWords: 3400
  },

  propertyInvestment: {
    name: "Property Investment Analysis",
    description: "Guide to property investment for visa/investment purposes",
    structure: [
      {
        section: "Market Overview",
        instructions: "Current state and trends with data",
        wordCount: 400
      },
      {
        section: "Investment Requirements",
        instructions: "Visa requirements and restrictions",
        wordCount: 300
      },
      {
        section: "Best Locations Analysis",
        instructions: "Top 5 areas with specific data",
        wordCount: 800,
        requirements: [
          "Price per sqm",
          "Rental yields",
          "Capital appreciation history",
          "Future development plans"
        ]
      },
      {
        section: "Purchase Process",
        instructions: "Complete buying process for foreigners",
        wordCount: 600
      },
      {
        section: "Costs Analysis",
        instructions: "All costs including hidden ones",
        wordCount: 400,
        requirements: [
          "Purchase taxes and fees",
          "Ongoing property taxes",
          "Management costs",
          "Exit taxes"
        ]
      },
      {
        section: "Rental Strategy",
        instructions: "Maximizing returns legally",
        wordCount: 500
      },
      {
        section: "Exit Strategy",
        instructions: "Selling considerations and timing",
        wordCount: 400
      },
      {
        section: "Risk Assessment",
        instructions: "Honest evaluation of risks",
        wordCount: 400
      }
    ],
    totalWords: 3800
  },

  stepByStep: {
    name: "Process Tutorial",
    description: "Detailed how-to guide for specific processes",
    structure: [
      {
        section: "What You'll Achieve",
        instructions: "Clear outcome definition",
        wordCount: 150
      },
      {
        section: "Prerequisites",
        instructions: "What you need before starting",
        wordCount: 300
      },
      {
        section: "Phase-by-Phase Guide",
        instructions: "Break into 3-5 major phases, each with substeps",
        wordCount: 2000,
        requirements: [
          "Number each step clearly",
          "Include screenshots or diagrams references",
          "Mention time required for each phase",
          "Include decision points",
          "Add troubleshooting for common issues"
        ]
      },
      {
        section: "Tools & Resources",
        instructions: "Everything needed to complete the process",
        wordCount: 300
      },
      {
        section: "Common Mistakes",
        instructions: "Top 5 mistakes and how to avoid",
        wordCount: 400
      },
      {
        section: "Success Checklist",
        instructions: "Final verification checklist",
        wordCount: 200
      }
    ],
    totalWords: 3350
  }
};

/**
 * Select appropriate template based on keyword and category
 */
export function selectTemplate(keyword, category) {
  const keywordLower = keyword.toLowerCase();
  
  // Keyword-based selection
  if (keywordLower.includes('vs') || keywordLower.includes('comparison') || keywordLower.includes('compare')) {
    return contentTemplates.visaComparison;
  }
  if (keywordLower.includes('company') || keywordLower.includes('business') || keywordLower.includes('incorporate')) {
    return contentTemplates.companyFormation;
  }
  if (keywordLower.includes('tax') || keywordLower.includes('nhr') || keywordLower.includes('territorial')) {
    return contentTemplates.taxStrategy;
  }
  if (keywordLower.includes('property') || keywordLower.includes('real estate') || keywordLower.includes('investment')) {
    return contentTemplates.propertyInvestment;
  }
  if (keywordLower.includes('how to') || keywordLower.includes('step by step') || keywordLower.includes('guide')) {
    return contentTemplates.stepByStep;
  }
  
  // Check if it's a country-specific guide
  const countries = ['portugal', 'spain', 'dubai', 'cyprus', 'malta', 'greece', 'estonia', 'singapore'];
  const isCountryGuide = countries.some(country => keywordLower.includes(country)) && 
                        (keywordLower.includes('guide') || keywordLower.includes('relocation') || keywordLower.includes('moving'));
  
  if (isCountryGuide) {
    return contentTemplates.countryGuide;
  }
  
  // Default based on category
  const categoryTemplateMap = {
    'Golden Visa Programs': contentTemplates.countryGuide,
    'Tax Strategies': contentTemplates.taxStrategy,
    'Business Setup': contentTemplates.companyFormation,
    'Property Investment': contentTemplates.propertyInvestment,
    'Digital Nomad': contentTemplates.countryGuide,
    'Citizenship Programs': contentTemplates.visaComparison
  };
  
  return categoryTemplateMap[category] || contentTemplates.stepByStep;
}

/**
 * Generate content brief from template
 */
export function generateContentBrief(template, keyword, researchData) {
  const brief = {
    template: template.name,
    keyword: keyword,
    targetWordCount: template.totalWords,
    sections: []
  };
  
  template.structure.forEach(section => {
    brief.sections.push({
      title: section.section,
      instructions: section.instructions,
      targetWords: section.wordCount,
      requirements: section.requirements || [],
      researchPoints: extractRelevantResearch(section.section, researchData)
    });
  });
  
  return brief;
}

/**
 * Extract relevant research for each section
 */
function extractRelevantResearch(sectionTitle, researchData) {
  const points = [];
  
  // Map section titles to research data
  const sectionLower = sectionTitle.toLowerCase();
  
  if (sectionLower.includes('tax')) {
    if (researchData.taxRates) points.push(`Tax rates: ${JSON.stringify(researchData.taxRates)}`);
    if (researchData.taxTreaties) points.push(`Treaties with: ${researchData.taxTreaties.join(', ')}`);
  }
  
  if (sectionLower.includes('cost')) {
    if (researchData.costs) points.push(`Costs: ${JSON.stringify(researchData.costs)}`);
    if (researchData.livingCosts) points.push(`Living costs: ${JSON.stringify(researchData.livingCosts)}`);
  }
  
  if (sectionLower.includes('visa') || sectionLower.includes('residency')) {
    if (researchData.visaRequirements) points.push(`Requirements: ${JSON.stringify(researchData.visaRequirements)}`);
    if (researchData.processingTime) points.push(`Timeline: ${researchData.processingTime}`);
  }
  
  // Add any statistics or sources relevant to this section
  if (researchData.sources) {
    const relevantSources = researchData.sources.filter(source => 
      source.title.toLowerCase().includes(sectionLower) ||
      source.snippet.toLowerCase().includes(sectionLower)
    );
    if (relevantSources.length > 0) {
      points.push(`Sources: ${relevantSources.slice(0, 3).map(s => s.title).join('; ')}`);
    }
  }
  
  return points;
}