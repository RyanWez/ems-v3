// Available local avatar images (excluding Andrea.svg which is reserved for specific employees)
const maleAvatars = [
  '/images/avatars/male/Adrian-M.svg',
  '/images/avatars/male/Easton-M.svg',
  '/images/avatars/male/Nolan-M.svg'
];

const femaleAvatars = [
  '/images/avatars/female/Amaya.svg',
  '/images/avatars/female/Jameson.svg',
  '/images/avatars/female/Kingston.svg',
  '/images/avatars/female/Luis.svg'
];

export const generateAvatarUrl = (name: string, gender: 'Male' | 'Female', position?: string) => {
  // Special cases: Assign Andrea.svg to specific employees
  if (name === 'AUNG SWE PHYO' || name === 'SOE MOE HTUN') {
    return '/images/avatars/male/Andrea.svg';
  }

  // Use local avatar images for other employees
  const avatarList = gender === 'Female' ? femaleAvatars : maleAvatars;

  // Create a simple hash from the name to consistently assign the same avatar
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Use the hash to select an avatar consistently for the same name
  const avatarIndex = Math.abs(hash) % avatarList.length;
  return avatarList[avatarIndex];
};

export const generateAvatarForRole = (name: string, gender: 'Male' | 'Female', position: string) => {
  // Special handling for Super and Leader positions
  const restrictedRoles = ['Super', 'Leader'];

  if (restrictedRoles.includes(position)) {
    return generateAvatarUrl(name, gender, position);
  }

  return generateAvatarUrl(name, gender, position);
};

export const getAvatarFallback = (name: string, gender: 'Male' | 'Female', position?: string) => {
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const isRestrictedRole = position && ['Super', 'Leader'].includes(position);

  // Different styling for restricted roles
  if (isRestrictedRole) {
    return {
      initials,
      className: `w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl border-2 border-white shadow-md`,
      bgColor: position === 'Super' ? 'bg-gradient-to-br from-purple-600 to-purple-800' : 'bg-gradient-to-br from-green-600 to-green-800'
    };
  }

  // Gender-specific fallback styling
  const baseClass = `w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl border-2 border-white shadow-md`;
  const bgColor = gender === 'Female'
    ? 'bg-gradient-to-br from-pink-500 to-rose-600'
    : 'bg-gradient-to-br from-blue-500 to-indigo-600';

  return {
    initials,
    className: baseClass,
    bgColor
  };
};