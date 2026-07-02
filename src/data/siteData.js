export const company = {
  name: "ZMH USA Corp.",
  tagline: "Your Remote Operations Department for Home Service Companies",
  phone: "+1 (555) 018-2048",
  email: "sales@zmhusacorp.com",
  emails: {
    sales: "sales@zmhusacorp.com",
    support: "support@zmhusacorp.com",
  },
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

export const testimonials = [
  { quote: "ZMH helped us capture calls we used to miss and gave our dispatch board real structure.", name: "Operations Manager", company: "Residential HVAC Group" },
  { quote: "Their team feels like part of our office. Customers get updates, and technicians get clean notes.", name: "Founder", company: "Plumbing Contractor" },
  { quote: "We finally have a repeatable admin workflow without hiring a full in-house department.", name: "Director", company: "Property Management Firm" },
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
  { title: "HVAC Overflow Call Coverage", industry: "HVAC", metric: "More booked estimates", body: "ZMH handled missed-call windows, qualified urgency, and captured estimate requests so office staff could stay focused on active jobs.", services: ["Call Answering", "Lead Qualification", "Scheduling"], outcome: "Urgent calls were triaged faster, non-urgent estimates were captured, and owners received cleaner daily summaries." },
  { title: "Plumbing Dispatch & Scheduling Cleanup", industry: "Plumbing", metric: "Faster field handoffs", body: "Remote operations support organized technician availability, appointment notes, and customer updates for cleaner daily dispatch.", services: ["Dispatch", "Scheduling", "Job Tracking"], outcome: "Technicians received clearer job notes while customers got consistent arrival-window updates." },
  { title: "Property Management Support Desk", industry: "Property Management", metric: "Single support channel", body: "Tenant questions, vendor updates, and recurring admin requests were routed into a documented workflow with visible dashboard follow-up.", services: ["Customer Support", "Administrative Support", "Workflow Management"], outcome: "Routine requests became easier to track, assign, and close without scattered inbox follow-up." },
  { title: "Roofing CRM & Reporting Hygiene", industry: "Roofing", metric: "Better owner visibility", body: "Daily CRM notes, job status updates, and summary reporting gave leadership a clearer view of calls, bookings, and service progress.", services: ["CRM Management", "Reporting", "Lead Qualification"], outcome: "Pipeline notes stayed current and leadership could see where leads, estimates, and follow-ups were slowing down." },
  { title: "Cleaning Company Billing Follow-Up", industry: "Cleaning", metric: "Cleaner monthly billing", body: "Invoice reminders, payment status tracking, and client follow-up helped reduce admin noise and keep billing conversations documented.", services: ["Billing Support", "Customer Support", "Administrative Support"], outcome: "Billing questions moved through one process, keeping client conversations and payment status easier to review." },
  { title: "Electrical After-Hours Request Routing", industry: "Electrical", metric: "Stronger emergency coverage", body: "After-hours calls were sorted by urgency, documented against the right service category, and escalated using client-approved instructions.", services: ["After Hours Coverage", "Call Answering", "Dispatch"], outcome: "Emergency requests reached the right path without turning every evening call into a field-team interruption." },
];

export const blogPosts = [
  "How remote operations help home service companies scale",
  "The dispatch checklist every HVAC business should document",
  "What to measure before outsourcing call answering",
  "Building better customer follow-up after the job is done",
];
