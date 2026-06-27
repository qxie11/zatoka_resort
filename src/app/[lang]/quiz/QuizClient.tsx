"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  Award,
  Trophy,
  CheckCircle,
  XCircle,
  ChevronRight,
  RefreshCw,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Question {
  id: number;
  question: {
    ru: string;
    uk: string;
    en: string;
  };
  options: {
    ru: string[];
    uk: string[];
    en: string[];
  };
  correctIndex: number;
  explanation: {
    ru: string;
    uk: string;
    en: string;
  };
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: {
      ru: "Какое море омывает песчаные пляжи Затоки?",
      uk: "Яке море омиває піщані пляжі Затоки?",
      en: "Which sea washes the sandy beaches of Zatoka?"
    },
    options: {
      ru: ["Азовское море", "Черное море", "Средиземное море"],
      uk: ["Азовське море", "Чорне море", "Середземне море"],
      en: ["Azov Sea", "Black Sea", "Mediterranean Sea"]
    },
    correctIndex: 1,
    explanation: {
      ru: "Затока известна своими широкими песчаными пляжами на побережье Черного моря.",
      uk: "Затока відома своїми широкими піщаними пляжами на узбережжі Чорного моря.",
      en: "Zatoka is famous for its wide sandy beaches on the Black Sea coast."
    }
  },
  {
    id: 2,
    question: {
      ru: "В чем уникальность географического положения Затоки?",
      uk: "В чому унікальність географічного положення Затоки?",
      en: "What is unique about the geographical location of Zatoka?"
    },
    options: {
      ru: [
        "Она расположена на косе между Черным морем и Днестровским лиманом",
        "Она находится в глубоком каньоне",
        "Она окружена сосновым лесом со всех сторон"
      ],
      uk: [
        "Вона розташована на косі між Чорним морем і Дністровським лиманом",
        "Вона знаходиться в глибокому каньйоні",
        "Вона оточена сосновим лісом з усіх боків"
      ],
      en: [
        "It is situated on a spit between the Black Sea and the Dniester Estuary",
        "It is located inside a deep canyon",
        "It is surrounded by a pine forest on all sides"
      ]
    },
    correctIndex: 0,
    explanation: {
      ru: "Курорт представляет собой песчаную косу длиной около 20 км, разделяющую море и лиман.",
      uk: "Курорт є піщаною косою довжиною близько 20 км, що розділяє море і лиман.",
      en: "The resort is a sandy spit about 20 km long, dividing the sea and the estuary."
    }
  },
  {
    id: 3,
    question: {
      ru: "Какая знаменитая средневековая крепость находится всего в 20 минутах езды от Затоки?",
      uk: "Яка знаменита середньовічна фортеця знаходиться всього в 20 хвилинах їзди від Затоки?",
      en: "Which famous medieval fortress is located just 20 minutes away from Zatoka?"
    },
    options: {
      ru: ["Хотинская крепость", "Каменец-Подольский замок", "Аккерманская крепость"],
      uk: ["Хотинська фортеця", "Кам'янець-Подільський замок", "Аккерманська фортеця"],
      en: ["Khotyn Fortress", "Kamianets-Podilskyi Castle", "Ackerman Fortress"]
    },
    correctIndex: 2,
    explanation: {
      ru: "Аккерманская (Белгород-Днестровская) крепость — одна из крупнейших средневековых крепостей Украины, расположенная на берегу лимана.",
      uk: "Аккерманська (Білгород-Дністровська) фортеця — одна з найбільших середньовічних фортець України, розташована на березі лиману.",
      en: "Ackerman (Bilhorod-Dnistrovskyi) Fortress is one of the largest medieval fortresses in Ukraine, located on the shore of the estuary."
    }
  },
  {
    id: 4,
    question: {
      ru: "Какая природная особенность лимана делает его ценным для здоровья?",
      uk: "Яка природна особливість лиману робить його цінним для здоров'я?",
      en: "What natural feature of the estuary makes it valuable for health?"
    },
    options: {
      ru: ["Лечебные грязи и высокое содержание минералов", "Горячие термальные источники", "Коралловые рифы"],
      uk: ["Лікувальні грязі та високий вміст мінералів", "Гарячі термальні джерела", "Коралові рифи"],
      en: ["Healing mud and high mineral content", "Hot thermal springs", "Coral reefs"]
    },
    correctIndex: 0,
    explanation: {
      ru: "Днестровский и Шаболатский лиманы славятся своими лечебными иловыми грязями и рапой.",
      uk: "Дністровський та Шаболатський лимани славляться своїми лікувальними муловими грязями та ропою.",
      en: "The Dniester and Shabolyat estuaries are famous for their therapeutic silt mud and brine."
    }
  },
  {
    id: 5,
    question: {
      ru: "Какой важный инфраструктурный мост соединяет две части Затоки?",
      uk: "Який важливий інфраструктурний міст з'єднує дві частини Затоки?",
      en: "What important infrastructural bridge connects the two parts of Zatoka?"
    },
    options: {
      ru: ["Пешеходный подвесной мост", "Разводной железнодорожно-автомобильный мост", "Понтонный мост"],
      uk: ["Пішохідний підвісний міст", "Розвідний залізнично-автомобільний міст", "Понтонний міст"],
      en: ["Pedestrian suspension bridge", "Vertical-lift railway and road bridge", "Pontoon bridge"]
    },
    correctIndex: 1,
    explanation: {
      ru: "Знаменитый разводной вертикально-подъемный мост через Цареградское гирло является важным связующим звеном и символом курорта.",
      uk: "Знаменитий розвідний вертикально-підйомний міст через Цареградське гирло є важливою сполучною ланкою та символом курорту.",
      en: "The famous vertical-lift drawbridge across the Tsaregrad Channel is an important connector and symbol of the resort."
    }
  },
  {
    id: 6,
    question: {
      ru: "В какой области Украины расположен курорт Затока?",
      uk: "В якій області України розташований курорт Затока?",
      en: "In which region (oblast) of Ukraine is the resort of Zatoka located?"
    },
    options: {
      ru: ["Николаевская область", "Одесская область", "Херсонская область"],
      uk: ["Миколаївська область", "Одеська область", "Херсонська область"],
      en: ["Mykolaiv Oblast", "Odesa Oblast", "Kherson Oblast"]
    },
    correctIndex: 1,
    explanation: {
      ru: "Затока находится в Одесской области, примерно в 60 километрах к юго-западу от Одессы.",
      uk: "Затока розташована в Одеській області, приблизно в 60 кілометрах на південний захід від Одеси.",
      en: "Zatoka is located in the Odesa Oblast, approximately 60 kilometers southwest of Odesa."
    }
  },
  {
    id: 7,
    question: {
      ru: "Как переводится слово «Затока» с украинского языка?",
      uk: "Як перекладається слово «Затока» з української мови?",
      en: "How does the word 'Zatoka' translate from Ukrainian?"
    },
    options: {
      ru: ["Залив", "Остров", "Песчаная коса"],
      uk: ["Затока", "Острів", "Піщана коса"],
      en: ["Bay / Gulf", "Island", "Sand spit"]
    },
    correctIndex: 0,
    explanation: {
      ru: "Название курорта полностью описывает его суть: слово «затока» на украинском языке означает залив.",
      uk: "Назва курорту повністю описує його суть: слово «затока» українською мовою означає залив/бухту.",
      en: "The name of the resort describes its nature: the word 'zatoka' in Ukrainian means a bay or gulf."
    }
  },
  {
    id: 8,
    question: {
      ru: "Какой знаменитый винодельческий поселок с богатой историей находится рядом с Затокой?",
      uk: "Яке знамените виноробне селище з багатою історією знаходиться поруч із Затокою?",
      en: "Which famous historic winemaking village is located right next to Zatoka?"
    },
    options: {
      ru: ["Коблево", "Шабо", "Санжейка"],
      uk: ["Коблеве", "Шабо", "Санжійка"],
      en: ["Kobleve", "Shabo", "Sanzheyka"]
    },
    correctIndex: 1,
    explanation: {
      ru: "Шабо известно своими виноградниками, подвалами и Центром культуры вина, расположенным всего в 10 минутах езды от Затоки.",
      uk: "Шабо відоме своїми виноградниками, підвалами та Центром культури вина, що розташований всього в 10 хвилинах їзди від Затоки.",
      en: "Shabo is famous for its vineyards, cellars, and the Wine Culture Center, located just 10 minutes away from Zatoka."
    }
  },
  {
    id: 9,
    question: {
      ru: "Какова примерная протяженность песчаных пляжей Затоки?",
      uk: "Яка приблизна протяжність піщаних пляжів Затоки?",
      en: "What is the approximate length of Zatoka's sandy beaches?"
    },
    options: {
      ru: ["Около 5 км", "Около 20 км", "Около 50 км"],
      uk: ["Близько 5 км", "Близько 20 км", "Близько 50 км"],
      en: ["About 5 km", "About 20 km", "About 50 km"]
    },
    correctIndex: 1,
    explanation: {
      ru: "Коса Затоки растянулась почти на 20 километров, предлагая туристам бескрайние песчаные просторы.",
      uk: "Коса Затоки розтягнулася майже на 20 кілометрів, пропонуючи туристам безкраї піщані простори.",
      en: "The Zatoka spit stretches for almost 20 kilometers, offering tourists endless sandy horizons."
    }
  },
  {
    id: 10,
    question: {
      ru: "Какое историческое название носит центральный район Затоки и местная ж/д станция?",
      uk: "Яку історичну назву має центральний район Затоки та місцева залізнична станція?",
      en: "What historic name does the central district of Zatoka and the local railway station bear?"
    },
    options: {
      ru: ["Бугаз", "Днестр", "Золотой берег"],
      uk: ["Бугаз", "Дністер", "Золотий берег"],
      en: ["Buhaz", "Dniester", "Golden Coast"]
    },
    correctIndex: 0,
    explanation: {
      ru: "Железнодорожная станция и историческая часть Затоки называются Бугаз, что в переводе с тюркского означает «пролив» или «горло».",
      uk: "Залізнична станція та історична частина Затоки називаються Бугаз, що в перекладі з тюркської означає «пролив» або «гирло».",
      en: "The railway station and historical part of Zatoka are named Buhaz, which means 'strait' or 'passage' in Turkic languages."
    }
  }
];

export default function QuizClient({ lang }: { lang: "ru" | "uk" | "en" }) {

  const [started, setStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const t = {
    ru: {
      title: "Насколько хорошо ты знаешь Затоку?",
      subtitle: "Пройди короткий интерактивный тест из 10 вопросов, проверь свои знания и получи эксклюзивный промокод на проживание в Zatoka Resort!",
      startBtn: "Начать викторину",
      nextBtn: "Следующий вопрос",
      finishBtn: "Посмотреть результаты",
      scoreTitle: "Твой результат",
      gradeBeginner: "Новичок Затоки",
      gradeIntermediate: "Любитель моря",
      gradeExpert: "Эксперт Черноморского побережья",
      resultsDesc: "Отличная работа! В знак благодарности за твое время мы дарим тебе промокод на скидку при прямом бронировании номеров.",
      promoLabel: "ТВОЙ ПРОМОКОД:",
      copySuccess: "Скопировано!",
      copyBtn: "Копировать код",
      bookBtn: "Забронировать номер",
      retryBtn: "Пройти снова",
      qText: "Вопрос",
      ofText: "из",
      correctText: "Правильно!",
      wrongText: "Неправильно",
      explanationText: "Объяснение:"
    },
    uk: {
      title: "Наскільки добре ти знаєш Затоку?",
      subtitle: "Пройди короткий інтерактивний тест із 10 питань, перевір свої знання та отримай ексклюзивний промокод на проживання в Zatoka Resort!",
      startBtn: "Почати вікторину",
      nextBtn: "Наступне питання",
      finishBtn: "Подивитися результати",
      scoreTitle: "Твій результат",
      gradeBeginner: "Новачок Затоки",
      gradeIntermediate: "Любитель моря",
      gradeExpert: "Експерт Чорноморського узбережжя",
      resultsDesc: "Чудова робота! На знак вдячності за твій час ми даруємо тобі промокод на знижку при прямому бронюванні номерів.",
      promoLabel: "ТВІЙ ПРОМОКОД:",
      copySuccess: "Скопійовано!",
      copyBtn: "Копіювати код",
      bookBtn: "Забронювати номер",
      retryBtn: "Пройти знову",
      qText: "Питання",
      ofText: "з",
      correctText: "Правильно!",
      wrongText: "Неправильно",
      explanationText: "Пояснення:"
    },
    en: {
      title: "How well do you know Zatoka?",
      subtitle: "Take our short 10-question interactive trivia test, prove your knowledge, and claim an exclusive promo code for your stay at Zatoka Resort!",
      startBtn: "Start Quiz",
      nextBtn: "Next Question",
      finishBtn: "View Results",
      scoreTitle: "Your Score",
      gradeBeginner: "Zatoka Newbie",
      gradeIntermediate: "Sea Enthusiast",
      gradeExpert: "Black Sea Expert",
      resultsDesc: "Excellent job! As a thank you for your time, we are rewarding you with a special discount code for direct room bookings.",
      promoLabel: "YOUR PROMO CODE:",
      copySuccess: "Copied!",
      copyBtn: "Copy Code",
      bookBtn: "Book a Room Now",
      retryBtn: "Try Again",
      qText: "Question",
      ofText: "of",
      correctText: "Correct!",
      wrongText: "Incorrect",
      explanationText: "Explanation:"
    }
  }[lang];

  const currentQuestion = QUESTIONS[currentIdx];

  const handleOptionSelect = (idx: number) => {
    if (answered) return;
    setSelectedOpt(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOpt === null || answered) return;
    setAnswered(true);
    if (selectedOpt === currentQuestion.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedOpt(null);
    setAnswered(false);
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setAnswered(false);
    setScore(0);
    setShowResults(false);
    setStarted(false);
  };

  const [copied, setCopied] = useState(false);
  const copyToClipboard = () => {
    navigator.clipboard.writeText("ZATOKA10");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getGrade = () => {
    if (score <= 4) return t.gradeBeginner;
    if (score <= 7) return t.gradeIntermediate;
    return t.gradeExpert;
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-slate-950 text-white">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-teal-500/10 rounded-full blur-[80px] sm:blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-sky-500/10 rounded-full blur-[80px] sm:blur-[120px] -z-10" />

      <div className="w-full max-w-2xl">
        {!started ? (
          /* Quiz Welcome Screen */
          <div className="glass-card-dark border border-white/10 bg-slate-900/40 backdrop-blur-xl rounded-3xl p-6 sm:p-10 text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl" />
            <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-teal-500/20 to-sky-500/20 border border-teal-500/30 text-teal-400 mb-2">
              <Trophy className="h-10 w-10 animate-bounce" />
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-sky-300 to-amber-200">
              {t.title}
            </h1>
            
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
              {t.subtitle}
            </p>

            <div className="pt-4">
              <Button
                onClick={() => setStarted(true)}
                className="bg-gradient-to-r from-teal-400 to-sky-500 hover:from-teal-300 hover:to-sky-400 text-slate-950 font-bold border-0 shadow-lg shadow-teal-500/20 rounded-xl px-8 h-12 text-sm uppercase tracking-wider transition-all duration-300 hover:scale-105 active:scale-95"
              >
                {t.startBtn}
                <ArrowRight className="ml-2 h-4.5 w-4.5" />
              </Button>
            </div>
          </div>
        ) : showResults ? (
          /* Quiz Results Screen */
          <div className="glass-card-dark border border-white/10 bg-slate-900/40 backdrop-blur-xl rounded-3xl p-6 sm:p-10 text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-sky-500/10 rounded-full blur-2xl" />
            
            <div className="inline-flex p-4 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Award className="h-12 w-12" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-400">{t.scoreTitle}</h2>
              <div className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-yellow-400 my-2">
                {score} / {QUESTIONS.length}
              </div>
              <p className="text-teal-300 font-extrabold uppercase tracking-widest text-sm sm:text-base">
                {getGrade()}
              </p>
            </div>

            <p className="text-slate-300 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
              {t.resultsDesc}
            </p>

            {/* Promo Code Box */}
            <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-5 max-w-sm mx-auto space-y-3 relative shadow-inner">
              <div className="flex items-center justify-center gap-1.5 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="h-4 w-4" />
                <span>{t.promoLabel}</span>
              </div>
              <div className="text-3xl font-mono font-bold tracking-widest text-white select-all">
                ZATOKA10
              </div>
              <div className="flex gap-2 justify-center">
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all text-xs h-9"
                >
                  {copied ? t.copySuccess : t.copyBtn}
                </Button>
                <Button
                  asChild
                  className="bg-gradient-to-r from-teal-400 to-sky-500 text-slate-950 hover:from-teal-300 hover:to-sky-400 font-bold border-0 rounded-xl text-xs h-9 px-4"
                >
                  <Link href={`/${lang}/booking`}>{t.bookBtn}</Link>
                </Button>
              </div>
            </div>

            <div className="pt-4">
              <Button
                onClick={handleReset}
                variant="ghost"
                className="text-slate-200 hover:!text-white rounded-xl hover:bg-white/10 transition-all text-sm"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                {t.retryBtn}
              </Button>
            </div>
          </div>
        ) : (
          /* Quiz Active Question Screen */
          <div className="glass-card-dark border border-white/10 bg-slate-900/40 backdrop-blur-xl rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
            {/* Header / Progress bar */}
            <div className="flex items-center justify-between text-xs sm:text-sm text-slate-400 font-semibold">
              <span>
                {t.qText} {currentIdx + 1} {t.ofText} {QUESTIONS.length}
              </span>
              <span className="text-teal-400 font-bold">
                {score} {t.correctText.toLowerCase()}
              </span>
            </div>
            
            <div className="w-full bg-slate-950/80 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-teal-400 to-sky-500 h-full transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / QUESTIONS.length) * 100}%` }}
              />
            </div>

            {/* Question Text */}
            <div className="py-2">
              <h3 className="text-lg sm:text-xl font-bold leading-snug text-white">
                {currentQuestion.question[lang]}
              </h3>
            </div>

            {/* Options List */}
            <div className="space-y-3">
              {currentQuestion.options[lang].map((opt, idx) => {
                const isSelected = selectedOpt === idx;
                const isCorrect = idx === currentQuestion.correctIndex;
                
                let btnStyle = "bg-slate-950/40 border-white/10 hover:border-teal-500/50 hover:bg-teal-500/5 text-slate-200";
                
                if (answered) {
                  if (isCorrect) {
                    btnStyle = "bg-teal-500/20 border-teal-500 text-teal-300 font-bold";
                  } else if (isSelected) {
                    btnStyle = "bg-rose-500/20 border-rose-500 text-rose-300";
                  } else {
                    btnStyle = "bg-slate-950/20 border-white/5 text-slate-500 opacity-60";
                  }
                } else if (isSelected) {
                  btnStyle = "bg-sky-500/20 border-sky-500 text-sky-300 font-semibold";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(idx)}
                    disabled={answered}
                    className={`w-full flex items-center justify-between p-4 border rounded-xl text-left text-sm transition-all duration-300 ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {answered && isCorrect && <CheckCircle className="h-4.5 w-4.5 text-teal-400 shrink-0 ml-2" />}
                    {answered && isSelected && !isCorrect && <XCircle className="h-4.5 w-4.5 text-rose-400 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation box */}
            {answered && (
              <div className="bg-slate-950/50 border border-white/5 rounded-2xl p-4 text-xs sm:text-sm text-slate-300 leading-relaxed animate-in fade-in slide-in-from-top-1">
                <span className="font-extrabold text-teal-300 block mb-1">{t.explanationText}</span>
                {currentQuestion.explanation[lang]}
              </div>
            )}

            {/* Submit / Next Button */}
            <div className="flex justify-end pt-2">
              {!answered ? (
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={selectedOpt === null}
                  className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl h-11 px-6 disabled:opacity-50 disabled:hover:bg-sky-500 transition-all"
                >
                  Ответить
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-teal-400 to-sky-500 hover:from-teal-300 hover:to-sky-400 text-slate-950 font-bold border-0 shadow-md shadow-teal-500/10 rounded-xl h-11 px-6"
                >
                  {currentIdx === QUESTIONS.length - 1 ? t.finishBtn : t.nextBtn}
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
