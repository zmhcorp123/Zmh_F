export const company = {
  name: "ZMH USA Corp.",
  tagline: "Your Remote Operations Department for Home Service Companies",
  phone: "+1 (555) 018-2048",
  email: "hello@zmhusacorp.com",
  address: "Serving home service companies across the United States",
};

export const services = [
  "Call Answering",
  "Dispatch",
  "Scheduling",
  "Customer Support",
  "CRM Management",
  "Billing Support",
  "Lead Qualification",
  "After Hours Coverage",
  "Administrative Support",
  "Job Tracking",
  "Reporting",
  "Workflow Management",
].map((name, index) => ({
  name,
  slug: name.toLowerCase().replaceAll(" ", "-"),
  icon: ["phone", "route", "calendar", "headset", "database", "receipt", "target", "moon", "briefcase", "map", "chart", "workflow"][index],
  summary: [
    "Professional call coverage that protects revenue and reputation.",
    "Clear technician coordination for faster field response.",
    "Calendar management that keeps crews booked and customers updated.",
    "Friendly support that turns daily questions into loyalty.",
    "Clean CRM hygiene, notes, updates, and pipeline visibility.",
    "Invoice, payment, and billing support for cleaner finance workflows.",
    "Inbound lead screening that filters urgency, fit, and next steps.",
    "Evening and weekend coverage for urgent customer needs.",
    "Back-office admin help that removes repetitive operational drag.",
    "Job status tracking from first call through completion.",
    "Operational reports that show volume, outcomes, and gaps.",
    "SOP-driven workflows that make remote teams feel in-house.",
  ][index],
  benefits: ["Faster response times", "Cleaner handoffs", "More booked jobs", "Consistent customer experience"],
  features: ["Custom scripts and SOPs", "CRM-ready notes", "Escalation paths", "Daily performance summaries"],
}));

export const industries = [
  "HVAC",
  "Plumbing",
  "Roofing",
  "Electrical",
  "Cleaning",
  "Property Management",
  "Restoration",
  "Landscaping",
  "Painting",
  "General Contractors",
].map((name) => ({
  name,
  slug: name.toLowerCase().replaceAll(" ", "-"),
  problems: ["Missed calls during busy windows", "Technicians interrupted by admin tasks", "Customer updates scattered across tools"],
  solutions: ["Dedicated remote operations pods", "Documented workflows for every call type", "Clean scheduling, dispatch, and follow-up rhythms"],
  benefits: ["Higher booking rate", "Less operational noise", "Better customer visibility", "Scalable coverage"],
}));

export const packages = [
  { name: "Starter", slug: "starter", price: "Custom", bestFor: "Small teams needing reliable call and admin coverage.", features: ["Call answering", "Basic scheduling", "Email support", "Weekly summary"] },
  { name: "Growth", slug: "growth", price: "Custom", bestFor: "Growing companies ready to centralize operations.", features: ["Dispatch support", "CRM management", "Lead qualification", "Daily reporting"] },
  { name: "Professional", slug: "professional", price: "Custom", bestFor: "Established service businesses with higher volume.", features: ["After-hours coverage", "Workflow management", "Billing support", "Custom SOP library"] },
  { name: "Enterprise", slug: "enterprise", price: "Request quote", bestFor: "Multi-location operators needing a tailored remote department.", features: ["Dedicated operations team", "Advanced reporting", "Priority support", "Executive reviews"] },
];

export const faqs = [
  ["Do agents receive US accent training?", "Yes. Training focuses on clarity, tone, service vocabulary, and your custom scripts."],
  ["What is the average response time?", "Most inbound workflows are designed around fast pickup, accurate qualification, and immediate CRM documentation."],
  ["Do you cover after hours?", "Yes. Coverage can be configured for evenings, weekends, emergency calls, and overflow windows."],
  ["Which CRMs are compatible?", "ZMH can support workflows around common home service CRMs and custom operating processes."],
  ["Can you dispatch technicians?", "Yes. Dispatch workflows can include priority rules, technician calendars, job notes, and escalation steps."],
  ["How is data security handled?", "Access levels, documented SOPs, and role-based workflows help keep operational data controlled."],
  ["Can we use custom SOPs?", "Absolutely. ZMH works best when your playbooks are documented and continuously improved."],
  ["Can the team scale with us?", "Yes. Packages are designed to grow from light support to a dedicated remote operations department."],
];

export const teamProfiles = [
  {
    name: "Founder Profile",
    slug: "founder-profile",
    role: "Founder",
    location: "United States",
    linkedin: "https://www.linkedin.com/",
    summary: "Leads the company vision, client strategy, and long-term operating standards for ZMH USA Corp.",
    bio: "The founder role is responsible for shaping ZMH USA Corp. as a trusted remote operations partner for home service businesses, including client relationships, service standards, and long-term strategy.",
    focus: ["Company vision", "Client relationships", "Strategic growth", "Operating standards"],
  },
  {
    name: "U.S. Stakeholder Profile",
    slug: "us-stakeholder-profile",
    role: "U.S. Representative & Stakeholder",
    location: "United States",
    linkedin: "https://www.linkedin.com/",
    summary: "Provides local oversight, client communication, accountability, and strategic support for U.S. clients.",
    bio: "This stakeholder profile is designed for the U.S. business representative who supports local client relationships, service accountability, and communication between leadership and operations.",
    focus: ["U.S. oversight", "Client accountability", "Business communication", "Strategic support"],
  },
  {
    name: "Operations Lead Profile",
    slug: "operations-lead-profile",
    role: "Bangladesh Operations Lead",
    location: "Bangladesh Operations Center",
    linkedin: "https://www.linkedin.com/",
    summary: "Oversees daily workflows, scheduling, dispatch coordination, CRM updates, and SOP execution.",
    bio: "The operations lead is responsible for managing daily service delivery, team quality, process adherence, and performance reporting from the Bangladesh operations center.",
    focus: ["Daily workflows", "SOP execution", "Quality control", "Team coordination"],
  },
  {
    name: "Client Success Profile",
    slug: "client-success-profile",
    role: "Client Success Stakeholder",
    location: "Remote Operations",
    linkedin: "https://www.linkedin.com/",
    summary: "Supports onboarding, reporting, customer experience, and continuous improvement for client accounts.",
    bio: "This profile represents client success leadership responsible for onboarding clients, monitoring outcomes, improving workflows, and maintaining strong communication with the ZMH operations team.",
    focus: ["Client onboarding", "Reporting", "Workflow improvement", "Customer experience"],
  },
];

export const caseStudies = [
  { title: "Pilot Project", metric: "42% faster follow-up", body: "Built a documented call intake and scheduling process for a service operator validating remote support." },
  { title: "Residential HVAC", metric: "31% more booked estimates", body: "Captured overflow calls, qualified urgency, and coordinated technician availability during peak season." },
  { title: "Commercial Plumbing", metric: "24/7 emergency coverage", body: "Introduced after-hours triage and escalation for commercial clients with urgent response needs." },
  { title: "Property Management", metric: "18 hours saved weekly", body: "Centralized maintenance requests, vendor updates, tenant communication, and status reporting." },
];

export const blogPosts = [
  "How remote operations help home service companies scale",
  "The dispatch checklist every HVAC business should document",
  "What to measure before outsourcing call answering",
  "Building better customer follow-up after the job is done",
];
