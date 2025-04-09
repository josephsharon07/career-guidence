"use client"
import { useEffect, useState } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { supabase } from '@/lib/supabaseClient'
import { MBTIResult } from "./mbti-result";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress"
import { Card } from "@/components/ui/card"
import { Brain, ChevronRight } from "lucide-react";

const HomeComponent = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [userAge, setUserAge] = useState<number | null>(null);
  const [mbtiResult, setMbtiResult] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(true);

  useEffect(() => {
    async function fetchUserAge() {
      const user = await supabase.auth.getUser();
      if (user && user.data && user.data.user) {
        const id = user.data.user.id;
        setUserId(id);
        const { data, error } = await supabase
          .from('profiles')
          .select('date_of_birth')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching user age:', error);
        } else {
          const birthDate = new Date(data.date_of_birth);
          const age = new Date().getFullYear() - birthDate.getFullYear();
          setUserAge(age);
        }
      }
    }

    fetchUserAge();
  }, []);

  useEffect(() => {
    async function fetchQuestions() {
      if (userAge !== null) {
        const { data, error } = await supabase
          .from('mbti_questions')
          .select('*')
          .gte('age_to', userAge)
          .lte('age_from', userAge);

        if (error) {
          console.error('Error fetching questions:', error);
        } else {
          // Shuffle and select 20 random questions
          const shuffled = data.sort(() => 0.5 - Math.random());
          const selectedQuestions = shuffled.slice(0, 20);
          setQuestions(selectedQuestions);
        }
      }
    }

    fetchQuestions();
  }, [userAge]);

  interface Answers {
    [key: number]: number;
  }

  const handleAnswerChange = (questionId: number, value: number): void => {
    setAnswers((prevAnswers: Answers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };

  const handleSubmit = async () => {
    const resultArray: string[] = [];

    questions.forEach((question) => {
      const answer = answers[question.id];
      if (answer === 2 || answer === 1) {
        resultArray.push(question.trait_alpha);
      } else if (answer === -1 || answer === -2) {
        resultArray.push(question.trait_beta);
      } else if (answer === 0) {
        resultArray.push(question.trait_alpha, question.trait_beta);
      }
    });

    const mbti = calculateMBTI(resultArray);
    setMbtiResult(mbti);
    setShowQuiz(false);

    if (userId) {
      const { error } = await supabase
        .from('profiles')
        .update({ mbti_personality: mbti })
        .eq('id', userId);

      if (error) {
        console.error('Error updating MBTI personality:', error);
      } else {
        console.log('MBTI personality updated successfully');
      }
    }
  };

  interface Traits {
    E: number;
    I: number;
    S: number;
    N: number;
    T: number;
    F: number;
    J: number;
    P: number;
    [key: string]: number;
  }

  const calculateMBTI = (resultArray: string[]): string => {
    const traits: Traits = {
      E: 0,
      I: 0,
      S: 0,
      N: 0,
      T: 0,
      F: 0,
      J: 0,
      P: 0,
    };

    resultArray.forEach((trait) => {
      traits[trait]++;
    });

    const mbti = [
      traits.E >= traits.I ? 'E' : 'I',
      traits.S >= traits.N ? 'S' : 'N',
      traits.T >= traits.F ? 'T' : 'F',
      traits.J >= traits.P ? 'J' : 'P',
    ].join('');

    return mbti;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-4 md:p-8">
      <AnimatePresence mode="wait">
        {showQuiz ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="max-w-3xl mx-auto"
          >
            <Card className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-xl border border-purple-100">
              <div className="text-center space-y-6 mb-8">
                <div className="inline-flex items-center justify-center p-2 bg-purple-100 rounded-xl">
                  <Brain className="w-6 h-6 text-purple-600" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Personality Assessment
                </h1>
                <p className="text-slate-600 max-w-md mx-auto">
                  Answer these questions honestly to discover your MBTI personality type
                </p>
                
                <div className="w-full space-y-2">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Progress</span>
                    <span>{Object.keys(answers).length} of {questions.length} questions</span>
                  </div>
                  <Progress value={(Object.keys(answers).length / questions.length) * 100} className="h-2" />
                </div>
              </div>

              <div className="space-y-6">
                {questions.map((question, index) => (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-6 hover:shadow-md transition-all duration-300 border-purple-100">
                      <h2 className="text-xl font-semibold mb-6 text-slate-800 flex gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 text-sm font-bold">
                          {index + 1}
                        </span>
                        {question.question}
                      </h2>
                      <RadioGroup
                        className="grid grid-cols-1 md:grid-cols-5 gap-3"
                        onValueChange={(value) => handleAnswerChange(question.id, parseInt(value))}
                      >
                        {[
                          { value: "2", label: "Strongly Agree", color: "bg-green-50 hover:bg-green-100" },
                          { value: "1", label: "Agree", color: "bg-blue-50 hover:bg-blue-100" },
                          { value: "0", label: "Neutral", color: "bg-gray-50 hover:bg-gray-100" },
                          { value: "-1", label: "Disagree", color: "bg-orange-50 hover:bg-orange-100" },
                          { value: "-2", label: "Strongly Disagree", color: "bg-red-50 hover:bg-red-100" }
                        ].map((option) => (
                          <Label
                            key={option.value}
                            className={`flex items-center p-4 rounded-xl border-2 transition-all duration-200
                              ${answers[question.id]?.toString() === option.value 
                                ? 'border-purple-500 bg-purple-50' 
                                : `border-slate-200 ${option.color}`}
                            `}
                          >
                            <RadioGroupItem value={option.value} id={`q${question.id}-${option.value}`} />
                            <span className="ml-2 font-medium text-slate-700">{option.label}</span>
                          </Label>
                        ))}
                      </RadioGroup>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                className="mt-8"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleSubmit}
                  disabled={Object.keys(answers).length !== questions.length}
                  className="w-full py-6 text-lg font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 transition-all duration-200"
                >
                  Submit Assessment
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <MBTIResult result={mbtiResult} age={userAge || 0} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { HomeComponent };
