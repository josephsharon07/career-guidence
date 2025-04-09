"use client"
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Brain, Star, AlertTriangle, Compass, BookOpen, Youtube, Book } from 'lucide-react';

interface MBTIInfo {
  trait: string;
  info: string;
  strengths: string;
  challenges: string;
  future_pathways: string;
  mini_scenario: string;
  trait_: string;
}

interface Video {
  trait: string;
  video_id: string;
}

interface Book {
  trait: string;
  isbn: string | null;
  name: string | null;
  author: any | null;
  url: string | null;
  pages: number | null;
  cover: string | null;
}

interface MBTIResultProps {
  result: string;
  age: number;
}

const getMBTIFullForm = (type: string) => {
  const traits = {
    I: 'Introverted',
    E: 'Extroverted',
    N: 'Intuitive',
    S: 'Sensing',
    T: 'Thinking',
    F: 'Feeling',
    J: 'Judging',
    P: 'Perceiving'
  };
  
  return type.split('').map(char => traits[char as keyof typeof traits]).join(' ');
};

const MBTITraits = {
  E: { name: 'Extroversion', desc: 'Draw energy from social interactions', color: 'from-amber-500 to-orange-600' },
  I: { name: 'Introversion', desc: 'Draw energy from quiet reflection', color: 'from-blue-500 to-indigo-600' },
  S: { name: 'Sensing', desc: 'Focus on concrete facts and details', color: 'from-green-500 to-emerald-600' },
  N: { name: 'Intuition', desc: 'Focus on patterns and possibilities', color: 'from-purple-500 to-violet-600' },
  T: { name: 'Thinking', desc: 'Make decisions based on logic', color: 'from-sky-500 to-cyan-600' },
  F: { name: 'Feeling', desc: 'Make decisions based on emotions', color: 'from-rose-500 to-pink-600' },
  J: { name: 'Judging', desc: 'Prefer structure and planning', color: 'from-teal-500 to-cyan-600' },
  P: { name: 'Perceiving', desc: 'Prefer flexibility and spontaneity', color: 'from-fuchsia-500 to-pink-600' }
};

const TraitCard = ({ letter, index }: { letter: string; index: number }) => {
  const trait = MBTITraits[letter as keyof typeof MBTITraits];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative overflow-hidden"
    >
      <div className={`p-6 rounded-2xl bg-gradient-to-br ${trait.color} text-white shadow-xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl`}>
        <div className="flex items-start gap-4">
          <div className="text-4xl font-bold bg-white/20 w-14 h-14 flex items-center justify-center rounded-xl">
            {letter}
          </div>
          <div className="space-y-1">
            <div className="font-bold text-xl">{trait.name}</div>
            <div className="text-sm text-white/90">{trait.desc}</div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
};

const InfoCard = ({ icon: Icon, title, content, color, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="h-full"
  >
    <Card className="h-full p-6 bg-white/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-2 hover:border-purple-200">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2.5 rounded-xl ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      </div>
      <div className="text-gray-600 leading-relaxed prose prose-sm max-w-none">
        {content}
      </div>
    </Card>
  </motion.div>
);

const MBTIResult = ({ result, age }: MBTIResultProps) => {
  const [mbtiInfo, setMbtiInfo] = useState<MBTIInfo | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [showTraitDetails, setShowTraitDetails] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const [mbtiResponse, videosResponse, booksResponse] = await Promise.all([
        supabase
          .from('mbti_info')
          .select('*')
          .eq('trait', result)
          .gte('age_to', age)
          .lte('age_from', age)
          .single(),
        supabase
          .from('mbti_videos')
          .select('*')
          .eq('trait', result),
        supabase
          .from('book_suggestions')
          .select('*')
          .eq('trait', result)
      ]);

      if (mbtiResponse.error) {
        console.error('Error fetching MBTI info:', mbtiResponse.error);
      } else {
        setMbtiInfo(mbtiResponse.data);
        setShowTraitDetails(true);
      }

      if (!videosResponse.error) {
        setVideos(videosResponse.data || []);
      }

      if (!booksResponse.error) {
        setBooks(booksResponse.data || []);
      }
    }

    if (result) {
      fetchData();
    }
  }, [result, age]);

  if (!mbtiInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center">
        <motion.div 
          className="text-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-purple-200 opacity-25"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-purple-600 animate-spin"></div>
          </div>
          <p className="text-lg text-gray-600 font-medium">Analyzing your personality profile...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <div className="max-w-6xl mx-auto p-6 lg:p-12 space-y-12">
        <motion.div 
          className="text-center space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="inline-flex items-center justify-center p-4 bg-purple-100 rounded-2xl"
          >
            <Brain className="w-10 h-10 text-purple-600" />
          </motion.div>
          
          <div className="space-y-6">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
            >
              {result}
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="inline-block bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full text-xl font-medium text-gray-800 shadow-lg border-2 border-purple-100"
            >
              {mbtiInfo.trait_}
            </motion.div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {result.split('').map((letter, index) => (
            <TraitCard key={letter} letter={letter} index={index} />
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <InfoCard
            icon={BookOpen}
            title="About You"
            content={mbtiInfo.info}
            color="bg-blue-100 text-blue-600"
            delay={0.6}
          />
          <InfoCard
            icon={Star}
            title="Your Strengths"
            content={mbtiInfo.strengths}
            color="bg-green-100 text-green-600"
            delay={0.7}
          />
          <InfoCard
            icon={AlertTriangle}
            title="Growth Areas"
            content={mbtiInfo.challenges}
            color="bg-orange-100 text-orange-600"
            delay={0.8}
          />
          <InfoCard
            icon={Compass}
            title="Future Pathways"
            content={mbtiInfo.future_pathways}
            color="bg-violet-100 text-violet-600"
            delay={0.9}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <Card className="p-8 bg-white/90 backdrop-blur-sm border-2 border-purple-100 hover:border-purple-200 transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-purple-100">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Personal Scenario</h3>
            </div>
            <p className="text-gray-600 leading-relaxed text-lg italic">
              "{mbtiInfo.mini_scenario}"
            </p>
          </Card>
        </motion.div>

        {videos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <Card className="p-8 bg-white/90 backdrop-blur-sm border-2 border-purple-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-red-100">
                  <Youtube className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Recommended Videos</h3>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {videos.map((video) => (
                  <div key={video.video_id} className="aspect-video">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${video.video_id}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-xl shadow-lg"
                    ></iframe>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {books.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <Card className="p-8 bg-white/90 backdrop-blur-sm border-2 border-purple-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-amber-100">
                  <Book className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Recommended Books</h3>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {books.map((book) => (
                  <a
                    key={book.isbn}
                    href={book.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group transform transition-all duration-300 hover:scale-105"
                  >
                    <div className="space-y-3">
                      {book.cover && (
                        <div className="aspect-[2/3] overflow-hidden rounded-lg shadow-lg">
                          <img
                            src={book.cover}
                            alt={book.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="space-y-1">
                        <h4 className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
                          {book.name}
                        </h4>
                        {book.author && (
                          <p className="text-sm text-gray-600">
                            by {typeof book.author === 'string' ? book.author : book.author.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export { MBTIResult };