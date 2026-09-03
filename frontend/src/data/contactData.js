/**
 * Central contact configuration for Praksha Academy.
 *
 * Every hardcoded phone number / email / address that used to live inside
 * JSX has been moved here. Update the values below once — every component
 * that shows contact info reads from this file, so you never have to hunt
 * through components again.
 *
 * IMPORTANT: The values marked "// TODO" below are placeholders. Replace
 * them with real Praksha Academy information before this goes to
 * production. Components are written to gracefully hide any channel that
 * is left blank/null, so it's safe to leave something empty until you
 * have the real value.
 */

const contactData = {
  academyName: "Praksha Academy",

  // TODO: replace with the real support email
  email: null, // e.g. "support@prakshaacademy.com"

  // TODO: replace with the real support phone number (with country code)
  phone: null, // e.g. "+91XXXXXXXXXX"

  // TODO: replace with the real WhatsApp business number (digits only, with country code, no + or spaces)
  whatsapp: null, // e.g. "91XXXXXXXXXX"

  // TODO: set to true only once Praksha Academy has a confirmed physical office
  hasPhysicalAddress: false,
  address: null, // e.g. "Full address, City, State, PIN"
  mapUrl: null, // e.g. a Google Maps share link for the real address

  // TODO: confirm real working hours before publishing
  workingHours: null,
  // Example shape once confirmed:
  // workingHours: [
  //   { day: "Monday – Friday", time: "9:00 AM – 7:00 PM" },
  //   { day: "Saturday", time: "10:00 AM – 5:00 PM" },
  //   { day: "Sunday", time: "Closed" },
  // ],

  // TODO: fill in only the socials that actually exist; leave others out
  socialLinks: {
    instagram: null,
    facebook: null,
    linkedin: null,
    youtube: null,
  },

  // Program interest options shown in the contact form dropdown.
  // Keep this in sync with the Courses page categories.
  programInterests: [
    "Class 8",
    "Class 9",
    "Class 10",
    "Class 11",
    "Class 12",
    "English Grammar",
    "Spoken English",
    "Programming",
    "Web Development",
    "AI",
    "Data Science",
    "Not sure yet",
  ],

  faqs: [
    {
      q: "How quickly will I hear back after submitting the contact form?",
      a: "A team member reviews every submission and responds as soon as possible. We haven't published a formal response-time commitment yet — update this once one is confirmed.",
    },
    {
      q: "I don't know which course is right for me. Can I talk to someone first?",
      a: "Yes — use the \"Talk to an Academic Advisor\" option on this page instead of the general form, and someone can help you compare programs before you commit.",
    },
    {
      q: "Are classes online, offline, or both?",
      a: "See the Courses page for the current format of each program. This will be kept accurate as offerings change.",
    },
    {
      q: "How do I get help with something urgent, like account or payment access?",
      a: "Use the contact channels listed above (phone, WhatsApp, or email — whichever is available) rather than the general form for anything time-sensitive.",
    },
  ],
};

export default contactData;
