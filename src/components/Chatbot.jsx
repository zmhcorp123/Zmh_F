import { useEffect, useMemo, useRef, useState } from "react";
import { company, services, industries, faqs } from "../data/siteData";
import { navigate } from "../utils/router";

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([{ from: "bot", text: "Hi, I am the ZMH assistant. Ask about services, pricing, industries, support, or booking." }]);
  const [typing, setTyping] = useState(false);
  const replyTimer = useRef(null);
  const chatScrollRef = useRef(null);
  const latestUserQuestion = [...messages].reverse().find((message) => message.from === "user")?.text || "";

  const knowledge = useMemo(() => ({
    services: "ZMH supports " + services.map((item) => item.name).join(", ") + ".",
    pricing: "Pricing is custom across Starter, Growth, Professional, and Enterprise packages. Book a free operations audit for a quote.",
    industries: "We support " + industries.map((item) => item.name).join(", ") + " companies.",
    faq: faqs.map(([question, response]) => ({ question, response })),
    support: "For customer service or technical support, email " + company.emails.support + " or use the contact form.",
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

  useEffect(() => () => clearTimeout(replyTimer.current), []);

  useEffect(() => {
    if (!open || !chatScrollRef.current) return;
    const frame = window.requestAnimationFrame(() => {
      chatScrollRef.current?.scrollTo({ top: chatScrollRef.current.scrollHeight, behavior: "auto" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [messages, typing, open]);

  const replyWithTyping = (question, response = answer(question)) => {
    clearTimeout(replyTimer.current);
    setMessages((items) => [...items, { from: "user", text: question }]);
    setTyping(true);
    replyTimer.current = setTimeout(() => {
      setMessages((items) => [...items, { from: "bot", text: response }]);
      setTyping(false);
    }, 550);
  };

  const addQuestion = (question) => {
    replyWithTyping(question);
  };

  const openRouteAndClose = (path) => {
    clearTimeout(replyTimer.current);
    setTyping(false);
    setOpen(false);
    navigate(path);
  };

  const showSupportEmail = () => {
    replyWithTyping("Email Us", "You can email our support team at " + company.emails.support + ".");
  };

  const send = (event) => {
    event.preventDefault();
    if (!input.trim()) return;
    const userMessage = input.trim();
    addQuestion(userMessage);
    setInput("");
  };

  const suggestedQuestions = faqs
    .filter(([question]) => question !== latestUserQuestion)
    .slice(0, 4);

  return (
    <div className="chatbot">
      {open && (
        <section className="chat-panel" aria-label="ZMH assistant chat">
          <header><strong>ZMH Assistant</strong><button type="button" className="chat-close" aria-label="Close chat" title="Close chat" onClick={() => setOpen(false)}>Close</button></header>
          <div className="chat-scroll" ref={chatScrollRef}><div className="chat-messages">{messages.map((message, index) => <p key={index} className={message.from}>{message.text}</p>)}{typing && <p className="bot typing" aria-live="polite"><span></span><span></span><span></span></p>}</div>
          <div className="chat-faqs" aria-label="Suggested questions">
            <span>Suggested questions</span>
            {suggestedQuestions.map(([question]) => <button type="button" key={question} onClick={() => addQuestion(question)}>{question}</button>)}
          </div>
          <div className="chat-actions"><button type="button" onClick={() => openRouteAndClose("/book-meeting")}>Book Meeting</button><button type="button" onClick={() => openRouteAndClose("/contact")}>Contact Support</button><button type="button" onClick={showSupportEmail}>Email Us</button></div></div>
          <form onSubmit={send}><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask a question..." aria-label="Ask a question" /><button type="submit">Send</button></form>
        </section>
      )}
      {!open && <button className="chat-toggle" type="button" onClick={() => setOpen(true)}>Chat</button>}
    </div>
  );
}
