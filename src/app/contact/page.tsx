"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailto = `mailto:support@carbazaar.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`From: ${formData.name} <${formData.email}>\n\n${formData.message}`)}`;
    window.location.href = mailto;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-kairo-bg">
      <Navbar />
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <h1 className="text-4xl font-bold text-kairo-ink mb-2">
            Contact <span className="text-kairo-gold">Us</span>
          </h1>
          <p className="text-kairo-ink-muted mb-8">Get in touch with our team.</p>

          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-green-800">
              <p>Your email client should open with the message ready to send. If it didn’t, email us at <a href="mailto:support@carbazaar.com" className="text-kairo-gold underline">support@carbazaar.com</a>.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg border border-kairo-border/30 p-6 space-y-4 text-gray-900">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-kairo-gold focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-kairo-gold focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData((p) => ({ ...p, subject: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-kairo-gold focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Message</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-kairo-gold focus:border-transparent"
                />
              </div>
              <button type="submit" className="w-full py-3 bg-kairo-gold text-kairo-deep font-semibold rounded-lg hover:bg-kairo-gold-hover transition-colors">
                Send Message
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
