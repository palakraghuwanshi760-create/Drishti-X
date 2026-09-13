
import React, { useState } from 'react';
import {
  Eye,
  Layers,
  SplitSquareHorizontal,
  Info,
  Sparkles,
} from 'lucide-react';

import type { DRGrade, Language } from '../types';

interface OriginalVsExplanationViewerProps {
  originalImage: string;
  drGrade: DRGrade;
  lang: Language;
  heatmap?: string;
  method?: string;
  targetLayer?: string;
}

type ViewMode = 'original' | 'explanation' | 'split';

const gradeLabels: Record<DRGrade, string> = {
  NO_DR: 'No Diabetic Retinopathy',
  MILD_DR: 'Mild Diabetic Retinopathy',
  MODERATE_DR: 'Moderate Diabetic Retinopathy',
  SEVERE_DR: 'Severe Diabetic Retinopathy',
  PROLIFERATIVE_DR: 'Proliferative Diabetic Retinopathy',
};

const translations: Record<
  Language,
  {
    title: string;
    original: string;
    explanation: string;
    split: string;
    heatmapOpacity: string;
    aiExplanation: string;
    gradCamInfo: string;
    noHeatmap: string;
    modelLayer: string;
    method: string;
    interpretation: string;
    interpretationText: string;
    prototypeNote: string;
    liveGradCam: string;
  }
> = {
  en: {
    title: 'Explainable AI Analysis',
    original: 'Original',
    explanation: 'AI Explanation',
    split: 'Split View',
    heatmapOpacity: 'Heatmap Opacity',
    aiExplanation: 'Why did the AI focus here?',
    gradCamInfo:
      'Grad-CAM highlights image regions that contributed most to the model severity score.',
    noHeatmap: 'AI explanation heatmap is not available for this screening.',
    modelLayer: 'Target Layer',
    method: 'Method',
    interpretation: 'How to interpret this',
    interpretationText:
      'Brighter areas indicate regions that contributed more strongly to the model output. This visualization is an AI explanation aid, not a clinical diagnosis.',
    prototypeNote:
      'NetraRakshak is a prototype screening-support system. Final clinical decisions should be made by qualified healthcare professionals.',
    liveGradCam: 'LIVE GRAD-CAM',
  },

  hi: {
    title: 'व्याख्यात्मक AI विश्लेषण',
    original: 'मूल चित्र',
    explanation: 'AI व्याख्या',
    split: 'स्प्लिट व्यू',
    heatmapOpacity: 'हीटमैप अपारदर्शिता',
    aiExplanation: 'AI ने यहाँ ध्यान क्यों दिया?',
    gradCamInfo:
      'Grad-CAM उन क्षेत्रों को उजागर करता है जिन्होंने मॉडल के severity score में सबसे अधिक योगदान दिया।',
    noHeatmap:
      'इस स्क्रीनिंग के लिए AI explanation heatmap उपलब्ध नहीं है।',
    modelLayer: 'टारगेट लेयर',
    method: 'विधि',
    interpretation: 'इसे कैसे समझें',
    interpretationText:
      'अधिक चमकीले क्षेत्र मॉडल के परिणाम में अधिक योगदान देने वाले क्षेत्रों को दर्शाते हैं। यह केवल AI explanation सहायता है, clinical diagnosis नहीं।',
    prototypeNote:
      'NetraRakshak एक prototype screening-support system है। अंतिम clinical निर्णय योग्य healthcare professionals द्वारा लिया जाना चाहिए।',
    liveGradCam: 'LIVE GRAD-CAM',
  },

  hinglish: {
    title: 'Explainable AI Analysis',
    original: 'Original',
    explanation: 'AI Explanation',
    split: 'Split View',
    heatmapOpacity: 'Heatmap Opacity',
    aiExplanation: 'AI ne yahan focus kyun kiya?',
    gradCamInfo:
      'Grad-CAM un image regions ko highlight karta hai jinhone model severity score mein sabse zyada contribution diya.',
    noHeatmap:
      'Is screening ke liye AI explanation heatmap available nahi hai.',
    modelLayer: 'Target Layer',
    method: 'Method',
    interpretation: 'Isse kaise samjhein',
    interpretationText:
      'Bright areas un regions ko show karte hain jinhone model output mein zyada contribution diya. Yeh clinical diagnosis nahi hai.',
    prototypeNote:
      'NetraRakshak ek prototype screening-support system hai. Final clinical decision qualified healthcare professional ko lena chahiye.',
    liveGradCam: 'LIVE GRAD-CAM',
  },

  mr: {
    title: 'Explainable AI विश्लेषण',
    original: 'मूळ चित्र',
    explanation: 'AI स्पष्टीकरण',
    split: 'स्प्लिट व्ह्यू',
    heatmapOpacity: 'हीटमॅप अपारदर्शिता',
    aiExplanation: 'AI ने येथे लक्ष का दिले?',
    gradCamInfo:
      'Grad-CAM मॉडेलच्या severity score मध्ये योगदान देणारे भाग हायलाइट करते.',
    noHeatmap:
      'या स्क्रीनिंगसाठी AI explanation heatmap उपलब्ध नाही.',
    modelLayer: 'टार्गेट लेयर',
    method: 'पद्धत',
    interpretation: 'हे कसे समजावे',
    interpretationText:
      'जास्त उजळ भाग मॉडेलच्या परिणामात अधिक योगदान देणारे भाग दर्शवतात. हे clinical diagnosis नाही.',
    prototypeNote:
      'NetraRakshak हे prototype screening-support system आहे. अंतिम clinical निर्णय योग्य healthcare professional ने घ्यावा.',
    liveGradCam: 'LIVE GRAD-CAM',
  },

  bn: {
    title: 'Explainable AI বিশ্লেষণ',
    original: 'মূল ছবি',
    explanation: 'AI ব্যাখ্যা',
    split: 'স্প্লিট ভিউ',
    heatmapOpacity: 'হিটম্যাপ অপাসিটি',
    aiExplanation: 'AI এখানে কেন ফোকাস করেছে?',
    gradCamInfo:
      'Grad-CAM মডেলের severity score-এ বেশি অবদান রাখা ছবির অঞ্চলগুলো হাইলাইট করে।',
    noHeatmap:
      'এই স্ক্রিনিংয়ের জন্য AI explanation heatmap উপলব্ধ নেই।',
    modelLayer: 'টার্গেট লেয়ার',
    method: 'পদ্ধতি',
    interpretation: 'কীভাবে বুঝবেন',
    interpretationText:
      'উজ্জ্বল অঞ্চলগুলো মডেলের ফলাফলে বেশি অবদান রাখা অঞ্চল নির্দেশ করে। এটি clinical diagnosis নয়।',
    prototypeNote:
      'NetraRakshak একটি prototype screening-support system। চূড়ান্ত clinical সিদ্ধান্ত qualified healthcare professional-এর নেওয়া উচিত।',
    liveGradCam: 'LIVE GRAD-CAM',
  },

  te: {
    title: 'Explainable AI విశ్లేషణ',
    original: 'అసలు చిత్రం',
    explanation: 'AI వివరణ',
    split: 'స్ప్లిట్ వ్యూ',
    heatmapOpacity: 'హీట్‌మ్యాప్ అపాసిటీ',
    aiExplanation: 'AI ఇక్కడ ఎందుకు దృష్టి పెట్టింది?',
    gradCamInfo:
      'Grad-CAM మోడల్ severity score పై ఎక్కువ ప్రభావం చూపిన ప్రాంతాలను హైలైట్ చేస్తుంది.',
    noHeatmap:
      'ఈ స్క్రీనింగ్‌కు AI explanation heatmap అందుబాటులో లేదు.',
    modelLayer: 'టార్గెట్ లేయర్',
    method: 'పద్ధతి',
    interpretation: 'దీనిని ఎలా అర్థం చేసుకోవాలి',
    interpretationText:
      'ప్రకాశవంతమైన ప్రాంతాలు మోడల్ output కు ఎక్కువగా సహకరించిన ప్రాంతాలను సూచిస్తాయి. ఇది clinical diagnosis కాదు.',
    prototypeNote:
      'NetraRakshak ఒక prototype screening-support system. తుది clinical నిర్ణయాలు qualified healthcare professionals తీసుకోవాలి.',
    liveGradCam: 'LIVE GRAD-CAM',
  },

  ta: {
    title: 'Explainable AI பகுப்பாய்வு',
    original: 'அசல் படம்',
    explanation: 'AI விளக்கம்',
    split: 'ஸ்ப்ளிட் வியூ',
    heatmapOpacity: 'Heatmap Opacity',
    aiExplanation: 'AI ஏன் இங்கே கவனம் செலுத்தியது?',
    gradCamInfo:
      'Grad-CAM model severity score-க்கு அதிக பங்களிப்பு செய்த பகுதிகளை highlight செய்கிறது.',
    noHeatmap:
      'இந்த screening-க்கு AI explanation heatmap கிடைக்கவில்லை.',
    modelLayer: 'Target Layer',
    method: 'முறை',
    interpretation: 'இதை எப்படி புரிந்துகொள்வது',
    interpretationText:
      'பிரகாசமான பகுதிகள் model output-க்கு அதிக பங்களிப்பு செய்த பகுதிகளை காட்டுகின்றன. இது clinical diagnosis அல்ல.',
    prototypeNote:
      'NetraRakshak ஒரு prototype screening-support system. இறுதி clinical முடிவுகளை qualified healthcare professionals எடுக்க வேண்டும்.',
    liveGradCam: 'LIVE GRAD-CAM',
  },

  gu: {
    title: 'Explainable AI વિશ્લેષણ',
    original: 'મૂળ છબી',
    explanation: 'AI સમજૂતી',
    split: 'સ્પ્લિટ વ્યૂ',
    heatmapOpacity: 'હીટમેપ અપારદર્શિતા',
    aiExplanation: 'AI એ અહીં ધ્યાન શા માટે આપ્યું?',
    gradCamInfo:
      'Grad-CAM મોડેલ severity score પર સૌથી વધુ અસર કરનારા વિસ્તારોને હાઇલાઇટ કરે છે.',
    noHeatmap:
      'આ screening માટે AI explanation heatmap ઉપલબ્ધ નથી.',
    modelLayer: 'Target Layer',
    method: 'પદ્ધતિ',
    interpretation: 'આને કેવી રીતે સમજવું',
    interpretationText:
      'વધુ તેજ વિસ્તારો મોડેલ outputમાં વધુ યોગદાન આપતા વિસ્તારો દર્શાવે છે. આ clinical diagnosis નથી.',
    prototypeNote:
      'NetraRakshak એક prototype screening-support system છે. અંતિમ clinical નિર્ણય qualified healthcare professional દ્વારા લેવો જોઈએ.',
    liveGradCam: 'LIVE GRAD-CAM',
  },

  kn: {
    title: 'Explainable AI ವಿಶ್ಲೇಷಣೆ',
    original: 'ಮೂಲ ಚಿತ್ರ',
    explanation: 'AI ವಿವರಣೆ',
    split: 'ಸ್ಪ್ಲಿಟ್ ವ್ಯೂ',
    heatmapOpacity: 'ಹೀಟ್‌ಮ್ಯಾಪ್ ಅಪಾಸಿಟಿ',
    aiExplanation: 'AI ಇಲ್ಲಿ ಏಕೆ ಗಮನ ಹರಿಸಿತು?',
    gradCamInfo:
      'Grad-CAM ಮಾದರಿಯ severity score ಮೇಲೆ ಹೆಚ್ಚು ಪರಿಣಾಮ ಬೀರಿದ ಪ್ರದೇಶಗಳನ್ನು ಹೈಲೈಟ್ ಮಾಡುತ್ತದೆ.',
    noHeatmap:
      'ಈ screeningಗೆ AI explanation heatmap ಲಭ್ಯವಿಲ್ಲ.',
    modelLayer: 'Target Layer',
    method: 'ವಿಧಾನ',
    interpretation: 'ಇದನ್ನು ಹೇಗೆ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಬೇಕು',
    interpretationText:
      'ಹೆಚ್ಚು ಪ್ರಕಾಶಮಾನವಾದ ಪ್ರದೇಶಗಳು model outputಗೆ ಹೆಚ್ಚು ಕೊಡುಗೆ ನೀಡಿದ ಪ್ರದೇಶಗಳನ್ನು ಸೂಚಿಸುತ್ತವೆ. ಇದು clinical diagnosis ಅಲ್ಲ.',
    prototypeNote:
      'NetraRakshak ಒಂದು prototype screening-support system. ಅಂತಿಮ clinical ನಿರ್ಧಾರಗಳನ್ನು qualified healthcare professionals ತೆಗೆದುಕೊಳ್ಳಬೇಕು.',
    liveGradCam: 'LIVE GRAD-CAM',
  },

  ml: {
    title: 'Explainable AI വിശകലനം',
    original: 'യഥാർത്ഥ ചിത്രം',
    explanation: 'AI വിശദീകരണം',
    split: 'സ്പ്ലിറ്റ് വ്യൂ',
    heatmapOpacity: 'ഹീറ്റ്‌മാപ്പ് അപാസിറ്റി',
    aiExplanation: 'AI ഇവിടെ ശ്രദ്ധ കേന്ദ്രീകരിച്ചത് എന്തുകൊണ്ട്?',
    gradCamInfo:
      'Grad-CAM മോഡൽ severity score-ൽ കൂടുതൽ സംഭാവന നൽകിയ പ്രദേശങ്ങൾ ഹൈലൈറ്റ് ചെയ്യുന്നു.',
    noHeatmap:
      'ഈ screening-ന് AI explanation heatmap ലഭ്യമല്ല.',
    modelLayer: 'Target Layer',
    method: 'രീതി',
    interpretation: 'ഇത് എങ്ങനെ മനസ്സിലാക്കാം',
    interpretationText:
      'കൂടുതൽ പ്രകാശമുള്ള പ്രദേശങ്ങൾ model output-ലേക്ക് കൂടുതൽ സംഭാവന നൽകിയ പ്രദേശങ്ങളെയാണ് കാണിക്കുന്നത്. ഇത് clinical diagnosis അല്ല.',
    prototypeNote:
      'NetraRakshak ഒരു prototype screening-support system ആണ്. അന്തിമ clinical തീരുമാനങ്ങൾ qualified healthcare professionals എടുക്കണം.',
    liveGradCam: 'LIVE GRAD-CAM',
  },

  pa: {
    title: 'Explainable AI ਵਿਸ਼ਲੇਸ਼ਣ',
    original: 'ਅਸਲ ਤਸਵੀਰ',
    explanation: 'AI ਵਿਆਖਿਆ',
    split: 'ਸਪਲਿਟ ਵਿਊ',
    heatmapOpacity: 'ਹੀਟਮੈਪ ਓਪੈਸਿਟੀ',
    aiExplanation: 'AI ਨੇ ਇੱਥੇ ਧਿਆਨ ਕਿਉਂ ਦਿੱਤਾ?',
    gradCamInfo:
      'Grad-CAM ਉਹ ਖੇਤਰ highlight ਕਰਦਾ ਹੈ ਜਿਨ੍ਹਾਂ ਨੇ model severity score ਵਿੱਚ ਸਭ ਤੋਂ ਵੱਧ ਯੋਗਦਾਨ ਦਿੱਤਾ।',
    noHeatmap:
      'ਇਸ screening ਲਈ AI explanation heatmap ਉਪਲਬਧ ਨਹੀਂ ਹੈ।',
    modelLayer: 'Target Layer',
    method: 'ਤਰੀਕਾ',
    interpretation: 'ਇਸਨੂੰ ਕਿਵੇਂ ਸਮਝਣਾ ਹੈ',
    interpretationText:
      'ਚਮਕਦਾਰ ਖੇਤਰ model output ਵਿੱਚ ਵੱਧ ਯੋਗਦਾਨ ਦੇਣ ਵਾਲੇ ਖੇਤਰਾਂ ਨੂੰ ਦਰਸਾਉਂਦੇ ਹਨ। ਇਹ clinical diagnosis ਨਹੀਂ ਹੈ।',
    prototypeNote:
      'NetraRakshak ਇੱਕ prototype screening-support system ਹੈ। ਅੰਤਿਮ clinical ਫੈਸਲੇ qualified healthcare professionals ਨੂੰ ਲੈਣੇ ਚਾਹੀਦੇ ਹਨ।',
    liveGradCam: 'LIVE GRAD-CAM',
  },

  or: {
    title: 'Explainable AI ବିଶ୍ଳେଷଣ',
    original: 'ମୂଳ ଛବି',
    explanation: 'AI ବ୍ୟାଖ୍ୟା',
    split: 'ସ୍ପ୍ଲିଟ୍ ଭ୍ୟୁ',
    heatmapOpacity: 'ହିଟମ୍ୟାପ୍ ଅପାସିଟି',
    aiExplanation: 'AI ଏଠାରେ କାହିଁକି ଧ୍ୟାନ ଦେଲା?',
    gradCamInfo:
      'Grad-CAM ମଡେଲ୍ severity score ଉପରେ ଅଧିକ ପ୍ରଭାବ ପକାଇଥିବା ଅଞ୍ଚଳଗୁଡିକୁ highlight କରେ।',
    noHeatmap:
      'ଏହି screening ପାଇଁ AI explanation heatmap ଉପଲବ୍ଧ ନାହିଁ।',
    modelLayer: 'Target Layer',
    method: 'ପଦ୍ଧତି',
    interpretation: 'ଏହାକୁ କିପରି ବୁଝିବେ',
    interpretationText:
      'ଉଜ୍ଜ୍ୱଳ ଅଞ୍ଚଳଗୁଡିକ model outputରେ ଅଧିକ ଅବଦାନ ପକାଇଥିବା ଅଞ୍ଚଳକୁ ଦର୍ଶାଏ। ଏହା clinical diagnosis ନୁହେଁ।',
    prototypeNote:
      'NetraRakshak ଏକ prototype screening-support system। ଅନ୍ତିମ clinical ନିଷ୍ପତ୍ତି qualified healthcare professionals ନେବା ଉଚିତ।',
    liveGradCam: 'LIVE GRAD-CAM',
  },

  as: {
    title: 'Explainable AI বিশ্লেষণ',
    original: 'মূল ছবি',
    explanation: 'AI ব্যাখ্যা',
    split: 'স্প্লিট ভিউ',
    heatmapOpacity: 'হিটমেপ অপাসিটি',
    aiExplanation: 'AI-য়ে ইয়াত কিয় মনোযোগ দিলে?',
    gradCamInfo:
      'Grad-CAM-এ মডেলৰ severity score-ত অধিক অৱদান দিয়া অঞ্চলসমূহ highlight কৰে।',
    noHeatmap:
      'এই screening-ৰ বাবে AI explanation heatmap উপলব্ধ নাই।',
    modelLayer: 'Target Layer',
    method: 'পদ্ধতি',
    interpretation: 'ইয়াক কেনেকৈ বুজিব',
    interpretationText:
      'উজ্জ্বল অঞ্চলসমূহে model output-ত অধিক অৱদান দিয়া অঞ্চল দেখুৱায়। এইটো clinical diagnosis নহয়।',
    prototypeNote:
      'NetraRakshak এটা prototype screening-support system। চূড়ান্ত clinical সিদ্ধান্ত qualified healthcare professionals-এ লোৱা উচিত।',
    liveGradCam: 'LIVE GRAD-CAM',
  },

  ur: {
    title: 'Explainable AI تجزیہ',
    original: 'اصل تصویر',
    explanation: 'AI وضاحت',
    split: 'اسپلٹ ویو',
    heatmapOpacity: 'ہیٹ میپ اوپیسٹی',
    aiExplanation: 'AI نے یہاں توجہ کیوں دی؟',
    gradCamInfo:
      'Grad-CAM ان علاقوں کو نمایاں کرتا ہے جنہوں نے model severity score میں زیادہ حصہ ڈالا۔',
    noHeatmap:
      'اس screening کے لیے AI explanation heatmap دستیاب نہیں ہے۔',
    modelLayer: 'Target Layer',
    method: 'طریقہ',
    interpretation: 'اسے کیسے سمجھیں',
    interpretationText:
      'زیادہ روشن علاقے ان حصوں کو ظاہر کرتے ہیں جنہوں نے model output میں زیادہ حصہ ڈالا۔ یہ clinical diagnosis نہیں ہے۔',
    prototypeNote:
      'NetraRakshak ایک prototype screening-support system ہے۔ حتمی clinical فیصلے qualified healthcare professionals کو کرنے چاہئیں۔',
    liveGradCam: 'LIVE GRAD-CAM',
  },
};

export default function OriginalVsExplanationViewer({
  originalImage,
  drGrade,
  lang,
  heatmap,
  method = 'Grad-CAM',
  targetLayer,
}: OriginalVsExplanationViewerProps) {
  const [viewMode, setViewMode] =
    useState<ViewMode>('explanation');

  const [opacity, setOpacity] = useState(75);

  const t = translations[lang] || translations.en;

  const gradeLabel =
    gradeLabels[drGrade] || 'Screening Result';

  /*
   * The backend returns the Grad-CAM as a raw base64 PNG.
   * Convert it into a browser-readable image URL.
   */
  const getHeatmapSrc = (): string => {
    if (!heatmap || typeof heatmap !== 'string') {
      return '';
    }

    const cleanedHeatmap = heatmap.trim();

    if (!cleanedHeatmap) {
      return '';
    }

    if (cleanedHeatmap.startsWith('data:image/')) {
      return cleanedHeatmap;
    }

    return `data:image/png;base64,${cleanedHeatmap}`;
  };

  const heatmapSrc = getHeatmapSrc();

  const hasHeatmap = heatmapSrc.length > 0;

  /*
   * Reusable original + Grad-CAM overlay.
   *
   * Important:
   * The heatmap uses object-fill rather than object-contain.
   * This makes the heatmap cover exactly the same displayed
   * rectangle as the original retinal image.
   */
  const renderGradCAMOverlay = (
    compact = false
  ) => {
    if (!hasHeatmap) {
      return (
        <div className="flex min-h-[320px] items-center justify-center bg-black p-8 text-center">
          <div className="max-w-md">
            <Info className="mx-auto mb-3 h-9 w-9 text-slate-500" />

            <p className="text-sm text-slate-300">
              {t.noHeatmap}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div
        className={`relative overflow-hidden bg-black ${
          compact
            ? 'rounded-xl'
            : 'rounded-xl'
        }`}
      >
        {/* Original fundus image */}
        {originalImage ? (
          <img
            src={originalImage}
            alt="Retinal fundus image"
            className="block h-auto w-full"
          />
        ) : (
          <div className="flex min-h-[320px] items-center justify-center text-sm text-slate-400">
            Original image unavailable.
          </div>
        )}

        {/* REAL GRAD-CAM HEATMAP */}
        {originalImage && (
          <img
            src={heatmapSrc}
            alt="Grad-CAM explanation heatmap"
            className="pointer-events-none absolute inset-0 h-full w-full"
            style={{
              opacity: opacity / 100,
              objectFit: 'fill',
              mixBlendMode: 'screen',
            }}
          />
        )}

        {/* Live badge */}
        <div className="absolute left-3 top-3 flex items-center gap-2 rounded-lg border border-teal-400/30 bg-slate-950/85 px-3 py-2 text-xs font-semibold text-teal-300 shadow-lg backdrop-blur">
          <span className="h-2 w-2 animate-pulse rounded-full bg-teal-400" />
          <Sparkles className="h-3.5 w-3.5" />
          {t.liveGradCam}
        </div>

        {/* Method badge */}
        <div className="absolute bottom-3 right-3 rounded-lg border border-white/10 bg-black/75 px-3 py-2 text-xs font-medium text-white backdrop-blur">
          {method || 'Grad-CAM'}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-5">

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400">
              <Layers className="h-5 w-5" />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white">
                {t.title}
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                {gradeLabel}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasHeatmap && (
            <div className="flex items-center gap-2 rounded-xl border border-teal-500/20 bg-teal-500/5 px-3 py-2 text-xs font-semibold text-teal-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-teal-400" />
              {t.liveGradCam}
            </div>
          )}

          <div className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-300">
            {method || 'Grad-CAM'}
          </div>
        </div>
      </div>

      {/* View controls */}
      <div className="flex flex-wrap gap-2 rounded-xl border border-slate-700/70 bg-slate-900/60 p-2">

        <button
          type="button"
          onClick={() => setViewMode('original')}
          className={`flex min-h-[44px] items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            viewMode === 'original'
              ? 'bg-teal-500 text-slate-950'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Eye className="h-4 w-4" />
          {t.original}
        </button>

        <button
          type="button"
          onClick={() => setViewMode('explanation')}
          disabled={!hasHeatmap}
          className={`flex min-h-[44px] items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            viewMode === 'explanation'
              ? 'bg-teal-500 text-slate-950'
              : 'text-slate-300 hover:bg-slate-800'
          } ${
            !hasHeatmap
              ? 'cursor-not-allowed opacity-40'
              : 'hover:bg-slate-800'
          }`}
        >
          <Layers className="h-4 w-4" />
          {t.explanation}
        </button>

        <button
          type="button"
          onClick={() => setViewMode('split')}
          disabled={!hasHeatmap}
          className={`flex min-h-[44px] items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            viewMode === 'split'
              ? 'bg-teal-500 text-slate-950'
              : 'text-slate-300 hover:bg-slate-800'
          } ${
            !hasHeatmap
              ? 'cursor-not-allowed opacity-40'
              : 'hover:bg-slate-800'
          }`}
        >
          <SplitSquareHorizontal className="h-4 w-4" />
          {t.split}
        </button>
      </div>

      {/* Image viewer */}
      <div className="overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-950">

        {/* ORIGINAL */}
        {viewMode === 'original' && (
          <div className="relative flex items-center justify-center bg-black p-3">
            {originalImage ? (
              <div className="relative w-full overflow-hidden rounded-xl">
                <img
                  src={originalImage}
                  alt="Original retinal fundus image"
                  className="block max-h-[560px] w-full object-contain"
                />

                <div className="absolute left-3 top-3 rounded-lg bg-black/75 px-3 py-2 text-xs font-medium text-white backdrop-blur">
                  {t.original}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-sm text-slate-400">
                Original image unavailable.
              </div>
            )}
          </div>
        )}

        {/* AI EXPLANATION */}
        {viewMode === 'explanation' && (
          <div className="bg-black p-3">
            {renderGradCAMOverlay()}
          </div>
        )}

        {/* SPLIT VIEW */}
        {viewMode === 'split' && (
          <div className="grid grid-cols-1 gap-px bg-slate-700 md:grid-cols-2">

            {/* Original */}
            <div className="relative flex items-center justify-center bg-black p-3">
              {originalImage ? (
                <div className="relative w-full overflow-hidden rounded-xl">
                  <img
                    src={originalImage}
                    alt="Original retinal fundus image"
                    className="block max-h-[520px] w-full object-contain"
                  />

                  <div className="absolute left-3 top-3 rounded-lg bg-black/75 px-3 py-2 text-xs font-medium text-white backdrop-blur">
                    {t.original}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-slate-400">
                  Original image unavailable.
                </div>
              )}
            </div>

            {/* Grad-CAM */}
            <div className="bg-black p-3">
              {renderGradCAMOverlay(true)}
            </div>
          </div>
        )}
      </div>

      {/* Opacity control */}
      {hasHeatmap && (
        <div className="rounded-xl border border-slate-700/70 bg-slate-900/60 p-4">
          <div className="mb-3 flex items-center justify-between gap-4">

            <label
              htmlFor="heatmap-opacity"
              className="text-sm font-medium text-slate-200"
            >
              {t.heatmapOpacity}
            </label>

            <span className="rounded-md bg-slate-800 px-2 py-1 text-xs font-semibold text-teal-300">
              {opacity}%
            </span>
          </div>

          <input
            id="heatmap-opacity"
            type="range"
            min="0"
            max="100"
            step="1"
            value={opacity}
            onChange={(event) =>
              setOpacity(Number(event.target.value))
            }
            className="w-full accent-teal-400"
          />
        </div>
      )}

      {/* Explanation information */}
      <div className="rounded-2xl border border-teal-500/20 bg-teal-500/5 p-5">

        <div className="flex items-start gap-3">

          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-500/10 text-teal-400">
            <Info className="h-5 w-5" />
          </div>

          <div className="min-w-0">

            <h4 className="font-semibold text-white">
              {t.aiExplanation}
            </h4>

            <p className="mt-2 text-sm leading-6 text-slate-300">
              {t.gradCamInfo}
            </p>

          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">

          <div className="rounded-xl border border-slate-700/60 bg-slate-950/50 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              {t.method}
            </p>

            <p className="mt-1 break-words text-sm font-medium text-slate-200">
              {method || 'Grad-CAM'}
            </p>
          </div>

          <div className="rounded-xl border border-slate-700/60 bg-slate-950/50 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              {t.modelLayer}
            </p>

            <p className="mt-1 break-all text-sm font-medium text-slate-200">
              {targetLayer ||
                'Automatically selected convolutional layer'}
            </p>
          </div>

        </div>
      </div>

      {/* Interpretation */}
      <div className="rounded-xl border border-slate-700/70 bg-slate-900/50 p-4">

        <h4 className="text-sm font-semibold text-slate-200">
          {t.interpretation}
        </h4>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          {t.interpretationText}
        </p>

      </div>

      {/* Prototype disclaimer */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">

        <p className="text-xs leading-5 text-amber-200/80">
          {t.prototypeNote}
        </p>

      </div>

    </div>
  );
}
