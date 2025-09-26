export const getPositionColor = (position: string) => {
  switch (position) {
    case 'Super': return 'bg-purple-100 text-purple-800 border border-purple-200';
    case 'Leader': return 'bg-green-100 text-green-800 border border-green-200';
    case 'Account Department': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    case 'Operation': return 'bg-orange-100 text-orange-800 border border-orange-200';
    default: return 'bg-gray-100 text-gray-800 border border-gray-200';
  }
};

export const getGenderColor = (gender: string) => {
  return gender === 'Male' ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-pink-100 text-pink-800 border border-pink-200';
};

export const calculateServiceYears = (joinDate: string) => {
  const start = new Date(joinDate);
  const now = new Date();
  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();

  if (days < 0) {
    months--;
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  let result = '';
  if (years > 0) result += `${years} Y, `;
  if (months > 0) result += `${months} M, `;
  if (days >= 0) result += `${days} D`;

  if (result.endsWith(', ')) {
    result = result.slice(0, -2);
  }

  return result || '0 D';
};