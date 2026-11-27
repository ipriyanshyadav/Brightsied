import type { Product } from "@/lib/content/types";

// Written for school owners, principals, college administrators and coaching institute heads.
export const institute: Product = {
  slug: "institute",
  name: "Brightseid Institute Management",
  shortName: "Institute Management",
  tile: "vectors",
  tagline: "Run your school, college or institute from one place, from the first enquiry to the final result.",
  summary:
    "Admissions, attendance, fees, timetables, online tests, exams and results, with an app for parents and students. For schools, colleges and coaching institutes, with an AI assistant that answers questions from your own records.",
  status: "Demo available",
  audience: ["Schools", "Colleges and universities", "Coaching and training institutes"],
  features: [
    { title: "One place for everything", body: "Admissions, students, staff, fees, attendance and timetables, instead of registers and spreadsheets." },
    { title: "Tests online, marked for you", body: "Computer-based tests from your own question bank, with timers and automatic marking." },
    { title: "Results you can act on", body: "Board results analysed by subject, section and student, so weak spots are clear." },
    { title: "Parents always in the loop", body: "Homework, attendance, fees and notices on the parents' phone, the moment they're posted." },
    { title: "No enquiry forgotten", body: "Every walk-in, call and website enquiry followed up until it becomes an admission." },
    { title: "An assistant that knows your school", body: "Ask questions in plain words and get answers from your own records." },
  ],
  rules: [
    "Every mark and fee change recorded: who, when and why",
    "Parents see only their own child's details",
    "Your institution's data kept separate from everyone else's",
  ],
  steps: [
    {
      title: "Enquiries come in",
      body: "Walk-ins, calls and website enquiries land in one list, and each one is followed up.",
      scene: "edu-lead-capture",
    },
    {
      title: "Admitted in minutes",
      body: "Parents fill in one form. The student's record, class and fee plan are set up from it.",
      scene: "edu-erp-admit",
    },
    {
      title: "Every school day, handled",
      body: "Teachers take attendance in a tap, and fees are paid online with receipts sent automatically.",
      scene: "edu-erp-attendance",
    },
    {
      title: "Tests online, marked for you",
      body: "Students take tests on a computer or tablet. Answers are marked automatically and scores are ready at once.",
      scene: "edu-cbt-take",
    },
    {
      title: "Results reach parents",
      body: "Report cards are published to the parents' app, with a clear picture of how each child is doing.",
      scene: "edu-exam-report",
    },
  ],
  modules: [
    {
      id: "school-erp",
      name: "School management (ERP)",
      summary: "Admissions, attendance, fees, timetables and staff for the whole school, in one place.",
      steps: [
        {
          title: "Admissions without paperwork",
          body: "Parents fill in one form online. The student's record, class, section and fee plan are created from it.",
          scene: "edu-erp-admit",
        },
        {
          title: "Attendance in a tap",
          body: "Teachers mark attendance on their phone. Parents of absent or late students are told the same morning.",
          scene: "edu-erp-attendance",
        },
        {
          title: "Fees collected, receipts sent",
          body: "Parents pay online, receipts go out automatically, and the office sees who has paid and who hasn't.",
          scene: "edu-erp-fees",
        },
      ],
    },
    {
      id: "college",
      name: "College management",
      summary: "Departments, courses, credits, hostels and placements for colleges and universities.",
      steps: [
        {
          title: "Courses and semesters",
          body: "Set up departments, semesters, core subjects and electives. Students choose their electives online.",
          scene: "edu-college-courses",
        },
        {
          title: "Credits always clear",
          body: "Each student sees the credits they've earned and what's left to graduate.",
          scene: "edu-college-credits",
        },
        {
          title: "Hostels and placements",
          body: "Hostel rooms, mess fees and placement drives managed in the same system as everything else.",
          scene: "edu-college-campus",
        },
      ],
    },
    {
      id: "institute",
      name: "Coaching and training institutes",
      summary: "Courses, batches, fee instalments and progress for coaching centres and training institutes.",
      steps: [
        {
          title: "Courses and batches",
          body: "Run several courses with morning, evening and weekend batches, each with its own timetable and teachers.",
          scene: "edu-inst-batches",
        },
        {
          title: "Fees in instalments",
          body: "Set an instalment plan for each student. Reminders go out before each one is due.",
          scene: "edu-inst-instalments",
        },
        {
          title: "Progress you can show",
          body: "Test scores over time for every student, ready to share with them and their parents.",
          scene: "edu-inst-progress",
        },
      ],
    },
    {
      id: "online-assessment",
      name: "Online assessment (CBT)",
      summary: "Computer-based tests with your own question bank, timers and automatic marking.",
      steps: [
        {
          title: "Your own question bank",
          body: "Build tests from your questions. Each student can get the questions in a different order, so copying doesn't work.",
          scene: "edu-cbt-bank",
        },
        {
          title: "Taken on screen, securely",
          body: "Students take the test on a computer or tablet, with a timer and a locked screen until they submit.",
          scene: "edu-cbt-take",
        },
        {
          title: "Marked automatically",
          body: "Answers are marked as soon as the test ends, and each student gets a score card with what to work on.",
          scene: "edu-cbt-mark",
        },
      ],
    },
    {
      id: "exams",
      name: "Exam management",
      summary: "Date sheets, seating, hall tickets, marks entry and report cards.",
      steps: [
        {
          title: "Plan the exams",
          body: "Make the date sheet, assign rooms and seats, and print hall tickets for every student.",
          scene: "edu-exam-schedule",
        },
        {
          title: "Marks entered and checked",
          body: "Teachers enter marks online, and a second person checks them before results are published.",
          scene: "edu-exam-marks",
        },
        {
          title: "Report cards, ready to share",
          body: "Report cards are generated in your format and published to parents in one step.",
          scene: "edu-exam-report",
        },
      ],
    },
    {
      id: "cbse-results",
      name: "CBSE result analysis",
      summary: "Board results turned into a clear picture by subject, section and student.",
      steps: [
        {
          title: "Bring in the board results",
          body: "Upload the CBSE result file and every student's marks are read in, ready to analyse.",
          scene: "edu-cbse-import",
        },
        {
          title: "See the weak subjects",
          body: "Average scores by subject show where students struggled, so next year's teaching can focus there.",
          scene: "edu-cbse-subjects",
        },
        {
          title: "Compare sections and years",
          body: "Compare sections with each other and with last year's results to see what's improving.",
          scene: "edu-cbse-compare",
        },
      ],
    },
    {
      id: "ai-assistant",
      name: "AI school assistant",
      summary: "Ask questions in plain words and get answers from your own school's records.",
      steps: [
        {
          title: "Ask, don't search",
          body: "Ask “which students have missed more than five days this month?” and get the list straight away.",
          scene: "edu-ai-ask",
        },
        {
          title: "Problems spotted early",
          body: "The assistant flags falling attendance, overdue fees and dropping scores before they become serious.",
          scene: "edu-ai-alerts",
        },
        {
          title: "Notices drafted for you",
          body: "It drafts circulars and replies to parents. A staff member checks each one before it's sent.",
          scene: "edu-ai-draft",
        },
      ],
    },
    {
      id: "mobile-app",
      name: "School mobile app",
      summary: "One app for parents, students and teachers: homework, attendance, fees and notices.",
      steps: [
        {
          title: "Everything a parent needs",
          body: "Homework, attendance, timetable, fees and report cards on the parent's phone.",
          scene: "edu-app-parents",
        },
        {
          title: "Notices that arrive",
          body: "Holidays, events and urgent messages reach every parent instantly, instead of getting lost in a diary.",
          scene: "edu-app-notify",
        },
        {
          title: "Pay fees in the app",
          body: "Parents pay fees from the app and get the receipt in the same place.",
          scene: "edu-app-pay",
        },
      ],
    },
    {
      id: "enquiries",
      name: "Visitor and admission enquiries",
      summary: "Every visitor and admission enquiry logged and followed up until it becomes an admission.",
      steps: [
        {
          title: "Every enquiry in one list",
          body: "Walk-ins at the gate, phone calls and website forms are all logged, with visitor passes for the front desk.",
          scene: "edu-lead-capture",
        },
        {
          title: "Followed up on time",
          body: "Each enquiry has a counsellor and a follow-up date. Nobody is forgotten after the first call.",
          scene: "edu-lead-follow",
        },
        {
          title: "See what turns into admissions",
          body: "Track enquiries through campus visits to admissions, so you know which efforts bring students in.",
          scene: "edu-lead-convert",
        },
      ],
    },
    {
      id: "blogary",
      name: "Blogary: blogs for all your websites",
      summary: "Write once and publish blog posts to several websites from one place.",
      steps: [
        {
          title: "Write and review",
          body: "Writers draft posts in one editor. An editor reviews and approves each one before it goes live.",
          scene: "edu-blog-write",
        },
        {
          title: "Publish everywhere at once",
          body: "Send a post to one website or to all of them, such as your school, college and group sites, in one step.",
          scene: "edu-blog-publish",
        },
        {
          title: "See what people read",
          body: "Views for every post on every website, so you know what parents and students care about.",
          scene: "edu-blog-track",
        },
      ],
    },
  ],
  editions: [],
  window: {
    path: "institute / fees",
    sidebar: ["Admissions", "Students", "Attendance", "Fees", "Timetable", "Exams", "Results", "Notices"],
    activeItem: "Fees",
    title: "Fee collection, this term",
    action: "Send reminders",
    columns: ["Receipt", "Student", "Amount", "Status"],
    rows: [
      { id: "FEE-2041", item: "Class 8B, roll 14", qty: "₹18,500", state: "Paid", tone: "mint" },
      { id: "FEE-2039", item: "Class 6A, roll 3", qty: "₹16,000", state: "Reminder sent", tone: "amber" },
      { id: "FEE-2036", item: "Class 10C, roll 27", qty: "₹21,000", state: "Paid", tone: "mint" },
      { id: "FEE-2031", item: "Class 4B, roll 9", qty: "₹14,500", state: "Instalment 2", tone: "blue" },
    ],
  },
};
