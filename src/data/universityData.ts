import { TargetUniversity, TargetHighSchool, GradeEntry, Semester } from '../types';

// 고교학점제 권장 및 대표 과목 리스트 (공통, 일반선택, 진로선택, 융합선택)
export const HIGH_SCHOOL_SUBJECTS = [
  '공통국어',
  '공통수학',
  '공통영어',
  '통합사회',
  '통합과학',
  '한국사',
  '과학탐구실험',
  '대수',
  '미적분Ⅰ',
  '확률과통계',
  '독서와작문',
  '문학',
  '영어독해와작문',
  '영미문학읽기',
  '물리학',
  '화학',
  '생명과학',
  '지구과학',
  '경제',
  '정치와법',
  '사회·문화',
  '세계지리',
  '생활과윤리',
  '윤리와사상',
  '인공지능기초',
  '프로그래밍',
  '고급물리학',
  '고급화학',
  '고급생명과학',
  '미적분Ⅱ',
  '기하'
];

// 중학교 기본 5개 교과
export const MIDDLE_SCHOOL_SUBJECTS = ['국어', '수학', '영어', '사회', '과학'];

// 진로 분야 프리셋
export const CAREER_PRESETS = [
  '의예·치의예·약학 계열',
  '컴퓨터공학·인공지능(AI)·소프트웨어',
  '경영학·경제학·금융통계',
  '전자전기공학·반도체시스템',
  '바이오생명공학·생명과학',
  '기계항공·로봇모빌리티',
  '화학공학·신소재나노',
  '미디어커뮤니케이션·콘텐츠',
  '행정학·공공인재·법학',
  '초등교육·사범대 교육계열'
];

// 주요 대학 수시 학생부교과전형 2개년 (2024, 2025학년도) 입결 데이터셋
export const UNIVERSITY_DATABASE: TargetUniversity[] = [
  // 서울대학교 (지역균형/교과전형 성격)
  {
    id: 'snu-cs',
    university: '서울대학교',
    department: '컴퓨터공학부',
    admissionType: '지역균형전형',
    cut2024: 1.12,
    cut2025: 1.10,
    minSatRequirement: '국, 수(미/기), 영, 과탐(2) 중 3개 영역 등급 합 7 이내'
  },
  {
    id: 'snu-med',
    university: '서울대학교',
    department: '의예과',
    admissionType: '지역균형전형',
    cut2024: 1.04,
    cut2025: 1.03,
    minSatRequirement: '국, 수(미/기), 영, 과탐(2) 중 3개 영역 등급 합 7 이내'
  },
  {
    id: 'snu-biz',
    university: '서울대학교',
    department: '경영대학',
    admissionType: '지역균형전형',
    cut2024: 1.15,
    cut2025: 1.13,
    minSatRequirement: '국, 수, 영, 탐 중 3개 영역 등급 합 7 이내'
  },
  {
    id: 'snu-ee',
    university: '서울대학교',
    department: '전기정보공학부',
    admissionType: '지역균형전형',
    cut2024: 1.16,
    cut2025: 1.14,
    minSatRequirement: '국, 수(미/기), 영, 과탐(2) 중 3개 영역 등급 합 7 이내'
  },

  // 연세대학교 (추천형 학생부교과)
  {
    id: 'yonsei-med',
    university: '연세대학교',
    department: '의예과',
    admissionType: '학생부위주(추천형)',
    cut2024: 1.02,
    cut2025: 1.03,
    minSatRequirement: '국, 수(미/기) 중 1개 포함 1등급 2개 (과탐 평균 1등급)'
  },
  {
    id: 'yonsei-cs',
    university: '연세대학교',
    department: '컴퓨터과학과',
    admissionType: '학생부위주(추천형)',
    cut2024: 1.25,
    cut2025: 1.22,
    minSatRequirement: '국, 수, 과(1) 중 2개 1등급 (영어 3, 한국사 4)'
  },
  {
    id: 'yonsei-biz',
    university: '연세대학교',
    department: '경영학과',
    admissionType: '학생부위주(추천형)',
    cut2024: 1.28,
    cut2025: 1.26,
    minSatRequirement: '국, 수 중 1개 포함 2개 1등급 (영어 3, 한국사 4)'
  },
  {
    id: 'yonsei-ee',
    university: '연세대학교',
    department: '전기전자공학부',
    admissionType: '학생부위주(추천형)',
    cut2024: 1.31,
    cut2025: 1.29,
    minSatRequirement: '국, 수, 과(1) 중 2개 1등급 (영어 3, 한국사 4)'
  },

  // 고려대학교 (학교추천 학생부교과)
  {
    id: 'korea-med',
    university: '고려대학교',
    department: '의예과',
    admissionType: '학교추천전형',
    cut2024: 1.05,
    cut2025: 1.06,
    minSatRequirement: '국, 수(미/기), 영, 과탐(2) 4개 영역 등급 합 5 이내, 한국사 4 이내'
  },
  {
    id: 'korea-cs',
    university: '고려대학교',
    department: '컴퓨터학과',
    admissionType: '학교추천전형',
    cut2024: 1.32,
    cut2025: 1.30,
    minSatRequirement: '국, 수, 영, 과탐(2) 중 3개 영역 등급 합 7 이내'
  },
  {
    id: 'korea-biz',
    university: '고려대학교',
    department: '경영대학',
    admissionType: '학교추천전형',
    cut2024: 1.38,
    cut2025: 1.35,
    minSatRequirement: '국, 수, 영, 탐(2) 중 3개 영역 등급 합 7 이내'
  },
  {
    id: 'korea-media',
    university: '고려대학교',
    department: '미디어학부',
    admissionType: '학교추천전형',
    cut2024: 1.45,
    cut2025: 1.42,
    minSatRequirement: '국, 수, 영, 탐(2) 중 3개 영역 등급 합 7 이내'
  },

  // 성균관대학교 (학교장추천)
  {
    id: 'skku-sw',
    university: '성균관대학교',
    department: '소프트웨어학과',
    admissionType: '학교장추천전형',
    cut2024: 1.42,
    cut2025: 1.39,
    minSatRequirement: '국, 수, 영, 탐(2) 중 3개 등급 합 7 이내'
  },
  {
    id: 'skku-biz',
    university: '성균관대학교',
    department: '글로벌경영학과',
    admissionType: '학교장추천전형',
    cut2024: 1.45,
    cut2025: 1.44,
    minSatRequirement: '국, 수, 영, 탐(2) 중 3개 등급 합 6 이내'
  },
  {
    id: 'skku-ee',
    university: '성균관대학교',
    department: '전자전기공학부',
    admissionType: '학교장추천전형',
    cut2024: 1.54,
    cut2025: 1.51,
    minSatRequirement: '국, 수, 영, 탐(2) 중 3개 등급 합 7 이내'
  },

  // 서강대학교 (지역균형)
  {
    id: 'sogang-cs',
    university: '서강대학교',
    department: '컴퓨터공학과',
    admissionType: '지역균형전형',
    cut2024: 1.48,
    cut2025: 1.45,
    minSatRequirement: '국, 수, 영, 탐(1) 4개 영역 중 3개 각 3등급 이내'
  },
  {
    id: 'sogang-biz',
    university: '서강대학교',
    department: '경영학부',
    admissionType: '지역균형전형',
    cut2024: 1.51,
    cut2025: 1.48,
    minSatRequirement: '국, 수, 영, 탐(1) 4개 영역 중 3개 각 3등급 이내'
  },

  // 한양대학교 (지역균형발전)
  {
    id: 'hanyang-cs',
    university: '한양대학교',
    department: '컴퓨터소프트웨어학부',
    admissionType: '지역균형발전전형',
    cut2024: 1.34,
    cut2025: 1.32,
    minSatRequirement: '국, 수, 영, 탐(1) 중 3개 영역 등급 합 7 이내'
  },
  {
    id: 'hanyang-biz',
    university: '한양대학교',
    department: '경영학부',
    admissionType: '지역균형발전전형',
    cut2024: 1.52,
    cut2025: 1.50,
    minSatRequirement: '국, 수, 영, 탐(1) 중 3개 영역 등급 합 7 이내'
  },

  // 중앙대학교 (지역균형)
  {
    id: 'cau-ai',
    university: '중앙대학교',
    department: 'AI학과',
    admissionType: '지역균형전형',
    cut2024: 1.58,
    cut2025: 1.55,
    minSatRequirement: '국, 수, 영, 과탐(1) 중 3개 등급 합 7 이내'
  },
  {
    id: 'cau-biz',
    university: '중앙대학교',
    department: '경영학부',
    admissionType: '지역균형전형',
    cut2024: 1.68,
    cut2025: 1.65,
    minSatRequirement: '국, 수, 영, 탐(1) 중 3개 등급 합 7 이내'
  },

  // 경희대학교 (지역균형)
  {
    id: 'khu-bio',
    university: '경희대학교',
    department: '생체의공학과',
    admissionType: '지역균형전형',
    cut2024: 1.69,
    cut2025: 1.66,
    minSatRequirement: '국, 수, 영, 탐(1) 중 2개 영역 등급 합 5 이내'
  },
  {
    id: 'khu-media',
    university: '경희대학교',
    department: '미디어학과',
    admissionType: '지역균형전형',
    cut2024: 1.76,
    cut2025: 1.72,
    minSatRequirement: '국, 수, 영, 탐(1) 중 2개 영역 등급 합 5 이내'
  },

  // 서울시립대학교 (지역균형선발)
  {
    id: 'uos-tax',
    university: '서울시립대학교',
    department: '세무학과',
    admissionType: '지역균형선발전형',
    cut2024: 1.62,
    cut2025: 1.60,
    minSatRequirement: '국, 수, 영, 탐(1) 중 3개 등급 합 7 이내'
  },

  // 건국대학교 (KU지역균형)
  {
    id: 'ku-cs',
    university: '건국대학교',
    department: '컴퓨터공학부',
    admissionType: 'KU지역균형',
    cut2024: 1.82,
    cut2025: 1.78,
    minSatRequirement: '수능 최저학력기준 없음 (서류평가 30% 반영)'
  },
  {
    id: 'ku-vet',
    university: '건국대학교',
    department: '수의예과',
    admissionType: 'KU지역균형',
    cut2024: 1.18,
    cut2025: 1.16,
    minSatRequirement: '국, 수, 영, 과탐(2) 중 3개 등급 합 5 이내'
  }
];

// 중학생용 추천 고등학교 프리셋
export const TARGET_HIGH_SCHOOLS_PRESETS: TargetHighSchool[] = [
  {
    id: 'hana',
    name: '하나고등학교',
    type: '자율형사립고(전국)',
    region: '서울 강남·서초',
    competitiveLevel: '최상'
  },
  {
    id: 'daewon',
    name: '대원외국어고등학교',
    type: '특수목적고(외고/국제고)',
    region: '서울 강남·서초',
    competitiveLevel: '최상'
  },
  {
    id: 'hanyoung',
    name: '한영과학고등학교',
    type: '특수목적고(과학고)',
    region: '서울 강남·서초',
    competitiveLevel: '최상'
  },
  {
    id: 'whimoon',
    name: '휘문고등학교',
    type: '자율형사립고(광역)',
    region: '서울 강남·서초',
    competitiveLevel: '최상'
  },
  {
    id: 'dandai',
    name: '단국대학교사범대학부속고등학교',
    type: '일반고',
    region: '서울 강남·서초',
    competitiveLevel: '상'
  },
  {
    id: 'naksaeng',
    name: '낙생고등학교',
    type: '일반고',
    region: '경기 분당·수지',
    competitiveLevel: '최상'
  },
  {
    id: 'mokdong',
    name: '목동고등학교',
    type: '일반고',
    region: '서울 양천·목동',
    competitiveLevel: '상'
  },
  {
    id: 'seohyeon',
    name: '서현고등학교',
    type: '일반고',
    region: '경기 분당·수지',
    competitiveLevel: '상'
  },
  {
    id: 'standard-gen',
    name: '서울 명지일반고등학교',
    type: '일반고',
    region: '일반 평준화 지역',
    competitiveLevel: '중'
  }
];

// 빈 성적 입력표 생성 함수 (초기 상태는 완전히 비어있음)
export function createEmptyMiddleGrades(): Record<Semester, GradeEntry[]> {
  const semesters: Semester[] = ['1-1', '1-2', '2-1', '2-2', '3-1', '3-2'];
  const subjects = ['국어', '수학', '영어', '사회', '과학'];
  const result = {} as Record<Semester, GradeEntry[]>;

  semesters.forEach((sem, sIdx) => {
    result[sem] = subjects.map((subj, subIdx) => ({
      id: `m-empty-${sIdx}-${subIdx}`,
      subject: subj,
      rawScore: '',
      average: '',
      distribution: { A: '', B: '', C: '', D: '', E: '' },
      studentCount: ''
    }));
  });

  return result;
}

export function createEmptyHighGrades(): Record<Semester, GradeEntry[]> {
  const semesters: Semester[] = ['1-1', '1-2', '2-1', '2-2', '3-1', '3-2'];
  const defaultSubjectsBySem: Record<Semester, string[]> = {
    '1-1': ['공통국어', '공통수학', '공통영어', '통합사회', '통합과학', '한국사', '과학탐구실험'],
    '1-2': ['공통국어', '공통수학', '공통영어', '통합사회', '통합과학', '한국사', '과학탐구실험'],
    '2-1': ['독서와작문', '대수', '영어독해와작문', '물리학', '화학', '프로그래밍', '생활과윤리'],
    '2-2': ['문학', '미적분Ⅰ', '영어독해와작문', '생명과학', '지구과학', '인공지능기초', '사회·문화'],
    '3-1': ['독서와작문', '미적분Ⅱ', '확률과통계', '영미문학읽기', '고급물리학', '경제', '윤리와사상'],
    '3-2': ['문학', '확률과통계', '영미문학읽기', '고급생명과학', '프로그래밍', '정치와법', '세계지리']
  };

  const result = {} as Record<Semester, GradeEntry[]>;
  semesters.forEach((sem, sIdx) => {
    result[sem] = defaultSubjectsBySem[sem].map((subj, subIdx) => ({
      id: `h-empty-${sIdx}-${subIdx}`,
      subject: subj,
      rawScore: '',
      grade5: '',
      average: '',
      distribution: { A: '', B: '', C: '', D: '', E: '' },
      studentCount: '',
      isCareerSubject: subIdx === 1 || subIdx === 4 || subIdx === 5
    }));
  });

  return result;
}

// 예시 데이터 1: 중학생 샘플 (성적 우수, 이과 계열 희망)
export const SAMPLE_MIDDLE_GRADES: Record<Semester, GradeEntry[]> = {
  '1-1': [
    { id: 'm1-1', subject: '국어', rawScore: 94, average: 75.2, distribution: { A: 28, B: 24, C: 20, D: 16, E: 12 }, studentCount: 230 },
    { id: 'm1-2', subject: '수학', rawScore: 98, average: 68.4, distribution: { A: 18, B: 22, C: 24, D: 20, E: 16 }, studentCount: 230 },
    { id: 'm1-3', subject: '영어', rawScore: 96, average: 72.0, distribution: { A: 25, B: 23, C: 21, D: 17, E: 14 }, studentCount: 230 },
    { id: 'm1-4', subject: '사회', rawScore: 92, average: 77.5, distribution: { A: 32, B: 26, C: 20, D: 14, E: 8 }, studentCount: 230 },
    { id: 'm1-5', subject: '과학', rawScore: 95, average: 70.8, distribution: { A: 22, B: 24, C: 22, D: 18, E: 14 }, studentCount: 230 },
  ],
  '1-2': [
    { id: 'm2-1', subject: '국어', rawScore: 92, average: 74.0, distribution: { A: 26, B: 25, C: 22, D: 15, E: 12 }, studentCount: 230 },
    { id: 'm2-2', subject: '수학', rawScore: 100, average: 66.5, distribution: { A: 16, B: 20, C: 26, D: 22, E: 16 }, studentCount: 230 },
    { id: 'm2-3', subject: '영어', rawScore: 97, average: 71.3, distribution: { A: 24, B: 24, C: 22, D: 16, E: 14 }, studentCount: 230 },
    { id: 'm2-4', subject: '사회', rawScore: 94, average: 76.1, distribution: { A: 30, B: 27, C: 21, D: 13, E: 9 }, studentCount: 230 },
    { id: 'm2-5', subject: '과학', rawScore: 96, average: 69.2, distribution: { A: 20, B: 23, C: 24, D: 19, E: 14 }, studentCount: 230 },
  ],
  '2-1': [
    { id: 'm3-1', subject: '국어', rawScore: 95, average: 73.5, distribution: { A: 25, B: 24, C: 23, D: 16, E: 12 }, studentCount: 228 },
    { id: 'm3-2', subject: '수학', rawScore: 98, average: 65.0, distribution: { A: 15, B: 21, C: 25, D: 22, E: 17 }, studentCount: 228 },
    { id: 'm3-3', subject: '영어', rawScore: 98, average: 70.1, distribution: { A: 23, B: 25, C: 22, D: 16, E: 14 }, studentCount: 228 },
    { id: 'm3-4', subject: '사회', rawScore: 93, average: 75.0, distribution: { A: 29, B: 26, C: 22, D: 14, E: 9 }, studentCount: 228 },
    { id: 'm3-5', subject: '과학', rawScore: 97, average: 68.0, distribution: { A: 19, B: 22, C: 25, D: 20, E: 14 }, studentCount: 228 },
  ],
  '2-2': [
    { id: 'm4-1', subject: '국어', rawScore: 96, average: 72.8, distribution: { A: 24, B: 26, C: 22, D: 16, E: 12 }, studentCount: 228 },
    { id: 'm4-2', subject: '수학', rawScore: 99, average: 64.2, distribution: { A: 14, B: 19, C: 27, D: 23, E: 17 }, studentCount: 228 },
    { id: 'm4-3', subject: '영어', rawScore: 96, average: 69.5, distribution: { A: 22, B: 26, C: 23, D: 16, E: 13 }, studentCount: 228 },
    { id: 'm4-4', subject: '사회', rawScore: 95, average: 74.2, distribution: { A: 28, B: 27, C: 22, D: 14, E: 9 }, studentCount: 228 },
    { id: 'm4-5', subject: '과학', rawScore: 98, average: 67.4, distribution: { A: 18, B: 23, C: 25, D: 20, E: 14 }, studentCount: 228 },
  ],
  '3-1': [
    { id: 'm5-1', subject: '국어', rawScore: 95, average: 71.9, distribution: { A: 23, B: 25, C: 24, D: 16, E: 12 }, studentCount: 225 },
    { id: 'm5-2', subject: '수학', rawScore: 100, average: 62.8, distribution: { A: 13, B: 18, C: 28, D: 23, E: 18 }, studentCount: 225 },
    { id: 'm5-3', subject: '영어', rawScore: 99, average: 68.2, distribution: { A: 21, B: 25, C: 24, D: 17, E: 13 }, studentCount: 225 },
    { id: 'm5-4', subject: '사회', rawScore: 96, average: 73.1, distribution: { A: 27, B: 28, C: 22, D: 14, E: 9 }, studentCount: 225 },
    { id: 'm5-5', subject: '과학', rawScore: 99, average: 66.0, distribution: { A: 17, B: 22, C: 26, D: 21, E: 14 }, studentCount: 225 },
  ],
  '3-2': [
    { id: 'm6-1', subject: '국어', rawScore: 96, average: 71.0, distribution: { A: 22, B: 26, C: 24, D: 16, E: 12 }, studentCount: 225 },
    { id: 'm6-2', subject: '수학', rawScore: 98, average: 63.5, distribution: { A: 14, B: 19, C: 27, D: 22, E: 18 }, studentCount: 225 },
    { id: 'm6-3', subject: '영어', rawScore: 97, average: 68.9, distribution: { A: 20, B: 26, C: 24, D: 17, E: 13 }, studentCount: 225 },
    { id: 'm6-4', subject: '사회', rawScore: 97, average: 72.5, distribution: { A: 26, B: 29, C: 22, D: 14, E: 9 }, studentCount: 225 },
    { id: 'm6-5', subject: '과학', rawScore: 98, average: 65.5, distribution: { A: 16, B: 23, C: 26, D: 21, E: 14 }, studentCount: 225 },
  ],
};

// 예시 데이터 2: 고등학생 샘플 (5등급제 기준 1~2등급 최상위권, AI/컴퓨터공학 희망)
export const SAMPLE_HIGH_GRADES: Record<Semester, GradeEntry[]> = {
  '1-1': [
    { id: 'h1-1', subject: '공통국어', rawScore: 93, average: 69.4, distribution: { A: 20, B: 25, C: 27, D: 18, E: 10 }, studentCount: 210, grade5: 1, isCareerSubject: false },
    { id: 'h1-2', subject: '공통수학', rawScore: 98, average: 62.1, distribution: { A: 12, B: 21, C: 30, D: 22, E: 15 }, studentCount: 210, grade5: 1, isCareerSubject: true },
    { id: 'h1-3', subject: '공통영어', rawScore: 95, average: 67.5, distribution: { A: 18, B: 24, C: 28, D: 19, E: 11 }, studentCount: 210, grade5: 1, isCareerSubject: false },
    { id: 'h1-4', subject: '통합사회', rawScore: 91, average: 71.8, distribution: { A: 24, B: 28, C: 26, D: 14, E: 8 }, studentCount: 210, grade5: 2, isCareerSubject: false },
    { id: 'h1-5', subject: '통합과학', rawScore: 97, average: 64.3, distribution: { A: 15, B: 22, C: 29, D: 21, E: 13 }, studentCount: 210, grade5: 1, isCareerSubject: true },
    { id: 'h1-6', subject: '한국사', rawScore: 92, average: 73.0, distribution: { A: 25, B: 27, C: 25, D: 15, E: 8 }, studentCount: 210, grade5: 2, isCareerSubject: false },
    { id: 'h1-7', subject: '과학탐구실험', rawScore: 96, average: 78.5, distribution: { A: 38, B: 30, C: 18, D: 10, E: 4 }, studentCount: 210, grade5: 1, isCareerSubject: true },
  ],
  '1-2': [
    { id: 'h2-1', subject: '공통국어', rawScore: 91, average: 68.0, distribution: { A: 19, B: 26, C: 28, D: 17, E: 10 }, studentCount: 210, grade5: 2, isCareerSubject: false },
    { id: 'h2-2', subject: '공통수학', rawScore: 97, average: 60.5, distribution: { A: 11, B: 20, C: 31, D: 23, E: 15 }, studentCount: 210, grade5: 1, isCareerSubject: true },
    { id: 'h2-3', subject: '공통영어', rawScore: 96, average: 66.2, distribution: { A: 17, B: 23, C: 29, D: 20, E: 11 }, studentCount: 210, grade5: 1, isCareerSubject: false },
    { id: 'h2-4', subject: '통합사회', rawScore: 90, average: 70.5, distribution: { A: 22, B: 27, C: 27, D: 15, E: 9 }, studentCount: 210, grade5: 2, isCareerSubject: false },
    { id: 'h2-5', subject: '통합과학', rawScore: 96, average: 63.8, distribution: { A: 14, B: 23, C: 28, D: 22, E: 13 }, studentCount: 210, grade5: 1, isCareerSubject: true },
    { id: 'h2-6', subject: '한국사', rawScore: 94, average: 72.1, distribution: { A: 24, B: 28, C: 25, D: 14, E: 9 }, studentCount: 210, grade5: 1, isCareerSubject: false },
    { id: 'h2-7', subject: '인공지능기초', rawScore: 99, average: 71.0, distribution: { A: 21, B: 26, C: 26, D: 18, E: 9 }, studentCount: 160, grade5: 1, isCareerSubject: true },
  ],
  '2-1': [
    { id: 'h3-1', subject: '독서와작문', rawScore: 92, average: 67.2, distribution: { A: 18, B: 25, C: 29, D: 18, E: 10 }, studentCount: 205, grade5: 2, isCareerSubject: false },
    { id: 'h3-2', subject: '대수', rawScore: 99, average: 58.6, distribution: { A: 10, B: 19, C: 32, D: 24, E: 15 }, studentCount: 180, grade5: 1, isCareerSubject: true },
    { id: 'h3-3', subject: '영어독해와작문', rawScore: 96, average: 65.4, distribution: { A: 16, B: 24, C: 30, D: 19, E: 11 }, studentCount: 205, grade5: 1, isCareerSubject: false },
    { id: 'h3-4', subject: '물리학', rawScore: 98, average: 57.0, distribution: { A: 11, B: 18, C: 31, D: 24, E: 16 }, studentCount: 140, grade5: 1, isCareerSubject: true },
    { id: 'h3-5', subject: '화학', rawScore: 94, average: 61.2, distribution: { A: 13, B: 21, C: 30, D: 22, E: 14 }, studentCount: 155, grade5: 1, isCareerSubject: true },
    { id: 'h3-6', subject: '프로그래밍', rawScore: 100, average: 69.5, distribution: { A: 20, B: 25, C: 28, D: 18, E: 9 }, studentCount: 95, grade5: 1, isCareerSubject: true },
    { id: 'h3-7', subject: '생활과윤리', rawScore: 93, average: 72.8, distribution: { A: 24, B: 28, C: 26, D: 14, E: 8 }, studentCount: 205, grade5: 1, isCareerSubject: false },
  ],
  '2-2': [
    { id: 'h4-1', subject: '문학', rawScore: 91, average: 66.5, distribution: { A: 17, B: 26, C: 29, D: 18, E: 10 }, studentCount: 205, grade5: 2, isCareerSubject: false },
    { id: 'h4-2', subject: '미적분Ⅰ', rawScore: 98, average: 56.4, distribution: { A: 9, B: 18, C: 33, D: 25, E: 15 }, studentCount: 175, grade5: 1, isCareerSubject: true },
    { id: 'h4-3', subject: '영어독해와작문', rawScore: 95, average: 64.8, distribution: { A: 15, B: 25, C: 31, D: 19, E: 10 }, studentCount: 205, grade5: 1, isCareerSubject: false },
    { id: 'h4-4', subject: '물리학', rawScore: 97, average: 56.2, distribution: { A: 10, B: 18, C: 32, D: 24, E: 16 }, studentCount: 140, grade5: 1, isCareerSubject: true },
    { id: 'h4-5', subject: '생명과학', rawScore: 93, average: 62.0, distribution: { A: 14, B: 22, C: 29, D: 22, E: 13 }, studentCount: 150, grade5: 2, isCareerSubject: true },
    { id: 'h4-6', subject: '기하', rawScore: 96, average: 63.5, distribution: { A: 16, B: 23, C: 29, D: 20, E: 12 }, studentCount: 120, grade5: 1, isCareerSubject: true },
    { id: 'h4-7', subject: '사회·문화', rawScore: 92, average: 71.2, distribution: { A: 23, B: 27, C: 27, D: 15, E: 8 }, studentCount: 205, grade5: 2, isCareerSubject: false },
  ],
  '3-1': [
    { id: 'h5-1', subject: '독서와작문', rawScore: 93, average: 65.8, distribution: { A: 16, B: 25, C: 30, D: 19, E: 10 }, studentCount: 200, grade5: 1, isCareerSubject: false },
    { id: 'h5-2', subject: '미적분Ⅱ', rawScore: 99, average: 54.0, distribution: { A: 8, B: 17, C: 34, D: 25, E: 16 }, studentCount: 150, grade5: 1, isCareerSubject: true },
    { id: 'h5-3', subject: '영미문학읽기', rawScore: 97, average: 63.9, distribution: { A: 15, B: 24, C: 32, D: 19, E: 10 }, studentCount: 200, grade5: 1, isCareerSubject: false },
    { id: 'h5-4', subject: '고급물리학', rawScore: 98, average: 58.5, distribution: { A: 12, B: 22, C: 32, D: 22, E: 12 }, studentCount: 65, grade5: 1, isCareerSubject: true },
    { id: 'h5-5', subject: '확률과통계', rawScore: 96, average: 61.5, distribution: { A: 13, B: 21, C: 31, D: 22, E: 13 }, studentCount: 180, grade5: 1, isCareerSubject: true },
    { id: 'h5-6', subject: '인공지능기초', rawScore: 100, average: 68.0, distribution: { A: 22, B: 27, C: 26, D: 17, E: 8 }, studentCount: 80, grade5: 1, isCareerSubject: true },
    { id: 'h5-7', subject: '윤리와사상', rawScore: 92, average: 70.5, distribution: { A: 22, B: 28, C: 26, D: 15, E: 9 }, studentCount: 200, grade5: 2, isCareerSubject: false },
  ],
  '3-2': [
    { id: 'h6-1', subject: '문학', rawScore: 92, average: 65.0, distribution: { A: 16, B: 26, C: 29, D: 19, E: 10 }, studentCount: 200, grade5: 1, isCareerSubject: false },
    { id: 'h6-2', subject: '확률과통계', rawScore: 97, average: 59.2, distribution: { A: 11, B: 20, C: 33, D: 23, E: 13 }, studentCount: 175, grade5: 1, isCareerSubject: true },
    { id: 'h6-3', subject: '영미문학읽기', rawScore: 96, average: 63.2, distribution: { A: 14, B: 25, C: 32, D: 19, E: 10 }, studentCount: 200, grade5: 1, isCareerSubject: false },
    { id: 'h6-4', subject: '고급물리학', rawScore: 97, average: 57.8, distribution: { A: 12, B: 23, C: 31, D: 22, E: 12 }, studentCount: 65, grade5: 1, isCareerSubject: true },
    { id: 'h6-5', subject: '미적분Ⅱ', rawScore: 98, average: 53.5, distribution: { A: 8, B: 17, C: 35, D: 25, E: 15 }, studentCount: 150, grade5: 1, isCareerSubject: true },
    { id: 'h6-6', subject: '프로그래밍', rawScore: 99, average: 67.5, distribution: { A: 21, B: 26, C: 27, D: 17, E: 9 }, studentCount: 80, grade5: 1, isCareerSubject: true },
    { id: 'h6-7', subject: '경제', rawScore: 91, average: 69.8, distribution: { A: 20, B: 27, C: 28, D: 16, E: 9 }, studentCount: 160, grade5: 2, isCareerSubject: false },
  ]
};
