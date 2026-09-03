/**
 * dashboardService.js
 * Frontend mock service for Sprint 04.
 * Replace with real API calls in future sprints.
 */

import {
  dashboardStats,
  recentActivities,
  upcomingClasses,
} from '../constants/adminDashboard'

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// ─────────────────────────────────────────────────────────────────
// Dashboard
// ─────────────────────────────────────────────────────────────────

/**
 * Simulates fetching dashboard data from the server.
 * Resolves with dashboard payload after ~1 200 ms.
 * Rejects ~10 % of the time to let the UI test error / retry.
 */
export async function fetchDashboardData() {
  await delay(1200)

  // Simulate occasional network error
  if (Math.random() < 0.1) {
    throw new Error('Unable to reach the server. Please check your connection.')
  }

  return {
    stats: dashboardStats,
    recentActivities,
    upcomingClasses,
  }
}

// ─────────────────────────────────────────────────────────────────
// Profile
// ─────────────────────────────────────────────────────────────────

/**
 * Simulates saving admin profile data.
 * @param {object} data — form values from react-hook-form
 */
export async function saveProfile(data) {
  await delay(1000)
  // In production: return axios.put('/api/admin/profile', data)
  return { success: true, data }
}

// ─────────────────────────────────────────────────────────────────
// Settings
// ─────────────────────────────────────────────────────────────────

/**
 * Simulates saving admin settings.
 * @param {object} data — settings values
 */
export async function saveSettings(data) {
  await delay(1000)
  // In production: return axios.put('/api/admin/settings', data)
  return { success: true, data }
}
