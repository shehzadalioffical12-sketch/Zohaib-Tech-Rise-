import React, { useState } from 'react';
import { useLms } from '../../context/LmsContext';
import { useAuth } from '../../context/AuthContext';
import {
  Search,
  BookOpen,
  Users,
  Award,
  Star,
  CheckCircle,
  PlayCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  Layers,
  GraduationCap
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { courses, categories, navigate } = useLms();
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/courses', { q: searchQuery });
    }
  };

  const featuredCourses = courses.filter((c) => c.status === 'published').slice(0, 4);

  const stats = [
    { label: 'Enrolled Students', value: '5,000+', icon: Users, color: 'text-sky-600' },
    { label: 'Active Courses', value: '50+', icon: BookOpen, color: 'text-indigo-600' },
    { label: 'Expert Instructors', value: '30+', icon: GraduationCap, color: 'text-emerald-600' },
    { label: 'Satisfaction Rate', value: '98%', icon: Award, color: 'text-amber-500' }
  ];

  const benefits = [
    {
      title: 'Flexible Learning',
      desc: 'Study at your own pace anytime, anywhere with lifetime access to high-definition video lessons and resources.',
      icon: Clock
    },
    {
      title: 'Expert Instructors',
      desc: 'Learn directly from seasoned software engineers, video producers, and digital marketers with real industry experience.',
      icon: Users
    },
    {
      title: 'Verifiable Certificates',
      desc: 'Earn an official digital Certificate of Completion with a unique QR code upon completing course assessments.',
      icon: Award
    },
    {
      title: 'Hands-on Projects',
      desc: 'Practice with real-world assignments, graded quizzes, and portfolio pieces reviewed by course instructors.',
      icon: Layers
    }
  ];

  const faqs = [
    {
      q: 'Are the courses free to enroll at Zohaib Tech Rise LMS?',
      a: 'Yes, our core batch of courses including Web Development, Video Editing, and Freelancing are currently completely free to enroll as part of the Zohaib Tech Rise digital empowerment initiative.'
    },
    {
      q: 'How do I earn my Certificate of Completion?',
      a: 'To earn an official certificate, you must watch all required module video lessons, achieve at least 70% on quizzes, and submit the required practical assignments. Once completed, your certificate is automatically generated and can be verified online anytime.'
    },
    {
      q: 'Can employers verify my certificate online?',
      a: 'Absolutely. Every certificate issued by Zohaib Tech Rise LMS includes a unique alphanumeric verification code and QR code. Anyone can enter the code on our Certificate Verification page to verify authenticity.'
    },
    {
      q: 'Can I study on my mobile phone or tablet?',
      a: 'Yes, the LMS platform is fully responsive and optimized for smartphones, tablets, laptops, and desktop computers.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0F2744] via-[#13335a] to-[#0c1e38] text-white pt-16 pb-24 lg:pt-24 lg:pb-32">
        {/* Decorative background glows */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading, Subhead, Search & Actions */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>Admissions Open · Autumn 2026 Batch</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
                Learn Today <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-200 to-amber-200">
                  Build a Better Tomorrow.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Zohaib Tech Rise LMS brings you high-quality online courses to build your digital skills, master modern tech, and achieve your career goals. Learn Today. Innovate Tomorrow.
              </p>

              {/* Search Bar Form */}
              <form onSubmit={handleSearch} className="max-w-xl mx-auto lg:mx-0 relative">
                <div className="flex items-center bg-white rounded-xl p-1.5 shadow-xl border border-slate-200">
                  <div className="pl-3 text-slate-400">
                    <Search className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search courses (e.g. Web Development, Video Editing)..."
                    className="w-full px-3 py-2 text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex-shrink-0"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => navigate('/courses')}
                  className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-sky-600/30 transition-all flex items-center gap-2"
                >
                  <span>Explore Courses</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate(currentUser ? '/student' : '/register')}
                  className="px-6 py-3 bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-sm rounded-xl transition-all"
                >
                  {currentUser ? 'Go to My Dashboard' : 'Join Free Today'}
                </button>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Main Student Card */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-700/50 group">
                  <img
                    src="/assets/hero_student_portrait.jpg"
                    alt="Zohaib Tech Rise LMS Student"
                    className="w-full h-80 sm:h-96 object-cover transform group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 p-4 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700 text-left">
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span>HEC Aligned · Certified Learning</span>
                    </div>
                    <div className="text-sm font-bold text-white">Interactive Modules & Live Quizzes</div>
                    <div className="text-xs text-slate-300">Over 5,000+ students mastering skills online</div>
                  </div>
                </div>

                {/* Floating badge top-left */}
                <div className="absolute -top-4 -left-4 bg-white text-slate-900 px-4 py-2.5 rounded-xl shadow-xl border border-slate-200 flex items-center gap-2.5 animate-bounce-subtle">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">100% Free</div>
                    <div className="text-[10px] text-slate-500">Admissions Open</div>
                  </div>
                </div>

                {/* Floating badge bottom-right */}
                <div className="absolute -bottom-4 -right-4 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Verified QR</div>
                    <div className="text-[10px] text-slate-400">Official Certificate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-slate-900/60 backdrop-blur-md border border-slate-700/80 rounded-2xl">
            {stats.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-center gap-3 p-2">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-extrabold text-white">{item.value}</div>
                    <div className="text-xs text-slate-400 font-medium">{item.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Featured Catalog</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Explore High-Demand Courses</h2>
            <p className="text-sm text-slate-500 mt-1">Handpicked courses designed to make you industry-ready</p>
          </div>
          <button
            onClick={() => navigate('/courses')}
            className="text-sm font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 group"
          >
            <span>View All Courses</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCourses.map((course) => (
            <div
              key={course.courseId}
              onClick={() => navigate('/courses/detail', { id: course.courseId })}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer group"
            >
              <div className="relative h-44 overflow-hidden bg-slate-100">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-md">
                  {course.level}
                </div>
                <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md">
                  Free
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold mb-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{course.rating.toFixed(1)}</span>
                    <span className="text-slate-400">({course.ratingCount})</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 group-hover:text-sky-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1.5">{course.shortDescription}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{course.durationWeeks} Weeks</span>
                  </div>
                  <span className="font-bold text-sky-600">View Details →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Categories Grid */}
      <section className="py-16 bg-slate-100/70 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Knowledge Domains</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Browse Popular Categories</h2>
            <p className="text-sm text-slate-500 mt-1">Discover structured learning tracks across modern digital trades</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => {
              const count = courses.filter((c) => c.categoryId === cat.categoryId).length;
              return (
                <div
                  key={cat.categoryId}
                  onClick={() => navigate('/courses', { category: cat.slug })}
                  className="bg-white p-5 rounded-xl border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold mb-3 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 group-hover:text-sky-600 transition-colors">
                    {cat.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">{count} Courses Available</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Zohaib Tech Rise LMS & How It Works */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Excellence in Education</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-1 leading-tight">
              Why Learn With Zohaib Tech Rise LMS?
            </h2>
            <p className="text-slate-600 text-sm mt-3 leading-relaxed">
              We bring modern instructional design modeled after top national platforms like DigiSkills, enhanced with interactive coding, video lectures, live quizzes, and authenticated certificates.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
              {benefits.map((b, idx) => {
                const Icon = b.icon;
                return (
                  <div key={idx} className="space-y-2">
                    <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{b.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{b.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* How It Works Steps Card */}
          <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl border border-slate-800">
            <h3 className="text-xl font-extrabold text-white mb-6">4 Simple Steps to Certification</h3>
            <div className="space-y-6">
              {[
                { step: '01', title: 'Register & Enroll Free', desc: 'Create your student account and enroll in your preferred course track with 1 click.' },
                { step: '02', title: 'Watch Video Lessons', desc: 'Stream video modules, download exercise source files, and follow instructor walkthroughs.' },
                { step: '03', title: 'Pass Quizzes & Assignments', desc: 'Test your understanding with timed quizzes and submit hands-on project work.' },
                { step: '04', title: 'Download Verified Certificate', desc: 'Receive your official certificate with QR code validation accepted by employers.' }
              ].map((s) => (
                <div key={s.step} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center font-mono font-bold flex-shrink-0">
                    {s.step}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{s.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 text-center">
              <button
                onClick={() => navigate('/register')}
                className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm rounded-xl shadow-lg transition-colors"
              >
                Start Learning Now — It's Free
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Got Questions?</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left font-bold text-sm text-slate-800 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="bg-gradient-to-r from-[#0F2744] via-[#103b68] to-[#0F2744] text-white py-16 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold">Ready to Upgrade Your Career?</h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Join thousands of students learning in-demand tech and digital skills at Zohaib Tech Rise LMS. Learn Today. Innovate Tomorrow.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-3.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg transition-all"
            >
              Register for Free
            </button>
            <button
              onClick={() => navigate('/courses')}
              className="px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-xl transition-all"
            >
              Browse Course Catalog
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
