import React, { memo } from 'react';
import { Sparkles } from 'lucide-react';

const AboutSection = memo<{ longDescription: string }>(({ longDescription }) => (
  <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
    <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
      <Sparkles className="text-red-600 mr-3" size={28} />
      About This Service
    </h2>
    <p className="text-gray-700 text-lg leading-relaxed">
      {longDescription}
    </p>
  </div>
));
export default AboutSection;
