import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  LayoutDashboard, ArrowLeftRight, Users, Target, History, Settings,
  Bell, Search, Plus, TrendingUp, TrendingDown, Wallet, PiggyBank,
  ChevronRight, X, Check, Clock, Globe, DollarSign, Moon,
  ArrowUpRight, ArrowDownRight, Calendar, AlertCircle
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';

const translations = {
  fr: {
    dir: 'ltr',
    appName: 'MyPocket',
    nav: { dashboard: 'Tableau de bord', transactions: 'Transactions', tontines: 'Tontines', planning: 'Planification', history: 'Historique', settings: 'Paramètres' },
    dashboard: {
      greeting: 'Bonjour',
      subtitle: "Voici l'état de vos finances",
      balance: 'Solde total',
      income: 'Revenus du mois',
      expense: 'Dépenses du mois',
      savings: 'Épargne tontine',
      vsLastMonth: 'vs mois dernier',
      cashflow: 'Flux financier',
      breakdown: 'Répartition des dépenses',
      recentTx: 'Transactions récentes',
      seeAll: 'Voir tout',
      upcomingTontine: 'Prochaine tontine',
      daysLeft: 'jours restants',
    },
    categories: {
      expense: {
        housing: 'Logement', electricity: 'Électricité', water: 'Eau', internet: 'Internet & Téléphone',
        food: 'Alimentation', transport: 'Transport', health: 'Santé', education: 'Éducation',
        leisure: 'Loisirs', clothing: 'Habillement', tontineOut: 'Cotisation tontine',
        giftOut: 'Cadeaux & Dons versés', debtRepayment: 'Remboursement de dette',
        insurance: 'Assurance', taxes: 'Impôts & Taxes', otherExpense: 'Autre dépense',
      },
      income: {
        salary: 'Salaire', business: 'Revenu commerce/activité', freelance: 'Freelance & Prestations',
        tontineIn: 'Tontine reçue', rentalIncome: 'Revenu locatif', investment: 'Investissement & Épargne',
        remittance: 'Transfert d\'argent reçu', giftIn: 'Cadeaux & Dons reçus', loan: 'Prêt / Emprunt reçu',
        otherIncome: 'Autre revenu',
      },
    },
    transactions: {
      title: 'Transactions', add: 'Ajouter', income: 'Revenu', expense: 'Dépense',
      amount: 'Montant', category: 'Catégorie', date: 'Date', note: 'Qu\'avez-vous payé ?', save: 'Enregistrer',
      filterAll: 'Tout', filterIncome: 'Revenus', filterExpense: 'Dépenses',
      notePlaceholderExpense: 'Ex: facture SENELEC, marché, essence...',
      notePlaceholderIncome: 'Ex: salaire, vente boutique...',
      categoryDetected: 'Catégorie détectée — touchez pour changer',
      categoryPick: 'Choisissez une catégorie',
    },
    tontine: {
      title: 'Tontines', create: 'Créer une tontine', members: 'Membres', contribution: 'Cotisation',
      frequency: 'Fréquence', nextTurn: 'Prochain tour', weekly: 'Hebdomadaire', monthly: 'Mensuel', daily: 'Journalier',
      totalPool: 'Cagnotte totale', myTurn: 'Mon tour', turnOf: 'Tour de', paid: 'Payé', pending: 'En attente', missed: 'Raté',
      history: 'Historique des tours', addMember: 'Ajouter un membre', basicMode: 'Mode simple', advancedMode: 'Mode avancé',
      round: 'Tour', notifyMe: "M'alerter à l'heure",
      youPaid: 'Vous avez cotisé', youNotPaid: "Vous n'avez pas encore cotisé",
      iPaid: "J'ai payé", notYet: 'Pas encore',
      // Création
      createTitle: 'Nouvelle tontine', tontineName: 'Nom de la tontine', tontineNamePlaceholder: 'Ex: Tontine entre amis',
      startDate: 'Date de début', endDate: 'Date de fin', amountPerPeriod: 'Montant à cotiser',
      howOften: 'À quelle fréquence ?', participants: 'Participants', participantName: 'Nom du participant',
      addParticipant: 'Ajouter', you: 'Vous (organisateur)', minParticipants: 'Ajoutez au moins 1 participant',
      createBtn: 'Créer la tontine', removeParticipant: 'Retirer',
      // Type de tontine
      tontineType: 'Type de tontine', typeShare: 'Partage à la fin', typeShareDesc: 'Tout le monde cotise, la somme est partagée à la fin',
      typeRotation: 'Tour par tour', typeRotationDesc: 'À chaque cycle, une personne différente ramasse la cagnotte',
      // Suivi organisateur
      manageParticipants: 'Suivi des participants', tapToChange: 'Touchez un statut pour le modifier',
      objective: 'Objectif', collected: 'Cotisé jusqu\'ici', period: 'Période', organizer: 'Organisateur',
      youAreOrganizer: 'Vous gérez cette tontine', viewOnly: 'Vue seule — géré par l\'organisateur',
      progressLabel: 'participants ont payé ce tour',
      // Solde / résumé
      totalContributed: 'Cotisé depuis le début', expenses: 'Dépenses', currentBalance: 'Solde actuel',
      roundsLeft: 'tours restants', roundsLeftShort: 'restants',
      // Recherche participant / annuaire
      searchUser: 'Rechercher un utilisateur', searchUserPlaceholder: 'Nom d\'utilisateur ou numéro de téléphone',
      searchUserHint: 'Retrouvez vos amis par leur nom d\'utilisateur ou numéro sur l\'app',
      noUserFound: 'Aucun utilisateur trouvé', addToTontine: 'Ajouter',
      alreadyAdded: 'Déjà ajouté', username: 'Nom d\'utilisateur', phone: 'Numéro',
      // Méthode de paiement
      paymentMethod: 'Mode de paiement', paymentMethodDesc: 'Vos infos de paiement local, réutilisées pour chaque cotisation',
      paymentProvider: 'Opérateur / Service', paymentAccountName: 'Nom du compte', paymentAccountNumber: 'Numéro de compte',
      paymentNotes: 'Instructions supplémentaires', savePaymentInfo: 'Enregistrer', editPaymentInfo: 'Modifier',
      paymentInfoSaved: 'Infos de paiement enregistrées', noPaymentInfo: 'Aucune information de paiement enregistrée',
      paymentProviderPlaceholder: 'Ex: Orange Money, Wave, Wari...',
      viewPaymentInfo: 'Voir les infos de paiement',
      // Admin / rôles
      adminOnly: 'Réservé à l\'administrateur', youAreAdmin: 'Vous êtes administrateur',
      markPaid: 'Marquer payé', markUnpaid: 'Marquer non payé', markMissed: 'Marquer raté',
      caseNumber: 'case', casesLeft: 'cases restantes',
    },
    planning: { title: 'Planification', goal: 'Objectif', target: 'Cible', deadline: 'Échéance', progress: 'Progression', addGoal: 'Nouvel objectif' },
    history: { title: 'Historique', compareMonths: 'Comparer les mois', thisMonth: 'Ce mois', lastMonth: 'Mois dernier', evolution: 'Évolution sur 6 mois' },
    settings: { title: 'Paramètres', language: 'Langue', currency: 'Devise', notifications: 'Notifications', theme: 'Thème', about: 'À propos' },
    notif: { title: 'Notifications', tontineReminder: 'Rappel tontine', budgetAlert: 'Alerte budget', markRead: 'Tout marquer comme lu' },
    common: { today: "Aujourd'hui", cancel: 'Annuler', close: 'Fermer', search: 'Rechercher', back: 'Retour' },
  },
  en: {
    dir: 'ltr',
    appName: 'MyPocket',
    nav: { dashboard: 'Dashboard', transactions: 'Transactions', tontines: 'Tontines', planning: 'Planning', history: 'History', settings: 'Settings' },
    dashboard: {
      greeting: 'Hello',
      subtitle: "Here's your financial overview",
      balance: 'Total balance',
      income: 'Income this month',
      expense: 'Expenses this month',
      savings: 'Tontine savings',
      vsLastMonth: 'vs last month',
      cashflow: 'Cash flow',
      breakdown: 'Expense breakdown',
      recentTx: 'Recent transactions',
      seeAll: 'See all',
      upcomingTontine: 'Upcoming tontine',
      daysLeft: 'days left',
    },
    categories: {
      expense: {
        housing: 'Housing', electricity: 'Electricity', water: 'Water', internet: 'Internet & Phone',
        food: 'Food', transport: 'Transport', health: 'Health', education: 'Education',
        leisure: 'Leisure', clothing: 'Clothing', tontineOut: 'Tontine contribution',
        giftOut: 'Gifts & Donations given', debtRepayment: 'Debt repayment',
        insurance: 'Insurance', taxes: 'Taxes', otherExpense: 'Other expense',
      },
      income: {
        salary: 'Salary', business: 'Business/Trade income', freelance: 'Freelance & Services',
        tontineIn: 'Tontine received', rentalIncome: 'Rental income', investment: 'Investment & Savings',
        remittance: 'Money transfer received', giftIn: 'Gifts & Donations received', loan: 'Loan received',
        otherIncome: 'Other income',
      },
    },
    transactions: {
      title: 'Transactions', add: 'Add', income: 'Income', expense: 'Expense',
      amount: 'Amount', category: 'Category', date: 'Date', note: 'What did you pay for?', save: 'Save',
      filterAll: 'All', filterIncome: 'Income', filterExpense: 'Expenses',
      notePlaceholderExpense: 'E.g: electricity bill, market, fuel...',
      notePlaceholderIncome: 'E.g: salary, shop sale...',
      categoryDetected: 'Category detected — tap to change',
      categoryPick: 'Pick a category',
    },
    tontine: {
      title: 'Tontines', create: 'Create a tontine', members: 'Members', contribution: 'Contribution',
      frequency: 'Frequency', nextTurn: 'Next turn', weekly: 'Weekly', monthly: 'Monthly', daily: 'Daily',
      totalPool: 'Total pool', myTurn: 'My turn', turnOf: "Turn of", paid: 'Paid', pending: 'Pending', missed: 'Missed',
      history: 'Round history', addMember: 'Add member', basicMode: 'Simple mode', advancedMode: 'Advanced mode',
      round: 'Round', notifyMe: 'Notify me on time',
      youPaid: 'You contributed', youNotPaid: "You haven't contributed yet",
      iPaid: 'I paid', notYet: 'Not yet',
      createTitle: 'New tontine', tontineName: 'Tontine name', tontineNamePlaceholder: 'E.g: Tontine with friends',
      startDate: 'Start date', endDate: 'End date', amountPerPeriod: 'Amount to contribute',
      howOften: 'How often?', participants: 'Participants', participantName: 'Participant name',
      addParticipant: 'Add', you: 'You (organizer)', minParticipants: 'Add at least 1 participant',
      createBtn: 'Create tontine', removeParticipant: 'Remove',
      tontineType: 'Tontine type', typeShare: 'Share at the end', typeShareDesc: 'Everyone contributes, the total is shared at the end',
      typeRotation: 'Rotation', typeRotationDesc: 'Each cycle, a different person collects the pool',
      manageParticipants: 'Participant tracking', tapToChange: 'Tap a status to change it',
      objective: 'Objective', collected: 'Collected so far', period: 'Period', organizer: 'Organizer',
      youAreOrganizer: 'You manage this tontine', viewOnly: 'View only — managed by organizer',
      progressLabel: 'participants have paid this round',
      totalContributed: 'Contributed since start', expenses: 'Expenses', currentBalance: 'Current balance',
      roundsLeft: 'rounds left', roundsLeftShort: 'left',
      searchUser: 'Search for a user', searchUserPlaceholder: 'Username or phone number',
      searchUserHint: 'Find your friends by their username or phone number on the app',
      noUserFound: 'No user found', addToTontine: 'Add',
      alreadyAdded: 'Already added', username: 'Username', phone: 'Phone',
      paymentMethod: 'Payment method', paymentMethodDesc: 'Your local payment info, reused for every contribution',
      paymentProvider: 'Provider / Service', paymentAccountName: 'Account name', paymentAccountNumber: 'Account number',
      paymentNotes: 'Additional instructions', savePaymentInfo: 'Save', editPaymentInfo: 'Edit',
      paymentInfoSaved: 'Payment info saved', noPaymentInfo: 'No payment information saved',
      paymentProviderPlaceholder: 'E.g: Orange Money, Wave, Wari...',
      viewPaymentInfo: 'View payment info',
      adminOnly: 'Admin only', youAreAdmin: 'You are the admin',
      markPaid: 'Mark paid', markUnpaid: 'Mark unpaid', markMissed: 'Mark missed',
      caseNumber: 'slot', casesLeft: 'slots left',
    },
    planning: { title: 'Planning', goal: 'Goal', target: 'Target', deadline: 'Deadline', progress: 'Progress', addGoal: 'New goal' },
    history: { title: 'History', compareMonths: 'Compare months', thisMonth: 'This month', lastMonth: 'Last month', evolution: '6-month evolution' },
    settings: { title: 'Settings', language: 'Language', currency: 'Currency', notifications: 'Notifications', theme: 'Theme', about: 'About' },
    notif: { title: 'Notifications', tontineReminder: 'Tontine reminder', budgetAlert: 'Budget alert', markRead: 'Mark all as read' },
    common: { today: 'Today', cancel: 'Cancel', close: 'Close', search: 'Search', back: 'Back' },
  },
  ar: {
    dir: 'rtl',
    appName: 'ماي بوكيت',
    nav: { dashboard: 'لوحة القيادة', transactions: 'المعاملات', tontines: 'الجمعيات', planning: 'التخطيط', history: 'السجل', settings: 'الإعدادات' },
    dashboard: {
      greeting: 'مرحباً',
      subtitle: 'إليك نظرة عامة على أموالك',
      balance: 'الرصيد الإجمالي',
      income: 'دخل هذا الشهر',
      expense: 'مصاريف هذا الشهر',
      savings: 'مدخرات الجمعية',
      vsLastMonth: 'مقارنة بالشهر الماضي',
      cashflow: 'التدفق المالي',
      breakdown: 'توزيع المصاريف',
      recentTx: 'المعاملات الأخيرة',
      seeAll: 'عرض الكل',
      upcomingTontine: 'الجمعية القادمة',
      daysLeft: 'أيام متبقية',
    },
    categories: {
      expense: {
        housing: 'سكن', electricity: 'كهرباء', water: 'ماء', internet: 'إنترنت وهاتف',
        food: 'طعام', transport: 'نقل', health: 'صحة', education: 'تعليم',
        leisure: 'ترفيه', clothing: 'ملابس', tontineOut: 'اشتراك الجمعية',
        giftOut: 'هدايا وتبرعات مقدمة', debtRepayment: 'تسديد دين',
        insurance: 'تأمين', taxes: 'ضرائب ورسوم', otherExpense: 'مصروف آخر',
      },
      income: {
        salary: 'راتب', business: 'دخل تجارة/نشاط', freelance: 'عمل حر وخدمات',
        tontineIn: 'استلام الجمعية', rentalIncome: 'دخل إيجار', investment: 'استثمار وادخار',
        remittance: 'حوالة مالية مستلمة', giftIn: 'هدايا وتبرعات مستلمة', loan: 'قرض مستلم',
        otherIncome: 'دخل آخر',
      },
    },
    transactions: {
      title: 'المعاملات', add: 'إضافة', income: 'دخل', expense: 'مصروف',
      amount: 'المبلغ', category: 'الفئة', date: 'التاريخ', note: 'ماذا دفعت؟', save: 'حفظ',
      filterAll: 'الكل', filterIncome: 'الدخل', filterExpense: 'المصاريف',
      notePlaceholderExpense: 'مثال: فاتورة الكهرباء، السوق، بنزين...',
      notePlaceholderIncome: 'مثال: راتب، بيع بضاعة...',
      categoryDetected: 'تم تحديد الفئة — اضغط للتغيير',
      categoryPick: 'اختر فئة',
    },
    tontine: {
      title: 'الجمعيات', create: 'إنشاء جمعية', members: 'الأعضاء', contribution: 'الاشتراك',
      frequency: 'التكرار', nextTurn: 'الدور القادم', weekly: 'أسبوعي', monthly: 'شهري', daily: 'يومي',
      totalPool: 'إجمالي الصندوق', myTurn: 'دوري', turnOf: 'دور', paid: 'مدفوع', pending: 'قيد الانتظار', missed: 'فائت',
      history: 'سجل الأدوار', addMember: 'إضافة عضو', basicMode: 'وضع بسيط', advancedMode: 'وضع متقدم',
      round: 'الدورة', notifyMe: 'نبهني في الوقت المحدد',
      youPaid: 'لقد دفعت اشتراكك', youNotPaid: 'لم تدفع اشتراكك بعد',
      iPaid: 'لقد دفعت', notYet: 'ليس بعد',
      createTitle: 'جمعية جديدة', tontineName: 'اسم الجمعية', tontineNamePlaceholder: 'مثال: جمعية الأصدقاء',
      startDate: 'تاريخ البدء', endDate: 'تاريخ الانتهاء', amountPerPeriod: 'مبلغ الاشتراك',
      howOften: 'ما هو التكرار؟', participants: 'المشاركون', participantName: 'اسم المشارك',
      addParticipant: 'إضافة', you: 'أنت (المنظم)', minParticipants: 'أضف مشاركًا واحدًا على الأقل',
      createBtn: 'إنشاء الجمعية', removeParticipant: 'إزالة',
      tontineType: 'نوع الجمعية', typeShare: 'تقاسم في النهاية', typeShareDesc: 'يساهم الجميع، ويتم تقاسم المجموع في النهاية',
      typeRotation: 'دور بدور', typeRotationDesc: 'في كل دورة، يجمع شخص مختلف الصندوق',
      manageParticipants: 'متابعة المشاركين', tapToChange: 'اضغط على حالة لتغييرها',
      objective: 'الهدف', collected: 'تم جمعه حتى الآن', period: 'الفترة', organizer: 'المنظم',
      youAreOrganizer: 'أنت تدير هذه الجمعية', viewOnly: 'عرض فقط — يديرها المنظم',
      progressLabel: 'مشاركين دفعوا في هذه الجولة',
      totalContributed: 'تم جمعه منذ البداية', expenses: 'المصاريف', currentBalance: 'الرصيد الحالي',
      roundsLeft: 'أدوار متبقية', roundsLeftShort: 'متبقية',
      searchUser: 'البحث عن مستخدم', searchUserPlaceholder: 'اسم المستخدم أو رقم الهاتف',
      searchUserHint: 'ابحث عن أصدقائك باسم المستخدم أو رقم الهاتف على التطبيق',
      noUserFound: 'لم يتم العثور على مستخدم', addToTontine: 'إضافة',
      alreadyAdded: 'تمت إضافته بالفعل', username: 'اسم المستخدم', phone: 'رقم الهاتف',
      paymentMethod: 'طريقة الدفع', paymentMethodDesc: 'معلومات الدفع المحلية الخاصة بك، تُستخدم لكل اشتراك',
      paymentProvider: 'المزود / الخدمة', paymentAccountName: 'اسم الحساب', paymentAccountNumber: 'رقم الحساب',
      paymentNotes: 'تعليمات إضافية', savePaymentInfo: 'حفظ', editPaymentInfo: 'تعديل',
      paymentInfoSaved: 'تم حفظ معلومات الدفع', noPaymentInfo: 'لا توجد معلومات دفع محفوظة',
      paymentProviderPlaceholder: 'مثال: أورنج موني، Wave، واري...',
      viewPaymentInfo: 'عرض معلومات الدفع',
      adminOnly: 'خاص بالمسؤول', youAreAdmin: 'أنت المسؤول',
      markPaid: 'وضع علامة مدفوع', markUnpaid: 'وضع علامة غير مدفوع', markMissed: 'وضع علامة فائت',
      caseNumber: 'خانة', casesLeft: 'خانات متبقية',
    },
    planning: { title: 'التخطيط', goal: 'الهدف', target: 'المستهدف', deadline: 'الموعد النهائي', progress: 'التقدم', addGoal: 'هدف جديد' },
    history: { title: 'السجل', compareMonths: 'مقارنة الأشهر', thisMonth: 'هذا الشهر', lastMonth: 'الشهر الماضي', evolution: 'التطور خلال 6 أشهر' },
    settings: { title: 'الإعدادات', language: 'اللغة', currency: 'العملة', notifications: 'الإشعارات', theme: 'المظهر', about: 'حول' },
    notif: { title: 'الإشعارات', tontineReminder: 'تذكير الجمعية', budgetAlert: 'تنبيه الميزانية', markRead: 'وضع علامة على الكل كمقروء' },
    common: { today: 'اليوم', cancel: 'إلغاء', close: 'إغلاق', search: 'بحث', back: 'رجوع' },
  },
};

const currencies = {
  USD: { symbol: '$', rate: 1, name: 'US Dollar' },
  EUR: { symbol: '€', rate: 0.92, name: 'Euro' },
  XOF: { symbol: 'FCFA', rate: 605, name: 'Franc CFA (UEMOA)' },
  XAF: { symbol: 'FCFA', rate: 605, name: 'Franc CFA (CEMAC)' },
  NGN: { symbol: '₦', rate: 1550, name: 'Naira' },
  GHS: { symbol: 'GH₵', rate: 14.8, name: 'Cedi' },
  MAD: { symbol: 'DH', rate: 9.9, name: 'Dirham marocain' },
  EGP: { symbol: 'E£', rate: 49.5, name: 'Livre égyptienne' },
  ZAR: { symbol: 'R', rate: 18.3, name: 'Rand' },
  KES: { symbol: 'KSh', rate: 129, name: 'Shilling kényan' },
  DZD: { symbol: 'DA', rate: 134, name: 'Dinar algérien' },
  TND: { symbol: 'DT', rate: 3.1, name: 'Dinar tunisien' },
};


// Toutes les données sont en USD de base, converties à l'affichage

const monthlyHistory = [
  { month: 'Jan', income: 2400, expense: 1650 },
  { month: 'Fév', income: 2400, expense: 1820 },
  { month: 'Mar', income: 2600, expense: 1590 },
  { month: 'Avr', income: 2400, expense: 1980 },
  { month: 'Mai', income: 2750, expense: 1720 },
  { month: 'Jun', income: 2400, expense: 1540 },
  { month: 'Jul', income: 2900, expense: 1680 },
];

const expenseBreakdown = [
  { category: 'housing', value: 520, color: '#00D9A3' },
  { category: 'food', value: 340, color: '#FFB020' },
  { category: 'transport', value: 210, color: '#5B9FFF' },
  { category: 'tontineOut', value: 200, color: '#FF7ED4' },
  { category: 'health', value: 150, color: '#FF5C5C' },
  { category: 'leisure', value: 130, color: '#9B7EFF' },
  { category: 'otherExpense', value: 130, color: '#7A8699' },
];

const transactions = [
  { id: 1, type: 'income', category: 'salary', amount: 1800, date: '2026-07-01', note: 'Salaire juillet' },
  { id: 2, type: 'expense', category: 'housing', amount: 520, date: '2026-07-01', note: 'Loyer' },
  { id: 3, type: 'expense', category: 'food', amount: 85, date: '2026-07-02', note: 'Marché' },
  { id: 4, type: 'income', category: 'business', amount: 350, date: '2026-07-02', note: 'Vente boutique' },
  { id: 5, type: 'expense', category: 'transport', amount: 40, date: '2026-07-03', note: 'Essence' },
  { id: 6, type: 'expense', category: 'tontineOut', amount: 100, date: '2026-07-03', note: 'Cotisation tontine Famille' },
  { id: 7, type: 'expense', category: 'health', amount: 60, date: '2026-07-04', note: 'Pharmacie' },
  { id: 8, type: 'income', category: 'salary', amount: 750, date: '2026-07-04', note: 'Prime' },
  { id: 9, type: 'expense', category: 'leisure', amount: 45, date: '2026-06-28', note: 'Cinéma' },
  { id: 10, type: 'expense', category: 'education', amount: 120, date: '2026-06-25', note: 'Frais scolaires' },
];

// Annuaire des utilisateurs de l'application — permet de retrouver un ami par
// son nom d'utilisateur OU son numéro de téléphone pour l'ajouter à une tontine.
const appUsers = [
  { id: 101, username: 'aminata_d', phone: '+221 77 123 45 01', displayName: 'Aminata D.' },
  { id: 102, username: 'moussa_k', phone: '+221 76 234 56 02', displayName: 'Moussa K.' },
  { id: 103, username: 'fatou_s', phone: '+221 78 345 67 03', displayName: 'Fatou S.' },
  { id: 104, username: 'ibrahim_t', phone: '+221 77 456 78 04', displayName: 'Ibrahim T.' },
  { id: 105, username: 'aicha_b', phone: '+221 76 567 89 05', displayName: 'Aïcha B.' },
  { id: 106, username: 'ousmane_n', phone: '+221 78 678 90 06', displayName: 'Ousmane N.' },
  { id: 107, username: 'mariam_c', phone: '+221 77 789 01 07', displayName: 'Mariam C.' },
  { id: 108, username: 'kwame_a', phone: '+233 24 111 22 08', displayName: 'Kwame A.' },
  { id: 109, username: 'grace_o', phone: '+233 20 222 33 09', displayName: 'Grace O.' },
  { id: 110, username: 'chidi_e', phone: '+234 80 333 44 10', displayName: 'Chidi E.' },
  { id: 111, username: 'nala_m', phone: '+234 81 444 55 11', displayName: 'Nala M.' },
  { id: 999, username: 'moi_amara', phone: '+221 77 000 00 00', displayName: 'Vous' },
];

const tontines = [
  {
    id: 1,
    name: 'Tontine Famille Diallo',
    type: 'rotation', // 'rotation' = un tour ramasse tout | 'share' = partage à la fin
    contribution: 100,
    frequency: 'monthly',
    membersCount: 8,
    totalPool: 800,
    myPosition: 5,
    currentRound: 3,
    totalRounds: 8,
    startDate: '2026-05-01',
    endDate: '2027-01-01',
    nextDate: '2026-07-15T18:00:00',
    createdByMe: true,
    expenses: 15,
    paymentInfo: {
      provider: 'Orange Money',
      accountName: 'Amara Diallo',
      accountNumber: '+221 77 000 00 00',
      notes: 'Envoyer avant le 15 de chaque mois',
    },
    members: [
      { id: 1, userId: 101, name: 'Aminata D.', username: 'aminata_d', status: 'paid', turnRound: 1 },
      { id: 2, userId: 102, name: 'Moussa K.', username: 'moussa_k', status: 'paid', turnRound: 2 },
      { id: 3, userId: 103, name: 'Fatou S.', username: 'fatou_s', status: 'missed', turnRound: 3 },
      { id: 4, userId: 104, name: 'Ibrahim T.', username: 'ibrahim_t', status: 'pending', turnRound: 4 },
      { id: 5, userId: 999, name: 'Vous', username: 'moi_amara', status: 'pending', turnRound: 5 },
      { id: 6, userId: 105, name: 'Aïcha B.', username: 'aicha_b', status: 'pending', turnRound: 6 },
      { id: 7, userId: 106, name: 'Ousmane N.', username: 'ousmane_n', status: 'pending', turnRound: 7 },
      { id: 8, userId: 107, name: 'Mariam C.', username: 'mariam_c', status: 'pending', turnRound: 8 },
    ],
  },
  {
    id: 2,
    name: 'Tontine Collègues Bureau',
    type: 'share',
    contribution: 50,
    frequency: 'weekly',
    membersCount: 5,
    totalPool: 250,
    myPosition: 2,
    currentRound: 1,
    totalRounds: 5,
    startDate: '2026-06-01',
    endDate: '2026-09-01',
    nextDate: '2026-07-08T09:00:00',
    createdByMe: false,
    expenses: 0,
    paymentInfo: null,
    members: [
      { id: 1, userId: 108, name: 'Kwame A.', username: 'kwame_a', status: 'pending', turnRound: 1 },
      { id: 2, userId: 999, name: 'Vous', username: 'moi_amara', status: 'pending', turnRound: 2 },
      { id: 3, userId: 109, name: 'Grace O.', username: 'grace_o', status: 'pending', turnRound: 3 },
      { id: 4, userId: 110, name: 'Chidi E.', username: 'chidi_e', status: 'pending', turnRound: 4 },
      { id: 5, userId: 111, name: 'Nala M.', username: 'nala_m', status: 'pending', turnRound: 5 },
    ],
  },
];

const goals = [
  { id: 1, name: 'Fonds d\'urgence', target: 2000, current: 1350, deadline: '2026-12-31' },
  { id: 2, name: 'Achat moto', target: 1500, current: 620, deadline: '2026-10-15' },
  { id: 3, name: 'Voyage famille', target: 800, current: 800, deadline: '2026-08-01' },
];

const notificationsData = [
  { id: 1, type: 'tontine', title: 'Cotisation tontine due demain', time: 'Il y a 2h', read: false },
  { id: 2, type: 'budget', title: 'Budget "Loisirs" à 80%', time: 'Il y a 5h', read: false },
  { id: 3, type: 'tontine', title: 'Tour de Fatou S. dans 3 jours', time: 'Hier', read: true },
];



// ---------- Utility: animated number (odometer signature) ----------
function AnimatedNumber({ value, decimals = 0 }) {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef();
  useEffect(() => {
    const duration = 900;
    const start = performance.now();
    const from = display;
    const to = value;
    function tick(now) {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(from + (to - from) * eased);
      if (p < 1) frameRef.current = requestAnimationFrame(tick);
    }
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
    // eslint-disable-next-line
  }, [value]);
  return <>{display.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}</>;
}

// ---------- Auto-category detection from free text ----------
// Reconnaît des mots-clés courants (FR/EN/AR + marques africaines connues)
// pour suggérer automatiquement une catégorie sans que l'utilisateur ait à réfléchir.
// Séparé par type (dépense / revenu) pour éviter toute ambiguïté :
// un même mot ("tontine", "cadeau"...) peut désigner une entrée ou une sortie d'argent,
// donc la détection ne cherche que dans la liste correspondant au type déjà choisi.
const categoryKeywords = {
  expense: {
    electricity: ['electricite', 'électricité', 'electricity', 'courant', 'senelec', 'eneo', 'cie', 'sonabel', 'compteur', 'kwh', 'facture elec', 'كهرباء'],
    water: ['eau', 'water', 'sde', 'onea', 'sodeci', 'facture eau', 'robinet', 'ماء'],
    internet: ['internet', 'wifi', 'telephone', 'téléphone', 'credit', 'crédit', 'forfait', 'orange', 'mtn', 'moov', 'airtel', 'wave', 'free', 'canal+', 'canal', 'انترنت', 'هاتف'],
    housing: ['loyer', 'rent', 'maison', 'appartement', 'bailleur', 'logement', 'housing', 'إيجار', 'سكن'],
    food: ['marche', 'marché', 'nourriture', 'food', 'restaurant', 'riz', 'repas', 'supermarche', 'supermarché', 'epicerie', 'épicerie', 'boisson', 'طعام', 'أكل', 'سوق'],
    transport: ['essence', 'carburant', 'transport', 'taxi', 'bus', 'moto', 'gasoil', 'uber', 'yango', 'gozem', 'نقل', 'بنزين'],
    health: ['pharmacie', 'medecin', 'médecin', 'hopital', 'hôpital', 'health', 'sante', 'santé', 'medicament', 'médicament', 'clinique', 'صحة', 'دواء', 'مستشفى'],
    education: ['ecole', 'école', 'scolaire', 'education', 'éducation', 'universite', 'université', 'frais scolaire', 'livre', 'fourniture', 'تعليم', 'مدرسة'],
    leisure: ['cinema', 'cinéma', 'sortie', 'fun', 'loisir', 'plaisir', 'jeu', 'fete', 'fête', 'concert', 'netflix', 'spotify', 'ترفيه'],
    clothing: ['vetement', 'vêtement', 'habit', 'chaussure', 'clothing', 'boutique mode', 'ملابس', 'حذاء'],
    tontineOut: ['cotisation tontine', 'cotisation', 'verser tontine', 'اشتراك الجمعية', 'اشتراك'],
    giftOut: ['cadeau offert', 'don fait', 'aide famille', 'j\'offre', 'هدية مقدمة', 'تبرع'],
    debtRepayment: ['rembourser', 'remboursement', 'dette', 'repay', 'debt', 'تسديد', 'دين'],
    insurance: ['assurance', 'insurance', 'تأمين'],
    taxes: ['impot', 'impôt', 'taxe', 'tax', 'ضريبة', 'رسوم'],
  },
  income: {
    salary: ['salaire', 'salary', 'paie', 'prime', 'راتب'],
    business: ['vente', 'boutique', 'commerce', 'business', 'client', 'تجارة'],
    freelance: ['freelance', 'prestation', 'mission', 'contrat client', 'عمل حر'],
    tontineIn: ['tontine reçue', 'reçu tontine', 'tour tontine', 'استلام الجمعية'],
    rentalIncome: ['loyer reçu', 'location', 'locataire', 'rental income', 'دخل إيجار'],
    investment: ['dividende', 'interet', 'intérêt', 'placement', 'investment', 'استثمار'],
    remittance: ['transfert', 'virement reçu', 'money gram', 'western union', 'remittance', 'حوالة'],
    giftIn: ['cadeau reçu', 'don reçu', 'gift', 'هدية مستلمة'],
    loan: ['pret', 'prêt', 'emprunt', 'loan', 'قرض'],
  },
};

function detectCategory(text, type = 'expense') {
  if (!text) return null;
  const normalized = text.toLowerCase();
  const table = categoryKeywords[type] || categoryKeywords.expense;
  for (const [category, keywords] of Object.entries(table)) {
    if (keywords.some(k => normalized.includes(k))) return category;
  }
  return null;
}

// Icônes par catégorie — une seule source de vérité, partagée entre toutes les langues.
const categoryIcons = {
  housing: '🏠', electricity: '💡', water: '💧', internet: '📶', food: '🍲',
  transport: '🚗', health: '💊', education: '🎓', leisure: '🎉', clothing: '👕',
  tontineOut: '🤝', giftOut: '🎁', debtRepayment: '💳', insurance: '🛡️', taxes: '🧾', otherExpense: '📦',
  salary: '💰', business: '🏪', freelance: '💼', tontineIn: '🤝', rentalIncome: '🏢',
  investment: '📈', remittance: '📤', giftIn: '🎁', loan: '🏦', otherIncome: '📦',
};

// Renvoie le libellé correct d'une catégorie en tenant compte de son type (dépense/revenu) —
// évite toute ambiguïté entre les deux tables qui ne partagent plus aucune clé.
function getCategoryLabel(t, type, category) {
  return t.categories[type]?.[category] || category;
}


function fmtMoney(amountUSD, currencyCode) {
  const c = currencies[currencyCode];
  const converted = amountUSD * c.rate;
  const decimals = c.rate > 100 ? 0 : 2;
  return { value: converted, symbol: c.symbol, decimals };
}

function Money({ amountUSD, currency, className = '', signed = false }) {
  const { value, symbol, decimals } = fmtMoney(amountUSD, currency);
  const sign = signed ? (amountUSD >= 0 ? '+' : '−') : '';
  return (
    <span className={className}>
      {sign}<AnimatedNumber value={Math.abs(value)} decimals={decimals} /> <span className="currency-symbol">{symbol}</span>
    </span>
  );
}

// ---------- Toast notification ----------
function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3200);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className="toast">
      <Bell size={16} />
      <span>{message}</span>
    </div>
  );
}

function App() {
  const [lang, setLang] = useState('fr');
  const [currency, setCurrency] = useState('XOF');
  const [view, setView] = useState('dashboard');
  const [tx, setTx] = useState(transactions);
  const [tontineList, setTontineList] = useState(tontines);
  const [notifs, setNotifs] = useState(notificationsData);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [showAddTx, setShowAddTx] = useState(false);
  const [showAddTontine, setShowAddTontine] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [tontineMode, setTontineMode] = useState('basic');
  const [selectedTontineId, setSelectedTontineId] = useState(null);
  const [txFilter, setTxFilter] = useState('all');
  // Infos de paiement local par défaut de l'utilisateur — saisies une fois,
  // réutilisées automatiquement pour chaque nouvelle tontine qu'il crée.
  const [myPaymentInfo, setMyPaymentInfo] = useState(null);


  const t = translations[lang];
  const isRTL = t.dir === 'rtl';

  useEffect(() => {
    document.documentElement.dir = t.dir;
    document.documentElement.lang = lang;
  }, [lang, t.dir]);

  // Simulate a scheduled tontine notification firing "at the exact hour"
  useEffect(() => {
    const timer = setTimeout(() => {
      pushToast(lang === 'ar' ? 'حان وقت اشتراك الجمعية!' : lang === 'en' ? "It's time for your tontine contribution!" : "C'est l'heure de votre cotisation tontine !");
    }, 6000);
    return () => clearTimeout(timer);
  }, [lang]);

  function pushToast(message) {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
  }

  // L'utilisateur confirme (ou annule) sa cotisation d'un tap depuis la carte tontine.
  // Si confirmé : ça crée automatiquement la transaction "Tontine" — il n'a rien à retaper.
  // Si annulé : ça retire la transaction si elle avait été ajoutée par erreur.
  function handleTontinePayment(tontineId, didPay) {
    let tontineName = '';
    let contributionAmount = 0;

    setTontineList(prev => prev.map(tn => {
      if (tn.id !== tontineId) return tn;
      tontineName = tn.name;
      contributionAmount = tn.contribution;
      return {
        ...tn,
        members: tn.members.map(m =>
          m.name === 'Vous' ? { ...m, status: didPay ? 'paid' : 'pending' } : m
        ),
      };
    }));

    setTx(prev => {
      const withoutThisTontine = prev.filter(x => x.tontineId !== tontineId);
      if (!didPay) return withoutThisTontine;
      return [
        {
          id: Date.now(),
          type: 'expense',
          category: 'tontineOut',
          amount: contributionAmount,
          date: new Date().toISOString().slice(0, 10),
          note: tontineName,
          tontineId,
        },
        ...withoutThisTontine,
      ];
    });

    pushToast(
      didPay
        ? (lang === 'ar' ? 'تم تسجيل الدفع بنجاح' : lang === 'en' ? 'Payment recorded' : 'Paiement enregistré')
        : (lang === 'ar' ? 'تم الإلغاء' : lang === 'en' ? 'Marked as not paid' : 'Marqué comme non payé')
    );
  }

  // L'organisateur (= administrateur) crée une nouvelle tontine : nom, dates, montant,
  // fréquence, type (rotation ou partage à la fin), et participants choisis dans l'annuaire.
  // "Vous" est ajouté automatiquement comme administrateur et premier participant.
  // Les infos de paiement local de l'admin sont reprises automatiquement si déjà enregistrées.
  function handleCreateTontine({ name, startDate, endDate, contribution, frequency, type, selectedUsers, paymentInfo }) {
    const members = [
      { id: 1, userId: 999, name: 'Vous', username: 'moi_amara', status: 'pending', turnRound: 1 },
      ...selectedUsers.map((u, idx) => ({
        id: idx + 2,
        userId: u.id,
        name: u.displayName,
        username: u.username,
        status: 'pending',
        turnRound: idx + 2,
      })),
    ];
    const newTontine = {
      id: Date.now(),
      name,
      type: type || 'rotation',
      contribution,
      frequency,
      membersCount: members.length,
      totalPool: contribution * members.length,
      myPosition: 1,
      currentRound: 1,
      totalRounds: members.length,
      startDate,
      endDate,
      nextDate: `${startDate}T18:00:00`,
      createdByMe: true,
      expenses: 0,
      paymentInfo: paymentInfo || myPaymentInfo || null,
      members,
    };
    if (paymentInfo) setMyPaymentInfo(paymentInfo);
    setTontineList(prev => [newTontine, ...prev]);
    setShowAddTontine(false);
    pushToast(lang === 'ar' ? 'تم إنشاء الجمعية بنجاح' : lang === 'en' ? 'Tontine created' : 'Tontine créée avec succès');
  }

  // Seul l'administrateur (créateur de la tontine) peut changer le statut de
  // N'IMPORTE QUEL participant : payé / en attente / raté.
  // C'est ce qui permet de "monter" un participant comme payé quand il a viré
  // son argent en dehors de l'app. Visible en temps réel par tout le groupe,
  // mais les autres participants ne peuvent pas modifier — juste consulter.
  function handleMemberStatusChange(tontineId, memberId, newStatus) {
    setTontineList(prev => prev.map(tn => {
      if (tn.id !== tontineId) return tn;
      return {
        ...tn,
        members: tn.members.map(m => m.id === memberId ? { ...m, status: newStatus } : m),
      };
    }));
    pushToast(
      newStatus === 'paid'
        ? (lang === 'ar' ? 'تم تحديث الحالة: مدفوع' : lang === 'en' ? 'Status updated: paid' : 'Statut mis à jour : payé')
        : newStatus === 'missed'
        ? (lang === 'ar' ? 'تم تحديث الحالة: فائت' : lang === 'en' ? 'Status updated: missed' : 'Statut mis à jour : raté')
        : (lang === 'ar' ? 'تم تحديث الحالة: قيد الانتظار' : lang === 'en' ? 'Status updated: pending' : 'Statut mis à jour : en attente')
    );
  }

  // L'administrateur enregistre/modifie ses infos de paiement local, réutilisées
  // automatiquement pour toutes ses futures tontines (pas besoin de les retaper).
  function handleSavePaymentInfo(tontineId, paymentInfo) {
    setMyPaymentInfo(paymentInfo);
    if (tontineId) {
      setTontineList(prev => prev.map(tn => tn.id === tontineId ? { ...tn, paymentInfo } : tn));
    }
    pushToast(lang === 'ar' ? 'تم حفظ معلومات الدفع' : lang === 'en' ? 'Payment info saved' : 'Infos de paiement enregistrées');
  }

  const totalIncome = useMemo(() => tx.filter(x => x.type === 'income').reduce((s, x) => s + x.amount, 0), [tx]);
  const totalExpense = useMemo(() => tx.filter(x => x.type === 'expense').reduce((s, x) => s + x.amount, 0), [tx]);
  const balance = totalIncome - totalExpense + 3200; // base balance
  const tontineSavings = 800;

  const lastMonthIncome = monthlyHistory[monthlyHistory.length - 2].income;
  const lastMonthExpense = monthlyHistory[monthlyHistory.length - 2].expense;
  const incomeChange = ((totalIncome - lastMonthIncome) / lastMonthIncome * 100);
  const expenseChange = ((totalExpense - lastMonthExpense) / lastMonthExpense * 100);

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: t.nav.dashboard },
    { id: 'transactions', icon: ArrowLeftRight, label: t.nav.transactions },
    { id: 'tontines', icon: Users, label: t.nav.tontines },
    { id: 'planning', icon: Target, label: t.nav.planning },
    { id: 'history', icon: History, label: t.nav.history },
    { id: 'settings', icon: Settings, label: t.nav.settings },
  ];

  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <div className="app-shell" dir={t.dir}>
      <style>{styles}</style>

      {/* ---------- Sidebar ---------- */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">F</div>
          <span className="brand-name">{t.appName}</span>
        </div>
        <nav className="nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${view === item.id ? 'active' : ''}`}
              onClick={() => { setView(item.id); setSelectedTontineId(null); }}
            >
              <item.icon size={19} strokeWidth={2} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="mini-balance">
            <span className="mini-label">{t.dashboard.balance}</span>
            <Money amountUSD={balance} currency={currency} className="mini-amount" />
          </div>
        </div>
      </aside>

      {/* ---------- Main ---------- */}
      <div className="main-col">
        <header className="topbar">
          <div className="topbar-search">
            <Search size={16} />
            <input placeholder={t.common.search} />
          </div>
          <div className="topbar-actions">
            <div className="lang-switch">
              {['fr', 'en', 'ar'].map(l => (
                <button key={l} className={lang === l ? 'active' : ''} onClick={() => setLang(l)}>{l.toUpperCase()}</button>
              ))}
            </div>
            <select className="currency-select" value={currency} onChange={e => setCurrency(e.target.value)}>
              {Object.entries(currencies).map(([code, c]) => (
                <option key={code} value={code}>{code} — {c.symbol}</option>
              ))}
            </select>
            <button className="icon-btn" onClick={() => setShowNotifPanel(true)}>
              <Bell size={18} />
              {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
            </button>
            <div className="avatar">A</div>
          </div>
        </header>

        <main className="content">
          {view === 'dashboard' && (
            <DashboardView
              t={t} currency={currency} balance={balance} totalIncome={totalIncome}
              totalExpense={totalExpense} tontineSavings={tontineSavings}
              incomeChange={incomeChange} expenseChange={expenseChange}
              tx={tx} setView={setView} isRTL={isRTL}
            />
          )}
          {view === 'transactions' && (
            <TransactionsView t={t} currency={currency} tx={tx} filter={txFilter} setFilter={setTxFilter} onAdd={() => setShowAddTx(true)} />
          )}
          {view === 'tontines' && !selectedTontineId && (
            <TontinesView
              t={t} currency={currency}
              onAdd={() => setShowAddTontine(true)} lang={lang}
              tontineList={tontineList}
              onSelect={(id) => setSelectedTontineId(id)}
            />
          )}
          {view === 'tontines' && selectedTontineId && (
            <TontineDetailView
              t={t} currency={currency} mode={tontineMode} setMode={setTontineMode}
              onNotify={pushToast} lang={lang}
              tontine={tontineList.find(tn => tn.id === selectedTontineId)}
              onBack={() => setSelectedTontineId(null)}
              onTogglePayment={handleTontinePayment}
              onMemberStatusChange={handleMemberStatusChange}
              onSavePaymentInfo={handleSavePaymentInfo}
            />
          )}
          {view === 'planning' && <PlanningView t={t} currency={currency} />}
          {view === 'history' && <HistoryView t={t} currency={currency} />}
          {view === 'settings' && (
            <SettingsView t={t} lang={lang} setLang={setLang} currency={currency} setCurrency={setCurrency} />
          )}
        </main>
      </div>

      {/* ---------- Notification panel ---------- */}
      {showNotifPanel && (
        <NotifPanel t={t} notifs={notifs} setNotifs={setNotifs} onClose={() => setShowNotifPanel(false)} />
      )}

      {/* ---------- Add transaction modal ---------- */}
      {showAddTx && (
        <AddTxModal t={t} onClose={() => setShowAddTx(false)} onSave={(newTx) => {
          setTx(prev => [{ ...newTx, id: Date.now() }, ...prev]);
          setShowAddTx(false);
          pushToast(lang === 'ar' ? 'تمت الإضافة بنجاح' : lang === 'en' ? 'Transaction added' : 'Transaction ajoutée');
        }} />
      )}

      {/* ---------- Create tontine modal ---------- */}
      {showAddTontine && (
        <CreateTontineModal
          t={t} lang={lang} onClose={() => setShowAddTontine(false)} onCreate={handleCreateTontine}
          myPaymentInfo={myPaymentInfo}
        />
      )}

      {/* ---------- Toasts ---------- */}
      <div className="toast-stack">
        {toasts.map(tt => (
          <Toast key={tt.id} message={tt.message} onClose={() => setToasts(prev => prev.filter(x => x.id !== tt.id))} />
        ))}
      </div>
    </div>
  );
}

// ================= DASHBOARD =================
function DashboardView({ t, currency, balance, totalIncome, totalExpense, tontineSavings, incomeChange, expenseChange, tx, setView }) {
  return (
    <div className="view fade-in">
      <div className="view-header">
        <div>
          <h1>{t.dashboard.greeting}, Amara 👋</h1>
          <p className="subtitle">{t.dashboard.subtitle}</p>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card highlight">
          <div className="stat-icon wallet"><Wallet size={20} /></div>
          <span className="stat-label">{t.dashboard.balance}</span>
          <Money amountUSD={balance} currency={currency} className="stat-value" />
        </div>
        <div className="stat-card">
          <div className="stat-icon up"><ArrowUpRight size={20} /></div>
          <span className="stat-label">{t.dashboard.income}</span>
          <Money amountUSD={totalIncome} currency={currency} className="stat-value" />
          <span className={`stat-delta ${incomeChange >= 0 ? 'pos' : 'neg'}`}>
            {incomeChange >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {Math.abs(incomeChange).toFixed(1)}% {t.dashboard.vsLastMonth}
          </span>
        </div>
        <div className="stat-card">
          <div className="stat-icon down"><ArrowDownRight size={20} /></div>
          <span className="stat-label">{t.dashboard.expense}</span>
          <Money amountUSD={totalExpense} currency={currency} className="stat-value" />
          <span className={`stat-delta ${expenseChange <= 0 ? 'pos' : 'neg'}`}>
            {expenseChange <= 0 ? <TrendingDown size={13} /> : <TrendingUp size={13} />}
            {Math.abs(expenseChange).toFixed(1)}% {t.dashboard.vsLastMonth}
          </span>
        </div>
        <div className="stat-card">
          <div className="stat-icon gold"><PiggyBank size={20} /></div>
          <span className="stat-label">{t.dashboard.savings}</span>
          <Money amountUSD={tontineSavings} currency={currency} className="stat-value" />
        </div>
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="panel-header">
            <h3>{t.dashboard.cashflow}</h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthlyHistory}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00D9A3" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#00D9A3" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF5C5C" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FF5C5C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#232936" vertical={false} />
              <XAxis dataKey="month" stroke="#7A8699" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#7A8699" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: '#141821', border: '1px solid #232936', borderRadius: 10, fontSize: 13 }} />
              <Area type="monotone" dataKey="income" stroke="#00D9A3" strokeWidth={2.5} fill="url(#incomeGrad)" />
              <Area type="monotone" dataKey="expense" stroke="#FF5C5C" strokeWidth={2.5} fill="url(#expenseGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h3>{t.dashboard.breakdown}</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={expenseBreakdown} dataKey="value" nameKey="category" innerRadius={55} outerRadius={85} paddingAngle={3}>
                {expenseBreakdown.map((entry, i) => <Cell key={i} fill={entry.color} stroke="none" />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#141821', border: '1px solid #232936', borderRadius: 10, fontSize: 13 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="legend-list">
            {expenseBreakdown.map((e, i) => (
              <div key={i} className="legend-item">
                <span className="dot" style={{ background: e.color }} />
                <span>{getCategoryLabel(t, 'expense', e.category)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h3>{t.dashboard.recentTx}</h3>
          <button className="link-btn" onClick={() => setView('transactions')}>{t.dashboard.seeAll} <ChevronRight size={14} /></button>
        </div>
        <TxList items={tx.slice(0, 5)} t={t} currency={currency} />
      </div>
    </div>
  );
}

// ================= TRANSACTIONS =================
function TxList({ items, t, currency }) {
  return (
    <div className="tx-list">
      {items.map(item => (
        <div key={item.id} className="tx-row">
          <div className={`tx-icon ${item.type}`}>
            {item.type === 'income' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          </div>
          <div className="tx-info">
            <span className="tx-note">{item.note}</span>
            <span className="tx-cat">{getCategoryLabel(t, item.type, item.category)} · {item.date}</span>
          </div>
          <Money amountUSD={item.amount} currency={currency} signed className={`tx-amount ${item.type}`} />
        </div>
      ))}
    </div>
  );
}

// Regroupe une liste de transactions par catégorie : chaque groupe garde le
// détail des lignes qui le composent (pour l'affichage "ligne par ligne, puis
// sous-total") et son montant cumulé.
function groupByCategory(items) {
  const map = new Map();
  for (const item of items) {
    if (!map.has(item.category)) map.set(item.category, { category: item.category, items: [], total: 0 });
    const g = map.get(item.category);
    g.items.push(item);
    g.total += item.amount;
  }
  return [...map.values()].sort((a, b) => b.total - a.total);
}

// Une "case" catégorie : icône + libellé, chaque transaction qui la compose
// avec son propre montant, puis le sous-total de la catégorie bien détaché.
function CategoryCard({ group, t, currency, type }) {
  return (
    <div className="cat-card">
      <div className="cat-card-header">
        <span className="cat-card-icon">{categoryIcons[group.category] || '📦'}</span>
        <span className="cat-card-name">{getCategoryLabel(t, type, group.category)}</span>
        <Money amountUSD={group.total} currency={currency} className={`cat-card-total ${type}`} />
      </div>
      <div className="cat-card-lines">
        {group.items.map(item => (
          <div key={item.id} className="cat-line">
            <span className="cat-line-note">{item.note}</span>
            <span className="cat-line-date">{item.date}</span>
            <Money amountUSD={item.amount} currency={currency} className="cat-line-amount" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Section complète pour un type (dépenses OU revenus) : les cases catégorie,
// puis un total général bien visible en pied de section.
function CategorySection({ items, t, currency, type }) {
  const groups = groupByCategory(items);
  const total = items.reduce((s, i) => s + i.amount, 0);
  const label = type === 'expense' ? t.transactions.filterExpense : t.transactions.filterIncome;

  return (
    <div className="cat-section">
      <h2 className="cat-section-title">{label}</h2>
      {groups.length === 0 ? (
        <p className="hint-text">—</p>
      ) : (
        <div className="cat-grid">
          {groups.map(g => (
            <CategoryCard key={g.category} group={g} t={t} currency={currency} type={type} />
          ))}
        </div>
      )}
      <div className={`cat-section-total ${type}`}>
        <span>{type === 'expense' ? t.dashboard.expense : t.dashboard.income}</span>
        <Money amountUSD={total} currency={currency} className={`cat-section-total-value ${type}`} />
      </div>
    </div>
  );
}

function TransactionsView({ t, currency, tx, filter, setFilter, onAdd }) {
  const expenseItems = tx.filter(x => x.type === 'expense');
  const incomeItems = tx.filter(x => x.type === 'income');

  return (
    <div className="view fade-in">
      <div className="view-header">
        <h1>{t.transactions.title}</h1>
        <button className="btn-primary" onClick={onAdd}><Plus size={16} /> {t.transactions.add}</button>
      </div>
      <div className="filter-pills">
        {['all', 'income', 'expense'].map(f => (
          <button key={f} className={`pill ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? t.transactions.filterAll : f === 'income' ? t.transactions.filterIncome : t.transactions.filterExpense}
          </button>
        ))}
      </div>

      {(filter === 'all' || filter === 'expense') && (
        <CategorySection items={expenseItems} t={t} currency={currency} type="expense" />
      )}
      {(filter === 'all' || filter === 'income') && (
        <CategorySection items={incomeItems} t={t} currency={currency} type="income" />
      )}
    </div>
  );
}

function AddTxModal({ t, onClose, onSave }) {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(null);
  const [categoryTouched, setCategoryTouched] = useState(false);
  const [note, setNote] = useState('');

  function handleNoteChange(value) {
    setNote(value);
    // Tant que l'utilisateur n'a pas choisi lui-même une catégorie,
    // on continue de la deviner automatiquement à chaque frappe,
    // en ne cherchant que dans la table correspondant au type déjà sélectionné.
    if (!categoryTouched) {
      const guessed = detectCategory(value, type);
      if (guessed) setCategory(guessed);
    }
  }

  function handleCategoryPick(key) {
    setCategory(key);
    setCategoryTouched(true);
  }

  // Les clés viennent directement de la table de traduction : une seule source
  // de vérité, jamais de liste dupliquée à maintenir dans le composant.
  const visibleKeys = Object.keys(t.categories[type]);
  const defaultOtherKey = type === 'income' ? 'otherIncome' : 'otherExpense';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t.transactions.add}</h3>
          <button className="icon-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="type-toggle">
          <button className={type === 'expense' ? 'active expense' : ''} onClick={() => { setType('expense'); setCategory(null); setCategoryTouched(false); }}>{t.transactions.expense}</button>
          <button className={type === 'income' ? 'active income' : ''} onClick={() => { setType('income'); setCategory(null); setCategoryTouched(false); }}>{t.transactions.income}</button>
        </div>
        <label className="field">
          <span>{t.transactions.note}</span>
          <input
            value={note}
            onChange={e => handleNoteChange(e.target.value)}
            placeholder={type === 'expense' ? t.transactions.notePlaceholderExpense : t.transactions.notePlaceholderIncome}
            autoFocus
          />
        </label>
        <label className="field">
          <span>{t.transactions.amount}</span>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" inputMode="decimal" />
        </label>

        <div className="field">
          <span>
            {category ? t.transactions.categoryDetected : t.transactions.categoryPick}
          </span>
          <div className="category-grid">
            {visibleKeys.map(k => (
              <button
                key={k}
                type="button"
                className={`category-chip ${category === k ? 'active' : ''}`}
                onClick={() => handleCategoryPick(k)}
              >
                <span className="category-emoji">{categoryIcons[k]}</span>
                {t.categories[type][k]}
              </button>
            ))}
          </div>
        </div>

        <button className="btn-primary full" onClick={() => {
          if (!amount) return;
          const finalCategory = category || defaultOtherKey;
          onSave({ type, amount: parseFloat(amount), category: finalCategory, note: note || t.categories[type][finalCategory], date: new Date().toISOString().slice(0, 10) });
        }}>
          <Check size={16} /> {t.transactions.save}
        </button>
      </div>

    </div>
  );
}

// ================= TONTINES =================
// ================= CREATE TONTINE =================
// Recherche dans l'annuaire de l'app par nom d'utilisateur OU numéro de téléphone.
// Utilisé à la fois pour ajouter des participants à la création, et pour que
// n'importe quel participant retrouve facilement le profil des autres.
function searchAppUsers(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return appUsers.filter(u =>
    u.username !== 'moi_amara' && (
      u.username.toLowerCase().includes(q) ||
      u.phone.replace(/\s/g, '').includes(q.replace(/\s/g, ''))
    )
  );
}

// Champ de recherche réutilisable : tape un nom d'utilisateur ou un numéro,
// les résultats de l'annuaire de l'app apparaissent en dessous.
function UserSearchField({ t, onPick, excludeIds = [] }) {
  const [query, setQuery] = useState('');
  const results = useMemo(() => searchAppUsers(query), [query]);

  return (
    <div className="user-search">
      <div className="user-search-input">
        <Search size={15} />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={t.tontine.searchUserPlaceholder}
        />
      </div>
      {query.trim() && (
        <div className="user-search-results">
          {results.length === 0 && <p className="hint-text">{t.tontine.noUserFound}</p>}
          {results.map(u => {
            const already = excludeIds.includes(u.id);
            return (
              <div key={u.id} className="user-result-row">
                <span className="member-avatar">{u.displayName.charAt(0)}</span>
                <div className="user-result-info">
                  <span className="user-result-name">{u.displayName}</span>
                  <span className="user-result-handle">@{u.username} · {u.phone}</span>
                </div>
                <button
                  type="button"
                  className="btn-secondary small"
                  disabled={already}
                  onClick={() => { onPick(u); setQuery(''); }}
                >
                  {already ? t.tontine.alreadyAdded : t.tontine.addToTontine}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Formulaire des infos de paiement local (opérateur, nom du compte, numéro, notes).
// Une fois saisi, l'admin n'a plus besoin de le retaper pour ses prochaines tontines.
function PaymentInfoForm({ t, value, onChange }) {
  const info = value || { provider: '', accountName: '', accountNumber: '', notes: '' };
  function set(field, v) {
    onChange({ ...info, [field]: v });
  }
  return (
    <div className="payment-info-form">
      <label className="field">
        <span>{t.tontine.paymentProvider}</span>
        <input value={info.provider} onChange={e => set('provider', e.target.value)} placeholder={t.tontine.paymentProviderPlaceholder} />
      </label>
      <div className="field-row">
        <label className="field">
          <span>{t.tontine.paymentAccountName}</span>
          <input value={info.accountName} onChange={e => set('accountName', e.target.value)} />
        </label>
        <label className="field">
          <span>{t.tontine.paymentAccountNumber}</span>
          <input value={info.accountNumber} onChange={e => set('accountNumber', e.target.value)} />
        </label>
      </div>
      <label className="field">
        <span>{t.tontine.paymentNotes}</span>
        <input value={info.notes} onChange={e => set('notes', e.target.value)} />
      </label>
    </div>
  );
}

function CreateTontineModal({ t, lang, onClose, onCreate, myPaymentInfo }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('rotation'); // 'rotation' | 'share'
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState('');
  const [contribution, setContribution] = useState('');
  const [frequency, setFrequency] = useState('monthly');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [paymentInfo, setPaymentInfo] = useState(myPaymentInfo || { provider: '', accountName: '', accountNumber: '', notes: '' });
  const [step, setStep] = useState(1); // 1 = infos générales, 2 = participants + paiement

  function addUser(u) {
    setSelectedUsers(prev => prev.some(p => p.id === u.id) ? prev : [...prev, u]);
  }
  function removeUser(id) {
    setSelectedUsers(prev => prev.filter(u => u.id !== id));
  }

  const canGoStep2 = name.trim() && contribution;
  const canCreate = canGoStep2 && selectedUsers.length >= 1;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t.tontine.createTitle}</h3>
          <button className="icon-btn" onClick={onClose}><X size={18} /></button>
        </div>

        {step === 1 && (
          <>
            <label className="field">
              <span>{t.tontine.tontineName}</span>
              <input value={name} onChange={e => setName(e.target.value)} placeholder={t.tontine.tontineNamePlaceholder} autoFocus />
            </label>

            <label className="field">
              <span>{t.tontine.tontineType}</span>
              <div className="type-choice-grid">
                <button
                  type="button"
                  className={`type-choice-card ${type === 'rotation' ? 'active' : ''}`}
                  onClick={() => setType('rotation')}
                >
                  <strong>{t.tontine.typeRotation}</strong>
                  <span>{t.tontine.typeRotationDesc}</span>
                </button>
                <button
                  type="button"
                  className={`type-choice-card ${type === 'share' ? 'active' : ''}`}
                  onClick={() => setType('share')}
                >
                  <strong>{t.tontine.typeShare}</strong>
                  <span>{t.tontine.typeShareDesc}</span>
                </button>
              </div>
            </label>

            <div className="field-row">
              <label className="field">
                <span>{t.tontine.startDate}</span>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
              </label>
              <label className="field">
                <span>{t.tontine.endDate}</span>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} min={startDate} />
              </label>
            </div>

            <div className="field-row">
              <label className="field">
                <span>{t.tontine.amountPerPeriod}</span>
                <input type="number" value={contribution} onChange={e => setContribution(e.target.value)} placeholder="0.00" inputMode="decimal" />
              </label>
              <label className="field">
                <span>{t.tontine.howOften}</span>
                <select value={frequency} onChange={e => setFrequency(e.target.value)}>
                  <option value="daily">{t.tontine.daily}</option>
                  <option value="weekly">{t.tontine.weekly}</option>
                  <option value="monthly">{t.tontine.monthly}</option>
                </select>
              </label>
            </div>

            <button className="btn-primary full" disabled={!canGoStep2} onClick={() => setStep(2)}>
              <ChevronRight size={16} /> {t.tontine.participants}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <label className="field">
              <span>{t.tontine.participants}</span>
              <p className="hint-text">{t.tontine.searchUserHint}</p>
              <UserSearchField t={t} onPick={addUser} excludeIds={selectedUsers.map(u => u.id)} />
            </label>

            <div className="participant-chips">
              <div className="participant-chip you-chip">
                <span className="participant-avatar">V</span>
                {t.tontine.you}
              </div>
              {selectedUsers.map(u => (
                <div key={u.id} className="participant-chip">
                  <span className="participant-avatar">{u.displayName.charAt(0)}</span>
                  {u.displayName}
                  <button type="button" onClick={() => removeUser(u.id)} aria-label={t.tontine.removeParticipant}>
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
            {selectedUsers.length === 0 && <p className="hint-text">{t.tontine.minParticipants}</p>}

            <div className="field payment-section">
              <span>{t.tontine.paymentMethod}</span>
              <p className="hint-text">{t.tontine.paymentMethodDesc}</p>
              <PaymentInfoForm t={t} value={paymentInfo} onChange={setPaymentInfo} />
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setStep(1)}>
                <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} /> {t.common.back}
              </button>
              <button className="btn-primary" disabled={!canCreate} onClick={() => {
                if (!canCreate) return;
                onCreate({
                  name: name.trim(),
                  type,
                  startDate,
                  endDate: endDate || null,
                  contribution: parseFloat(contribution),
                  frequency,
                  selectedUsers,
                  paymentInfo: paymentInfo.provider ? paymentInfo : null,
                });
              }}>
                <Check size={16} /> {t.tontine.createBtn}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ================= TONTINES — PAGE 1 : LISTE =================
// Vue volontairement sobre : une carte compacte par tontine, juste ce qu'il
// faut pour identifier et comparer d'un coup d'œil. Le détail vit ailleurs
// (page 2), pour ne jamais mélanger la liste et le tableau de bord.
function TontinesView({ t, currency, onAdd, lang, tontineList, onSelect }) {
  return (
    <div className="view fade-in">
      <div className="view-header">
        <div>
          <h1>{t.tontine.title}</h1>
          <span className="subtitle">{t.dashboard.subtitle}</span>
        </div>
        <button className="btn-primary" onClick={onAdd}><Plus size={16} /> {t.tontine.create}</button>
      </div>

      <div className="tontine-list">
        {tontineList.map(tn => (
          <TontineListRow key={tn.id} tontine={tn} t={t} currency={currency} onSelect={() => onSelect(tn.id)} />
        ))}
      </div>
    </div>
  );
}

// Une ligne = identité + 3 chiffres clés + statut. Rien de plus : le clic
// ouvre le dashboard complet pour tout le reste.
function TontineListRow({ tontine, t, currency, onSelect }) {
  const paidCount = tontine.members.filter(m => m.status === 'paid').length;
  const totalCollected = paidCount * tontine.contribution;
  const currentRound = tontine.currentRound || 1;
  const totalRounds = tontine.totalRounds || tontine.membersCount;
  const cyclePct = Math.round(((currentRound - 1) / totalRounds) * 100);
  const isAdmin = !!tontine.createdByMe;
  const myMember = tontine.members.find(m => m.name === 'Vous');
  const iHavePaid = myMember?.status === 'paid';

  return (
    <button type="button" className="tontine-row" onClick={onSelect}>
      <div className="tontine-row-ring">
        <RoundRing progress={cyclePct} size={52} stroke={5}>
          <span className="row-ring-txt">{currentRound}/{totalRounds}</span>
        </RoundRing>
      </div>

      <div className="tontine-row-main">
        <div className="tontine-row-title">
          <h3>{tontine.name}</h3>
          <span className={`type-tag ${tontine.type}`}>
            {tontine.type === 'share' ? t.tontine.typeShare : t.tontine.typeRotation}
          </span>
        </div>
        <span className="tontine-sub">
          {tontine.membersCount} {t.tontine.members} · {t.tontine[tontine.frequency]}
          {isAdmin ? ` · ${t.tontine.youAreAdmin}` : ''}
        </span>
      </div>

      <div className="tontine-row-figure">
        <span className="stat-label">{t.tontine.totalContributed}</span>
        <Money amountUSD={totalCollected} currency={currency} className="stat-value small accent" />
      </div>

      <div className="tontine-row-status">
        <span className={`my-payment-dot ${iHavePaid ? 'paid' : 'pending'}`} />
        <CountdownBadge targetDate={tontine.nextDate} t={t} />
      </div>

      <ChevronRight size={18} className="tontine-row-chevron" />
    </button>
  );
}

function CountdownBadge({ targetDate, t }) {
  const [remaining, setRemaining] = useState('');
  const [urgent, setUrgent] = useState(false);
  useEffect(() => {
    function update() {
      const diff = new Date(targetDate) - new Date();
      if (diff <= 0) { setRemaining('—'); return; }
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      setUrgent(diff < 86400000);
      setRemaining(days > 0 ? `${days}j ${hours}h` : `${hours}h ${mins}min`);
    }
    update();
    const i = setInterval(update, 30000);
    return () => clearInterval(i);
  }, [targetDate]);
  return <span className={`countdown ${urgent ? 'urgent' : ''}`}><Clock size={13} /> {remaining}</span>;
}

// ---------- L'anneau de rotation : signature visuelle du module tontine ----------
// Chaque segment représente un tour du cycle. Le segment plein encode la
// progression réelle (tours déjà passés) et le curseur doré marque le tour en
// cours — une lecture littérale du principe même de la tontine : la cagnotte
// tourne, tour après tour, entre les participants.
function RoundRing({ progress = 0, size = 108, stroke = 9, segments = 0, activeSegment = 0, children }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (Math.min(100, Math.max(0, progress)) / 100) * circumference;

  const segMarks = [];
  if (segments > 1) {
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * 360 - 90;
      const rad = (angle * Math.PI) / 180;
      const x = size / 2 + radius * Math.cos(rad);
      const y = size / 2 + radius * Math.sin(rad);
      segMarks.push({ x, y, i });
    }
  }

  return (
    <div className="round-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--border)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke="url(#ringGradient)" strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="round-ring-progress"
        />
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D9A3" />
            <stop offset="100%" stopColor="#5B9FFF" />
          </linearGradient>
        </defs>
        {segMarks.map(s => (
          <circle
            key={s.i} cx={s.x} cy={s.y} r={s.i === activeSegment ? 4.5 : 2.5}
            fill={s.i === activeSegment ? '#FFB020' : 'var(--bg)'}
            stroke={s.i === activeSegment ? '#FFB020' : 'var(--border)'} strokeWidth={1.5}
            className={s.i === activeSegment ? 'ring-active-dot' : ''}
          />
        ))}
      </svg>
      <div className="round-ring-center">{children}</div>
    </div>
  );
}

// ================= TONTINES — PAGE 2 : DASHBOARD DÉTAILLÉ =================
// Page dédiée entière à une seule tontine : gros titres, gros chiffres,
// l'anneau de rotation en pièce centrale, puis le détail organisé en sections
// nettement séparées (solde, ma cotisation, paiement, participants).
function TontineDetailView({ tontine, t, currency, mode, setMode, onNotify, lang, onBack, onTogglePayment, onMemberStatusChange, onSavePaymentInfo }) {
  const [notifyOn, setNotifyOn] = useState(true);
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);
  const [editingPaymentInfo, setEditingPaymentInfo] = useState(false);
  const [draftPaymentInfo, setDraftPaymentInfo] = useState(tontine?.paymentInfo || { provider: '', accountName: '', accountNumber: '', notes: '' });

  if (!tontine) return null;

  const paidCount = tontine.members.filter(m => m.status === 'paid').length;
  const missedCount = tontine.members.filter(m => m.status === 'missed').length;
  const progressPct = Math.round((paidCount / tontine.membersCount) * 100);
  const myMember = tontine.members.find(m => m.name === 'Vous');
  const iHavePaid = myMember?.status === 'paid';
  const totalCollected = paidCount * tontine.contribution;
  const isAdmin = !!tontine.createdByMe;
  const expenses = tontine.expenses || 0;
  const currentBalance = totalCollected - expenses;
  const totalRounds = tontine.totalRounds || tontine.membersCount;
  const currentRound = tontine.currentRound || 1;
  const cyclePct = Math.round(((currentRound - 1) / totalRounds) * 100);
  const currentTurnMember = tontine.members.find(m => m.turnRound === currentRound);

  return (
    <div className="view fade-in tontine-detail">
      <button type="button" className="detail-back" onClick={onBack}>
        <ChevronRight size={16} className="back-chevron" /> {t.common.back}
      </button>

      {/* ---------- En-tête premium : identité + compte à rebours ---------- */}
      <div className="detail-header">
        <div className="detail-header-main">
          <div className="tontine-title-row">
            <h1 className="detail-title">{tontine.name}</h1>
            <span className={`type-tag lg ${tontine.type}`}>
              {tontine.type === 'share' ? t.tontine.typeShare : t.tontine.typeRotation}
            </span>
          </div>
          <span className="detail-subline">
            {tontine.membersCount} {t.tontine.members} · {t.tontine[tontine.frequency]}
          </span>
          {tontine.startDate && (
            <span className="tontine-dates">
              <Calendar size={13} /> {tontine.startDate} {tontine.endDate ? `→ ${tontine.endDate}` : ''}
            </span>
          )}
        </div>
        <CountdownBadge targetDate={tontine.nextDate} t={t} />
      </div>

      {/* ---------- Pièce centrale : l'anneau de rotation, en grand ---------- */}
      <div className="detail-hero panel">
        <RoundRing progress={cyclePct} segments={totalRounds} activeSegment={currentRound - 1} size={168} stroke={13}>
          <span className="ring-round-label">{t.tontine.round}</span>
          <span className="ring-round-num lg">{currentRound}</span>
          <span className="ring-round-total">/ {totalRounds}</span>
        </RoundRing>

        <div className="detail-hero-info">
          <div className="turn-callout lg">
            <span className="turn-callout-label">
              {tontine.type === 'rotation' ? t.tontine.turnOf : t.tontine.progressLabel}
            </span>
            <span className="turn-callout-value lg">
              {tontine.type === 'rotation'
                ? (currentTurnMember ? currentTurnMember.name : '—')
                : `${paidCount}/${tontine.membersCount} ${t.tontine.progressLabel}`}
            </span>
          </div>
          <div className="mini-status-row lg">
            <span className="mini-status paid"><Check size={13} /> {paidCount} {t.tontine.paid}</span>
            {missedCount > 0 && <span className="mini-status missed"><X size={13} /> {missedCount} {t.tontine.missed}</span>}
            <span className="mini-status pending"><Clock size={13} /> {tontine.membersCount - paidCount - missedCount} {t.tontine.pending}</span>
          </div>
        </div>
      </div>

      {/* ---------- Chiffres clés, en grand ---------- */}
      <div className="detail-stats">
        <div className="detail-stat-card panel">
          <span className="stat-label">{t.tontine.totalContributed}</span>
          <Money amountUSD={totalCollected} currency={currency} className="detail-stat-value accent" />
        </div>
        <div className="detail-stat-card panel">
          <span className="stat-label">{t.tontine.expenses}</span>
          <Money amountUSD={expenses} currency={currency} className="detail-stat-value" />
        </div>
        <div className="detail-stat-card panel">
          <span className="stat-label">{t.tontine.currentBalance}</span>
          <Money amountUSD={currentBalance} currency={currency} className="detail-stat-value" />
        </div>
      </div>

      <div className="round-progress panel section-block">
        <div className="round-progress-label">
          <span>{paidCount}/{tontine.membersCount} {t.tontine.progressLabel}</span>
          <span>{progressPct}%</span>
        </div>
        <div className="progress-bar"><div className="progress-fill" style={{ width: `${progressPct}%` }} /></div>
      </div>

      {/* ---------- Ma cotisation ---------- */}
      <div className="detail-section">
        <h2 className="section-title">{t.tontine.contribution}</h2>
        <div className="my-payment-box panel">
          <div className="my-payment-info">
            <span className={`my-payment-dot ${iHavePaid ? 'paid' : 'pending'}`} />
            <span>{iHavePaid ? t.tontine.youPaid : t.tontine.youNotPaid}</span>
          </div>
          <div className="my-payment-actions">
            <button
              className={`payment-btn valid ${iHavePaid ? 'active' : ''}`}
              onClick={() => onTogglePayment(tontine.id, true)}
            >
              <Check size={15} /> {t.tontine.iPaid}
            </button>
            <button
              className={`payment-btn invalid ${!iHavePaid ? 'active' : ''}`}
              onClick={() => onTogglePayment(tontine.id, false)}
            >
              <X size={15} /> {t.tontine.notYet}
            </button>
          </div>
        </div>
      </div>

      {/* ---------- Infos de paiement local ---------- */}
      <div className="detail-section">
        <h2 className="section-title">{t.tontine.paymentMethod}</h2>
        <div className="payment-info-box panel">
          <button type="button" className="link-btn" onClick={() => setShowPaymentInfo(v => !v)}>
            <DollarSign size={14} /> {t.tontine.viewPaymentInfo}
          </button>
          {showPaymentInfo && (
            <div className="payment-info-panel">
              {!editingPaymentInfo && (
                <>
                  {tontine.paymentInfo ? (
                    <div className="payment-info-display">
                      <div><strong>{tontine.paymentInfo.provider}</strong></div>
                      <div>{t.tontine.paymentAccountName}: {tontine.paymentInfo.accountName || '—'}</div>
                      <div>{t.tontine.paymentAccountNumber}: {tontine.paymentInfo.accountNumber || '—'}</div>
                      {tontine.paymentInfo.notes && <div className="hint-text">{tontine.paymentInfo.notes}</div>}
                    </div>
                  ) : (
                    <p className="hint-text">{t.tontine.noPaymentInfo}</p>
                  )}
                  {isAdmin && (
                    <button type="button" className="btn-secondary small" onClick={() => setEditingPaymentInfo(true)}>
                      {t.tontine.editPaymentInfo}
                    </button>
                  )}
                </>
              )}
              {editingPaymentInfo && isAdmin && (
                <>
                  <PaymentInfoForm t={t} value={draftPaymentInfo} onChange={setDraftPaymentInfo} />
                  <button
                    type="button"
                    className="btn-primary small"
                    onClick={() => {
                      onSavePaymentInfo(tontine.id, draftPaymentInfo);
                      setEditingPaymentInfo(false);
                    }}
                  >
                    <Check size={14} /> {t.tontine.savePaymentInfo}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ---------- Suivi des participants ---------- */}
      <div className="detail-section">
        <div className="section-title-row">
          <h2 className="section-title">{t.tontine.manageParticipants}</h2>
          <div className="filter-pills compact">
            <button className={`pill ${mode === 'basic' ? 'active' : ''}`} onClick={() => setMode('basic')}>{t.tontine.basicMode}</button>
            <button className={`pill ${mode === 'advanced' ? 'active' : ''}`} onClick={() => setMode('advanced')}>{t.tontine.advancedMode}</button>
          </div>
        </div>

        <div className="participants-tracker panel">
          <div className="tracker-header">
            <span className={`organizer-badge ${isAdmin ? 'mine' : ''}`}>
              {isAdmin ? t.tontine.youAreAdmin : t.tontine.viewOnly}
            </span>
          </div>
          {mode === 'advanced' && isAdmin && <p className="hint-text">{t.tontine.tapToChange}</p>}

          <div className="member-list lg">
            {tontine.members.map(m => {
              const roundsLeft = Math.max(0, totalRounds - (m.turnRound - 1));
              return (
                <MemberStatusRow
                  key={m.id}
                  member={m}
                  t={t}
                  roundsLeft={mode === 'advanced' ? roundsLeft : undefined}
                  isCurrentTurn={m.turnRound === currentRound}
                  editable={mode === 'advanced' && isAdmin && m.name !== 'Vous'}
                  onChange={(newStatus) => onMemberStatusChange(tontine.id, m.id, newStatus)}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* ---------- Rappels ---------- */}
      <div className="detail-section">
        <div className="tontine-footer panel">
          <label className="toggle-row standalone">
            <input
              type="checkbox"
              checked={notifyOn}
              onChange={e => {
                setNotifyOn(e.target.checked);
                if (e.target.checked) onNotify(lang === 'ar' ? 'تم تفعيل التذكير' : lang === 'en' ? 'Reminder enabled' : 'Rappel activé');
              }}
            />
            <span className="toggle-slider" />
            <span>{t.tontine.notifyMe}</span>
          </label>
        </div>
      </div>
    </div>
  );
}

// Une ligne de participant avec 3 statuts possibles : payé / en attente / raté.
// Si `editable` est vrai (administrateur regardant un autre participant que lui-même),
// un tap fait défiler le statut — c'est le bouton qui permet à l'admin de "monter"
// qu'un participant a payé après un virement fait en dehors de l'app.
// Sinon c'est juste un badge en lecture seule : chaque participant voit le nom
// d'utilisateur et l'état réel du groupe, sans pouvoir rien modifier.
function MemberStatusRow({ member, t, editable, onChange, roundsLeft, isCurrentTurn }) {
  const statusOrder = ['pending', 'paid', 'missed'];

  function cycleStatus() {
    if (!editable) return;
    const currentIdx = statusOrder.indexOf(member.status);
    const next = statusOrder[(currentIdx + 1) % statusOrder.length];
    onChange(next);
  }

  const statusIcon = { paid: <Check size={12} />, pending: <Clock size={12} />, missed: <X size={12} /> };
  const statusLabel = { paid: t.tontine.paid, pending: t.tontine.pending, missed: t.tontine.missed };

  return (
    <div className={`member-row ${member.name === 'Vous' ? 'me' : ''} ${isCurrentTurn ? 'current-turn' : ''}`}>
      <div className="member-avatar">
        {member.name.charAt(0)}
        {isCurrentTurn && <span className="turn-dot" />}
      </div>
      <div className="member-name-block">
        <span className="member-name">{member.name}</span>
        {member.username && <span className="member-username">@{member.username}</span>}
      </div>
      {typeof roundsLeft === 'number' && (
        <span className="member-rounds-left">{roundsLeft} {t.tontine.roundsLeftShort}</span>
      )}
      <button
        type="button"
        className={`status-chip ${member.status} ${editable ? 'editable' : ''}`}
        onClick={cycleStatus}
        disabled={!editable}
      >
        {statusIcon[member.status]}
        {statusLabel[member.status]}
      </button>
    </div>
  );
}


// ================= PLANNING =================
function PlanningView({ t, currency }) {
  return (
    <div className="view fade-in">
      <div className="view-header">
        <h1>{t.planning.title}</h1>
        <button className="btn-primary"><Plus size={16} /> {t.planning.addGoal}</button>
      </div>
      <div className="goal-grid">
        {goals.map(g => {
          const pct = Math.min(100, Math.round((g.current / g.target) * 100));
          return (
            <div key={g.id} className="panel goal-card">
              <div className="goal-header">
                <h3>{g.name}</h3>
                <span className="goal-pct">{pct}%</span>
              </div>
              <div className="progress-bar large"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
              <div className="goal-footer">
                <span><Money amountUSD={g.current} currency={currency} /> / <Money amountUSD={g.target} currency={currency} /></span>
                <span className="goal-deadline"><Calendar size={13} /> {g.deadline}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ================= HISTORY =================
function HistoryView({ t, currency }) {
  const thisMonth = monthlyHistory[monthlyHistory.length - 1];
  const lastMonth = monthlyHistory[monthlyHistory.length - 2];
  return (
    <div className="view fade-in">
      <div className="view-header"><h1>{t.history.title}</h1></div>

      <div className="grid-2">
        <div className="panel compare-card">
          <span className="compare-label">{t.history.thisMonth}</span>
          <div className="compare-row"><TrendingUp size={16} className="pos-icon" /><Money amountUSD={thisMonth.income} currency={currency} className="stat-value small" /></div>
          <div className="compare-row"><TrendingDown size={16} className="neg-icon" /><Money amountUSD={thisMonth.expense} currency={currency} className="stat-value small" /></div>
        </div>
        <div className="panel compare-card">
          <span className="compare-label">{t.history.lastMonth}</span>
          <div className="compare-row"><TrendingUp size={16} className="pos-icon" /><Money amountUSD={lastMonth.income} currency={currency} className="stat-value small" /></div>
          <div className="compare-row"><TrendingDown size={16} className="neg-icon" /><Money amountUSD={lastMonth.expense} currency={currency} className="stat-value small" /></div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header"><h3>{t.history.evolution}</h3></div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={monthlyHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#232936" vertical={false} />
            <XAxis dataKey="month" stroke="#7A8699" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#7A8699" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ background: '#141821', border: '1px solid #232936', borderRadius: 10, fontSize: 13 }} />
            <Legend />
            <Bar dataKey="income" fill="#00D9A3" radius={[6, 6, 0, 0]} name={t.dashboard.income} />
            <Bar dataKey="expense" fill="#FF5C5C" radius={[6, 6, 0, 0]} name={t.dashboard.expense} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ================= SETTINGS =================
function SettingsView({ t, lang, setLang, currency, setCurrency }) {
  return (
    <div className="view fade-in">
      <div className="view-header"><h1>{t.settings.title}</h1></div>
      <div className="panel settings-panel">
        <div className="settings-row">
          <div className="settings-label"><Globe size={18} /> {t.settings.language}</div>
          <div className="lang-switch inline">
            {['fr', 'en', 'ar'].map(l => (
              <button key={l} className={lang === l ? 'active' : ''} onClick={() => setLang(l)}>
                {l === 'fr' ? 'Français' : l === 'en' ? 'English' : 'العربية'}
              </button>
            ))}
          </div>
        </div>
        <div className="settings-row">
          <div className="settings-label"><DollarSign size={18} /> {t.settings.currency}</div>
          <select className="currency-select" value={currency} onChange={e => setCurrency(e.target.value)}>
            {Object.entries(currencies).map(([code, c]) => (
              <option key={code} value={code}>{code} — {c.name}</option>
            ))}
          </select>
        </div>
        <div className="settings-row">
          <div className="settings-label"><Bell size={18} /> {t.settings.notifications}</div>
          <label className="toggle-row standalone">
            <input type="checkbox" defaultChecked />
            <span className="toggle-slider" />
          </label>
        </div>
        <div className="settings-row">
          <div className="settings-label"><Moon size={18} /> {t.settings.theme}</div>
          <span className="theme-tag">Premium Dark</span>
        </div>
      </div>
    </div>
  );
}

// ================= NOTIF PANEL =================
function NotifPanel({ t, notifs, setNotifs, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal notif-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t.notif.title}</h3>
          <button className="icon-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <button className="link-btn mark-read" onClick={() => setNotifs(prev => prev.map(n => ({ ...n, read: true })))}>
          {t.notif.markRead}
        </button>
        <div className="notif-list">
          {notifs.map(n => (
            <div key={n.id} className={`notif-item ${!n.read ? 'unread' : ''}`}>
              <div className={`notif-icon ${n.type}`}>
                {n.type === 'tontine' ? <Users size={15} /> : <AlertCircle size={15} />}
              </div>
              <div>
                <p>{n.title}</p>
                <span>{n.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ================= STYLES =================
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=Noto+Sans+Arabic:wght@500;600;700&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #0B0E14;
  --card: #141821;
  --card-hover: #1A2029;
  --border: #232936;
  --text: #E8ECF1;
  --text-dim: #7A8699;
  --accent: #00D9A3;
  --gold: #FFB020;
  --danger: #FF5C5C;
  --blue: #5B9FFF;
}

body { background: var(--bg); }

.app-shell {
  display: flex;
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  font-family: 'Inter', 'Noto Sans Arabic', sans-serif;
}
[dir="rtl"] .app-shell { font-family: 'Noto Sans Arabic', 'Inter', sans-serif; }

.sidebar {
  width: 240px;
  background: #0D1017;
  border-inline-end: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  flex-shrink: 0;
}
.brand { display: flex; align-items: center; gap: 10px; padding: 0 8px 28px; }
.brand-mark {
  width: 34px; height: 34px; border-radius: 10px;
  background: linear-gradient(135deg, var(--accent), #00A87F);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Space Grotesk', sans-serif; font-weight: 700; color: #05130E; font-size: 17px;
}
.brand-name { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 19px; letter-spacing: -0.02em; }

.nav { display: flex; flex-direction: column; gap: 3px; flex: 1; }
.nav-item {
  display: flex; align-items: center; gap: 12px;
  padding: 11px 12px; border-radius: 10px; border: none;
  background: transparent; color: var(--text-dim);
  font-size: 14.5px; font-weight: 500; cursor: pointer;
  text-align: start; transition: all 0.15s ease;
}
.nav-item:hover { background: var(--card); color: var(--text); }
.nav-item.active { background: rgba(0,217,163,0.1); color: var(--accent); }

.sidebar-footer { padding-top: 16px; border-top: 1px solid var(--border); }
.mini-balance { display: flex; flex-direction: column; gap: 4px; padding: 4px 8px; }
.mini-label { font-size: 11.5px; color: var(--text-dim); }
.mini-amount { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 16px; }

.main-col { flex: 1; display: flex; flex-direction: column; min-width: 0; }

.topbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 32px; border-bottom: 1px solid var(--border);
  gap: 16px; flex-wrap: wrap;
}
.topbar-search {
  display: flex; align-items: center; gap: 8px;
  background: var(--card); border: 1px solid var(--border);
  border-radius: 10px; padding: 9px 14px; width: 280px; color: var(--text-dim);
}
.topbar-search input { background: transparent; border: none; outline: none; color: var(--text); font-size: 13.5px; width: 100%; }
.topbar-actions { display: flex; align-items: center; gap: 12px; }

.lang-switch { display: flex; background: var(--card); border: 1px solid var(--border); border-radius: 8px; padding: 3px; }
.lang-switch button {
  border: none; background: transparent; color: var(--text-dim);
  padding: 5px 10px; border-radius: 6px; font-size: 12.5px; font-weight: 600; cursor: pointer;
}
.lang-switch button.active { background: var(--accent); color: #05130E; }
.lang-switch.inline { padding: 4px; }
.lang-switch.inline button { padding: 8px 16px; font-size: 13px; }

.currency-select {
  background: var(--card); border: 1px solid var(--border); color: var(--text);
  padding: 8px 12px; border-radius: 8px; font-size: 12.5px; font-weight: 600; cursor: pointer; outline: none;
}

.icon-btn {
  position: relative; width: 38px; height: 38px; border-radius: 10px;
  background: var(--card); border: 1px solid var(--border); color: var(--text);
  display: flex; align-items: center; justify-content: center; cursor: pointer;
}
.badge {
  position: absolute; top: -4px; inset-inline-end: -4px;
  background: var(--danger); color: white; font-size: 10px; font-weight: 700;
  min-width: 16px; height: 16px; border-radius: 8px; display: flex; align-items: center; justify-content: center;
}

.avatar {
  width: 38px; height: 38px; border-radius: 10px;
  background: linear-gradient(135deg, var(--gold), #C97F00);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Space Grotesk', sans-serif; font-weight: 700; color: #1A1300;
}

.content { padding: 28px 32px 60px; overflow-y: auto; }
.view { max-width: 1200px; }
.fade-in { animation: fadeIn 0.35s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }

.view-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
.view-header h1 { font-family: 'Space Grotesk', sans-serif; font-size: 26px; font-weight: 700; letter-spacing: -0.02em; }
.subtitle { color: var(--text-dim); font-size: 14px; margin-top: 4px; }

.stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
@media (max-width: 900px) { .stat-grid { grid-template-columns: repeat(2, 1fr); } }

.stat-card {
  background: var(--card); border: 1px solid var(--border); border-radius: 16px;
  padding: 20px; display: flex; flex-direction: column; gap: 6px;
  transition: border-color 0.2s ease;
}
.stat-card:hover { border-color: #2C3444; }
.stat-card.highlight { background: linear-gradient(160deg, #10241C, var(--card)); border-color: rgba(0,217,163,0.25); }

.stat-icon {
  width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 6px;
}
.stat-icon.wallet { background: rgba(0,217,163,0.12); color: var(--accent); }
.stat-icon.up { background: rgba(0,217,163,0.12); color: var(--accent); }
.stat-icon.down { background: rgba(255,92,92,0.12); color: var(--danger); }
.stat-icon.gold { background: rgba(255,176,32,0.12); color: var(--gold); }

.stat-label { font-size: 12.5px; color: var(--text-dim); font-weight: 500; }
.stat-value { font-family: 'Space Grotesk', sans-serif; font-size: 24px; font-weight: 700; letter-spacing: -0.01em; }
.stat-value.small { font-size: 18px; }
.currency-symbol { font-size: 0.6em; color: var(--text-dim); font-weight: 500; }

.stat-delta { display: flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 600; margin-top: 2px; }
.stat-delta.pos { color: var(--accent); }
.stat-delta.neg { color: var(--danger); }

.grid-2 { display: grid; grid-template-columns: 1.5fr 1fr; gap: 16px; margin-bottom: 16px; }
@media (max-width: 900px) { .grid-2 { grid-template-columns: 1fr; } }

.panel { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 22px; margin-bottom: 16px; }
.panel-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.panel-header h3 { font-family: 'Space Grotesk', sans-serif; font-size: 15.5px; font-weight: 600; }

.link-btn { background: none; border: none; color: var(--accent); font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 2px; cursor: pointer; }

.legend-list { display: flex; flex-wrap: wrap; gap: 10px 16px; margin-top: 12px; }
.legend-item { display: flex; align-items: center; gap: 6px; font-size: 12.5px; color: var(--text-dim); }
.dot { width: 8px; height: 8px; border-radius: 50%; }

.tx-list { display: flex; flex-direction: column; gap: 2px; }
.tx-row { display: flex; align-items: center; gap: 14px; padding: 12px 4px; border-bottom: 1px solid var(--border); }
.tx-row:last-child { border-bottom: none; }
.tx-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.tx-icon.income { background: rgba(0,217,163,0.12); color: var(--accent); }
.tx-icon.expense { background: rgba(255,92,92,0.12); color: var(--danger); }
.tx-info { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
.tx-note { font-size: 14px; font-weight: 500; }
.tx-cat { font-size: 12px; color: var(--text-dim); }
.tx-amount { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 14.5px; white-space: nowrap; }
.tx-amount.income { color: var(--accent); }
.tx-amount.expense { color: var(--danger); }

/* ================= Transactions groupées par catégorie ================= */
.cat-section { margin-bottom: 28px; }
.cat-section-title { font-family: 'Space Grotesk', sans-serif; font-size: 18px; font-weight: 700; letter-spacing: -0.01em; margin-bottom: 14px; }
.cat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px; margin-bottom: 14px; }

.cat-card { background: var(--card); border: 1px solid var(--border); border-radius: 14px; padding: 16px; display: flex; flex-direction: column; gap: 10px; }
.cat-card-header { display: flex; align-items: center; gap: 10px; }
.cat-card-icon { width: 34px; height: 34px; border-radius: 10px; background: #0D1017; display: flex; align-items: center; justify-content: center; font-size: 17px; flex-shrink: 0; }
.cat-card-name { flex: 1; font-size: 14px; font-weight: 600; min-width: 0; }
.cat-card-total { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 15px; white-space: nowrap; }
.cat-card-total.expense { color: var(--danger); }
.cat-card-total.income { color: var(--accent); }

.cat-card-lines { display: flex; flex-direction: column; border-top: 1px solid var(--border); padding-top: 8px; }
.cat-line { display: flex; align-items: baseline; gap: 8px; padding: 5px 0; font-size: 12.5px; }
.cat-line-note { flex: 1; color: var(--text); font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
.cat-line-date { color: var(--text-dim); font-size: 11px; white-space: nowrap; flex-shrink: 0; }
.cat-line-amount { color: var(--text-dim); font-weight: 600; white-space: nowrap; flex-shrink: 0; }

.cat-section-total {
  display: flex; align-items: center; justify-content: space-between;
  background: #0D1017; border: 1px solid var(--border); border-radius: 12px;
  padding: 14px 18px; font-size: 14px; font-weight: 700;
}
.cat-section-total.expense { border-color: rgba(255,92,92,0.25); }
.cat-section-total.income { border-color: rgba(0,217,163,0.25); }
.cat-section-total-value { font-family: 'Space Grotesk', sans-serif; font-size: 19px; font-weight: 700; }
.cat-section-total-value.expense { color: var(--danger); }
.cat-section-total-value.income { color: var(--accent); }

.btn-primary {
  display: flex; align-items: center; gap: 6px;
  background: var(--accent); color: #05130E; border: none;
  padding: 10px 18px; border-radius: 10px; font-weight: 700; font-size: 13.5px; cursor: pointer;
  transition: transform 0.12s ease;
}
.btn-primary:hover { transform: translateY(-1px); }
.btn-primary.full { width: 100%; justify-content: center; margin-top: 8px; }

.filter-pills { display: flex; gap: 8px; margin-bottom: 18px; }
.pill { background: var(--card); border: 1px solid var(--border); color: var(--text-dim); padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; cursor: pointer; }
.pill.active { background: var(--accent); border-color: var(--accent); color: #05130E; }

.modal-overlay { position: fixed; inset: 0; background: rgba(5,7,11,0.7); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 20px; }
.modal { background: var(--card); border: 1px solid var(--border); border-radius: 18px; padding: 24px; width: 100%; max-width: 420px; max-height: 85vh; overflow-y: auto; }
.modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
.modal-header h3 { font-family: 'Space Grotesk', sans-serif; font-size: 17px; font-weight: 700; }

.type-toggle { display: flex; gap: 8px; margin-bottom: 16px; }
.type-toggle button { flex: 1; padding: 10px; border-radius: 10px; border: 1px solid var(--border); background: transparent; color: var(--text-dim); font-weight: 600; cursor: pointer; }
.type-toggle button.active.expense { background: rgba(255,92,92,0.12); border-color: var(--danger); color: var(--danger); }
.type-toggle button.active.income { background: rgba(0,217,163,0.12); border-color: var(--accent); color: var(--accent); }

.field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
.field span { font-size: 12.5px; color: var(--text-dim); font-weight: 500; }
.field input, .field select { background: #0D1017; border: 1px solid var(--border); color: var(--text); padding: 11px 13px; border-radius: 10px; font-size: 14px; outline: none; }
.field input:focus, .field select:focus { border-color: var(--accent); }

.category-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.category-chip {
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  background: #0D1017; border: 1.5px solid var(--border); color: var(--text-dim);
  padding: 10px 6px; border-radius: 12px; font-size: 11px; font-weight: 600; cursor: pointer;
  transition: all 0.15s ease; text-align: center; line-height: 1.2;
}
.category-chip:hover { border-color: #2C3444; }
.category-chip.active { border-color: var(--accent); background: rgba(0,217,163,0.1); color: var(--accent); }
.category-emoji { font-size: 20px; }

/* ---------- Anneau de rotation (signature visuelle, partagée liste + détail) ---------- */
.round-ring { position: relative; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.round-ring-progress { transition: stroke-dasharray 0.6s cubic-bezier(0.65,0,0.35,1); }
.ring-active-dot { filter: drop-shadow(0 0 4px rgba(255,176,32,0.9)); }
.round-ring-center { position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.ring-round-num { font-family: 'Space Grotesk', sans-serif; font-size: 14px; font-weight: 700; color: var(--text); line-height: 1.1; }
.ring-round-num.lg { font-size: 30px; line-height: 1; }
.ring-round-label { font-size: 10px; color: var(--text-dim); font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; }
.ring-round-total { font-size: 10.5px; color: var(--text-dim); font-weight: 600; }
.row-ring-txt { font-size: 11px; font-weight: 700; color: var(--text); }

.type-tag { font-size: 10.5px; font-weight: 700; padding: 3px 8px; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.03em; white-space: nowrap; }
.type-tag.rotation { background: rgba(91,159,255,0.14); color: #5B9FFF; }
.type-tag.share { background: rgba(255,126,212,0.14); color: #FF7ED4; }
.type-tag.lg { font-size: 12px; padding: 5px 12px; border-radius: 8px; }
.tontine-title-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.tontine-sub { font-size: 12px; color: var(--text-dim); display: block; }
.tontine-dates { display: flex; align-items: center; gap: 4px; font-size: 12.5px; color: var(--text-dim); margin-top: 4px; }
.countdown { display: flex; align-items: center; gap: 4px; background: rgba(255,176,32,0.12); color: var(--gold); font-size: 12px; font-weight: 700; padding: 5px 10px; border-radius: 8px; white-space: nowrap; }
.countdown.urgent { background: rgba(255,92,92,0.14); color: var(--danger); animation: pulseUrgent 1.6s ease-in-out infinite; }
@keyframes pulseUrgent { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }

.turn-callout { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.turn-callout-label { font-size: 11px; color: var(--text-dim); font-weight: 600; text-transform: uppercase; letter-spacing: 0.03em; }
.turn-callout-value { font-family: 'Space Grotesk', sans-serif; font-size: 17px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.turn-callout.lg .turn-callout-label { font-size: 13px; }
.turn-callout-value.lg { font-size: 28px; letter-spacing: -0.01em; }
.mini-status-row { display: flex; gap: 8px; flex-wrap: wrap; }
.mini-status-row.lg { gap: 10px; }
.mini-status { display: flex; align-items: center; gap: 3px; font-size: 11.5px; font-weight: 700; padding: 3px 7px; border-radius: 6px; }
.mini-status-row.lg .mini-status { font-size: 13px; padding: 6px 11px; border-radius: 8px; }
.mini-status.paid { background: rgba(0,217,163,0.12); color: var(--accent); }
.mini-status.pending { background: rgba(255,176,32,0.12); color: var(--gold); }
.mini-status.missed { background: rgba(255,92,92,0.1); color: var(--danger); }

/* ================= PAGE 1 : liste compacte des tontines ================= */
.tontine-list { display: flex; flex-direction: column; gap: 10px; }
.tontine-row {
  display: flex; align-items: center; gap: 18px; width: 100%; text-align: start;
  background: var(--card); border: 1px solid var(--border); border-radius: 16px;
  padding: 14px 18px; cursor: pointer; transition: all 0.15s ease; color: var(--text); font: inherit;
}
.tontine-row:hover { border-color: rgba(0,217,163,0.35); background: var(--card-hover); transform: translateY(-1px); }
.tontine-row-ring { flex-shrink: 0; }
.tontine-row-main { display: flex; flex-direction: column; gap: 3px; min-width: 0; flex: 1.4; }
.tontine-row-main h3 { font-family: 'Space Grotesk', sans-serif; font-size: 15px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tontine-row-figure { display: flex; flex-direction: column; gap: 3px; flex: 1; min-width: 0; }
.tontine-row-status { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.tontine-row-chevron { color: var(--text-dim); flex-shrink: 0; }

/* ================= PAGE 2 : dashboard détaillé, écriture premium ================= */
.tontine-detail { max-width: 880px; margin: 0 auto; }
.detail-back {
  display: inline-flex; align-items: center; gap: 4px; background: transparent; border: none;
  color: var(--text-dim); font-size: 13.5px; font-weight: 600; cursor: pointer; padding: 6px 0; margin-bottom: 12px;
}
.detail-back:hover { color: var(--text); }
.back-chevron { transform: rotate(180deg); }
[dir="rtl"] .back-chevron { transform: rotate(0deg); }

.detail-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
.detail-header-main { display: flex; flex-direction: column; gap: 6px; }
.detail-title { font-family: 'Space Grotesk', sans-serif; font-size: 32px; font-weight: 700; letter-spacing: -0.02em; line-height: 1.15; }
.detail-subline { font-size: 14.5px; color: var(--text-dim); font-weight: 500; }

.detail-hero {
  display: flex; align-items: center; gap: 32px; padding: 32px; margin-bottom: 20px;
  background: linear-gradient(135deg, #121722 0%, #141a26 60%, #151322 100%);
  position: relative; overflow: hidden; flex-wrap: wrap;
}
.detail-hero::before {
  content: ''; position: absolute; inset: 0;
  background: radial-gradient(circle at 88% -10%, rgba(0,217,163,0.16), transparent 55%);
  pointer-events: none;
}
.detail-hero-info { display: flex; flex-direction: column; gap: 16px; min-width: 0; flex: 1; position: relative; }

.detail-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 20px; }
.detail-stat-card { display: flex; flex-direction: column; gap: 8px; padding: 20px; }
.detail-stat-value { font-family: 'Space Grotesk', sans-serif; font-size: 26px; font-weight: 700; letter-spacing: -0.01em; }
.detail-stat-value.accent { color: var(--accent); }

.section-block { margin-bottom: 24px; }
.detail-section { margin-bottom: 28px; }
.section-title { font-family: 'Space Grotesk', sans-serif; font-size: 17px; font-weight: 700; letter-spacing: -0.01em; margin-bottom: 12px; }
.section-title-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 12px; flex-wrap: wrap; }
.section-title-row .section-title { margin-bottom: 0; }
.filter-pills.compact { margin: 0; }

.tontine-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 16px; }
.progress-bar { height: 6px; background: var(--border); border-radius: 4px; overflow: hidden; margin-top: 6px; }
.progress-bar.large { height: 8px; margin: 12px 0; }
.progress-fill { height: 100%; background: linear-gradient(90deg, var(--accent), #00A87F); border-radius: 4px; transition: width 0.6s ease; }

.member-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; max-height: 220px; overflow-y: auto; }
.member-list.lg { max-height: none; gap: 10px; margin-bottom: 0; }
.member-list.lg .member-row { padding: 12px 14px; }
.member-row { display: flex; align-items: center; gap: 10px; padding: 8px; border-radius: 10px; background: #0D1017; }
.member-row.me { background: rgba(0,217,163,0.08); border: 1px solid rgba(0,217,163,0.25); }
.member-row.current-turn { border: 1px solid rgba(255,176,32,0.35); }
.member-avatar { position: relative; width: 28px; height: 28px; border-radius: 8px; background: var(--border); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; }
.turn-dot { position: absolute; top: -3px; right: -3px; width: 9px; height: 9px; border-radius: 50%; background: var(--gold); border: 2px solid var(--card); box-shadow: 0 0 0 2px rgba(255,176,32,0.25); }
.member-name-block { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.member-name { font-size: 13px; font-weight: 500; }
.member-username { font-size: 11px; color: var(--text-dim); }
.member-turn { font-size: 11px; color: var(--text-dim); }
.member-rounds-left { font-size: 11px; color: var(--text-dim); white-space: nowrap; }
.status-chip { display: flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 700; padding: 4px 8px; border-radius: 6px; }
.status-chip.paid { background: rgba(0,217,163,0.12); color: var(--accent); }
.status-chip.pending { background: rgba(255,176,32,0.12); color: var(--gold); }
.status-chip.missed { background: rgba(255,92,92,0.1); color: var(--danger); }
.status-chip.editable { cursor: pointer; }
.status-chip:disabled { cursor: default; opacity: 0.85; }

/* Choix du type de tontine (rotation vs partage à la fin) */
.type-choice-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.type-choice-card {
  display: flex; flex-direction: column; gap: 4px; text-align: start;
  padding: 12px; border-radius: 12px; border: 1.5px solid var(--border);
  background: #0D1017; color: var(--text); cursor: pointer; transition: all 0.15s ease;
}
.type-choice-card strong { font-size: 13.5px; font-weight: 700; }
.type-choice-card span { font-size: 11.5px; color: var(--text-dim); }
.type-choice-card.active { border-color: var(--accent); background: rgba(0,217,163,0.08); }
.type-choice-card.active strong { color: var(--accent); }

/* Recherche d'utilisateur (annuaire de l'app) */
.user-search { display: flex; flex-direction: column; gap: 8px; }
.user-search-input {
  display: flex; align-items: center; gap: 8px; background: #0D1017;
  border: 1px solid var(--border); border-radius: 10px; padding: 10px 13px;
}
.user-search-input svg { color: var(--text-dim); flex-shrink: 0; }
.user-search-input input { flex: 1; background: transparent; border: none; color: var(--text); font-size: 14px; outline: none; }
.user-search-results { display: flex; flex-direction: column; gap: 6px; max-height: 200px; overflow-y: auto; }
.user-result-row { display: flex; align-items: center; gap: 10px; padding: 8px; border-radius: 10px; background: #0D1017; }
.user-result-info { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.user-result-name { font-size: 13px; font-weight: 500; }
.user-result-handle { font-size: 11px; color: var(--text-dim); }

/* Infos de paiement local (consultables par tous, éditables par l'admin) */
.payment-info-box { margin-bottom: 16px; }
.payment-info-panel { margin-top: 10px; background: #0D1017; border: 1px solid var(--border); border-radius: 12px; padding: 12px; display: flex; flex-direction: column; gap: 10px; }
.payment-info-display { display: flex; flex-direction: column; gap: 4px; font-size: 13px; }
.payment-info-form { display: flex; flex-direction: column; }
.payment-section { border-top: 1px solid var(--border); padding-top: 14px; margin-top: 4px; }

.btn-secondary {
  display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  background: transparent; border: 1.5px solid var(--border); color: var(--text);
  padding: 10px 16px; border-radius: 10px; font-weight: 600; font-size: 13.5px;
  cursor: pointer; transition: all 0.15s ease; white-space: nowrap;
}
.btn-secondary:hover { border-color: var(--accent); color: var(--accent); }
.btn-secondary:disabled { opacity: 0.5; cursor: default; }

.modal-actions { display: flex; gap: 10px; margin-top: 8px; }
.modal-actions .btn-secondary, .modal-actions .btn-primary { flex: 1; justify-content: center; }
.btn-secondary.small, .btn-primary.small { padding: 7px 12px; font-size: 12.5px; }

.my-payment-box {
  background: #0D1017; border: 1px solid var(--border); border-radius: 12px;
  padding: 14px; margin-bottom: 16px; display: flex; flex-direction: column; gap: 10px;
}
.my-payment-info { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 500; color: var(--text-dim); }
.my-payment-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.my-payment-dot.paid { background: var(--accent); box-shadow: 0 0 0 3px rgba(0,217,163,0.2); }
.my-payment-dot.pending { background: var(--gold); box-shadow: 0 0 0 3px rgba(255,176,32,0.2); }
.my-payment-actions { display: flex; gap: 8px; }
.payment-btn {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
  padding: 10px; border-radius: 10px; border: 1.5px solid var(--border);
  background: transparent; color: var(--text-dim); font-weight: 700; font-size: 13px; cursor: pointer;
  transition: all 0.15s ease;
}
.payment-btn.valid.active { background: rgba(0,217,163,0.12); border-color: var(--accent); color: var(--accent); }
.payment-btn.invalid.active { background: rgba(255,92,92,0.1); border-color: var(--danger); color: var(--danger); }

.tontine-footer { border-top: 1px solid var(--border); padding-top: 14px; }
.toggle-row { display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: 13px; color: var(--text-dim); }
.toggle-row input { display: none; }
.toggle-slider { width: 36px; height: 20px; background: var(--border); border-radius: 10px; position: relative; transition: background 0.2s; flex-shrink: 0; }
.toggle-slider::after { content: ''; position: absolute; width: 16px; height: 16px; background: white; border-radius: 50%; top: 2px; left: 2px; transition: transform 0.2s; }
.toggle-row input:checked + .toggle-slider { background: var(--accent); }
.toggle-row input:checked + .toggle-slider::after { transform: translateX(16px); }
[dir="rtl"] .toggle-row input:checked + .toggle-slider::after { transform: translateX(-16px); }
.toggle-row.standalone { display: inline-flex; }

.goal-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; }
.goal-card { margin-bottom: 0; }
.goal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
.goal-header h3 { font-family: 'Space Grotesk', sans-serif; font-size: 15px; font-weight: 600; }
.goal-pct { font-family: 'Space Grotesk', sans-serif; font-weight: 700; color: var(--accent); }
.goal-footer { display: flex; justify-content: space-between; align-items: center; font-size: 13px; color: var(--text-dim); margin-top: 8px; }
.goal-deadline { display: flex; align-items: center; gap: 4px; font-size: 12px; }

.compare-card { display: flex; flex-direction: column; gap: 12px; }
.compare-label { font-size: 12.5px; color: var(--text-dim); font-weight: 600; text-transform: uppercase; letter-spacing: 0.03em; }
.compare-row { display: flex; align-items: center; gap: 10px; }
.pos-icon { color: var(--accent); }
.neg-icon { color: var(--danger); }

.settings-panel { display: flex; flex-direction: column; }
.settings-row { display: flex; align-items: center; justify-content: space-between; padding: 16px 4px; border-bottom: 1px solid var(--border); flex-wrap: wrap; gap: 10px; }
.settings-row:last-child { border-bottom: none; }
.settings-label { display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 500; }
.theme-tag { background: rgba(255,176,32,0.12); color: var(--gold); padding: 6px 12px; border-radius: 8px; font-size: 12.5px; font-weight: 700; }

.notif-modal { max-width: 380px; }
.mark-read { margin-bottom: 14px; }
.notif-list { display: flex; flex-direction: column; gap: 8px; }
.notif-item { display: flex; gap: 12px; padding: 12px; border-radius: 12px; background: #0D1017; opacity: 0.6; }
.notif-item.unread { opacity: 1; border: 1px solid rgba(0,217,163,0.2); }
.notif-icon { width: 32px; height: 32px; border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.notif-icon.tontine { background: rgba(255,176,32,0.12); color: var(--gold); }
.notif-icon.budget { background: rgba(255,92,92,0.12); color: var(--danger); }
.notif-item p { font-size: 13.5px; font-weight: 500; margin-bottom: 2px; }
.notif-item span { font-size: 11.5px; color: var(--text-dim); }

.toast-stack { position: fixed; bottom: 24px; inset-inline-end: 24px; display: flex; flex-direction: column; gap: 10px; z-index: 200; }
.toast {
  display: flex; align-items: center; gap: 10px;
  background: var(--card); border: 1px solid rgba(0,217,163,0.3);
  padding: 14px 18px; border-radius: 12px; font-size: 13.5px; font-weight: 500;
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  animation: slideIn 0.3s ease;
}
.toast svg { color: var(--accent); flex-shrink: 0; }
@keyframes slideIn { from { transform: translateX(30px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
[dir="rtl"] .toast { animation: slideInRTL 0.3s ease; }
@keyframes slideInRTL { from { transform: translateX(-30px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

@media (max-width: 768px) {
  .sidebar { position: fixed; bottom: 0; top: auto; width: 100%; height: 64px; flex-direction: row; padding: 8px; z-index: 50; border-inline-end: none; border-top: 1px solid var(--border); }
  .brand, .sidebar-footer { display: none; }
  .nav { flex-direction: row; justify-content: space-around; width: 100%; }
  .nav-item span { display: none; }
  .nav-item { flex-direction: column; padding: 8px; }
  .main-col { padding-bottom: 64px; }
  .content { padding: 20px 16px 80px; }
  .topbar { padding: 14px 16px; }
  .topbar-search { width: 140px; }
  .stat-grid { grid-template-columns: 1fr 1fr; }
}

::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
`;

export default App;
