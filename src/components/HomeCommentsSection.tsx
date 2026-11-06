import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Heart, 
  ShieldCheck, 
  HelpCircle, 
  Sparkles, 
  Lightbulb, 
  Filter, 
  User,
  MessagesSquare
} from 'lucide-react';
import { HomeComment } from '../types/project';

interface HomeCommentsSectionProps {
  comments: HomeComment[];
  onAddComment: (comment: Omit<HomeComment, 'id' | 'createdAt' | 'likes'>) => void;
  onLikeComment: (commentId: string) => void;
  isCreatorMode: boolean;
}

export const HomeCommentsSection: React.FC<HomeCommentsSectionProps> = ({
  comments,
  onAddComment,
  onLikeComment,
  isCreatorMode
}) => {
  const [authorName, setAuthorName] = useState(isCreatorMode ? 'Pusparani Biswal' : '');
  const [authorRole, setAuthorRole] = useState<HomeComment['authorRole']>(isCreatorMode ? 'Creator' : 'Visitor');
  const [topic, setTopic] = useState<HomeComment['topic']>('Question to Creator');
  const [message, setMessage] = useState('');
  const [filterTopic, setFilterTopic] = useState<string>('All');
  const [successNotice, setSuccessNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !authorName.trim()) return;

    onAddComment({
      authorName: authorName.trim(),
      authorRole: isCreatorMode ? 'Creator' : authorRole,
      topic,
      isCreator: isCreatorMode || authorName.toLowerCase().includes('pusparani'),
      message: message.trim()
    });

    setMessage('');
    setSuccessNotice(true);
    setTimeout(() => setSuccessNotice(false), 3000);
  };

  const filteredComments = filterTopic === 'All' 
    ? comments 
    : comments.filter(c => c.topic === filterTopic);

  const quickPrompts = [
    'Can you post an active power filter schematic?',
    'What formula did you use for the inverter LC filter cutoff?',
    'Great collection! Can you do an electric vehicle battery balancer?',
    'Thank you Pusparani for sharing the Arduino code!'
  ];

  return (
    <div className="space-y-6">
      
      {/* Community Banner & Submission Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <MessagesSquare className="w-4 h-4" />
            <span>Community Forum &amp; Direct Creator Channel</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
            Ask Pusparani &amp; Share Electrical Insights
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            Have a circuit challenge, request for a specific electrical project schematic, or feedback on existing hardware builds? Leave a note here on the Home board!
          </p>
        </div>

        {/* Quick prompt pills */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 text-xs flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Idea prompts:</span>
          </span>
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setMessage(prompt)}
              className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/60 text-xs transition-colors"
            >
              &ldquo;{prompt}&rdquo;
            </button>
          ))}
        </div>

        {/* Submission Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 pt-4 border-t border-slate-800/80">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Your Name / Handle *
              </label>
              <input
                type="text"
                required
                value={authorName}
                onChange={e => setAuthorName(e.target.value)}
                placeholder="e.g. Ananya, Vikram, Dr. Roy"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Role / Background
              </label>
              <select
                value={authorRole}
                onChange={e => setAuthorRole(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="Student">Engineering Student</option>
                <option value="Electrical Engineer">Electrical / Hardware Engineer</option>
                <option value="Hobbyist">Maker / Hobbyist</option>
                <option value="Researcher">Academic / Researcher</option>
                <option value="Visitor">Visitor</option>
                <option value="Creator">Creator</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Topic Category
              </label>
              <select
                value={topic}
                onChange={e => setTopic(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="Question to Creator">Question to Creator</option>
                <option value="Project Request">Project Request</option>
                <option value="Circuit Feedback">Circuit Feedback</option>
                <option value="Component Sourcing">Component Sourcing</option>
                <option value="General Inquiry">General Inquiry</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Your Message / Question *
            </label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Write your question, project request, or feedback for Pusparani..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              {isCreatorMode ? '⚡ Posting as Verified Project Creator' : 'Messages are publicly visible to the community & creator'}
            </span>

            <button
              type="submit"
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 active:scale-95 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post to Home Board</span>
            </button>
          </div>

          {successNotice && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Thank you! Your comment has been posted to the Home discussion board.</span>
            </div>
          )}
        </form>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-300">Filter topics:</span>
          <div className="flex flex-wrap gap-1.5">
            {['All', 'Question to Creator', 'Project Request', 'Circuit Feedback', 'Component Sourcing', 'General Inquiry'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFilterTopic(t)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  filterTopic === t
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <span className="text-xs text-slate-500 font-mono">
          {filteredComments.length} Discussions
        </span>
      </div>

      {/* Comment List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredComments.map((item) => (
          <div 
            key={item.id}
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
              item.isCreator 
                ? 'bg-gradient-to-br from-emerald-950/30 to-slate-900 border-emerald-500/40 shadow-lg shadow-emerald-500/5' 
                : 'bg-slate-900/80 border-slate-800'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-2.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                    item.isCreator 
                      ? 'bg-emerald-500 text-slate-950' 
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}>
                    {item.authorName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-white">
                        {item.authorName}
                      </span>
                      {item.isCreator && (
                        <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          <ShieldCheck className="w-3 h-3 mr-0.5" />
                          Creator
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {item.authorRole} • {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                  {item.topic}
                </span>
              </div>

              <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                {item.message}
              </p>
            </div>

            {/* Bottom row */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
              <span className="text-[11px]">Community Post</span>
              <button
                type="button"
                onClick={() => onLikeComment(item.id)}
                className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-950/80 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors"
              >
                <Heart className={`w-3.5 h-3.5 ${item.likes > 0 ? 'text-rose-400 fill-rose-500/20' : ''}`} />
                <span>{item.likes}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
