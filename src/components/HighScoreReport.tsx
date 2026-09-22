import React from 'react';
import { HighSchoolPrediction, StudentProfile } from '../types';
import { SchoolSubjectDiagnosisChart } from './SchoolSubjectDiagnosisChart';
import {
  GraduationCap,
  TrendingUp,
  Target,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  BookMarked,
  Layers,
  BarChart3,
  Award,
  Calculator,
  Scale,
  Info
} from 'lucide-react';

interface HighScoreReportProps {
  prediction: HighSchoolPrediction;
  profile: StudentProfile;
}

export const HighScoreReport: React.FC<HighScoreReportProps> = ({
  prediction,
  profile
}) => {
  const { grade5Stats, grade9Stats, universityAdmissions } = prediction;

  return (
    <div className="space-y-8">
      {/* 1. 5등급제 산출 및 9등급제 예측 핵심 요약 카드 */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 avoid-break">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
            1
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              내신 등급 산출 및 9등급제 정밀 환산 예측치
            </h3>
            <p className="text-xs text-slate-500">
              고교학점제 5등급제 입력 성적 산출 및 Z-score·성취도분포·원점수 기반 9등급제 예측
            </p>
          </div>
        </div>

        {/* 4분할 지표 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* 5등급제: 전 과목 평균 */}
          <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100">
            <span className="text-[11px] font-bold text-indigo-700 block mb-1">
              5등급제 · 전 과목 평균 등급
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-indigo-900">
                {grade5Stats.allSubjectsAverage}
              </span>
              <span className="text-xs font-bold text-indigo-600">등급</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">
              총 {grade5Stats.totalSubjectsCount}개 과목 이수
            </span>
          </div>

          {/* 5등급제: 전공 진로 과목 평균 */}
          <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100">
            <span className="text-[11px] font-bold text-indigo-700 block mb-1">
              5등급제 · 전공 진로 과목 평균
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-indigo-900">
                {grade5Stats.careerSubjectsAverage}
              </span>
              <span className="text-xs font-bold text-indigo-600">등급</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">
              진로 연계 {grade5Stats.careerSubjectsCount}개 과목 반영
            </span>
          </div>

          {/* 9등급제: 전 과목 예측 평균 */}
          <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-100">
            <span className="text-[11px] font-bold text-purple-700 block mb-1">
              9등급제 · 전 과목 예측 평균
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-purple-900">
                {grade9Stats.allSubjectsPredictedAverage}
              </span>
              <span className="text-xs font-bold text-purple-600">등급</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">
              원점수·평균·A%·수강자수 모델링
            </span>
          </div>

          {/* 9등급제: 전공 진로 분야 예측 등급 */}
          <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-100">
            <span className="text-[11px] font-bold text-purple-700 block mb-1">
              9등급제 · 전공 진로 분야 예측
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-purple-900">
                {grade9Stats.careerSubjectsPredictedAverage}
              </span>
              <span className="text-xs font-bold text-purple-600">등급</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">
              희망 진로: {profile.careerGoal}
            </span>
          </div>
        </div>

        {/* 9등급제 산출 원리 설명 */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
          <p className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            9등급제 정밀 예측 산출 원리 및 환산 타당성 검증
          </p>
          <p>
            2028 개정 교육과정 고교 5등급제(1등급: 상위 10%, 2등급: 10~34%) 체제에서 입력된 과목별 <strong>원점수, 과목평균, 성취도 A·B·C·D·E 비율, 수강자수</strong>를 바탕으로 표준편차 역산 및 정규분포 상위 누적 확률(Upper-tail)과 구간 히스토그램을 결합하여 학생의 실제 전교 석차와 누적 백분위(%)를 도출합니다. 이를 대학별 수시 학생부교과전형(9등급 체제) 기준(1등급 4%, 2등급 11%, 3등급 23% 등)에 정밀 맵핑하여 환산 오차를 최소화했습니다.
          </p>
        </div>
      </div>

      {/* 2. 5등급제 ↔ 9등급제 정밀 환산 산출 근거 및 매핑 기준 */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 avoid-break">
        <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
              2
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">
                5등급제 ↔ 9등급제 정밀 환산 산출 근거 및 매핑 기준
              </h4>
              <p className="text-xs text-slate-500">
                원점수, 과목평균, A등급 비율, 수강자수를 기반으로 계산된 누적 백분위 구간 정합성 가이드
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-500 hidden sm:inline-block">
            총 {grade9Stats.subjectPredictions.length}개 과목 환산 적용
          </span>
        </div>

        {/* 5등급제 vs 9등급제 비율 비교 벤치마크 가이드 */}
        <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-2">
            <Scale className="w-4 h-4 text-indigo-600" />
            5등급제 vs 9등급제 누적 백분위 맵핑 기준 (환산 정밀도 검증 가이드)
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 text-[11px]">
            <div className="p-2.5 bg-white rounded-lg border border-slate-200">
              <span className="font-bold text-indigo-700 block">5등급제 1등급 (0~10%)</span>
              <span className="text-slate-600 block mt-0.5">↳ 9등급 1등급 (0~4%)</span>
              <span className="text-slate-600 block">↳ 9등급 2등급 (4~10%)</span>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-slate-200">
              <span className="font-bold text-indigo-700 block">5등급제 2등급 (10~34%)</span>
              <span className="text-slate-600 block mt-0.5">↳ 9등급 2등급 (10~11%)</span>
              <span className="text-slate-600 block">↳ 9등급 3등급 (11~23%)</span>
              <span className="text-slate-600 block">↳ 9등급 4등급 (23~34%)</span>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-slate-200">
              <span className="font-bold text-indigo-700 block">5등급제 3등급 (34~66%)</span>
              <span className="text-slate-600 block mt-0.5">↳ 9등급 4등급 (34~40%)</span>
              <span className="text-slate-600 block">↳ 9등급 5등급 (40~60%)</span>
              <span className="text-slate-600 block">↳ 9등급 6등급 (60~66%)</span>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-slate-200">
              <span className="font-bold text-indigo-700 block">5등급제 4등급 (66~90%)</span>
              <span className="text-slate-600 block mt-0.5">↳ 9등급 6등급 (66~77%)</span>
              <span className="text-slate-600 block">↳ 9등급 7등급 (77~89%)</span>
              <span className="text-slate-600 block">↳ 9등급 8등급 (89~90%)</span>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-slate-200">
              <span className="font-bold text-indigo-700 block">5등급제 5등급 (90~100%)</span>
              <span className="text-slate-600 block mt-0.5">↳ 9등급 8등급 (90~96%)</span>
              <span className="text-slate-600 block">↳ 9등급 9등급 (96~100%)</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            * 5등급제 1등급(상위 10%)이라도 원점수가 만점에 가깝고 A% 비율이 낮아 상위 4% 이내에 위치하면 <strong>9등급제 1등급</strong>으로 판정되며, A%가 30%를 넘거나 원점수가 컷 근처일 경우 <strong>9등급제 2등급</strong>으로 분별됩니다.
          </p>
        </div>
      </div>

      {/* 3. 진학 희망 대학교/학과 수시 학생부교과전형 2개년 입결 및 합격률 분석 */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 pb-1">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
            3
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              진학 희망 대학교·학과 수시 학생부교과전형 합격률 및 맞춤 교과 진단
            </h3>
            <p className="text-xs text-slate-500">
              대학별 2개년(2024~2025학년도) 수시 교과 합격선(70% Cut) 대비 학생 내신의 합격률 및 목표 대학 맞춤 교과군 정밀 진단
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {universityAdmissions.map((item, idx) => (
            <div
              key={item.target.id || idx}
              className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 avoid-break"
            >
              {/* 상단 대학/학과 카드 헤더 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-800 text-xs font-black">
                    지망 {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-indigo-600" />
                      {item.target.university || `목표 대학교 ${idx + 1}`} · {item.target.department || '목표 학과'}
                    </h4>
                    <p className="text-xs text-slate-500">
                      수시 학생부교과전형 (지역인재 / 일반교과)
                    </p>
                  </div>
                </div>

                {/* 판정 뱃지 */}
                <div className="flex items-center gap-2">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-black text-white shadow-2xs"
                    style={{ backgroundColor: item.verdictColor }}
                  >
                    합격 예측: {item.verdict} ({item.passProbability}%)
                  </span>
                </div>
              </div>

              {/* 3열 등급 컷 비교 박스 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <span className="text-[11px] text-slate-500 font-semibold block mb-0.5">
                    대학 2개년 평균 합격선 (70% 컷)
                  </span>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-2xl font-black text-slate-800">
                      {item.cutAvg}
                    </span>
                    <span className="text-xs text-slate-500">등급</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    2024년({item.cut2024}) · 2025년({item.cut2025})
                  </span>
                </div>

                <div className="p-3.5 bg-purple-50 rounded-xl border border-purple-100 text-center">
                  <span className="text-[11px] text-purple-700 font-semibold block mb-0.5">
                    학생 9등급제 예측 내신
                  </span>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-2xl font-black text-purple-900">
                      {item.studentPredictedGrade}
                    </span>
                    <span className="text-xs text-purple-700 font-bold">등급</span>
                  </div>
                  <span className="text-[10px] text-purple-500 mt-1 block">
                    전과목 정밀 환산치
                  </span>
                </div>

                <div
                  className={`p-3.5 rounded-xl border text-center ${
                    item.gradeDifference >= 0
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  <span className="text-[11px] font-semibold block mb-0.5 opacity-80">
                    합격선 대비 격차
                  </span>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-2xl font-black">
                      {item.gradeDifference > 0
                        ? `+${item.gradeDifference}`
                        : item.gradeDifference}
                    </span>
                    <span className="text-xs font-bold">등급</span>
                  </div>
                  <span className="text-[10px] mt-1 block opacity-80">
                    {item.gradeDifference >= 0 ? '합격선 상회 (유리)' : '합격선 미달 (보완필요)'}
                  </span>
                </div>
              </div>

              {/* 합격 확률 게이지 */}
              <div className="mb-5">
                <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                  <span className="text-slate-700">학생부교과 환산 합격 안정성 지수</span>
                  <span className="font-bold text-slate-900">{item.passProbability}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${item.passProbability}%`,
                      backgroundColor: item.verdictColor
                    }}
                  />
                </div>
              </div>

              {/* 지망 대학교/학과별 맞춤 교과 계열별(국·수·영·사·과) 예측 등급 그래프 & 4단계(강점, 경쟁, 보완, 취약) 판정 진단 */}
              <SchoolSubjectDiagnosisChart
                families={item.subjectFamilies}
                schoolLevel="high"
                schoolName={`${item.target.university || '목표 대학교'} ${item.target.department || '학과'}`}
              />

              {/* 수능최저 안내 및 코멘트 */}
              <div className="mt-5 space-y-2.5 text-xs text-slate-700 bg-slate-50/70 p-4 rounded-xl border border-slate-200">
                <div className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 mr-2">
                      수능 최저학력기준 점검:
                    </span>
                    <span className="text-indigo-800 font-semibold bg-indigo-50 px-2 py-0.5 rounded">
                      {item.target.minSatRequirement || '대학 모집요강 기준 지정 수능최저 반영'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2 pt-2 border-t border-slate-200/60">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block mb-0.5">
                      입시 분석 코멘트
                    </span>
                    <p className="leading-relaxed text-slate-600">
                      {item.analysisComment}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 pt-2 border-t border-slate-200/60">
                  <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block mb-0.5">
                      수시 6장 지원 전략 제언
                    </span>
                    <p className="leading-relaxed text-slate-600">
                      {item.strategicAdvice}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
