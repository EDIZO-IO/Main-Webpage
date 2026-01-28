// frontend/src/pages/home/FinalCTA.tsx
import { memo } from 'react';
import { Sparkles, ArrowRight, CheckCircle, Code, Palette, Video, Server, Bot, Globe } from 'lucide-react';
import Button from '../../components/common/Button';
import { AnimatedSection } from './AnimatedSection';

const FinalCTA = memo(() => {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl border border-gray-700 p-8 md:p-12 text-center">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1 text-center md:text-left">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl mb-6 shadow-lg">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>

                  {/* Title */}
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Ready to Transform Your Business?
                  </h2>

                  {/* Description */}
                  <p className="text-lg text-gray-300 mb-6 max-w-xl mx-auto md:mx-0">
                    Join 10+ clients who trust us with their digital transformation.
                  </p>

                  {/* Guarantee badges */}
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 mb-8 text-gray-400">
                    <span className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      100% Satisfaction Guaranteed
                    </span>
                    <span className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Free Consultation
                    </span>
                  </div>
                </div>

                <div className="flex-1">
                  {/* Service category icons */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                      { icon: Code, label: 'Development' },
                      { icon: Palette, label: 'Design' },
                      { icon: Video, label: 'Video' },
                      { icon: Bot, label: 'AI' },
                      { icon: Server, label: 'Hosting' },
                      { icon: Globe, label: 'Web' }
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="bg-gray-700/50 border border-gray-600 rounded-xl p-4 flex flex-col items-center justify-center hover:bg-gray-700 transition-colors"
                      >
                        <item.icon className="w-6 h-6 text-white mb-2" strokeWidth={1.5} />
                        <span className="text-xs text-gray-300">{item.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button
                      to="/contact"
                      variant="primary"
                      size="lg"
                      iconRight={<ArrowRight className="w-5 h-5" />}
                      className="rounded-xl"
                      style={{
                        background: "linear-gradient(135deg, #dc2626 0%, #ea580c 100%)",
                      }}
                    >
                      Contact Us Today
                    </Button>
                    <Button
                      to="/services"
                      variant="secondary"
                      size="lg"
                      className="bg-white/10 text-white border border-white/20 hover:bg-white hover:text-gray-900 rounded-xl"
                    >
                      View Our Services
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
});

FinalCTA.displayName = 'FinalCTA';
export default FinalCTA;