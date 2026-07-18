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
  metrics: [
    { value: "24/7", label: "Coverage options", icon: "coverage" },
    { value: "< 60s", label: "Response goal", icon: "response" },
    { value: "100%", label: "CRM-ready notes", icon: "quality" },
    { value: "Live", label: "Operations support", icon: "support" },
  ],
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
  metrics: [
    { value: "24/7", label: "Coverage options", icon: "coverage" },
    { value: "Fast", label: "Response workflows", icon: "response" },
    { value: "Clear", label: "Customer updates", icon: "quality" },
    { value: "Scale", label: "With your team", icon: "growth" },
  ],
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
    name: "Shafayee bin Alam",
    slug: "shafayee-bin-alam",
    role: "Founder & CEO",
    location: "Bangladesh",
    linkedin: "https://www.linkedin.com/in/shafayee-bin-alam",
    summary: "Leads ZMH USA Corp's business strategy, product innovation, and enterprise growth, driving scalable marketplace and automation solutions through visionary leadership and execution",
    bio: "Shafayee bin Alam is the CEO of ZMH USA Corp and a strategic business and product leader with over a decade of experience delivering enterprise-grade digital solutions. He specializes in marketplace platforms, automation systems, product strategy, and business development, successfully leading large-scale projects across both government and private sectors. His expertise spans product vision, cross-functional leadership, and digital transformation, helping organizations build innovative, scalable, and user-focused technology solutions that create lasting business value.",
    focus: ["Product Strategy", "Business Development", "Enterprise Solutions", "Marketplace & Automation", "Digital Transformation", "Project Leadership"],
    image: "/team/shafayee-bin-alam.png",
    imagePosition: "50% 34%",
  },
  {
    name: "Jahid Ahmed Khan",
    slug: "jahid-ahmed-khan",
    role: "CO-Founder",
    location: "United States",
    linkedin: "",
    summary: "Co-founder of ZMH USA Corp, driving strategic partnerships, business growth and community engagement while supporting the company's long-term vision and global expansion.",
    bio: "Jahid Ahmed Khan is the Co-Founder of ZMH USA Corp, bringing extensive experience in business development, strategic leadership, and community engagement. With a strong background in entrepreneurship, technology, and organizational growth, he has successfully led initiatives that connect businesses, communities, and global opportunities.\n\nAlongside his leadership at ZMH USA Corp, he has held executive and advisory roles across multiple organizations in the United States and internationally. His expertise includes business strategy, partnership development, project management, and social impact initiatives.\n\nAs a Certified Human Rights Consultant, he is also committed to empowering communities through leadership, youth development, and advocacy for equality and sustainable progress. His vision is to create innovative business solutions while making a meaningful and lasting impact on society.",
    focus: ["Business Growth", "Strategic Partnerships", "Leadership", "Community Impact", "Project Management", "Global Relations"],
    image: "/team/jahid-ahmed-khan.png",
    imagePosition: "50% 18%",
  },
  {
    name: "Colonel",
    slug: "colonel",
    role: "Co-Founder",
    location: "Bangladesh",
    linkedin: "https://www.linkedin.com/",
    summary: "Oversees daily workflows, scheduling, dispatch coordination, CRM updates, and SOP execution.",
    bio: "The operations lead is responsible for managing daily service delivery, team quality, process adherence, and performance reporting from the Bangladesh operations center.",
    focus: ["Daily workflows", "SOP execution", "Quality control", "Team coordination"],
    image: "",
    imagePosition: "",
  },
  {
    name: "Mahabub Hasan Shad",
    slug: "mahabub-hasan-shad",
    role: "Bangladesh Representative",
    location: "Bangladesh",
    linkedin: "",
    summary: "Represents ZMH USA Corp in Bangladesh, strengthening local partnerships, supporting business development, and driving strategic initiatives to expand the company's presence and client relationships.",
    bio: "Mahabub Hasan Shad serves as the Bangladesh Representative of ZMH USA Corp, leading the company's operations and strategic initiatives within Bangladesh. He works closely with clients, partners, and stakeholders to strengthen business relationships, identify new opportunities, and support the successful delivery of innovative solutions.\n\nWith expertise in business development, relationship management, and market expansion, he plays a key role in connecting local organizations with ZMH USA Corp's global services. His commitment to professionalism, collaboration, and customer success contributes to the company's continued growth in the region.",
    focus: ["Business Development", "Client Relations", "Market Expansion", "Strategic Partnerships", "Operations", "Local Representation"],
    image: "/team/mahabub-hasan-shad.png",
    imagePosition: "50% 18%",
  },
  {
    name: "Khalid Hasan",
    slug: "khalid-hasan",
    role: "Website & Software Developer",
    location: "Bangladesh",
    linkedin: "https://www.linkedin.com/in/khasan013",
    summary: "Develops and maintains ZMH USA Corp's digital platforms, delivering secure, scalable, and high-performance web solutions that enhance user experience and business operations",
    bio: "Khalid Hasan serves as the Website & Software Developer at ZMH USA Corp, responsible for designing, developing, and maintaining the company's web platforms and digital solutions. He specializes in building secure, scalable, and high-performance applications using modern web technologies, ensuring reliable user experiences and efficient business operations.\n\nWith expertise in full-stack development, database architecture, API integration, and system optimization, he transforms business requirements into innovative technology solutions. His focus on clean architecture, performance and continuous improvement helps support ZMH USA Corp's digital growth and long-term success.",
    focus: ["Full-Stack Development", "Web Applications", "API Development", "Database Design", "System Optimization", "UI/UX Implementation"],
    image: "/team/khalid-hasan.png",
    imagePosition: "50% 20%",
  },
  {
    name: "Navid Iqbal",
    slug: "navid-iqbal",
    role: "USA Representative",
    location: "New York, USA",
    linkedin: "",
    summary: "Represents ZMH USA Corp across the United States, building strong client relationships, supporting business development, and ensuring outstanding service delivery while expanding the company's presence in the U.S. market.",
    bio: "Navid Iqbal serves as the USA Representative for ZMH USA Corp, representing the company's interests across the United States. He works closely with clients, partners, and internal teams to strengthen relationships, support business development, and coordinate successful service delivery. Drawing on his experience in customer service, operations, and leadership, Navid is dedicated to promoting ZMH USA Corp's values while contributing to sustainable growth and long-term client success.",
    focus: ["Client Relations", "Business Development", "USA Operations", "Market Expansion", "Strategic Partnerships", "Customer Experience", "Operational Coordination", "Communication", "Leadership", "Business Growth", "Cross-functional Collaboration"],
    image: "/team/navid-iqbal.png",
    imagePosition: "50% 20%",
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
