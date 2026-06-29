import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface AIResponseCardProps {
  title: string;
  content: string;
  isLoading?: boolean;
  onRegenerate?: () => void;
}

export const AIResponseCard: React.FC<AIResponseCardProps> = ({
  title,
  content,
  isLoading = false,
  onRegenerate,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleCopy}
            disabled={isLoading}
            className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 disabled:opacity-50"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
          {onRegenerate && (
            <button
              type="button"
              onClick={onRegenerate}
              disabled={isLoading}
              className="rounded-2xl bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200 disabled:opacity-50"
            >
              Regenerate
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <div className="whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
            {content}
          </div>
        </div>
      )}
    </div>
  );
};

