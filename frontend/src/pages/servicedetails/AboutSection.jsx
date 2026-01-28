import { memo } from 'react';
import { Sparkles } from 'lucide-react';

const AboutSection = memo(({ longDescription }) => (
  <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white overflow-hidden">
    {/* Decorative gradient */}
    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-red-100/50 to-transparent rounded-bl-full" />

    <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center relative z-10">
      <div className="p-3 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl text-white shadow-lg shadow-red-200/50 mr-4">
        <Sparkles size={24} />
      </div>
      About This Service
    </h2>
    <p className="text-gray-700 text-lg leading-relaxed relative z-10">
      {longDescription}
    </p>
  </div>
));
AboutSection.displayName = 'AboutSection';

export default AboutSection;
