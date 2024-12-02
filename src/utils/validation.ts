export const isNameUnique = (name: string, existingAlumni: { name: string }[]): boolean => {
  return !existingAlumni.some(alumni => 
    alumni.name.toLowerCase() === name.toLowerCase()
  );
};

export const formatPhoneNumber = (phone: string): string => {
  return phone.replace(/\D/g, '')
    .replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
};