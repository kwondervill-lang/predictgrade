export type SchoolLevel = 'middle' | 'high';

export type HighSchoolType = 
  | '일반고' 
  | '자율형사립고(전국)' 
  | '자율형사립고(광역)' 
  | '특수목적고(과학고)' 
  | '특수목적고(외고/국제고)' 
  | '특성화고/마이스터고';

export type HighSchoolRegion =
  | '서울 강남·서초'
  | '서울 양천·목동'
  | '서울 노원·중계'
  | '경기 분당·수지'
  | '경기 일산'
  | '대구 수성·부산 해운대 등 교육특구'
  | '일반 평준화 지역'
  | '비평준화 우수고 지역';

export type NonStandardSchoolTier = '우수선발고(상위권 집중)' | '일반중위고(보통 수준)' | '하위권고(기초학력 중심)';

export interface TargetHighSchool {
  id: string;
  name: string;
  type: HighSchoolType;
  region: HighSchoolRegion;
  competitiveLevel: '최상' | '상' | '중' | '보통';
  nonStandardTier?: NonStandardSchoolTier; // 비평준화 우수고 지역 선택 시 학업 수준
}

export interface TargetUniversity {
  id: string;
  university: string;
  department: string;
  admissionType: string;
  cut2024: number | ''; // 2024학년도 70% Cut
  cut2025: number | ''; // 2025학년도 70% Cut
  minSatRequirement?: string; // 수능최저학력기준
}

export interface AchievementDistribution {
  A: number | '';
  B: number | '';
  C: number | '';
  D: number | '';
  E: number | '';
}

export interface GradeEntry {
  id: string;
  subject: string;
  rawScore: number | ''; // 원점수 (0~100)
  average: number | ''; // 과목 평균 (0~100)
  distribution: AchievementDistribution; // 성취도별 분포비율 (%)
  studentCount: number | ''; // 수강자수
  grade5?: number | ''; // 고등학생용 5등급제 등급 (1~5)
  isCareerSubject?: boolean; // 진로/전공 연계 과목 여부
}

export type Semester = '1-1' | '1-2' | '2-1' | '2-2' | '3-1' | '3-2';

export interface StudentProfile {
  schoolLevel: SchoolLevel;
  grade: number; // 1, 2, 3
  careerGoal: string; // 희망 진로 1개
  middleTargetHighSchools: TargetHighSchool[]; // 중학생용 3개
  currentHighSchool: {
    name: string;
    type: HighSchoolType;
    region: HighSchoolRegion;
    competitiveLevel: '최상' | '상' | '중' | '보통';
    nonStandardTier?: NonStandardSchoolTier;
  };
  highTargetUniversities: TargetUniversity[]; // 고등학생용 3개
}

// 중학생 리포트 분석 결과
export interface MiddleSchoolPrediction {
  // 성취도 A% 분포 기반 시험 난이도 및 내신 거품도 분석
  examDifficultyAnalysis: {
    avgAchievementA: number; // 입력된 과목들의 평균 A등급 비율(%)
    difficultyLevel: '매우 쉬움 (물내신·성적 거품 우려)' | '적정 난이도 (표준 변별력)' | '어려움 (높은 변별력·실질 우수)';
    description: string;
    inflationCaution: string;
  };
  // 관내 중학교 학생 진로 배분 예측 (일반고, 특목/자사고, 특성화고 비율)
  cohortDistribution: {
    generalHigh: number; // 일반고 진학률 (%)
    specializedHigh: number; // 특목고/자사고 진학률 (%)
    vocational: number; // 실업계/특성화고 진학률 (%)
    explanation: string;
  };
  // 3개 목표 고등학교별 상세 예측
  targetSchoolPredictions: {
    school: TargetHighSchool;
    predictedPercentile: number; // 예상 전교 상위 누적 백분위 (%)
    predictedRankRange: string; // 예상 석차 범위 (예: 12~24등 / 240명)
    predictedGrade5Average: number; // 5등급제 예상 평균 등급
    predictedGrade9Average: number; // 9등급제 예상 평균 등급
    subjectFamilies: SubjectFamilyAnalysis[]; // 지망 고교별 5개 교과 계열별 예측 진단
    subjectPredictions?: {
      subject: string;
      grade5: number;
      grade9: number;
      rawScoreEst: number;
      status: '안정' | '경쟁' | '보완필요';
    }[];
    reasons: {
      schoolTypeFactor: string; // 고교 계열 특징 (일반고 vs 자사/특목)
      regionalFactor: string; // 지역 및 학군 특징 (비평준화 우수고 여부 등)
      gradeCompetitionFactor: string; // 내신 성적 분포 및 경쟁 치열도 (A% 반영)
      strategySummary: string; // 맞춤 학습 및 입학 대비 전략
    };
  }[];
  // 5개 교과 계열별 (국·수·영·사·과) 내신 종합 분석
  subjectFamilies: SubjectFamilyAnalysis[];
}

// 5개 교과 계열 정의
export type SubjectFamilyType = '국어 계열' | '수학 계열' | '영어 계열' | '사회 계열' | '과학 계열';

export type SubjectStatusTier = '강점' | '경쟁' | '보완' | '취약';
export type SubjectStatusType = 'strength' | 'compete' | 'improve' | 'weak';

export interface SubjectFamilyAnalysis {
  family: SubjectFamilyType;
  subjects: string[];
  avgRawScore: number;
  grade5: number;
  grade9: number;
  status: SubjectStatusTier;
  statusType: SubjectStatusType;
  strengthsOrWeaknesses: string;
  advice: string;
}

// 고등학생 리포트 분석 결과
export interface HighSchoolPrediction {
  // 5개 교과 계열별 (국·수·영·사·과) 내신 종합 분석
  subjectFamilies: SubjectFamilyAnalysis[];
  // 5등급제 산출
  grade5Stats: {
    allSubjectsAverage: number; // 전 과목 평균 등급
    careerSubjectsAverage: number; // 전공 진로 분야 과목 평균 등급
    totalSubjectsCount: number;
    careerSubjectsCount: number;
  };
  // 9등급제 예측
  grade9Stats: {
    subjectPredictions: {
      subject: string;
      semester: Semester;
      rawScore: number;
      average: number;
      distA: number;
      studentCount: number;
      grade5: number;
      predictedGrade9: number;
      zScore: number;
      estimatedPercentile: number; // 상위 누적 백분위 (0~100%)
      estimatedRank: number; // 전교 추정 석차
      isCareer: boolean;
    }[];
    allSubjectsPredictedAverage: number; // 전 과목 9등급 예측 평균
    careerSubjectsPredictedAverage: number; // 전공 진로 9등급 예측 평균
  };
  // 3개 목표 대학/학과 수시 학생부교과전형 합격률
  universityAdmissions: {
    target: TargetUniversity;
    studentPredictedGrade: number; // 학생 예측 등급 (9등급 환산)
    cut2024: number;
    cut2025: number;
    cutAvg: number;
    gradeDifference: number; // 컷 대비 우위/열위 (+면 우수, -면 불리)
    passProbability: number; // 합격률 (0 ~ 100%)
    verdict: '안정' | '적정' | '소신' | '불안' | '위험';
    verdictColor: string;
    subjectFamilies: SubjectFamilyAnalysis[]; // 지망 대학·학과별 5개 교과 계열별 예측 진단
    analysisComment: string; // 수시 교과전형 입결 심층 분석
    strategicAdvice: string; // 수능최저, 학생부종합 병행 여부 등 전략 조언
  }[];
}
