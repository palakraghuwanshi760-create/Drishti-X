export const translations = {
  en: {
    appName: 'Drishti-X',
    tagline: 'Explainable AI for Diabetic Retinopathy Screening',
    heroSubtitle: 'AI-assisted retinal screening designed to support earlier detection and referral in resource-constrained communities.',
    startScreening: 'Start Screening',
    signIn: 'Sign In as Health Worker',
    loginAsDemoWorker: 'Continue as Community Health Worker',
    welcomeBack: 'Good morning',
    readyPrompt: "Ready for today's screenings?",
    newScreeningBtn: '+ New Screening',
    
    // Disclaimer
    medicalDisclaimerTitle: 'Important Medical Screening Disclaimer',
    medicalDisclaimerText: 'This AI screening result does not replace examination by a qualified eye-care professional. Drishti-X is a clinical decision-support prototype designed for risk stratification and referral assistance in rural health camps.',
    
    // Navigation
    navDashboard: 'Dashboard',
    navNewScreening: 'New Screening',
    navHistory: 'Screening History',
    navReports: 'Reports',
    navSettings: 'Settings',
    logout: 'Log Out',
    
    // Stats
    statTotalScreened: 'Total Screened',
    statNoDR: 'No DR Detected',
    statNeedsReview: 'Needs Review',
    statReferrals: 'Referrals',
    
    // Dashboard & Trends
    screeningTrends: 'Screening Volume & Risk Breakdown',
    recentScreenings: 'Recent Screenings',
    patientId: 'Patient ID',
    date: 'Date',
    result: 'Result',
    confidence: 'Confidence',
    priority: 'Priority',
    status: 'Status',
    actions: 'Actions',
    viewDetails: 'View Details',
    
    // Steps
    step1: '1. Patient Info',
    step2: '2. Image Upload',
    step3: '3. AI Analysis',
    step4: '4. Screening Result',
    
    // Patient Form
    patientInfoTitle: 'Patient Information',
    patientCode: 'Patient Code / UID',
    patientCodePlaceholder: 'e.g. MH-24-0891',
    age: 'Age',
    agePlaceholder: 'Years (e.g. 54)',
    sex: 'Sex',
    male: 'Male',
    female: 'Female',
    other: 'Other',
    campLocation: 'Screening Center / PHC',
    diabetesDuration: 'Known Diabetes Duration (Optional)',
    durationYears: 'Years',
    privacyNotice: 'Minimal data collected strictly for triage & referral tracking. No unnecessary personal identifiers requested.',
    
    // Image Upload
    uploadFundusImage: 'Upload Retinal Fundus Image',
    dragDropText: 'Drag and drop digital fundus camera image, or browse local files',
    supportedFormats: 'Supported: High-resolution JPG, JPEG, PNG (Mydriatic or Non-Mydriatic fundus photography)',
    browseFiles: 'Browse Files',
    orUsePreset: 'Or select a representative clinical demo case:',
    removeImage: 'Replace Image',
    imageQualityGood: 'Image quality: Good ✓',
    imageQualityGoodDesc: 'Optic disc, macula, and vascular arches are adequately illuminated and focused for feature detection.',
    imageQualityPoor: 'Image quality: Poor ⚠️',
    imageQualityPoorDesc: 'Please capture another image with better focus, pupil dilation, or illumination.',
    analyzeImage: 'Analyze Image with Drishti-X',
    
    // Analysis
    analysisTitle: 'AI Screening in Progress',
    analysisSubtitle: 'Running multi-scale retinal vessel & lesion feature extraction model',
    stageUploaded: 'Image uploaded & normalized',
    stageQuality: 'Image quality & illumination verified',
    stageDetecting: 'Detecting retinal vascular features & anomalies',
    stageGenerating: 'Generating risk categorization & confidence scores',
    stageExplanation: 'Synthesizing Grad-CAM spatial attention explanation',
    analysisProgressNotice: 'Clinical decision-support model operating in offline-first mode. Results will be queued for PHC ophthalmologist review.',
    cancelAnalysis: 'Cancel',
    
    // Result
    screeningResultTitle: 'AI Screening Result',
    aiConfidence: 'Model Confidence',
    referralPriority: 'Referral Priority',
    viewOriginal: 'Original Fundus',
    viewExplanation: 'AI Explanation (Grad-CAM)',
    splitView: 'Side-by-Side Comparison',
    sliderOverlay: 'Overlay Heatmap',
    heatmapIntensity: 'Heatmap Opacity',
    whyFlagged: 'Why was this flagged?',
    whyFlaggedExplanation: "The model's attention was concentrated around retinal regions that influenced the screening prediction. Attention heatmaps highlight spatial features that contributed mathematically to the classification.",
    modelExplanationNote: 'Note: Highlighted zones indicate algorithm feature focus and must not be considered definitive pathology without slit-lamp examination.',
    riskIndicatorLabel: 'Triage Risk Stratification',
    recommendedNextStep: 'Recommended Next Step',
    viewDetailedReport: 'View Detailed Report',
    startNewScreening: 'Start New Screening',
    
    // Risk levels
    lowRisk: 'LOW RISK',
    moderateRisk: 'MODERATE RISK',
    highRisk: 'HIGH RISK',
    urgentRisk: 'URGENT PRIORITY',
    
    // Grades
    gradeNoDR: 'No Apparent DR',
    gradeMild: 'Mild Non-Proliferative DR Suspected',
    gradeModerate: 'Moderate Non-Proliferative DR Suspected',
    gradeSevere: 'Severe Non-Proliferative DR Suspected',
    gradeProliferative: 'Proliferative DR Suspected',
    
    // Report
    reportTitle: 'Diabetic Retinopathy Screening Report',
    downloadReport: 'Download PDF Report',
    printReport: 'Print Report',
    screeningCenter: 'Screening Location',
    screeningTechnician: 'Screening Health Worker',
    clinicalEvaluationNotice: 'Clinical evaluation by a qualified eye-care professional is recommended based on this screening result.',
    officialStamp: 'Authorized Primary Health Center Verification',
    
    // History
    historyTitle: 'Screening History & Registries',
    searchPlaceholder: 'Search by Patient Code, Center, or Result...',
    filterResult: 'Result Filter',
    filterPriority: 'Priority Filter',
    filterAll: 'All Records',
    noRecordsFound: 'No screening records matching the selected criteria.',
    
    // Settings
    settingsTitle: 'System Settings',
    healthWorkerProfile: 'Health Worker Profile',
    languageSelection: 'Language & Accessibility',
    offlineSyncStatus: 'Offline Sync & Bandwidth Mode',
    dataPrivacy: 'Data Privacy & Ethics',
  },
  hi: {
    appName: 'दृष्टि-X (Drishti-X)',
    tagline: 'डायबिटिक रेटिनोपैथी स्क्रीनिंग हेतु व्याख्यात्मक एआई',
    heroSubtitle: 'ग्रामीण एवं सीमित संसाधन वाले स्वास्थ्य केंद्रों में समय पर पहचान और विशेषज्ञ रेफरल हेतु एआई-सहायक रेटिनल स्क्रीनिंग।',
    startScreening: 'स्क्रीनिंग शुरू करें',
    signIn: 'स्वास्थ्य कार्यकर्ता लॉगिन',
    loginAsDemoWorker: 'सामुदायिक स्वास्थ्य कार्यकर्ता के रूप में आगे बढ़ें',
    welcomeBack: 'शुभ प्रभात',
    readyPrompt: 'आज की स्क्रीनिंग के लिए तैयार हैं?',
    newScreeningBtn: '+ नई स्क्रीनिंग',
    
    // Disclaimer
    medicalDisclaimerTitle: 'महत्वपूर्ण चिकित्सा अस्वीकरण',
    medicalDisclaimerText: 'यह एआई स्क्रीनिंग परिणाम किसी योग्य नेत्र रोग विशेषज्ञ द्वारा की जाने वाली जांच का विकल्प नहीं है। दृष्टि-X ग्रामीण स्वास्थ्य शिविरों में प्राथमिक जोखिम वर्गीकरण हेतु निर्णय-सहायता प्रोटोटाइप है।',
    
    // Navigation
    navDashboard: 'डैशबोर्ड',
    navNewScreening: 'नई स्क्रीनिंग',
    navHistory: 'स्क्रीनिंग इतिहास',
    navReports: 'रिपोर्ट्स',
    navSettings: 'सेटिंग्स',
    logout: 'लॉग आउट',
    
    // Stats
    statTotalScreened: 'कुल जांची गई आंखें',
    statNoDR: 'डीआर नहीं मिला',
    statNeedsReview: 'पुनरावलोकन आवश्यक',
    statReferrals: 'रेफरल हेतु चिन्हित',
    
    // Dashboard & Trends
    screeningTrends: 'स्क्रीनिंग रुझान एवं जोखिम वितरण',
    recentScreenings: 'हालिया स्क्रीनिंग सूची',
    patientId: 'मरीज कोड',
    date: 'दिनांक',
    result: 'परिणाम',
    confidence: 'विश्वास स्कोर (Confidence)',
    priority: 'प्राथमिकता',
    status: 'स्थिति',
    actions: 'कार्रवाई',
    viewDetails: 'विवरण देखें',
    
    // Steps
    step1: '1. मरीज जानकारी',
    step2: '2. फंडस इमेज',
    step3: '3. एआई विश्लेषण',
    step4: '4. स्क्रीनिंग परिणाम',
    
    // Patient Form
    patientInfoTitle: 'मरीज की जानकारी',
    patientCode: 'मरीज कोड / आईडी',
    patientCodePlaceholder: 'उदा. MH-24-0891',
    age: 'आयु',
    agePlaceholder: 'वर्ष (उदा. 54)',
    sex: 'लिंग',
    male: 'पुरुष',
    female: 'महिला',
    other: 'अन्य',
    campLocation: 'स्क्रीनिंग केंद्र / पीएचसी',
    diabetesDuration: 'मधुमेह की ज्ञात अवधि (वैकल्पिक)',
    durationYears: 'वर्ष',
    privacyNotice: 'डेटा केवल प्राथमिक जांच एवं रेफरल हेतु एकत्र किया गया है। अनावश्यक व्यक्तिगत पहचान की मांग नहीं की जाती।',
    
    // Image Upload
    uploadFundusImage: 'रेटिनल फंडस छवि अपलोड करें',
    dragDropText: 'डिजिटल फंडस कैमरा छवि खींचें और छोड़ें, या फाइल चुनें',
    supportedFormats: 'समर्थित: उच्च गुणवत्ता JPG, JPEG, PNG (फंडस फोटोग्राफी)',
    browseFiles: 'फाइल चुनें',
    orUsePreset: 'या क्लिनिकल डेमो केस चुनें:',
    removeImage: 'छवि बदलें',
    imageQualityGood: 'छवि गुणवत्ता: उत्तम ✓',
    imageQualityGoodDesc: 'ऑप्टिक डिस्क, मैक्युला और रक्त वाहिकाएं विश्लेषण हेतु स्पष्ट और केंद्रित हैं।',
    imageQualityPoor: 'छवि गुणवत्ता: खराब ⚠️',
    imageQualityPoorDesc: 'कृपया बेहतर फोकस, उचित प्रकाश या पुतली फैलाव के साथ दूसरी छवि लें।',
    analyzeImage: 'दृष्टि-X से विश्लेषण करें',
    
    // Analysis
    analysisTitle: 'एआई विश्लेषण जारी है...',
    analysisSubtitle: 'रेटिनल रक्त वाहिकाओं और विसंगतियों की पहचान की जा रही है',
    stageUploaded: 'छवि अपलोड व मानकीकृत',
    stageQuality: 'छवि स्पष्टता एवं प्रकाश जांच पूर्ण',
    stageDetecting: 'रेटिनल सूक्ष्म संरचनाओं का विश्लेषण',
    stageGenerating: 'जोखिम श्रेणी व कॉन्फिडेंस स्कोर गणना',
    stageExplanation: 'Grad-CAM दृश्य व्याख्या मानचित्र तैयार',
    analysisProgressNotice: 'यह मॉडल ग्रामीण क्षेत्रों हेतु ऑफलाइन-सक्षम है। परिणाम नेत्र विशेषज्ञ के अंतिम परामर्श हेतु तैयार किए जा रहे हैं।',
    cancelAnalysis: 'रद्द करें',
    
    // Result
    screeningResultTitle: 'एआई स्क्रीनिंग परिणाम',
    aiConfidence: 'मॉडल कॉन्फिडेंस',
    referralPriority: 'रेफरल प्राथमिकता',
    viewOriginal: 'मूल फंडस छवि',
    viewExplanation: 'एआई व्याख्या (Grad-CAM)',
    splitView: 'तुलनात्मक दृश्य',
    sliderOverlay: 'ओवरले हीटमैप',
    heatmapIntensity: 'हीटमैप पारदर्शिता',
    whyFlagged: 'यह परिणाम क्यों चिन्हित किया गया?',
    whyFlaggedExplanation: 'मॉडल का ध्यान मुख्य रूप से रेटिना के उन क्षेत्रों पर केंद्रित था जिन्होंने स्क्रीनिंग पूर्वानुमान को प्रभावित किया। हीटमैप उन गणितीय क्षेत्रों को दर्शाता है।',
    modelExplanationNote: 'ध्यान दें: हाइलाइट किए गए क्षेत्र मॉडल के ध्यान को दर्शाते हैं, यह निश्चित पैथोलॉजी नहीं है। चिकित्सीय परीक्षण आवश्यक है।',
    riskIndicatorLabel: 'ट्राइएज जोखिम स्तर',
    recommendedNextStep: 'अनुशंसित अगला कदम',
    viewDetailedReport: 'विस्तृत रिपोर्ट देखें',
    startNewScreening: 'नई स्क्रीनिंग शुरू करें',
    
    // Risk levels
    lowRisk: 'निम्न जोखिम (LOW)',
    moderateRisk: 'मध्यम जोखिम (MODERATE)',
    highRisk: 'उच्च जोखिम (HIGH)',
    urgentRisk: 'अति-आवश्यक रेफरल (URGENT)',
    
    // Grades
    gradeNoDR: 'डीआर के लक्षण नहीं मिले (No Apparent DR)',
    gradeMild: 'हल्का डायबिटिक रेटिनोपैथी संभावित (Mild DR)',
    gradeModerate: 'मध्यम डायबिटिक रेटिनोपैथी संभावित (Moderate DR)',
    gradeSevere: 'गंभीर डायबिटिक रेटिनोपैथी संभावित (Severe DR)',
    gradeProliferative: 'प्रोलिफ़ेरेटिव डायबिटिक रेटिनोपैथी संभावित',
    
    // Report
    reportTitle: 'डायबिटिक रेटिनोपैथी स्क्रीनिंग रिपोर्ट',
    downloadReport: 'रिपोर्ट डाउनलोड करें (PDF)',
    printReport: 'प्रिंट करें',
    screeningCenter: 'स्क्रीनिंग केंद्र',
    screeningTechnician: 'स्क्रीनिंग स्वास्थ्य कार्यकर्ता',
    clinicalEvaluationNotice: 'इस स्क्रीनिंग परिणाम के आधार पर योग्य नेत्र रोग विशेषज्ञ द्वारा क्लिनिकल जांच अनुशंसित है।',
    officialStamp: 'प्राथमिक स्वास्थ्य केंद्र सत्यापन मुहर',
    
    // History
    historyTitle: 'स्क्रीनिंग इतिहास एवं रजिस्टर',
    searchPlaceholder: 'मरीज कोड, केंद्र या परिणाम खोजें...',
    filterResult: 'परिणाम फिल्टर',
    filterPriority: 'प्राथमिकता फिल्टर',
    filterAll: 'सभी रिकॉर्ड्स',
    noRecordsFound: 'दिए गए मापदंड के अनुसार कोई रिकॉर्ड नहीं मिला।',
    
    // Settings
    settingsTitle: 'सिस्टम सेटिंग्स',
    healthWorkerProfile: 'स्वास्थ्य कार्यकर्ता प्रोफाइल',
    languageSelection: 'भाषा एवं सुलभता',
    offlineSyncStatus: 'ऑफलाइन सिंक व नेटवर्क मोड',
    dataPrivacy: 'डेटा गोपनीयता एवं नियम',
  }
};
