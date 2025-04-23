import React from 'react';
import { Sparkles, Users, Sword, CheckCircle, Star } from 'lucide-react'; 

const Instructions = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white p-6">
      <div className="bg-gradient-to-b from-green-300 via-teal-400 to-teal-600  w-full max-w-2xl bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20">
        <h1 className="text-4xl font-bold text-center mb-6 text-white tracking-wide">
          How to Play
        </h1>

        <div className="space-y-4">
          <InstructionStep
            icon={<Sparkles />}
            title="Step 1: Browse Pokémon"
            description="Explore the dashboard to see different Pokémon and their types."
          />
          <InstructionStep
            icon={<Users />}
            title="Step 2: Select Your Team"
            description="Choose 6 of your favorite Pokémon to form your battle team."
          />
          <InstructionStep
            icon={<Sword />}
            title="Step 3: Enter the Battle"
            description="Navigate to the battle arena once your team is ready."
          />
          <InstructionStep
            icon={<CheckCircle />}
            title="Step 4: Start the Battle"
            description='Click "Start Battle" to begin and try to win 6 rounds.'
          />
          <InstructionStep
            icon={<Star />}
            title="Step 5: Victory"
            description="Defeat your opponent by knocking out 6 of their Pokémon!"
          />
        </div>

        <p className="text-center mt-6 text-white font-semibold text-lg">
          Good luck and have fun, Trainer!
        </p>
      </div>
    </div>
  );
};

const InstructionStep = ({ icon, title, description }) => (
  <div className="flex items-start gap-4 bg-white/5 p-4 rounded-xl shadow-inner border border-white/10">
    <div className="text-teal-200 bg-white/10 p-2 rounded-full">{icon}</div>
    <div>
      <h2 className="font-bold text-lg mb-1">{title}</h2>
      <p className="text-sm text-white/80">{description}</p>
    </div>
  </div>
);

export default Instructions;
