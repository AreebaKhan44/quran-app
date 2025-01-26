import React from "react";
import { useState, useEffect } from "react";
import { Howl } from "howler";

interface Reciter {
  name: string;
  country: string;
}

// Sample reciters data
const recitersData: Reciter[] = [
  { name: "Abdul Basit", country: "Egypt" },
  { name: "Ali Jaber", country: "Saudi Arabia" },
  { name: "Mahmood Khalil Al-Husary", country: "Egypt" },
  { name: "Abu Bakr Ash-Shatri", country: "Yemen" },
  { name: "Saad Al-Ghamdi", country: "Saudi Arabia" },
];

const recitations: Record<string, string> = {
  "Abdul Basit": "/recitations/abdul_basit.mp3",
  "Ali Jaber": "/recitations/ali_jaber.mp3",
  "Mahmood Khalil Al-Husary": "/recitations/mahmood_khalil_al_husary.mp3",
  "Abu Bakr Ash-Shatri": "/recitations/abu_bakr_ash_shatri.mp3",
  "Saad Al-Ghamdi": "/recitations/saad_al_ghamdi.mp3",
};

const App: React.FC = () => {
  const [recitersByCountry, setRecitersByCountry] = useState<Record<string, Reciter[]>>({});
  const [currentReciter, setCurrentReciter] = useState<string | null>(null);

  useEffect(() => {
    // Classify reciters by country
    const classified: Record<string, Reciter[]> = {};
    recitersData.forEach((reciter) => {
      if (!classified[reciter.country]) {
        classified[reciter.country] = [];
      }
      classified[reciter.country].push(reciter);
    });
    setRecitersByCountry(classified);
  }, []);

  const playRecitation = (reciterName: string) => {
    const audioPath = recitations[reciterName];
    if (audioPath) {
      const sound = new Howl({ src: [audioPath] });
      sound.play();
      setCurrentReciter(reciterName);
    } else {
      console.error("Audio file not found for", reciterName);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Reciters by Country</h1>
      <div className="space-y-4">
        {Object.keys(recitersByCountry).map((country) => (
          <div key={country} className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold">{country}</h2>
            <ul className="list-disc list-inside mt-2">
              {recitersByCountry[country].map((reciter) => (
                <li key={reciter.name} className="flex justify-between items-center">
                  <span>{reciter.name}</span>
                  <button
                    onClick={() => playRecitation(reciter.name)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                  >
                    Play
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {currentReciter && (
        <div className="mt-4 text-green-500">
          Now playing: {currentReciter}
        </div>
      )}
    </div>
  );
};

export default App;
