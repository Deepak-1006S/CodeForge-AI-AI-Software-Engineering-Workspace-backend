import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const codeLines = [
  { text: '<span class="c">// Gemini AI Sprint Summary Engine</span>', type: '' },
  { text: '<span class="k">import</span> <span class="o">{ GoogleGenerativeAI } </span><span class="k">from</span> <span class="s">\'@google/generative-ai\'</span>', type: '' },
  { text: '<span class="k">import</span> <span class="o">{ </span><span class="t">Sprint</span><span class="o">, </span><span class="t">Issue</span><span class="o"> } </span><span class="k">from</span> <span class="s">\'../types\'</span>', type: '' },
  { text: '', type: '' },
  { text: '<span class="k">const</span> <span class="fn">genAI</span> <span class="o">= </span><span class="k">new</span> <span class="t">GoogleGenerativeAI</span><span class="o">(</span>', type: '' },
  { text: '&nbsp;&nbsp;<span class="fn">process</span><span class="o">.</span><span class="fn">env</span><span class="o">.</span><span class="vi">GEMINI_API_KEY</span>', type: '' },
  { text: '<span class="o">)</span>', type: '' },
  { text: '', type: '' },
  { text: '<span class="k">export async function</span> <span class="fn">generateSprintSummary</span><span class="o">(</span>', type: '' },
  { text: '&nbsp;&nbsp;<span class="fn">sprint</span><span class="o">: </span><span class="t">Sprint</span><span class="o">,</span>', type: '' },
  { text: '&nbsp;&nbsp;<span class="fn">issues</span><span class="o">: </span><span class="t">Issue</span><span class="o">[]</span>', type: 'added' },
  { text: '<span class="o">): </span><span class="t">Promise</span><span class="o">&lt;</span><span class="t">string</span><span class="o">&gt; {</span>', type: '' },
  { text: '&nbsp;&nbsp;<span class="k">const</span> <span class="fn">model</span> <span class="o">= </span><span class="fn">genAI</span><span class="o">.</span><span class="fn">getGenerativeModel</span><span class="o">({</span>', type: '' },
  { text: '&nbsp;&nbsp;&nbsp;&nbsp;<span class="fn">model</span><span class="o">: </span><span class="s">\'gemini-1.5-pro\'</span>', type: 'active' },
  { text: '&nbsp;&nbsp;<span class="o">})</span>', type: '' },
];

const styles = `
  :root { color-scheme: dark; }
  .auth-shell { min-height: 100vh; background: #05070D; color: #e2e8f0; }
  .auth-layout { display: grid; grid-template-columns: 1.15fr 480px; min-height: 100vh; position: relative; }
  .left-panel { position: relative; background: #0a0e1a; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; padding: 2.5rem; border-right: 1px solid rgba(255,255,255,0.07); }
  .left-panel::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 60% 50% at 20% 15%, rgba(59,130,246,0.09), transparent 70%), radial-gradient(ellipse 45% 40% at 80% 85%, rgba(139,92,246,0.1), transparent 65%), radial-gradient(ellipse 30% 30% at 60% 40%, rgba(52,211,153,0.04), transparent 60%); pointer-events: none; }
  .left-panel::after { content: ''; position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px); background-size: 40px 40px; pointer-events: none; }
  .panel-logo, .panel-center, .panel-pills { position: relative; z-index: 2; }
  .panel-logo { display: flex; align-items: center; gap: 10px; font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 600; color: #f1f5f9; letter-spacing: -0.02em; }
  .logo-mark { width: 30px; height: 30px; border-radius: 7px; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: white; }
  .panel-center { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 2rem 0; }
  .panel-headline { font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 700; color: white; line-height: 1.2; letter-spacing: -0.03em; margin-bottom: 0.75rem; }
  .panel-headline .hl-blue { color: #3b82f6; }
  .panel-headline .hl-violet { color: #8b5cf6; }
  .panel-sub { font-size: 14px; color: #64748b; line-height: 1.65; max-width: 380px; margin-bottom: 2.5rem; }
  .code-window { background: rgba(9,13,22,0.88); border: 1px solid rgba(255,255,255,0.12); border-radius: 16px; overflow: hidden; backdrop-filter: blur(8px); max-width: 540px; box-shadow: 0 24px 48px rgba(0,0,0,0.45); }
  .code-titlebar { background: rgba(13,17,23,0.95); padding: 10px 16px; border-bottom: 1px solid rgba(255,255,255,0.07); display: flex; align-items: center; gap: 12px; }
  .traffic-lights { display: flex; gap: 5px; }
  .tl { width: 11px; height: 11px; border-radius: 50%; }
  .tl-r { background: rgba(239,68,68,0.7); }
  .tl-y { background: rgba(245,158,11,0.7); }
  .tl-g { background: rgba(34,197,94,0.7); }
  .code-file { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #64748b; margin-left: 6px; }
  .code-branch { margin-left: auto; font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #8b5cf6; background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.2); padding: 2px 8px; border-radius: 4px; }
  .code-body { padding: 16px 0; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.75; min-height: 240px; }
  .cl { display: flex; align-items: baseline; padding: 0 20px; }
  .ln { min-width: 36px; text-align: right; color: rgba(100,116,139,0.4); font-size: 10px; padding-right: 16px; user-select: none; }
  .k { color: #c678dd; }
  .fn { color: #61afef; }
  .s { color: #98c379; }
  .n { color: #d19a66; }
  .t { color: #e5c07b; }
  .c { color: #5c6370; font-style: italic; }
  .o { color: #abb2bf; }
  .vi { color: #8b5cf6; }
  .mt { color: #34d399; }
  .right-panel { position: relative; background: #05070D; display: flex; align-items: center; justify-content: center; padding: 2.5rem 2rem; overflow: hidden; }
  .right-panel::before { content: ''; position: absolute; width: 480px; height: 480px; border-radius: 50%; background: radial-gradient(circle, rgba(59,130,246,0.08) 0%, rgba(139,92,246,0.06) 40%, transparent 75%); top: 50%; left: 50%; transform: translate(-50%, -50%); pointer-events: none; }
  .auth-card { position: relative; width: 100%; max-width: 400px; background: rgba(13, 17, 23, 0.72); border: 1px solid rgba(255,255,255,0.12); border-radius: 22px; padding: 2.5rem 2.25rem 2rem; backdrop-filter: blur(24px); box-shadow: 0 32px 64px rgba(0,0,0,0.55); }
  .card-header { text-align: center; margin-bottom: 2rem; }
  .card-logo { display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2)); border: 1px solid rgba(139,92,246,0.25); margin-bottom: 1.2rem; font-family: 'JetBrains Mono', monospace; font-size: 16px; font-weight: 700; color: #3b82f6; }
  .card-title { font-size: 1.3rem; font-weight: 700; color: #f1f5f9; letter-spacing: -0.025em; margin-bottom: 6px; }
  .card-sub { font-size: 13px; color: #64748b; line-height: 1.5; }
  .auth-tabs { display: grid; grid-template-columns: 1fr 1fr; gap: 0; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 3px; margin-bottom: 1.75rem; }
  .tab-btn { padding: 7px; font-size: 13px; font-weight: 500; color: #64748b; background: transparent; border: none; border-radius: 8px; cursor: pointer; letter-spacing: -0.01em; }
  .tab-btn.active { background: #0d1117; color: #f1f5f9; box-shadow: 0 1px 4px rgba(0,0,0,0.3); }
  .oauth-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 1.2rem; }
  .oauth-btn { display: flex; align-items: center; justify-content: center; gap: 7px; padding: 9px 12px; font-size: 13px; font-weight: 500; color: #e2e8f0; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; cursor: pointer; transition: transform 0.12s ease, background 0.18s ease; }
  .oauth-btn:hover { background: rgba(255,255,255,0.08); transform: translateY(-1px); }
  .oauth-icon { width: 16px; height: 16px; flex-shrink: 0; }
  .divider { display: flex; align-items: center; gap: 10px; margin: 1.2rem 0; }
  .divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
  .divider-text { font-size: 11px; color: #475569; font-weight: 500; letter-spacing: 0.04em; flex-shrink: 0; }
  .field { position: relative; margin-bottom: 1rem; }
  .field-input { width: 100%; height: 50px; padding: 16px 14px 6px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; font-size: 14px; font-weight: 400; color: #f1f5f9; outline: none; transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease; }
  .field-input:focus { border-color: rgba(59,130,246,0.45); background: rgba(59,130,246,0.04); box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
  .field-input:not(:placeholder-shown) + .field-label, .field-input:focus + .field-label { transform: translateY(-9px) scale(0.8); color: #3b82f6; font-weight: 500; }
  .field-label { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 14px; color: #64748b; pointer-events: none; transition: transform 0.18s ease, color 0.18s ease, font-size 0.18s ease; white-space: nowrap; }
  .field-action { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #64748b; cursor: pointer; padding: 4px; }
  .field-icon { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: #64748b; pointer-events: none; }
  .has-icon .field-input { padding-left: 38px; }
  .has-icon .field-label { left: 38px; }
  .auth-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.4rem; margin-top: -0.25rem; }
  .check-label { display: flex; align-items: center; gap: 7px; cursor: pointer; font-size: 13px; color: #64748b; }
  .check-input { display: none; }
  .check-box { width: 16px; height: 16px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.04); display: flex; align-items: center; justify-content: center; }
  .check-input:checked + .check-box { background: #3b82f6; border-color: #3b82f6; }
  .check-input:checked + .check-box::after { content: ''; width: 8px; height: 5px; border-left: 1.5px solid #fff; border-bottom: 1.5px solid #fff; transform: rotate(-45deg) translateY(-1px); display: block; }
  .forgot-link { font-size: 13px; color: #3b82f6; text-decoration: none; }
  .btn-cta { width: 100%; height: 46px; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 14px; font-weight: 600; color: #fff; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); border: none; border-radius: 10px; cursor: pointer; box-shadow: 0 8px 24px rgba(59,130,246,0.28); }
  .btn-cta:disabled { opacity: 0.7; cursor: not-allowed; }
  .card-footer-text { text-align: center; margin-top: 1.25rem; font-size: 13px; color: #64748b; }
  .card-footer-text a { color: #3b82f6; text-decoration: none; font-weight: 500; }
  .terms-text { text-align: center; margin-top: 0.85rem; font-size: 11px; color: #475569; line-height: 1.5; }
  .terms-text a { color: #64748b; text-decoration: underline; }
  .field-error { font-size: 11.5px; color: #ef4444; margin-top: 5px; margin-left: 2px; }
  .field.has-error .field-input { border-color: rgba(239,68,68,0.5); box-shadow: 0 0 0 3px rgba(239,68,68,0.08); }
  .field.has-error .field-label { color: #ef4444; }
  .form-section { display: none; }
  .form-section.active { display: block; }
  .toast { position: fixed; top: 24px; left: 50%; transform: translateX(-50%) translateY(-80px); background: #0d1117; border: 1px solid rgba(255,255,255,0.12); border-radius: 16px; padding: 10px 18px; font-size: 13px; color: #e2e8f0; display: flex; align-items: center; gap: 8px; z-index: 1000; transition: transform 0.35s ease; box-shadow: 0 16px 40px rgba(0,0,0,0.5); white-space: nowrap; }
  .toast.visible { transform: translateX(-50%) translateY(0); }
  @media (max-width: 900px) { .auth-layout { grid-template-columns: 1fr; } .left-panel { display: none; } .right-panel { min-height: 100vh; padding: 2.5rem 1.25rem; } }
  @media (max-width: 400px) { .auth-card { padding: 2rem 1.5rem 1.75rem; } .oauth-row { grid-template-columns: 1fr; } }
`;

export const PremiumLoginPage: React.FC = () => {
  const location = useLocation();
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signinData, setSigninData] = useState({ email: '', password: '', rememberMe: false });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '', role: 'Developer' });
  const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string; signupEmail?: string }>({});

  const codePreview = useMemo(() => codeLines.slice(0, 13), []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setErrors((prev) => prev);
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const validateSignin = () => {
    const nextErrors: { email?: string; password?: string } = {};
    if (!signinData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signinData.email)) {
      nextErrors.email = 'Enter a valid email address';
    }
    if (!signinData.password) {
      nextErrors.password = 'Password is required';
    }
    setErrors((prev) => ({ ...prev, ...nextErrors }));
    return Object.keys(nextErrors).length === 0;
  };

  const validateSignup = () => {
    const nextErrors: { name?: string; signupEmail?: string; password?: string } = {};
    if (!signupData.name.trim()) {
      nextErrors.name = 'Please enter your full name';
    }
    if (!signupData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupData.email)) {
      nextErrors.signupEmail = 'Enter a valid email address';
    }
    if (signupData.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters';
    }
    setErrors((prev) => ({ ...prev, ...nextErrors }));
    return Object.keys(nextErrors).length === 0;
  };

  const handleSignin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateSignin()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await login({ email: signinData.email, password: signinData.password });
      toast.success('Signed in successfully');
      const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/dashboard';
      window.location.assign(from);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Failed to sign in. Please try again.';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateSignup()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await register({ name: signupData.name, email: signupData.email, password: signupData.password, role: signupData.role as any });
      toast.success('Account created successfully');
      window.location.assign('/dashboard');
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialAuth = (provider: 'google' | 'github') => {
    window.location.href = `/api/auth/${provider}/login`;
  };

  return (
    <div className="auth-shell">
      <style>{styles}</style>
      <div className="auth-layout">
        <div className="left-panel" aria-hidden="true">
          <div className="panel-logo">
            <div className="logo-mark">⬡</div>
            <span><span className="logo-bracket">[</span>CodeForge<span className="logo-slash">/</span>AI<span className="logo-bracket">]</span></span>
          </div>

          <div className="panel-center">
            <p style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: '#8b5cf6', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.8rem' }}>
              AI Engineering Workspace
            </p>
            <h2 className="panel-headline">
              Build faster<br />with <span className="hl-blue">AI</span> at the<br /><span className="hl-violet">core</span>
            </h2>
            <p className="panel-sub">Kanban boards, real-time collaboration, GitHub insights, and a Gemini AI assistant — all in one workspace built for engineering teams.</p>

            <div className="code-window">
              <div className="code-titlebar">
                <div className="traffic-lights">
                  <div className="tl tl-r" />
                  <div className="tl tl-y" />
                  <div className="tl tl-g" />
                </div>
                <span className="code-file">src/services/gemini.ts</span>
                <span className="code-branch">⑂ feat/ai-sprint</span>
              </div>
              <div className="code-body">
                {codePreview.map((line, index) => (
                  <div key={`${line.text}-${index}`} className="cl">
                    <span className="ln">{index + 1}</span>
                    <span dangerouslySetInnerHTML={{ __html: line.text }} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="panel-pills" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <div className="pill" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 500, color: '#94a3b8', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', padding: '5px 11px', borderRadius: '999px' }}>
              <div className="pill-dot" style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#3b82f6' }} />
              Kanban boards
            </div>
            <div className="pill" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 500, color: '#94a3b8', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', padding: '5px 11px', borderRadius: '999px' }}>
              <div className="pill-dot" style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#8b5cf6' }} />
              Gemini AI
            </div>
            <div className="pill" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 500, color: '#94a3b8', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', padding: '5px 11px', borderRadius: '999px' }}>
              <div className="pill-dot" style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#34d399' }} />
              Real-time
            </div>
          </div>
        </div>

        <div className="right-panel">
          <div className="auth-card" role="main">
            <div className="card-header">
              <div className="card-logo">⬡</div>
              <h1 className="card-title">{activeTab === 'signin' ? 'Welcome back' : 'Create account'}</h1>
              <p className="card-sub">{activeTab === 'signin' ? 'Sign in to your workspace' : 'Start your engineering workspace'}</p>
            </div>

            <div className="auth-tabs" role="tablist">
              <button className={`tab-btn ${activeTab === 'signin' ? 'active' : ''}`} role="tab" aria-selected={activeTab === 'signin'} onClick={() => setActiveTab('signin')}>
                Sign in
              </button>
              <button className={`tab-btn ${activeTab === 'signup' ? 'active' : ''}`} role="tab" aria-selected={activeTab === 'signup'} onClick={() => setActiveTab('signup')}>
                Create account
              </button>
            </div>

            <div className={`form-section ${activeTab === 'signin' ? 'active' : ''}`}>
              <div className="oauth-row">
                <button type="button" className="oauth-btn" onClick={() => handleSocialAuth('google')}>
                  <svg className="oauth-icon" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Google
                </button>
                <button type="button" className="oauth-btn" onClick={() => handleSocialAuth('github')}>
                  <svg className="oauth-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                  GitHub
                </button>
              </div>

              <div className="divider">
                <div className="divider-line" />
                <span className="divider-text">or continue with email</span>
                <div className="divider-line" />
              </div>

              <form onSubmit={handleSignin} noValidate>
                <div className={`field has-icon ${errors.email ? 'has-error' : ''}`}>
                  <svg className="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  <input className="field-input" type="email" id="email" name="email" placeholder="Email address" autoComplete="email" value={signinData.email} onChange={(e) => setSigninData((prev) => ({ ...prev, email: e.target.value }))} />
                  <label className="field-label" htmlFor="email">Email address</label>
                  {errors.email && <div className="field-error">{errors.email}</div>}
                </div>

                <div className={`field has-icon ${errors.password ? 'has-error' : ''}`}>
                  <svg className="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <input className="field-input" type={showPassword ? 'text' : 'password'} id="password" name="password" placeholder="Password" autoComplete="current-password" value={signinData.password} onChange={(e) => setSigninData((prev) => ({ ...prev, password: e.target.value }))} />
                  <label className="field-label" htmlFor="password">Password</label>
                  <button type="button" className="field-action" onClick={() => setShowPassword((prev) => !prev)} aria-label="Toggle password visibility">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                  {errors.password && <div className="field-error">{errors.password}</div>}
                </div>

                <div className="auth-row">
                  <label className="check-label">
                    <input type="checkbox" className="check-input" checked={signinData.rememberMe} onChange={(e) => setSigninData((prev) => ({ ...prev, rememberMe: e.target.checked }))} />
                    <div className="check-box" />
                    Remember me
                  </label>
                  <Link to="/auth/forgot-password" className="forgot-link">Forgot password?</Link>
                </div>

                <button type="submit" className="btn-cta" disabled={isSubmitting}>
                  <span className="btn-text">{isSubmitting ? 'Signing in...' : 'Sign in to workspace'}</span>
                </button>
              </form>
            </div>

            <div className={`form-section ${activeTab === 'signup' ? 'active' : ''}`}>
              <div className="oauth-row">
                <button type="button" className="oauth-btn" onClick={() => handleSocialAuth('google')}>
                  <svg className="oauth-icon" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Google
                </button>
                <button type="button" className="oauth-btn" onClick={() => handleSocialAuth('github')}>
                  <svg className="oauth-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                  GitHub
                </button>
              </div>

              <div className="divider">
                <div className="divider-line" />
                <span className="divider-text">or sign up with email</span>
                <div className="divider-line" />
              </div>

              <form onSubmit={handleSignup} noValidate>
                <div className={`field has-icon ${errors.name ? 'has-error' : ''}`}>
                  <svg className="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                  <input className="field-input" type="text" id="name" name="name" placeholder="Full name" autoComplete="name" value={signupData.name} onChange={(e) => setSignupData((prev) => ({ ...prev, name: e.target.value }))} />
                  <label className="field-label" htmlFor="name">Full name</label>
                  {errors.name && <div className="field-error">{errors.name}</div>}
                </div>

                <div className={`field has-icon ${errors.signupEmail ? 'has-error' : ''}`}>
                  <svg className="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  <input className="field-input" type="email" id="signup-email" name="email" placeholder="Work email" autoComplete="email" value={signupData.email} onChange={(e) => setSignupData((prev) => ({ ...prev, email: e.target.value }))} />
                  <label className="field-label" htmlFor="signup-email">Work email</label>
                  {errors.signupEmail && <div className="field-error">{errors.signupEmail}</div>}
                </div>

                <div className={`field has-icon ${errors.password ? 'has-error' : ''}`}>
                  <svg className="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <input className="field-input" type={showSignupPassword ? 'text' : 'password'} id="new-password" name="password" placeholder="Password" autoComplete="new-password" value={signupData.password} onChange={(e) => setSignupData((prev) => ({ ...prev, password: e.target.value }))} />
                  <label className="field-label" htmlFor="new-password">Password</label>
                  <button type="button" className="field-action" onClick={() => setShowSignupPassword((prev) => !prev)} aria-label="Toggle password visibility">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                  {errors.password && <div className="field-error">{errors.password}</div>}
                </div>

                <button type="submit" className="btn-cta" disabled={isSubmitting}>
                  <span className="btn-text">{isSubmitting ? 'Creating account...' : 'Create workspace account'}</span>
                </button>
              </form>
            </div>

            <div className="card-footer-text">
              {activeTab === 'signin' ? (
                <>
                  Don't have an account? <button type="button" style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', padding: 0 }} onClick={() => setActiveTab('signup')}>Create one</button>
                </>
              ) : (
                <>
                  Already have an account? <button type="button" style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', padding: 0 }} onClick={() => setActiveTab('signin')}>Sign in</button>
                </>
              )}
            </div>

            <div className="terms-text">
              Protected by JWT · <a href="#">Privacy</a> · <a href="#">Security</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
