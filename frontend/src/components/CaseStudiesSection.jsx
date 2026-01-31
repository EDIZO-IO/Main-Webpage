import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Users, Clock, Award, Code, Palette, Smartphone, Globe, Shield, Eye } from 'lucide-react';

const CaseStudiesSection = () => {
  const caseStudies = [
    {
      id: 1,
      title: "RedCap Logistics: Goods Transport Solution",
      client: "RedCap Logistics",
      industry: "Transportation & Logistics",
      challenge: "Develop a comprehensive platform for goods transport with real-time tracking",
      solution: "Mobile app for drivers and web dashboard for administrators using Flutter and React",
      results: [
        "40% reduction in delivery time tracking errors",
        "30% improvement in customer satisfaction scores",
        "25% decrease in fuel costs due to optimized routes"
      ],
      timeline: "3 months",
      impact: "500+ drivers and 50+ admin staff using the platform",
      image: "/src/assets/project/redcap.png",
      technologies: ["Flutter", "React", "Firebase"],
      category: "App Development"
    },
    {
      id: 2,
      title: "AI-Based Ransomware Detection System",
      client: "Enterprise Security",
      industry: "Cybersecurity",
      challenge: "Build an AI-powered system to detect and prevent ransomware attacks in real-time",
      solution: "Machine learning algorithms analyzing file behavior patterns and system processes",
      results: [
        "99.8% detection accuracy rate",
        "Less than 0.2% false positive rate",
        "Real-time threat prevention"
      ],
      timeline: "2 months",
      impact: "1000+ enterprise endpoints protected",
      image: "/src/assets/project/Ransomware.png",
      technologies: ["Python", "TensorFlow", "Flask", "ML"],
      category: "Cybersecurity"
    },
    {
      id: 3,
      title: "FaceGuard-GAN Deepfake Detection",
      client: "Digital Verification Corp",
      industry: "AI & Computer Vision",
      challenge: "Create a system to detect deepfake content using advanced AI techniques",
      solution: "GAN-based detection system analyzing micro-patterns and facial inconsistencies",
      results: [
        "95% accuracy in deepfake detection",
        "Process 1000+ videos per hour",
        "API for third-party integrations"
      ],
      timeline: "3 months",
      impact: "Processed 1M+ media files for verification",
      image: "/src/assets/project/face-Guard.png",
      technologies: ["Python", "PyTorch", "GANs", "Computer Vision"],
      category: "AI Development"
    },
    {
      id: 4,
      title: "Epic Nexus Gaming Community Platform",
      client: "GamerConnect Inc",
      industry: "Gaming & Entertainment",
      challenge: "Build a centralized platform for gamers to connect, share, and compete",
      solution: "Comprehensive gaming platform with live streaming, tournaments, and social features",
      results: [
        "50k+ registered users in first year",
        "150% increase in user engagement",
        "500+ tournaments hosted monthly"
      ],
      timeline: "2 months",
      impact: "Increased user engagement by 150%",
      image: "/src/assets/project/Epic-nexus.png",
      technologies: ["React", "Node.js", "MongoDB", "WebSockets"],
      category: "Web Development"
    }
  ];

  // Technology icons mapping
  const getIconForCategory = (category) => {
    switch(category) {
      case "App Development":
        return <Smartphone className="w-6 h-6" />;
      case "Cybersecurity":
        return <Shield className="w-6 h-6" />;
      case "AI Development":
        return <Eye className="w-6 h-6" />;
      case "Web Development":
        return <Code className="w-6 h-6" />;
      default:
        return <Globe className="w-6 h-6" />;
    }
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-edizo-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-edizo-black mb-4">
            Featured Projects
          </h2>
          <p className="text-xl text-edizo-gray-700 max-w-3xl mx-auto">
            Real-world solutions that transformed businesses and delivered measurable results
          </p>
        </div>

        <div className="space-y-16">
          {caseStudies.map((study) => (
            <div
              key={study.id}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-edizo-gray-200"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-edizo-red rounded-lg text-white">
                    {getIconForCategory(study.category)}
                  </div>
                  <span className="inline-block bg-edizo-red text-white px-4 py-2 rounded-full text-sm font-medium">
                    {study.category}
                  </span>
                </div>

                <h3 className="text-3xl font-bold text-edizo-black mb-4">
                  {study.title}
                </h3>

                <div className="mb-6">
                  <h4 className="text-xl font-semibold text-edizo-red mb-3">
                    {study.client} • {study.industry}
                  </h4>
                  <p className="text-gray-700 mb-4">
                    <span className="font-semibold text-edizo-black">Challenge:</span> {study.challenge}
                  </p>
                  <p className="text-gray-700 mb-4">
                    <span className="font-semibold text-edizo-black">Solution:</span> {study.solution}
                  </p>
                </div>

                <div className="mb-6">
                  <h5 className="font-semibold text-edizo-black mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    Key Results:
                  </h5>
                  <ul className="space-y-2">
                    {study.results.map((result, index) => (
                      <li key={index} className="flex items-start">
                        <TrendingUp className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-edizo-red mr-2" />
                    <span className="text-sm text-gray-600"><span className="font-semibold">Duration:</span> {study.timeline}</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="w-5 h-5 text-edizo-red mr-2" />
                    <span className="text-sm text-gray-600"><span className="font-semibold">Impact:</span> {study.impact}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h5 className="font-semibold text-edizo-black mb-2">Technologies Used:</h5>
                  <div className="flex flex-wrap gap-2">
                    {study.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  to={`/casestudy/${study.id === 1 ? 'redcap-logistics' : study.id === 2 ? 'cybersecurity' : study.id === 3 ? 'face-guard' : 'epic-nexus'}`}
                  className="inline-flex items-center bg-gradient-to-r from-edizo-red to-orange-500 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity duration-300"
                >
                  View Full Case Study
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>

              <div className="flex justify-center">
                <div className="relative">
                  <img
                    src={study.image}
                    alt={study.title}
                    className="rounded-2xl shadow-lg w-full max-w-md h-auto object-contain bg-gray-100 p-4"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-2xl hidden">
                    <div className="text-center p-4">
                      <div className="mx-auto bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center mb-2" />
                      <p className="text-gray-500">Project Image</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex flex-wrap justify-center gap-6 md:gap-8 bg-white p-6 rounded-2xl shadow-lg">
            <div className="text-center min-w-[120px]">
              <div className="text-3xl font-bold text-edizo-red">10+</div>
              <div className="text-sm text-edizo-gray-600">Projects</div>
            </div>
            <div className="text-center min-w-[120px]">
              <div className="text-3xl font-bold text-edizo-red">98%</div>
              <div className="text-sm text-edizo-gray-600">Client Satisfaction</div>
            </div>
            <div className="text-center min-w-[120px]">
              <div className="text-3xl font-bold text-edizo-red">4.9/5</div>
              <div className="text-sm text-edizo-gray-600">Average Rating</div>
            </div>
            <div className="text-center min-w-[120px]">
              <div className="text-3xl font-bold text-edizo-red">10+</div>
              <div className="text-sm text-edizo-gray-600">Clients</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudiesSection;