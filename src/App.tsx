import React, { useState, useEffect } from 'react';
import {
  SchoolLevel,
  StudentProfile,
  Semester,
  GradeEntry,
  MiddleSchoolPrediction,
  HighSchoolPrediction
} from './types';
import {
  createEmptyMiddleGrades,
  createEmptyHighGrades
} from './data/universityData';
import {
  calculateMiddleSchoolPrediction,
  calculateHighSchoolPrediction
} from './utils/gradeCalculation';
import { Header } from './components/Header';
import { StudentInfoForm } from './components/StudentInfoForm';
import { GradeInputTable } from './components/GradeInputTable';
import { ReportContainer } from './components/ReportContainer';
import {
  Calculator,
  Sparkles,
  ArrowRight,
  BookOpen,
  Award,
  BarChart2,
  FileCheck2,
  HelpCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

const INITIAL_PROFILE: StudentProfile = {
  schoolLevel: 'middle',
  grade: 3,
  careerGoal: '',
  middleTargetHighSchools: [
    { id: 'th-1', name: '', type: '일반고', region: '일반 평준화 지역', competitiveLevel: '중' },
    { id: 'th-2', name: '', type: '일반고', region: '일반 평준화 지역', competitiveLevel: '중' },
    { id: 'th-3', name: '', type: '일반고', region: '일반 평준화 지역', competitiveLevel: '중' }
  ],
  currentHighSchool: {
    name: '',
    type: '일반고',
    region: '일반 평준화 지역',
    competitiveLevel: '중'
  },
  highTargetUniversities: [
    { id: 'u-1', university: '', department: '', admissionType: '학생부교과전형', cut2024: '', cut2025: '', minSatRequirement: '' },
    { id: 'u-2', university: '', department: '', admissionType: '학생부교과전형', cut2024: '', cut2025: '', minSatRequirement: '' },
    { id: 'u-3', university: '', department: '', admissionType: '학생부교과전형', cut2024: '', cut2025: '', minSatRequirement: '' }
  ]
};

export default function App() {
  const [profile, setProfile] = useState<StudentProfile>(INITIAL_PROFILE);
  const [grades, setGrades] = useState<Record<Semester, GradeEntry[]>>(createEmptyMiddleGrades());
  const [currentView, setCurrentView] = useState<'input' | 'report'>('input');
  const [middlePrediction, setMiddlePrediction] = useState<MiddleSchoolPrediction | null>(null);
  const [highPrediction, setHighPrediction] = useState<HighSchoolPrediction | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // 워드프레스 등 외부 iframe 삽입 시 스크롤 없이 부모창 높이를 자동 조절하기 위한 postMessage 전송
  const notifyHeight = () => {
    try {
      if (typeof window !== 'undefined' && window.parent && window.parent !== window) {
        const rootEl = document.getElementById('root');
        const body = document.body;
        const doc = document.documentElement;

        const measuredHeight = Math.max(
          body ? body.scrollHeight : 0,
          body ? body.offsetHeight : 0,
          doc ? doc.scrollHeight : 0,
          doc ? doc.offsetHeight : 0,
          rootEl ? rootEl.scrollHeight : 0,
          rootEl ? rootEl.offsetHeight : 0
        );

        if (measuredHeight > 100) {
          // 하단 그림자 및 푸터 잘림 방지를 위해 120px 여유 버퍼 추가
          const totalHeight = measuredHeight + 120;
          window.parent.postMessage(
            {
              type: 'SAENGDI_FRAME_RESIZE',
              height: totalHeight,
              view: currentView
            },
            '*'
          );
        }
      }
    } catch {
      // cross-origin safe ignore
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    notifyHeight();
    const t0 = setTimeout(notifyHeight, 60);
    const t1 = setTimeout(notifyHeight, 180);
    const t2 = setTimeout(notifyHeight, 500);
    const t3 = setTimeout(notifyHeight, 1200);
    const interval = setInterval(notifyHeight, 1000);

    const observer = new ResizeObserver(() => {
      notifyHeight();
    });
    if (document.body) {
      observer.observe(document.body);
    }
    const rootEl = document.getElementById('root');
    if (rootEl) {
      observer.observe(rootEl);
    }

    window.addEventListener('resize', notifyHeight);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearInterval(interval);
      observer.disconnect();
      window.removeEventListener('resize', notifyHeight);
    };
  }, [currentView, profile, grades]);

  // 학교급(중학생/고등학생) 변경 시 성적 입력표 형식 동기화
  const handleProfileChange = (newProfile: StudentProfile) => {
    if (newProfile.schoolLevel !== profile.schoolLevel) {
      if (newProfile.schoolLevel === 'middle') {
        setGrades(createEmptyMiddleGrades());
      } else {
        setGrades(createEmptyHighGrades());
      }
      setMiddlePrediction(null);
      setHighPrediction(null);
    }
    setProfile(newProfile);
    setValidationError(null);
  };

  // '내신 등급 예측' 실행
  const handleRunPrediction = () => {
    // 입력된 과목이 1개라도 있는지 유효성 검사
    const enteredSubjects = Object.values(grades)
      .flat()
      .filter((g) => g.rawScore !== '' && g.rawScore !== null && !isNaN(Number(g.rawScore)));

    if (enteredSubjects.length === 0) {
      setValidationError('성적 정보를 최소 1개 과목 이상 입력해 주세요. 학생이 보유한 성적만으로 정밀 예측이 진행됩니다.');
      return;
    }

    setValidationError(null);
    setIsAnalyzing(true);

    setTimeout(() => {
      if (profile.schoolLevel === 'middle') {
        const result = calculateMiddleSchoolPrediction(profile, grades);
        setMiddlePrediction(result);
        setHighPrediction(null);
      } else {
        const result = calculateHighSchoolPrediction(profile, grades);
        setHighPrediction(result);
        setMiddlePrediction(null);
      }
      setIsAnalyzing(false);
      setCurrentView('report');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 500);
  };

  // 입력된 유효 과목 수 카운트
  const validSubjectsCount = Object.values(grades)
    .flat()
    .filter((g) => g.rawScore !== '' && g.rawScore !== null && !isNaN(Number(g.rawScore))).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {/* 글로벌 상단 헤더 */}
      <Header
        onLoadPreset={() => {}}
        activeLevel={profile.schoolLevel}
        hasReport={!!(middlePrediction || highPrediction)}
        onViewReport={() => setCurrentView('report')}
      />

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        {currentView === 'report' ? (
          <ReportContainer
            profile={profile}
            middlePrediction={middlePrediction || undefined}
            highPrediction={highPrediction || undefined}
            onBackToInput={() => setCurrentView('input')}
          />
        ) : (
          <div className="space-y-8">
            {/* 상단 인트로 히어로 배너 */}
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-9 text-white shadow-xl relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold backdrop-blur-sm border border-white/10 mb-4">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  생디 학생부관리 입시컨설팅 AI 플랫폼
                </div>
                
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
                  내신 등급 정밀 예측 프로그램
                </h1>
                
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light mb-6">
                  학생이 현재 보유하고 있는 원점수, 평균, 성취도별 분포비율(A~E) 데이터를 바탕으로
                  시험 출제 난이도(A% 거품도)를 분석하고, 목표 고교 및 대학교 합격 가능성을 정밀 예측합니다.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">중학생 분석</span>
                    <span className="font-bold text-white">5등급제·9등급제 예측</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">비평준화 고교</span>
                    <span className="font-bold text-white">학력군 수준별 보정</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">지필 난이도 진단</span>
                    <span className="font-bold text-white">A% 내신 거품도 판정</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">고등학생 분석</span>
                    <span className="font-bold text-white">수시 교과 70% 컷 비교</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 1단계: 학생 기본 정보 입력 (중학생/고등학생, 희망 진로, 3개 목표 학교 직접 입력) */}
            <StudentInfoForm
              profile={profile}
              onChange={handleProfileChange}
            />

            {/* 2단계: 현재 성적 정보 입력표 (비어있는 초기 상태, 중학생은 5과목 국수영사과) */}
            <GradeInputTable
              schoolLevel={profile.schoolLevel}
              grades={grades}
              onChange={setGrades}
            />

            {/* 유효성 경고 알림 */}
            {validationError && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800 text-sm animate-shake">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span className="font-semibold">{validationError}</span>
              </div>
            )}

            {/* 3단계: 내신 등급 예측 실행 버튼 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200 text-center space-y-4">
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  입력된 성적 정보로 등급 예측을 진행하시겠습니까?
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  현재 입력된 성적 과목: <strong className="text-indigo-600 font-bold">{validSubjectsCount}개</strong>
                  {validSubjectsCount === 0 && ' (성적 정보를 1개 이상 입력해주세요)'}
                </p>
                
                <button
                  type="button"
                  onClick={handleRunPrediction}
                  disabled={isAnalyzing}
                  className="w-full sm:w-auto min-w-[260px] py-4 px-8 rounded-xl font-bold text-base bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all flex items-center justify-center gap-2.5 mx-auto cursor-pointer disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>생디 AI 정밀 분석 중...</span>
                    </>
                  ) : (
                    <>
                      <Calculator className="w-5 h-5" />
                      <span>내신 등급 예측 리포트 확인하기</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 하단 푸터 */}
      <footer className="no-print mt-12 bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span>© 2026 생디 (SaengDi) 학생부관리 입시컨설팅 AI 플랫폼.</span>
            <span className="text-slate-300">|</span>
            <span>공식 웹사이트:</span>
            <a
              href="https://www.sangdi.net"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 font-bold underline"
            >
              www.sangdi.net
            </a>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>2028 대입 개편 5등급제 완벽 호환</span>
            <span>·</span>
            <span>중등 성취도 A% 거품 분석 모델 탑재</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
