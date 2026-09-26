import React from 'react';
import {
  StudentProfile,
  MiddleSchoolPrediction,
  HighSchoolPrediction
} from '../types';
import { BrandLogo } from './BrandLogo';
import { MiddleSchoolReport } from './MiddleSchoolReport';
import { HighScoreReport } from './HighScoreReport';
import {
  Printer,
  ArrowLeft,
  Calendar,
  User,
  Share2,
  FileCheck,
  Award,
  Sparkles,
  Check,
  Globe,
  ExternalLink
} from 'lucide-react';

interface ReportContainerProps {
  profile: StudentProfile;
  middlePrediction?: MiddleSchoolPrediction;
  highPrediction?: HighSchoolPrediction;
  onBackToInput: () => void;
}

export const ReportContainer: React.FC<ReportContainerProps> = ({
  profile,
  middlePrediction,
  highPrediction,
  onBackToInput
}) => {
  const [copied, setCopied] = React.useState(false);

  const reportDate = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const reportId = `SD-${Date.now().toString().slice(-6)}`;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* 상단 액션 바 (인쇄 시 숨김: no-print) */}
      <div className="no-print bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBackToInput}
          className="flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-indigo-600 px-3 py-2 rounded-xl hover:bg-slate-100 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          성적 및 정보 수정하기
        </button>

        <div className="flex items-center gap-3">
          <a
            href="https://www.sangdi.net"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-2 rounded-xl border border-indigo-200 transition"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-600" />
            <span>생디 공식 사이트 (www.sangdi.net)</span>
            <ExternalLink className="w-3 h-3 text-indigo-500" />
          </a>

          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            {copied ? '링크 복사됨' : '리포트 공유'}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl shadow-sm transition"
          >
            <Printer className="w-4 h-4" />
            PDF 다운로드 / 인쇄하기
          </button>
        </div>
      </div>

      {/* 공식 리포트 용지 본문 (A4 규격 인쇄 대응) */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-slate-200 printable-card">
        {/* 리포트 공식 상단 헤더 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b-2 border-slate-900">
          <div>
            <BrandLogo size="lg" showSubtitle={true} clickable={true} showActionButton={true} />
            <div className="mt-2 text-[11px] text-slate-400 font-medium">
              * 상단 로고를 클릭하거나 버튼을 눌러 소지하신 원본 이미지 파일을 언제든 등록·교체할 수 있습니다.
            </div>
            {/* 공식 홈페이지 URL 명시 */}
            <div className="mt-2 flex items-center gap-1.5 text-xs text-indigo-700 font-bold">
              <Globe className="w-3.5 h-3.5 text-indigo-600" />
              <span>생디 공식 웹사이트:</span>
              <a
                href="https://www.sangdi.net"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-indigo-900 font-extrabold text-indigo-800 flex items-center gap-0.5"
              >
                www.sangdi.net
                <ExternalLink className="w-3 h-3 inline" />
              </a>
            </div>
          </div>

          <div className="sm:text-right">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-200 mb-1.5">
              공식 분석 증명서
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              내신 등급 예측 분석 리포트
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              발행번호: <span className="font-mono font-bold text-slate-700">{reportId}</span> · 분석일자: {reportDate}
            </p>
          </div>
        </div>

        {/* 학생 기본 정보 요약 띠지 */}
        <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 mb-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">
              대상 학생 구분
            </span>
            <span className="font-extrabold text-slate-900 text-sm">
              {profile.schoolLevel === 'middle' ? '중학교' : '고등학교'} {profile.grade}학년
            </span>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">
              학생 희망 진로
            </span>
            <span className="font-extrabold text-indigo-700 text-sm">
              {profile.careerGoal || '미정'}
            </span>
          </div>

          {profile.schoolLevel === 'middle' ? (
            <div className="col-span-2">
              <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">
                진학 희망 고등학교 (3개교)
              </span>
              <span className="font-bold text-slate-800 text-xs">
                {profile.middleTargetHighSchools.map((s, i) => `${i + 1}. ${s.name}(${s.type.slice(0, 3)})`).join('  |  ')}
              </span>
            </div>
          ) : (
            <>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">
                  현재 재학 고교
                </span>
                <span className="font-bold text-slate-800 text-xs">
                  {profile.currentHighSchool.name} ({profile.currentHighSchool.type})
                </span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">
                  목표 대학교·학과
                </span>
                <span className="font-bold text-slate-800 text-xs truncate block" title={profile.highTargetUniversities.map(u => `${u.university} ${u.department}`).join(', ')}>
                  {profile.highTargetUniversities[0]?.university} 외 {profile.highTargetUniversities.length - 1}곳
                </span>
              </div>
            </>
          )}
        </div>

        {/* 중학생 vs 고등학생 본문 결과 */}
        {profile.schoolLevel === 'middle' && middlePrediction ? (
          <MiddleSchoolReport prediction={middlePrediction} profile={profile} />
        ) : profile.schoolLevel === 'high' && highPrediction ? (
          <HighScoreReport prediction={highPrediction} profile={profile} />
        ) : null}

        {/* 생디 공식 웹사이트 및 1:1 심층 입시컨설팅 배너 */}
        <div className="mt-10 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-7 text-white shadow-md avoid-break">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-bold border border-indigo-400/30">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                학생부종합전형 & 수시 1:1 맞춤 설계
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white">
                더 정밀한 합격 진단과 학생부 디자인은 <span className="text-indigo-300">생디 공식 사이트</span>에서 만나보세요!
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                개인별 취약 교과 맞춤 보완 로드맵, 고교학점제 선택과목 설계, 대학별 학생부종합전형 역량 분석은 생디(SAENGDI) 전문 컨설턴트 그룹과 함께 완성할 수 있습니다.
              </p>
            </div>
            <div className="shrink-0 flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end gap-2.5">
              <a
                href="https://www.sangdi.net"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-indigo-500/20 transition group"
              >
                <Globe className="w-4 h-4 text-indigo-200" />
                <span>www.sangdi.net 바로가기</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </a>
              <span className="text-[11px] text-slate-400 font-medium">
                공식 홈페이지: www.sangdi.net
              </span>
            </div>
          </div>
        </div>

        {/* 리포트 하단 공시 및 직인 푸터 */}
        <div className="mt-8 pt-6 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4 avoid-break">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <FileCheck className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>
                본 리포트는 학생부관리 입시컨설팅 AI플랫폼 <strong>‘생디(SAENGDI)’</strong>의 통계 알고리즘에 의해 자동 검증·발행되었습니다.
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[11px] text-slate-600">
              <Globe className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>생디 공식 웹사이트:</span>
              <a
                href="https://www.sangdi.net"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-indigo-700 underline hover:text-indigo-900"
              >
                www.sangdi.net
              </a>
              <span className="text-slate-300">|</span>
              <span>2028 개정 교육과정 5등급제 & 9등급제 수시 합격률 정밀 진단 시스템</span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-[11px] font-medium text-slate-400">
              입시컨설팅 공인 분석 시스템
            </span>
            <div className="w-10 h-10 rounded-full border border-indigo-300 bg-indigo-50 flex items-center justify-center text-[10px] font-black text-indigo-800 rotate-[-12deg] shadow-2xs">
              생디인
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

