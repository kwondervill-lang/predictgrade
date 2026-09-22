import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { SchoolLevel } from '../types';
import { Sparkles, HelpCircle, FileText, CheckCircle2, ChevronRight } from 'lucide-react';

interface HeaderProps {
  onLoadPreset: (level: SchoolLevel) => void;
  activeLevel: SchoolLevel;
  hasReport: boolean;
  onViewReport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onLoadPreset,
  activeLevel,
  hasReport,
  onViewReport
}) => {
  const [showGuideModal, setShowGuideModal] = useState(false);

  return (
    <>
      <header className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* 좌측 브랜드 로고 */}
          <div className="flex items-center gap-4">
            <BrandLogo size="md" showSubtitle={true} clickable={true} />
            <div className="hidden md:block h-6 w-px bg-slate-200" />
            <span className="hidden md:inline-block text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
              내신 등급 예측 프로그램
            </span>
          </div>

          {/* 우측 도구 바 */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setShowGuideModal(true)}
              className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-indigo-600 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition"
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline">예측 원리 및 안내</span>
            </button>

            {hasReport && (
              <button
                type="button"
                onClick={onViewReport}
                className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg transition"
              >
                <FileText className="w-3.5 h-3.5" />
                분석 리포트 보기
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 예측 원리 안내 모달 */}
      {showGuideModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-2xs p-4"
          onClick={() => setShowGuideModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                ‘생디’ 내신 등급 예측 시스템 원리
              </h3>
              <button
                onClick={() => setShowGuideModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-600 leading-relaxed max-h-[70vh] overflow-y-auto pr-1">
              <div className="p-3.5 bg-indigo-50/70 rounded-xl border border-indigo-100">
                <h4 className="font-bold text-indigo-950 text-sm mb-1.5">
                  1. 중학생 고교 진학 및 내신 예측 모델
                </h4>
                <p>
                  중학교 3년 간의 원점수, 평균, 성취도별 분포비율(A~E)과 수강자수를 기반으로 학업역량 지수를 산출합니다. 관내 특성화고/실업계로 진학하는 하위 15~18%의 분산율을 계산하고, 지망하는 고교(일반고, 전국/광역 자사고, 특목고)의 계열 및 학군지 특성을 반영하여 입학 후 5등급제/9등급제 예상 등급을 정밀 추정합니다.
                </p>
              </div>

              <div className="p-3.5 bg-purple-50/70 rounded-xl border border-purple-100">
                <h4 className="font-bold text-purple-950 text-sm mb-1.5">
                  2. 고등학생 5등급제 산출 및 9등급제 환산 예측
                </h4>
                <p>
                  고교학점제 5등급제(1등급 10%, 2등급 34%, 3등급 66% 등) 전 과목 및 전공 관련 과목 평균을 산출합니다. 동시에 원점수, 과목 평균, 성취도 A~E 비율로부터 표준편차를 도출하여 정규분포 Z-Score 기반 9등급제(1등급 4%, 2등급 11% 등) 등급을 정밀 예측합니다.
                </p>
              </div>

              <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-100">
                <h4 className="font-bold text-emerald-950 text-sm mb-1.5">
                  3. 2개년 수시 교과 합격률 예측 모델
                </h4>
                <p>
                  지망 대학교·학과의 2개년(2024~2025학년도) 수시 모집 학생부교과전형 70% Cut 평균 점수와 학생의 환산 예측 등급을 비교하여 합격 가능성(안정/적정/소신/불안/위험) 및 수능최저 충족 전략을 제공합니다.
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
              >
                확인했습니다
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
