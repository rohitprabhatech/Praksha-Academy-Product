/**
 * Platform (Prabha Technology) mock service.
 * Master Admin reviews academy registration requests and activates tenants.
 * Replace with /api/v1/platform/* in a later backend sprint.
 */

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms))

let registrationRequests = [
  {
    id: 'req-001',
    academyName: 'Delhi Science Academy',
    ownerName: 'Rahul Sharma',
    ownerEmail: 'rahul@delhiscience.in',
    phone: '+91 98765 43210',
    city: 'New Delhi',
    planRequested: 'Starter',
    status: 'pending',
    submittedAt: '2026-09-01T10:15:00+05:30',
    notes: 'Wants trial for 50 students',
  },
  {
    id: 'req-002',
    academyName: 'Pune Coding Hub',
    ownerName: 'Sneha Patil',
    ownerEmail: 'sneha@punecoding.com',
    phone: '+91 91234 56780',
    city: 'Pune',
    planRequested: 'Growth',
    status: 'pending',
    submittedAt: '2026-09-02T14:40:00+05:30',
    notes: 'Requesting weekend batch support',
  },
  {
    id: 'req-003',
    academyName: 'Mumbai Arts Institute',
    ownerName: 'Aamir Khan',
    ownerEmail: 'aamir@mumbaiarts.edu',
    phone: '+91 99887 66554',
    city: 'Mumbai',
    planRequested: 'Starter',
    status: 'approved',
    submittedAt: '2026-08-20T09:00:00+05:30',
    reviewedAt: '2026-08-21T11:20:00+05:30',
    notes: 'Approved and activated',
  },
  {
    id: 'req-004',
    academyName: 'Nagpur Test Prep',
    ownerName: 'Kavita Deshmukh',
    ownerEmail: 'kavita@nagpurprep.com',
    phone: '+91 90000 11122',
    city: 'Nagpur',
    planRequested: 'Starter',
    status: 'rejected',
    submittedAt: '2026-08-18T16:05:00+05:30',
    reviewedAt: '2026-08-19T10:00:00+05:30',
    notes: 'Incomplete documents',
  },
]

let academies = [
  {
    id: 'tenant-a',
    name: 'Praksha Academy Pune',
    tenantCode: 'praksha-pune',
    status: 'active',
    ownerEmail: 'admin@praksha.academy',
    students: 128,
    teachers: 12,
    courses: 18,
  },
  {
    id: 'tenant-b',
    name: 'Mumbai Arts Institute',
    tenantCode: 'mumbai-arts',
    status: 'trial',
    ownerEmail: 'aamir@mumbaiarts.edu',
    students: 24,
    teachers: 3,
    courses: 4,
  },
]

export async function fetchPlatformDashboard() {
  await delay()
  const pending = registrationRequests.filter((r) => r.status === 'pending').length
  const approved = registrationRequests.filter((r) => r.status === 'approved').length
  const rejected = registrationRequests.filter((r) => r.status === 'rejected').length
  const activeAcademies = academies.filter((a) => a.status === 'active' || a.status === 'trial').length

  return {
    stats: {
      pendingRequests: pending,
      approvedRequests: approved,
      rejectedRequests: rejected,
      activeAcademies,
    },
    recentRequests: registrationRequests.slice(0, 5),
    academies: academies.slice(0, 5),
  }
}

export async function fetchRegistrationRequests({ status } = {}) {
  await delay()
  let rows = [...registrationRequests]
  if (status && status !== 'all') {
    rows = rows.filter((row) => row.status === status)
  }
  return { items: rows, total: rows.length }
}

export async function reviewRegistrationRequest(id, action, notes = '') {
  await delay(600)
  const index = registrationRequests.findIndex((row) => row.id === id)
  if (index === -1) {
    throw new Error('Request not found')
  }

  const nextStatus = action === 'approve' ? 'approved' : 'rejected'
  const updated = {
    ...registrationRequests[index],
    status: nextStatus,
    reviewedAt: new Date().toISOString(),
    notes: notes || registrationRequests[index].notes,
  }
  registrationRequests = [
    ...registrationRequests.slice(0, index),
    updated,
    ...registrationRequests.slice(index + 1),
  ]

  if (action === 'approve') {
    const exists = academies.some(
      (a) => a.ownerEmail.toLowerCase() === updated.ownerEmail.toLowerCase()
    )
    if (!exists) {
      academies = [
        {
          id: `tenant-${Date.now()}`,
          name: updated.academyName,
          tenantCode: updated.academyName.toLowerCase().replace(/\s+/g, '-').slice(0, 32),
          status: 'trial',
          ownerEmail: updated.ownerEmail,
          students: 0,
          teachers: 0,
          courses: 0,
        },
        ...academies,
      ]
    }
  }

  return { success: true, data: updated }
}

export async function fetchAcademies() {
  await delay()
  return { items: academies, total: academies.length }
}
