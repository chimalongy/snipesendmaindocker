"use client"

import { FaBullseye, FaChartLine, FaClock, FaLock, FaUpload, FaEnvelope } from 'react-icons/fa';
import { MdSchedule, MdSupport, MdOutlineAutoAwesome } from 'react-icons/md';
import { RiSendPlaneFill } from 'react-icons/ri';
import { BsPersonCheck, BsStarFill, BsLightningFill } from 'react-icons/bs';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';



const SnipeSendHomepage = () => {
  // Animation hook for scroll-triggered animations
  const [featuresRef, featuresInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [statsRef, statsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [stepsRef, stepsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Smooth scroll for anchor links
  useEffect(() => {
    const smoothScroll = (e) => {
      e.preventDefault();
      const targetId = e.currentTarget.getAttribute("href");
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth"
        });
      }
    };

    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener("click", smoothScroll);
    });

    return () => {
      links.forEach(link => {
        link.removeEventListener("click", smoothScroll);
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="hidden md:block fixed w-full bg-white bg-opacity-90 backdrop-filter backdrop-blur-sm z-50 py-4 shadow-sm ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-end space-x-8">
            <a href="#features" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-300">Features</a>
            <a href="#how-it-works" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-300">How It Works</a>
            {/* <a href="#pricing" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-300">Pricing</a>
            <a href="#testimonials" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-300">Results</a> */}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden pt-20 ">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <div className="pt-10 sm:pt-16 lg:pt-20 lg:pb-14 lg:overflow-hidden">
              <div className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                <div className="sm:text-center lg:text-left">
                  <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                    <span className="block">Precision Email</span>
                    <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
                      Delivery Engine
                    </span>
                  </h1>
                  <p className="mt-5 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 transition-all duration-500 transform hover:scale-105">
                    Hit the inbox every time with our AI-powered email delivery system. Connect multiple accounts, schedule with precision, and track real-time performance.
                  </p>
                  <div className="mt-8 sm:mt-10 sm:flex sm:justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="rounded-md shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <Link
                        href="/register"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 md:py-4 md:text-lg md:px-10 transition-all duration-300 transform hover:-translate-y-1"
                      >
                        <BsLightningFill className="mr-2 animate-pulse" /> Get Started
                      </Link>
                    </div>
                    <div className="rounded-md shadow hover:shadow-md transition-shadow duration-300">
                      <a
                        href="#how-it-works"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10 transition-all duration-300"
                      >
                        See How It Works
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full sm:h-72 md:h-96 lg:w-full lg:h-full bg-gradient-to-tr from-indigo-500 to-purple-600 opacity-90 flex items-center justify-center">
            <div className="relative w-4/5 h-4/5 bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm rounded-xl p-8 shadow-2xl border border-white border-opacity-30 transform transition-all duration-500 hover:scale-105">
              <div className="absolute -top-5 -left-5 bg-white p-3 rounded-lg shadow-lg animate-bounce">
                <FaEnvelope className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="text-white">
                <h3 className="text-xl font-bold mb-4">Campaign Preview</h3>
                <div className="space-y-3">
                  <div className="h-3 bg-white bg-opacity-40 rounded-full w-full animate-pulse"></div>
                  <div className="h-3 bg-white bg-opacity-40 rounded-full w-3/4 animate-pulse delay-75"></div>
                  <div className="h-3 bg-white bg-opacity-40 rounded-full w-1/2 animate-pulse delay-100"></div>
                </div>
                <div className="mt-6 flex space-x-2">
                  <div className="bg-white bg-opacity-30 rounded-full px-3 py-1 text-xs font-medium transform transition-all hover:scale-110 duration-200">98% Deliverability</div>
                  <div className="bg-white bg-opacity-30 rounded-full px-3 py-1 text-xs font-medium transform transition-all hover:scale-110 duration-200">42% Open Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logo Cloud */}
      <div className="bg-gray-100 py-12 transition-all duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold uppercase text-gray-500 tracking-wide">
            Trusted by marketing teams at
          </p>
          <div className="mt-8 grid grid-cols-2 gap-8 md:grid-cols-6 lg:grid-cols-5">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="col-span-1 flex justify-center">
                <div className="h-12 w-32 bg-gray-200 rounded-lg opacity-70 hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div 
        id="features" 
        ref={featuresRef}
        className={`py-20 bg-white transition-opacity duration-1000 ${featuresInView ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-4 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Precision tools for perfect delivery
            </p>
            <p className="mt-6 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Everything you need to ensure your emails land in the inbox, not the spam folder.
            </p>
          </div>

          <div className="mt-20">
            <div className="space-y-12 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-10 md:gap-y-12">
              {/* Feature 1 */}
              <div className={`relative group transition-all duration-500 transform ${featuresInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-white p-8 rounded-lg shadow-sm h-full transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 text-white transform transition-all group-hover:rotate-12 duration-300">
                    <FaBullseye className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-xl font-medium text-gray-900">Inbox Precision</h3>
                  <p className="mt-4 text-base text-gray-500">
                    Our smart routing algorithm ensures 98%+ deliverability by optimizing send times and account rotation.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className={`relative group transition-all duration-500 transform ${featuresInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '100ms' }}>
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-white p-8 rounded-lg shadow-sm h-full transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 text-white transform transition-all group-hover:rotate-12 duration-300">
                    <MdOutlineAutoAwesome className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-xl font-medium text-gray-900">AI Optimization</h3>
                  <p className="mt-4 text-base text-gray-500">
                    Machine learning analyzes your content to suggest improvements that boost open and reply rates.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className={`relative group transition-all duration-500 transform ${featuresInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '200ms' }}>
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-white p-8 rounded-lg shadow-sm h-full transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 text-white transform transition-all group-hover:rotate-12 duration-300">
                    <RiSendPlaneFill className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-xl font-medium text-gray-900">Multi-Account Rotation</h3>
                  <p className="mt-4 text-base text-gray-500">
                    Connect unlimited Gmail accounts to scale your outreach while maintaining natural sending patterns.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className={`relative group transition-all duration-500 transform ${featuresInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '300ms' }}>
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-white p-8 rounded-lg shadow-sm h-full transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 text-white transform transition-all group-hover:rotate-12 duration-300">
                    <FaChartLine className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-xl font-medium text-gray-900">Real-Time Analytics</h3>
                  <p className="mt-4 text-base text-gray-500">
                    Track opens, clicks, and replies with detailed reporting to measure campaign effectiveness.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div 
        ref={statsRef}
        className={`bg-gradient-to-r from-indigo-600 to-purple-700 transition-opacity duration-1000 ${statsInView ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              <span className="block">Proven results</span>
            </h2>
            <p className="mt-4 text-xl text-indigo-100">
              What our users achieve with SnipeSend
            </p>
          </div>
          <div className="mt-12 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-3 sm:gap-8">
            <div className={`transform transition-all duration-500 ${statsInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-white bg-opacity-20 text-white mx-auto">
                <FaEnvelope className="h-6 w-6" />
              </div>
              <div className="mt-6">
                <p className="text-5xl font-extrabold text-white animate-countup">98%</p>
                <p className="mt-2 text-md font-medium text-indigo-100">Inbox Delivery Rate</p>
              </div>
            </div>
            <div className={`transform transition-all duration-500 ${statsInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '150ms' }}>
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-white bg-opacity-20 text-white mx-auto">
                <FaChartLine className="h-6 w-6" />
              </div>
              <div className="mt-6">
                <p className="text-5xl font-extrabold text-white animate-countup">3.2x</p>
                <p className="mt-2 text-md font-medium text-indigo-100">Higher Response Rates</p>
              </div>
            </div>
            <div className={`transform transition-all duration-500 ${statsInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '300ms' }}>
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-white bg-opacity-20 text-white mx-auto">
                <MdSchedule className="h-6 w-6" />
              </div>
              <div className="mt-6">
                <p className="text-5xl font-extrabold text-white animate-countup">10h</p>
                <p className="mt-2 text-md font-medium text-indigo-100">Saved Per Week</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div 
        id="how-it-works" 
        ref={stepsRef}
        className="py-20 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Process</h2>
            <p className="mt-4 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Precision email delivery in 3 steps
            </p>
            <p className="mt-6 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Simple setup, powerful results
            </p>
          </div>

          <div className="mt-20">
            <div className="space-y-12 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-12">
              {/* Step 1 */}
              <div className={`relative group transition-all duration-500 transform ${stepsInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                <div className="relative bg-white p-8 rounded-lg shadow-sm h-full transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-lg font-bold transform transition-all group-hover:scale-110 duration-300">
                    1
                  </div>
                  <h3 className="mt-6 text-xl font-medium text-gray-900">Connect & Configure</h3>
                  <p className="mt-4 text-base text-gray-500">
                    Securely link your Gmail accounts with OAuth 2.0. Our system automatically optimizes sending parameters for each account.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className={`relative group transition-all duration-500 transform ${stepsInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '150ms' }}>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                <div className="relative bg-white p-8 rounded-lg shadow-sm h-full transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-lg font-bold transform transition-all group-hover:scale-110 duration-300">
                    2
                  </div>
                  <h3 className="mt-6 text-xl font-medium text-gray-900">Create & Personalize</h3>
                  <p className="mt-4 text-base text-gray-500">
                    Use our AI-assisted editor to craft perfect emails. Add personalization tokens and let our system optimize send times.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className={`relative group transition-all duration-500 transform ${stepsInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '300ms' }}>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                <div className="relative bg-white p-8 rounded-lg shadow-sm h-full transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-lg font-bold transform transition-all group-hover:scale-110 duration-300">
                    3
                  </div>
                  <h3 className="mt-6 text-xl font-medium text-gray-900">Launch & Analyze</h3>
                  <p className="mt-4 text-base text-gray-500">
                    Send with confidence. Track real-time performance and get actionable insights to improve future campaigns.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <div className="transform transition-all hover:scale-[1.01] duration-500">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              <span className="block">Ready to transform your email outreach?</span>
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
                Start your free trial today.
              </span>
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Join thousands of marketers seeing better deliverability and higher response rates.
            </p>
          </div>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0 space-x-4">
            <div className="rounded-md shadow-lg hover:shadow-xl transition-shadow duration-300">
              <a
                href="#"
                className="inline-flex items-center justify-center px-6 py-4 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1"
              >
                Get Started
              </a>
            </div>
            <div className="rounded-md shadow hover:shadow-md transition-shadow duration-300">
              <a
                href="#"
                className="inline-flex items-center justify-center px-6 py-4 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition-colors duration-300"
              >
                Live Demo
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8 xl:col-span-1">
              <div className="flex items-center">
                <RiSendPlaneFill className="h-8 w-8 text-indigo-400 animate-float" />
                <span className="ml-2 text-xl font-bold text-white">SnipeSend</span>
              </div>
              <p className="text-gray-300 text-base">
                Precision email delivery for marketers, sales teams, and businesses that care about results.
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-gray-300 transition-colors duration-300">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-300 transition-colors duration-300">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                    Product
                  </h3>
                  <ul className="mt-6 space-y-4">
                    <li>
                      <a href="#" className="text-base text-gray-400 hover:text-white transition-colors duration-300">
                        Features
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-400 hover:text-white transition-colors duration-300">
                        Pricing
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-400 hover:text-white transition-colors duration-300">
                        API
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                    Resources
                  </h3>
                  <ul className="mt-6 space-y-4">
                    <li>
                      <a href="#" className="text-base text-gray-400 hover:text-white transition-colors duration-300">
                        Documentation
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-400 hover:text-white transition-colors duration-300">
                        Guides
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-400 hover:text-white transition-colors duration-300">
                        Blog
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                    Company
                  </h3>
                  <ul className="mt-6 space-y-4">
                    <li>
                      <a href="#" className="text-base text-gray-400 hover:text-white transition-colors duration-300">
                        About
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-400 hover:text-white transition-colors duration-300">
                        Careers
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-400 hover:text-white transition-colors duration-300">
                        Contact
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                    Legal
                  </h3>
                  <ul className="mt-6 space-y-4">
                    <li>
                      <a href="#" className="text-base text-gray-400 hover:text-white transition-colors duration-300">
                        Privacy
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-400 hover:text-white transition-colors duration-300">
                        Terms
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-400 hover:text-white transition-colors duration-300">
                        Security
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 border-t border-gray-700 pt-8">
            <p className="text-base text-gray-400 text-center">
              &copy; 2024 SnipeSend. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SnipeSendHomepage;