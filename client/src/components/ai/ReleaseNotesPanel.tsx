import React, { useState } from 'react';
import { generateReleaseNotes } from '../../services/ai.service';
import { AIResponseCard } from './AIResponseCard';
import toast from 'react-hot-toast';

export const ReleaseNotesPanel: React.FC = () => {
  const [version, setVersion] = useState('1.0.0');
  const [features, setFeatures] = useState('');
  const [bugFixes, setBugFixes] = useState('');
  const [improvements, setImprovements] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!features.trim() && !bugFixes.trim() && !improvements.trim()) {
      toast.error('Please enter at least one item');
      return;
    }

    const featureList = features.split('\n').filter((line) => line.trim());
    const bugList = bugFixes.split('\n').filter((line) => line.trim());
    const improvementList = improvements.split('\n').filter((line) => line.trim());

    setIsLoading(true);
    try {
      const result = await generateReleaseNotes({
        version,
        features: featureList.length > 0 ? featureList : [''],
        bugFixes: bugList.length > 0 ? bugList : [''],
        improvements: improvementList.length > 0 ? improvementList : [''],
      });
      setResponse(result);
      toast.success('Release notes generated');
    } catch (error) {
      toast.error('Failed to generate release notes');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Generate release notes</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="version" className="block text-sm font-medium text-slate-700">
              Version
            </label>
            <input
              id="version"
              type="text"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="1.0.0"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div>
            <label htmlFor="features" className="block text-sm font-medium text-slate-700">
              Features (one per line)
            </label>
            <textarea
              id="features"
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              placeholder="Advanced reporting dashboard&#10;Real-time collaboration tools&#10;API versioning support"
              rows={3}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div>
            <label htmlFor="bug-fixes" className="block text-sm font-medium text-slate-700">
              Bug fixes (one per line)
            </label>
            <textarea
              id="bug-fixes"
              value={bugFixes}
              onChange={(e) => setBugFixes(e.target.value)}
              placeholder="Fixed memory leak in socket connections&#10;Corrected date formatting in reports"
              rows={3}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div>
            <label htmlFor="improvements" className="block text-sm font-medium text-slate-700">
              Improvements (one per line)
            </label>
            <textarea
              id="improvements"
              value={improvements}
              onChange={(e) => setImprovements(e.target.value)}
              placeholder="40% faster data loading&#10;Improved dark mode UI&#10;Enhanced search performance"
              rows={3}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Generating...' : 'Generate Release Notes'}
          </button>
        </div>
      </div>

      {response && (
        <AIResponseCard
          title="Release Notes"
          content={response}
          isLoading={isLoading}
          onRegenerate={handleRegenerate}
        />
      )}
    </div>
  );
};
