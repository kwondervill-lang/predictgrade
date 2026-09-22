import React from 'react';
import { MiddleSchoolPrediction, StudentProfile } from '../types';
import { SchoolSubjectDiagnosisChart } from './SchoolSubjectDiagnosisChart';
import {
  School,
  TrendingUp,
  PieChart,
  ShieldCheck,
  Compass,
  AlertTriangle,
  Award,
  Layers,
  MapPin,
  ChevronRight,
  Flame,
  Droplets,
  Scale
} from 'lucide-react';

interface MiddleSchoolReportProps {
  prediction: MiddleSchoolPrediction;
  profile: StudentProfile;
}

export const MiddleSchoolReport: React.FC<MiddleSchoolReportProps> = ({
  prediction,
  profile
}) => {
  const { examDifficultyAnalysis, cohortDistribution, targetSchoolPredictions } = prediction;

  const isEasyExam = examDifficultyAnalysis.difficultyLevel.includes('쉬움');
  const isHardExam = examDifficultyAnalysis.difficultyLevel.includes('어려움');

  return (
    <div className="space-y-8">
      {/* [핵심 요약] 중학생 내신 5등급제 및 9등급제 예측 등급 종합 비교 */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl avoid-break">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-indigo-800/60 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold mb-2">
              <Scale className="w-3.5 h-3.5" />
              <span>5등급제 & 9등급제 듀얼 예측 시스템</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              중학생 내신 성적 종합: 5등급제 및 9등급제 예측 등급
            </h3>
            <p className="text-xs sm:text-sm text-indigo-200/80 mt-1">
              2028 개정 교육과정 5등급제(1등급 10%)와 대입 상대평가 9등급제(1등급 4%) 기준을 모두 산출하여 제공합니다.
            </p>
          </div>
        </div>

        {/* 3개 지망 고교별 5등급제 vs 9등급제 예상 등급 비교 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {targetSchoolPredictions.map((pred, idx) => (
            <div
              key={pred.school.id || idx}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-md bg-indigo-400/20 text-indigo-200 text-[11px] font-black border border-indigo-300/30">
                    지망 {idx + 1}
                  </span>
                  <span className="text-[11px] text-slate-300 font-medium truncate">
                    {pred.school.type}
                  </span>
                </div>
                <h4 className="text-base font-extrabold text-white truncate mb-1">
                  {pred.school.name || `지망 고교 ${idx + 1}`}
                </h4>
                <p className="text-[11px] text-indigo-200/70 mb-3 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {pred.school.region}
                </p>

                {/* 5등급제 & 9등급제 나란히 비교 */}
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-950/40 border border-white/10 mb-3">
                  <div className="text-center p-1.5 rounded-lg bg-indigo-600/30 border border-indigo-400/30">
                    <span className="text-[10px] font-bold text-indigo-200 block">
                      5등급제 예상
                    </span>
                    <span className="text-lg font-black text-white">
                      {pred.predictedGrade5Average}
                      <span className="text-xs font-semibold text-indigo-300 ml-0.5">등급</span>
                    </span>
                  </div>

                  <div className="text-center p-1.5 rounded-lg bg-purple-600/30 border border-purple-400/30">
                    <span className="text-[10px] font-bold text-purple-200 block">
                      9등급제 예측
                    </span>
                    <span className="text-lg font-black text-white">
                      {pred.predictedGrade9Average}
                      <span className="text-xs font-semibold text-purple-300 ml-0.5">등급</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-indigo-200">
                <span>예상 위치:</span>
                <span className="font-extrabold text-white">
                  상위 {pred.predictedPercentile}% ({pred.predictedRankRange.split('(')[0].trim()})
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 5등급제 vs 9등급제 등급 분포 비율 가이드 */}
        <div className="mt-5 pt-4 border-t border-indigo-800/40 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-indigo-200/90">
          <div className="p-3 rounded-xl bg-slate-950/30 border border-white/5">
            <span className="font-bold text-white block mb-1">
              📌 2028 개정 고교 5등급제 체제
            </span>
            <p className="text-[11px] leading-relaxed text-indigo-200/80">
              1등급(상위 10%) · 2등급(누적 34%) · 3등급(누적 66%) · 4등급(누적 90%) · 5등급(누적 100%)
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/30 border border-white/5">
            <span className="font-bold text-white block mb-1">
              📌 대입 상대평가 9등급제 체제
            </span>
            <p className="text-[11px] leading-relaxed text-indigo-200/80">
              1등급(상위 4%) · 2등급(누적 11%) · 3등급(누적 23%) · 4등급(누적 40%) · 5등급(누적 60%)
            </p>
          </div>
        </div>
      </div>

      {/* 1. 성취도 A% 분포 기반 시험 난이도 및 내신 거품도 분석 리포트 */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 avoid-break">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
            1
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              중학교 시험 출제 난이도 및 ‘성적 거품도’ 정밀 진단
            </h3>
            <p className="text-xs text-slate-500">
              성취도 A(90점 이상) 비율 분포를 기반으로 산출한 중학교 지필평가의 실질 변별력 분석
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          {/* 평균 A등급 비율 수치 */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-center items-center text-center">
            <span className="text-xs font-semibold text-slate-500 mb-1">
              입력 교과목 평균 A등급(90점↑) 비율
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-indigo-700">
                {examDifficultyAnalysis.avgAchievementA}
              </span>
              <span className="text-sm font-bold text-indigo-500">%</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1">
              (표준 권장 변별선: 20% ~ 30%)
            </span>
          </div>

          {/* 시험 난이도 판정 */}
          <div className={`p-4 rounded-xl border flex flex-col justify-center items-center text-center ${
            isEasyExam
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : isHardExam
              ? 'bg-blue-50 border-blue-200 text-blue-900'
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}>
            <span className="text-xs font-semibold mb-1 flex items-center gap-1">
              {isEasyExam ? <Droplets className="w-4 h-4 text-amber-600" /> : isHardExam ? <Flame className="w-4 h-4 text-blue-600" /> : <Scale className="w-4 h-4 text-emerald-600" />}
              시험 난이도 판정
            </span>
            <span className="text-base font-black">
              {examDifficultyAnalysis.difficultyLevel}
            </span>
            <span className="text-[11px] opacity-80 mt-1">
              {isEasyExam
                ? '원점수 대비 상대평가 등급 하락 위험군'
                : isHardExam
                ? '실질 학업 역량 및 경쟁력 최상'
                : '표준적인 교육과정 변별력 유지'}
            </span>
          </div>

          {/* 고교 진학 영향 요약 */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-center text-xs space-y-1.5">
            <span className="font-bold text-slate-800 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-indigo-600" />
              고교 상대평가 전환 시 영향
            </span>
            <p className="text-slate-600 leading-snug">
              {isEasyExam
                ? 'A등급자가 과밀하여 고교 진학 시 상대평가(1등급 10%/4%) 체제에서 등급이 1~2등급 밀릴 수 있으므로 선행 심화 보완이 필수적입니다.'
                : isHardExam
                ? '엄격한 지필평가에서 원점수를 확보하여 고교 진학 시에도 최상위 1등급을 안정적으로 방어할 가능성이 높습니다.'
                : '표준 변별력 시험으로 학생의 현재 원점수가 비교적 정확한 학업 성취 수준을 반영하고 있습니다.'}
            </p>
          </div>
        </div>

        {/* 정밀 코멘트 */}
        <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs text-indigo-950 leading-relaxed">
          <p className="font-bold mb-1 flex items-center gap-1.5 text-indigo-900">
            <Compass className="w-4 h-4 text-indigo-600" />
            생디 AI 성취도 분포 심층 분석
          </p>
          <p className="mb-1.5">{examDifficultyAnalysis.description}</p>
          <p className="text-indigo-800 font-medium">{examDifficultyAnalysis.inflationCaution}</p>
        </div>
      </div>

      {/* 2. 고교 진학 인원 및 실업계/특성화고 분산 예측 카드 */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 avoid-break">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
            2
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              중학교 졸업 집단 고교 진학 분포 및 실질 내신 경쟁 밀도 예측
            </h3>
            <p className="text-xs text-slate-500">
              실업계·특성화고 진학에 따른 하위권 분산율과 일반고·자사·특목고 진학 인원 재배치 분석
            </p>
          </div>
        </div>

        {/* 진학 분포 시각화 바 */}
        <div className="mb-5">
          <div className="flex justify-between items-center text-xs font-semibold mb-2">
            <span className="text-slate-700">관내 졸업생 고교 유형별 진학 비율 예측</span>
            <span className="text-slate-500">총계 100%</span>
          </div>

          <div className="w-full h-8 bg-slate-100 rounded-xl overflow-hidden flex shadow-inner">
            <div
              style={{ width: `${cohortDistribution.generalHigh}%` }}
              className="bg-indigo-600 flex items-center justify-center text-white text-xs font-bold transition-all"
              title={`일반고: ${cohortDistribution.generalHigh}%`}
            >
              일반고 {cohortDistribution.generalHigh}%
            </div>
            <div
              style={{ width: `${cohortDistribution.specializedHigh}%` }}
              className="bg-purple-600 flex items-center justify-center text-white text-xs font-bold transition-all"
              title={`자사·특목고: ${cohortDistribution.specializedHigh}%`}
            >
              자사·특목 {cohortDistribution.specializedHigh}%
            </div>
            <div
              style={{ width: `${cohortDistribution.vocational}%` }}
              className="bg-amber-500 flex items-center justify-center text-white text-xs font-bold transition-all"
              title={`특성화고/실업계: ${cohortDistribution.vocational}%`}
            >
              특성화고 {cohortDistribution.vocational}%
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-indigo-600"></span>
              <span className="font-medium text-slate-700">일반고 진학군: <strong>{cohortDistribution.generalHigh}%</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-purple-600"></span>
              <span className="font-medium text-slate-700">자사고·특목고(과고/외고): <strong>{cohortDistribution.specializedHigh}%</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span className="font-medium text-slate-700">실업계·특성화고 진학군: <strong>{cohortDistribution.vocational}%</strong></span>
            </div>
          </div>
        </div>

        {/* 설명 박스 */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
          <p className="font-bold text-indigo-900 mb-1 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-indigo-600" />
            생디 AI 진학 밀도 분석 코멘트
          </p>
          <p>{cohortDistribution.explanation}</p>
        </div>
      </div>

      {/* 3. 진학 희망 3개 고등학교별 5등급제 vs 9등급제 예측 리포트 */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 pb-1">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
            3
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              진학 희망 고등학교(3개교) 입학 후 내신 성적 정밀 예측 및 교과 진단
            </h3>
            <p className="text-xs text-slate-500">
              학교 계열(특목/자사/일반), 지역 학군 특징, 비평준화 학력군 수준, A% 시험 난이도 거품도를 통합 반영한 5등급제 및 9등급제 예측
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {targetSchoolPredictions.map((pred, idx) => (
            <div
              key={pred.school.id || idx}
              className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 avoid-break"
            >
              {/* 상단 학교 헤더 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-800 text-xs font-black">
                    지망 {idx + 1}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-base font-extrabold text-slate-900">
                        {pred.school.name || `목표 고등학교 ${idx + 1}`}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                        {pred.school.type}
                      </span>
                      {pred.school.region === '비평준화 우수고 지역' && (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          비평준화: {pred.school.nonStandardTier || '우수선발고'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {pred.school.region}
                    </p>
                  </div>
                </div>

                {/* 종합 등급 뱃지 */}
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-50 rounded-xl border border-indigo-100 text-center min-w-[100px]">
                    <span className="text-[10px] font-bold text-indigo-800 block">
                      5등급제 예상 평균
                    </span>
                    <span className="text-lg font-black text-indigo-700">
                      {pred.predictedGrade5Average}
                      <span className="text-xs font-semibold text-indigo-500 ml-0.5">등급</span>
                    </span>
                  </div>

                  <div className="p-2.5 bg-purple-50 rounded-xl border border-purple-100 text-center min-w-[100px]">
                    <span className="text-[10px] font-bold text-purple-800 block">
                      9등급제 예상 평균
                    </span>
                    <span className="text-lg font-black text-purple-700">
                      {pred.predictedGrade9Average}
                      <span className="text-xs font-semibold text-purple-500 ml-0.5">등급</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* 예상 석차 및 백분위 카드 */}
              <div className="mb-4 p-3.5 bg-slate-50 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-indigo-600" />
                  고교 입학 시 예상 위치:
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">
                    예상 상위 백분위: <strong className="text-slate-800">{pred.predictedPercentile}%</strong>
                  </span>
                  <span className="font-extrabold text-indigo-800 bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-2xs">
                    {pred.predictedRankRange}
                  </span>
                </div>
              </div>

              {/* 지망 학교별 맞춤 교과 계열별(국·수·영·사·과) 예측 등급 그래프 & 4단계(강점, 경쟁, 보완, 취약) 판정 진단 */}
              <SchoolSubjectDiagnosisChart
                families={pred.subjectFamilies}
                schoolLevel="middle"
                schoolName={pred.school.name || `목표 고등학교 ${idx + 1}`}
              />

              {/* 왜 이렇게 예측되었는가? 상세 사유 4단 분석 */}
              <div className="mt-5 space-y-2.5 text-xs text-slate-700">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="font-bold text-slate-900 block mb-1">
                    ① 고교 계열의 특징 ({pred.school.type})
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    {pred.reasons.schoolTypeFactor}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="font-bold text-slate-900 block mb-1">
                    ② 지역 및 학군 특징 ({pred.school.region})
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    {pred.reasons.regionalFactor}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="font-bold text-slate-900 block mb-1">
                    ③ 내신 성적 분포 및 경쟁 치열도 (A% 출제 난이도 반영)
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    {pred.reasons.gradeCompetitionFactor}
                  </p>
                </div>

                <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
                  <span className="font-bold text-indigo-900 block mb-1 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                    ④ 생디 입시컨설팅 합격 전략 가이드
                  </span>
                  <p className="text-indigo-950 font-medium leading-relaxed">
                    {pred.reasons.strategySummary}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
