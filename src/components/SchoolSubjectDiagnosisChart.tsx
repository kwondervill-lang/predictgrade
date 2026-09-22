import React from 'react';
import { SubjectFamilyAnalysis, SubjectFamilyType } from '../types';
import { Award, Sparkles, AlertCircle, ShieldAlert, TrendingUp } from 'lucide-react';

interface SchoolSubjectDiagnosisChartProps {
  families: SubjectFamilyAnalysis[];
  schoolLevel: 'middle' | 'high';
  schoolName: string;
}

export const SchoolSubjectDiagnosisChart: React.FC<SchoolSubjectDiagnosisChartProps> = ({
  families,
  schoolLevel,
  schoolName
}) => {
  const familyConfig: Record<
    SubjectFamilyType,
    { label: string; shortName: string; color: string; barBg: string }
  > = {
    '국어 계열': { label: '국어 계열', shortName: '국어', color: '#4f46e5', barBg: 'bg-indigo-600' },
    '수학 계열': { label: '수학 계열', shortName: '수학', color: '#0891b2', barBg: 'bg-cyan-600' },
    '영어 계열': { label: '영어 계열', shortName: '영어', color: '#2563eb', barBg: 'bg-blue-600' },
    '사회 계열': { label: '사회 계열', shortName: '사회', color: '#d97706', barBg: 'bg-amber-600' },
    '과학 계열': { label: '과학 계열', shortName: '과학', color: '#059669', barBg: 'bg-emerald-600' }
  };

  // 4개 교과군 분류: 강점, 경쟁, 보완, 취약
  const validFamilies = families.filter((f) => f.subjects.length > 0 || f.avgRawScore > 0 || f.grade5 > 0);
  const strengths = validFamilies.filter((f) => f.status === '강점');
  const competes = validFamilies.filter((f) => f.status === '경쟁');
  const improves = validFamilies.filter((f) => f.status === '보완');
  const weaks = validFamilies.filter((f) => f.status === '취약');

  // 5등급제 그래프 높이 (1등급 100%, 5등급 20%)
  const get5GradeHeight = (grade: number) => {
    if (grade <= 0) return 15;
    return Math.max(18, Math.min(100, Math.round(100 - (grade - 1) * 20)));
  };

  // 9등급제 그래프 높이 (1등급 100%, 9등급 12%)
  const get9GradeHeight = (grade: number) => {
    if (grade <= 0) return 15;
    return Math.max(18, Math.min(100, Math.round(100 - (grade - 1) * 11)));
  };

  return (
    <div className="mt-4 pt-4 border-t border-slate-100 space-y-4">
      {/* 서브 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-indigo-600" />
          <h5 className="text-xs sm:text-sm font-extrabold text-slate-900">
            {schoolName} 맞춤 교과 계열별 5등급제 & 9등급제 예측 등급 진단
          </h5>
        </div>
        <span className="text-[11px] text-slate-500 font-medium">
          5등급제(10% 기준) 및 9등급제(4% 기준) 상대평가 동시 산출
        </span>
      </div>

      {/* 4단계 교과군 판정 카드 그리드 (강점, 경쟁, 보완, 취약) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {/* 1. 강점 교과군 */}
        <div className="p-3 rounded-xl bg-emerald-50/90 border border-emerald-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-1 mb-1.5">
              <span className="text-xs font-black text-emerald-900 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-emerald-600" />
                강점 교과군
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-emerald-600 text-white">
                우수
              </span>
            </div>
            {strengths.length > 0 ? (
              <div className="space-y-1.5 mt-1">
                {strengths.map((s, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between text-xs pb-1 border-b border-emerald-100/80 last:border-0 last:pb-0 gap-1">
                    <span className="font-bold text-emerald-950">
                      {familyConfig[s.family]?.shortName || s.family}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] font-extrabold">
                      <span className="px-1.5 py-0.5 rounded bg-indigo-100/90 text-indigo-800 border border-indigo-200">
                        5등급제 {s.grade5}등
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-purple-100/90 text-purple-800 border border-purple-200">
                        9등급제 {s.grade9}등
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-slate-500 mt-1">강점 구간 해당 없음</p>
            )}
          </div>
          <span className="text-[10px] text-emerald-700 mt-2 block font-medium">
            최상위권 입지 방어
          </span>
        </div>

        {/* 2. 경쟁 교과군 */}
        <div className="p-3 rounded-xl bg-blue-50/90 border border-blue-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-1 mb-1.5">
              <span className="text-xs font-black text-blue-900 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                경쟁 교과군
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-blue-600 text-white">
                유지
              </span>
            </div>
            {competes.length > 0 ? (
              <div className="space-y-1.5 mt-1">
                {competes.map((s, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between text-xs pb-1 border-b border-blue-100/80 last:border-0 last:pb-0 gap-1">
                    <span className="font-bold text-blue-950">
                      {familyConfig[s.family]?.shortName || s.family}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] font-extrabold">
                      <span className="px-1.5 py-0.5 rounded bg-indigo-100/90 text-indigo-800 border border-indigo-200">
                        5등급제 {s.grade5}등
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-purple-100/90 text-purple-800 border border-purple-200">
                        9등급제 {s.grade9}등
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-slate-500 mt-1">경쟁 구간 해당 없음</p>
            )}
          </div>
          <span className="text-[10px] text-blue-700 mt-2 block font-medium">
            상위 등급 도약 접전
          </span>
        </div>

        {/* 3. 보완 교과군 */}
        <div className="p-3 rounded-xl bg-amber-50/90 border border-amber-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-1 mb-1.5">
              <span className="text-xs font-black text-amber-900 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                보완 교과군
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-amber-600 text-white">
                경계
              </span>
            </div>
            {improves.length > 0 ? (
              <div className="space-y-1.5 mt-1">
                {improves.map((s, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between text-xs pb-1 border-b border-amber-100/80 last:border-0 last:pb-0 gap-1">
                    <span className="font-bold text-amber-950">
                      {familyConfig[s.family]?.shortName || s.family}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] font-extrabold">
                      <span className="px-1.5 py-0.5 rounded bg-indigo-100/90 text-indigo-800 border border-indigo-200">
                        5등급제 {s.grade5}등
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-purple-100/90 text-purple-800 border border-purple-200">
                        9등급제 {s.grade9}등
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-slate-500 mt-1">보완 구간 해당 없음</p>
            )}
          </div>
          <span className="text-[10px] text-amber-800 mt-2 block font-medium">
            감점 방어 필수
          </span>
        </div>

        {/* 4. 취약 교과군 */}
        <div className="p-3 rounded-xl bg-rose-50/90 border border-rose-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-1 mb-1.5">
              <span className="text-xs font-black text-rose-900 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                취약 교과군
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-rose-600 text-white">
                집중
              </span>
            </div>
            {weaks.length > 0 ? (
              <div className="space-y-1.5 mt-1">
                {weaks.map((s, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between text-xs pb-1 border-b border-rose-100/80 last:border-0 last:pb-0 gap-1">
                    <span className="font-bold text-rose-950">
                      {familyConfig[s.family]?.shortName || s.family}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] font-extrabold">
                      <span className="px-1.5 py-0.5 rounded bg-indigo-100/90 text-indigo-800 border border-indigo-200">
                        5등급제 {s.grade5}등
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-purple-100/90 text-purple-800 border border-purple-200">
                        9등급제 {s.grade9}등
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-emerald-700 mt-1 font-semibold">취약 교과 없음</p>
            )}
          </div>
          <span className="text-[10px] text-rose-700 mt-2 block font-medium">
            최우선 개념 클리닉
          </span>
        </div>
      </div>

      {/* 5개 교과 계열별 예측 등급 막대 그래프 */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-200">
          <span className="text-[11px] font-bold text-slate-700">
            5대 계열별 {schoolName} 진학 시 5등급제 vs 9등급제 예측 등급
          </span>
          <div className="flex items-center gap-3 text-[10px]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-indigo-600 inline-block" />
              <span className="font-bold text-indigo-900">5등급제 예측 등급</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-purple-600 inline-block" />
              <span className="font-bold text-purple-900">9등급제 환산 예측 등급</span>
            </span>
          </div>
        </div>

        {/* 5개 막대 컬럼 */}
        <div className="grid grid-cols-5 gap-2 pt-2 items-end h-[175px]">
          {families.map((item, idx) => {
            const hasData = item.subjects.length > 0 || item.avgRawScore > 0 || item.grade5 > 0;
            const height5 = get5GradeHeight(item.grade5);
            const height9 = get9GradeHeight(item.grade9);

            const statusColor =
              item.status === '강점'
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : item.status === '경쟁'
                ? 'bg-blue-100 text-blue-800 border-blue-300'
                : item.status === '보완'
                ? 'bg-amber-100 text-amber-800 border-amber-300'
                : 'bg-rose-100 text-rose-800 border-rose-300';

            return (
              <div key={idx} className="flex flex-col items-center h-full justify-end">
                {/* 상단 상태 태그 */}
                <span
                  className={`px-1.5 py-0.2 rounded text-[9px] font-black border mb-1.5 ${statusColor}`}
                >
                  {hasData ? item.status : '미입력'}
                </span>

                {/* 트윈 바 */}
                <div className="w-full flex items-end justify-center gap-1.5 h-[105px] bg-white rounded-lg p-1 border border-slate-200">
                  {/* 바 1: 5등급제 예측 */}
                  <div
                    className="w-1/2 rounded-t transition-all duration-500 flex flex-col justify-end items-center bg-indigo-600 hover:bg-indigo-700"
                    style={{
                      height: `${hasData ? height5 : 15}%`
                    }}
                    title={`5등급제 예측: ${item.grade5}등급`}
                  >
                    {hasData && (
                      <span className="text-[9px] font-black text-white mb-0.5 drop-shadow-xs">
                        {item.grade5}등
                      </span>
                    )}
                  </div>

                  {/* 바 2: 9등급제 예측 */}
                  <div
                    className="w-1/2 rounded-t transition-all duration-500 flex flex-col justify-end items-center bg-purple-600 hover:bg-purple-700"
                    style={{
                      height: `${hasData ? height9 : 15}%`
                    }}
                    title={`9등급제 환산 예측: ${item.grade9}등급`}
                  >
                    {hasData && (
                      <span className="text-[9px] font-black text-white mb-0.5 drop-shadow-xs">
                        {item.grade9}등
                      </span>
                    )}
                  </div>
                </div>

                {/* 하단 계열 라벨 & 수치 */}
                <div className="text-center mt-1.5">
                  <span className="text-xs font-bold text-slate-800 block">
                    {familyConfig[item.family]?.shortName || item.family}
                  </span>
                  {hasData && (
                    <span className="text-[9px] font-bold text-slate-600 block leading-tight mt-0.5">
                      {item.grade5}등 / {item.grade9}등
                    </span>
                  )}
                  {schoolLevel === 'middle' && hasData && item.avgRawScore > 0 && (
                    <span className="text-[8px] text-slate-400 block">
                      ({Math.round(item.avgRawScore)}점)
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
