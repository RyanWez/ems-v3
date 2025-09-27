export const generateAvatarUrl = (name: string, gender: 'Male' | 'Female', position?: string) => {
  // Use DiceBear API with enhanced styling for better representation
  const seed = encodeURIComponent(name + gender);
  const style = 'avataaars';

  // Enhanced gender-specific styling with better visual distinction
  const genderParam = gender === 'Female' ? 'female' : 'male';

  // Professional color schemes with better contrast
  const maleColors = '4F46E5,7C3AED,059669,DC2626,EA580C,B8860B';
  const femaleColors = 'EC4899,E11D48,BE185D,7C2D92,059669,DC2626';

  // Role-based color restrictions
  const restrictedRoles = ['Super', 'Leader'];
  const isRestrictedRole = position && restrictedRoles.includes(position);

  let backgroundColor;
  if (isRestrictedRole) {
    // Use neutral professional colors for Super and Leader
    backgroundColor = '0F172A,1E293B,334155,475569,64748B,94A3B8';
  } else {
    backgroundColor = gender === 'Female' ? femaleColors : maleColors;
  }

  // Enhanced parameters for better avatar quality
  const baseParams = [
    `seed=${seed}`,
    `backgroundColor=${backgroundColor}`,
    `size=120`,
    `radius=50`,
    ` accessoriesProbability=30`,
    `facialHairProbability=${gender === 'Male' ? 70 : 0}`,
    `hairProbability=95`,
    `clothingProbability=90`
  ];

  return `https://api.dicebear.com/7.x/${style}/svg?${baseParams.join('&')}`;
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