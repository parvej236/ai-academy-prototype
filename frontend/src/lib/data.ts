/* ------------------------------------------------------------------
   Dummy data for the AI Academy front end. Everything here stands in
   for API responses until the backend exists. Shapes are kept close
   to what the API is expected to return (see docs/03-frontend.md).
------------------------------------------------------------------- */

export type Role = "student" | "mentor" | "admin";
export type PlanId = "none" | "monthly" | "professional" | "firm";
export type PublishState = "draft" | "review" | "scheduled" | "published" | "archived";

export interface Lesson {
  id: string;
  title: string;
  kind: "video" | "reading" | "quiz" | "lab";
  minutes: number;
  preview?: boolean;
}
export interface CourseModule {
  title: string;
  lessons: Lesson[];
}
export interface Course {
  slug: string;
  code: string;
  title: string;
  summary: string;
  category: string;
  level: "Foundation" | "Intermediate" | "Advanced";
  hours: number;
  rating: number;
  learners: number;
  instructor: string;
  instructorTitle: string;
  audience: string[];
  outcomes: string[];
  hue: number;
  status: PublishState;
  updated: string;
  modules: CourseModule[];
}

const L = (id: string, title: string, kind: Lesson["kind"], minutes: number, preview = false): Lesson => ({
  id,
  title,
  kind,
  minutes,
  preview,
});

export const courses: Course[] = [
  {
    slug: "hs-classification",
    code: "HS",
    title: "HS classification in practice",
    summary:
      "Classify goods the way an assessing officer will check them: the six General Interpretative Rules, section and chapter notes, and Bangladesh's 8-digit operative tariff.",
    category: "Classification",
    level: "Intermediate",
    hours: 14,
    rating: 4.8,
    learners: 3120,
    instructor: "Dr. Farhana Rahim",
    instructorTitle: "Former Joint Commissioner, Customs House Chattogram",
    audience: ["C&F Agents", "Importers", "Customs consultants"],
    outcomes: [
      "Apply GIR 1 to 6 in the correct order",
      "Read section, chapter and subheading notes without guessing",
      "Defend a classification during physical examination",
      "Spot classification risk before the Bill of Entry is lodged",
    ],
    hue: 190,
    status: "published",
    updated: "2026-11-12",
    modules: [
      {
        title: "How the Harmonized System is built",
        lessons: [
          L("hs-1", "Sections, chapters, headings and subheadings", "video", 18, true),
          L("hs-2", "Bangladesh operative tariff and the 8-digit code", "video", 22, true),
          L("hs-3", "Reading the legal notes", "reading", 12),
        ],
      },
      {
        title: "The General Interpretative Rules",
        lessons: [
          L("hs-4", "GIR 1: terms of headings come first", "video", 20),
          L("hs-5", "GIR 2(a) and 2(b): unassembled and mixed goods", "video", 26),
          L("hs-6", "GIR 3: when two headings fit", "video", 31),
          L("hs-7", "GIR 4 to 6 and subheading-level choices", "video", 24),
          L("hs-8", "Checkpoint: rules in order", "quiz", 15),
        ],
      },
      {
        title: "Classification under pressure",
        lessons: [
          L("hs-9", "Machines, parts and accessories (Chapters 84–85)", "video", 34),
          L("hs-10", "Textiles and made-ups (Section XI)", "video", 29),
          L("hs-11", "Lab: mis-declared laptop consignment", "lab", 40),
        ],
      },
    ],
  },
  {
    slug: "customs-valuation",
    code: "CV",
    title: "Customs valuation under the WTO agreement",
    summary:
      "Transaction value and the five fallback methods, worked through real invoice disputes, related-party sales and the Customs Valuation Rules 2000.",
    category: "Valuation",
    level: "Advanced",
    hours: 11,
    rating: 4.7,
    learners: 1874,
    instructor: "Md. Tanvir Hasan, FCMA",
    instructorTitle: "Trade compliance advisor, 18 years in valuation disputes",
    audience: ["Importers", "Tax practitioners", "Auditors"],
    outcomes: [
      "Build a transaction value with every required addition",
      "Know when an officer may reject the declared price",
      "Work through Methods 2 to 6 in sequence",
      "Prepare evidence for a valuation hearing",
    ],
    hue: 265,
    status: "published",
    updated: "2026-10-30",
    modules: [
      {
        title: "Transaction value",
        lessons: [
          L("cv-1", "What counts as the price actually paid", "video", 21, true),
          L("cv-2", "Additions: freight, insurance, royalties, assists", "video", 27),
          L("cv-3", "Related-party transactions", "video", 25),
        ],
      },
      {
        title: "When the declared value is rejected",
        lessons: [
          L("cv-4", "Grounds for doubt and the consultation process", "video", 19),
          L("cv-5", "Methods 2 and 3: identical and similar goods", "video", 23),
          L("cv-6", "Methods 4 to 6: deductive, computed, fallback", "video", 30),
          L("cv-7", "Lab: under-invoiced fabric consignment", "lab", 45),
        ],
      },
    ],
  },
  {
    slug: "asycuda-world",
    code: "AW",
    title: "ASYCUDA World: lodging a Bill of Entry",
    summary:
      "Field by field through the Bill of Entry, from manifest matching to assessment notice, with the errors that trigger amendment fees.",
    category: "Procedures",
    level: "Foundation",
    hours: 8,
    rating: 4.9,
    learners: 4410,
    instructor: "Shirin Akter",
    instructorTitle: "Licensed C&F Agent, Benapole and Dhaka ICD",
    audience: ["C&F Agents", "New importers", "Freight forwarders"],
    outcomes: [
      "Complete every box of the Bill of Entry",
      "Match against IGM and house BL correctly",
      "Read the assessment notice and payment slip",
      "Avoid the ten most common amendment triggers",
    ],
    hue: 160,
    status: "published",
    updated: "2026-11-18",
    modules: [
      {
        title: "Before you lodge",
        lessons: [
          L("aw-1", "User roles and digital signature", "video", 14, true),
          L("aw-2", "Manifest, IGM and rotation numbers", "video", 17),
        ],
      },
      {
        title: "The Bill of Entry, box by box",
        lessons: [
          L("aw-3", "General segment", "video", 22),
          L("aw-4", "Item segment and attached documents", "video", 26),
          L("aw-5", "Assessment, payment and release", "video", 18),
          L("aw-6", "Checkpoint: spot the error", "quiz", 12),
        ],
      },
    ],
  },
  {
    slug: "vat-sd-importers",
    code: "VT",
    title: "VAT and supplementary duty for importers",
    summary:
      "How import VAT, AT, AIT and supplementary duty stack on assessable value, and how to recover what you are entitled to under the VAT and SD Act 2012.",
    category: "Tax",
    level: "Intermediate",
    hours: 9,
    rating: 4.6,
    learners: 2290,
    instructor: "Nusrat Jahan, ACA",
    instructorTitle: "Partner, indirect tax practice",
    audience: ["Tax practitioners", "Importers", "Accountants"],
    outcomes: [
      "Calculate the full duty stack on any consignment",
      "Claim input tax on imported raw materials",
      "Handle AT adjustment in the monthly return",
      "Respond to a VAT audit query",
    ],
    hue: 320,
    status: "published",
    updated: "2026-09-21",
    modules: [
      {
        title: "The duty stack",
        lessons: [
          L("vt-1", "CD, RD, SD, VAT, AIT, AT in order", "video", 24, true),
          L("vt-2", "Worked example: 40 ft container of ceramics", "reading", 15),
        ],
      },
      {
        title: "Recovering tax",
        lessons: [
          L("vt-3", "Input tax credit on imports", "video", 22),
          L("vt-4", "AT adjustment in Mushak 9.1", "video", 19),
          L("vt-5", "Lab: VAT rebate claim review", "lab", 35),
        ],
      },
    ],
  },
  {
    slug: "rules-of-origin",
    code: "RO",
    title: "Rules of origin and preferential tariffs",
    summary:
      "SAFTA, APTA and GSP origin criteria, certificate checks and what happens when a preference claim is challenged.",
    category: "Origin",
    level: "Advanced",
    hours: 7,
    rating: 4.5,
    learners: 980,
    instructor: "Arif Chowdhury",
    instructorTitle: "Trade policy researcher",
    audience: ["Importers", "Exporters", "Customs consultants"],
    outcomes: [
      "Apply wholly obtained and substantial transformation tests",
      "Verify a certificate of origin",
      "Calculate regional value content",
    ],
    hue: 35,
    status: "review",
    updated: "2026-11-22",
    modules: [
      {
        title: "Origin basics",
        lessons: [
          L("ro-1", "Why origin matters at the border", "video", 16, true),
          L("ro-2", "Change in tariff heading vs value content", "video", 28),
          L("ro-3", "Lab: SAFTA claim on yarn", "lab", 30),
        ],
      },
    ],
  },
  {
    slug: "lc-trade-finance",
    code: "LC",
    title: "Letters of credit and trade documents",
    summary:
      "UCP 600 for the people who actually handle the papers: LC terms, discrepancies, and how bank documents line up with customs documents.",
    category: "Trade finance",
    level: "Foundation",
    hours: 6,
    rating: 4.7,
    learners: 1650,
    instructor: "Kamrul Islam",
    instructorTitle: "Former trade services head, private commercial bank",
    audience: ["Importers", "Bankers", "Freight forwarders"],
    outcomes: ["Read an LC line by line", "Catch discrepancies before presentation", "Align LCAF, invoice and BL"],
    hue: 215,
    status: "published",
    updated: "2026-08-14",
    modules: [
      {
        title: "Working with LCs",
        lessons: [
          L("lc-1", "Parties, types and the LCAF", "video", 18, true),
          L("lc-2", "Document checklist under UCP 600", "video", 24),
          L("lc-3", "Checkpoint: find the discrepancy", "quiz", 10),
        ],
      },
    ],
  },
  {
    slug: "cf-licensing-prep",
    code: "CF",
    title: "C&F agent licensing exam preparation",
    summary:
      "Structured revision for the Customs Agent Licensing examination: Customs Act 1969, procedures, tariff and viva practice with past-style questions.",
    category: "Exam prep",
    level: "Intermediate",
    hours: 20,
    rating: 4.8,
    learners: 2730,
    instructor: "Panel of examiners",
    instructorTitle: "Four former customs officials",
    audience: ["Aspiring C&F Agents"],
    outcomes: ["Cover the full written syllabus", "Sit three timed mock papers", "Practise the viva with the AI examiner"],
    hue: 250,
    status: "published",
    updated: "2026-11-02",
    modules: [
      {
        title: "Customs Act 1969",
        lessons: [
          L("cf-1", "Key sections every agent is asked about", "video", 35, true),
          L("cf-2", "Offences and penalties (Section 156)", "video", 28),
        ],
      },
      {
        title: "Mock papers",
        lessons: [
          L("cf-3", "Mock paper 1", "quiz", 90),
          L("cf-4", "Viva practice with the examiner agent", "lab", 25),
        ],
      },
    ],
  },
  {
    slug: "bonded-warehouse",
    code: "BW",
    title: "Bonded warehouse and export incentives",
    summary: "Bond licensing, entitlement, UD and UP, and duty drawback for export-oriented factories.",
    category: "Procedures",
    level: "Advanced",
    hours: 10,
    rating: 4.4,
    learners: 640,
    instructor: "Mahbubul Alam",
    instructorTitle: "Bond commissionerate consultant",
    audience: ["Exporters", "Factory compliance teams"],
    outcomes: ["Maintain bond registers correctly", "Calculate entitlement", "Prepare for a bond audit"],
    hue: 290,
    status: "draft",
    updated: "2026-11-24",
    modules: [
      {
        title: "Bond basics",
        lessons: [
          L("bw-1", "Licence types and conditions", "video", 20, true),
          L("bw-2", "UD, UP and entitlement", "video", 27),
        ],
      },
    ],
  },
];

export const categories = ["All", "Classification", "Valuation", "Procedures", "Tax", "Origin", "Trade finance", "Exam prep"];

export const getCourse = (slug: string) => courses.find((c) => c.slug === slug);
export const lessonCount = (c: Course) => c.modules.reduce((n, m) => n + m.lessons.length, 0);

/* ------------------------------------------------------------------
   Practical lab — cases run by the Simulator Agent
------------------------------------------------------------------- */
export interface CaseDoc {
  name: string;
  rows: [string, string][];
}
export interface CaseStep {
  officer: string;
  prompt: string;
  options: { text: string; score: number; feedback: string }[];
  criterion: string;
}
export interface LabCase {
  id: string;
  title: string;
  brief: string;
  port: string;
  course: string;
  difficulty: "Easy" | "Medium" | "Hard";
  minutes: number;
  attempts: number;
  avgScore: number;
  criteria: { name: string; weight: number }[];
  docs: CaseDoc[];
  steps: CaseStep[];
  status: PublishState;
}

export const labCases: LabCase[] = [
  {
    id: "laptops-ctg",
    title: "Mis-declared laptop consignment",
    brief:
      "A consignment of 400 units declared as 'parts of computers' under 8473.30.00 arrives at Chattogram. The examining officer opens two cartons and finds complete laptops without batteries. You are the C&F agent. Respond to the assessing officer.",
    port: "Chattogram Custom House",
    course: "hs-classification",
    difficulty: "Medium",
    minutes: 25,
    attempts: 1284,
    avgScore: 68,
    status: "published",
    criteria: [
      { name: "Classification reasoning", weight: 40 },
      { name: "Legal basis cited", weight: 25 },
      { name: "Risk handling", weight: 20 },
      { name: "Professional conduct", weight: 15 },
    ],
    docs: [
      {
        name: "Commercial invoice",
        rows: [
          ["Invoice no.", "SZX-24-1187"],
          ["Seller", "Shenzhen Brightway Electronics Co."],
          ["Description", "Computer parts, model BW-14"],
          ["Quantity", "400 pcs"],
          ["Unit price", "USD 118.00 FOB"],
          ["Total", "USD 47,200.00"],
          ["Declared HS", "8473.30.00"],
        ],
      },
      {
        name: "Packing list",
        rows: [
          ["Cartons", "40 (10 pcs each)"],
          ["Gross weight", "1,180 kg"],
          ["Net weight", "920 kg"],
          ["Marks", "BW-14 / MADE IN CHINA"],
        ],
      },
      {
        name: "Examination report",
        rows: [
          ["Cartons opened", "2 of 40"],
          ["Finding", "Complete portable computers, screen, keyboard, mainboard fitted"],
          ["Battery", "Not present"],
          ["Officer note", "Goods appear to be laptops, not parts"],
        ],
      },
    ],
    steps: [
      {
        officer: "Assistant Commissioner (Assessment)",
        criterion: "Classification reasoning",
        prompt:
          "Your client declared these as parts under 8473.30. Our examiner found complete machines with no battery. What heading do you say applies, and why?",
        options: [
          {
            text: "8471.30 — under GIR 2(a), an incomplete article with the essential character of the finished machine is classified as the finished machine. A missing battery does not remove that character.",
            score: 100,
            feedback: "Correct rule, correct heading, and you named the essential character test.",
          },
          {
            text: "8473.30 is still right, because without a battery the unit cannot operate.",
            score: 20,
            feedback: "Operability is not the test. GIR 2(a) looks at essential character, which these units clearly have.",
          },
          {
            text: "8471.30, because the officer has already decided so.",
            score: 45,
            feedback: "Right heading, but you gave no legal reasoning. An officer expects GIR 2(a).",
          },
        ],
      },
      {
        officer: "Assistant Commissioner (Assessment)",
        criterion: "Legal basis cited",
        prompt: "The duty difference is significant. Under which provision could we treat this as a mis-declaration?",
        options: [
          {
            text: "Section 32 of the Customs Act 1969 covers untrue statements; penalty would follow under Section 156(1)(14).",
            score: 100,
            feedback: "Accurate. You cited the declaration offence and the penalty clause.",
          },
          {
            text: "This is a valuation issue under Section 25.",
            score: 25,
            feedback: "Section 25 deals with value. The issue here is the description and heading.",
          },
          {
            text: "I am not sure which section applies.",
            score: 10,
            feedback: "You should know Sections 32 and 156 before handling assessments.",
          },
        ],
      },
      {
        officer: "Assistant Commissioner (Assessment)",
        criterion: "Risk handling",
        prompt: "How do you propose to proceed so your client can get the goods released?",
        options: [
          {
            text: "Request amendment of the Bill of Entry to 8471.30, pay the differential duty, and ask that the penalty consider voluntary correction before final assessment.",
            score: 95,
            feedback: "Practical and compliant. Asking for mitigation is reasonable.",
          },
          {
            text: "Ask for the goods to be re-examined by a different officer.",
            score: 35,
            feedback: "Re-examination is allowed but unlikely to change the finding and delays release.",
          },
          {
            text: "Abandon the goods under Section 82.",
            score: 15,
            feedback: "Far too drastic for a correctable classification error.",
          },
        ],
      },
    ],
  },
  {
    id: "fabric-valuation",
    title: "Under-invoiced fabric consignment",
    brief:
      "A woven polyester fabric shipment is declared at USD 0.62/m. The valuation database shows recent clearances at USD 1.10–1.25/m for the same origin and specification. The officer intends to reject the transaction value.",
    port: "Dhaka ICD, Kamalapur",
    course: "customs-valuation",
    difficulty: "Hard",
    minutes: 35,
    attempts: 702,
    avgScore: 61,
    status: "published",
    criteria: [
      { name: "Valuation method", weight: 40 },
      { name: "Evidence", weight: 30 },
      { name: "Procedure", weight: 30 },
    ],
    docs: [
      {
        name: "Commercial invoice",
        rows: [
          ["Description", "100% polyester woven fabric, 150 gsm"],
          ["Quantity", "48,000 m"],
          ["Unit price", "USD 0.62 CFR"],
          ["Origin", "China"],
        ],
      },
      {
        name: "Valuation database extract",
        rows: [
          ["Comparable 1", "USD 1.10/m, Aug 2026"],
          ["Comparable 2", "USD 1.18/m, Sep 2026"],
          ["Comparable 3", "USD 1.25/m, Oct 2026"],
        ],
      },
    ],
    steps: [
      {
        officer: "Deputy Commissioner (Valuation)",
        criterion: "Valuation method",
        prompt: "We doubt the declared price. What must happen before we move away from transaction value?",
        options: [
          {
            text: "You must give written grounds for doubt and allow the importer to provide further evidence. Only then may you proceed to Method 2.",
            score: 100,
            feedback: "Correct. The consultation step is mandatory.",
          },
          {
            text: "You can use the database average immediately.",
            score: 15,
            feedback: "Database prices are not themselves a valuation method.",
          },
        ],
      },
      {
        officer: "Deputy Commissioner (Valuation)",
        criterion: "Evidence",
        prompt: "What evidence would support your client's price?",
        options: [
          {
            text: "The sales contract, LC and bank remittance records, the seller's price list, and proof that this was end-of-season clearance stock.",
            score: 100,
            feedback: "Strong evidence set tied to the actual payment.",
          },
          {
            text: "A letter from the importer confirming the price.",
            score: 30,
            feedback: "Self-declarations carry little weight on their own.",
          },
        ],
      },
    ],
  },
  {
    id: "safta-yarn",
    title: "SAFTA preference claim on cotton yarn",
    brief:
      "An importer claims SAFTA preferential duty on cotton yarn from India. The certificate of origin lists a different exporter from the invoice.",
    port: "Benapole Custom House",
    course: "rules-of-origin",
    difficulty: "Easy",
    minutes: 15,
    attempts: 311,
    avgScore: 74,
    status: "draft",
    criteria: [
      { name: "Origin criteria", weight: 50 },
      { name: "Document check", weight: 50 },
    ],
    docs: [
      {
        name: "Certificate of origin",
        rows: [
          ["Exporter", "Coimbatore Spinners Pvt Ltd"],
          ["Criterion", "Wholly obtained"],
        ],
      },
      { name: "Invoice", rows: [["Seller", "Tirupur Trade Links"]] },
    ],
    steps: [
      {
        officer: "Revenue Officer",
        criterion: "Document check",
        prompt: "The exporter on the certificate differs from the seller on the invoice. Is the claim valid?",
        options: [
          {
            text: "Third-party invoicing is allowed under SAFTA if declared on the certificate. It isn't here, so verification should be requested.",
            score: 100,
            feedback: "Right. Undeclared third-party invoicing is a verification trigger.",
          },
          { text: "Yes, any mismatch is fine.", score: 10, feedback: "Mismatches must be explained." },
        ],
      },
    ],
  },
];
export const getCase = (id: string) => labCases.find((c) => c.id === id);

/* ------------------------------------------------------------------
   Assessment & examination
------------------------------------------------------------------- */
export interface Question {
  id: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  text: string;
  options: string[];
  answer: number;
  explanation: string;
}

export const questionBank: Question[] = [
  {
    id: "q1",
    topic: "Classification",
    difficulty: "Easy",
    text: "Which General Interpretative Rule must always be applied first?",
    options: ["GIR 3(a)", "GIR 1", "GIR 2(b)", "GIR 6"],
    answer: 1,
    explanation: "GIR 1 makes the terms of headings and the legal notes the primary basis for classification.",
  },
  {
    id: "q2",
    topic: "Classification",
    difficulty: "Medium",
    text: "An unassembled bicycle shipped in one consignment is classified as:",
    options: ["Parts of bicycles", "Complete bicycle under GIR 2(a)", "Under GIR 4, most similar goods", "Each part separately"],
    answer: 1,
    explanation: "GIR 2(a) extends a heading to articles presented unassembled or disassembled.",
  },
  {
    id: "q3",
    topic: "Valuation",
    difficulty: "Medium",
    text: "The primary basis of customs value under the WTO Valuation Agreement is:",
    options: ["Deductive value", "Computed value", "Transaction value", "Fallback value"],
    answer: 2,
    explanation: "Article 1 transaction value is the primary method; others apply in sequence only if it cannot be used.",
  },
  {
    id: "q4",
    topic: "Valuation",
    difficulty: "Hard",
    text: "Which of these must be added to the price paid when building transaction value?",
    options: ["Buying commission", "Post-import assembly cost", "Royalties paid as a condition of sale", "Import duties in Bangladesh"],
    answer: 2,
    explanation: "Royalties and licence fees paid as a condition of sale are an Article 8 addition.",
  },
  {
    id: "q5",
    topic: "Customs Act",
    difficulty: "Medium",
    text: "Under the Customs Act 1969, which section deals with untrue statements and errors?",
    options: ["Section 25", "Section 32", "Section 79", "Section 82"],
    answer: 1,
    explanation: "Section 32 covers untrue statements, errors and related recovery.",
  },
  {
    id: "q6",
    topic: "Tax",
    difficulty: "Medium",
    text: "Import VAT in Bangladesh is calculated on:",
    options: ["CIF value only", "Assessable value plus CD, RD and SD", "FOB value", "Invoice value minus freight"],
    answer: 1,
    explanation: "VAT is charged on assessable value plus customs duty, regulatory duty and supplementary duty.",
  },
  {
    id: "q7",
    topic: "Procedures",
    difficulty: "Easy",
    text: "In ASYCUDA World, the Bill of Entry is matched against which carrier document?",
    options: ["LCAF", "IGM", "Mushak 6.3", "Packing list"],
    answer: 1,
    explanation: "The Import General Manifest (IGM) line is the reference the declaration is matched to.",
  },
  {
    id: "q8",
    topic: "Origin",
    difficulty: "Medium",
    text: "Under SAFTA, the general regional value content requirement for LDC members is:",
    options: ["20%", "30%", "40%", "60%"],
    answer: 1,
    explanation: "LDC members such as Bangladesh have a 30% domestic value content requirement.",
  },
  {
    id: "q9",
    topic: "Procedures",
    difficulty: "Hard",
    text: "Goods not cleared within the allowed period may be auctioned under:",
    options: ["Section 82", "Section 156", "Section 201", "Section 19"],
    answer: 0,
    explanation: "Section 82 covers goods not cleared within the time limit.",
  },
  {
    id: "q10",
    topic: "Tax",
    difficulty: "Hard",
    text: "Advance Tax (AT) paid at import stage is adjusted through:",
    options: ["Bill of Entry amendment", "Monthly VAT return", "Annual income tax return only", "It cannot be adjusted"],
    answer: 1,
    explanation: "AT is adjusted in the monthly VAT return (Mushak 9.1) under prescribed conditions.",
  },
  {
    id: "q11",
    topic: "Classification",
    difficulty: "Medium",
    text: "GIR 3(b) 'essential character' is used for which kind of goods?",
    options: ["Unassembled machines", "Mixtures, composite goods and retail sets", "Parts and accessories", "Goods in containers"],
    answer: 1,
    explanation: "GIR 3(b) classifies mixtures, composite goods and sets put up for retail sale by the component giving essential character.",
  },
  {
    id: "q12",
    topic: "Classification",
    difficulty: "Easy",
    text: "How many digits does the Bangladesh operative tariff use for an H.S. code line?",
    options: ["6", "8", "10", "12"],
    answer: 1,
    explanation: "Bangladesh adds two national digits to the six-digit international HS code.",
  },
  {
    id: "q13",
    topic: "Classification",
    difficulty: "Easy",
    text: "Which HS chapter is reserved and not used?",
    options: ["Chapter 77", "Chapter 98", "Chapter 50", "Chapter 1"],
    answer: 0,
    explanation: "Chapter 77 is reserved for possible future use.",
  },
  {
    id: "q14",
    topic: "Classification",
    difficulty: "Medium",
    text: "Which rule governs classification at subheading level?",
    options: ["GIR 1", "GIR 4", "GIR 5", "GIR 6"],
    answer: 3,
    explanation: "GIR 6 applies the earlier rules, mutatis mutandis, at subheading level.",
  },
  {
    id: "q15",
    topic: "Valuation",
    difficulty: "Medium",
    text: "How is a buying commission treated in customs value?",
    options: ["Added to the price", "Not added", "Added at 50%", "Deducted from freight"],
    answer: 1,
    explanation: "Buying commissions are excluded; only selling commissions and brokerage are added.",
  },
  {
    id: "q16",
    topic: "Valuation",
    difficulty: "Medium",
    text: "Before rejecting a declared value, customs must:",
    options: ["Use the database price", "Give reasons and let the importer justify the price", "Increase it by 10%", "Refer to the NBR chairman"],
    answer: 1,
    explanation: "The importer must be told the grounds for doubt and given a chance to provide evidence.",
  },
  {
    id: "q17",
    topic: "Valuation",
    difficulty: "Hard",
    text: "A related-party price can still be accepted as transaction value when:",
    options: ["The parties sign a declaration", "The relationship did not influence the price", "Payment is by LC", "The goods are for re-export"],
    answer: 1,
    explanation: "Relationship alone is not grounds for rejection if it did not influence the price.",
  },
  {
    id: "q18",
    topic: "Valuation",
    difficulty: "Medium",
    text: "Which method comes after transaction value of similar goods?",
    options: ["Computed value", "Deductive value", "Fallback method", "Identical goods"],
    answer: 1,
    explanation: "Order: transaction value, identical goods, similar goods, deductive, computed, fallback.",
  },
  {
    id: "q19",
    topic: "Valuation",
    difficulty: "Hard",
    text: "The buyer supplies moulds free of charge to the overseas manufacturer. These are:",
    options: ["Ignored", "An assist, added to customs value", "Deducted from value", "Valued separately under Method 6"],
    answer: 1,
    explanation: "Moulds, dies and tools supplied free are assists and are apportioned into the value.",
  },
  {
    id: "q20",
    topic: "Valuation",
    difficulty: "Easy",
    text: "Bangladesh customs value includes freight and insurance up to:",
    options: ["The factory gate", "The port of export", "The port or place of importation", "The importer's warehouse"],
    answer: 2,
    explanation: "Value is determined on a CIF basis up to the place of importation.",
  },
  {
    id: "q21",
    topic: "Customs Act",
    difficulty: "Medium",
    text: "Provisional assessment of duty is provided for under:",
    options: ["Section 79", "Section 80", "Section 81", "Section 83"],
    answer: 2,
    explanation: "Section 81 allows provisional assessment pending further inquiry.",
  },
  {
    id: "q22",
    topic: "Customs Act",
    difficulty: "Easy",
    text: "Offences and the penalties for them are listed mainly in:",
    options: ["Section 156", "Section 2", "Section 18", "Section 30"],
    answer: 0,
    explanation: "Section 156 tabulates offences and penalties.",
  },
  {
    id: "q23",
    topic: "Customs Act",
    difficulty: "Medium",
    text: "Customs duty is levied on imported goods under:",
    options: ["Section 18", "Section 25", "Section 32", "Section 156"],
    answer: 0,
    explanation: "Section 18 is the charging section for customs duty.",
  },
  {
    id: "q24",
    topic: "Procedures",
    difficulty: "Medium",
    text: "Findings from a physical examination are recorded in:",
    options: ["The IGM", "The examination report", "The LCAF", "Mushak 6.3"],
    answer: 1,
    explanation: "The examining officer records findings in the examination report used for assessment.",
  },
  {
    id: "q25",
    topic: "Procedures",
    difficulty: "Easy",
    text: "After assessment, goods are released once:",
    options: ["The IGM is filed", "Duties and taxes are paid and the release order is issued", "The LC is opened", "The importer signs the packing list"],
    answer: 1,
    explanation: "Payment and the release order come before goods leave customs control.",
  },
  {
    id: "q26",
    topic: "Origin",
    difficulty: "Easy",
    text: "Which of these is 'wholly obtained' in the exporting country?",
    options: ["Garments sewn from imported fabric", "Minerals extracted from its soil", "Phones assembled from imported parts", "Re-packed tea"],
    answer: 1,
    explanation: "Minerals extracted in the country are wholly obtained.",
  },
  {
    id: "q27",
    topic: "Origin",
    difficulty: "Medium",
    text: "In origin rules, 'CTH' means:",
    options: ["Customs tariff heading", "Change in tariff heading", "Certified trade history", "Common transit holding"],
    answer: 1,
    explanation: "Change in tariff heading: the finished good must fall in a different heading from its non-originating inputs.",
  },
  {
    id: "q28",
    topic: "Origin",
    difficulty: "Hard",
    text: "A SAFTA preference claim should be sent for verification when:",
    options: ["The invoice is in USD", "The certificate's exporter differs from the seller and third-party invoicing isn't declared", "Goods arrive by road", "The certificate is printed in colour"],
    answer: 1,
    explanation: "Undeclared third-party invoicing is a standard verification trigger.",
  },
];

export interface Exam {
  id: string;
  title: string;
  kind: "Quiz" | "Mock exam" | "Final exam" | "Case study" | "Viva";
  course: string;
  questions: number;
  minutes: number;
  passMark: number;
  attemptsAllowed: number;
  due?: string;
  status: PublishState;
  grading: "Auto" | "AI + review" | "Manual";
  /** topics the Examiner Agent draws from */
  topics: string[];
}

export const exams: Exam[] = [
  { id: "gir-check", title: "GIR checkpoint", kind: "Quiz", course: "hs-classification", questions: 5, minutes: 8, passMark: 60, attemptsAllowed: 3, status: "published", grading: "Auto", topics: ["Classification"] },
  { id: "mock-1", title: "Licensing mock paper 1", kind: "Mock exam", course: "cf-licensing-prep", questions: 12, minutes: 24, passMark: 65, attemptsAllowed: 2, due: "2026-12-04", status: "published", grading: "Auto", topics: ["Customs Act", "Procedures", "Classification", "Valuation", "Tax", "Origin"] },
  { id: "valuation-final", title: "Valuation final exam", kind: "Final exam", course: "customs-valuation", questions: 8, minutes: 15, passMark: 70, attemptsAllowed: 1, due: "2026-12-12", status: "published", grading: "AI + review", topics: ["Valuation"] },
  { id: "case-ceramics", title: "Duty stack case study: ceramics", kind: "Case study", course: "vat-sd-importers", questions: 6, minutes: 30, passMark: 60, attemptsAllowed: 2, status: "published", grading: "AI + review", topics: ["Tax"] },
  { id: "viva-board", title: "Licensing viva board", kind: "Viva", course: "cf-licensing-prep", questions: 6, minutes: 15, passMark: 60, attemptsAllowed: 2, due: "2026-12-18", status: "scheduled", grading: "AI + review", topics: ["Customs Act", "Procedures"] },
  { id: "origin-quiz", title: "Origin basics quiz", kind: "Quiz", course: "rules-of-origin", questions: 4, minutes: 8, passMark: 60, attemptsAllowed: 3, status: "draft", grading: "Auto", topics: ["Origin"] },
];
export const getExam = (id: string) => exams.find((e) => e.id === id);

/* Case-study exams: a scenario plus questions written for it.
   Rates are set for the exercise and are not current tariff rates. */
export const caseStudies: Record<string, { brief: string; facts: [string, string][]; questions: Question[] }> = {
  "case-ceramics": {
    brief:
      "Meghna Tiles Ltd imports one 40 ft container of glazed ceramic floor tiles from China through Chattogram. Work out each tax in the duty stack using the rates given for this exercise.",
    facts: [
      ["Assessable value (CIF + landing)", "৳30,00,000"],
      ["Customs duty (CD)", "25% of AV"],
      ["Regulatory duty (RD)", "3% of AV"],
      ["Supplementary duty (SD)", "45%"],
      ["VAT", "15%"],
      ["Advance income tax (AIT)", "5% of AV"],
      ["Advance tax (AT)", "5%"],
    ],
    questions: [
      { id: "cs1", topic: "Tax", difficulty: "Easy", text: "How much customs duty is payable?", options: ["৳6,00,000", "৳7,50,000", "৳7,95,000", "৳9,00,000"], answer: 1, explanation: "25% × ৳30,00,000 = ৳7,50,000." },
      { id: "cs2", topic: "Tax", difficulty: "Medium", text: "On what base is supplementary duty charged?", options: ["AV only", "AV + CD", "AV + CD + RD", "AV + CD + RD + VAT"], answer: 2, explanation: "SD is charged on assessable value plus CD and RD." },
      { id: "cs3", topic: "Tax", difficulty: "Medium", text: "How much supplementary duty is payable?", options: ["৳13,50,000", "৳16,87,500", "৳17,28,000", "৳18,00,000"], answer: 2, explanation: "45% × (30,00,000 + 7,50,000 + 90,000) = 45% × 38,40,000 = ৳17,28,000." },
      { id: "cs4", topic: "Tax", difficulty: "Hard", text: "How much VAT is payable at import?", options: ["৳4,50,000", "৳5,76,000", "৳7,94,700", "৳8,35,200"], answer: 3, explanation: "15% × (38,40,000 + 17,28,000) = 15% × 55,68,000 = ৳8,35,200." },
      { id: "cs5", topic: "Tax", difficulty: "Easy", text: "How much AIT is collected?", options: ["৳1,50,000", "৳1,92,000", "৳2,78,400", "৳3,00,000"], answer: 0, explanation: "AIT here is 5% of assessable value: ৳1,50,000." },
      { id: "cs6", topic: "Tax", difficulty: "Hard", text: "What is the total payable at the port? (AT is 5% of AV + CD + RD + SD.)", options: ["৳34,03,200", "৳35,53,200", "৳38,31,600", "৳40,10,000"], answer: 2, explanation: "CD 7,50,000 + RD 90,000 + SD 17,28,000 + VAT 8,35,200 + AIT 1,50,000 + AT 2,78,400 = ৳38,31,600." },
    ],
  },
};


export const vivaQuestions = [
  "Walk me through what you check on a Bill of Entry before you submit it.",
  "An importer's goods have been held for physical examination. What are your client's rights?",
  "Explain the difference between regulatory duty and supplementary duty.",
  "When can goods be cleared on a provisional assessment?",
  "What would you do if you discover a mis-declaration after release?",
  "How is a C&F agent's licence suspended, and on what grounds?",
];

/* ------------------------------------------------------------------
   Performance, skills, learning path (student dashboard)
------------------------------------------------------------------- */
export const skills = [
  { name: "Classification", score: 82, cohort: 71 },
  { name: "Valuation", score: 54, cohort: 63 },
  { name: "Procedures", score: 88, cohort: 76 },
  { name: "VAT & SD", score: 61, cohort: 58 },
  { name: "Origin", score: 42, cohort: 55 },
  { name: "Customs Act", score: 73, cohort: 66 },
];

export const weeklyActivity = [
  { week: "W38", hours: 3.2, score: 58 },
  { week: "W39", hours: 4.1, score: 61 },
  { week: "W40", hours: 2.4, score: 60 },
  { week: "W41", hours: 5.6, score: 66 },
  { week: "W42", hours: 4.8, score: 69 },
  { week: "W43", hours: 6.2, score: 71 },
  { week: "W44", hours: 3.9, score: 70 },
  { week: "W45", hours: 6.8, score: 75 },
  { week: "W46", hours: 7.1, score: 78 },
];

export const learningPath = [
  { title: "ASYCUDA World: lodging a Bill of Entry", href: "/app/learn/asycuda-world", state: "done" as const, reason: "Completed with 91%" },
  { title: "HS classification in practice", href: "/app/learn/hs-classification", state: "current" as const, reason: "64% complete" },
  { title: "Valuation: related-party transactions", href: "/app/learn/customs-valuation", state: "next" as const, reason: "Valuation is 9 points below your cohort" },
  { title: "Lab: under-invoiced fabric consignment", href: "/app/lab/fabric-valuation", state: "next" as const, reason: "Practise the consultation step you missed" },
  { title: "Rules of origin (preview lessons)", href: "/courses/rules-of-origin", state: "next" as const, reason: "Origin is your weakest area" },
  { title: "Licensing mock paper 1", href: "/app/exams/mock-1", state: "later" as const, reason: "Opens 4 Dec, after the valuation module" },
];

export const recentResults = [
  { title: "GIR checkpoint", kind: "Quiz", score: 80, date: "2026-11-21" },
  { title: "Mis-declared laptop consignment", kind: "Lab", score: 72, date: "2026-11-19" },
  { title: "ASYCUDA spot the error", kind: "Quiz", score: 91, date: "2026-11-14" },
  { title: "Viva practice round 2", kind: "Viva", score: 64, date: "2026-11-10" },
];

/* ------------------------------------------------------------------
   Live classes
------------------------------------------------------------------- */
export interface LiveClass {
  id: string;
  title: string;
  expert: string;
  expertTitle: string;
  start: string; // ISO
  minutes: number;
  course: string;
  status: "scheduled" | "live" | "recorded";
  registered: number;
  notes?: string[];
  transcript?: { t: string; who: string; text: string }[];
  slides?: { title: string; points: string[] }[];
}

export const liveClasses: LiveClass[] = [
  {
    id: "budget-2026",
    title: "What the FY27 budget changed at the border",
    expert: "Dr. Farhana Rahim",
    expertTitle: "Former Joint Commissioner of Customs",
    start: "2026-11-26T15:00:00+06:00",
    minutes: 60,
    course: "vat-sd-importers",
    status: "live",
    registered: 812,
  },
  {
    id: "valuation-clinic",
    title: "Valuation clinic: bring your rejected invoices",
    expert: "Md. Tanvir Hasan, FCMA",
    expertTitle: "Trade compliance advisor",
    start: "2026-11-29T19:30:00+06:00",
    minutes: 75,
    course: "customs-valuation",
    status: "scheduled",
    registered: 436,
  },
  {
    id: "asycuda-update",
    title: "ASYCUDA World release 4.3: what agents need to redo",
    expert: "Shirin Akter",
    expertTitle: "Licensed C&F Agent",
    start: "2026-12-03T20:00:00+06:00",
    minutes: 45,
    course: "asycuda-world",
    status: "scheduled",
    registered: 1204,
  },
  {
    id: "bond-audit",
    title: "Surviving a bond audit",
    expert: "Mahbubul Alam",
    expertTitle: "Bond commissionerate consultant",
    start: "2026-12-07T18:00:00+06:00",
    minutes: 60,
    course: "bonded-warehouse",
    status: "scheduled",
    registered: 198,
  },
  {
    id: "gir3-deep",
    title: "GIR 3 in disputed cases",
    expert: "Dr. Farhana Rahim",
    expertTitle: "Former Joint Commissioner of Customs",
    start: "2026-11-15T19:00:00+06:00",
    minutes: 70,
    course: "hs-classification",
    status: "recorded",
    registered: 950,
    notes: [
      "GIR 3 only applies once GIR 1 and 2 cannot resolve the heading. Officers will reject a GIR 3 argument that skips that step.",
      "3(a) most specific description: a heading naming the article beats one naming a class of articles.",
      "3(b) essential character: for sets put up for retail sale, look at the component that gives the set its use, not just the most expensive one.",
      "3(c) last in numerical order: use only after 3(a) and 3(b) fail. It is rarely the right answer in a dispute.",
      "Case discussed: a gift set of a mug and coffee sachets. Essential character went to the coffee, heading 2101.",
    ],
    transcript: [
      { t: "00:02", who: "Dr. Rahim", text: "Let's start with the question I get most: when am I allowed to use GIR 3?" },
      { t: "00:41", who: "Dr. Rahim", text: "Only when goods are prima facie classifiable under two or more headings after GIR 1 and 2." },
      { t: "03:15", who: "Participant", text: "So if the chapter note settles it, GIR 3 never comes in?" },
      { t: "03:22", who: "Dr. Rahim", text: "Exactly. The notes are part of GIR 1. If the note decides it, you stop there." },
      { t: "11:40", who: "Dr. Rahim", text: "Now, essential character. This is where most disputes are fought." },
      { t: "24:05", who: "Dr. Rahim", text: "Here's the gift set. A ceramic mug and twenty coffee sachets, sold together." },
    ],
    slides: [
      { title: "When GIR 3 applies", points: ["After GIR 1 and 2 fail", "Goods fit two or more headings", "Apply 3(a), then 3(b), then 3(c)"] },
      { title: "Most specific description", points: ["Named article beats class of articles", "Compare at heading level only"] },
      { title: "Essential character", points: ["Bulk, quantity, weight, value", "Role in the use of the goods", "Retail sets: what is the set for?"] },
      { title: "Case: mug and coffee gift set", points: ["Mug: 6912", "Coffee: 2101", "Outcome: 2101, coffee gives the set its purpose"] },
    ],
  },
  {
    id: "lc-discrepancy",
    title: "Ten LC discrepancies banks keep rejecting",
    expert: "Kamrul Islam",
    expertTitle: "Former trade services head",
    start: "2026-11-08T19:00:00+06:00",
    minutes: 55,
    course: "lc-trade-finance",
    status: "recorded",
    registered: 610,
    notes: [
      "Late presentation is still the most common discrepancy: 21 days after shipment unless the LC says otherwise.",
      "Description on the invoice must correspond with the LC; other documents may use general terms.",
      "Insurance must be effective no later than the shipment date.",
    ],
    transcript: [
      { t: "00:05", who: "Kamrul Islam", text: "Number one on the list, every single year, is late presentation." },
      { t: "06:30", who: "Kamrul Islam", text: "Invoice description is the strict one. Other documents can be general." },
    ],
    slides: [{ title: "Top discrepancies", points: ["Late presentation", "Invoice description mismatch", "Insurance dated after shipment"] }],
  },
];
export const getLive = (id: string) => liveClasses.find((l) => l.id === id);

/* ------------------------------------------------------------------
   Community
------------------------------------------------------------------- */
export interface ForumGroup {
  id: string;
  name: string;
  description: string;
  members: number;
  hue: number;
  moderators: string[];
}
export const forumGroups: ForumGroup[] = [
  { id: "importers", name: "Importers", description: "LCs, duty planning, port delays and supplier documents.", members: 2840, hue: 190, moderators: ["Kamrul Islam"] },
  { id: "cf-agents", name: "C&F Agents", description: "Assessment, examination, ASYCUDA issues and licensing.", members: 3615, hue: 160, moderators: ["Shirin Akter"] },
  { id: "tax", name: "Tax Practitioners", description: "VAT, SD, AIT and audit responses.", members: 1490, hue: 320, moderators: ["Nusrat Jahan, ACA"] },
  { id: "forwarders", name: "Freight Forwarders", description: "House BLs, consolidation, and carrier manifests.", members: 920, hue: 35, moderators: ["Arif Chowdhury"] },
  { id: "exporters", name: "Exporters & Bond", description: "Bond licences, UD/UP, drawback and export incentives.", members: 1105, hue: 265, moderators: ["Mahbubul Alam"] },
];

export interface ForumReply {
  id: string;
  author: string;
  role: string;
  body: string;
  at: string;
  votes: number;
  accepted?: boolean;
}
export interface ForumThread {
  id: string;
  group: string;
  title: string;
  body: string;
  author: string;
  role: string;
  at: string;
  tags: string[];
  votes: number;
  views: number;
  pinned?: boolean;
  flagged?: boolean;
  replies: ForumReply[];
}

export const forumThreads: ForumThread[] = [
  {
    id: "t1",
    group: "cf-agents",
    title: "Officer wants 8471.30 for laptops without batteries. Is there any argument for 8473?",
    body: "Client imported 400 units, no batteries fitted. Examiner calls them complete laptops. Has anyone succeeded arguing 8473.30 in a case like this?",
    author: "Rafiqul Islam",
    role: "C&F Agent",
    at: "2026-11-24T10:20:00+06:00",
    tags: ["HS", "Chattogram"],
    votes: 34,
    views: 612,
    pinned: true,
    replies: [
      {
        id: "r1",
        author: "Shirin Akter",
        role: "Moderator",
        body: "Honestly, no. GIR 2(a) is clear: if the incomplete article has the essential character of the complete one, it goes to the complete heading. Advise your client to amend and ask for mitigation.",
        at: "2026-11-24T11:02:00+06:00",
        votes: 41,
        accepted: true,
      },
      {
        id: "r2",
        author: "Habib Ullah",
        role: "Importer",
        body: "Same thing happened to us in 2024 with tablets. Amended, paid the difference, penalty was reduced because we corrected before final assessment.",
        at: "2026-11-24T13:45:00+06:00",
        votes: 12,
      },
    ],
  },
  {
    id: "t2",
    group: "importers",
    title: "Bank asking for LCAF amendment after price change. How long does it take?",
    body: "Supplier revised unit price by 4%. Bank says LCAF must be amended before they amend the LC. Typical turnaround?",
    author: "Habib Ullah",
    role: "Importer",
    at: "2026-11-23T16:10:00+06:00",
    tags: ["LC", "Banking"],
    votes: 9,
    views: 188,
    replies: [
      { id: "r3", author: "Kamrul Islam", role: "Moderator", body: "Two to three working days with most banks if documents are complete.", at: "2026-11-23T17:30:00+06:00", votes: 7 },
    ],
  },
  {
    id: "t3",
    group: "tax",
    title: "AT adjustment rejected in Mushak 9.1 for trading company",
    body: "Audit says AT can't be adjusted because we're a commercial importer. Is that correct after the latest SRO?",
    author: "Sadia Afrin",
    role: "Tax Practitioner",
    at: "2026-11-22T09:00:00+06:00",
    tags: ["VAT", "AT"],
    votes: 18,
    views: 340,
    replies: [],
  },
  {
    id: "t4",
    group: "cf-agents",
    title: "ASYCUDA timing out on attached documents above 2 MB",
    body: "Since Monday, uploads above 2 MB fail at Benapole. Anyone else?",
    author: "Mizanur Rahman",
    role: "C&F Agent",
    at: "2026-11-25T08:40:00+06:00",
    tags: ["ASYCUDA", "Benapole"],
    votes: 22,
    views: 401,
    flagged: true,
    replies: [
      { id: "r4", author: "Shirin Akter", role: "Moderator", body: "Confirmed at Dhaka ICD too. Compress PDFs to under 2 MB as a workaround for now.", at: "2026-11-25T09:15:00+06:00", votes: 15 },
    ],
  },
  {
    id: "t5",
    group: "forwarders",
    title: "House BL number mismatch with IGM, who corrects it?",
    body: "Our HBL number was typed wrong in the IGM by the shipping agent. Customs is holding the BE. What's the fastest fix?",
    author: "Tahmid Hossain",
    role: "Freight Forwarder",
    at: "2026-11-21T14:00:00+06:00",
    tags: ["IGM", "Manifest"],
    votes: 6,
    views: 97,
    replies: [],
  },
];

/* ------------------------------------------------------------------
   Mentors, students, reports
------------------------------------------------------------------- */
export interface Mentor {
  id: string;
  name: string;
  kind: "Mentor" | "Tutor";
  speciality: string;
  mentees: number;
  capacity: number;
  rating: number;
}
export const mentors: Mentor[] = [
  { id: "m1", name: "Shirin Akter", kind: "Mentor", speciality: "Procedures, ASYCUDA", mentees: 18, capacity: 25, rating: 4.9 },
  { id: "m2", name: "Md. Tanvir Hasan", kind: "Mentor", speciality: "Valuation", mentees: 22, capacity: 22, rating: 4.7 },
  { id: "m3", name: "Nusrat Jahan", kind: "Tutor", speciality: "VAT & SD", mentees: 11, capacity: 20, rating: 4.8 },
  { id: "m4", name: "Arif Chowdhury", kind: "Tutor", speciality: "Origin, trade policy", mentees: 6, capacity: 15, rating: 4.5 },
];

export interface Student {
  id: string;
  name: string;
  email: string;
  org: string;
  group: string;
  plan: PlanId;
  mentor?: string;
  progress: number;
  avgScore: number;
  lastActive: string;
  risk: "on track" | "watch" | "at risk";
  weakest: string;
}
export const students: Student[] = [
  { id: "s1", name: "Nadia Karim", email: "nadia.k@example.com", org: "Karim Traders", group: "Importers", plan: "professional", mentor: "m1", progress: 64, avgScore: 74, lastActive: "2026-11-26", risk: "on track", weakest: "Origin" },
  { id: "s2", name: "Rafiqul Islam", email: "rafiq@example.com", org: "Islam C&F Services", group: "C&F Agents", plan: "professional", mentor: "m1", progress: 81, avgScore: 79, lastActive: "2026-11-25", risk: "on track", weakest: "Valuation" },
  { id: "s3", name: "Sadia Afrin", email: "sadia.a@example.com", org: "Afrin & Co.", group: "Tax Practitioners", plan: "monthly", mentor: "m3", progress: 38, avgScore: 58, lastActive: "2026-11-19", risk: "watch", weakest: "Customs Act" },
  { id: "s4", name: "Mizanur Rahman", email: "mizan@example.com", org: "Benapole Clearing", group: "C&F Agents", plan: "firm", mentor: "m1", progress: 22, avgScore: 49, lastActive: "2026-11-08", risk: "at risk", weakest: "Classification" },
  { id: "s5", name: "Tahmid Hossain", email: "tahmid@example.com", org: "BlueLine Logistics", group: "Freight Forwarders", plan: "monthly", progress: 55, avgScore: 66, lastActive: "2026-11-24", risk: "on track", weakest: "VAT & SD" },
  { id: "s6", name: "Habib Ullah", email: "habib@example.com", org: "Ullah Imports", group: "Importers", plan: "professional", mentor: "m2", progress: 47, avgScore: 61, lastActive: "2026-11-22", risk: "watch", weakest: "Valuation" },
  { id: "s7", name: "Farzana Yeasmin", email: "farzana@example.com", org: "Benapole Clearing", group: "C&F Agents", plan: "firm", mentor: "m1", progress: 91, avgScore: 86, lastActive: "2026-11-26", risk: "on track", weakest: "Origin" },
  { id: "s8", name: "Jahid Hasan", email: "jahid@example.com", org: "Independent", group: "Aspiring Agents", plan: "none", progress: 9, avgScore: 0, lastActive: "2026-11-02", risk: "at risk", weakest: "—" },
];

export const mentorReports = [
  {
    id: "rep1",
    student: "s1",
    author: "Shirin Akter",
    date: "2026-11-20",
    period: "Nov 1 – Nov 20",
    summary:
      "Nadia is moving well through procedures and classification. Her lab answer on the laptop case named the right heading but did not cite GIR 2(a) until prompted. Valuation remains the gap: she treats the database price as a method. Next two weeks: valuation module 2 and the fabric lab, then a short viva on Sections 25 and 32.",
    rating: "On track",
  },
  {
    id: "rep2",
    student: "s4",
    author: "Shirin Akter",
    date: "2026-11-18",
    period: "Oct 15 – Nov 18",
    summary:
      "Mizanur has not logged in for ten days and missed the last session. Scores on classification checkpoints are below 50%. Recommend a call with the firm's training lead and a reduced weekly plan of two lessons.",
    rating: "At risk",
  },
];

export const mentorSessions = [
  { id: "ms1", student: "s1", topic: "Valuation methods walkthrough", at: "2026-11-28T18:00:00+06:00", minutes: 30, mode: "Video" },
  { id: "ms2", student: "s2", topic: "Viva rehearsal", at: "2026-11-27T20:00:00+06:00", minutes: 45, mode: "Video" },
  { id: "ms3", student: "s7", topic: "Origin criteria Q&A", at: "2026-12-01T19:00:00+06:00", minutes: 30, mode: "Chat" },
];

/* ------------------------------------------------------------------
   Certificates
------------------------------------------------------------------- */
export interface Certificate {
  id: string;
  serial: string;
  student: string;
  course: string;
  issued: string;
  score: number;
  status: "valid" | "revoked" | "pending";
  template: string;
}
export const certificates: Certificate[] = [
  { id: "c1", serial: "AIA-2026-04187", student: "Nadia Karim", course: "asycuda-world", issued: "2026-10-28", score: 91, status: "valid", template: "Standard" },
  { id: "c2", serial: "AIA-2026-04211", student: "Rafiqul Islam", course: "hs-classification", issued: "2026-11-02", score: 84, status: "valid", template: "Standard" },
  { id: "c3", serial: "AIA-2026-03990", student: "Farzana Yeasmin", course: "cf-licensing-prep", issued: "2026-09-30", score: 88, status: "valid", template: "Professional" },
  { id: "c4", serial: "AIA-2026-03512", student: "Kawsar Ahmed", course: "customs-valuation", issued: "2026-08-15", score: 71, status: "revoked", template: "Standard" },
  { id: "c5", serial: "AIA-2026-04302", student: "Tahmid Hossain", course: "lc-trade-finance", issued: "2026-11-25", score: 77, status: "pending", template: "Standard" },
];

export const certTemplates = [
  { id: "Standard", name: "Standard completion", signatories: ["Head of Academy"], accent: "cyan", used: 3812 },
  { id: "Professional", name: "Professional certificate", signatories: ["Head of Academy", "Chief Examiner"], accent: "orchid", used: 640 },
  { id: "Merit", name: "Merit (score ≥ 90)", signatories: ["Head of Academy", "Chief Examiner"], accent: "amber", used: 211 },
];

/* ------------------------------------------------------------------
   Platform admin
------------------------------------------------------------------- */
export const plans = [
  {
    id: "monthly" as PlanId,
    name: "Monthly",
    price: 1500,
    period: "month",
    for: "Try the academy on your own schedule.",
    features: ["All published courses", "Practical lab, 10 attempts a month", "Quizzes and mock exams", "Community forum"],
  },
  {
    id: "professional" as PlanId,
    name: "Professional",
    price: 3900,
    period: "quarter",
    for: "For agents and practitioners preparing seriously.",
    features: [
      "Everything in Monthly",
      "Unlimited lab attempts",
      "Expert-led live classes and recordings",
      "Assigned mentor and monthly report",
      "Viva board practice",
      "Verifiable certificates",
    ],
  },
  {
    id: "firm" as PlanId,
    name: "Firm",
    price: 2900,
    period: "seat / quarter",
    for: "C&F firms, importers and tax practices with 5+ staff.",
    features: ["Everything in Professional", "Firm workspace and admin", "Staff progress reports", "Custom cases from your own consignments", "Invoice billing"],
  },
];

export const tenants = [
  { id: "tn1", name: "Benapole Clearing Ltd.", seats: 24, used: 19, plan: "Firm", admin: "Farzana Yeasmin", status: "active", renews: "2027-01-15" },
  { id: "tn2", name: "Karim Traders", seats: 6, used: 6, plan: "Firm", admin: "Nadia Karim", status: "active", renews: "2026-12-30" },
  { id: "tn3", name: "Afrin & Co. Chartered", seats: 10, used: 4, plan: "Firm", admin: "Sadia Afrin", status: "trial", renews: "2026-12-05" },
  { id: "tn4", name: "Meghna Freight", seats: 8, used: 0, plan: "Firm", admin: "Tahmid Hossain", status: "suspended", renews: "—" },
];

export const roles = [
  { id: "super", name: "Super admin", users: 2, scope: "Global" },
  { id: "academy", name: "Academy admin", users: 4, scope: "Global" },
  { id: "content", name: "Content editor", users: 7, scope: "Courses, documents" },
  { id: "examiner", name: "Examiner", users: 5, scope: "Assessments, grading" },
  { id: "mentor", name: "Mentor / tutor", users: 12, scope: "Assigned students" },
  { id: "tenant", name: "Firm admin", users: 9, scope: "Own firm" },
  { id: "student", name: "Student", users: 14820, scope: "Self" },
];

export const permissions = [
  "Manage courses",
  "Publish content",
  "Schedule live classes",
  "Edit question bank",
  "Grade and override",
  "Issue certificates",
  "Revoke certificates",
  "Moderate community",
  "Manage billing",
  "Manage API keys",
  "View all reports",
];

export const rolePerms: Record<string, string[]> = {
  super: permissions,
  academy: permissions.filter((p) => p !== "Manage API keys"),
  content: ["Manage courses", "Publish content", "Schedule live classes"],
  examiner: ["Edit question bank", "Grade and override", "Issue certificates"],
  mentor: ["View all reports"],
  tenant: ["Manage billing", "View all reports"],
  student: [],
};

export const payments = [
  { id: "PAY-88214", who: "Nadia Karim", plan: "Professional", amount: 3900, method: "bKash", status: "paid", date: "2026-11-25" },
  { id: "PAY-88209", who: "Benapole Clearing Ltd.", plan: "Firm × 24", amount: 69600, method: "Bank transfer", status: "paid", date: "2026-11-24" },
  { id: "PAY-88197", who: "Sadia Afrin", plan: "Monthly", amount: 1500, method: "Nagad", status: "paid", date: "2026-11-23" },
  { id: "PAY-88190", who: "Tahmid Hossain", plan: "Monthly", amount: 1500, method: "Card", status: "failed", date: "2026-11-23" },
  { id: "PAY-88176", who: "Habib Ullah", plan: "Professional", amount: 3900, method: "SSLCommerz", status: "refunded", date: "2026-11-20" },
  { id: "PAY-88150", who: "Karim Traders", plan: "Firm × 6", amount: 17400, method: "Bank transfer", status: "pending", date: "2026-11-19" },
];

export const revenueByMonth = [
  { m: "Jun", v: 6.2 },
  { m: "Jul", v: 7.1 },
  { m: "Aug", v: 8.4 },
  { m: "Sep", v: 8.0 },
  { m: "Oct", v: 10.3 },
  { m: "Nov", v: 12.6 },
];

export const apiKeys = [
  { id: "k1", name: "Tradevics core sync", prefix: "tva_live_8f2c", scopes: ["users:read", "subscriptions:write"], created: "2026-07-02", lastUsed: "2 min ago" },
  { id: "k2", name: "Zoom webhook", prefix: "tva_live_19ab", scopes: ["live:write"], created: "2026-08-11", lastUsed: "1 h ago" },
  { id: "k3", name: "BI export (read only)", prefix: "tva_live_c771", scopes: ["reports:read"], created: "2026-10-01", lastUsed: "3 days ago" },
];

export const integrations = [
  { id: "sslcommerz", name: "SSLCommerz", kind: "Payments", connected: true },
  { id: "bkash", name: "bKash", kind: "Payments", connected: true },
  { id: "nagad", name: "Nagad", kind: "Payments", connected: true },
  { id: "zoom", name: "Zoom", kind: "Live classes", connected: true },
  { id: "jitsi", name: "Self-hosted Jitsi", kind: "Live classes", connected: false },
  { id: "smtp", name: "Email (SMTP)", kind: "Notifications", connected: true },
  { id: "sms", name: "SMS gateway", kind: "Notifications", connected: true },
  { id: "tradevics", name: "Tradevics AI core", kind: "Platform", connected: true },
  { id: "s3", name: "Object storage", kind: "Documents", connected: true },
];

export const documents = [
  { id: "d1", name: "Customs Act 1969 (amended to 2026).pdf", folder: "Legislation", size: "4.2 MB", updated: "2026-11-01", access: "All students", version: 7 },
  { id: "d2", name: "Bangladesh Operative Tariff FY27.xlsx", folder: "Tariff", size: "11.8 MB", updated: "2026-07-01", access: "All students", version: 3 },
  { id: "d3", name: "Valuation Rules 2000.pdf", folder: "Legislation", size: "1.1 MB", updated: "2026-03-14", access: "All students", version: 2 },
  { id: "d4", name: "GIR worked examples — handout.pdf", folder: "Course material", size: "2.6 MB", updated: "2026-11-12", access: "HS course", version: 4 },
  { id: "d5", name: "Mock paper 1 — answer key.pdf", folder: "Assessments", size: "0.4 MB", updated: "2026-11-02", access: "Examiners only", version: 1 },
  { id: "d6", name: "VAT and SD Act 2012.pdf", folder: "Legislation", size: "3.3 MB", updated: "2026-07-10", access: "All students", version: 5 },
  { id: "d7", name: "SRO 120-2026 summary.docx", folder: "Circulars", size: "0.2 MB", updated: "2026-11-20", access: "All students", version: 1 },
];

export const scheduleItems = [
  { id: "sc1", title: "What the FY27 budget changed at the border", type: "Live", day: 3, start: 15, len: 1, who: "F. Rahim" },
  { id: "sc2", title: "Valuation clinic", type: "Live", day: 6, start: 19.5, len: 1.25, who: "T. Hasan" },
  { id: "sc3", title: "Origin course goes live", type: "Release", day: 1, start: 10, len: 0.5, who: "Content" },
  { id: "sc4", title: "Mock paper 1 window opens", type: "Exam", day: 2, start: 9, len: 2, who: "Examiners" },
  { id: "sc5", title: "Viva board — batch A", type: "Exam", day: 4, start: 17, len: 2, who: "Panel" },
  { id: "sc6", title: "Mentor sync", type: "Internal", day: 0, start: 11, len: 1, who: "Mentors" },
  { id: "sc7", title: "HS module 3 release", type: "Release", day: 5, start: 10, len: 0.5, who: "Content" },
];

export const securityPolicies = [
  { id: "mfa-admin", label: "Require two-step verification for admins and examiners", on: true },
  { id: "mfa-all", label: "Require two-step verification for all users", on: false },
  { id: "device-limit", label: "Limit each account to 2 active devices", on: true },
  { id: "watermark", label: "Watermark videos with the viewer's email", on: true },
  { id: "proctor", label: "Lock exam window to full screen and log tab switches", on: true },
  { id: "ip-allow", label: "Restrict admin portal to office IP ranges", on: false },
];

export const auditLog = [
  { at: "2026-11-26 10:14", who: "Admin (you)", action: "Revoked certificate AIA-2026-03512", ip: "103.48.16.x" },
  { at: "2026-11-26 09:52", who: "Examiner Agent", action: "Graded 42 attempts on Valuation final exam", ip: "system" },
  { at: "2026-11-25 22:10", who: "Shirin Akter", action: "Published report for Nadia Karim", ip: "27.147.x.x" },
  { at: "2026-11-25 18:03", who: "Content editor", action: "Moved 'Rules of origin' to review", ip: "103.48.16.x" },
  { at: "2026-11-25 11:40", who: "Super admin", action: "Rotated API key 'Zoom webhook'", ip: "103.48.16.x" },
];

export const labAttempts = [
  { id: "at1", student: "Nadia Karim", caseId: "laptops-ctg", score: 72, at: "2026-11-19 20:14", duration: "21m", flagged: false, override: null as number | null },
  { id: "at2", student: "Rafiqul Islam", caseId: "laptops-ctg", score: 95, at: "2026-11-18 21:40", duration: "14m", flagged: false, override: null },
  { id: "at3", student: "Mizanur Rahman", caseId: "laptops-ctg", score: 30, at: "2026-11-08 23:02", duration: "4m", flagged: true, override: null },
  { id: "at4", student: "Habib Ullah", caseId: "fabric-valuation", score: 58, at: "2026-11-21 19:10", duration: "33m", flagged: false, override: 62 },
  { id: "at5", student: "Farzana Yeasmin", caseId: "fabric-valuation", score: 88, at: "2026-11-24 18:22", duration: "26m", flagged: false, override: null },
];

export const gradingQueue = [
  { id: "g1", student: "Habib Ullah", exam: "Valuation final exam", aiScore: 68, confidence: 0.62, reason: "Free-text answer on Method 3 is ambiguous" },
  { id: "g2", student: "Sadia Afrin", exam: "Duty stack case study: ceramics", aiScore: 55, confidence: 0.71, reason: "Calculation correct, explanation incomplete" },
  { id: "g3", student: "Rafiqul Islam", exam: "Licensing viva board", aiScore: 81, confidence: 0.58, reason: "Viva answer references repealed SRO" },
];

export const notificationsSeed = [
  { id: "n1", title: "Live now: What the FY27 budget changed at the border", body: "Dr. Farhana Rahim started the session.", at: "Just now", href: "/app/live/budget-2026", read: false },
  { id: "n2", title: "Your mentor posted a report", body: "Shirin Akter shared your Nov 1–20 progress report.", at: "6 days ago", href: "/app/mentor", read: false },
  { id: "n3", title: "Mock paper 1 opens on 4 Dec", body: "You have 2 attempts. Pass mark 65%.", at: "1 week ago", href: "/app/exams", read: true },
];

export const notificationRules = [
  { id: "nr1", event: "Live class scheduled", audience: "All AI Academy users", channels: ["Email", "In-app", "SMS"], on: true },
  { id: "nr2", event: "Live class starting in 15 min", audience: "Registered users", channels: ["In-app", "SMS"], on: true },
  { id: "nr3", event: "Exam window opens", audience: "Enrolled students", channels: ["Email", "In-app"], on: true },
  { id: "nr4", event: "Mentor report published", audience: "Student", channels: ["Email", "In-app"], on: true },
  { id: "nr5", event: "Certificate issued", audience: "Student", channels: ["Email"], on: true },
  { id: "nr6", event: "Payment failed", audience: "Student, firm admin", channels: ["Email", "SMS"], on: true },
  { id: "nr7", event: "Weekly progress digest", audience: "Students", channels: ["Email"], on: false },
];

export const agentRuns = [
  { id: "run-9921", agent: "Examiner", task: "Generate 10 Qs: Valuation, hard", status: "done", ms: 4200, at: "10:12" },
  { id: "run-9920", agent: "Evaluation", task: "Score lab attempt at5", status: "done", ms: 1800, at: "10:09" },
  { id: "run-9919", agent: "Simulator", task: "Run case laptops-ctg for Nadia Karim", status: "done", ms: 26000, at: "09:58" },
  { id: "run-9918", agent: "Pipeline", task: "Transcribe live class gir3-deep", status: "done", ms: 312000, at: "09:30" },
  { id: "run-9917", agent: "Evaluation", task: "Grade viva board batch A", status: "review", ms: 9400, at: "09:21" },
  { id: "run-9916", agent: "Examiner", task: "Viva follow-up for Rafiqul Islam", status: "failed", ms: 30000, at: "09:02" },
];

export const fmtBDT = (n: number) => "৳" + n.toLocaleString("en-IN");
export const fmtDate = (s: string) =>
  new Date(s).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
export const fmtDateTime = (s: string) =>
  new Date(s).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Dhaka" });

export const riskTone = { "on track": "mint", watch: "amber", "at risk": "rose" } as const;
