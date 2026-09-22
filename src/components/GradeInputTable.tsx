import React, { useState } from 'react';
import {
  SchoolLevel,
  Semester,
  GradeEntry,
  AchievementDistribution
} from '../types';
import {
  HIGH_SCHOOL_SUBJECTS,
  MIDDLE_SCHOOL_SUBJECTS
} from '../data/universityData';
import {
  Table,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  BookOpen,
  Info,
  Calendar
} from 'lucide-react';

interface GradeInputTableProps {
  schoolLevel: SchoolLevel;
  grades: Record<Semester, GradeEntry[]>;
  onChange: (newGrades: Record<Semester, GradeEntry[]>) => void;
}

const SEMESTERS: { key: Semester; label: string; year: number; term: number }[] = [
  { key: '1-1', label: '1학년 1학기', year: 1, term: 1 },
  { key: '1-2', label: '1학년 2학기', year: 1, term: 2 },
  { key: '2-1', label: '2학년 1학기', year: 2, term: 1 },
  { key: '2-2', label: '2학년 2학기', year: 2, term: 2 },
  { key: '3-1', label: '3학년 1학기', year: 3, term: 1 },
  { key: '3-2', label: '3학년 2학기', year: 3, term: 2 },
];

export const GradeInputTable: React.FC<GradeInputTableProps> = ({
  schoolLevel,
  grades,
  onChange
}) => {
  const [activeSemester, setActiveSemester] = useState<Semester>('1-1');
  const [customSubjectName, setCustomSubjectName] = useState('');
  const [showCustomModal, setShowCustomModal] = useState(false);

  const currentList = grades[activeSemester] || [];

  // 특정 행의 필드 변경 (빈 값 허용)
  const handleItemChange = (id: string, field: keyof GradeEntry, value: any) => {
    const updatedSemesterList = currentList.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          [field]: value
        };
      }
      return item;
    });

    onChange({
      ...grades,
      [activeSemester]: updatedSemesterList
    });
  };

  // 성취도 분포 변경 (빈 값 허용)
  const handleDistributionChange = (
    id: string,
    key: keyof AchievementDistribution,
    val: string
  ) => {
    const numVal = val === '' ? '' : Math.max(0, Math.min(100, parseFloat(val) || 0));
    const updatedSemesterList = currentList.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          distribution: {
            ...item.distribution,
            [key]: numVal
          }
        };
      }
      return item;
    });

    onChange({
      ...grades,
      [activeSemester]: updatedSemesterList
    });
  };

  // 고등학생용 과목 추가
  const handleAddSubject = (subjectName?: string) => {
    const nameToAdd = subjectName || customSubjectName.trim() || '선택과목';
    const newEntry: GradeEntry = {
      id: `subj-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      subject: nameToAdd,
      rawScore: '',
      average: '',
      distribution: { A: '', B: '', C: '', D: '', E: '' },
      studentCount: '',
      grade5: '',
      isCareerSubject: false
    };

    onChange({
      ...grades,
      [activeSemester]: [...currentList, newEntry]
    });
    setCustomSubjectName('');
    setShowCustomModal(false);
  };

  // 고등학생용 과목 삭제
  const handleDeleteSubject = (id: string) => {
    const updated = currentList.filter((item) => item.id !== id);
    onChange({
      ...grades,
      [activeSemester]: updated
    });
  };

  // 현재 입력된 유효 과목 수 카운트
  const totalEnteredSubjectsCount = Object.values(grades)
    .flat()
    .filter((g) => g.rawScore !== '' && g.rawScore !== null && !isNaN(Number(g.rawScore))).length;

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 mb-1">
            2단계
          </span>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            현재 성적 정보 입력 (3개년 6개 학기)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {schoolLevel === 'middle'
              ? '중학교 3년 간(1학기, 2학기) 국어, 수학, 영어, 사회, 과학 5개 과목의 원점수, 평균, 성취도별 분포비율(A~E), 수강자수를 입력하세요.'
              : '고등학교 3년 간(1학기, 2학기) 고교학점제 7개 교과목의 원점수, 5등급제 내신등급, 평균, 성취도별 분포비율(A~E), 수강자수를 입력하세요.'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-semibold">
            입력 완료된 과목: <strong className="text-indigo-600 font-bold">{totalEnteredSubjectsCount}개</strong>
          </span>
        </div>
      </div>

      {/* 안내 띠지 */}
      <div className="mb-5 p-3.5 bg-blue-50/70 rounded-xl border border-blue-100 text-xs text-blue-900 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold">
            보유하고 있는 성적 정보만 입력하면 입력된 학기·과목 데이터만 반영하여 예측합니다.
          </p>
          <p className="text-blue-700">
            {schoolLevel === 'middle'
              ? '※ 90점 이상인 A의 분포 비율이 35% 이상으로 높으면 쉬운 시험(물시험)으로 판별되어 고교 진학 시 내신 거품이 보정됩니다.'
              : '※ 진로/전공 연계 과목은 희망 진로 평가 시 가중치가 부여되므로 해당 과목의 체크박스를 설정해 주세요.'}
          </p>
        </div>
      </div>

      {/* 학기 선택 탭 (1-1 ~ 3-2) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-6">
        {SEMESTERS.map((sem) => {
          const count = (grades[sem.key] || []).filter(
            (g) => g.rawScore !== '' && g.rawScore !== null
          ).length;
          const isActive = activeSemester === sem.key;

          return (
            <button
              key={sem.key}
              type="button"
              onClick={() => setActiveSemester(sem.key)}
              className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition flex flex-col items-center justify-center cursor-pointer ${
                isActive
                  ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="text-[13px]">{sem.label}</span>
              <span
                className={`text-[10px] mt-0.5 font-medium ${
                  isActive ? 'text-indigo-100' : count > 0 ? 'text-indigo-600 font-bold' : 'text-slate-400'
                }`}
              >
                {count > 0 ? `${count}과목 입력됨` : '미입력'}
              </span>
            </button>
          );
        })}
      </div>

      {/* 성적 입력 테이블 */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs mb-4">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <th className="py-3 px-3 min-w-[110px]">교과목</th>
              {schoolLevel === 'high' && (
                <th className="py-3 px-2 text-center min-w-[70px]">
                  전공연계
                </th>
              )}
              <th className="py-3 px-2 text-center min-w-[85px]">
                {schoolLevel === 'middle' ? '자신의 점수' : '원점수'}
                <span className="block text-[10px] font-normal text-slate-500">(100점 만점)</span>
              </th>
              {schoolLevel === 'high' && (
                <th className="py-3 px-2 text-center min-w-[85px] bg-indigo-50/70 text-indigo-950">
                  내신등급
                  <span className="block text-[10px] font-normal text-indigo-700">(5등급제 1~5)</span>
                </th>
              )}
              <th className="py-3 px-2 text-center min-w-[80px]">
                과목 평균
                <span className="block text-[10px] font-normal text-slate-500">(점)</span>
              </th>
              <th className="py-3 px-2 text-center min-w-[210px]">
                성취도별 분포비율 (%)
                <span className="block text-[10px] font-normal text-slate-500">A / B / C / D / E</span>
              </th>
              <th className="py-3 px-2 text-center min-w-[80px]">
                수강자수
                <span className="block text-[10px] font-normal text-slate-500">(명)</span>
              </th>
              {schoolLevel === 'high' && (
                <th className="py-3 px-2 text-center min-w-[50px]">삭제</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentList.map((item, idx) => (
              <tr key={item.id} className="hover:bg-slate-50/70 transition">
                {/* 교과목명 */}
                <td className="py-2.5 px-3">
                  {schoolLevel === 'middle' ? (
                    <span className="font-extrabold text-slate-900 text-sm">
                      {item.subject}
                    </span>
                  ) : (
                    <select
                      value={item.subject}
                      onChange={(e) => handleItemChange(item.id, 'subject', e.target.value)}
                      className="w-full px-2 py-1 text-xs bg-white border border-slate-300 rounded-md font-bold text-slate-800 focus:outline-hidden"
                    >
                      {HIGH_SCHOOL_SUBJECTS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                      {!HIGH_SCHOOL_SUBJECTS.includes(item.subject) && (
                        <option value={item.subject}>{item.subject} (직접입력)</option>
                      )}
                    </select>
                  )}
                </td>

                {/* 고등학생: 전공 진로 연계 여부 */}
                {schoolLevel === 'high' && (
                  <td className="py-2.5 px-2 text-center">
                    <input
                      type="checkbox"
                      checked={!!item.isCareerSubject}
                      onChange={(e) =>
                        handleItemChange(item.id, 'isCareerSubject', e.target.checked)
                      }
                      title="희망 진로 관련 과목으로 반영"
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                  </td>
                )}

                {/* 원점수 (자신의 점수) */}
                <td className="py-2.5 px-2 text-center">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={item.rawScore}
                    onChange={(e) =>
                      handleItemChange(
                        item.id,
                        'rawScore',
                        e.target.value === '' ? '' : parseFloat(e.target.value)
                      )
                    }
                    placeholder="미입력"
                    className="w-20 px-2 py-1.5 text-center text-xs bg-white border border-slate-300 rounded-md font-extrabold text-indigo-700 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </td>

                {/* 고등학생: 5등급제 등급 (1~5) */}
                {schoolLevel === 'high' && (
                  <td className="py-2.5 px-2 text-center bg-indigo-50/30">
                    <select
                      value={item.grade5}
                      onChange={(e) =>
                        handleItemChange(
                          item.id,
                          'grade5',
                          e.target.value === '' ? '' : parseInt(e.target.value, 10)
                        )
                      }
                      className="w-20 px-2 py-1.5 text-center text-xs bg-white border border-indigo-200 rounded-md font-black text-indigo-900 focus:outline-hidden"
                    >
                      <option value="">선택</option>
                      <option value="1">1등급</option>
                      <option value="2">2등급</option>
                      <option value="3">3등급</option>
                      <option value="4">4등급</option>
                      <option value="5">5등급</option>
                    </select>
                  </td>
                )}

                {/* 과목 평균 */}
                <td className="py-2.5 px-2 text-center">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={item.average}
                    onChange={(e) =>
                      handleItemChange(
                        item.id,
                        'average',
                        e.target.value === '' ? '' : parseFloat(e.target.value)
                      )
                    }
                    placeholder="평균"
                    className="w-18 px-2 py-1.5 text-center text-xs bg-white border border-slate-300 rounded-md font-medium text-slate-700 focus:outline-hidden"
                  />
                </td>

                {/* 성취도별 분포비율 (A, B, C, D, E) */}
                <td className="py-2.5 px-2 text-center">
                  <div className="flex items-center justify-center gap-1">
                    {(['A', 'B', 'C', 'D', 'E'] as (keyof AchievementDistribution)[]).map(
                      (tier) => (
                        <div key={tier} className="flex flex-col items-center">
                          <span
                            className={`text-[9px] font-black ${
                              tier === 'A'
                                ? 'text-indigo-600'
                                : tier === 'B'
                                ? 'text-blue-600'
                                : 'text-slate-500'
                            }`}
                          >
                            {tier}
                          </span>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={item.distribution[tier]}
                            onChange={(e) =>
                              handleDistributionChange(item.id, tier, e.target.value)
                            }
                            placeholder="%"
                            className={`w-10 px-1 py-1 text-center text-[11px] bg-white border rounded focus:outline-hidden ${
                              tier === 'A'
                                ? 'border-indigo-300 font-bold text-indigo-900'
                                : 'border-slate-200 text-slate-700'
                            }`}
                          />
                        </div>
                      )
                    )}
                  </div>
                </td>

                {/* 수강자수 */}
                <td className="py-2.5 px-2 text-center">
                  <input
                    type="number"
                    min="1"
                    value={item.studentCount}
                    onChange={(e) =>
                      handleItemChange(
                        item.id,
                        'studentCount',
                        e.target.value === '' ? '' : parseInt(e.target.value, 10)
                      )
                    }
                    placeholder="수강자수"
                    className="w-18 px-2 py-1.5 text-center text-xs bg-white border border-slate-300 rounded-md font-medium text-slate-700 focus:outline-hidden"
                  />
                </td>

                {/* 고등학생: 과목 삭제 버튼 */}
                {schoolLevel === 'high' && (
                  <td className="py-2.5 px-2 text-center">
                    <button
                      type="button"
                      onClick={() => handleDeleteSubject(item.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition"
                      title="과목 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 고등학생용 과목 추가 버튼 */}
      {schoolLevel === 'high' && (
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => setShowCustomModal(true)}
            className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-lg border border-indigo-200 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            과목 추가 / 직접 입력
          </button>
          <span className="text-[11px] text-slate-400">
            * 1학기당 통상 7과목을 이수하며, 필요 시 자유롭게 추가/수정 가능합니다.
          </span>
        </div>
      )}

      {/* 고등학생용 과목 추가 모달 */}
      {showCustomModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-2xs p-4"
          onClick={() => setShowCustomModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-bold text-slate-900 mb-3">
              신규 교과목 추가
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              추가하실 교과목명을 직접 입력하거나 아래 대표 과목에서 선택하세요.
            </p>
            <input
              type="text"
              value={customSubjectName}
              onChange={(e) => setCustomSubjectName(e.target.value)}
              placeholder="예: 인공지능수학, 심화영어 등"
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden font-medium mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => handleAddSubject()}
                className="px-3.5 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
              >
                추가하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
