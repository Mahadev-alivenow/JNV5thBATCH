const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export async function saveAlumni(alumniData: any) {
  const response = await fetch(`${API_URL}/alumni`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(alumniData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to save alumni data');
  }

  return response.json();
}

export async function getAlumni() {
  const response = await fetch(`${API_URL}/alumni`);

  if (!response.ok) {
    throw new Error('Failed to fetch alumni data');
  }

  return response.json();
}

export async function checkNameExists(firstName: string, lastName: string) {
  const response = await fetch(
    `${API_URL}/check-name?firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}`
  );

  if (!response.ok) {
    throw new Error('Failed to check name existence');
  }

  const data = await response.json();
  return data.exists;
}
