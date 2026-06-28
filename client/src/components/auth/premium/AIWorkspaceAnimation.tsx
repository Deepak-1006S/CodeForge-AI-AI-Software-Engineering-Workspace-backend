import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code2, 
  Sparkles, 
  GitBranch, 
  Terminal, 
  Zap, 
  Brain,
  CheckCircle2,
  Clock,
  FileCode,
  MessageSquare
} from 'lucide-react';

const codeSnippets = [
  {
    title: 'Building Authentication',
    lines: [
      'const authenticateUser = async () => {',
      '  const token = await generateJWT(user);',
      '  return { success: true, token };',
      '};'
    ],
    icon: Code2,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Optimizing Database Query',
    lines: [
      'db.users.aggregate([',
      '  { $match: { active: true } },',
      '  { $group: { _id: "$role", count: { $sum: 1 } } }',
      ']);'
    ],
    icon: Terminal,
    color: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Implementing AI Feature',
    lines: [
      'const generateSummary = async (data) => {',
      '  const response = await ai.analyze(data);',
      '  return response.insights;',
      '};'
    ],
    icon: Brain,
    color: 'from-emerald-500 to-teal-500',
  },
];

const tasks = [
  { text: 'Design authentication flow', status: 'completed' },
  { text: 'Implement JWT tokens', status: 'completed' },
  { text: 'Add OAuth providers', status: 'in-progress' },
  { text: 'Test edge cases', status: 'pending' },
];

const aiSuggestions = [
  'Consider adding rate limiting for security',
  'Optimize query performance with indexes',
  'Add error handling for edge cases',
  'Implement caching for better performance',
];

export const AIWorkspaceAnimation: React.FC = () => {
  const [currentSnippet, setCurrentSnippet] = useState(0);
  const [currentSuggestion, setCurrentSuggestion] = useState(0);
  const [typedLines, setTypedLines] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const snippetInterval = setInterval(() => {
      setCurrentSnippet((prev) => (prev + 1) % codeSnippets.length);
      setTypedLines([]);
      setIsTyping(true);
    }, 8000);

    return () => clearInterval(snippetInterval);
  }, []);

  useEffect(() => {
    const suggestionInterval = setInterval(() => {
      setCurrentSuggestion((prev) => (prev + 1) % aiSuggestions.length);
    }, 4000);

    return () => clearInterval(suggestionInterval);
  }, []);

  useEffect(() => {
    if (!isTyping) return;
    
    const snippet = codeSnippets[currentSnippet];
    if (typedLines.length < snippet.lines.length) {
      const timeout = setTimeout(() => {
        setTypedLines((prev) => [...prev, snippet.lines[prev.length]]);
      }, 400);
      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
    }
  }, [typedLines, currentSnippet, isTyping]);

  const CurrentIcon = codeSnippets[currentSnippet].icon;

  return (
    <div className="relative w-full h-full flex flex-col gap-4 p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-3"
      >
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${codeSnippets[currentSnippet].color} flex items-center justify-center shadow-lg`}>
          <CurrentIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-white font-semibold text-lg">CodeForge AI</h3>
          <p className="text-gray-400 text-sm">Your AI Programming Assistant</p>
        </div>
      </motion.div>

      {/* Code Editor Window */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex-1 rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 overflow-hidden shadow-2xl"
      >
        {/* Editor Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-900/80 border-b border-gray-800/50">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <FileCode className="w-4 h-4 text-gray-500 ml-2" />
            <AnimatePresence mode="wait">
              <motion.span
                key={currentSnippet}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="text-gray-400 text-sm font-medium"
              >
                {codeSnippets[currentSnippet].title}
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-emerald-500"
            />
            <span className="text-xs text-gray-500">AI Active</span>
          </div>
        </div>

        {/* Editor Content */}
        <div className="p-6 font-mono text-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSnippet}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-1"
            >
              {typedLines.map((line, index) => (
                <motion.div
                  key={`${currentSnippet}-${index}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-start gap-3"
                >
                  <span className="text-gray-600 select-none min-w-[2ch] text-right">{index + 1}</span>
                  <span className="text-gray-300">{line}</span>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="inline-block w-2 h-4 bg-blue-500 ml-[3.5rem]"
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* AI Suggestion Panel */}
        <div className="mx-4 mb-4 p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20">
          <div className="flex items-start gap-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0" />
            </motion.div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-purple-300">AI SUGGESTION</span>
                <Zap className="w-3 h-3 text-yellow-400" />
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentSuggestion}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-sm text-gray-300"
                >
                  {aiSuggestions[currentSuggestion]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Task List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="rounded-xl bg-gray-900/30 backdrop-blur-sm border border-gray-800/50 p-4 space-y-2"
      >
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-semibold text-gray-300">Active Tasks</span>
        </div>
        {tasks.map((task, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="flex items-center gap-3 group"
          >
            {task.status === 'completed' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            ) : task.status === 'in-progress' ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Clock className="w-4 h-4 text-blue-400 flex-shrink-0" />
              </motion.div>
            ) : (
              <div className="w-4 h-4 rounded-full border-2 border-gray-600 flex-shrink-0" />
            )}
            <span className={`text-sm ${task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-400'}`}>
              {task.text}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* Floating Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.5,
            ease: 'easeInOut',
          }}
          style={{
            left: `${Math.random() * 100}%`,
            bottom: 0,
          }}
        />
      ))}
    </div>
  );
};
