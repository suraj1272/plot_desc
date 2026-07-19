import React from "react";

const contactItems = [
  { type: "location", label: "Address", value: "Nalatavad, Survey No. 98 and 101, Hyderabad Region" },
  { type: "phone", label: "Phone", value: "+91 98765 43210" },
  { type: "email", label: "Email", value: "info@shreematadevelopers.com" },
  { type: "clock", label: "Office Hours", value: "Mon - Sat: 9 AM - 7 PM" },
];

const budgetOptions = ["Select budget", "Rs.20L - Rs.35L", "Rs.35L - Rs.50L", "Rs.50L - Rs.75L", "Rs.75L+"];

const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-24 bg-gray-50">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-3">Get In Touch</p>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Contact Us</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto rounded-full mb-5" />
          <p className="text-gray-600 max-w-xl mx-auto">Interested in a plot? Our team is ready to guide you through every step.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 text-lg mb-5">Shree Mata Developers</h3>
              <div className="space-y-4">
                {contactItems.map((item) => (
                  <div key={item.label} className="flex gap-3 items-start">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                    <div>
                      <div className="text-xs text-gray-400 font-medium uppercase tracking-wide">{item.label}</div>
                      <div className="text-gray-800 text-sm font-medium mt-0.5">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
              <p className="text-amber-400 font-semibold text-sm mb-2">Book a Free Site Visit</p>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">Come see Royal Enclave in person. Our team will give you a guided tour of the layout, amenities, and show you the best available plots.</p>
              <a href="tel:+919876543210" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold px-5 py-2.5 rounded-lg text-sm transition-all duration-200">Call to Book</a>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 text-lg mb-5">Send an Enquiry</h3>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Thank you! Our team will contact you shortly."); }}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
                  <input type="text" required placeholder="Your name" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                  <input type="tel" required placeholder="+91 XXXXX XXXXX" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                <input type="email" placeholder="your@email.com" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Budget Range</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all">
                  {budgetOptions.map((opt) => (<option key={opt}>{opt}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Message (Optional)</label>
                <textarea rows={3} placeholder="Any specific requirements or questions?" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all resize-none" />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-gray-900 font-bold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-amber-500/20">Send Enquiry</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;