import {
  StudentProfile,
  Semester,
  GradeEntry,
  MiddleSchoolPrediction,
  HighSchoolPrediction,
  TargetHighSchool,
  TargetUniversity,
  SubjectFamilyType,
  SubjectFamilyAnalysis,
  SubjectStatusTier,
  SubjectStatusType
} from '../types';

/**
 * 표준정규분포 상위 누적 확률 계산 Q(z) = P(Z >= z)
 * Abramowitz and Stegun 26.2.17 정밀 근사식 (|error| < 7.5e-8)
 * z = 0       -> 0.5000 (상위 50%)
 * z = +1.282  -> 0.1000 (상위 10%, 5등급제 1등급 컷)
 * z = +1.751  -> 0.0400 (상위 4.0%, 9등급제 1등급 컷)
 * z = +1.960  -> 0.0250 (상위 2.5%)
 * z = -1.282  -> 0.9000 (상위 90%)
 */
export function normalUpperTail(z: number): number {
  const absZ = Math.abs(z);
  const t = 1.0 / (1.0 + 0.2316419 * absZ);
  const d = 0.3989422804 * Math.exp((-absZ * absZ) / 2.0);
  const poly =
    d *
    t *
    (0.31938153 +
      t *
        (-0.356563782 +
          t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));

  if (z >= 0) {
    return poly;
  } else {
    return 1.0 - poly;
  }
}

/**
 * 성취도 A% 분포 및 평균 점수를 바탕으로 과목 표준편차(σ) 추정
 * P(X >= 90) = A / 100 이므로, Z_90 = (90 - M) / σ
 */
export function estimateStdDev(average: number, distA: number): number {
  const aRate = Math.max(0.04, Math.min(0.65, distA / 100));
  // A%에 대응하는 Z 임계값 (상위 A% 지점)
  let zCut = 0.84;
  if (aRate <= 0.08) zCut = 1.41;
  else if (aRate <= 0.12) zCut = 1.17;
  else if (aRate <= 0.18) zCut = 0.92;
  else if (aRate <= 0.25) zCut = 0.67;
  else if (aRate <= 0.35) zCut = 0.39;
  else if (aRate <= 0.45) zCut = 0.13;
  else zCut = -0.12;

  let sigma = 16.0;
  if (zCut > 0.1 && 90 > average) {
    sigma = (90 - average) / zCut;
    sigma = Math.max(11.0, Math.min(24.0, sigma));
  } else {
    sigma = 16.0;
  }
  return sigma;
}

/**
 * 9등급제 등급 판정 (누적 백분위 기준)
 */
export function percentileToGrade9(cumulativePercentile: number): number {
  if (cumulativePercentile <= 4.0) return 1;
  if (cumulativePercentile <= 11.0) return 2;
  if (cumulativePercentile <= 23.0) return 3;
  if (cumulativePercentile <= 40.0) return 4;
  if (cumulativePercentile <= 60.0) return 5;
  if (cumulativePercentile <= 77.0) return 6;
  if (cumulativePercentile <= 89.0) return 7;
  if (cumulativePercentile <= 96.0) return 8;
  return 9;
}

/**
 * 5등급제 등급 판정 (누적 백분위 기준)
 */
export function percentileToGrade5(cumulativePercentile: number): number {
  if (cumulativePercentile <= 10.0) return 1;
  if (cumulativePercentile <= 34.0) return 2;
  if (cumulativePercentile <= 66.0) return 3;
  if (cumulativePercentile <= 90.0) return 4;
  return 5;
}

/**
 * 과목명을 5대 핵심 교과 계열(국어, 수학, 영어, 사회, 과학)로 자동 분류
 */
export function getSubjectFamily(subjectName: string): SubjectFamilyType {
  const s = subjectName.trim();
  if (
    s.includes('국어') ||
    s.includes('문학') ||
    s.includes('독서') ||
    s.includes('화법') ||
    s.includes('작문') ||
    s.includes('언어') ||
    s.includes('매체')
  ) {
    return '국어 계열';
  }
  if (
    s.includes('수학') ||
    s.includes('대수') ||
    s.includes('미적') ||
    s.includes('확률') ||
    s.includes('통계') ||
    s.includes('기하')
  ) {
    return '수학 계열';
  }
  if (
    s.includes('영어') ||
    s.includes('독해') ||
    s.includes('회화') ||
    s.includes('영미')
  ) {
    return '영어 계열';
  }
  if (
    s.includes('사회') ||
    s.includes('역사') ||
    s.includes('한국사') ||
    s.includes('도덕') ||
    s.includes('윤리') ||
    s.includes('지리') ||
    s.includes('경제') ||
    s.includes('정치') ||
    s.includes('법')
  ) {
    return '사회 계열';
  }
  if (
    s.includes('과학') ||
    s.includes('물리') ||
    s.includes('화학') ||
    s.includes('생명') ||
    s.includes('지구') ||
    s.includes('실험') ||
    s.includes('탐구')
  ) {
    return '과학 계열';
  }
  return '국어 계열'; // fallback
}

/**
 * 교과 계열별 종합 분석 산출 (강점, 경쟁, 보완, 취약 4단계 진단)
 */
function buildSubjectFamilyAnalysis(
  items: Array<{
    family: SubjectFamilyType;
    subject: string;
    rawScore: number;
    grade5: number;
    grade9: number;
  }>
): SubjectFamilyAnalysis[] {
  const families: SubjectFamilyType[] = [
    '국어 계열',
    '수학 계열',
    '영어 계열',
    '사회 계열',
    '과학 계열'
  ];

  return families.map((family) => {
    const list = items.filter((x) => x.family === family);
    if (list.length === 0) {
      return {
        family,
        subjects: [],
        avgRawScore: 0,
        grade5: 0,
        grade9: 0,
        status: '경쟁',
        statusType: 'compete',
        strengthsOrWeaknesses: '입력된 과목 데이터 없음',
        advice: '해당 계열의 성적을 추가 입력하면 정밀 진단이 제공됩니다.'
      };
    }

    const uniqueSubjects = Array.from(new Set(list.map((x) => x.subject)));
    const avgRaw = Number(
      (list.reduce((acc, c) => acc + c.rawScore, 0) / list.length).toFixed(1)
    );
    const avgG5 = Number(
      (list.reduce((acc, c) => acc + c.grade5, 0) / list.length).toFixed(1)
    );
    const avgG9 = Number(
      (list.reduce((acc, c) => acc + c.grade9, 0) / list.length).toFixed(1)
    );

    let status: SubjectStatusTier = '경쟁';
    let statusType: SubjectStatusType = 'compete';
    let strengthsOrWeaknesses = '';
    let advice = '';

    if (avgG5 <= 1.4 || avgG9 <= 2.0 || avgRaw >= 93) {
      status = '강점';
      statusType = 'strength';
      strengthsOrWeaknesses = '전교 최상위권 경쟁력 확보 / 안정적 1~2등급 방어';
      advice =
        '최상위권 변별용 서술형 배점 및 고난도 킬러 문항에 집중하여 완벽한 만점을 목표로 하십시오.';
    } else if (avgG5 <= 2.2 || avgG9 <= 3.2 || avgRaw >= 86) {
      status = '경쟁';
      statusType = 'compete';
      strengthsOrWeaknesses = '상위권 접전 구간 / 상위 등급 도약 잠재력 충분';
      advice =
        '오답 빈출 단원의 심화 기출 유형 반복 훈련 및 시험 시간 배분 훈련을 통해 1등급 진입을 공략하세요.';
    } else if (avgG5 <= 3.2 || avgG9 <= 4.8 || avgRaw >= 78) {
      status = '보완';
      statusType = 'improve';
      strengthsOrWeaknesses = '경계선 등급군 / 전략적 클리닉이 필요한 요주의 과목';
      advice =
        '취약 단원의 핵심 기본 개념 복습과 감점 없는 주관식 답안 서술 연습이 필수적입니다.';
    } else {
      status = '취약';
      statusType = 'weak';
      strengthsOrWeaknesses = '내신 등급 하락 위험군 / 집중 보완이 가장 시급한 핵심 과목';
      advice =
        '기본 개념과 서술형 채점 기준표를 체계적으로 재정립하고, 방학 중 집중 학습 일정을 최우선 배치해야 합니다.';
    }

    return {
      family,
      subjects: uniqueSubjects,
      avgRawScore: avgRaw,
      grade5: avgG5,
      grade9: avgG9,
      status,
      statusType,
      strengthsOrWeaknesses,
      advice
    };
  });
}

/**
 * 중학생 내신 및 고교 진학 예측 계산
 */
export function calculateMiddleSchoolPrediction(
  profile: StudentProfile,
  grades: Record<Semester, GradeEntry[]>
): MiddleSchoolPrediction {
  const semesters: Semester[] = ['1-1', '1-2', '2-1', '2-2', '3-1', '3-2'];

  interface ValidMiddleItem {
    semester: Semester;
    subject: string;
    rawScore: number;
    average: number;
    distA: number;
    studentCount: number;
  }

  const validEntries: ValidMiddleItem[] = [];

  semesters.forEach((sem) => {
    const list = grades[sem] || [];
    list.forEach((item) => {
      if (['국어', '수학', '영어', '사회', '과학'].includes(item.subject)) {
        if (item.rawScore !== '' && item.rawScore !== null && !isNaN(Number(item.rawScore))) {
          const raw = Number(item.rawScore);
          const avg = item.average !== '' && !isNaN(Number(item.average)) ? Number(item.average) : 70;
          const a = item.distribution.A !== '' && !isNaN(Number(item.distribution.A)) ? Number(item.distribution.A) : 25;
          const count = item.studentCount !== '' && !isNaN(Number(item.studentCount)) ? Number(item.studentCount) : 220;

          validEntries.push({
            semester: sem,
            subject: item.subject,
            rawScore: raw,
            average: avg,
            distA: a,
            studentCount: count
          });
        }
      }
    });
  });

  const totalCount = validEntries.length;
  let avgRawScore = 90;
  let avgSchoolMean = 70;
  let avgAchievementA = 25;

  if (totalCount > 0) {
    avgRawScore = validEntries.reduce((acc, cur) => acc + cur.rawScore, 0) / totalCount;
    avgSchoolMean = validEntries.reduce((acc, cur) => acc + cur.average, 0) / totalCount;
    avgAchievementA = validEntries.reduce((acc, cur) => acc + cur.distA, 0) / totalCount;
  }

  // 성취도 A% 분포 기반 시험 난이도 및 내신 거품도 판정
  let difficultyLevel: '매우 쉬움 (물내신·성적 거품 우려)' | '적정 난이도 (표준 변별력)' | '어려움 (높은 변별력·실질 우수)';
  let difficultyDesc = '';
  let inflationCaution = '';
  let inflationPenalty = 0;

  if (avgAchievementA >= 38) {
    difficultyLevel = '매우 쉬움 (물내신·성적 거품 우려)';
    inflationPenalty = 10.0;
    difficultyDesc = `입력된 과목들의 평균 A등급(90점 이상) 비율이 ${avgAchievementA.toFixed(1)}%로 매우 높게 형성된 '쉬운 시험(물내신)' 환경입니다.`;
    inflationCaution = `중학교 성취평가제에서 90점 이상 A를 받았더라도, 학년 내 40% 안팎의 학생들이 함께 A를 획득한 상태입니다. 상대평가로 전환되는 고등학교 진학 시 1등급(5등급제 10%, 9등급제 4%) 경쟁에서 1~2등급 하락하는 '내신 거품 조정'이 발생할 위험이 큽니다.`;
  } else if (avgAchievementA <= 20) {
    difficultyLevel = '어려움 (높은 변별력·실질 우수)';
    inflationPenalty = -4.0;
    difficultyDesc = `입력된 과목들의 평균 A등급 비율이 ${avgAchievementA.toFixed(1)}%로 엄격하고 변별력이 매우 높은 시험 환경입니다.`;
    inflationCaution = `학교 시험의 난도가 높아 상위권 변별력이 매우 우수합니다. 본 환경에서 기록한 점수는 학생의 실질적인 학업 기초체력이 탄탄함을 의미하며, 고등학교 상대평가 체제에서도 상위 등급을 굳건히 수성할 가능성이 매우 높습니다.`;
  } else {
    difficultyLevel = '적정 난이도 (표준 변별력)';
    inflationPenalty = 0;
    difficultyDesc = `입력된 과목들의 평균 A등급 비율이 ${avgAchievementA.toFixed(1)}%로 표준적인 교육과정 변별력을 보여주고 있습니다.`;
    inflationCaution = `적정 난이도의 지필평가 환경으로, 학생의 현재 원점수가 비교적 정확한 학업 성취 수준을 반영하고 있습니다. 고교 진학 후 지필평가 킬러 문항 및 서술형 배점에 대한 적응력을 기르는 것이 중요합니다.`;
  }

  // 중학교 내신 종합 점수 기반 학생 기본 누적 백분위 추정
  let middleBasePercentile = 8.0;
  if (avgRawScore >= 98) middleBasePercentile = 2.0;
  else if (avgRawScore >= 95) middleBasePercentile = 5.0;
  else if (avgRawScore >= 92) middleBasePercentile = 9.0;
  else if (avgRawScore >= 88) middleBasePercentile = 16.0;
  else if (avgRawScore >= 84) middleBasePercentile = 25.0;
  else if (avgRawScore >= 80) middleBasePercentile = 35.0;
  else middleBasePercentile = 50.0;

  middleBasePercentile = Math.max(1.0, Math.min(85.0, middleBasePercentile + inflationPenalty * 0.5));

  // 고교 유형별 진학 분산율
  const estimatedGeneral = 68;
  const estimatedSpecialized = 14;
  const estimatedVocational = 18;
  const cohortExplanation = `중학교 졸업생 중 특성화고·실업계 진학군(약 ${estimatedVocational}%)이 제외되고 일반고(${estimatedGeneral}%) 및 자사·특목고(${estimatedSpecialized}%)로 재편되므로, 고등학교 진학 시 중학교 때보다 하위권 완충지대가 줄어들어 실질적인 상대평가 내신 경쟁 밀도가 약 1.25배 높아집니다.`;

  // 진학 희망 3개 고등학교별 예측
  const targetSchoolPredictions = profile.middleTargetHighSchools.map((target, idx) => {
    let competitionPenalty = 0;
    let schoolTypeComment = '';
    let regionalComment = '';
    let gradeCompComment = '';

    if (target.type === '자율형사립고(전국)' || target.type === '자율형사립고(광역)') {
      competitionPenalty += 14.0;
      schoolTypeComment = `전국/광역 단위 우수 지원자가 집중되는 자사고 특성상, 중학교 최상위 A등급 학생들도 3~4등급으로 밀려날 수 있는 치열한 경쟁 환경입니다.`;
    } else if (target.type === '특수목적고(과학고)' || target.type === '특수목적고(외고/국제고)') {
      competitionPenalty += 16.0;
      schoolTypeComment = `교과 우수자가 밀집된 특목고로, 일반고 대비 내신 등급 경쟁이 매우 치열하며 심화 전공 교과에 대한 고난도 서술형 지필평가가 출제됩니다.`;
    } else {
      competitionPenalty += 0;
      schoolTypeComment = `일반계 고등학교 표준 교육과정으로, 중학교 상위 성취도를 성실히 유지하면 충분히 상위 1~2등급 진입 및 수시 학생부 종합·교과전형 방어가 가능합니다.`;
    }

    if (target.region === '비평준화 우수고 지역') {
      if (target.nonStandardTier === '우수선발고(상위권 집중)') {
        competitionPenalty += 12.0;
        regionalComment = `비평준화 지역 내 최상위권 우수 선발 고교로, 관내 1~2등급권 학생들이 대거 유입되어 전교 석차 경쟁이 특목·자사고 수준으로 치열합니다.`;
      } else if (target.nonStandardTier === '하위권고(기초학력 중심)') {
        competitionPenalty -= 8.0;
        regionalComment = `비평준화 지역 내 상대적으로 학력 경쟁이 완만한 고교로, 학생의 현 학업 수준을 유지할 경우 최상위 1등급 선점 및 내신 확보에 매우 유리합니다.`;
      } else {
        competitionPenalty += 4.0;
        regionalComment = `비평준화 보통고 환경으로, 일반 평준화 지역과 유사하나 상위권과 중하위권 간의 학력 격차가 뚜렷하게 나타납니다.`;
      }
    } else if (
      target.region === '서울 강남·서초' ||
      target.region === '서울 양천·목동' ||
      target.region === '경기 분당·수지' ||
      target.region === '대구 수성·부산 해운대 등 교육특구'
    ) {
      competitionPenalty += 11.0;
      regionalComment = `전국 최고 수준의 교육특구 학군(${target.region})으로, 지필평가 난이도가 매우 높고 수능 킬러 문항급 내신 시험이 출제되어 상위 1등급 경쟁이 치열합니다.`;
    } else {
      competitionPenalty += 0;
      regionalComment = `표준 평준화 학군으로, 공교육 교육과정 범위 내 지필평가와 수행평가 만점 관리를 통해 안정적으로 최상위 등급을 선점할 수 있습니다.`;
    }

    if (difficultyLevel.includes('쉬움')) {
      gradeCompComment = `중학교 시험이 쉬웠기 때문에(A% 과밀), 고교 입학 직후 첫 중간고사에서 상대평가 1등급 컷 통과 시 예상보다 큰 체감 난이도 충격이 발생할 수 있습니다.`;
    } else if (difficultyLevel.includes('어려움')) {
      gradeCompComment = `중학교 때 이미 엄격하고 변별력 높은 지필평가를 경험하여, 고교 진학 후 상대평가 체제에서도 상위 1등급을 굳건히 수성할 경쟁력을 갖추고 있습니다.`;
    } else {
      gradeCompComment = `현재 중학교 성취 수준이 표준적이므로, 고교 입학 전 수학·영어의 선행 심화 완성도가 고교 1학년 첫 등급을 결정짓는 핵심 변수가 됩니다.`;
    }

    const finalPredictedPercentile = Math.max(
      0.8,
      Math.min(92.0, middleBasePercentile + competitionPenalty)
    );

    const grade5Est = percentileToGrade5(finalPredictedPercentile);
    const grade9Est = percentileToGrade9(finalPredictedPercentile);

    const totalStudents = 240;
    const estTopRank = Math.max(1, Math.round((finalPredictedPercentile / 100) * totalStudents));
    const estBottomRank = Math.max(estTopRank, Math.round(((finalPredictedPercentile + 2.5) / 100) * totalStudents));
    const rankRange = `전교 약 ${estTopRank}등 ~ ${estBottomRank}등 (총 ${totalStudents}명 기준)`;

    const defaultSubjects = ['국어', '수학', '영어', '사회', '과학'];
    const subjectPredictions = defaultSubjects.map((subj) => {
      const match = validEntries.find((e) => e.subject === subj);
      const subjRaw = match ? match.rawScore : avgRawScore;

      let subjPercentile = finalPredictedPercentile;
      if (subj === '수학' || subj === '과학') {
        if (subjRaw >= 95) subjPercentile = Math.max(0.8, finalPredictedPercentile * 0.85);
        else if (subjRaw < 85) subjPercentile = Math.min(90, finalPredictedPercentile * 1.25);
      }

      const g5 = percentileToGrade5(subjPercentile);
      const g9 = percentileToGrade9(subjPercentile);

      let status: '안정' | '경쟁' | '보완필요' = '안정';
      if (g5 >= 3 || g9 >= 4) status = '보완필요';
      else if (g5 === 2 || g9 >= 2) status = '경쟁';

      return {
        subject: subj,
        grade5: g5,
        grade9: g9,
        rawScoreEst: Math.round(subjRaw),
        status
      };
    });

    // 5대 교과 계열별 해당 목표 고교 맞춤 예측 진단 산출
    const defaultFamilies: Array<{ family: SubjectFamilyType; subjs: string[] }> = [
      { family: '국어 계열', subjs: ['국어'] },
      { family: '수학 계열', subjs: ['수학'] },
      { family: '영어 계열', subjs: ['영어'] },
      { family: '사회 계열', subjs: ['사회', '역사', '도덕'] },
      { family: '과학 계열', subjs: ['과학'] }
    ];

    const schoolFamilies: SubjectFamilyAnalysis[] = defaultFamilies.map(({ family, subjs }) => {
      const matched = validEntries.filter((e) => subjs.some((s) => e.subject.includes(s)));
      const raw = matched.length > 0
        ? matched.reduce((a, b) => a + b.rawScore, 0) / matched.length
        : avgRawScore;

      // 고교 유형별 계열 편차 반영
      let famPercentile = finalPredictedPercentile;
      if (family === '수학 계열' || family === '과학 계열') {
        if (target.type === '특수목적고(과학고)' || target.type === '자율형사립고(전국)') {
          famPercentile = Math.min(92, famPercentile + 7);
        }
        if (raw >= 95) famPercentile = Math.max(0.8, famPercentile * 0.85);
        else if (raw < 85) famPercentile = Math.min(90, famPercentile * 1.25);
      } else if (family === '국어 계열' || family === '영어 계열') {
        if (target.type === '특수목적고(외고/국제고)') {
          famPercentile = Math.min(92, famPercentile + 7);
        }
        if (raw >= 95) famPercentile = Math.max(0.8, famPercentile * 0.85);
        else if (raw < 85) famPercentile = Math.min(90, famPercentile * 1.25);
      }

      const g5 = percentileToGrade5(famPercentile);
      const g9 = percentileToGrade9(famPercentile);

      let status: SubjectStatusTier = '경쟁';
      let statusType: SubjectStatusType = 'compete';
      let strengthsOrWeaknesses = '';
      let advice = '';

      if (g5 <= 1 && g9 <= 2) {
        status = '강점';
        statusType = 'strength';
        strengthsOrWeaknesses = `${target.name || '해당 고교'} 입학 후 1등급 수성이 매우 유력한 최우수 강점 교과입니다.`;
        advice = '서술형 무감점 대비 및 변별력 킬러 문항 집중 훈련에 집중하십시오.';
      } else if (g5 <= 2 && g9 <= 3) {
        status = '경쟁';
        statusType = 'compete';
        strengthsOrWeaknesses = `${target.name || '해당 고교'} 상위 1~2등급권 진입을 다투는 치열한 접전 교과입니다.`;
        advice = '방학 중 심화 기출 유형을 완벽 분석하여 첫 중간고사 1등급 도약을 노리세요.';
      } else if (g5 <= 3 && g9 <= 5) {
        status = '보완';
        statusType = 'improve';
        strengthsOrWeaknesses = `${target.name || '해당 고교'} 진학 시 내신 감점 위험이 있는 요주의 경계 교과입니다.`;
        advice = '기출 킬러 유형 반복 훈련과 수행평가 감점 요인 점검이 선행되어야 합니다.';
      } else {
        status = '취약';
        statusType = 'weak';
        strengthsOrWeaknesses = `${target.name || '해당 고교'} 입학 시 상대평가 등급 하락폭이 클 수 있는 최우선 취약 교과입니다.`;
        advice = '방학 기간 기본 개념 총정리와 필수 핵심 유형 클리닉을 조기 완수해야 합니다.';
      }

      return {
        family,
        subjects: matched.length > 0 ? matched.map((m) => m.subject) : subjs,
        avgRawScore: Number(raw.toFixed(1)),
        grade5: g5,
        grade9: g9,
        status,
        statusType,
        strengthsOrWeaknesses,
        advice
      };
    });

    let strategySummary = '';
    if (grade5Est === 1 && grade9Est <= 2) {
      strategySummary = `고교 입학 후 1등급 수성이 매우 유력합니다. 수행평가 감점 0점 전략과 지필평가 킬러 문항(1~2문항) 공략 훈련에 집중하여 극상위권(전교 1~5등) 입지를 굳히십시오.`;
    } else if (grade5Est <= 2 && grade9Est <= 3) {
      strategySummary = `고교 입학 시 상위 2등급 내외의 치열한 접전권에 진입할 것으로 예상됩니다. 방학 기간 수학·과학의 심화 개념과 영어 어휘·구문 독해력을 선제적으로 끌어올려 입학 직후 첫 중간고사 1등급 도약을 노려야 합니다.`;
    } else {
      strategySummary = `중학교 성취도 A군에 비해 고등학교 진학 시 상대평가 등급 하락폭이 클 수 있습니다. 개념 학습을 문제풀이 적용력으로 전환하는 자기주도 학습 습관을 조기 형성해야 합니다.`;
    }

    return {
      school: target,
      predictedPercentile: Number(finalPredictedPercentile.toFixed(1)),
      predictedRankRange: rankRange,
      predictedGrade5Average: grade5Est,
      predictedGrade9Average: grade9Est,
      subjectFamilies: schoolFamilies,
      subjectPredictions,
      reasons: {
        schoolTypeFactor: schoolTypeComment,
        regionalFactor: regionalComment,
        gradeCompetitionFactor: gradeCompComment,
        strategySummary
      }
    };
  });

  // 5개 교과 계열별 종합 분석 (1지망 고교 기준 또는 전체 평균 기준)
  const firstSchoolSubjs =
    targetSchoolPredictions[0]?.subjectPredictions || [];
  const middleFamilyItems = firstSchoolSubjs.map((s) => ({
    family: getSubjectFamily(s.subject),
    subject: s.subject,
    rawScore: s.rawScoreEst,
    grade5: s.grade5,
    grade9: s.grade9
  }));
  const subjectFamilies = buildSubjectFamilyAnalysis(middleFamilyItems);

  return {
    examDifficultyAnalysis: {
      avgAchievementA: Number(avgAchievementA.toFixed(1)),
      difficultyLevel,
      description: difficultyDesc,
      inflationCaution
    },
    cohortDistribution: {
      generalHigh: estimatedGeneral,
      specializedHigh: estimatedSpecialized,
      vocational: estimatedVocational,
      explanation: cohortExplanation
    },
    targetSchoolPredictions,
    subjectFamilies
  };
}

/**
 * 고등학생 내신 등급 5등급제 통계, 9등급제 정밀 예측 및 수시 교과 합격률 분석
 * 
 * [5등급제 -> 9등급제 환산 메커니즘]
 * 1. 학생의 실제 원점수(X), 과목평균(M), A% 비율을 통해 Z-score 및 표준편차 추정
 * 2. 표준정규분포 상위 누적확률 Q(z) = P(Z >= z)를 정상 방향으로 계산 (상위 백분위 산출)
 * 3. 성취도 A~E 등급 구간별 히스토그램 내 학생 위치 추정
 * 4. 학생이 입력한 5등급제 등급(1등급: 상위 10%, 2등급: 10~34% 등)의 엄격한 경계 제약을 반영
 * 5. 수강자 수(N)를 결합하여 실제 전교 석차 및 백분위를 도출하고 이를 9등급제(1등급: 4%, 2등급: 11%, 3등급: 23% 등)로 정확히 환산
 */
export function calculateHighSchoolPrediction(
  profile: StudentProfile,
  grades: Record<Semester, GradeEntry[]>
): HighSchoolPrediction {
  const semesters: Semester[] = ['1-1', '1-2', '2-1', '2-2', '3-1', '3-2'];

  interface ValidHighItem {
    semester: Semester;
    subject: string;
    rawScore: number;
    grade5: number;
    average: number;
    distA: number;
    distB: number;
    distC: number;
    distD: number;
    distE: number;
    studentCount: number;
    isCareerSubject: boolean;
  }

  const validEntries: ValidHighItem[] = [];

  semesters.forEach((sem) => {
    const list = grades[sem] || [];
    list.forEach((item) => {
      if (item.rawScore !== '' && item.rawScore !== null && !isNaN(Number(item.rawScore))) {
        const raw = Number(item.rawScore);
        const g5 = item.grade5 !== '' && !isNaN(Number(item.grade5)) ? Number(item.grade5) : 2;
        const avg = item.average !== '' && !isNaN(Number(item.average)) ? Number(item.average) : 68;
        const a = item.distribution.A !== '' && !isNaN(Number(item.distribution.A)) ? Number(item.distribution.A) : 20;
        const b = item.distribution.B !== '' && !isNaN(Number(item.distribution.B)) ? Number(item.distribution.B) : 25;
        const c = item.distribution.C !== '' && !isNaN(Number(item.distribution.C)) ? Number(item.distribution.C) : 25;
        const d = item.distribution.D !== '' && !isNaN(Number(item.distribution.D)) ? Number(item.distribution.D) : 15;
        const e = item.distribution.E !== '' && !isNaN(Number(item.distribution.E)) ? Number(item.distribution.E) : 15;
        const count = item.studentCount !== '' && !isNaN(Number(item.studentCount)) ? Number(item.studentCount) : 210;

        validEntries.push({
          semester: sem,
          subject: item.subject,
          rawScore: raw,
          grade5: g5,
          average: avg,
          distA: a,
          distB: b,
          distC: c,
          distD: d,
          distE: e,
          studentCount: count,
          isCareerSubject: !!item.isCareerSubject
        });
      }
    });
  });

  const totalCount = validEntries.length;
  let allG5Sum = 0;
  let careerG5Sum = 0;
  let careerCount = 0;

  const subjectPredictions = validEntries.map((item) => {
    allG5Sum += item.grade5;
    if (item.isCareerSubject) {
      careerG5Sum += item.grade5;
      careerCount++;
    }

    // 1. 표준편차 및 Z-score 계산
    const sigma = estimateStdDev(item.average, item.distA);
    const zScore = (item.rawScore - item.average) / sigma;

    // 2. 정규분포 상위 누적확률 (0.0 ~ 1.0)
    const upperProb = normalUpperTail(zScore);
    const normalPercentile = upperProb * 100; // 예: z=1.75 -> 4.0%

    // 3. 성취도 구간 히스토그램 기반 백분위 추정
    let histPercentile = 20.0;
    if (item.rawScore >= 90) {
      const topFraction = Math.max(0.02, (100 - item.rawScore) / 10);
      histPercentile = Math.max(0.1, topFraction * item.distA);
    } else if (item.rawScore >= 80) {
      const bFraction = (90 - item.rawScore) / 10;
      histPercentile = item.distA + bFraction * Math.max(10, item.distB);
    } else if (item.rawScore >= 70) {
      const cFraction = (80 - item.rawScore) / 10;
      histPercentile = item.distA + item.distB + cFraction * Math.max(10, item.distC);
    } else if (item.rawScore >= 60) {
      const dFraction = (70 - item.rawScore) / 10;
      histPercentile = item.distA + item.distB + item.distC + dFraction * Math.max(10, item.distD);
    } else {
      const eFraction = Math.max(0.1, (60 - item.rawScore) / 60);
      histPercentile = 100 - (1 - eFraction) * Math.max(10, item.distE);
    }

    // 4. 모델 통합 (정규분포 50% + 성취도 히스토그램 50%)
    let rawPercentile = 0.5 * normalPercentile + 0.5 * histPercentile;

    // 5. 5등급제 입력 등급에 따른 엄격한 백분위 보정
    // 5등급제: 1등급(상위 10%), 2등급(10~34%), 3등급(34~66%), 4등급(66~90%), 5등급(90~100%)
    let finalPercentile = rawPercentile;
    if (item.grade5 === 1) {
      finalPercentile = Math.max(0.1, Math.min(9.9, rawPercentile));
    } else if (item.grade5 === 2) {
      finalPercentile = Math.max(10.1, Math.min(33.9, rawPercentile));
    } else if (item.grade5 === 3) {
      finalPercentile = Math.max(34.1, Math.min(65.9, rawPercentile));
    } else if (item.grade5 === 4) {
      finalPercentile = Math.max(66.1, Math.min(89.9, rawPercentile));
    } else if (item.grade5 === 5) {
      finalPercentile = Math.max(90.1, Math.min(99.9, rawPercentile));
    }

    // 6. 9등급제 환산 판정
    const predictedGrade9 = percentileToGrade9(finalPercentile);

    // 7. 전교 추정 석차 계산 (수강자수 반영)
    const n = item.studentCount > 0 ? item.studentCount : 210;
    const estRank = Math.max(1, Math.round((finalPercentile / 100) * n));

    return {
      semester: item.semester,
      subject: item.subject,
      rawScore: item.rawScore,
      average: item.average,
      distA: item.distA,
      studentCount: n,
      grade5: item.grade5,
      predictedGrade9,
      zScore: Number(zScore.toFixed(2)),
      estimatedPercentile: Number(finalPercentile.toFixed(1)),
      estimatedRank: estRank,
      isCareer: item.isCareerSubject
    };
  });

  const allSubjectsAvg5 = totalCount > 0 ? allG5Sum / totalCount : 2.0;
  const careerSubjectsAvg5 = careerCount > 0 ? careerG5Sum / careerCount : allSubjectsAvg5;

  let allG9Sum = 0;
  let careerG9Sum = 0;

  subjectPredictions.forEach((p) => {
    allG9Sum += p.predictedGrade9;
    if (p.isCareer) {
      careerG9Sum += p.predictedGrade9;
    }
  });

  const allSubjectsPredictedAvg9 = totalCount > 0 ? allG9Sum / totalCount : 2.3;
  const careerSubjectsPredictedAvg9 = careerCount > 0 ? careerG9Sum / careerCount : allSubjectsPredictedAvg9;

  // 5개 교과 계열별 종합 분석
  const highFamilyItems = subjectPredictions.map((s) => ({
    family: getSubjectFamily(s.subject),
    subject: s.subject,
    rawScore: s.rawScore,
    grade5: s.grade5,
    grade9: s.predictedGrade9
  }));
  const subjectFamilies = buildSubjectFamilyAnalysis(highFamilyItems);

  // 3개 지망 대학교/학과 수시 학생부교과전형 합격률 산출
  const universityAdmissions = profile.highTargetUniversities.map((target) => {
    const cut24 = target.cut2024 !== '' ? Number(target.cut2024) : 1.35;
    const cut25 = target.cut2025 !== '' ? Number(target.cut2025) : 1.32;
    const cutAvg = Number(((cut24 + cut25) / 2).toFixed(2));
    const studentGrade = Number(allSubjectsPredictedAvg9.toFixed(2));
    const gradeDiff = Number((cutAvg - studentGrade).toFixed(2)); // 양수면 학생이 컷보다 좋은 성적

    let passProbability = 50;
    let verdict: '안정' | '적정' | '소신' | '불안' | '위험' = '적정';
    let verdictColor = '#4f46e5';
    let analysisComment = '';
    let strategicAdvice = '';

    if (gradeDiff >= 0.35) {
      passProbability = 95;
      verdict = '안정';
      verdictColor = '#059669';
      analysisComment = `학생의 9등급제 예측 내신(${studentGrade}등급)이 대학 2개년 평균 컷(${cutAvg}등급)보다 무려 ${gradeDiff}등급 상회합니다. 최근 2개년 동안 최저점 지원자도 무난히 합격한 확실한 안정권입니다.`;
      strategicAdvice = `수시 6장 카드 중 1~2장을 확실한 합격 안전판으로 확보하고, 상위권 대학에 적극적으로 상향 및 소신 지원하는 공격적인 입시 전략이 권장됩니다.`;
    } else if (gradeDiff >= 0.1) {
      passProbability = 82;
      verdict = '적정';
      verdictColor = '#10b981';
      analysisComment = `학생 예측 내신(${studentGrade}등급)이 2개년 평균 컷(${cutAvg}등급)보다 ${gradeDiff}등급 앞서 있어 합격 가능성이 매우 높습니다. 2024년(${cut24})과 2025년(${cut25}) 합격선 모두를 안정적으로 충족합니다.`;
      strategicAdvice = `학생부교과전형 지원 시 가장 이상적인 적정 카드입니다. 수능 최저학력기준(${target.minSatRequirement || '대학 지정 수능최저'}) 충족 여부를 최종 점검하여 확실한 합격을 굳히십시오.`;
    } else if (gradeDiff >= -0.15) {
      passProbability = 60;
      verdict = '소신';
      verdictColor = '#f59e0b';
      analysisComment = `학생 예측 내신(${studentGrade}등급)과 2개년 평균 컷(${cutAvg}등급)이 거의 일치(격차 ${gradeDiff}등급)하는 전형적인 경쟁 접전 구간입니다. 당해 연도 경쟁률과 지원자 분포에 따라 최종 합격이 결정됩니다.`;
      strategicAdvice = `경쟁률 추이와 충원율(추가합격 예비번호 순환율)을 면밀히 분석해야 합니다. 동일 대학의 학생부종합전형(학종)과 병행 지원하거나, 전공 관련 진로선택과목 성취도 평가 가산점을 적극 활용하세요.`;
    } else if (gradeDiff >= -0.4) {
      passProbability = 35;
      verdict = '불안';
      verdictColor = '#f97316';
      analysisComment = `학생 예측 내신(${studentGrade}등급)이 2개년 평균 컷(${cutAvg}등급)보다 ${Math.abs(gradeDiff)}등급 부족합니다. 최초 합격은 어려우며 추가합격 예비번호 후순위를 기대해야 하는 불안권입니다.`;
      strategicAdvice = `교과전형 단독 지원은 리스크가 큽니다. 수능최저 충족 비율이 낮아 실질 경쟁률이 크게 떨어지는 학과를 선택하거나, 세특을 살린 학생부종합전형으로 우회하는 전략을 병행하십시오.`;
    } else {
      passProbability = 15;
      verdict = '위험';
      verdictColor = '#e11d48';
      analysisComment = `학생 예측 내신(${studentGrade}등급)이 2개년 평균 컷(${cutAvg}등급)과 ${Math.abs(gradeDiff)}등급 이상의 큰 격차를 보입니다. 최근 2개년 입결 추이를 보았을 때 교과전형 합격 가능성이 매우 희박합니다.`;
      strategicAdvice = `해당 대학·학과를 반드시 진학하고자 할 경우, 교과 100% 전형보다는 학생의 심화 탐구 활동이 반영되는 학생부종합전형 또는 정시 수능 전형으로 목표 트랙을 재설정하는 것이 바람직합니다.`;
    }

    // 지망 대학 및 학과 맞춤 5대 교과 계열별 예측 진단
    const defaultFamilies: SubjectFamilyType[] = [
      '국어 계열',
      '수학 계열',
      '영어 계열',
      '사회 계열',
      '과학 계열'
    ];

    const univFamilies: SubjectFamilyAnalysis[] = defaultFamilies.map((family) => {
      const matched = subjectPredictions.filter((p) => getSubjectFamily(p.subject) === family);
      const raw = matched.length > 0
        ? matched.reduce((a, b) => a + b.rawScore, 0) / matched.length
        : 80;
      const g5 = matched.length > 0
        ? Number((matched.reduce((a, b) => a + b.grade5, 0) / matched.length).toFixed(1))
        : 2.5;
      const g9 = matched.length > 0
        ? Number((matched.reduce((a, b) => a + b.predictedGrade9, 0) / matched.length).toFixed(1))
        : 3.0;

      // 대학 컷 대비 차이 (diff > 0: 학생 등급이 컷보다 우수)
      const diff = Number((cutAvg - g9).toFixed(2));

      let status: SubjectStatusTier = '경쟁';
      let statusType: SubjectStatusType = 'compete';
      let strengthsOrWeaknesses = '';
      let advice = '';

      if (diff >= 0.25 || g9 <= 1.5) {
        status = '강점';
        statusType = 'strength';
        strengthsOrWeaknesses = `${target.university || '해당 대학'} ${target.department || '목표 학과'} 2개년 평균 컷(${cutAvg}등급)을 여유있게 상회하는 최우수 강점 교과군입니다.`;
        advice = '수시 학생부 교과 및 종합 전형에서 강력한 가산 평가와 합격 우위를 이끌어낼 수 있습니다.';
      } else if (diff >= -0.10) {
        status = '경쟁';
        statusType = 'compete';
        strengthsOrWeaknesses = `${target.university || '해당 대학'} ${target.department || '목표 학과'} 합격선에 직결되는 치열한 접전 교과군입니다.`;
        advice = '0.1~0.2등급 추가 상승 시 안정 합격권으로 직행할 수 있으므로 방학 중 기출 오답 관리가 필수적입니다.';
      } else if (diff >= -0.45) {
        status = '보완';
        statusType = 'improve';
        strengthsOrWeaknesses = `${target.university || '해당 대학'} 컷 대비 다소 부족하여 다음 학기 반드시 등급 방어가 필요한 경계 교과군입니다.`;
        advice = '수능 최저학력기준 충족 또는 취약 단원 집중 클리닉을 통해 감점 요인을 차단해야 합니다.';
      } else {
        status = '취약';
        statusType = 'weak';
        strengthsOrWeaknesses = `${target.university || '해당 대학'} 컷 대비 열위 구간에 위치하여 내신 환산 시 감점이 발생하는 취약 교과군입니다.`;
        advice = '기초 개념 재정립과 함께 교과 100% 전형보다는 학생부종합전형 우회 또는 수능 정시 트랙을 병행 검토하세요.';
      }

      return {
        family,
        subjects: matched.map((m) => m.subject),
        avgRawScore: Number(raw.toFixed(1)),
        grade5: g5,
        grade9: g9,
        status,
        statusType,
        strengthsOrWeaknesses,
        advice
      };
    });

    return {
      target,
      studentPredictedGrade: studentGrade,
      cut2024: cut24,
      cut2025: cut25,
      cutAvg,
      gradeDifference: gradeDiff,
      passProbability,
      verdict,
      verdictColor,
      subjectFamilies: univFamilies,
      analysisComment,
      strategicAdvice
    };
  });

  return {
    subjectFamilies,
    grade5Stats: {
      allSubjectsAverage: Number(allSubjectsAvg5.toFixed(2)),
      careerSubjectsAverage: Number(careerSubjectsAvg5.toFixed(2)),
      totalSubjectsCount: totalCount,
      careerSubjectsCount: careerCount
    },
    grade9Stats: {
      allSubjectsPredictedAverage: Number(allSubjectsPredictedAvg9.toFixed(2)),
      careerSubjectsPredictedAverage: Number(careerSubjectsPredictedAvg9.toFixed(2)),
      subjectPredictions
    },
    universityAdmissions
  };
}
