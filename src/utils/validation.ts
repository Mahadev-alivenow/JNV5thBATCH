export const isNameUnique = (name: string, existingAlumni: { name: string }[]): boolean => {
  return !existingAlumni.some(alumni => 
    alumni.name.toLowerCase() === name.toLowerCase()
  );
};

export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // If the number starts with '91', remove it
  const number = cleaned.startsWith('91') ? cleaned.slice(2) : cleaned;
  
  // Ensure we have exactly 10 digits
  if (number.length === 10) {
    return `+91 ${number}`;
  }
  
  // Return original format if not valid
  return phone;
};