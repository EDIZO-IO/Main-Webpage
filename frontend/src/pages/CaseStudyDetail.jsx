import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Users, TrendingUp, Shield, Gamepad, Truck, Award, Clock, Target, Zap } from 'lucide-react';

const CaseStudyDetail = () => {
  const { id } = useParams();
  
  // Sample case study data
  const caseStudies = {
    'redcap-logistics': {
      id: 'redcap-logistics',
      title: 'RedCap Logistics: Goods Transport Solution',
      client: 'RedCap Logistics',
      industry: 'Logistics & Transportation',
      timeline: '6 months',
      outcome: '40% reduction in delivery time tracking errors',
      impact: '500+ drivers and 50+ admin staff using the platform',
      technologies: ['Flutter', 'React', 'Firebase', 'Node.js'],
      challenge: 'A major logistics company needed a comprehensive solution to manage their fleet of trucks and drivers, track deliveries in real-time, and provide customers with accurate delivery updates. The existing system was manual and error-prone, leading to customer dissatisfaction and operational inefficiencies.',
      solution: 'We developed a dual-platform solution consisting of a mobile app for drivers and a web dashboard for administrators. The mobile app allows drivers to log deliveries, update status, and communicate with dispatch in real-time. The web dashboard provides administrators with live tracking, analytics, and reporting capabilities.',
      results: [
        '40% reduction in delivery time tracking errors',
        '30% improvement in customer satisfaction scores',
        '25% decrease in fuel costs due to optimized routes',
        '500+ drivers actively using the platform daily',
        '99.9% uptime reliability achieved'
      ],
      image: '/src/assets/project/redcap.png',
      metrics: [
        { label: 'Drivers Onboarded', value: '500+' },
        { label: 'Admin Staff', value: '50+' },
        { label: 'Delivery Accuracy', value: '98%' },
        { label: 'Time Saved', value: '40%' }
      ]
    },
    'cybersecurity': {
      id: 'cybersecurity',
      title: 'AI-Based Ransomware Detection System',
      client: 'Enterprise Security Solutions',
      industry: 'Cybersecurity',
      timeline: '8 months',
      outcome: '99.8% detection accuracy rate for ransomware threats',
      impact: '1000+ enterprise endpoints protected',
      technologies: ['Python', 'TensorFlow', 'Flask', 'Machine Learning'],
      challenge: 'With ransomware attacks increasing by 41% in 2023, enterprises needed a proactive solution to detect and prevent attacks before they could encrypt critical data. Traditional signature-based systems were ineffective against new variants.',
      solution: 'We built an AI-powered detection system using deep learning algorithms that analyze file behavior patterns, network traffic, and system processes in real-time. The system creates behavioral profiles and flags anomalies that indicate potential ransomware activity.',
      results: [
        '99.8% detection accuracy rate',
        'Less than 0.2% false positive rate',
        'Real-time threat prevention',
        'Compatible with 1000+ enterprise endpoints',
        'Zero downtime during deployment'
      ],
      image: '/src/assets/project/Ransomware.png',
      metrics: [
        { label: 'Accuracy Rate', value: '99.8%' },
        { label: 'Endpoints Protected', value: '1000+' },
        { label: 'False Positives', value: '<0.2%' },
        { label: 'Response Time', value: '<1 sec' }
      ]
    },
    'face-guard': {
      id: 'face-guard',
      title: 'FaceGuard-GAN Deepfake Detection',
      client: 'Digital Verification Corp',
      industry: 'AI & Computer Vision',
      timeline: '7 months',
      outcome: '95% accuracy in detecting deepfake content',
      impact: 'Processed 1M+ media files for verification',
      technologies: ['Python', 'PyTorch', 'GANs', 'Computer Vision'],
      challenge: 'The rise of deepfake technology posed serious threats to identity verification, news authenticity, and digital trust. Organizations needed reliable tools to distinguish between real and synthetic media.',
      solution: 'We developed a GAN-based detection system that analyzes micro-patterns, compression artifacts, and facial inconsistencies that are invisible to the human eye. The system uses ensemble methods combining multiple neural networks for enhanced accuracy.',
      results: [
        '95% accuracy in deepfake detection',
        'Process 1000+ videos per hour',
        'Integration with existing verification workflows',
        'Support for multiple video formats',
        'API for third-party integrations'
      ],
      image: '/src/assets/project/face-Guard.png',
      metrics: [
        { label: 'Detection Accuracy', value: '95%' },
        { label: 'Videos Processed', value: '1M+' },
        { label: 'Processing Speed', value: '1000/hr' },
        { label: 'Supported Formats', value: '10+' }
      ]
    },
    'epic-nexus': {
      id: 'epic-nexus',
      title: 'Epic Nexus Gaming Community Platform',
      client: 'GamerConnect Inc',
      industry: 'Gaming & Entertainment',
      timeline: '10 months',
      outcome: '50k+ registered users in first year',
      impact: 'Increased user engagement by 150%',
      technologies: ['React', 'Node.js', 'MongoDB', 'WebSockets'],
      challenge: 'Gamers needed a centralized platform to connect, share content, participate in tournaments, and interact with their favorite streamers. Existing platforms were fragmented and lacked community features.',
      solution: 'We built a comprehensive gaming community platform with live streaming, tournament management, social features, content creation tools, and monetization options for creators. The platform supports cross-game integration and real-time interactions.',
      results: [
        '50k+ registered users in first year',
        '150% increase in user engagement',
        '500+ tournaments hosted monthly',
        '100+ content creators on platform',
        '99.5% uptime during peak hours'
      ],
      image: '/src/assets/project/Epic-nexus.png',
      metrics: [
        { label: 'Registered Users', value: '50k+' },
        { label: 'Engagement Increase', value: '150%' },
        { label: 'Tournaments', value: '500+/mo' },
        { label: 'Content Creators', value: '100+' }
      ]
    }
  };

  const caseStudy = caseStudies[id] || caseStudies['redcap-logistics'];

  return (
    <div className="min-h-screen bg-gray-50 pt-12">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link
              to="/projects"
              className="inline-flex items-center text-edizo-red hover:text-red-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center flex-grow mx-4">{caseStudy.title}</h1>
            <div className="w-24"></div> {/* Spacer for alignment */}
          </div>
          <p className="text-lg text-gray-600 mt-2 text-center">{caseStudy.client} • {caseStudy.industry}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Overview */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-r from-edizo-red to-orange-500 p-3 rounded-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Project Overview</h2>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  {caseStudy.metrics.map((metric, index) => (
                    <div key={index} className="text-center p-4 bg-gray-50 rounded-xl">
                      <div className="text-2xl font-bold text-edizo-red">{metric.value}</div>
                      <div className="text-sm text-gray-600">{metric.label}</div>
                    </div>
                  ))}
                </div>
                <div className="prose prose-lg max-w-none">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Timeline & Outcome</h3>
                  <p className="text-gray-700 mb-4"><strong>Duration:</strong> {caseStudy.timeline}</p>
                  <p className="text-gray-700 mb-4"><strong>Outcome:</strong> {caseStudy.outcome}</p>
                  <p className="text-gray-700"><strong>Impact:</strong> {caseStudy.impact}</p>
                </div>
              </div>
            </section>

            {/* Challenge & Solution */}
            <section>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-red-100 p-2 rounded-lg">
                      <Shield className="w-5 h-5 text-red-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">The Challenge</h3>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <p className="text-gray-700 leading-relaxed">{caseStudy.challenge}</p>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Zap className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Our Solution</h3>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <p className="text-gray-700 leading-relaxed">{caseStudy.solution}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Results */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Results & Impact</h2>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <ul className="space-y-4">
                  {caseStudy.results.map((result, index) => (
                    <li key={index} className="flex items-start">
                      <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
                        <Star className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-gray-700">{result}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Project Image */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Preview</h3>
              <img 
                src={caseStudy.image} 
                alt={caseStudy.title} 
                className="w-full h-64 object-contain rounded-xl bg-gray-100 p-4"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden items-center justify-center h-64 bg-gray-100 rounded-xl text-gray-500">
                Project Image
              </div>
            </div>

            {/* Technologies */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {caseStudy.technologies.map((tech, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-gradient-to-r from-edizo-red to-orange-500 text-white text-sm rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Client Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Information</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Users className="w-4 h-4 text-gray-500 mr-3" />
                  <span className="text-gray-700">{caseStudy.client}</span>
                </div>
                <div className="flex items-center">
                  <Award className="w-4 h-4 text-gray-500 mr-3" />
                  <span className="text-gray-700">{caseStudy.industry}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-gray-500 mr-3" />
                  <span className="text-gray-700">{caseStudy.timeline}</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-edizo-red to-orange-500 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Ready to Start Your Project?</h3>
              <p className="text-white/90 text-sm mb-4">Let's discuss how we can help achieve similar results for your business.</p>
              <Link 
                to="/contact" 
                className="inline-block w-full bg-white text-edizo-red text-center py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseStudyDetail;