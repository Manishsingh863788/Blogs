export const WRITER_PROFILE = {
  name: "Jaideep Singh & Legal Research Council",
  title: "Principal Real Estate & Land Revenue Attorney",
  avatar: "/writer.jpg",
  bio: "Specializing in global land tenure, stamp duty frameworks, RERA compliances, municipal zoning regulations, and cross-border property investments. Empowering homebuyers and developers with crystal-clear legal insights.",
  experience: "15+ Years in Global Property Law",
  publications: "120+ Land Act Analysis Reports",
  socials: {
    youtube: "https://youtube.com/@homedropsvilla?si=lDy_vdReeF3VXZqv",
    instagram: "https://www.instagram.com/homedropsvilla?igsh=aGc2d3c0NnZoa3Yw",
    facebook: "https://www.facebook.com/share/19TSsdtYQW/"
  }
};

export const INITIAL_BLOGS = [
  // --- COUNTRY LAWS: INDIA ---
  {
    id: "india-rera-act-2016",
    title: "India Real Estate (Regulation and Development) Act (RERA) 2016",
    slug: "india-rera-act-2016",
    level: "country",
    country: "India",
    state: "National",
    city: "All Metros",
    coordinates: [20.5937, 78.9629],
    category: "RERA & Protection",
    date: "August 10, 2026",
    readTime: "8 min read",
    featured: true,
    image: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b2?auto=format&fit=crop&w=1200&q=80",
    summary: "Comprehensive guide to buyer rights, mandatory developer escrow accounts (70%), carpet area pricing, and state RERA tribunals across India.",
    author: WRITER_PROFILE,
    content: [
      {
        heading: "1. Overview & Legislative Context of RERA 2016",
        body: "Enacted by the Parliament of India in 2016, the Real Estate (Regulation and Development) Act established a landmark regulatory framework to protect home buyers and boost real estate investments. Prior to RERA, project delays, unapproved construction alterations, and misleading advertisements plagued the Indian real estate landscape."
      },
      {
        heading: "2. Key Mandates & Statutory Rights",
        body: "• Mandatory Project Registration: Any residential or commercial project where land area exceeds 500 sq meters or number of apartments exceeds 8 must register with the state RERA Authority.\n• 70% Escrow Account Rule: Developers must deposit 70% of collections from buyers into a dedicated bank account reserved exclusively for construction and land costs.\n• Carpet Area Definition: Prices can only be charged based on net usable floor area (carpet area), putting an end to inflated super-built-up area calculations.\n• Standardized Penalties: Equal interest rates for buyers facing payment default and developers suffering construction delays."
      },
      {
        heading: "3. Dispute Resolution & Appellate Tribunals",
        body: "Every Indian state operates an Appellate Tribunal. Complaints filed before state RERA officers must be adjudicated within 60 days. Buyers receive full refunds with compound interest if promised possession dates are breached without force majeure justification."
      }
    ],
    faqs: [
      {
        question: "Can a developer sell parking slots separately under RERA?",
        answer: "No. RERA clearly defines covered parking as part of common areas, prohibiting developers from charging extra or selling open parking spaces separately."
      },
      {
        question: "What happens if a structural defect is found after handover?",
        answer: "Under Section 14(3), developers are legally obligated to rectify any structural defect or quality shortfall brought to notice within 5 years of possession, free of charge within 30 days."
      },
      {
        question: "Does RERA apply to ongoing projects launched before 2016?",
        answer: "Yes, all ongoing projects that had not received a Completion Certificate (CC) prior to May 1, 2017, were mandated to register under state RERA authorities."
      }
    ],
    relatedBlogIds: ["india-stamp-duty-act-1899", "maharashtra-maharera-guidelines", "mumbai-dcpr-2034"]
  },

  {
    id: "india-stamp-duty-act-1899",
    title: "Indian Stamp Act 1899 & Property Registration Norms",
    slug: "india-stamp-duty-act-1899",
    level: "country",
    country: "India",
    state: "National",
    city: "National",
    coordinates: [22.3511, 78.6677],
    category: "Stamp Duty",
    date: "July 24, 2026",
    readTime: "7 min read",
    featured: false,
    image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80",
    summary: "Understanding state-wise stamp duty rates, circle rates vs market values, e-stamping processes, and section 17 registration mandates.",
    author: WRITER_PROFILE,
    content: [
      {
        heading: "1. The Statutory Framework of Stamp Duty in India",
        body: "Governed under the Indian Stamp Act 1899 (as amended by individual state amendments), stamp duty is a revenue tax levied on all legal documents confirming land title transfer, gift deeds, mortgage deeds, and lease agreements."
      },
      {
        heading: "2. Ready Reckoner Rate vs Transaction Price",
        body: "State governments publish annual Ready Reckoner (Circle) rates. Stamp duty is payable on whichever value is higher: the agreed purchase price or the statutory circle rate. Undervaluing deeds to evade duty triggers tax audit proceedings under Section 47A."
      }
    ],
    faqs: [
      {
        question: "Are women eligible for stamp duty concessions in Indian states?",
        answer: "Yes! States like Maharashtra, Delhi, and Uttar Pradesh offer a 1% to 2% rebate on stamp duty when property is registered solely or jointly in a woman's name."
      },
      {
        question: "Is e-stamping legal across all states?",
        answer: "Yes, Stock Holding Corporation of India Limited (SHCIL) e-stamping certificates are accepted across major states as tamper-proof legal evidence."
      }
    ],
    relatedBlogIds: ["india-rera-act-2016", "up-revenue-code-2006", "kanpur-kda-masterplan"]
  },

  // --- COUNTRY LAWS: USA ---
  {
    id: "usa-real-property-law",
    title: "USA Federal Property Rights & Foreign Investment in Real Property Tax Act (FIRPTA)",
    slug: "usa-real-property-law",
    level: "country",
    country: "United States",
    state: "Federal",
    city: "National",
    coordinates: [37.0902, -95.7129],
    category: "Foreign Ownership",
    date: "June 18, 2026",
    readTime: "9 min read",
    featured: true,
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
    summary: "Key tax implications, 1031 exchanges, non-resident property acquisitions, and IRS withholding rules under FIRPTA.",
    author: WRITER_PROFILE,
    content: [
      {
        heading: "1. Fee Simple Ownership & Constitutionally Protected Rights",
        body: "Real estate ownership in the US is predominantly 'Fee Simple Absolute', granting owners complete rights to sell, lease, or pass property to heirs subject to local zoning laws and eminent domain."
      },
      {
        heading: "2. FIRPTA (Foreign Investment in Real Property Tax Act)",
        body: "When a foreign person or entity disposes of US real property interest, IRS regulations require buyers to withhold 15% of the gross sale price at closing unless specific exemptions apply."
      }
    ],
    faqs: [
      {
        question: "Can non-US citizens purchase residential real estate in the US?",
        answer: "Yes, non-citizens can buy, own, and rent property freely in all 50 states without resident visa requirements."
      },
      {
        question: "What is a 1031 Exchange?",
        answer: "Section 1031 of the Internal Revenue Code allows property investors to defer capital gains tax by reinvesting proceeds into a 'like-kind' real estate asset."
      }
    ],
    relatedBlogIds: ["california-prop-13", "nyc-zoning-resolution"]
  },

  // --- COUNTRY LAWS: UAE ---
  {
    id: "uae-dubai-property-act",
    title: "UAE & Dubai Land Department (DLD) Freehold & Escrow Laws",
    slug: "uae-dubai-property-act",
    level: "country",
    country: "United Arab Emirates",
    state: "Dubai",
    city: "Dubai City",
    coordinates: [25.2048, 55.2708],
    category: "Foreign Ownership",
    date: "May 29, 2026",
    readTime: "8 min read",
    featured: true,
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
    summary: "Law No. 7 of 2006, 10-year Golden Visa real estate thresholds, Oqood registration, and off-plan escrow account safety.",
    author: WRITER_PROFILE,
    content: [
      {
        heading: "1. Freehold Property Law No. 7 of 2006",
        body: "Law No. 7 granted non-GCC expatriates the legal right to purchase 100% freehold land and property in designated areas of Dubai without restrictions."
      },
      {
        heading: "2. Off-Plan Protection (Law No. 8 of 2007)",
        body: "Developers cannot collect off-plan payments directly into operational bank accounts. All funds must be remitted to a DLD-monitored Escrow Account disbursed strictly upon construction milestone audits."
      }
    ],
    faqs: [
      {
        question: "What is the minimum investment for Dubai Golden Visa via real estate?",
        answer: "AED 2,000,000 (approx. USD 545,000) in property equity grants a 10-year renewable residency visa for the buyer and family."
      },
      {
        question: "What is Oqood registration?",
        answer: "Oqood is the digital system managed by Dubai Real Estate Regulatory Agency (RERA) to register off-plan contracts before completion."
      }
    ],
    relatedBlogIds: ["india-rera-act-2016", "uk-land-registration-act-2002"]
  },

  // --- COUNTRY LAWS: UK ---
  {
    id: "uk-land-registration-act-2002",
    title: "United Kingdom Land Registration Act 2002 & Leasehold Reform",
    slug: "uk-land-registration-act-2002",
    level: "country",
    country: "United Kingdom",
    state: "England & Wales",
    city: "London",
    coordinates: [51.5074, -0.1278],
    category: "Leasehold & Freehold",
    date: "April 14, 2026",
    readTime: "7 min read",
    featured: false,
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80",
    summary: "HM Land Registry digital deeds, Abolition of Peppercorn Ground Rent 2022, and Stamp Duty Land Tax (SDLT) tiered bands.",
    author: WRITER_PROFILE,
    content: [
      {
        heading: "1. HM Land Registry & Title Guarantee",
        body: "The Land Registration Act 2002 digitized real estate titles across England & Wales, ensuring public title registers protected against boundary fraud."
      },
      {
        heading: "2. Leasehold Reform (Ground Rent Act) 2022",
        body: "Landlords can no longer charge financial ground rents on new residential long leases. Ground rents are legally capped at one peppercorn per year."
      }
    ],
    faqs: [
      {
        question: "What is the difference between Freehold and Leasehold in the UK?",
        answer: "Freehold gives complete ownership of the building and land indefinitely. Leasehold gives rights to occupy for a set term (e.g. 99 or 999 years) from the freeholder."
      }
    ],
    relatedBlogIds: ["london-gla-planning", "usa-real-property-law"]
  },

  // --- STATE LAWS ---
  {
    id: "maharashtra-maharera-guidelines",
    title: "Maharashtra Real Estate Law & MahaRERA Master Directives",
    slug: "maharashtra-maharera-guidelines",
    level: "state",
    country: "India",
    state: "Maharashtra",
    city: "Mumbai & Pune",
    coordinates: [19.7515, 75.7139],
    category: "State Regulation",
    date: "July 12, 2026",
    readTime: "8 min read",
    featured: true,
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80",
    summary: "MahaRERA QR Code mandates, Land Revenue Code 1966, non-agricultural (NA) permission waivers, and model agreement clauses.",
    author: WRITER_PROFILE,
    content: [
      {
        heading: "1. MahaRERA Leading Innovation in India",
        body: "Maharashtra RERA (MahaRERA) is widely recognized as the most active state regulator in India, pioneering mandatory QR codes on print ads and quarterly financial disclosures."
      },
      {
        heading: "2. Maharashtra Land Revenue Code 1966 & NA Certificates",
        body: "Section 42 of the Revenue Code governs conversion of agricultural land to Non-Agricultural (NA) use. Recent 2023 amendments auto-convert land zoned in master plans."
      }
    ],
    faqs: [
      {
        question: "Is MahaRERA QR code mandatory on project hoardings?",
        answer: "Yes! Failure to display the QR code carrying project financial details results in immediate monetary fines up to Rs 50,000 per violation."
      }
    ],
    relatedBlogIds: ["india-rera-act-2016", "mumbai-dcpr-2034"]
  },

  {
    id: "up-revenue-code-2006",
    title: "Uttar Pradesh Real Estate & Land Revenue Code 2006",
    slug: "up-revenue-code-2006",
    level: "state",
    country: "India",
    state: "Uttar Pradesh",
    city: "Noida, Ghaziabad, Kanpur, Lucknow",
    coordinates: [26.8467, 80.9462],
    category: "Land Acts 1950 & Revenue",
    date: "June 05, 2026",
    readTime: "9 min read",
    featured: true,
    image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80",
    summary: "Section 80 Land Use Change (Changer of Land Use), Zamindari Abolition legacy laws, Bhumidhar rights, and UP RERA tribunal procedures.",
    author: WRITER_PROFILE,
    content: [
      {
        heading: "1. Legacy from Zamindari Abolition 1950 to UP Revenue Code 2006",
        body: "The UP Revenue Code consolidated historic land tenure laws including the landmark UP Zamindari Abolition and Land Reforms Act 1950. It classifies landholders as Bhumidhar with Transferable Rights, Non-Transferable Rights, or Asami."
      },
      {
        heading: "2. Section 80 Declaration (Agricultural to Non-Agricultural)",
        body: "Before constructing commercial or residential properties on agricultural land in UP, an application under Section 80 must be submitted to the Sub-Divisional Magistrate (SDM)."
      }
    ],
    faqs: [
      {
        question: "Can non-farmers buy agricultural land in UP?",
        answer: "Unlike Uttarakhand or Himachal Pradesh, any Indian citizen can purchase agricultural land in UP up to 12.5 acres without prior agricultural status."
      }
    ],
    relatedBlogIds: ["kanpur-kda-masterplan", "ghaziabad-gda-rules", "rishikesh-uttarakhand-land-act"]
  },

  {
    id: "california-prop-13",
    title: "California Property Laws: Proposition 13 & Assembly Bill 1482 Rent Cap",
    slug: "california-prop-13",
    level: "state",
    country: "United States",
    state: "California",
    city: "Los Angeles, San Francisco",
    coordinates: [36.7783, -119.4179],
    category: "State Regulation",
    date: "May 14, 2026",
    readTime: "7 min read",
    featured: false,
    image: "https://images.unsplash.com/photo-1580655653885-65763b2597d0?auto=format&fit=crop&w=1200&q=80",
    summary: "Statutory 1% property tax cap under Prop 13, reassessment upon title transfer, and statewide rent increase caps under AB 1482.",
    author: WRITER_PROFILE,
    content: [
      {
        heading: "1. Proposition 13 Tax Stabilization",
        body: "Passed in 1978, Prop 13 limits base real property taxes in California to 1% of assessed value, capping annual inflation reassessments at 2% until property changes hands."
      }
    ],
    faqs: [
      {
        question: "What triggers a tax reassessment in California?",
        answer: "Any change in property ownership or completion of new physical construction triggers reassessment to full fair market value."
      }
    ],
    relatedBlogIds: ["usa-real-property-law", "nyc-zoning-resolution"]
  },

  {
    id: "texas-property-code",
    title: "Texas Property Code: Homestead Exemption & Land Tenure Rights",
    slug: "texas-property-code",
    level: "state",
    country: "United States",
    state: "Texas",
    city: "Austin, Dallas, Houston",
    coordinates: [31.9686, -99.9018],
    category: "State Regulation",
    date: "June 22, 2026",
    readTime: "8 min read",
    featured: true,
    image: "https://images.unsplash.com/photo-1531218150217-54595bc2b934?auto=format&fit=crop&w=1200&q=80",
    summary: "Texas constitutional homestead asset protection, property tax protest mechanisms, and seller disclosure notices under Section 5.008.",
    author: WRITER_PROFILE,
    content: [
      {
        heading: "1. Constitutional Homestead Asset Protection",
        body: "Article XVI of the Texas Constitution protects urban homesteads up to 10 contiguous acres and rural homesteads up to 200 acres for families from forced sale by most creditors."
      },
      {
        heading: "2. Statutory Seller Disclosure Notice",
        body: "Under Texas Property Code Section 5.008, residential sellers must provide a detailed disclosure of property condition, flood hazards, and structural defects prior to contract execution."
      }
    ],
    faqs: [
      {
        question: "Does Texas have state income tax on property sales?",
        answer: "No, Texas has no state personal income tax, but relies on county appraisal district property taxes."
      }
    ],
    relatedBlogIds: ["usa-real-property-law", "california-prop-13"]
  },

  {
    id: "scotland-land-registration-act",
    title: "Scotland Land Registration Act 2012 & Crofting Reform",
    slug: "scotland-land-registration-act",
    level: "state",
    country: "United Kingdom",
    state: "Scotland",
    city: "Edinburgh, Glasgow",
    coordinates: [56.4907, -4.2026],
    category: "Leasehold & Freehold",
    date: "May 18, 2026",
    readTime: "7 min read",
    featured: false,
    image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1200&q=80",
    summary: "Registers of Scotland digital title mapping, Land and Buildings Transaction Tax (LBTT), and Scottish community right-to-buy land legislation.",
    author: WRITER_PROFILE,
    content: [
      {
        heading: "1. Land Register of Scotland & Digital Cadastral Mapping",
        body: "The Land Registration (Scotland) Act 2012 replaced sasine land deeds with a state-guaranteed digital land register linked to Ordnance Survey maps."
      }
    ],
    faqs: [
      {
        question: "What is LBTT in Scotland?",
        answer: "Land and Buildings Transaction Tax (LBTT) is Scotland's tax on property purchases, replacing Stamp Duty Land Tax."
      }
    ],
    relatedBlogIds: ["uk-land-registration-act-2002", "london-gla-planning"]
  },

  {
    id: "abu-dhabi-adrera-law",
    title: "Abu Dhabi Real Estate Law No. 3 of 2015 & Investment Zones",
    slug: "abu-dhabi-adrera-law",
    level: "state",
    country: "United Arab Emirates",
    state: "Abu Dhabi",
    city: "Abu Dhabi City, Saadiyat, Yas Island",
    coordinates: [24.4539, 54.3773],
    category: "Foreign Ownership",
    date: "July 08, 2026",
    readTime: "8 min read",
    featured: true,
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
    summary: "Law No. 3 of 2015 governing Abu Dhabi Real Estate Regulatory Authority (ADRERA), foreign freehold investment zones, and Musataha long-term land contracts.",
    author: WRITER_PROFILE,
    content: [
      {
        heading: "1. Designated Foreign Investment Zones in Abu Dhabi",
        body: "Non-UAE nationals can own 100% freehold rights in designated investment zones such as Al Reem Island, Saadiyat Island, and Yas Island under Law No. 19 of 2005."
      },
      {
        heading: "2. Musataha & Usufruct Real Estate Rights",
        body: "Musataha agreements grant 50-year renewable rights to build and develop land owned by third parties or municipal authorities."
      }
    ],
    faqs: [
      {
        question: "What is the difference between Dubai and Abu Dhabi property ownership for foreign buyers?",
        answer: "Both allow full freehold ownership in designated investment zones; Abu Dhabi also offers Musataha (50-year development rights) for commercial land."
      }
    ],
    relatedBlogIds: ["uae-dubai-property-act", "india-rera-act-2016"]
  },

  // --- CITY LAWS ---
  {
    id: "rishikesh-uttarakhand-land-act",
    title: "Rishikesh & Uttarakhand Land Laws: 250 Sq Meter Purchase Limit & Master Plan 2031",
    slug: "rishikesh-uttarakhand-land-act",
    level: "city",
    country: "India",
    state: "Uttarakhand",
    city: "Rishikesh",
    coordinates: [30.0869, 78.2676],
    category: "Hill Land Restrictions",
    date: "August 02, 2026",
    readTime: "8 min read",
    featured: true,
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    summary: "Section 154 of UP Zamindari Act as applicable to Uttarakhand, 250 sq. meter non-domicile purchase limit, and Ganga Eco-Sensitive Zone bylaws.",
    author: WRITER_PROFILE,
    content: [
      {
        heading: "1. Land Acquisition Limits for Non-Uttarakhand Domiciles",
        body: "To preserve fragile Himalayan ecology, outsiders buying agricultural land outside municipal limits in Rishikesh are legally restricted to a maximum of 250 square meters per family."
      },
      {
        heading: "2. Rishikesh-Haridwar Master Plan 2031 & HRDA Clearances",
        body: "Properties within Haridwar-Rishikesh Development Authority (HRDA) jurisdiction require strict setbacks, flood plain zone clearances, and sewage treatment plant (STP) integration."
      }
    ],
    faqs: [
      {
        question: "Can an outsider buy commercial resort land in Rishikesh?",
        answer: "Yes, but buying more than 250 sq meters of agricultural land requires special state cabinet permission under Section 154(2) for tourism/industrial projects."
      },
      {
        question: "What is the buffer distance from River Ganga for construction?",
        answer: "As mandated by the National Green Tribunal (NGT), no permanent construction is permitted within 200 meters of the highest flood level of the River Ganga."
      }
    ],
    relatedBlogIds: ["up-revenue-code-2006", "kanpur-kda-masterplan"]
  },

  {
    id: "hyderabad-hmda-dharani-laws",
    title: "Hyderabad Real Estate: HMDA Bylaws, Dharani Portal & Lake Buffer Rules",
    slug: "hyderabad-hmda-dharani-laws",
    level: "city",
    country: "India",
    state: "Telangana",
    city: "Hyderabad",
    coordinates: [17.3850, 78.4867],
    category: "Zoning & Water Bodies",
    date: "July 28, 2026",
    readTime: "8 min read",
    featured: true,
    image: "https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=1200&q=80",
    summary: "Hyderabad Metropolitan Development Authority (HMDA) permissions, TS-bPASS single window layout approvals, and FTL (Full Tank Level) lake restrictions.",
    author: WRITER_PROFILE,
    content: [
      {
        heading: "1. TS-bPASS Single Window Building Approval",
        body: "Telangana State Building Permission Approval and Self-Certification System (TS-bPASS) allows instant approval for residential plots up to 500 sq meters based on owner self-declaration."
      },
      {
        heading: "2. FTL Lake Buffer Regulations & HYDRA Enforcement",
        body: "Strict enforcement prevents construction within 30 meters of lake Full Tank Level (FTL) boundaries and 9-meter nalas (drainage channels)."
      }
    ],
    faqs: [
      {
        question: "What is Dharani Portal in Telangana?",
        answer: "Dharani is an integrated digital land records management portal combining agricultural land registration and mutation into a single instant slot booking."
      }
    ],
    relatedBlogIds: ["india-rera-act-2016", "mumbai-dcpr-2034"]
  },

  {
    id: "kanpur-kda-masterplan",
    title: "Kanpur Land Regulations: KDA Master Plan 2031 & Nazul Land Leasing Rules",
    slug: "kanpur-kda-masterplan",
    level: "city",
    country: "India",
    state: "Uttar Pradesh",
    city: "Kanpur",
    coordinates: [26.4499, 80.3319],
    category: "Master Plan & Nazul Land",
    date: "June 20, 2026",
    readTime: "7 min read",
    featured: false,
    image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1200&q=80",
    summary: "Kanpur Development Authority (KDA) residential layout approvals, Nazul land freehold conversion policy 2024, and industrial zone rules.",
    author: WRITER_PROFILE,
    content: [
      {
        heading: "1. Nazul Property Conversion Policy in Kanpur",
        body: "Nazul land (government land leased during British era) in prime Kanpur localities like Civil Lines and Swaroop Nagar can be converted into freehold title upon paying 20-30% of circle rate value."
      },
      {
        heading: "2. KDA Land Use Norms & Industrial Conversion",
        body: "Converting former textile mill plots to residential housing requires KDA Board approval and 15% infrastructure development surcharge payment."
      }
    ],
    faqs: [
      {
        question: "Is buying Nazul land safe in Kanpur?",
        answer: "Buying leasehold Nazul land requires verifying lease term remaining; buying converted Freehold Nazul land carries full clear title security."
      }
    ],
    relatedBlogIds: ["up-revenue-code-2006", "ghaziabad-gda-rules"]
  },

  {
    id: "ghaziabad-gda-rules",
    title: "Ghaziabad Real Estate Norms: GDA Master Plan & NCR Land Guidelines",
    slug: "ghaziabad-gda-rules",
    level: "city",
    country: "India",
    state: "Uttar Pradesh",
    city: "Ghaziabad",
    coordinates: [28.6692, 77.4538],
    category: "NCR Expansion & FAR",
    date: "May 19, 2026",
    readTime: "7 min read",
    featured: false,
    image: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b2?auto=format&fit=crop&w=1200&q=80",
    summary: "Ghaziabad Development Authority (GDA) floor area ratio (FAR) purchase options, illegal colony warnings, and Rapid Rail (RRTS) corridor transit zoning.",
    author: WRITER_PROFILE,
    content: [
      {
        heading: "1. GDA Purchasable FAR Policies",
        body: "Property developers along transit corridors (Delhi-Meerut RRTS and Metro) can purchase additional Floor Area Ratio (FAR) up to 3.5 to construct high-density residential towers."
      }
    ],
    faqs: [
      {
        question: "How to check if a society plot in Indirapuram or Raj Nagar Extension is GDA approved?",
        answer: "Always verify the 13-digit GDA Plan Approval Number on the official GDA portal before paying booking tokens."
      }
    ],
    relatedBlogIds: ["up-revenue-code-2006", "kanpur-kda-masterplan"]
  },

  {
    id: "mumbai-dcpr-2034",
    title: "Mumbai Property Blueprint: DCPR 2034, SRA Slum Redevelopment & CRZ Norms",
    slug: "mumbai-dcpr-2034",
    level: "city",
    country: "India",
    state: "Maharashtra",
    city: "Mumbai",
    coordinates: [19.0760, 72.8777],
    category: "Redevelopment & Coastal",
    date: "August 12, 2026",
    readTime: "10 min read",
    featured: true,
    image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1200&q=80",
    summary: "Development Control & Promotion Regulations 2034, Transferable Development Rights (TDR), Section 33(7) housing society redevelopment, and CRZ-II setbacks.",
    author: WRITER_PROFILE,
    content: [
      {
        heading: "1. DCPR 2034 Master Blueprint for Mumbai",
        body: "DCPR 2034 revolutionized Mumbai real estate by linking FSI (Floor Space Index) to road width, allowing higher vertical construction on roads over 12 meters wide."
      },
      {
        heading: "2. Housing Society Redevelopment (Section 33(7) & 33(11))",
        body: "Co-operative housing societies over 30 years old receive additional incentive FSI (50% over existing built-up area) when executing developer agreements."
      }
    ],
    faqs: [
      {
        question: "What is TDR (Transferable Development Rights) in Mumbai?",
        answer: "TDR is a certificate issued when land is surrendered for public roads/parks, allowing developers to build equivalent square footage elsewhere."
      }
    ],
    relatedBlogIds: ["maharashtra-maharera-guidelines", "india-rera-act-2016"]
  },

  {
    id: "nyc-zoning-resolution",
    title: "New York City Land Laws: NYC Zoning Resolution, Air Rights & Co-op Laws",
    slug: "nyc-zoning-resolution",
    level: "city",
    country: "United States",
    state: "New York",
    city: "New York City",
    coordinates: [40.7128, -74.0060],
    category: "Zoning & Air Rights",
    date: "July 04, 2026",
    readTime: "9 min read",
    featured: true,
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80",
    summary: "Understanding NYC 1961 Zoning Resolution, transferable development air rights, Cooperative vs Condominium board approval rules, and Mansion Tax.",
    author: WRITER_PROFILE,
    content: [
      {
        heading: "1. NYC Zoning Resolution Framework",
        body: "NYC zoning divides the 5 boroughs into Residential (R), Commercial (C), and Manufacturing (M) districts, assigning precise Floor Area Ratios (FAR) to every lot."
      },
      {
        heading: "2. Transfer of Development Rights (Air Rights)",
        body: "Under NYC land law, unused vertical air space above low-rise historical buildings can be sold to adjacent lots to erect taller skyscrapers."
      }
    ],
    faqs: [
      {
        question: "What is the NY Mansion Tax threshold?",
        answer: "New York State levies a 1% to 3.9% Mansion Tax on residential sales priced at $1 million or higher."
      }
    ],
    relatedBlogIds: ["usa-real-property-law", "california-prop-13"]
  },

  {
    id: "london-gla-planning",
    title: "London Property Regulations: GLA London Plan & Historic Conservation Zones",
    slug: "london-gla-planning",
    level: "city",
    country: "United Kingdom",
    state: "England",
    city: "London",
    coordinates: [51.5074, -0.1278],
    category: "Leasehold & Freehold",
    date: "June 11, 2026",
    readTime: "8 min read",
    featured: false,
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80",
    summary: "Greater London Authority planning frameworks, Grade I/II listed building restrictions, and 35% affordable housing quotas.",
    author: WRITER_PROFILE,
    content: [
      {
        heading: "1. The Spatial Development Strategy for Greater London",
        body: "The London Plan sets binding targets for borough councils regarding housing delivery, urban greening standards, and carbon-neutral building requirements."
      }
    ],
    faqs: [
      {
        question: "Can you alter the exterior of a Grade II listed property in Kensington or Westminster?",
        answer: "No external or internal alterations of architectural interest can be performed without formal Listed Building Consent from the local council."
      }
    ],
    relatedBlogIds: ["uk-land-registration-act-2002"]
  }
];

export const INITIAL_COMMENTS = [
  {
    id: 'comm_1',
    blogId: 'india-rera-act-2016',
    blogTitle: 'Real Estate (Regulation and Development) Act (RERA) 2016',
    userId: 'user_1',
    userName: 'Vikram Joshi',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    userRole: 'Home Buyer',
    text: 'If a builder delays handover past the revised RERA completion date, can I claim interest on my total invested amount every month until possession?',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    likes: 4,
    replies: [
      {
        id: 'rep_1',
        authorName: 'Home Drops Villa Legal Desk',
        authorRole: 'Official Administrator',
        isOfficialAdmin: true,
        text: 'Yes, Vikram. Under Section 18 of RERA 2016, if the promoter fails to give possession on time, the allottee has two choices: (1) withdraw and seek full refund with interest, or (2) remain in the project and receive monthly statutory interest (SBI MCLR + 2%) from the promised date until physical possession with Occupancy Certificate (OC).',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
      }
    ]
  },
  {
    id: 'comm_2',
    blogId: 'maharashtra-maharera-guidelines',
    blogTitle: 'Maharashtra Ownership Flats Act (MOFA) 1963 & MahaRERA Directives',
    userId: 'user_2',
    userName: 'Ananya Deshmukh',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    userRole: 'Co-op Society Member',
    text: 'Our developer is delaying the Deemed Conveyance of our society land in Pune. Can society members approach the District Deputy Registrar directly?',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    likes: 2,
    replies: [
      {
        id: 'rep_2',
        authorName: 'Home Drops Villa Legal Desk',
        authorRole: 'Official Administrator',
        isOfficialAdmin: true,
        text: 'Under MOFA Section 11, if the promoter fails to execute conveyance within 4 months of society formation, the managing committee can file Form 7 for Unilateral Deemed Conveyance directly before the competent authority (District Deputy Registrar).',
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
      }
    ]
  }
];
