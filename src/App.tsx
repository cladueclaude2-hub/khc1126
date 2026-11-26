import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  HeartHandshake,
  Phone,
  RotateCcw,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { SurveyProgressBar, type ProgressStep } from './components/SurveyProgressBar';
import {
  AGE_OPTIONS,
  CATEGORY_OPTIONS,
  FOOTER_DISCLAIMER,
  OPERATING_HOURS,
  RESIDENCY_OPTIONS,
  RESIDENCY_SHORT_NOTE,
  SERVICE_NOTE,
  TEL,
  formatTelHref,
  matchServices,
} from './data/programs';
import type { AgeCode, CategoryCode, ResidencyCode, SurveyAnswers } from './types/program';

const SURVEY_STEPS: ProgressStep[] = [
  { stepNumber: 1, label: '나이대' },
  { stepNumber: 2, label: '거주' },
  { stepNumber: 3, label: '해당 분류' },
];

type ViewPhase = 'survey' | 'results';

export default function App() {
  const [phase, setPhase] = useState<ViewPhase>('survey');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [answers, setAnswers] = useState<SurveyAnswers>({
    age: null,
    residency: null,
    categories: {},
  });
  const [imgFailed, setImgFailed] = useState(false);

  const advanceTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (advanceTimerRef.current !== null) {
        window.clearTimeout(advanceTimerRef.current);
      }
    };
  }, []);

  const clearPendingAdvance = () => {
    if (advanceTimerRef.current !== null) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
  };

  const matchedServices = useMemo(() => matchServices(answers), [answers]);

  const selectedAgeLabel = useMemo(
    () => AGE_OPTIONS.find((item) => item.code === answers.age)?.label ?? null,
    [answers.age],
  );

  const selectedResidencyLabel = useMemo(
    () => RESIDENCY_OPTIONS.find((item) => item.code === answers.residency)?.label ?? null,
    [answers.residency],
  );

  const selectedCategoryLabels = useMemo(
    () =>
      CATEGORY_OPTIONS.filter((item) => answers.categories[item.code]).map((item) => item.label),
    [answers.categories],
  );

  const hasCategorySelection = useMemo(
    () => Object.values(answers.categories).some(Boolean),
    [answers.categories],
  );

  const handleRestart = () => {
    clearPendingAdvance();
    setAnswers({ age: null, residency: null, categories: {} });
    setDirection(-1);
    setCurrentStep(1);
    setPhase('survey');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    clearPendingAdvance();
    if (phase === 'results') {
      setDirection(-1);
      setPhase('survey');
      setCurrentStep(3);
      return;
    }
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    clearPendingAdvance();
    if (currentStep === 1 && answers.age) {
      setDirection(1);
      setCurrentStep(2);
    } else if (currentStep === 2 && answers.residency) {
      setDirection(1);
      setCurrentStep(3);
    } else if (currentStep === 3 && hasCategorySelection) {
      setDirection(1);
      setPhase('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scheduleAutoAdvance = (nextAction: () => void) => {
    clearPendingAdvance();
    advanceTimerRef.current = window.setTimeout(() => {
      nextAction();
    }, 220);
  };

  const handleSelectAge = (code: AgeCode) => {
    setAnswers((prev) => ({ ...prev, age: code }));
    scheduleAutoAdvance(() => {
      setDirection(1);
      setCurrentStep(2);
    });
  };

  const handleSelectResidency = (code: ResidencyCode) => {
    setAnswers((prev) => ({ ...prev, residency: code }));
    scheduleAutoAdvance(() => {
      setDirection(1);
      setCurrentStep(3);
    });
  };

  const handleToggleCategory = (code: CategoryCode) => {
    setAnswers((prev) => {
      if (code === 'none') {
        const nextNone = !prev.categories.none;
        return {
          ...prev,
          categories: nextNone ? { none: true } : {},
        };
      }

      const nextCategories = { ...prev.categories };
      delete nextCategories.none;
      nextCategories[code] = !nextCategories[code];
      return {
        ...prev,
        categories: nextCategories,
      };
    });
  };

  const canProceedCurrentStep =
    (currentStep === 1 && answers.age !== null) ||
    (currentStep === 2 && answers.residency !== null) ||
    (currentStep === 3 && hasCategorySelection);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7FAF9] text-[#142220]">
      <header className="sticky top-0 z-30 h-14 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
          <button
            type="button"
            onClick={handleRestart}
            className="text-base sm:text-lg font-bold tracking-tight text-[#142220] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 rounded-md"
          >
            계룡시 보건소
          </button>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleRestart}
              className="min-h-[40px] inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#142220] transition-colors whitespace-nowrap shrink-0"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>처음으로</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10 lg:items-start">
          {/* Left / Top Context Column */}
          <section className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="flex items-center gap-2 text-teal-800 mb-2.5">
              <HeartHandshake className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span className="text-sm font-semibold">계룡시 보건소 맞춤 서비스 안내</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#142220] leading-snug text-balance">
              나에게 맞는 보건소 서비스 찾기
            </h1>

            <p className="mt-2.5 text-sm sm:text-base text-slate-600 leading-relaxed">
              3가지 질문에 답하면 받을 수 있는 서비스를 알려드려요. 개인정보는 저장하지 않습니다.
            </p>

            {/* Gyeryong City Health Center Photo */}
            <figure className="mt-4 overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
              {!imgFailed ? (
                <img
                  src="/assets/aistudio/_____2026-11-26_140316_694a3673.png"
                  alt="계룡시 보건소 전경"
                  referrerPolicy="no-referrer"
                  onError={() => setImgFailed(true)}
                  className="h-44 sm:h-52 w-full object-cover object-center block"
                />
              ) : (
                <div className="h-44 sm:h-52 w-full bg-gradient-to-br from-teal-50 to-slate-100 flex flex-col items-center justify-center gap-2 text-teal-800">
                  <HeartHandshake className="h-8 w-8" aria-hidden="true" />
                  <span className="text-sm font-semibold">계룡시 보건소</span>
                </div>
              )}
            </figure>

            {/* Operating Hours Card */}
            <div className="mt-4 rounded-2xl border border-teal-800/15 bg-teal-50/70 px-4 py-3 text-xs sm:text-sm text-teal-950 leading-relaxed flex items-start gap-2.5">
              <Clock className="h-4 w-4 shrink-0 text-teal-800 mt-0.5" aria-hidden="true" />
              <span>{OPERATING_HOURS}</span>
            </div>

            {/* Selected Summary while in Survey */}
            {phase === 'survey' &&
              (selectedAgeLabel || selectedResidencyLabel || selectedCategoryLabels.length > 0) && (
                <div className="mt-4 rounded-2xl border border-slate-200/90 bg-white p-4">
                  <div className="text-xs font-semibold text-slate-500 mb-1.5">선택한 내용</div>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-[#142220]">
                    <span>{selectedAgeLabel ?? '나이대 미선택'}</span>
                    <span aria-hidden="true" className="text-slate-300">
                      ·
                    </span>
                    <span>{selectedResidencyLabel ?? '거주 미선택'}</span>
                    {selectedCategoryLabels.length > 0 && (
                      <>
                        <span aria-hidden="true" className="text-slate-300">
                          ·
                        </span>
                        <span>{selectedCategoryLabels.join(', ')}</span>
                      </>
                    )}
                  </div>
                </div>
              )}
          </section>

          {/* Right / Interactive Survey & Results Column */}
          <section className="lg:col-span-7">
            {phase === 'survey' ? (
              <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-8 shadow-sm">
                <div className="pb-6 border-b border-slate-100">
                  <SurveyProgressBar currentStep={currentStep} steps={SURVEY_STEPS} />
                </div>

                <div className="pt-6 min-h-[360px] flex flex-col justify-between">
                  <AnimatePresence mode="wait" initial={false}>
                    {currentStep === 1 && (
                      <motion.div
                        key="step-1"
                        initial={{ opacity: 0, x: direction * 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: direction * -16 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <h2 className="text-xl sm:text-2xl font-bold text-[#142220] leading-snug">
                          어떤 나이대에 해당하시나요?
                        </h2>
                        <p className="mt-1.5 text-sm text-slate-600">하나를 선택해 주세요.</p>

                        <div
                          className="mt-5 grid grid-cols-1 gap-2.5"
                          role="radiogroup"
                          aria-label="나이대 선택"
                        >
                          {AGE_OPTIONS.map((option) => {
                            const isSelected = answers.age === option.code;
                            return (
                              <button
                                key={option.code}
                                type="button"
                                role="radio"
                                aria-checked={isSelected}
                                onClick={() => handleSelectAge(option.code)}
                                className={`min-h-[56px] w-full flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition-colors duration-150 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 ${
                                  isSelected
                                    ? 'border-teal-700 bg-teal-50/75 text-[#142220]'
                                    : 'border-slate-200 bg-white text-[#142220] hover:border-teal-600/50 hover:bg-[#F7FAF9]'
                                }`}
                              >
                                <div className="min-w-0">
                                  <div className="text-base font-semibold">{option.label}</div>
                                  {option.hint && (
                                    <div className="text-xs sm:text-sm text-slate-500 tabular-nums">
                                      {option.hint}
                                    </div>
                                  )}
                                </div>
                                <span
                                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
                                    isSelected
                                      ? 'border-teal-700 bg-teal-700 text-white'
                                      : 'border-slate-300 bg-white'
                                  }`}
                                >
                                  {isSelected && (
                                    <Check className="h-3.5 w-3.5 stroke-[2.5]" aria-hidden="true" />
                                  )}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 2 && (
                      <motion.div
                        key="step-2"
                        initial={{ opacity: 0, x: direction * 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: direction * -16 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <h2 className="text-xl sm:text-2xl font-bold text-[#142220] leading-snug">
                          계룡시에 거주하고 계신가요?
                        </h2>
                        <p className="mt-1.5 text-sm text-slate-600">
                          주민등록 기준으로 선택해 주세요.
                        </p>

                        <div
                          className="mt-5 grid grid-cols-1 gap-2.5"
                          role="radiogroup"
                          aria-label="거주 여부 선택"
                        >
                          {RESIDENCY_OPTIONS.map((option) => {
                            const isSelected = answers.residency === option.code;
                            return (
                              <button
                                key={option.code}
                                type="button"
                                role="radio"
                                aria-checked={isSelected}
                                onClick={() => handleSelectResidency(option.code)}
                                className={`min-h-[56px] w-full flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition-colors duration-150 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 ${
                                  isSelected
                                    ? 'border-teal-700 bg-teal-50/75 text-[#142220]'
                                    : 'border-slate-200 bg-white text-[#142220] hover:border-teal-600/50 hover:bg-[#F7FAF9]'
                                }`}
                              >
                                <div className="min-w-0">
                                  <div className="text-base font-semibold">{option.label}</div>
                                  {option.hint && (
                                    <div className="mt-0.5 text-xs sm:text-sm text-slate-500">
                                      {option.hint}
                                    </div>
                                  )}
                                </div>
                                <span
                                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
                                    isSelected
                                      ? 'border-teal-700 bg-teal-700 text-white'
                                      : 'border-slate-300 bg-white'
                                  }`}
                                >
                                  {isSelected && (
                                    <Check className="h-3.5 w-3.5 stroke-[2.5]" aria-hidden="true" />
                                  )}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 3 && (
                      <motion.div
                        key="step-3"
                        initial={{ opacity: 0, x: direction * 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: direction * -16 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <h2 className="text-xl sm:text-2xl font-bold text-[#142220] leading-snug">
                          해당되는 분류를 모두 선택해 주세요
                        </h2>
                        <p className="mt-1.5 text-sm text-slate-600">
                          여러 개 선택할 수 있어요.
                        </p>

                        <div
                          className="mt-5 grid grid-cols-1 gap-2.5"
                          role="group"
                          aria-label="해당 분류 다중 선택"
                        >
                          {CATEGORY_OPTIONS.map((option) => {
                            const isSelected = !!answers.categories[option.code];
                            return (
                              <button
                                key={option.code}
                                type="button"
                                aria-pressed={isSelected}
                                onClick={() => handleToggleCategory(option.code)}
                                className={`min-h-[56px] w-full flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition-colors duration-150 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 ${
                                  isSelected
                                    ? 'border-teal-700 bg-teal-50/75 text-[#142220]'
                                    : 'border-slate-200 bg-white text-[#142220] hover:border-teal-600/50 hover:bg-[#F7FAF9]'
                                }`}
                              >
                                <span className="text-base font-semibold">{option.label}</span>
                                <span
                                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
                                    isSelected
                                      ? 'border-teal-700 bg-teal-700 text-white'
                                      : 'border-slate-300 bg-white'
                                  }`}
                                >
                                  {isSelected && (
                                    <Check className="h-3.5 w-3.5 stroke-[2.5]" aria-hidden="true" />
                                  )}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Thumb-zone Navigation */}
                  <div className="mt-7 pt-5 border-t border-slate-100 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={handleBack}
                      disabled={currentStep === 1}
                      className={`min-h-[50px] inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold transition-colors whitespace-nowrap shrink-0 ${
                        currentStep === 1
                          ? 'opacity-35 cursor-not-allowed bg-white text-slate-400'
                          : 'bg-white text-[#142220] hover:bg-slate-50'
                      }`}
                    >
                      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                      <span>이전</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={!canProceedCurrentStep}
                      className={`min-h-[50px] inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-colors whitespace-nowrap shrink-0 ${
                        canProceedCurrentStep
                          ? 'bg-teal-700 text-white hover:bg-teal-800 active:scale-[0.98]'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <span>{currentStep === 3 ? '결과 보기' : '다음'}</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Results View */
              <motion.div
                key="results-view"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-4"
              >
                {/* Results Header Card */}
                <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-sm">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-600">
                    <span>{selectedAgeLabel}</span>
                    <span aria-hidden="true" className="text-slate-300">
                      ·
                    </span>
                    <span>{selectedResidencyLabel}</span>
                    {selectedCategoryLabels.length > 0 && (
                      <>
                        <span aria-hidden="true" className="text-slate-300">
                          ·
                        </span>
                        <span>{selectedCategoryLabels.join(', ')}</span>
                      </>
                    )}
                  </div>

                  <h2 className="mt-2 text-xl sm:text-2xl font-bold text-[#142220]">
                    받을 수 있는 서비스{' '}
                    <span className="text-teal-700 tabular-nums">{matchedServices.length}건</span>
                  </h2>

                  {answers.residency === 'y0' && (
                    <div className="mt-4 rounded-xl border border-amber-200/80 bg-amber-50 px-3.5 py-2.5 text-sm text-amber-900">
                      {RESIDENCY_SHORT_NOTE}
                    </div>
                  )}

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="min-h-[48px] inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 py-2 text-sm font-bold text-[#142220] hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
                    >
                      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                      <span>이전</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleRestart}
                      className="min-h-[48px] inline-flex items-center gap-1.5 rounded-xl bg-teal-700 px-5 py-2 text-sm font-bold text-white hover:bg-teal-800 transition-colors whitespace-nowrap shrink-0"
                    >
                      <RotateCcw className="h-4 w-4" aria-hidden="true" />
                      <span>다시 확인하기</span>
                    </button>
                  </div>
                </div>

                {/* Matched Service List */}
                {matchedServices.length === 0 ? (
                  <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-sm">
                    <h3 className="text-lg font-bold text-[#142220]">해당되는 서비스가 없습니다</h3>
                    <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
                      해당되는 서비스가 없습니다. 보건소({TEL})로 문의해 주세요.
                    </p>
                    <a
                      href={formatTelHref(TEL)}
                      className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-teal-50 px-4 py-2 text-sm font-bold text-teal-900 hover:bg-teal-100 transition-colors tabular-nums"
                    >
                      <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>보건소 {TEL}</span>
                    </a>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {matchedServices.map((service) => (
                      <article
                        key={service.id}
                        className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm"
                      >
                        <h3 className="text-lg sm:text-xl font-bold text-[#142220] leading-snug">
                          {service.title}
                        </h3>

                        <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">
                          대상: {service.target}
                        </p>

                        <p className="mt-2.5 text-sm sm:text-base text-[#142220] leading-relaxed">
                          {service.description}
                        </p>

                        {service.warning && (
                          <div className="mt-3 rounded-xl border border-amber-200/80 bg-amber-50 px-3.5 py-2.5 text-sm text-amber-900">
                            ※ {service.warning}
                          </div>
                        )}

                        <p className="mt-3 text-xs sm:text-sm text-slate-500">{SERVICE_NOTE}</p>

                        <a
                          href={formatTelHref(service.telNumber)}
                          className="mt-3 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-teal-50 px-4 py-2 text-sm font-bold text-teal-900 hover:bg-teal-100 transition-colors tabular-nums"
                        >
                          <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                          <span>
                            {service.telLabel} {service.telNumber}
                          </span>
                        </a>
                      </article>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </section>
        </div>
      </main>

      <footer className="mt-auto border-t border-slate-200/80 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 text-center text-xs sm:text-sm font-semibold text-slate-600">
          {FOOTER_DISCLAIMER}
        </div>
      </footer>
    </div>
  );
}
