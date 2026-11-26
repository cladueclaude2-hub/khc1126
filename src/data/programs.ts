import type {
  AgeCode,
  CategoryCode,
  EvalContext,
  HealthService,
  ResidencyCode,
  SurveyAnswers,
} from '../types/program';

export const TEL = '042-840-3507';
export const VAC = '042-840-3557';
export const DEM = '042-840-3681~3682';

export const OPERATING_HOURS =
  '운영시간 평일 09:00~18:00 (의과 진료 09:00~16:00, 점심 12:00~13:00, 주말·공휴일 휴무)';

export const SERVICE_NOTE = '금액, 신청 방법, 필요 서류는 담당 팀에 문의해 주세요.';

export const RESIDENCY_SHORT_NOTE =
  '1년 이상 거주 조건이 있는 서비스는 1년이 지나면 확인할 수 있어요.';

export const FOOTER_DISCLAIMER = '참고용 안내입니다. 정확한 내용은 보건소에 문의해 주세요';

export interface OptionItem<T extends string> {
  code: T;
  label: string;
  hint?: string;
}

export const AGE_OPTIONS: OptionItem<AgeCode>[] = [
  { code: 'u18', label: '18세 미만', hint: '0~17세' },
  { code: 'y', label: '18~20세' },
  { code: 'a', label: '21~64세' },
  { code: 's65', label: '65~69세' },
  { code: 's70', label: '70세 이상' },
];

export const RESIDENCY_OPTIONS: OptionItem<ResidencyCode>[] = [
  {
    code: 'y1',
    label: '계룡시 주민등록, 1년 이상 거주',
    hint: '백내장·예방접종 지원 등 확인에 필요해요',
  },
  { code: 'y0', label: '계룡시 주민등록, 1년 미만 거주' },
  { code: 'no', label: '계룡시 거주자가 아님' },
];

export const CATEGORY_OPTIONS: OptionItem<CategoryCode>[] = [
  { code: 'med', label: '의료급여 수급자' },
  { code: 'vet', label: '국가유공자·유족' },
  { code: 'dis', label: '등록장애인' },
  { code: 'bas', label: '기초생활수급자' },
  { code: 'none', label: '해당 없음' },
];

export const SERVICES: HealthService[] = [
  {
    id: 'svc-1',
    title: '보건소 진료비 면제',
    target: '계룡시 거주 + 65세 이상, 의료급여 수급자, 국가유공자·유족, 등록장애인',
    description: '진료비 면제.',
    warning: '수수료는 면제가 아니며 일반 기준이 적용됩니다.',
    telLabel: '보건소',
    telNumber: TEL,
    match: (s) => s.res && (s.old || !!s.c.med || !!s.c.vet || !!s.c.dis),
  },
  {
    id: 'svc-2',
    title: '약제비 본인부담금 70% 감경',
    target: '계룡시 거주 65세 이상, 계룡시 소재 약국 이용 시',
    description: '약제비 본인부담금 70% 감경',
    telLabel: '보건소',
    telNumber: TEL,
    match: (s) => s.res && s.old,
  },
  {
    id: 'svc-3',
    title: '백내장 수술비 등 의료비 지원',
    target: '계룡시 1년 이상 거주 65세 이상, 안과 전문의 백내장 진단, 수술일 1년 이내 신청',
    description: '사전검사·수술·사후관리 비용 지원',
    telLabel: '보건소',
    telNumber: TEL,
    match: (s) => s.y1 && s.old,
  },
  {
    id: 'svc-4',
    title: '대상포진 예방접종 지원',
    target: '계룡시 1년 이상 거주 70세 이상',
    description: '대상포진 예방접종 비용 지원',
    telLabel: '예방접종실',
    telNumber: VAC,
    match: (s) => s.y1 && s.age === 's70',
  },
  {
    id: 'svc-5',
    title: 'HPV 예방접종 지원',
    target: '계룡시 1년 이상 거주 18~20세',
    description: '사람유두종바이러스 예방접종 비용 지원',
    telLabel: '예방접종실',
    telNumber: VAC,
    match: (s) => s.y1 && s.age === 'y',
  },
  {
    id: 'svc-6',
    title: '인플루엔자 무료 예방접종',
    target: '국가예방접종 대상에서 제외된 기초생활수급자·등록장애인·국가유공자 등',
    description: '인플루엔자 무료 접종',
    telLabel: '예방접종실',
    telNumber: VAC,
    match: (s) => s.res && (!!s.c.bas || !!s.c.dis || !!s.c.vet),
  },
  {
    id: 'svc-7',
    title: '치매 조기검진·치매안심센터',
    target: '계룡시민',
    description: '치매 검진, 등록·관리, 방문 서비스',
    telLabel: '치매안심센터',
    telNumber: DEM,
    match: (s) => s.res,
  },
  {
    id: 'svc-8',
    title: '정신건강 상담·재활',
    target: '계룡시민',
    description:
      '정신질환자 치료비·투약비 지원(약제비 월 3만원 이내 등), 심리상담 바우처(8회), 아동·청소년 치료비(1인 최대 50만원), 정신건강복지센터 상담·재활',
    telLabel: '정신건강증진사업',
    telNumber: '042-840-3573~7',
    match: (s) => s.res,
  },
  {
    id: 'svc-9',
    title: '폐의약품 안심 배출',
    target: '계룡시민 전체',
    description: '약국·보건소·보건지소 수거함 이용',
    telLabel: '보건소',
    telNumber: TEL,
    match: (s) => s.res,
  },
  {
    id: 'svc-10',
    title: '보건지소 이용',
    target: '계룡시민 전체',
    description: '엄사면·신도안면 보건지소 이용 (예방접종은 금암동 보건소에서만 가능)',
    telLabel: '보건소',
    telNumber: TEL,
    match: (s) => s.res,
  },
  {
    id: 'svc-11',
    title: '골밀도(골다공증) 검사',
    target: '계룡시민(주민등록 기준)',
    description: '검사비 65세 이상 7,000원 · 65세 미만 43,270원. 준비물: 신분증',
    telLabel: '방사선실',
    telNumber: '042-840-3565',
    match: (s) => s.res,
  },
  {
    id: 'svc-12',
    title: '금연클리닉',
    target: '흡연자(성인·청소년), 만 14세 미만은 법정대리인 동의 필요',
    description:
      '6개월간 9회 이상 상담, 니코틴 보조용품(패치·껌 등) 제공. 평일 09:00~18:00, 보건소 1층 금연상담실',
    telLabel: '금연상담실',
    telNumber: '042-840-3536',
    match: (s) => s.res,
  },
  {
    id: 'svc-13',
    title: '고혈압·당뇨 교실 / 합병증 검진비 지원',
    target: '30세 이상 고혈압·당뇨 환자 및 전단계 (검진비는 보건소 등록 환자, 3~11월)',
    description:
      '혈압·혈당 측정, 건강상담, 질환·식이 교육. 합병증 검진(경동맥초음파·미세단백뇨·당화혈색소)비 지원',
    telLabel: '문의',
    telNumber: '042-840-3538',
    match: (s) => s.res && (s.age === 'a' || s.old),
  },
  {
    id: 'svc-14',
    title: '모바일 헬스케어',
    target:
      '19~64세 계룡시민 중 혈압·혈당·허리둘레·중성지방·HDL 이상 1개 이상 (고혈압·당뇨·이상지질혈증 환자 제외)',
    description:
      '스마트워치와 채움건강앱으로 6개월 건강관리, 보건소 3회 방문(혈액검사·신체계측). 스마트폰 필요',
    telLabel: '보건소',
    telNumber: TEL,
    match: (s) => s.res && (s.age === 'a' || s.age === 'y'),
  },
  {
    id: 'svc-15',
    title: '암환자 의료비 지원',
    target: '소아암(만 18세 미만 전체 암환자), 성인 5대암·폐암 환자 중 소득·재산 기준 충족자',
    description:
      '소아암 검사·치료비(백혈병 최대 3,000만원, 기타암 2,000만원), 성인암 연 최대 200~300만원(최대 3년)',
    telLabel: '의약팀',
    telNumber: '042-840-3542',
    match: (s) => s.res,
  },
  {
    id: 'svc-16',
    title: '희귀난치성질환자 의료비 지원',
    target:
      '산정특례 등록 희귀난치성질환자 중 소득·재산 기준 충족자 (의료급여 수급자 등은 간병비·특수식이만 신청 가능)',
    description:
      '본인부담금 지원, 보조기기·호흡보조기, 간병비 월 30만원(97개 질환), 특수식이 구입비. 신청서는 보건소에 비치',
    telLabel: '의약팀',
    telNumber: '042-840-3542',
    match: (s) => s.res,
  },
  {
    id: 'svc-17',
    title: '국가암검진 · 성인병 검진',
    target: '암종별 연령 기준이 달라요 (위암 40세 이상, 대장암 50세 이상, 자궁경부암 20세 이상 여성 등)',
    description:
      '국가암검진은 지정 검진기관에서 받아요. 읍·면 거주 40세 이상 성인병 검진, 50세 이상 남성 전립선암 검진도 있어요',
    telLabel: '의약팀',
    telNumber: '042-840-3542',
    match: (s) => s.res && (s.age === 'a' || s.old),
  },
  {
    id: 'svc-18',
    title: '모자보건사업',
    target: '임산부·영유아 가정 (사업별 대상이 달라요)',
    description:
      '신생아 청각선별검사, 영양플러스, 선천성 대사이상 검사, 미숙아·선천성이상아 의료비, 산모·신생아 건강관리, 난임부부 시술비, 난임 한방치료, 출산장려금, 임신사전건강관리, 산전관리, 저소득층 기저귀·조제분유, 고위험임산부 의료비, 충남다사랑카드, 첫만남 이용권',
    telLabel: '보건소',
    telNumber: TEL,
    match: (s) => s.res && (s.age === 'y' || s.age === 'a'),
  },
  {
    id: 'svc-19',
    title: '임상병리 검사 비용 안내',
    target: '누구나',
    description:
      '콜레스테롤 21,960원 · 당화혈색소 8,070원 · 공복혈당 1,610원 · 빈혈 7,700원 · 간기능 8,740원 · 신장기능 3,890원 · B형간염 7,560원 · 매독 1,900원 · 혈액형 6,660원 · 소변(10종) 2,380원 · 에이즈(HIV) 무료',
    telLabel: '보건소',
    telNumber: TEL,
    match: () => true,
  },
  {
    id: 'svc-20',
    title: '제증명 발급 비용',
    target: '누구나',
    description:
      '건강진단결과서(보건증) 3,000원(5일) · 채용신체검사서 32,070원(B형간염 포함 39,630원) · 일반건강진단서 27,000원(B형간염 포함 34,560원) · 운전면허·중기 신체검사서 6,000원(즉시). 신분증을 가져오세요. 본인 확인에 건강보험증은 쓸 수 없고, 공무원 채용 신체검사는 하지 않아요.',
    telLabel: '보건소',
    telNumber: TEL,
    match: () => true,
  },
];

export function matchServices(answers: SurveyAnswers): HealthService[] {
  const ctx: EvalContext = {
    age: answers.age,
    res: answers.residency !== 'no',
    y1: answers.residency === 'y1',
    old: answers.age === 's65' || answers.age === 's70',
    c: answers.categories,
  };

  return SERVICES.filter((service) => service.match(ctx));
}

export function formatTelHref(telNumber: string): string {
  return `tel:${telNumber.split('~')[0].replace(/-/g, '')}`;
}
