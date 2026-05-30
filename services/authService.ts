import { getSupabase, hasSupabase } from './supabaseClient';
import { UserProfile, UserRole } from '../types';

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  organization: string;
  region: string;
  function: string;
  birthDate: string;
  wantsMembership: boolean;
}

export const authService = {
  async register(data: RegisterData): Promise<UserProfile> {
    if (!hasSupabase) {
      return {
        id: Math.random().toString(36).slice(2),
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        organization: data.organization,
        region: data.region,
        function: data.function,
        birthDate: data.birthDate,
        role: UserRole.REGISTERED,
        isVerified: false,
      };
    }
    const { data: authData, error: signUpError } = await getSupabase().auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
          organization: data.organization,
          region: data.region,
          function: data.function,
          birth_date: data.birthDate,
          wants_membership: data.wantsMembership,
        },
      },
    });

    if (signUpError) throw signUpError;
    if (!authData.user) throw new Error('Registrierung fehlgeschlagen.');

    return {
      id: authData.user.id,
      email: authData.user.email!,
      firstName: data.firstName,
      lastName: data.lastName,
      organization: data.organization,
      region: data.region,
      function: data.function,
      birthDate: data.birthDate,
      role: UserRole.REGISTERED,
      isVerified: false,
    };
  },

  async login(email: string, password: string): Promise<UserProfile> {
    if (!hasSupabase) throw new Error('Supabase nicht konfiguriert.');
    const { data, error } = await getSupabase().auth.signInWithPassword({ email, password });

    if (error) throw error;
    if (!data.user) throw new Error('Login fehlgeschlagen.');

    const meta = data.user.user_metadata;
    return {
      id: data.user.id,
      email: data.user.email!,
      firstName: meta?.first_name ?? '',
      lastName: meta?.last_name ?? '',
      organization: meta?.organization ?? '',
      region: meta?.region ?? '',
      function: meta?.function ?? '',
      birthDate: meta?.birth_date ?? '',
      role: (meta?.role as UserRole) ?? UserRole.REGISTERED,
      isVerified: meta?.is_verified ?? false,
    };
  },

  async logout(): Promise<void> {
    if (!hasSupabase) return;
    const { error } = await getSupabase().auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser(): Promise<UserProfile | null> {
    if (!hasSupabase) return null;
    const { data: { user } } = await getSupabase().auth.getUser();
    if (!user) return null;

    const meta = user.user_metadata;
    return {
      id: user.id,
      email: user.email!,
      firstName: meta?.first_name ?? '',
      lastName: meta?.last_name ?? '',
      organization: meta?.organization ?? '',
      region: meta?.region ?? '',
      function: meta?.function ?? '',
      birthDate: meta?.birth_date ?? '',
      role: (meta?.role as UserRole) ?? UserRole.REGISTERED,
      isVerified: meta?.is_verified ?? false,
    };
  },
};
