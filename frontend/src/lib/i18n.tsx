"use client";

/* Bangla / English.
   Strings are keyed by their English text, so untranslated keys fall back
   to English instead of showing a raw key. Course content, questions and
   forum posts stay in the language they were authored in; the CMS will
   carry bilingual fields once the backend exists. */

import { useCallback } from "react";
import { useStore, type Lang } from "./store";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

const bn: Record<string, string> = {
  // brand + nav
  "AI Academy": "এআই একাডেমি",
  "by Tradevics AI": "ট্রেডভিক্স এআই-এর অংশ",
  Courses: "কোর্স",
  "Live classes": "লাইভ ক্লাস",
  "Practical lab": "প্র্যাকটিক্যাল ল্যাব",
  Pricing: "মূল্য",
  "Verify certificate": "সার্টিফিকেট যাচাই",
  "Log in": "লগ ইন",
  "Log out": "লগ আউট",
  "Start learning": "শেখা শুরু করুন",
  "Open my workspace": "আমার ওয়ার্কস্পেস",
  "Public site": "পাবলিক সাইট",
  Search: "খুঁজুন",
  "Search courses, cases, threads": "কোর্স, কেস বা আলোচনা খুঁজুন",
  Notifications: "নোটিফিকেশন",
  "Mark all read": "সব পড়া হয়েছে",
  Student: "শিক্ষার্থী",
  Mentor: "মেন্টর",
  Admin: "অ্যাডমিন",
  "Learning workspace": "শেখার ওয়ার্কস্পেস",
  "Mentor and tutor portal": "মেন্টর ও টিউটর পোর্টাল",
  "Admin portal": "অ্যাডমিন পোর্টাল",
  Dashboard: "ড্যাশবোর্ড",
  "My courses": "আমার কোর্স",
  Exams: "পরীক্ষা",
  People: "মানুষ",
  Community: "কমিউনিটি",
  "My mentor": "আমার মেন্টর",
  Account: "অ্যাকাউন্ট",
  Certificates: "সার্টিফিকেট",
  "Plan and settings": "প্ল্যান ও সেটিংস",
  Overview: "সারসংক্ষেপ",
  "My students": "আমার শিক্ষার্থী",
  Reports: "রিপোর্ট",
  Sessions: "সেশন",
  "Course management": "কোর্স ব্যবস্থাপনা",
  "Courses and CMS": "কোর্স ও সিএমএস",
  "Master schedule": "মাস্টার সময়সূচি",
  Documents: "ডকুমেন্ট",
  Enrolments: "এনরোলমেন্ট",
  "Live and video": "লাইভ ও ভিডিও",
  Assessment: "মূল্যায়ন",
  "Lab and simulator": "ল্যাব ও সিমুলেটর",
  "Question bank": "প্রশ্নব্যাংক",
  "Exams and grading": "পরীক্ষা ও গ্রেডিং",
  Analytics: "অ্যানালিটিক্স",
  "Mentors and tutors": "মেন্টর ও টিউটর",
  Platform: "প্ল্যাটফর্ম",
  "Roles and tenants": "রোল ও টেন্যান্ট",
  "Subscriptions and billing": "সাবস্ক্রিপশন ও বিলিং",
  Security: "নিরাপত্তা",
  "API keys and integrations": "এপিআই কী ও ইন্টিগ্রেশন",
  "AI agents": "এআই এজেন্ট",
  "No active plan": "কোনো সক্রিয় প্ল্যান নেই",
  "Lessons beyond previews, labs and live classes need a subscription.": "প্রিভিউর বাইরের লেসন, ল্যাব ও লাইভ ক্লাসের জন্য সাবস্ক্রিপশন লাগবে।",
  "See plans": "প্ল্যান দেখুন",
  "Compare plans": "প্ল্যান তুলনা করুন",
  "needs a subscription": "এর জন্য সাবস্ক্রিপশন প্রয়োজন",
  "AI Academy is a paid platform. Pick a plan to unlock full lessons, the practical lab, exams and expert-led live classes.":
    "এআই একাডেমি একটি পেইড প্ল্যাটফর্ম। পূর্ণ লেসন, প্র্যাকটিক্যাল ল্যাব, পরীক্ষা ও বিশেষজ্ঞদের লাইভ ক্লাস পেতে একটি প্ল্যান বেছে নিন।",

  // landing
  "Module 13 of the Tradevics AI platform": "ট্রেডভিক্স এআই প্ল্যাটফর্মের মডিউল ১৩",
  "Rehearse the assessment before the officer asks.": "অফিসার প্রশ্ন করার আগেই অ্যাসেসমেন্টের প্রস্তুতি নিন।",
  "Customs and trade training for importers, C&F agents and tax practitioners in Bangladesh. Learn classification, valuation and VAT from people who have sat on the other side of the counter, then argue real cases with an AI examiner until you get them right.":
    "বাংলাদেশের আমদানিকারক, সিএন্ডএফ এজেন্ট ও ট্যাক্স প্র্যাকটিশনারদের জন্য কাস্টমস ও বাণিজ্য প্রশিক্ষণ। যাঁরা কাউন্টারের অপর পাশে বসেছেন, তাঁদের কাছ থেকে শ্রেণিবিন্যাস, মূল্যায়ন ও ভ্যাট শিখুন, তারপর এআই পরীক্ষকের সঙ্গে বাস্তব কেস নিয়ে যুক্তি দিন যতক্ষণ না সঠিক হয়।",
  "Create your account": "অ্যাকাউন্ট খুলুন",
  "Browse courses": "কোর্স দেখুন",
  "Practitioners trained": "প্রশিক্ষিত পেশাজীবী",
  "Lab attempts graded": "মূল্যায়িত ল্যাব প্রচেষ্টা",
  "Licensing exam pass rate": "লাইসেন্সিং পরীক্ষায় পাসের হার",
  "Pick an answer. This is the first question of a real lab case.": "একটি উত্তর বেছে নিন। এটি একটি বাস্তব ল্যাব কেসের প্রথম প্রশ্ন।",
  "members in the forum": "জন ফোরাম সদস্য",
  "From first lesson to a certificate an employer can check": "প্রথম লেসন থেকে এমন সার্টিফিকেট, যা নিয়োগকর্তা যাচাই করতে পারেন",
  "Every course follows the same path. You can't skip to the certificate.": "প্রতিটি কোর্স একই পথে চলে। সরাসরি সার্টিফিকেটে যাওয়া যায় না।",
  Learn: "শিখুন",
  "Practise in the lab": "ল্যাবে অনুশীলন",
  "Get examined": "পরীক্ষা দিন",
  "Get certified": "সার্টিফিকেট নিন",
  "Short video lessons, readings and the legal texts you will cite, written by former officials and senior practitioners.":
    "সংক্ষিপ্ত ভিডিও লেসন, পাঠ্য ও আইনের মূল টেক্সট — সাবেক কর্মকর্তা ও অভিজ্ঞ পেশাজীবীদের লেখা।",
  "The Simulator Agent plays the assessing officer on a real consignment. You answer; it pushes back.":
    "সিমুলেটর এজেন্ট বাস্তব চালানে অ্যাসেসিং অফিসারের ভূমিকা নেয়। আপনি উত্তর দেন, সে পাল্টা প্রশ্ন করে।",
  "Timed MCQs, mock papers, case studies and a viva board. The Examiner Agent sets fresh questions each attempt.":
    "সময়বদ্ধ এমসিকিউ, মক পেপার, কেস স্টাডি ও ভাইভা বোর্ড। প্রতিবার এক্সামিনার এজেন্ট নতুন প্রশ্ন দেয়।",
  "Pass and receive a certificate with a public serial number anyone can verify.": "পাস করলে পাবলিক সিরিয়াল নম্বরসহ সার্টিফিকেট পাবেন, যা যে কেউ যাচাই করতে পারে।",
  "Three agents, one standard of marking": "তিনটি এজেন্ট, একটি মূল্যায়ন মানদণ্ড",
  "Questions, simulations and grading are handled by separate agents so no single model marks its own homework. Every score keeps an audit trail an examiner can review and override.":
    "প্রশ্ন, সিমুলেশন ও গ্রেডিং আলাদা এজেন্ট করে, যাতে কোনো মডেল নিজের কাজ নিজে না দেখে। প্রতিটি স্কোরের অডিট ট্রেইল থাকে, যা পরীক্ষক দেখে পরিবর্তন করতে পারেন।",
  "Examiner Agent": "এক্সামিনার এজেন্ট",
  "Simulator Agent": "সিমুলেটর এজেন্ট",
  "Evaluation Engine": "ইভ্যালুয়েশন ইঞ্জিন",
  "Builds question sets from the bank, runs viva follow-ups and adapts difficulty to your weak areas.": "প্রশ্নব্যাংক থেকে প্রশ্নসেট তৈরি করে, ভাইভায় ফলো-আপ প্রশ্ন করে এবং আপনার দুর্বলতা অনুযায়ী কাঠিন্য বদলায়।",
  "Plays officers, clients and bankers inside lab cases, using the case documents as its only source of facts.": "ল্যাব কেসে অফিসার, ক্লায়েন্ট ও ব্যাংকারের ভূমিকা নেয়; তথ্যের একমাত্র উৎস কেসের ডকুমেন্ট।",
  "Scores each answer against the examiner's rubric and flags low-confidence marks for a human.": "পরীক্ষকের রুব্রিক অনুযায়ী প্রতিটি উত্তরে নম্বর দেয় এবং অনিশ্চিত নম্বর মানুষের কাছে পাঠায়।",
  "Courses practitioners ask for": "পেশাজীবীরা যে কোর্স চান",
  "All courses": "সব কোর্স",
  "Expert-led live classes": "বিশেষজ্ঞদের লাইভ ক্লাস",
  "When the rules change, an expert explains them that week": "নিয়ম বদলালে সেই সপ্তাহেই বিশেষজ্ঞ ব্যাখ্যা করেন",
  "Every subscriber is notified when a session is scheduled. Recordings come with an AI transcript, lecture notes and slides, produced on the same pipeline the rest of the academy uses.":
    "সেশন নির্ধারিত হলে প্রত্যেক সাবস্ক্রাইবারকে জানানো হয়। রেকর্ডিংয়ের সঙ্গে থাকে এআই ট্রান্সক্রিপ্ট, লেকচার নোট ও স্লাইড।",
  "From a mentor's monthly report": "একজন মেন্টরের মাসিক রিপোর্ট থেকে",
  "Mentor, licensed C&F agent": "মেন্টর, লাইসেন্সপ্রাপ্ত সিএন্ডএফ এজেন্ট",
  "One subscription covers courses, the lab, exams and live classes": "একটি সাবস্ক্রিপশনে কোর্স, ল্যাব, পরীক্ষা ও লাইভ ক্লাস",
  "Pay with bKash, Nagad, card or bank transfer. Firms get one invoice for every seat.": "বিকাশ, নগদ, কার্ড বা ব্যাংক ট্রান্সফারে পেমেন্ট করুন। ফার্মগুলো সব সিটের জন্য একটি ইনভয়েস পায়।",
  per: "প্রতি",
  month: "মাস",
  quarter: "ত্রৈমাসিক",
  "seat / quarter": "সিট / ত্রৈমাসিক",
  Live: "লাইভ",
  "Live now": "এখন লাইভ",

  // footer
  "Trade and customs training for people who clear goods, file returns and answer to assessing officers. A Tradevics AI company.":
    "যাঁরা পণ্য খালাস করেন, রিটার্ন দাখিল করেন এবং অ্যাসেসিং অফিসারের মুখোমুখি হন, তাঁদের জন্য বাণিজ্য ও কাস্টমস প্রশিক্ষণ। ট্রেডভিক্স এআই-এর প্রতিষ্ঠান।",
  Company: "প্রতিষ্ঠান",
  Terms: "শর্তাবলি",
  Privacy: "গোপনীয়তা",
  "Verify a certificate": "সার্টিফিকেট যাচাই",
  Importers: "আমদানিকারক",
  "C&F Agents": "সিএন্ডএফ এজেন্ট",
  "Tax practitioners": "ট্যাক্স প্র্যাকটিশনার",

  // auth
  "New here?": "নতুন?",
  "Create an account": "অ্যাকাউন্ট খুলুন",
  "Email or mobile number": "ইমেইল বা মোবাইল নম্বর",
  Password: "পাসওয়ার্ড",
  "Forgot password?": "পাসওয়ার্ড ভুলে গেছেন?",
  "Explore the demo": "ডেমো দেখুন",
  "Sign in instantly as one of three sample accounts.": "তিনটি নমুনা অ্যাকাউন্টের যেকোনো একটিতে সরাসরি প্রবেশ করুন।",
  "Already have one?": "আগে থেকেই অ্যাকাউন্ট আছে?",
  "Full name": "পূর্ণ নাম",
  Email: "ইমেইল",
  "Mobile number": "মোবাইল নম্বর",
  "Company (optional)": "প্রতিষ্ঠান (ঐচ্ছিক)",
  "I work as": "আমার পেশা",
  "Confirm password": "পাসওয়ার্ড নিশ্চিত করুন",
  "Send verification code": "যাচাই কোড পাঠান",
  "By creating an account you agree to the terms and privacy policy.": "অ্যাকাউন্ট খোলার মাধ্যমে আপনি শর্তাবলি ও গোপনীয়তা নীতিতে সম্মত হচ্ছেন।",
  "Check your email": "ইমেইল দেখুন",
  "Verify and continue": "যাচাই করে এগিয়ে যান",
  "Change email address": "ইমেইল ঠিকানা বদলান",
  "The academy for people who clear goods, file returns and answer to assessing officers.": "যাঁরা পণ্য খালাস করেন, রিটার্ন দাখিল করেন এবং অ্যাসেসিং অফিসারের মুখোমুখি হন — তাঁদের একাডেমি।",
  "AI Academy is part of Tradevics AI. One account works across both.": "এআই একাডেমি ট্রেডভিক্স এআই-এর অংশ। একটি অ্যাকাউন্টেই দুটো চলে।",

  // pages
  Plans: "প্ল্যান",
  "Most chosen": "সবচেয়ে জনপ্রিয়",
  "Your current plan": "আপনার বর্তমান প্ল্যান",
  "Every course is included in your subscription. Preview lessons are open to everyone.": "সব কোর্স আপনার সাবস্ক্রিপশনে অন্তর্ভুক্ত। প্রিভিউ লেসন সবার জন্য উন্মুক্ত।",
  Recordings: "রেকর্ডিং",
  Upcoming: "আসন্ন",
  "Remind me": "মনে করিয়ে দিন",
  "Reminder set": "রিমাইন্ডার সেট",
  "Join now": "এখনই যোগ দিন",
  "Join class": "ক্লাসে যোগ দিন",
  "Enter the serial number printed at the bottom of the certificate.": "সার্টিফিকেটের নিচে ছাপা সিরিয়াল নম্বর লিখুন।",
  "Check certificate": "সার্টিফিকেট যাচাই করুন",
  "Good afternoon": "শুভ অপরাহ্ন",
  "Continue where you left off": "যেখানে থেমেছিলেন সেখান থেকে",
  "Resume lesson": "লেসন চালিয়ে যান",
  "Overall progress": "সামগ্রিক অগ্রগতি",
  "Average score": "গড় স্কোর",
  "Lab cases passed": "উত্তীর্ণ ল্যাব কেস",
  "Exams taken": "দেওয়া পরীক্ষা",
  "Open the lab": "ল্যাব খুলুন",
  "Skill profile": "দক্ষতার প্রোফাইল",
  "Your scores against learners at the same stage": "একই পর্যায়ের শিক্ষার্থীদের তুলনায় আপনার স্কোর",
  "Skill gaps": "দক্ষতার ঘাটতি",
  "Points above or below cohort average": "গড়ের চেয়ে কত পয়েন্ট বেশি বা কম",
  "Your learning path": "আপনার শেখার পথ",
  "Reordered weekly from your results": "আপনার ফলাফল অনুযায়ী প্রতি সপ্তাহে সাজানো",
  "Study hours per week": "সাপ্তাহিক পড়ার ঘণ্টা",
  "Average assessment score": "মূল্যায়নের গড় স্কোর",
  "Recent results": "সাম্প্রতিক ফলাফল",
  "All results": "সব ফলাফল",
  Assessment_col: "মূল্যায়ন",
  Type: "ধরন",
  Date: "তারিখ",
  Score: "স্কোর",
  "Ask a question": "প্রশ্ন করুন",
  "All groups": "সব গ্রুপ",
  Latest: "সর্বশেষ",
  Top: "শীর্ষ",
  Unanswered: "উত্তরহীন",
  "Join group": "গ্রুপে যোগ দিন",
  "Leave group": "গ্রুপ ছাড়ুন",
  "Book a session": "সেশন বুক করুন",
  "Upcoming sessions": "আসন্ন সেশন",
  "Progress reports": "অগ্রগতির রিপোর্ট",
  Messages: "বার্তা",
  Send: "পাঠান",
  "Start case": "কেস শুরু করুন",
  "Try again": "আবার চেষ্টা করুন",
  Start: "শুরু করুন",
  Retake: "আবার দিন",
  Practise: "অনুশীলন",
  Enrolled: "এনরোলড",
  Available: "উপলব্ধ",
  Enrol: "এনরোল",
  Details: "বিস্তারিত",
  Profile: "প্রোফাইল",
  "Save profile": "প্রোফাইল সংরক্ষণ",
  "Payment history": "পেমেন্টের ইতিহাস",
  "Current plan": "বর্তমান প্ল্যান",
  "Change plan": "প্ল্যান বদলান",
  "Cancel subscription": "সাবস্ক্রিপশন বাতিল",
  "You don't have access to this area": "এই অংশে আপনার প্রবেশাধিকার নেই",
  "You're signed in as": "আপনি লগ ইন করেছেন",
  "Back to my workspace": "আমার ওয়ার্কস্পেসে ফিরুন",
  "Switch demo account": "ডেমো অ্যাকাউন্ট বদলান",
  "See how practitioners use AI Academy": "পেশাজীবীরা কীভাবে এআই একাডেমি ব্যবহার করেন দেখুন",
  "A short narrated tour: a lesson, a lab case against the AI officer, an exam, your dashboard, a live class and the admin portal.": "ধারাভাষ্যসহ ছোট পরিচিতি: একটি লেসন, এআই অফিসারের সঙ্গে ল্যাব কেস, পরীক্ষা, ড্যাশবোর্ড, লাইভ ক্লাস ও অ্যাডমিন পোর্টাল।",
  "Study with AI lecture notes": "এআই লেকচার নোট দিয়ে পড়ুন",
  "Argue a real case with the Simulator Agent": "সিমুলেটর এজেন্টের সঙ্গে বাস্তব কেসে যুক্তি দিন",
  "Get scored against the examiner's rubric": "পরীক্ষকের রুব্রিক অনুযায়ী নম্বর পান",
  "Join expert live classes with automatic notes": "স্বয়ংক্রিয় নোটসহ বিশেষজ্ঞদের লাইভ ক্লাসে যোগ দিন",
  "AI Academy product tour": "এআই একাডেমি পরিচিতি ভিডিও",
  "Play the product tour": "পরিচিতি ভিডিও চালান",
  "Narrated tour, under 2 minutes": "ধারাভাষ্যসহ পরিচিতি, ২ মিনিটের কম",
  "This page isn't on the manifest": "এই পেজটি ম্যানিফেস্টে নেই",
  "The link may be old or mistyped. Go back to the home page or browse the courses.": "লিংকটি পুরোনো বা ভুল হতে পারে। হোম পেজে ফিরুন বা কোর্স দেখুন।",
  "Go to home page": "হোম পেজে যান",
  "AI Academy is Module 13 of the Tradevics AI platform.": "এআই একাডেমি ট্রেডভিক্স এআই প্ল্যাটফর্মের মডিউল ১৩।",
  "Skip to content": "মূল অংশে যান",
  Monthly: "মাসিক",
  Professional: "প্রফেশনাল",
  Firm: "ফার্ম",
  "The practical lab": "প্র্যাকটিক্যাল ল্যাব",
  "Live class recordings": "লাইভ ক্লাসের রেকর্ডিং",
  Mentoring: "মেন্টরিং",
  "Good evening": "শুভ সন্ধ্যা",
  "Good morning": "শুভ সকাল",
  "Assigned students": "নির্ধারিত শিক্ষার্থী",
  "Need attention": "মনোযোগ প্রয়োজন",
  "Reports due": "বাকি রিপোর্ট",
  "Needs attention": "মনোযোগ প্রয়োজন",
  "Next sessions": "পরবর্তী সেশন",
  "All students": "সব শিক্ষার্থী",
  Schedule: "সময়সূচি",
  Courses_admin: "কোর্স",
  "Active subscribers": "সক্রিয় সাবস্ক্রাইবার",
  "Revenue this month": "এই মাসের আয়",
  "Completion rate": "সম্পন্নের হার",
  "Lab attempts this week": "এই সপ্তাহের ল্যাব প্রচেষ্টা",
};

const bnDigits = "০১২৩৪৫৬৭৮৯";

export function useT() {
  const { lang } = useStore();
  const t = useCallback((s: string) => (lang === "bn" ? (bn[s] ?? s) : s), [lang]);
  /** numbers in the reader's script */
  const n = useCallback((v: number | string) => (lang === "bn" ? String(v).replace(/\d/g, (d) => bnDigits[+d]) : String(v)), [lang]);
  return { t, n, lang };
}

export function LangToggle({ className }: { className?: string }) {
  const { lang, setLang } = useStore();
  const opts: [Lang, string][] = [
    ["en", "EN"],
    ["bn", "বাং"],
  ];
  return (
    <div role="group" aria-label="Language" className={cx("flex items-center rounded-full border border-line bg-white/70 p-0.5", className)}>
      {opts.map(([l, label]) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          lang={l}
          className={cx("h-7 min-w-9 rounded-full px-2.5 text-xs font-semibold transition-colors", lang === l ? "bg-indigo text-white" : "text-muted hover:text-text")}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
