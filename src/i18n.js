import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      appName: "NetraRakshak",
      dashboard: "Dashboard",
      patients: "Patients",
      newScreening: "New Screening",
      patientHistory: "Patient History",
      settings: "Settings",
      logout: "Logout",

      welcome: "Welcome to NetraRakshak",
      screening: "Diabetic Retinopathy Screening",
      uploadImage: "Upload Retinal Image",
      startScreening: "Start Screening",
      screeningResult: "Screening Result",

      patientName: "Patient Name",
      age: "Age",
      gender: "Gender",
      diabetesDuration: "Diabetes Duration",
      submit: "Submit",
      cancel: "Cancel",

      aiConfidence: "AI Confidence",
      referral: "Referral Recommendation",
      diseaseGrade: "Disease Grade",

      language: "Language",
      selectLanguage: "Select Language"
    }
  },

  hi: {
    translation: {
      appName: "नेत्ररक्षक",
      dashboard: "डैशबोर्ड",
      patients: "मरीज़",
      newScreening: "नई स्क्रीनिंग",
      patientHistory: "मरीज़ का इतिहास",
      settings: "सेटिंग्स",
      logout: "लॉग आउट",

      welcome: "नेत्ररक्षक में आपका स्वागत है",
      screening: "डायबिटिक रेटिनोपैथी स्क्रीनिंग",
      uploadImage: "रेटिनल इमेज अपलोड करें",
      startScreening: "स्क्रीनिंग शुरू करें",
      screeningResult: "स्क्रीनिंग परिणाम",

      patientName: "मरीज़ का नाम",
      age: "उम्र",
      gender: "लिंग",
      diabetesDuration: "डायबिटीज़ की अवधि",
      submit: "सबमिट करें",
      cancel: "रद्द करें",

      aiConfidence: "AI का विश्वास स्तर",
      referral: "रेफरल सुझाव",
      diseaseGrade: "बीमारी का ग्रेड",

      language: "भाषा",
      selectLanguage: "भाषा चुनें"
    }
  },

  mr: {
    translation: {
      appName: "नेत्ररक्षक",
      dashboard: "डॅशबोर्ड",
      patients: "रुग्ण",
      newScreening: "नवीन स्क्रीनिंग",
      patientHistory: "रुग्णाचा इतिहास",
      settings: "सेटिंग्ज",
      logout: "लॉग आउट",

      welcome: "नेत्ररक्षक मध्ये आपले स्वागत आहे",
      screening: "डायबेटिक रेटिनोपॅथी स्क्रीनिंग",
      uploadImage: "रेटिनल इमेज अपलोड करा",
      startScreening: "स्क्रीनिंग सुरू करा",
      screeningResult: "स्क्रीनिंग निकाल",

      patientName: "रुग्णाचे नाव",
      age: "वय",
      gender: "लिंग",
      diabetesDuration: "मधुमेहाचा कालावधी",
      submit: "सबमिट करा",
      cancel: "रद्द करा",

      aiConfidence: "AI विश्वास पातळी",
      referral: "रेफरल शिफारस",
      diseaseGrade: "रोगाचा ग्रेड",

      language: "भाषा",
      selectLanguage: "भाषा निवडा"
    }
  },

  bn: {
    translation: {
      appName: "নেত্ররক্ষক",
      dashboard: "ড্যাশবোর্ড",
      patients: "রোগী",
      newScreening: "নতুন স্ক্রিনিং",
      patientHistory: "রোগীর ইতিহাস",
      settings: "সেটিংস",
      logout: "লগ আউট",

      welcome: "নেত্ররক্ষক-এ আপনাকে স্বাগতম",
      screening: "ডায়াবেটিক রেটিনোপ্যাথি স্ক্রিনিং",
      uploadImage: "রেটিনাল ছবি আপলোড করুন",
      startScreening: "স্ক্রিনিং শুরু করুন",
      screeningResult: "স্ক্রিনিং ফলাফল",

      patientName: "রোগীর নাম",
      age: "বয়স",
      gender: "লিঙ্গ",
      diabetesDuration: "ডায়াবেটিসের সময়কাল",
      submit: "জমা দিন",
      cancel: "বাতিল করুন",

      aiConfidence: "AI আত্মবিশ্বাস",
      referral: "রেফারেল সুপারিশ",
      diseaseGrade: "রোগের গ্রেড",

      language: "ভাষা",
      selectLanguage: "ভাষা নির্বাচন করুন"
    }
  },

  te: {
    translation: {
      appName: "నేత్రరక్షక",
      dashboard: "డ్యాష్‌బోర్డ్",
      patients: "రోగులు",
      newScreening: "కొత్త స్క్రీనింగ్",
      patientHistory: "రోగి చరిత్ర",
      settings: "సెట్టింగ్స్",
      logout: "లాగ్ అవుట్",

      welcome: "నేత్రరక్షక-కి స్వాగతం",
      screening: "డయాబెటిక్ రెటినోపతి స్క్రీనింగ్",
      uploadImage: "రెటినల్ చిత్రాన్ని అప్‌లోడ్ చేయండి",
      startScreening: "స్క్రీనింగ్ ప్రారంభించండి",
      screeningResult: "స్క్రీనింగ్ ఫలితాಂಶ",

      patientName: "రోగి పేరు",
      age: "వయస్సు",
      gender: "లింగం",
      diabetesDuration: "డయాబెటిస్ వ్యవధి",
      submit: "సమర్పించండి",
      cancel: "రద్దు చేయಂడಿ",

      aiConfidence: "AI విశ్వాસ స్థாயி",
      referral: "రಿಫರಲ್ ಸಿಫಾರ್ಸು",
      diseaseGrade: "వ్యాధి గ్రేడ్",

      language: "భాష",
      selectLanguage: "భాషను ఎంచుకోండి"
    }
  },

  ta: {
    translation: {
      appName: "திருஷ்டி-X",
      dashboard: "டாஷ்போர்டு",
      patients: "நோயாளிகள்",
      newScreening: "புதிய ஸ்கிரீனிங்",
      patientHistory: "நோயாளர் வரலாறு",
      settings: "அமைப்புகள்",
      logout: "வெளியேறு",

      welcome: "திருஷ்டி-Xக்கு வரவேற்கிறோம்",
      screening: "நீரிழிவு ரெட்டினோபதி ஸ்கிரீனிங்",
      uploadImage: "விழித்திரை படத்தை பதிவேற்றவும்",
      startScreening: "ஸ்கிரீனிங்கை தொடங்கவும்",
      screeningResult: "ஸ்கிரீனிங் முடிவு",

      patientName: "நோயாளியின் பெயர்",
      age: "வயது",
      gender: "பாலினம்",
      diabetesDuration: "நீரிழிவு காலம்",
      submit: "சமர்ப்பிக்கவும்",
      cancel: "ரத்து செய்யவும்",

      aiConfidence: "AI நம்பிக்கை",
      referral: "பரிந்துரை",
      diseaseGrade: "நோய் தரம்",

      language: "மொழி",
      selectLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்"
    }
  },

  gu: {
    translation: {
      appName: "દ્રષ્ટિ-X",
      dashboard: "ડેશબોર્ડ",
      patients: "દર્દીઓ",
      newScreening: "નવી સ્ક્રીનિંગ",
      patientHistory: "દર્દીનો ઇતિહાસ",
      settings: "સેટિંગ્સ",
      logout: "લૉગ આઉટ",

      welcome: "દ્રષ્ટિ-X માં આપનું સ્વાગત છે",
      screening: "ડાયાબિટીક રેટિનોપેથી સ્ક્રીનિંગ",
      uploadImage: "રેટિનલ ઈમેજ અપલોડ કરો",
      startScreening: "સ્ક્રીનિંગ શરૂ કરો",
      screeningResult: "સ્ક્રીનિંગ પરિણામ",

      patientName: "દર્દીનું નામ",
      age: "ઉંમર",
      gender: "લિંગ",
      diabetesDuration: "ડાયાબિટીસનો સમયગાળો",
      submit: "સબમિટ કરો",
      cancel: "રદ કરો",

      aiConfidence: "AI વિશ્વાસ સ્તર",
      referral: "રેફરલ ભલામણ",
      diseaseGrade: "રોગનો ગ્રેડ",

      language: "ભાષા",
      selectLanguage: "ભાષા પસંદ કરો"
    }
  },

  kn: {
    translation: {
      appName: "ದೃಷ್ಟಿ-X",
      dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
      patients: "ರೋಗಿಗಳು",
      newScreening: "ಹೊಸ ಸ್ಕ್ರೀನಿಂಗ್",
      patientHistory: "ರೋಗಿಯ ಇತಿಹಾಸ",
      settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
      logout: "ಲಾಗ್ ಔಟ್",

      welcome: "ದೃಷ್ಟಿ-X ಗೆ ಸ್ವಾಗತ",
      screening: "ಮಧುಮೇಹ ರೆಟಿನೋಪತಿ ಸ್ಕ್ರೀನಿಂಗ್",
      uploadImage: "ರೆಟಿನಲ್ ಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
      startScreening: "ಸ್ಕ್ರೀನಿಂಗ್ ಪ್ರಾರಂಭಿಸಿ",
      screeningResult: "ಸ್ಕ್ರೀನಿಂಗ್ ಫಲಿತಾಂಶ",

      patientName: "ರೋಗಿಯ ಹೆಸರು",
      age: "ವಯಸ್ಸು",
      gender: "ಲಿಂಗ",
      diabetesDuration: "ಮಧುಮೇಹದ ಅವಧಿ",
      submit: "ಸಲ್ಲಿಸಿ",
      cancel: "ರದ್ದುಮಾಡಿ",

      aiConfidence: "AI ವಿಶ್ವಾಸ ಮಟ್ಟ",
      referral: "ರೆಫರಲ್ ಶಿಫಾರಸು",
      diseaseGrade: "ರೋಗದ ಗ್ರೇಡ್",

      language: "ಭಾಷೆ",
      selectLanguage: "ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ"
    }
  },

  ml: {
    translation: {
      appName: "ദൃഷ്ടി-X",
      dashboard: "ഡാഷ്ബോർഡ്",
      patients: "രോഗികൾ",
      newScreening: "പുതിയ സ്ക്രീനിംഗ്",
      patientHistory: "രോഗിയുടെ ചരിത്രം",
      settings: "ക്രമീകരണങ്ങൾ",
      logout: "ലോഗ് ഔട്ട്",

      welcome: "ദൃഷ്ടി-X ലേക്ക് സ്വാഗതം",
      screening: "ഡയബറ്റിക് റെറ്റിനോപ്പതി സ്ക്രീനിംഗ്",
      uploadImage: "റെറ്റിനൽ ചിത്രം അപ്‌ലോഡ് ചെയ്യുക",
      startScreening: "സ്ക്രീനിംഗ് ആരംഭിക്കുക",
      screeningResult: "സ്ക്രീനിംഗ് ഫലം",

      patientName: "രോഗിയുടെ പേര്",
      age: "പ്രായം",
      gender: "ലിംഗം",
      diabetesDuration: "പ്രമേഹത്തിന്റെ കാലയളവ്",
      submit: "സമർപ്പിക്കുക",
      cancel: "റദ്ദാക്കുക",

      aiConfidence: "AI വിശ്വാസ്യത",
      referral: "റഫറൽ ശുപാർശ",
      diseaseGrade: "രോഗത്തിന്റെ ഗ്രേഡ്",

      language: "ഭാഷ",
      selectLanguage: "ഭാഷ തിരഞ്ഞെടുക്കുക"
    }
  },

  pa: {
    translation: {
      appName: "ਦ੍ਰਿਸ਼ਟੀ-X",
      dashboard: "ਡੈਸ਼ਬੋਰਡ",
      patients: "ਮਰੀਜ਼",
      newScreening: "ਨਵੀਂ ਸਕ੍ਰੀਨਿੰਗ",
      patientHistory: "ਮਰੀਜ਼ ਦਾ ਇਤਿਹਾਸ",
      settings: "ਸੈਟਿੰਗਾਂ",
      logout: "ਲੌਗ ਆਊਟ",

      welcome: "ਦ੍ਰਿਸ਼ਟੀ-X ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ",
      screening: "ਡਾਇਬੈਟਿਕ ਰੈਟੀਨੋਪੈਥੀ ਸਕ੍ਰੀਨਿੰਗ",
      uploadImage: "ਰੈਟੀਨਲ ਤਸਵੀਰ ਅੱਪਲੋਡ ਕਰੋ",
      startScreening: "ਸਕ੍ਰੀਨਿੰਗ ਸ਼ੁਰੂ ਕਰੋ",
      screeningResult: "ਸਕ੍ਰੀਨਿੰਗ ਨਤੀਜਾ",

      patientName: "ਮਰੀਜ਼ ਦਾ ਨਾਮ",
      age: "ਉਮਰ",
      gender: "ਲਿੰਗ",
      diabetesDuration: "ਸ਼ੂਗਰ ਦੀ ਮਿਆਦ",
      submit: "ਜਮ੍ਹਾਂ ਕਰੋ",
      cancel: "ਰੱਦ ਕਰੋ",

      aiConfidence: "AI ਭਰੋਸਾ ਪੱਧਰ",
      referral: "ਰੈਫਰਲ ਸਿਫਾਰਸ਼",
      diseaseGrade: "ਬਿਮਾਰੀ ਦਾ ਗ੍ਰੇਡ",

      language: "ਭਾਸ਼ਾ",
      selectLanguage: "ਭਾਸ਼ਾ ਚੁਣੋ"
    }
  },

  or: {
    translation: {
      appName: "ଦୃଷ୍ଟି-X",
      dashboard: "ଡ୍ୟାସବୋର୍ଡ",
      patients: "ରୋଗୀ",
      newScreening: "ନୂତନ ସ୍କ୍ରିନିଂ",
      patientHistory: "ରୋଗୀ ଇତିହାସ",
      settings: "ସେଟିଂସ୍",
      logout: "ଲଗ୍ ଆଉଟ୍",

      welcome: "ଦୃଷ୍ଟି-X କୁ ସ୍ୱାଗତ",
      screening: "ଡାଇବେଟିକ୍ ରେଟିନୋପାଥି ସ୍କ୍ରିନିଂ",
      uploadImage: "ରେଟିନାଲ୍ ଛବି ଅପଲୋଡ୍ କରନ୍ତୁ",
      startScreening: "ସ୍କ୍ରିନିଂ ଆରମ୍ଭ କରନ୍ତୁ",
      screeningResult: "ସ୍କ୍ରିନିଂ ଫଳାଫଳ",

      patientName: "ରୋଗୀଙ୍କ ନାମ",
      age: "ବୟସ",
      gender: "ଲିଙ୍ଗ",
      diabetesDuration: "ମଧୁମେହର ସମୟ",
      submit: "ଦାଖଲ କରନ୍ତୁ",
      cancel: "ବାତିଲ୍ କରନ୍ତୁ",

      aiConfidence: "AI ବିଶ୍ୱାସ ସ୍ତର",
      referral: "ରେଫରାଲ୍ ସୁପାରିଶ",
      diseaseGrade: "ରୋଗର ଗ୍ରେଡ୍",

      language: "ଭାଷା",
      selectLanguage: "ଭାଷା ବାଛନ୍ତୁ"
    }
  },

  as: {
    translation: {
      appName: "দৃষ্টি-X",
      dashboard: "ডেশ্বব’ৰ্ড",
      patients: "ৰোগী",
      newScreening: "নতুন স্ক্ৰীনিং",
      patientHistory: "ৰোগীৰ ইতিহাস",
      settings: "ছেটিংছ",
      logout: "লগ আউট",

      welcome: "দৃষ্টি-X লৈ স্বাগতম",
      screening: "ডায়েবেটিক ৰেটিনোপেথী স্ক্ৰীনিং",
      uploadImage: "ৰেটিনেল ছবি আপলোড কৰক",
      startScreening: "স্ক্ৰীনিং আৰম্ভ কৰক",
      screeningResult: "স্ক্ৰীনিং ফলাফল",

      patientName: "ৰোগীৰ নাম",
      age: "বয়স",
      gender: "লিংগ",
      diabetesDuration: "ডায়েবেটিছৰ সময়কাল",
      submit: "দাখিল কৰক",
      cancel: "বাতিল কৰক",

      aiConfidence: "AI বিশ্বাসৰ স্তৰ",
      referral: "ৰেফাৰেল পৰামৰ্শ",
      diseaseGrade: "ৰোগৰ গ্ৰেড",

      language: "ভাষা",
      selectLanguage: "ভাষা বাছনি কৰক"
    }
  },

  hinglish: {
    translation: {
      appName: "Drishti-X",
      dashboard: "Dashboard",
      patients: "Patients",
      newScreening: "Nayi Screening",
      patientHistory: "Patient History",
      settings: "Settings",
      logout: "Logout",

      welcome: "Drishti-X mein aapka swagat hai",
      screening: "Diabetic Retinopathy Screening",
      uploadImage: "Patient ki retinal image upload karein",
      startScreening: "Screening shuru karein",
      screeningResult: "Screening Result",

      patientName: "Patient ka naam",
      age: "Age",
      gender: "Gender",
      diabetesDuration: "Diabetes kitne saal se hai",
      submit: "Submit karein",
      cancel: "Cancel karein",

      aiConfidence: "AI Confidence",
      referral: "Referral Recommendation",
      diseaseGrade: "Disease Grade",

      language: "Language",
      selectLanguage: "Language select karein"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;