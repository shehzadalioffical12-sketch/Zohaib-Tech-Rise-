import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Student Support & Inquiries</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Contact Academic Support</h1>
          <p className="text-sm text-slate-500 max-w-lg mx-auto">
            Have questions regarding admissions, course curricula, or certificate verification? Our team is here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Campus Administration</h3>

              <div className="space-y-4 text-xs text-slate-600">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800 block">Main Campus Address</strong>
                    <span>Sector H-9/1, Academic Avenue, Islamabad, Pakistan</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800 block">Admissions Email</strong>
                    <span>info@zohaibtechrise.com</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800 block">Helpdesk Helpline</strong>
                    <span>+92 51 9283746 / +92 300 1234567</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-sky-50 border border-sky-200 p-5 rounded-2xl text-xs text-sky-900 space-y-2">
              <div className="font-bold">Operating Hours</div>
              <div>Monday – Friday: 9:00 AM – 5:00 PM PKT</div>
              <div>Saturday: 10:00 AM – 2:00 PM PKT</div>
              <div>Online LMS servers are operational 24/7/365.</div>
            </div>
          </div>

          <div className="md:col-span-7">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs">
              {submitted ? (
                <div className="text-center py-10 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Message Dispatched!</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Thank you for reaching out. An academic counselor will reply to your registered email within 24 business hours.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: '', message: '' }); }}
                    className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="font-bold text-slate-900 text-base mb-2">Send an Inquiry Message</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Your Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                        placeholder="e.g. Muhammad Ali"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Your Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                        placeholder="e.g. ali@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Subject</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                      placeholder="e.g. Question regarding Web Development course assignment"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Message</label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                      placeholder="Write your query details here..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
