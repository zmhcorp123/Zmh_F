import { PageHero } from "../components/Sections";
import { SEO } from "../components/SEO";

const legalPages = {
  "Terms & Conditions": {
    effectiveDate: "July 2026",
    intro: [
      'Welcome to ZMH USA Corp. ("ZMH," "Company," "we," "our," or "us"). These Terms & Conditions govern your access to and use of our website and services. By accessing this website or engaging our services, you agree to be bound by these Terms.',
      "If you do not agree with these Terms, please do not use this website or our services.",
    ],
    sections: [
      {
        title: "1. About ZMH USA Corp.",
        body: ["ZMH USA Corp. is a New York-based company providing remote business operations support, customer service, dispatch coordination, appointment scheduling, CRM management, administrative support, and related business process outsourcing services to businesses primarily operating in the United States."],
      },
      {
        title: "2. Scope of Services",
        body: ["Our services may include, but are not limited to:"],
        list: ["Customer call answering", "Appointment scheduling", "Dispatch coordination", "CRM management", "Administrative support", "Lead qualification", "Customer follow-up", "Email management", "Workflow coordination", "Business process outsourcing"],
        footer: ["Specific services are governed by individual service agreements between ZMH USA Corp. and each client."],
      },
      {
        title: "3. No Guarantee of Business Results",
        body: ["While we strive to provide professional and efficient operational support, we do not guarantee:"],
        list: ["Increased revenue", "Lead conversion rates", "Customer retention", "Business growth", "Specific financial outcomes"],
        footer: ["Business performance depends on numerous factors beyond our control."],
      },
      {
        title: "4. Client Responsibilities",
        body: ["Clients agree to:"],
        list: ["Provide accurate information.", "Maintain current pricing, service details, and operational procedures.", "Respond promptly when escalations require client decisions.", "Provide necessary access to software and systems.", "Comply with all applicable laws and regulations."],
      },
      {
        title: "5. Independent Business Relationship",
        body: ["ZMH USA Corp. provides business support services and does not become an employee, agent, partner, or legal representative of the client unless expressly agreed in writing."],
      },
      {
        title: "6. Confidentiality",
        body: ["We maintain strict confidentiality regarding client information, customer records, pricing, business processes, and proprietary information.", "Employees and contractors are required to comply with confidentiality obligations."],
      },
      {
        title: "7. Intellectual Property",
        body: ["All website content, branding, graphics, text, logos, and proprietary materials remain the exclusive property of ZMH USA Corp.", "No content may be copied, reproduced, distributed, or modified without prior written permission."],
      },
      {
        title: "8. Payment Terms",
        body: ["Unless otherwise agreed:"],
        list: ["Invoices are payable according to the agreed payment schedule.", "Late payments may result in suspension of services.", "Outstanding balances may incur applicable late fees where permitted by law."],
      },
      {
        title: "9. Limitation of Liability",
        body: ["To the fullest extent permitted by law, ZMH USA Corp. shall not be liable for:"],
        list: ["Lost profits", "Business interruption", "Loss of goodwill", "Indirect damages", "Consequential damages", "Third-party service failures", "Internet outages", "Software failures beyond our reasonable control"],
        footer: ["Our total liability shall not exceed the amount paid by the client for the services directly giving rise to the claim during the preceding three (3) months."],
      },
      {
        title: "10. Third-Party Platforms",
        body: ["Our services may utilize third-party software including CRM platforms, cloud telephony providers, scheduling software, payment processors, and communication platforms.", "We are not responsible for interruptions or failures caused by third-party providers."],
      },
      {
        title: "11. Website Use",
        body: ["Users agree not to:"],
        list: ["Attempt unauthorized access to our systems", "Introduce malicious software", "Interfere with website functionality", "Misrepresent their identity", "Use the website for unlawful purposes"],
      },
      {
        title: "12. Service Modifications",
        body: ["We reserve the right to modify, suspend, or discontinue any service or website feature without prior notice."],
      },
      {
        title: "13. Governing Law",
        body: ["These Terms shall be governed by and interpreted in accordance with the laws of the State of New York, United States."],
      },
      {
        title: "14. Dispute Resolution",
        body: ["Any dispute arising from these Terms shall first be addressed through good-faith negotiations.", "If unresolved, disputes shall be submitted to binding arbitration before either party pursues litigation, unless otherwise required by applicable law."],
      },
      {
        title: "15. Changes to These Terms",
        body: ["We may update these Terms periodically.", "The updated version will become effective immediately upon publication on this website."],
      },
      {
        title: "16. Contact Information",
        body: ["ZMH USA Corp.", "Email: info@zmhusacorp.com", "Website: www.zmhusacorp.com"],
      },
    ],
  },
  "Privacy Policy": {
    effectiveDate: "July 2026",
    intro: ["ZMH USA Corp. respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and protect information when you visit our website or use our services."],
    sections: [
      {
        title: "1. Information We Collect",
        body: ["We may collect:"],
        groups: [
          { title: "Personal Information", list: ["Name", "Email address", "Phone number", "Company name", "Job title", "Business address", "Service inquiries"] },
          { title: "Technical Information", list: ["IP address", "Browser type", "Device information", "Operating system", "Website usage data", "Cookies and analytics information"] },
        ],
      },
      {
        title: "2. How We Use Information",
        body: ["We use collected information to:"],
        list: ["Respond to inquiries", "Deliver requested services", "Schedule consultations", "Improve our services", "Provide customer support", "Send service-related communications", "Maintain website security", "Comply with legal obligations"],
        footer: ["We do not sell your personal information."],
      },
      {
        title: "3. Cookies",
        body: ["Our website may use cookies and similar technologies to:"],
        list: ["Improve user experience", "Analyze website traffic", "Remember user preferences", "Monitor website performance"],
        footer: ["Users may disable cookies through their browser settings, although some website functionality may be affected."],
      },
      {
        title: "4. Information Sharing",
        body: ["We may share information only with:"],
        list: ["Authorized employees", "Approved service providers", "Payment processors", "Cloud software providers", "Government authorities where legally required"],
        footer: ["We do not sell or rent personal information to third parties."],
      },
      {
        title: "5. Data Security",
        body: ["We implement reasonable administrative, technical, and organizational safeguards designed to protect personal information from unauthorized access, disclosure, alteration, or destruction.", "However, no internet transmission or electronic storage method is completely secure."],
      },
      {
        title: "6. International Operations",
        body: ["ZMH USA Corp. maintains business operations in both the United States and Bangladesh.", "Information may be securely processed by authorized personnel located in either jurisdiction for the purpose of delivering contracted services.", "All personnel handling customer information are subject to confidentiality obligations and internal security procedures."],
      },
      {
        title: "7. Data Retention",
        body: ["We retain personal information only for as long as necessary to:"],
        list: ["Provide requested services", "Meet contractual obligations", "Comply with legal requirements", "Resolve disputes", "Enforce agreements"],
      },
      {
        title: "8. Your Rights",
        body: ["Depending on applicable law, you may have the right to:"],
        list: ["Access your information", "Request corrections", "Request deletion", "Withdraw consent where applicable", "Request a copy of your data"],
        footer: ["Requests may be submitted using the contact information below."],
      },
      {
        title: "9. Third-Party Services",
        body: ["Our website may contain links to third-party websites or integrate third-party platforms.", "We are not responsible for the privacy practices of those external services."],
      },
      {
        title: "10. Children's Privacy",
        body: ["Our services are intended for business users and are not directed toward individuals under the age of 18.", "We do not knowingly collect personal information from children."],
      },
      {
        title: "11. Changes to This Policy",
        body: ["We may update this Privacy Policy periodically.", "Updated versions will be posted on this page with a revised effective date."],
      },
      {
        title: "12. Contact Us",
        body: ["If you have questions regarding this Privacy Policy or our data practices, please contact:", "ZMH USA Corp.", "Email: info@zmhusacorp.com", "Website: www.zmhusacorp.com"],
      },
    ],
  },
  "Cookie Policy": {
    effectiveDate: "July 2026",
    intro: ["This Cookie Policy explains how ZMH USA Corp. uses cookies and similar technologies on our website."],
    sections: [
      {
        title: "What Are Cookies?",
        body: ["Cookies are small text files stored on your device that help improve website functionality and user experience."],
      },
      {
        title: "Types of Cookies We Use",
        groups: [
          { title: "Essential Cookies", body: ["These cookies are required for website functionality including:"], list: ["Secure login sessions", "Contact form submission", "Website navigation"] },
          { title: "Analytics Cookies", body: ["We may use analytics tools to understand:"], list: ["Visitor numbers", "Pages viewed", "Time spent on our website", "Traffic sources"] },
          { title: "Functional Cookies", body: ["These cookies remember your preferences and improve website usability."] },
          { title: "Marketing Cookies", body: ["Where applicable, we may use cookies to measure advertising effectiveness and improve marketing campaigns."] },
        ],
      },
      {
        title: "Managing Cookies",
        body: ["Most browsers allow you to:"],
        list: ["Block cookies", "Delete cookies", "Receive notifications before cookies are stored"],
        footer: ["Disabling cookies may affect certain website features."],
      },
      {
        title: "Third-Party Cookies",
        body: ["Some cookies may be placed by trusted third-party providers including analytics, payment, communication, or customer support platforms."],
      },
      {
        title: "Changes",
        body: ["We may update this Cookie Policy from time to time. Continued use of our website indicates acceptance of any updated version."],
      },
    ],
  },
};

function LegalList({ items }) {
  if (!items?.length) return null;
  return <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}

function LegalParagraphs({ items }) {
  if (!items?.length) return null;
  return items.map((item) => <p key={item}>{item}</p>);
}

function LegalGroups({ groups }) {
  if (!groups?.length) return null;
  return groups.map((group) => (
    <div key={group.title}>
      <h4>{group.title}</h4>
      <LegalParagraphs items={group.body} />
      <LegalList items={group.list} />
    </div>
  ));
}

export function Legal({ type }) {
  const title = type || "Privacy Policy";
  const page = legalPages[title] || legalPages["Privacy Policy"];

  return (
    <>
      <SEO title={title} />
      <PageHero eyebrow="Legal" title={title} text="Current policy information for website visitors and client portal users." image={false} />
      <section className="legal">
        <h2>{title}</h2>
        <p>Effective Date: {page.effectiveDate}</p>
        <LegalParagraphs items={page.intro} />
        {page.sections.map((section) => (
          <article key={section.title}>
            <h3>{section.title}</h3>
            <LegalParagraphs items={section.body} />
            <LegalList items={section.list} />
            <LegalGroups groups={section.groups} />
            <LegalParagraphs items={section.footer} />
          </article>
        ))}
      </section>
    </>
  );
}
