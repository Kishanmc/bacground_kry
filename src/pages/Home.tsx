import React from 'react';
import { Link } from 'react-router-dom';
import { FlaskRound as Flask, Atom, Brain } from 'lucide-react';

const SubjectCard = ({ icon: Icon, title, description, link }: {
  icon: React.ElementType;
  title: string;
  description: string;
  link: string;
}) => (
  <Link to={link} className="bg-white rounded-xl shadow-xl p-6 transform transition-transform hover:scale-105">
    <div className="flex flex-col items-center text-center">
      <Icon className="h-16 w-16 text-blue-600 mb-4" />
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </Link>
);

const Home = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Virtual Lab
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience hands-on learning through interactive 3D simulations
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <SubjectCard
            icon={Flask}
            title="Chemistry Lab"
            description="Explore chemical reactions in a safe, virtual environment with interactive 3D experiments"
            link="/chemistry"
          />
          <SubjectCard
            icon={Atom}
            title="Physics Lab"
            description="Discover the laws of physics through immersive simulations and experiments"
            link="/physics"
          />
          <SubjectCard
            icon={Brain}
            title="Biology Lab"
            description="Study life sciences with detailed 3D models and interactive dissections"
            link="/biology"
          />
        </div>

        <div className="mt-16">
          <img
            src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=2000"
            alt="Laboratory"
            className="rounded-xl shadow-2xl w-full h-[400px] object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;