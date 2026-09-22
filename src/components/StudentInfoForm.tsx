import React from 'react';
import {
  SchoolLevel,
  StudentProfile,
  HighSchoolType,
  HighSchoolRegion,
  TargetHighSchool,
  TargetUniversity,
  NonStandardSchoolTier
} from '../types';
import {
  GraduationCap,
  School,
  Building2,
  MapPin,
  Sparkles,
  Info
} from 'lucide-react';

interface StudentInfoFormProps {
  profile: StudentProfile;
  onChange: (newProfile: StudentProfile) => void;
}

const HIGH_SCHOOL_TYPES: HighSchoolType[] = [
  '일반고',
  '자율형사립고(전국)',
  '자율형사립고(광역)',
  '특수목적고(외고/국제고)',
  '특수목적고(과학고)',
  '특성화고/마이스터고'
];

const REGIONS: HighSchoolRegion[] = [
  '일반 평준화 지역',
  '서울 강남·서초',
  '서울 양천·목동',
  '서울 노원·중계',
  '경기 분당·수지',
  '경기 일산',
  '대구 수성·부산 해운대 등 교육특구',
  '비평준화 우수고 지역'
];

export const StudentInfoForm: React.FC<StudentInfoFormProps> = ({
  profile,
  onChange
}) => {
  const handleLevelChange = (level: SchoolLevel) => {
    onChange({
      ...profile,
      schoolLevel: level
    });
  };

  const handleGradeChange = (grade: number) => {
    onChange({
      ...profile,
      grade
    });
  };

  const handleCareerChange = (career: string) => {
    onChange({
      ...profile,
      careerGoal: career
    });
  };

  // 중학생 목표 고교 3개 업데이트
  const handleMiddleTargetChange = (index: number, field: keyof TargetHighSchool, value: any) => {
    const updated = [...profile.middleTargetHighSchools];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    onChange({
      ...profile,
      middleTargetHighSchools: updated
    });
  };

  // 고등학생 목표 대학/학과 3개 업데이트
  const handleHighTargetChange = (index: number, field: keyof TargetUniversity, value: any) => {
    const updated = [...profile.highTargetUniversities];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    onChange({
      ...profile,
      highTargetUniversities: updated
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-slate-200">
      <div className="mb-6 pb-4 border-b border-slate-100">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 mb-1">
          1단계
        </span>
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-indigo-600" />
          학생 기본 정보 입력
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          학생의 학교급과 학년, 목표 진로 및 진학을 희망하는 목표 학교 정보를 직접 입력하세요.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* (1) 중학생 / 고등학생 구분 및 학년 입력 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              (1) 학교 구분 및 학년 선택 <span className="text-indigo-600">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleLevelChange('middle')}
                className={`py-3 px-4 rounded-xl font-bold text-sm border-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  profile.schoolLevel === 'middle'
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <School className="w-4 h-4 text-indigo-600" />
                중학생
              </button>

              <button
                type="button"
                onClick={() => handleLevelChange('high')}
                className={`py-3 px-4 rounded-xl font-bold text-sm border-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  profile.schoolLevel === 'high'
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <Building2 className="w-4 h-4 text-indigo-600" />
                고등학생
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              현재 학년
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => handleGradeChange(g)}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border transition cursor-pointer ${
                    profile.grade === g
                      ? 'border-indigo-600 bg-indigo-600 text-white shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {g}학년
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* (2) 학생의 희망 진로 한 개 입력 */}
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-1.5">
            (2) 학생의 희망 진로 (1개 입력) <span className="text-indigo-600">*</span>
          </label>
          <p className="text-xs text-slate-500 mb-2">
            학생이 희망하는 목표 진로 및 전공 분야를 직접 입력하세요. (고등학생의 경우 전공 진로 분야 과목 산출에 반영됩니다)
          </p>
          <input
            type="text"
            value={profile.careerGoal}
            onChange={(e) => handleCareerChange(e.target.value)}
            placeholder="예: 컴퓨터공학·인공지능(AI), 의예과, 경영학, 반도체공학 등"
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
          />
        </div>
      </div>

      {/* (3) 중학생일 경우: 진학 희망 고등학교 3개 직접 입력 */}
      {profile.schoolLevel === 'middle' ? (
        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="mb-4">
            <label className="block text-sm font-bold text-slate-800">
              (3) 진학 희망 고등학교 (3개 직접 입력) <span className="text-indigo-600">*</span>
            </label>
            <p className="text-xs text-slate-500 mt-0.5">
              지망하는 고등학교의 이름, 계열(일반고, 특목고, 자사고 등) 및 소재 지역/학군을 입력하세요.
              특히 <strong>‘비평준화 우수고 지역’</strong>의 경우 학교별 학업 수준(선발 우수고 vs 일반 보통고 vs 하위권고)을 정밀 선택할 수 있습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {profile.middleTargetHighSchools.map((target, idx) => (
              <div
                key={target.id || idx}
                className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 relative hover:border-indigo-300 transition"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-700 text-xs font-black">
                    지망 {idx + 1}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">
                    직접 입력
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      고등학교명
                    </label>
                    <input
                      type="text"
                      value={target.name}
                      onChange={(e) => handleMiddleTargetChange(idx, 'name', e.target.value)}
                      placeholder="예: 휘문고, 대원외고, 한일고, 일반고 등"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        고교 계열/유형
                      </label>
                      <select
                        value={target.type}
                        onChange={(e) =>
                          handleMiddleTargetChange(idx, 'type', e.target.value as HighSchoolType)
                        }
                        className="w-full px-2 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden font-medium text-slate-700"
                      >
                        {HIGH_SCHOOL_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        소재 지역/학군
                      </label>
                      <select
                        value={target.region}
                        onChange={(e) =>
                          handleMiddleTargetChange(idx, 'region', e.target.value as HighSchoolRegion)
                        }
                        className="w-full px-2 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden font-medium text-slate-700"
                      >
                        {REGIONS.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* 비평준화 우수고 지역 선택 시 세부 학교 학업 수준 선택 */}
                  {target.region === '비평준화 우수고 지역' && (
                    <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-xs">
                      <label className="block text-[11px] font-bold text-amber-900 mb-1">
                        비평준화 학교 학업 수준 선택
                      </label>
                      <select
                        value={target.nonStandardTier || '우수선발고(상위권 집중)'}
                        onChange={(e) =>
                          handleMiddleTargetChange(
                            idx,
                            'nonStandardTier',
                            e.target.value as NonStandardSchoolTier
                          )
                        }
                        className="w-full px-2 py-1.5 text-xs bg-white border border-amber-300 rounded-md font-medium text-amber-950 focus:outline-hidden"
                      >
                        <option value="우수선발고(상위권 집중)">
                          우수 선발고 (중학교 상위권 학생들이 모이는 명문고)
                        </option>
                        <option value="일반중위고(보통 수준)">
                          일반 중위고 (관내 평균 수준의 일반고)
                        </option>
                        <option value="하위권고(기초학력 중심)">
                          하위권 고교 (학업 성취도 하위권 학생들이 주로 진학)
                        </option>
                      </select>
                      <p className="text-[10px] text-amber-800 mt-1 leading-tight">
                        * 비평준화 지역은 학교별 중학교 커트라인 차이가 크므로 고교의 학력군 수준을 반영합니다.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* (4) 고등학생일 경우: 현재 고교 정보 & 진학 희망 대학교/학과 3개 직접 입력 */
        <div className="mt-6 pt-6 border-t border-slate-100">
          {/* 현재 재학 고등학교 정보 */}
          <div className="mb-6 p-4 bg-slate-50/80 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <School className="w-4 h-4 text-indigo-600" />
              현재 재학 고등학교 정보 (내신 산출 기준)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1">
                  재학 고교명
                </label>
                <input
                  type="text"
                  value={profile.currentHighSchool.name}
                  onChange={(e) =>
                    onChange({
                      ...profile,
                      currentHighSchool: { ...profile.currentHighSchool, name: e.target.value }
                    })
                  }
                  placeholder="예: 서울 OO고등학교"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden font-medium"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1">
                  고교 유형
                </label>
                <select
                  value={profile.currentHighSchool.type}
                  onChange={(e) =>
                    onChange({
                      ...profile,
                      currentHighSchool: {
                        ...profile.currentHighSchool,
                        type: e.target.value as HighSchoolType
                      }
                    })
                  }
                  className="w-full px-2 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden font-medium"
                >
                  {HIGH_SCHOOL_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1">
                  학교 소재지
                </label>
                <select
                  value={profile.currentHighSchool.region}
                  onChange={(e) =>
                    onChange({
                      ...profile,
                      currentHighSchool: {
                        ...profile.currentHighSchool,
                        region: e.target.value as HighSchoolRegion
                      }
                    })
                  }
                  className="w-full px-2 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden font-medium"
                >
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold text-slate-800">
              (4) 진학 희망 대학교 / 학과 (3개 직접 입력) <span className="text-indigo-600">*</span>
            </label>
            <p className="text-xs text-slate-500 mt-0.5">
              수시 학생부교과전형 목표 대학교명, 학과, 전형명 및 2개년 합격자 70% Cut(내신 등급)을 직접 입력하세요.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {profile.highTargetUniversities.map((uni, idx) => (
              <div
                key={uni.id || idx}
                className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 relative hover:border-indigo-300 transition"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-700 text-xs font-black">
                    지망 {idx + 1}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">
                    직접 입력
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        대학교명
                      </label>
                      <input
                        type="text"
                        value={uni.university}
                        onChange={(e) => handleHighTargetChange(idx, 'university', e.target.value)}
                        placeholder="예: 서울대학교"
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        학과/모집단위
                      </label>
                      <input
                        type="text"
                        value={uni.department}
                        onChange={(e) => handleHighTargetChange(idx, 'department', e.target.value)}
                        placeholder="예: 컴퓨터공학부"
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      수시 전형 유형
                    </label>
                    <input
                      type="text"
                      value={uni.admissionType}
                      onChange={(e) => handleHighTargetChange(idx, 'admissionType', e.target.value)}
                      placeholder="예: 지역균형전형, 학교추천 등"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        2024년 70% Cut
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={uni.cut2024}
                        onChange={(e) =>
                          handleHighTargetChange(
                            idx,
                            'cut2024',
                            e.target.value === '' ? '' : parseFloat(e.target.value)
                          )
                        }
                        placeholder="예: 1.25"
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        2025년 70% Cut
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={uni.cut2025}
                        onChange={(e) =>
                          handleHighTargetChange(
                            idx,
                            'cut2025',
                            e.target.value === '' ? '' : parseFloat(e.target.value)
                          )
                        }
                        placeholder="예: 1.22"
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
