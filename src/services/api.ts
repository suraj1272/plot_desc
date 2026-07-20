import type { Plot, PlotStatus } from '../types';
import localPlotsData from '../data/plots.json';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export interface AdminUser {
  id: string;
  username: string;
  name: string;
}

export interface LoginResponse {
  token: string;
  admin: AdminUser;
}

/**
 * Fetch all plots from backend API with fallback to static plots.json
 */
export async function fetchPlots(surveyNo?: string): Promise<Plot[]> {
  try {
    let url = `${API_BASE_URL}/plots`;
    if (surveyNo && surveyNo !== 'all') {
      url += `?surveyNo=${surveyNo}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }
    const result = await response.json();
    if (result.success && Array.isArray(result.data) && result.data.length > 0) {
      return result.data as Plot[];
    }
  } catch (error) {
    console.warn('API fetch failed or offline, using static plots fallback:', error);
  }
  
  // Fallback to static plots.json
  const plots = localPlotsData as unknown as Plot[];
  if (surveyNo && surveyNo !== 'all') {
    return plots.filter(p => p.surveyNo === surveyNo);
  }
  return plots;
}

/**
 * Update plot status by surveyNo and number (Requires Admin Token)
 */
export async function updatePlotStatusApi(
  surveyNo: string,
  number: number,
  status: PlotStatus,
  token: string
): Promise<Plot> {
  const response = await fetch(`${API_BASE_URL}/plots/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ surveyNo, number, status })
  });

  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Failed to update plot status');
  }

  return result.data as Plot;
}

/**
 * Admin Login API
 */
export async function loginAdminApi(username: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  });

  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Login failed. Invalid username or password.');
  }

  return result.data as LoginResponse;
}

/**
 * Verify saved Admin JWT token
 */
export async function verifyAdminTokenApi(token: string): Promise<AdminUser> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Token invalid');
  }

  return result.data.admin as AdminUser;
}
