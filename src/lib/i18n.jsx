import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
const languages = [
  { code: "en", label: "English", native: "English", flag: "🇬🇧" },
  { code: "fr", label: "French", native: "Français", flag: "🇫🇷" },
  { code: "ar", label: "Arabic", native: "العربية", flag: "🇹🇳" },
];
const dictionary = {
  // nav / shell
  "nav.home": { en: "Home", fr: "Accueil", ar: "الرئيسية" },
  "nav.explore": { en: "Explore", fr: "Explorer", ar: "استكشاف" },
  "nav.categories": { en: "Categories", fr: "Catégories", ar: "الفئات" },
  "nav.myRequests": { en: "My Requests", fr: "Mes demandes", ar: "طلباتي" },
  "nav.myOffers": { en: "My Offers", fr: "Mes offres", ar: "عروضي" },
  "nav.messages": { en: "Messages", fr: "Messages", ar: "الرسائل" },
  "nav.notifications": { en: "Notifications", fr: "Notifications", ar: "الإشعارات" },
  "nav.alerts": { en: "Alerts", fr: "Alertes", ar: "تنبيهات" },
  "nav.profile": { en: "Profile", fr: "Profil", ar: "الملف الشخصي" },
  "nav.myProfile": { en: "My profile", fr: "Mon profil", ar: "ملفي الشخصي" },
  "nav.settings": { en: "Settings", fr: "Paramètres", ar: "الإعدادات" },
  "nav.logout": { en: "Log out", fr: "Se déconnecter", ar: "تسجيل الخروج" },
  "nav.postRequest": { en: "Post a Request", fr: "Publier une demande", ar: "انشر طلبًا" },
  "nav.menu": { en: "Menu", fr: "Menu", ar: "القائمة" },
  "nav.language": { en: "Language", fr: "Langue", ar: "اللغة" },
  // landing
  "landing.login": { en: "Log in", fr: "Connexion", ar: "تسجيل الدخول" },
  "landing.join": { en: "Join Talab", fr: "Rejoindre Talab", ar: "انضم إلى طلب" },
  "landing.badge": {
    en: "Tunisia's community of people who help",
    fr: "La communauté tunisienne de l'entraide",
    ar: "مجتمع تونس للمساعدة المتبادلة",
  },
  "landing.title1": { en: "Need something?", fr: "Besoin de quelque chose ?", ar: "تحتاج شيئًا؟" },
  "landing.title2": { en: "Ask Talab.", fr: "Demandez à Talab.", ar: "اسأل طلب." },
  "landing.subtitle": {
    en: "Connect with people who can help you, recommend someone, or offer their skills.",
    fr: "Entrez en contact avec des personnes qui peuvent vous aider, recommander quelqu'un ou proposer leurs compétences.",
    ar: "تواصل مع أشخاص يمكنهم مساعدتك أو ترشيح شخص ما أو تقديم مهاراتهم.",
  },
  "landing.explore": { en: "Explore Requests", fr: "Explorer les demandes", ar: "تصفح الطلبات" },
  "landing.stat1": { en: "requests posted", fr: "demandes publiées", ar: "طلب منشور" },
  "landing.stat2": { en: "people helping", fr: "personnes qui aident", ar: "شخص يساعد" },
  "landing.stat3": {
    en: "get a reply in a day",
    fr: "reçoivent une réponse en un jour",
    ar: "يتلقون ردًا خلال يوم",
  },
  "landing.heroAlt": {
    en: "Students, designers, photographers and technicians helping each other through Talab",
    fr: "Étudiants, designers, photographes et techniciens s'entraidant grâce à Talab",
    ar: "طلاب ومصممون ومصورون وفنيون يتعاونون عبر طلب",
  },
  "landing.f1.title": {
    en: "Ask in 2 minutes",
    fr: "Demandez en 2 minutes",
    ar: "اطلب في دقيقتين",
  },
  "landing.f1.text": {
    en: "Describe what you need, add a budget and a deadline. That's it.",
    fr: "Décrivez votre besoin, ajoutez un budget et une échéance. C'est tout.",
    ar: "صف ما تحتاجه، أضف الميزانية والموعد النهائي. هذا كل شيء.",
  },
  "landing.f2.title": {
    en: "Get real offers",
    fr: "Recevez de vraies offres",
    ar: "احصل على عروض حقيقية",
  },
  "landing.f2.text": {
    en: "People offer their help with a price and a delivery time you can compare.",
    fr: "Des personnes proposent leur aide avec un prix et un délai que vous pouvez comparer.",
    ar: "يقدم الناس مساعدتهم بسعر ومدة تسليم يمكنك مقارنتها.",
  },
  "landing.f3.title": {
    en: "Trust you can see",
    fr: "Une confiance visible",
    ar: "ثقة يمكنك رؤيتها",
  },
  "landing.f3.text": {
    en: "Ratings, completed work and response rates are on every profile.",
    fr: "Notes, travaux réalisés et taux de réponse sur chaque profil.",
    ar: "التقييمات والأعمال المنجزة ومعدلات الاستجابة في كل ملف شخصي.",
  },
  "landing.popular": {
    en: "Popular categories",
    fr: "Catégories populaires",
    ar: "الفئات الشائعة",
  },
  "landing.popularSub": {
    en: "Find the people who do what you need.",
    fr: "Trouvez les personnes qui font ce dont vous avez besoin.",
    ar: "اعثر على من يقوم بما تحتاجه.",
  },
  "landing.live": {
    en: "Live requests right now",
    fr: "Demandes en direct",
    ar: "طلبات مباشرة الآن",
  },
  "landing.seeAll": { en: "See all", fr: "Tout voir", ar: "عرض الكل" },
  "landing.ctaTitle": {
    en: "People have needs. People have skills. Talab connects them.",
    fr: "Des besoins d'un côté, des compétences de l'autre. Talab les relie.",
    ar: "أشخاص لديهم احتياجات وآخرون لديهم مهارات. طلب يجمع بينهم.",
  },
  "landing.createAccount": {
    en: "Create your account",
    fr: "Créer votre compte",
    ar: "أنشئ حسابك",
  },
  "landing.browseFirst": {
    en: "Browse requests first",
    fr: "Parcourir les demandes",
    ar: "تصفح الطلبات أولًا",
  },
  "landing.footer": {
    en: "© 2026 Talab · Made in Tunisia",
    fr: "© 2026 Talab · Fait en Tunisie",
    ar: "© 2026 طلب · صنع في تونس",
  },
  // auth
  "auth.welcomeBack": { en: "Welcome back", fr: "Bon retour", ar: "مرحبًا بعودتك" },
  "auth.loginSubtitle": {
    en: "Log in to see requests and continue helping people.",
    fr: "Connectez-vous pour voir les demandes et continuer à aider.",
    ar: "سجّل الدخول لرؤية الطلبات ومواصلة مساعدة الآخرين.",
  },
  "auth.noAccount": {
    en: "Don't have an account?",
    fr: "Pas encore de compte ?",
    ar: "ليس لديك حساب؟",
  },
  "auth.haveAccount": {
    en: "Already have an account?",
    fr: "Vous avez déjà un compte ?",
    ar: "لديك حساب بالفعل؟",
  },
  "auth.signup": { en: "Sign up", fr: "S'inscrire", ar: "إنشاء حساب" },
  "auth.login": { en: "Login", fr: "Se connecter", ar: "دخول" },
  "auth.email": { en: "Email", fr: "E-mail", ar: "البريد الإلكتروني" },
  "auth.password": { en: "Password", fr: "Mot de passe", ar: "كلمة المرور" },
  "auth.confirmPassword": {
    en: "Confirm password",
    fr: "Confirmer le mot de passe",
    ar: "تأكيد كلمة المرور",
  },
  "auth.fullName": { en: "Full name", fr: "Nom complet", ar: "الاسم الكامل" },
  "auth.location": { en: "Location", fr: "Localisation", ar: "الموقع" },
  "auth.locationPlaceholder": {
    en: "Where are you based?",
    fr: "Où êtes-vous basé ?",
    ar: "أين تقيم؟",
  },
  "auth.remember": { en: "Remember me", fr: "Se souvenir de moi", ar: "تذكرني" },
  "auth.forgot": { en: "Forgot password?", fr: "Mot de passe oublié ?", ar: "نسيت كلمة المرور؟" },
  "auth.or": { en: "or", fr: "ou", ar: "أو" },
  "auth.google": {
    en: "Continue with Google",
    fr: "Continuer avec Google",
    ar: "المتابعة عبر Google",
  },
  "auth.createTitle": { en: "Create your account", fr: "Créer votre compte", ar: "أنشئ حسابك" },
  "auth.createSubtitle": {
    en: "Ask for what you need. Help with what you know.",
    fr: "Demandez ce dont vous avez besoin. Aidez avec ce que vous savez.",
    ar: "اطلب ما تحتاجه، وساعد بما تعرفه.",
  },
  "auth.createButton": { en: "Create Account", fr: "Créer un compte", ar: "إنشاء الحساب" },
  "auth.terms": {
    en: "I agree to the Terms and Conditions",
    fr: "J'accepte les conditions générales",
    ar: "أوافق على الشروط والأحكام",
  },
  "auth.err.name": {
    en: "Enter your full name.",
    fr: "Saisissez votre nom complet.",
    ar: "أدخل اسمك الكامل.",
  },
  "auth.err.email": {
    en: "Enter a valid email address.",
    fr: "Saisissez une adresse e-mail valide.",
    ar: "أدخل بريدًا إلكترونيًا صالحًا.",
  },
  "auth.err.password6": {
    en: "Your password must be at least 6 characters.",
    fr: "Votre mot de passe doit contenir au moins 6 caractères.",
    ar: "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.",
  },
  "auth.err.password8": {
    en: "Use at least 8 characters.",
    fr: "Utilisez au moins 8 caractères.",
    ar: "استخدم 8 أحرف على الأقل.",
  },
  "auth.err.confirm": {
    en: "Passwords don't match.",
    fr: "Les mots de passe ne correspondent pas.",
    ar: "كلمتا المرور غير متطابقتين.",
  },
  "auth.err.location": {
    en: "Choose your location.",
    fr: "Choisissez votre localisation.",
    ar: "اختر موقعك.",
  },
  "auth.err.terms": {
    en: "You must accept the Terms and Conditions.",
    fr: "Vous devez accepter les conditions générales.",
    ar: "يجب أن توافق على الشروط والأحكام.",
  },
  "toast.welcomeBack": {
    en: "Welcome back to Talab",
    fr: "Bon retour sur Talab",
    ar: "مرحبًا بعودتك إلى طلب",
  },
  "toast.accountCreated": { en: "Account created", fr: "Compte créé", ar: "تم إنشاء الحساب" },
  "toast.accountCreatedDesc": {
    en: "Welcome to Talab!",
    fr: "Bienvenue sur Talab !",
    ar: "أهلًا بك في طلب!",
  },
  "toast.resetSent": {
    en: "Password reset link sent",
    fr: "Lien de réinitialisation envoyé",
    ar: "تم إرسال رابط إعادة التعيين",
  },
  "toast.checkInbox": {
    en: "Check your inbox.",
    fr: "Vérifiez votre boîte mail.",
    ar: "تحقق من بريدك.",
  },
  "toast.googleSoon": {
    en: "Google sign-in is coming soon",
    fr: "La connexion Google arrive bientôt",
    ar: "تسجيل الدخول عبر Google قريبًا",
  },
  "toast.googleSignupSoon": {
    en: "Google sign-up is coming soon",
    fr: "L'inscription Google arrive bientôt",
    ar: "التسجيل عبر Google قريبًا",
  },
  // profile
  "profile.editProfile": { en: "Edit Profile", fr: "Modifier le profil", ar: "تعديل الملف" },
  "profile.overview": { en: "Overview", fr: "Aperçu", ar: "نظرة عامة" },
  "profile.reviews": { en: "Reviews", fr: "Avis", ar: "التقييمات" },
  "profile.about": { en: "About", fr: "À propos", ar: "نبذة" },
  "profile.experience": { en: "Experience", fr: "Expérience", ar: "الخبرة" },
  "profile.education": { en: "Education", fr: "Formation", ar: "التعليم" },
  "profile.completedWork": { en: "Completed work", fr: "Travaux réalisés", ar: "الأعمال المنجزة" },
  "profile.nothingCompleted": {
    en: "Nothing completed yet — finished requests will be listed here.",
    fr: "Rien de terminé pour l'instant — les demandes finies apparaîtront ici.",
    ar: "لا شيء مكتمل بعد — ستظهر الطلبات المنتهية هنا.",
  },
  "profile.resume": { en: "Resume / CV", fr: "CV", ar: "السيرة الذاتية" },
  "profile.uploadResume": {
    en: "Upload your resume (PDF)",
    fr: "Téléverser votre CV (PDF)",
    ar: "ارفع سيرتك الذاتية (PDF)",
  },
  "profile.replace": { en: "Replace", fr: "Remplacer", ar: "استبدال" },
  "profile.remove": { en: "Remove", fr: "Supprimer", ar: "حذف" },
  "profile.skills": { en: "Skills", fr: "Compétences", ar: "المهارات" },
  "profile.editSkills": { en: "Edit skills", fr: "Modifier les compétences", ar: "تعديل المهارات" },
  "profile.rating": { en: "Rating", fr: "Note", ar: "التقييم" },
  "profile.completed": { en: "Completed", fr: "Terminés", ar: "مكتملة" },
  "profile.responseRate": { en: "Response rate", fr: "Taux de réponse", ar: "معدل الاستجابة" },
  "profile.avgResponse": { en: "Avg. response", fr: "Réponse moy.", ar: "متوسط الرد" },
  "profile.reviewsCount": { en: "reviews", fr: "avis", ar: "تقييمات" },
  "profile.requestsAndOffers": {
    en: "requests & offers",
    fr: "demandes et offres",
    ar: "طلبات وعروض",
  },
  "profile.noRequests": { en: "No requests yet", fr: "Aucune demande", ar: "لا توجد طلبات بعد" },
  "profile.noRequestsDesc": {
    en: "Post your first request and the community will answer.",
    fr: "Publiez votre première demande et la communauté répondra.",
    ar: "انشر طلبك الأول وسيرد المجتمع.",
  },
  "profile.viewRequest": { en: "View Request", fr: "Voir la demande", ar: "عرض الطلب" },
  "profile.days": { en: "days", fr: "jours", ar: "أيام" },
  "toast.pdfOnly": {
    en: "Only PDF files are accepted",
    fr: "Seuls les fichiers PDF sont acceptés",
    ar: "يُقبل ملف PDF فقط",
  },
  "toast.resumeUploaded": {
    en: "Resume uploaded",
    fr: "CV téléversé",
    ar: "تم رفع السيرة الذاتية",
  },
  "toast.resumeRemoved": { en: "Resume removed", fr: "CV supprimé", ar: "تم حذف السيرة الذاتية" },
  "common.justNow": { en: "Just now", fr: "À l'instant", ar: "الآن" },
};
const I18nContext = createContext(null);
const STORAGE_KEY = "talab.lang";
function I18nProvider({ children }) {
  const [lang, setLangState] = useState("en");
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && languages.some((l) => l.code === stored)) setLangState(stored);
  }, []);
  const dir = lang === "ar" ? "rtl" : "ltr";
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);
  const setLang = useCallback((l) => {
    setLangState(l);
    window.localStorage.setItem(STORAGE_KEY, l);
  }, []);
  const t = useCallback((key) => dictionary[key]?.[lang] ?? dictionary[key]?.en ?? key, [lang]);
  const value = useMemo(() => ({ lang, dir, setLang, t }), [lang, dir, setLang, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
function useT() {
  return useI18n().t;
}
export { I18nProvider, languages, useI18n, useT };
