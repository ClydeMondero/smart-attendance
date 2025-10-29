type FAQType = {
  id: string;
  question: string;
  answer: string;
};

const faqs: FAQType[] = [
  {
    id: "item-1",
    question: "How does the system record attendance?",
    answer: `Students scan their ID barcode, and the system instantly logs the attendance in the database.`,
  },
  {
    id: "item-2",
    question: "Do I need an internet connection?",
    answer: `Yes, the system requires an internet connection to sync attendance data and send real-time notifications.`,
  },
  {
    id: "item-3",
    question: "Can the system send notifications?",
    answer: `Yes. Automatic messages are sent to students and parents whenever attendance is recorded or missed.`,
  },
  {
    id: "item-4",
    question: "Is the data secure?",
    answer: `All attendance records are stored securely, with access limited to authorized school staff.`,
  },
  {
    id: "item-5",
    question: "Can it generate reports?",
    answer: `Yes, attendance data is automatically compiled into daily, weekly, or monthly reports for easy tracking.`,
  },
  {
    id: "item-6",
    question: "What happens if a student forgets their ID?",
    answer: `Teachers or admins can manually mark attendance if a student forgets or loses their ID card.`,
  },
  {
    id: "item-7",
    question: "Does it work for multiple classes or sections?",
    answer: `Absolutely. The system supports multiple grades, classes, and sections with separate reports for each.`,
  },
  {
    id: "item-8",
    question: "Do parents have access to the system?",
    answer: `No, parents don’t log in to the system. They only receive automatic SMS or email notifications about their child’s attendance.`,
  },
];

export default faqs;
