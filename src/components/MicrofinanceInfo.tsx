import React from 'react';
import { Lightbulb, TrendingUp, Users } from 'lucide-react';
import { MicrofinanceCard } from '../types';

const cards: MicrofinanceCard[] = [
  {
    title: 'What is Microfinance?',
    description: 'Microfinance provides financial services to entrepreneurs and small businesses who lack access to traditional banking services.',
    icon: 'Lightbulb',
  },
  {
    title: 'Why It Matters',
    description: 'It enables economic growth, reduces poverty, and creates opportunities for underserved communities to build sustainable businesses.',
    icon: 'TrendingUp',
  },
  {
    title: 'Community Impact',
    description: 'Join a network of entrepreneurs sharing knowledge, resources, and success stories to help each other grow.',
    icon: 'Users',
  },
];

const IconComponent = (iconName: string) => {
  switch (iconName) {
    case 'Lightbulb':
      return <Lightbulb className="h-6 w-6" />;
    case 'TrendingUp':
      return <TrendingUp className="h-6 w-6" />;
    case 'Users':
      return <Users className="h-6 w-6" />;
    default:
      return null;
  }
};

export default function MicrofinanceInfo() {
  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-yellow-400 font-semibold tracking-wide uppercase">Our Mission</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Understanding Microfinance
          </p>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <div
                key={card.title}
                className="pt-6 transform hover:scale-105 transition-transform duration-200"
              >
                <div className="flow-root bg-white rounded-lg px-6 pb-8 h-full shadow-lg">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-yellow-400 rounded-md shadow-lg">
                        {IconComponent(card.icon)}
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      {card.title}
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
