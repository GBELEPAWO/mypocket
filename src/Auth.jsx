import React, { useState } from 'react';
import { supabase } from './supabaseClient';

// Composant d'authentification : inscription (email + mot de passe + username)
// et connexion. À afficher tant que l'utilisateur n'est pas connecté.
export default function Auth({ onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function checkUsernameAvailable(name) {
    const { data } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', name)
      .maybeSingle();
    return !data; // true si disponible
  }

  async function handleSignup(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const cleanUsername = username.trim().toLowerCase().replace(/\s+/g, '_');
      if (cleanUsername.length < 3) {
        setError("Le nom d'utilisateur doit faire au moins 3 caractères.");
        setLoading(false);
        return;
      }

      const available = await checkUsernameAvailable(cleanUsername);
      if (!available) {
        setError("Ce nom d'utilisateur est déjà pris, choisissez-en un autre.");
        setLoading(false);
        return;
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (authError) throw authError;

      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        username: cleanUsername,
        display_name: displayName || cleanUsername,
      });
      if (profileError) throw profileError;

      onAuthSuccess(authData.user);
    } catch (err) {
      setError(err.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (loginError) throw loginError;
      onAuthSuccess(data.user);
    } catch (err) {
      setError(err.message === 'Invalid login credentials'
        ? 'Email ou mot de passe incorrect'
        : err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <h1 className="auth-title">MyPocket</h1>
        <p className="auth-subtitle">
          {mode === 'login' ? 'Connectez-vous à votre compte' : 'Créez votre compte'}
        </p>

        <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="auth-form">
          {mode === 'signup' && (
            <>
              <input
                type="text"
                placeholder="Nom d'utilisateur (ex: amara_d)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
              />
              <input
                type="text"
                placeholder="Nom affiché (ex: Amara Diallo)"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </>
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Chargement...' : mode === 'login' ? 'Se connecter' : "S'inscrire"}
          </button>
        </form>

        <button
          className="link-btn"
          onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
        >
          {mode === 'login' ? "Pas de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
        </button>
      </div>
    </div>
  );
}
