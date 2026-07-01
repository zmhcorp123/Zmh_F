import { useMemo, useState } from "react";
import { services, industries, faqs } from "../data/siteData";
import { navigate } from "../utils/router";

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([{ from: "bot", text: "Hi, I am the ZMH assistant. Ask about services, pricing, industries, support, or booking." }]);

  const knowledge = useMemo(() => ({
    services: "ZMH supports " + services.map((item) => item.name).join(", ") + ".",
    pricing: "Pricing is custom across Starter, Growth, Professional, and Enterprise packages. Book a free operations audit for a quote.",
    industries: "We support " + industries.map((item) => item.name).join(", ") + " companies.",
    faq: faqs.map(([question, response]) => ({ question, response })),
    support: "You can contact support by phone, email, or the contact form. Backend AI integration can connect here later.",
  }), []);

  const answer = (text) => {
    const lower = text.toLowerCase();
    const faqMatch = knowledge.faq.find(({ question }) => {
      const keywords = question.toLowerCase().replace(/[^a-z0-9 ]/g, "").split(" ").filter((word) => word.length > 3);
      return keywords.some((word) => lower.includes(word));
    });
    if (faqMatch) return faqMatch.response;
    if (lower.includes("faq") || lower.includes("question")) return "I can answer FAQs about US accent training, response time, after-hours coverage, CRM compatibility, dispatch services, data security, custom SOPs, and scaling.";
    if (lower.includes("price") || lower.includes("package") || lower.includes("cost")) return knowledge.pricing;
    if (lower.includes("service") || lower.includes("dispatch") || lower.includes("call")) return knowledge.services;
    if (lower.includes("industry") || lower.includes("hvac") || lower.includes("plumbing")) return knowledge.industries;
    if (lower.includes("support") || lower.includes("contact")) return knowledge.support;
    return "Would you like to speak with one of our specialists? I can take you to booking or contact.";
  };

  const addQuestion = (question) => {
    setMessages((items) => [...items, { from: "user", text: question }, { from: "bot", text: answer(question) }]);
  };

  const send = (event) => {
    event.preventDefault();
    if (!input.trim()) return;
    const userMessage = input.trim();
    addQuestion(userMessage);
    setInput("");
  };

  return (
    <div className="chatbot">
      {open && (
        <section className="chat-panel" aria-label="ZMH assistant chat">
          <header><strong>ZMH Assistant</strong><button type="button" className="chat-close" aria-label="Close chat" title="Close chat" onClick={() => setOpen(false)}>Close</button></header>
          <div className="chat-scroll"><div className="chat-messages">{messages.map((message, index) => <p key={index} className={message.from}>{message.text}</p>)}</div>
          <div className="chat-faqs">
            {faqs.slice(0, 4).map(([question]) => <button type="button" key={question} onClick={() => addQuestion(question)}>{question}</button>)}
          </div>
          <div className="chat-actions"><button type="button" onClick={() => navigate("/book-meeting")}>Book Meeting</button><button type="button" onClick={() => navigate("/contact")}>Contact Support</button><a href="mailto:hello@zmhusacorp.com">Email Us</a></div></div>
          <form onSubmit={send}><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask a question..." aria-label="Ask a question" /><button type="submit">Send</button></form>
        </section>
      )}
      <button className="chat-toggle" type="button" onClick={() => setOpen((value) => !value)}>{open ? "Close" : "Chat"}</button>
    </div>
  );
}
