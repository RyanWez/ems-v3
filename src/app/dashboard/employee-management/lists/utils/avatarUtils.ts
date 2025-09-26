export const generateAvatarUrl = (name: string, gender: 'Male' | 'Female') => {
  // Use DiceBear API with lorelei style for better gender representation
  const seed = encodeURIComponent(name);
  const style = 'lorelei';

  // Generate gender-appropriate avatar with better styling
  const genderParam = gender === 'Female' ? 'female' : 'male';

  // Different color schemes for male and female
  const maleColors = 'b6e3f4,c0aede,d1d4f9,e0e7ff,dbeafe';
  const femaleColors = 'ffd5dc,ffdfbf,fce7f3,f3e8ff,fef3c7';
  const backgroundColor = gender === 'Female' ? femaleColors : maleColors;

  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&gender=${genderParam}&backgroundColor=${backgroundColor}&size=80&radius=50`;
};