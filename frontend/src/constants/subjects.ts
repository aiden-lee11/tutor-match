// Comprehensive list of subjects for tutoring platform - raw list before deduplication
const SUBJECTS_RAW = [
  // Mathematics
  'Mathematics',
  'Algebra',
  'Geometry',
  'Calculus',
  'Statistics',
  'Trigonometry',
  'Pre-Calculus',
  'Linear Algebra',
  'Differential Equations',
  'Discrete Mathematics',
  'Number Theory',
  'Applied Mathematics',
  'Elementary Math',
  'Basic Math',
  'Mathematical Modeling',

  // Sciences
  'Physics',
  'Chemistry',
  'Biology',
  'Biochemistry',
  'Organic Chemistry',
  'Inorganic Chemistry',
  'Physical Chemistry',
  'Analytical Chemistry',
  'Molecular Biology',
  'Cell Biology',
  'Genetics',
  'Microbiology',
  'Anatomy',
  'Physiology',
  'Botany',
  'Zoology',
  'Ecology',
  'Environmental Science',
  'Earth Science',
  'Geology',
  'Astronomy',

  // Computer Science & Technology
  'Computer Science',
  'Programming',
  'Python',
  'Java',
  'JavaScript',
  'C++',
  'C',
  'HTML',
  'CSS',
  'React',
  'Node.js',
  'Data Structures',
  'Algorithms',
  'Database Design',
  'SQL',
  'Web Development',
  'Mobile Development',
  'Machine Learning',
  'Artificial Intelligence',
  'Data Science',
  'Cybersecurity',
  'Software Engineering',
  'Computer Networks',

  // Languages
  'English',
  'Spanish',
  'French',
  'German',
  'Italian',
  'Portuguese',
  'Chinese (Mandarin)',
  'Japanese',
  'Korean',
  'Arabic',
  'Russian',
  'Latin',
  'Greek',
  'ESL (English as Second Language)',
  'English Literature',
  'Creative Writing',
  'Grammar',
  'Vocabulary',
  'Reading Comprehension',
  'Writing Skills',

  // Social Sciences & Humanities
  'History',
  'World History',
  'American History',
  'European History',
  'Ancient History',
  'Government',
  'Political Science',
  'Psychology',
  'Sociology',
  'Anthropology',
  'Philosophy',
  'Ethics',
  'Economics',
  'Microeconomics',
  'Macroeconomics',
  'Business Studies',
  'Accounting',
  'Finance',
  'Marketing',
  'Management',
  'Geography',
  'International Relations',

  // Arts & Creative
  'Art',
  'Drawing',
  'Painting',
  'Sculpture',
  'Art History',
  'Music',
  'Piano',
  'Guitar',
  'Violin',
  'Voice/Singing',
  'Music Theory',
  'Music Composition',
  'Theater',
  'Drama',
  'Dance',
  'Photography',
  'Film Studies',
  'Creative Writing',
  'Poetry',

  // Test Preparation
  'SAT Preparation',
  'ACT Preparation',
  'GRE Preparation',
  'GMAT Preparation',
  'LSAT Preparation',
  'MCAT Preparation',
  'TOEFL Preparation',
  'IELTS Preparation',
  'AP Biology',
  'AP Chemistry',
  'AP Physics',
  'AP Calculus',
  'AP Statistics',
  'AP English Language',
  'AP English Literature',
  'AP History',
  'AP Psychology',
  'AP Computer Science',
  'IB Biology',
  'IB Chemistry',
  'IB Physics',
  'IB Mathematics',
  'IB English',
  'IB History',

  // Engineering & Technical
  'Engineering',
  'Mechanical Engineering',
  'Electrical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Biomedical Engineering',
  'Aerospace Engineering',
  'Industrial Engineering',
  'Materials Science',
  'Thermodynamics',
  'Fluid Mechanics',
  'Statics',
  'Dynamics',
  'Circuit Analysis',
  'Digital Logic',

  // Medical & Health Sciences
  'Medicine',
  'Pre-Med',
  'Nursing',
  'Public Health',
  'Health Sciences',
  'Pharmacology',
  'Pathology',
  'Medical Terminology',
  'Nutrition',
  'Kinesiology',
  'Physical Therapy',
  'Occupational Therapy',

  // Elementary & K-12 Specific (Elementary Math already listed in Mathematics section)
  'Elementary Science',
  'Elementary Reading',
  'Elementary Writing',
  'Kindergarten',
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
  'Grade 5',
  'Grade 6',
  'Grade 7',
  'Grade 8',
  'Grade 9',
  'Grade 10',
  'Grade 11',
  'Grade 12',
  'Middle School Math',
  'Middle School Science',
  'High School Math',
  'High School Science',
  'High School English',
  'High School History',

  // Special Needs & Learning Support
  'Special Education',
  'Learning Disabilities',
  'ADHD Support',
  'Autism Support',
  'Dyslexia Support',
  'Study Skills',
  'Organization Skills',
  'Time Management',
  'Note Taking',
  'Test Taking Strategies',

  // Professional & Career
  'Resume Writing',
  'Interview Preparation',
  'Career Counseling',
  'Job Search Strategies',
  'Professional Development',
  'Public Speaking',
  'Presentation Skills',
  'Leadership Skills',
  'Communication Skills',
  'Project Management',

  // College & University Applications
  'College Application',
  'College Essays',
  'Personal Statement',
  'University Application',
  'Admissions Counseling',
  'Scholarship Applications',
  'College Preparation',
  'Essay Writing',
  'Medical School Application',
  'Law School Application',
  'Graduate School Application',

  // Specialized Fields
  'Architecture',
  'Urban Planning',
  'Journalism',
  'Communications',
  'Public Relations',
  'Social Work',
  'Education',
  'Library Science',
  'Information Science',
  'Criminal Justice',
  'Law',
  'Paralegal Studies',
  'Real Estate',
  'Insurance',
  'Hospitality Management',
  'Tourism',
  'Agriculture',
  'Veterinary Science',
  'Forestry',
  'Environmental Studies',

  // Life Skills & Practical
  'Study Habits',
  'Academic Writing',
  'Research Methods',
  'Critical Thinking',
  'Problem Solving',
  'Memory Techniques',
  'Speed Reading',
  'Essay Structure',
  'Citation Styles (APA, MLA, Chicago)',
  'Thesis Writing',
  'Dissertation Support'
];

// Export deduplicated subjects array to ensure no duplicates
export const SUBJECTS = Array.from(new Set(SUBJECTS_RAW)).sort();

// Categories for organizing subjects
export const SUBJECT_CATEGORIES = {
  'Mathematics': [
    'Mathematics', 'Algebra', 'Geometry', 'Calculus', 'Statistics', 'Trigonometry', 
    'Pre-Calculus', 'Linear Algebra', 'Differential Equations', 'Discrete Mathematics', 
    'Number Theory', 'Applied Mathematics', 'Elementary Math', 'Basic Math', 'Mathematical Modeling'
  ],
  'Sciences': [
    'Physics', 'Chemistry', 'Biology', 'Biochemistry', 'Organic Chemistry', 'Inorganic Chemistry',
    'Physical Chemistry', 'Analytical Chemistry', 'Molecular Biology', 'Cell Biology', 'Genetics',
    'Microbiology', 'Anatomy', 'Physiology', 'Botany', 'Zoology', 'Ecology', 'Environmental Science',
    'Earth Science', 'Geology', 'Astronomy'
  ],
  'Computer Science': [
    'Computer Science', 'Programming', 'Python', 'Java', 'JavaScript', 'C++', 'C', 'HTML', 'CSS',
    'React', 'Node.js', 'Data Structures', 'Algorithms', 'Database Design', 'SQL', 'Web Development',
    'Mobile Development', 'Machine Learning', 'Artificial Intelligence', 'Data Science', 'Cybersecurity',
    'Software Engineering', 'Computer Networks'
  ],
  'Languages': [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese (Mandarin)', 'Japanese',
    'Korean', 'Arabic', 'Russian', 'Latin', 'Greek', 'ESL (English as Second Language)', 'English Literature',
    'Creative Writing', 'Grammar', 'Vocabulary', 'Reading Comprehension', 'Writing Skills'
  ],
  'Test Preparation': [
    'SAT Preparation', 'ACT Preparation', 'GRE Preparation', 'GMAT Preparation', 'LSAT Preparation',
    'MCAT Preparation', 'TOEFL Preparation', 'IELTS Preparation', 'AP Biology', 'AP Chemistry', 'AP Physics',
    'AP Calculus', 'AP Statistics', 'AP English Language', 'AP English Literature', 'AP History',
    'AP Psychology', 'AP Computer Science', 'IB Biology', 'IB Chemistry', 'IB Physics', 'IB Mathematics',
    'IB English', 'IB History'
  ],
  'Elementary & K-12': [
    'Elementary Science', 'Elementary Reading', 'Elementary Writing', 'Kindergarten',
    'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8',
    'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'Middle School Math', 'Middle School Science',
    'High School Math', 'High School Science', 'High School English', 'High School History'
  ]
};

// Function to get subjects by category
export const getSubjectsByCategory = (category: string): string[] => {
  return SUBJECT_CATEGORIES[category as keyof typeof SUBJECT_CATEGORIES] || [];
};

// Function to search subjects (basic implementation, will be enhanced with fuzzy search)
export const searchSubjects = (query: string): string[] => {
  if (!query.trim()) return SUBJECTS;
  
  const lowercaseQuery = query.toLowerCase();
  // Use Set to ensure no duplicates in search results
  const results = SUBJECTS.filter(subject => 
    subject.toLowerCase().includes(lowercaseQuery)
  );
  
  return Array.from(new Set(results));
};
