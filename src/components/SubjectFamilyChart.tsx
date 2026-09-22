import React from 'react';
import { SubjectFamilyAnalysis, SubjectFamilyType } from '../types';
import {
  TrendingUp,
  Award,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Flame
} from 'lucide-react';

interface SubjectFamilyChartProps {
  families: SubjectFamilyAnalysis[];
  schoolLevel: 'middle' | 'high';
  sectionNumber?: number;
}

export const SubjectFamilyChart: React.FC<SubjectFamilyChartProps> = ({
  families,
  schoolLevel,
  sectionNumber = 2
}) => {
  // 계열별 아이콘 및 테마 색상 매핑
  const familyConfig: Record<
    SubjectFamilyType,
    { label: string; shortName: string; color: string; barBg: string; textCol: string }
  > = {
    '국어 계열': {
      label: '국어 계열',
      shortName: '국어',
      color: '#4f46e5', // indigo
      barBg: 'bg-indigo-600',
      textCol: 'text-indigo-700'
    },
    '수학 계열': {
      label: '수학 계열',
      shortName: '수학',
      color: '#0891b2', // cyan
      barBg: 'bg-cyan-600',
      textCol: 'text-cyan-700'
    },
    '영어 계열': {
      label: '영어 계열',
      shortName: '영어',
      color: '#2563eb', // blue
      barBg: 'bg-blue-600',
      textCol: 'text-blue-700'
    },
    '사회 계열': {
      label: '사회 계열',
      shortName: '사회',
      color: '#d97706', // amber
      barBg: 'bg-amber-600',
      textCol: 'text-amber-700'
    },
    '과학 계열': {
      label: '과학 계열',
      shortName: '과학',
      color: '#059669', // emerald
      barBg: 'bg-emerald-600',
      textCol: 'text-emerald-700'
    }
  };

  // 강점 과목, 취약 과목 필터링
  const validFamilies = families.filter((f) => f.subjects.length > 0 && f.grade5 > 0);
  const strengths = validFamilies.filter((f) => f.statusType === 'strength');
  const normals = validFamilies.filter((f) => f.statusType === 'compete' || f.statusType === 'improve');
  const weaks = validFamilies.filter((f) => f.statusType === 'weak');

  // 등급 점수화 (1등급일수록 높은 막대: 5등급제 기준 1등급=100%, 5등급=20%)
  const getG5PerformanceHeight = (grade: number) => {
    if (grade <= 0) return 10;
    // 1등급 -> 95%, 5등급 -> 20%
    return Math.max(15, Math.min(100, Math.round(100 - (grade - 1) * 20)));
  };

  // 9등급제 기준 높이 (1등급=95%, 9등급=15%)
  const getG9PerformanceHeight = (grade: number) => {
    if (grade <= 0) return 10;
    return Math.max(15, Math.min(100, Math.round(100 - (grade - 1) * 10)));
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 avoid-break">
      {/* 섹션 헤더 */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
          {sectionNumber}
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            교과 계열별(국·수·영·사·과) 내신 등급 분석 및 강점·취약 과목 진단
          </h3>
          <p className="text-xs text-slate-500">
            {schoolLevel === 'middle'
              ? '중학교 5개 교과 계열별 원점수 및 고교 진학 시 예상 등급을 시각화하여 취약 교과를 선제적으로 진단합니다.'
              : '고교 5등급제 성적과 9등급제 환산치를 5대 교과 계열별로 비교하여 수시 학생부 유불리와 보완 과목을 제시합니다.'}
          </p>
        </div>
      </div>

      {/* 강점 / 취약 과목 빠른 진단 요약 배너 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* 강점 과목 */}
        <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200">
          <div className="flex items-center gap-2 mb-1.5">
            <Award className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-800">
              최우수 강점 교과군
            </span>
          </div>
          {strengths.length > 0 ? (
            <div className="space-y-1">
              <div className="flex flex-wrap gap-1.5">
                {strengths.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md text-xs font-black bg-emerald-600 text-white shadow-2xs"
                  >
                    {s.family} ({schoolLevel === 'middle' ? `${s.avgRawScore}점` : `${s.grade5}등급`})
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-emerald-700 leading-tight mt-1.5">
                상위 1~2등급 방어가 견고한 최상위 경쟁력 교과군입니다.
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-500">
              최상위 강점(1~2등급권) 진입을 위해 킬러 문항 집중 관리가 필요합니다.
            </p>
          )}
        </div>

        {/* 유지 / 경쟁 과목 */}
        <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-blue-800">
              유지·경쟁 교과군 (도약 가능)
            </span>
          </div>
          {normals.length > 0 ? (
            <div className="space-y-1">
              <div className="flex flex-wrap gap-1.5">
                {normals.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200"
                  >
                    {s.family} ({schoolLevel === 'middle' ? `${s.avgRawScore}점` : `${s.grade5}등급`})
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-blue-700 leading-tight mt-1.5">
                중상위권 접전 구간으로, 방학 심화 학습 시 1등급 진입이 유력합니다.
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-500">중위권 유지 과목이 없습니다.</p>
          )}
        </div>

        {/* 취약 과목 */}
        <div className="p-4 rounded-xl bg-rose-50/80 border border-rose-200">
          <div className="flex items-center gap-2 mb-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span className="text-xs font-bold text-rose-800">
              집중 보완 취약 교과군 (주의)
            </span>
          </div>
          {weaks.length > 0 ? (
            <div className="space-y-1">
              <div className="flex flex-wrap gap-1.5">
                {weaks.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md text-xs font-black bg-rose-600 text-white shadow-2xs"
                  >
                    {s.family} ({schoolLevel === 'middle' ? `${s.avgRawScore}점` : `${s.grade5}등급`})
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-rose-700 leading-tight mt-1.5 font-medium">
                내신 감점 요인이 집중되어 다음 학기 최우선 보완이 필수적입니다.
              </p>
            </div>
          ) : (
            <p className="text-xs text-emerald-700 font-semibold">
              취약 교과목이 없습니다! 전 과목 균형 잡힌 우수한 성취도입니다.
            </p>
          )}
        </div>
      </div>

      {/* 계열별 비교 바 차트 시각화 영역 */}
      <div className="p-5 bg-slate-50/80 rounded-xl border border-slate-200 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 pb-2 border-b border-slate-200/80">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold text-slate-800">
              5대 계열별 내신 성취 비교 그래프 (높을수록 우수)
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-indigo-600 inline-block" />
              <span className="text-slate-600 font-medium">
                {schoolLevel === 'middle' ? '원점수(100점 만점)' : '5등급제 등급(1등급 우수)'}
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-purple-600 inline-block" />
              <span className="text-slate-600 font-medium">9등급제 환산 예측</span>
            </span>
          </div>
        </div>

        {/* 바 차트 본체 */}
        <div className="grid grid-cols-5 gap-2 sm:gap-4 pt-4 pb-2 items-end h-[240px]">
          {families.map((item, idx) => {
            const hasData = item.subjects.length > 0 && item.grade5 > 0;
            const height1 =
              schoolLevel === 'middle'
                ? Math.max(15, Math.min(100, Math.round(item.avgRawScore)))
                : getG5PerformanceHeight(item.grade5);
            const height2 = getG9PerformanceHeight(item.grade9);

            return (
              <div
                key={idx}
                className="flex flex-col items-center h-full justify-end group relative"
              >
                {/* 상단 뱃지 */}
                <div className="mb-2 text-center">
                  <span
                    className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-black ${
                      !hasData
                        ? 'bg-slate-200 text-slate-400'
                        : item.statusType === 'strength'
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                        : item.statusType === 'weak'
                        ? 'bg-rose-100 text-rose-700 border border-rose-300'
                        : 'bg-blue-100 text-blue-700 border border-blue-300'
                    }`}
                  >
                    {!hasData ? '미입력' : item.status.split(' ')[0]}
                  </span>
                </div>

                {/* 막대 기둥 쌍 */}
                <div className="w-full flex items-end justify-center gap-1 sm:gap-2 h-[150px] bg-white rounded-lg p-1 border border-slate-200">
                  {/* 막대 1: 원점수 또는 5등급제 */}
                  <div
                    className="w-1/2 rounded-t transition-all duration-500 flex flex-col justify-end items-center relative overflow-hidden"
                    style={{
                      height: `${hasData ? height1 : 12}%`,
                      backgroundColor: hasData
                        ? item.statusType === 'weak'
                          ? '#f43f5e'
                          : '#4f46e5'
                        : '#cbd5e1'
                    }}
                  >
                    {hasData && (
                      <span className="text-[10px] font-black text-white mb-1 drop-shadow-xs">
                        {schoolLevel === 'middle' ? `${item.avgRawScore}` : `${item.grade5}등`}
                      </span>
                    )}
                  </div>

                  {/* 막대 2: 9등급제 예측 */}
                  <div
                    className="w-1/2 rounded-t transition-all duration-500 flex flex-col justify-end items-center relative overflow-hidden"
                    style={{
                      height: `${hasData ? height2 : 12}%`,
                      backgroundColor: hasData ? '#9333ea' : '#e2e8f0'
                    }}
                  >
                    {hasData && (
                      <span className="text-[10px] font-black text-white mb-1 drop-shadow-xs">
                        {item.grade9}등
                      </span>
                    )}
                  </div>
                </div>

                {/* 하단 계열 라벨 */}
                <div className="mt-2 text-center">
                  <span className="text-xs font-bold text-slate-800 block">
                    {familyConfig[item.family]?.shortName || item.family}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {hasData ? `${item.subjects.length}개 과목` : '-'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 계열별 정밀 진단 및 방학 학습 보완 전략 테이블 */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-xs text-left border-collapse">
          <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3">교과 계열</th>
              <th className="py-2.5 px-3 text-center">이수 과목</th>
              <th className="py-2.5 px-3 text-center">원점수 평균</th>
              <th className="py-2.5 px-3 text-center bg-indigo-50 text-indigo-950">
                5등급제 등급
              </th>
              <th className="py-2.5 px-3 text-center bg-purple-50 text-purple-950">
                9등급제 예측
              </th>
              <th className="py-2.5 px-3 text-center">진단 판정</th>
              <th className="py-2.5 px-3">생디 맞춤형 보완 전략 및 코칭</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {families.map((row, idx) => {
              const hasData = row.subjects.length > 0 && row.grade5 > 0;
              return (
                <tr key={idx} className="hover:bg-slate-50 transition">
                  <td className="py-2.5 px-3 font-bold text-slate-800">
                    <span className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          backgroundColor:
                            familyConfig[row.family]?.color || '#4f46e5'
                        }}
                      />
                      {row.family}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center text-slate-600 font-medium">
                    {hasData ? row.subjects.join(', ') : '-'}
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold text-slate-700">
                    {hasData ? `${row.avgRawScore}점` : '-'}
                  </td>
                  <td className="py-2.5 px-3 text-center font-black text-indigo-700 bg-indigo-50/40">
                    {hasData ? `${row.grade5}등급` : '-'}
                  </td>
                  <td className="py-2.5 px-3 text-center font-black text-purple-700 bg-purple-50/40">
                    {hasData ? `${row.grade9}등급` : '-'}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {hasData ? (
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          row.statusType === 'strength'
                            ? 'bg-emerald-100 text-emerald-800'
                            : row.statusType === 'weak'
                            ? 'bg-rose-100 text-rose-800 font-black'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {row.status}
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 leading-snug">
                    <p className="font-semibold text-slate-800 mb-0.5">
                      {row.strengthsOrWeaknesses}
                    </p>
                    <p className="text-[11px] text-slate-500">{row.advice}</p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
