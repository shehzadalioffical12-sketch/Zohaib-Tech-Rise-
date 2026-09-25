import React, { useState, useMemo } from 'react';
import { useLms } from '../../context/LmsContext';
import { Search, Filter, Clock, Star, BookOpen, ChevronRight } from 'lucide-react';
import { CourseLevel } from '../../types/lms';

export const CourseCatalogPage: React.FC = () => {
  const { courses, categories, route, navigate } = useLms();

  const [search, setSearch] = useState(route.params?.q || '');
  const [selectedCategory, setSelectedCategory] = useState(route.params?.category || 'all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'rating' | 'alpha'>('newest');

  const filteredCourses = useMemo(() => {
    return courses
      .filter((c) => c.status === 'published')
      .filter((c) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          c.title.toLowerCase().includes(q) ||
          c.shortDescription.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
        );
      })
      .filter((c) => {
        if (selectedCategory === 'all') return true;
        const cat = categories.find((cat) => cat.slug === selectedCategory);
        return cat ? c.categoryId === cat.categoryId : true;
      })
      .filter((c) => {
        if (selectedLevel === 'all') return true;
        return c.level.toLowerCase() === selectedLevel.toLowerCase();
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'alpha') return a.title.localeCompare(b.title);
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [courses, search, selectedCategory, selectedLevel, sortBy, categories]);

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <button onClick={() => navigate('/')} className="hover:text-slate-800">Home</button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-800 font-semibold">All Courses</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Explore Course Catalog</h1>
          <p className="text-sm text-slate-500 mt-1">
            Choose from comprehensive vocational and tech skill programs with verified certifications.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, keyword..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 text-slate-800"
            />
          </div>

          {/* Category, Level and Sort Selectors */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-sky-500"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.categoryId} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-sky-500"
            >
              <option value="all">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-sky-500"
            >
              <option value="newest">Sort: Newest</option>
              <option value="rating">Sort: Top Rated</option>
              <option value="alpha">Sort: Alphabetical</option>
            </select>

            {(search || selectedCategory !== 'all' || selectedLevel !== 'all') && (
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('all');
                  setSelectedLevel('all');
                }}
                className="text-xs font-semibold text-sky-600 hover:text-sky-700"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-md mx-auto my-12">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-base">No matching courses found</h3>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your search terms or clearing selected category filters.</p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('all');
                setSelectedLevel('all');
              }}
              className="mt-4 px-4 py-2 bg-sky-600 text-white rounded-lg text-xs font-bold"
            >
              Show All Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.courseId}
                onClick={() => navigate('/courses/detail', { id: course.courseId })}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer group"
              >
                <div className="relative h-48 overflow-hidden bg-slate-100">
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
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <div className="flex items-center gap-1 text-amber-500 font-semibold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{course.rating.toFixed(1)}</span>
                        <span className="text-slate-400 font-normal">({course.ratingCount})</span>
                      </div>
                      <span className="text-slate-400 font-medium">{course.enrolledCount} enrolled</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 group-hover:text-sky-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                      {course.shortDescription}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{course.durationWeeks} Weeks · {course.totalLessons} Lessons</span>
                    </div>
                    <span className="font-bold text-sky-600 group-hover:translate-x-1 transition-transform">
                      View Course →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
