import React, { useState, useEffect } from 'react';
import { RepoConnectForm } from '../../components/github/RepoConnectForm';
import { CommitList } from '../../components/github/CommitList';
import { PullRequestStats } from '../../components/github/PullRequestStats';
import { ContributorList } from '../../components/github/ContributorList';
import { getCommits, getPullRequests, getContributors, getRepoDetails } from '../../services/github.service';
import { GitHubCommit, GitHubPullRequest, GitHubContributor, GitHubPullRequestStats } from '../../types/github.types';

export const GitHubIntegrationPage: React.FC = () => {
  const [repoId] = useState('repo-1');
  const [commits, setCommits] = useState<GitHubCommit[]>([]);
  const [pullRequests, setPullRequests] = useState<GitHubPullRequest[]>([]);
  const [prStats, setPrStats] = useState<GitHubPullRequestStats | null>(null);
  const [contributors, setContributors] = useState<GitHubContributor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [commitsData, prsData, contributorsData] = await Promise.all([
          getCommits(repoId),
          getPullRequests(repoId),
          getContributors(repoId),
        ]);
        setCommits(commitsData);
        setPullRequests(prsData.pullRequests);
        setPrStats(prsData.stats);
        setContributors(contributorsData);
      } catch (error) {
        console.error('Failed to load GitHub data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [repoId]);

  const handleRepoConnected = () => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [commitsData, prsData, contributorsData] = await Promise.all([
          getCommits(repoId),
          getPullRequests(repoId),
          getContributors(repoId),
        ]);
        setCommits(commitsData);
        setPullRequests(prsData.pullRequests);
        setPrStats(prsData.stats);
        setContributors(contributorsData);
      } catch (error) {
        console.error('Failed to load GitHub data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Integration</p>
            <h1 className="text-3xl font-semibold text-slate-900">GitHub Analytics</h1>
            <p className="mt-2 text-sm text-slate-500">Track commits, pull requests, and contributors from your GitHub repositories.</p>
          </div>
        </div>
      </div>

      <RepoConnectForm onSuccess={handleRepoConnected} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CommitList commits={commits} isLoading={isLoading} />
        </div>
        <div>
          <ContributorList contributors={contributors} isLoading={isLoading} />
        </div>
      </div>

      {prStats && (
        <PullRequestStats pullRequests={pullRequests} stats={prStats} isLoading={isLoading} />
      )}
    </div>
  );
};
