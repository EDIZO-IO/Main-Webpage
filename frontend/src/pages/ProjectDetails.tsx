import React from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  ArrowLeft,
  Check,
  Users,
  BarChart2,
  Cpu,
  Clock,
  ArrowRight
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import AnimatedSection from '../components/common/AnimatedSection';
import { projects } from './Projects'; // Import the projects array

const ProjectDetails: React.FC = () => {
  const { id } = useParams();
  const project = projects.find((p) => p.id === id);

  // If project not found, display a message
  if (!project) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Project Not Found</h2>
          <p className="text-lg text-gray-600 mb-6">
            The project you're looking for doesn't exist or may have been moved.
          </p>
          <Link 
            to="/projects" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <ArrowLeft className="mr-2" size={18} />
            Back to Projects
          </Link>
        </div>
      </section>
    );
  }

  // Set dynamic page title based on the project title
  React.useEffect(() => {
    document.title = `${project.title} | Our Projects`;
  }, [project.title]);

  // Filter for related projects (excluding the current project)
  // Logic: Find projects in the same category or sharing at least one technology
  const relatedProjects = projects.filter(p => 
    p.id !== project.id && // Exclude the current project
    (p.category === project.category || // Same category
     p.tech.some(tech => project.tech.includes(tech))) // Share at least one technology
  ).slice(0, 3); // Limit to 3 related projects

  return (
    <>
      {/* Page Header Component for Project Details */}
      <PageHeader
        title={project.title}
        subtitle={project.category}
        backgroundImage={project.image}
        className="bg-gradient-to-r from-blue-800 to-purple-900"
      />
     
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-2/3">
              <AnimatedSection>
                <div className="mb-8">
                  {/* Back to Projects Link */}
                  <Link 
                    to="/projects" 
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
                  >
                    <ArrowLeft className="mr-1" size={18} />
                    Back to Projects
                  </Link>
                  
                  {/* Project Title and Short Description */}
                  <div className="flex items-center mb-6">
                    <div className="mr-4">
                      {project.icon} {/* Project specific icon */}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">{project.title}</h2>
                      <p className="text-lg text-gray-600">{project.shortDescription}</p>
                    </div>
                  </div>

                  {/* Full Project Description */}
                  <div className="prose max-w-none text-gray-700 mb-8">
                    <p>{project.fullDescription}</p>
                  </div>

                  {/* Project Highlights and Key Results Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {/* Project Highlights */}
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <h3 className="text-xl font-semibold mb-4 flex items-center">
                        <Users className="mr-2 text-blue-600" size={20} />
                        Project Highlights
                      </h3>
                      <ul className="space-y-3">
                        {project.features.map((feature, i) => (
                          <li key={i} className="flex items-start">
                            <Check className="text-green-500 mr-2 mt-1 flex-shrink-0" size={16} />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Key Results */}
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <h3 className="text-xl font-semibold mb-4 flex items-center">
                        <BarChart2 className="mr-2 text-blue-600" size={20} />
                        Key Results
                      </h3>
                      <p className="text-gray-700">{project.results}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>

            {/* Project Details Sidebar */}
            <div className="lg:w-1/3">
              <AnimatedSection delay={0.2}>
                <div className="bg-gray-50 rounded-xl p-6 sticky top-6 shadow-sm border border-gray-200">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-4">Project Details</h3>
                    <div className="space-y-4">
                      {/* Location */}
                      <div className="flex items-start">
                        <div className="mr-3 mt-1 text-gray-500">
                          <MapPin size={18} />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Location</h4>
                          <p className="text-gray-600">{project.location}</p>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="flex items-start">
                        <div className="mr-3 mt-1 text-gray-500">
                          <Calendar size={18} />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Timeline</h4>
                          <p className="text-gray-600">{project.timeline}</p>
                        </div>
                      </div>

                      {/* Technologies */}
                      <div className="flex items-start">
                        <div className="mr-3 mt-1 text-gray-500">
                          <Cpu size={18} />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Technologies</h4>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {project.tech.map((tech, i) => (
                              <span key={i} className="bg-white text-gray-800 text-xs px-2 py-1 rounded border">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Challenges */}
                      <div className="flex items-start">
                        <div className="mr-3 mt-1 text-gray-500">
                          <Clock size={18} />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Challenges</h4>
                          <p className="text-gray-600">{project.challenges}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Project Gallery (Placeholder) */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-xl font-semibold mb-4">Project Gallery</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="aspect-w-1 aspect-h-1">
                        <img 
                          src={project.image} 
                          alt={project.title} 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                        +2 More
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>

          {/* Related Projects Section */}
          {relatedProjects.length > 0 && (
            <div className="mt-20">
              <AnimatedSection>
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Related Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {relatedProjects.map((relatedProject) => (
                    <Link 
                      to={`/projects/${relatedProject.id}`} 
                      key={relatedProject.id}
                      className="block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 group"
                    >
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={relatedProject.image}
                          alt={relatedProject.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60" />
                        <div className="absolute bottom-3 left-3">
                          <span className="bg-white text-gray-900 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                            {relatedProject.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {relatedProject.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">{relatedProject.shortDescription}</p>
                        <div className="flex items-center text-sm text-blue-600 group-hover:text-blue-800 font-medium">
                          View Details <ArrowRight className="ml-1" size={16} />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </AnimatedSection>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ProjectDetails;
