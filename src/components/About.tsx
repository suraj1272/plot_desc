import React from 'react';

const trustBadges = [
  {
    icon: '🏛️',
    title: 'DTCP Approved',
    description: 'Fully approved by the Directorate of Town and Country Planning',
  },
  {
    icon: '⚖️',
    title: 'RERA Registered',
    description: 'Registered under Real Estate (Regulation and Development) Act',
  },
  {
    icon: '🏆',
    title: '15+ Years',
    description: 'Over a decade and a half of delivering premium properties',
  },
  {
    icon: '🤝',
    title: '500+ Families',
    description: 'Trusted by over 500 satisfied families across our projects',
  },
];

const features = [
  { label: 'Wide Roads', sub: '12.2M internal roads for easy access', icon: '🛣️' },
  { label: 'Underground Utilities', sub: 'Water, electricity & drainage pre-laid', icon: '⚡' },
  { label: 'Green Spaces', sub: 'Dedicated parks and open areas', icon: '🌳' },
  { label: 'Security', sub: '24/7 gated entry with CCTV surveillance', icon: '🔒' },
  { label: 'Club House', sub: 'Recreation & community gathering space', icon: '🏠' },
  { label: 'Vastu Compliant', sub: 'All plots designed with Vastu principles', icon: '🧭' },
];

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-3">
            About the Builder
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Shree Mata Developers
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto rounded-full mb-6" />
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            A legacy of trust built over 15+ years. Shree Mata Developers has delivered premium
            residential plots and gated communities across the region, crafting spaces where
            families build their futures.
          </p>
        </div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left: Story */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Story & Mission</h3>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Founded with a singular vision — to make premium land ownership accessible and
                transparent — Shree Mata Developers has grown into one of the most trusted names
                in residential plotted developments in the region.
              </p>
              <p>
                Our flagship project, <strong className="text-gray-900">Royal Enclave at Nalatavad</strong>,
                spans 12 acres and features 240+ carefully planned plots with all modern
                infrastructure. Every plot is DTCP-approved, Vastu-compliant, and backed by
                clear title documentation.
              </p>
              <p>
                We believe in complete transparency — from site visits to registration, every step
                is guided by our experienced team to ensure your investment is safe and stress-free.
              </p>
            </div>

            {/* Progress bars */}
            <div className="mt-8 space-y-4">
              {[
                { label: 'Plots Sold', value: 68 },
                { label: 'Plots Booked', value: 20 },
                { label: 'Available', value: 12 },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{item.label}</span>
                    <span className="text-amber-600 font-bold">{item.value}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-1000"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Trust badges */}
          <div className="grid grid-cols-2 gap-4">
            {trustBadges.map((badge) => (
              <div
                key={badge.title}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-amber-200 hover:shadow-md transition-all duration-300 group"
              >
                <div className="text-4xl mb-3">{badge.icon}</div>
                <h4 className="font-bold text-gray-900 mb-1 group-hover:text-amber-700 transition-colors">
                  {badge.title}
                </h4>
                <p className="text-gray-500 text-sm leading-relaxed">{badge.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features grid */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Project Amenities</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {features.map((f) => (
              <div
                key={f.label}
                className="flex gap-4 items-start bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all duration-300 group"
              >
                <span className="text-2xl flex-shrink-0">{f.icon}</span>
                <div>
                  <div className="font-semibold text-gray-900 group-hover:text-amber-700 transition-colors text-sm">
                    {f.label}
                  </div>
                  <div className="text-gray-500 text-xs mt-0.5 leading-relaxed">{f.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Location highlight */}
        <div className="mt-16 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_right,_rgba(180,142,60,0.8)_0%,_transparent_70%)]" />
          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-2">Location</p>
              <h3 className="text-3xl font-bold mb-3">Nalatavad, Survey No. 98 & 101</h3>
              <p className="text-gray-300 leading-relaxed">
                Strategically located with excellent connectivity — near major highways,
                schools, hospitals, and the city centre. A growing corridor with strong
                appreciation potential.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'City Centre', value: '12 km' },
                { label: 'NH Highway', value: '2 km' },
                { label: 'Airport', value: '25 km' },
                { label: 'Schools', value: '1 km' },
              ].map((loc) => (
                <div key={loc.label} className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
                  <div className="text-xl font-black text-amber-400">{loc.value}</div>
                  <div className="text-gray-400 text-xs mt-1">{loc.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
