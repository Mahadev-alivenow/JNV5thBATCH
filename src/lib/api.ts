const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.error('API_URL is not defined in environment variables');
}

export async function saveAlumni(alumniData: any) {
  const response = await fetch(`${API_URL}/alumni`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(alumniData),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

export async function getAlumni() {
  const response = await fetch(`${API_URL}/alumni`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

export async function checkNameExists(firstName: string, lastName: string) {
  const response = await fetch(
    `${API_URL}/check-name?firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}`
  );
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  return data.exists;
}