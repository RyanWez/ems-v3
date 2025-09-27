import { Employee } from '../../lists/types/employee';

export interface BirthdayEmployee {
  id: number;
  name: string;
  position: string;
  dob: string;
  age: number;
  birthdayDate: string;
}

export const calculateAge = (dob: string): number => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

export const isTodayBirthday = (dob: string): boolean => {
  const birthDate = new Date(dob);
  const today = new Date();
  
  return birthDate.getMonth() === today.getMonth() && 
         birthDate.getDate() === today.getDate();
};

export const isUpcomingBirthday = (dob: string, daysAhead: number = 15): boolean => {
  const birthDate = new Date(dob);
  const today = new Date();
  const currentYear = today.getFullYear();
  
  // Set birthday to current year
  const thisYearBirthday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());
  
  // If birthday already passed this year, check next year
  if (thisYearBirthday < today) {
    thisYearBirthday.setFullYear(currentYear + 1);
  }
  
  const diffTime = thisYearBirthday.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Return true if birthday is within the next 15 days (excluding today)
  return diffDays > 0 && diffDays <= daysAhead;
};

export const formatBirthdayDate = (dob: string): string => {
  const birthDate = new Date(dob);
  const today = new Date();
  const currentYear = today.getFullYear();
  
  // Set birthday to current year
  const thisYearBirthday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());
  
  // If birthday already passed this year, show next year
  if (thisYearBirthday < today) {
    thisYearBirthday.setFullYear(currentYear + 1);
  }
  
  return thisYearBirthday.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
};

export const formatMonthlyBirthdayDate = (dob: string): string => {
  const birthDate = new Date(dob);
  return birthDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
};

export const getTodayBirthdays = (employees: Employee[]): BirthdayEmployee[] => {
  return employees
    .filter(emp => isTodayBirthday(emp.dob))
    .map(emp => ({
      id: emp.id,
      name: emp.name,
      position: emp.position,
      dob: emp.dob,
      age: calculateAge(emp.dob),
      birthdayDate: 'Today'
    }));
};

export const getUpcomingBirthdays = (employees: Employee[]): BirthdayEmployee[] => {
  return employees
    .filter(emp => isUpcomingBirthday(emp.dob) && !isTodayBirthday(emp.dob))
    .map(emp => ({
      id: emp.id,
      name: emp.name,
      position: emp.position,
      dob: emp.dob,
      age: calculateAge(emp.dob),
      birthdayDate: formatBirthdayDate(emp.dob)
    }))
    .sort((a, b) => {
      const dateA = new Date(a.dob);
      const dateB = new Date(b.dob);
      const today = new Date();
      const currentYear = today.getFullYear();
      
      const thisYearA = new Date(currentYear, dateA.getMonth(), dateA.getDate());
      const thisYearB = new Date(currentYear, dateB.getMonth(), dateB.getDate());
      
      if (thisYearA < today) thisYearA.setFullYear(currentYear + 1);
      if (thisYearB < today) thisYearB.setFullYear(currentYear + 1);
      
      return thisYearA.getTime() - thisYearB.getTime();
    });
};

export const getBirthdaysByMonth = (employees: Employee[]) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const birthdaysByMonth = months.map((month, index) => ({
    month,
    monthIndex: index,
    employees: employees
      .filter(emp => new Date(emp.dob).getMonth() === index)
      .map(emp => ({
        id: emp.id,
        name: emp.name,
        position: emp.position,
        dob: emp.dob,
        age: calculateAge(emp.dob),
        birthdayDate: formatMonthlyBirthdayDate(emp.dob)
      }))
      .sort((a, b) => new Date(a.dob).getDate() - new Date(b.dob).getDate())
  }));
  
  return birthdaysByMonth;
};