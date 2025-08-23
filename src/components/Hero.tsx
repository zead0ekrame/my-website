import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-24 overflow-hidden">
      {/* Neural Network Background */}
      <div className="absolute inset-0">
        {/* Neural Network Nodes */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-32 left-32 w-3 h-3 bg-purple-400 rounded-full animate-pulse animation-delay-1000"></div>
        <div className="absolute top-16 left-40 w-2 h-2 bg-indigo-400 rounded-full animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-16 w-3 h-3 bg-pink-400 rounded-full animate-pulse animation-delay-3000"></div>
        
        <div className="absolute top-60 right-20 w-4 h-4 bg-blue-400 rounded-full animate-pulse animation-delay-500"></div>
        <div className="absolute top-72 right-32 w-3 h-3 bg-purple-400 rounded-full animate-pulse animation-delay-1500"></div>
        <div className="absolute top-56 right-40 w-2 h-2 bg-indigo-400 rounded-full animate-pulse animation-delay-2500"></div>
        <div className="absolute top-80 right-16 w-3 h-3 bg-pink-400 rounded-full animate-pulse animation-delay-3500"></div>
        
        <div className="absolute bottom-20 left-1/4 w-4 h-4 bg-blue-400 rounded-full animate-pulse animation-delay-750"></div>
        <div className="absolute bottom-32 left-1/3 w-3 h-3 bg-purple-400 rounded-full animate-pulse animation-delay-1750"></div>
        <div className="absolute bottom-16 left-1/2 w-2 h-2 bg-indigo-400 rounded-full animate-pulse animation-delay-2750"></div>
        
        {/* Additional Neural Nodes - More and More */}
        <div className="absolute top-10 left-1/3 w-2 h-2 bg-cyan-400 rounded-full animate-pulse animation-delay-400"></div>
        <div className="absolute top-24 left-1/6 w-3 h-3 bg-pink-400 rounded-full animate-pulse animation-delay-1200"></div>
        <div className="absolute top-36 left-2/3 w-2 h-2 bg-indigo-400 rounded-full animate-pulse animation-delay-1800"></div>
        <div className="absolute top-48 left-1/8 w-4 h-4 bg-blue-400 rounded-full animate-pulse animation-delay-2200"></div>
        
        <div className="absolute top-64 right-1/4 w-3 h-3 bg-purple-400 rounded-full animate-pulse animation-delay-600"></div>
        <div className="absolute top-76 right-1/3 w-2 h-2 bg-cyan-400 rounded-full animate-pulse animation-delay-1400"></div>
        <div className="absolute top-88 right-2/3 w-4 h-4 bg-pink-400 rounded-full animate-pulse animation-delay-2000"></div>
        <div className="absolute top-52 right-1/8 w-3 h-3 bg-indigo-400 rounded-full animate-pulse animation-delay-2600"></div>
        
        <div className="absolute bottom-10 left-1/6 w-2 h-2 bg-blue-400 rounded-full animate-pulse animation-delay-800"></div>
        <div className="absolute bottom-24 left-2/3 w-3 h-3 bg-purple-400 rounded-full animate-pulse animation-delay-1600"></div>
        <div className="absolute bottom-36 left-1/4 w-4 h-4 bg-cyan-400 rounded-full animate-pulse animation-delay-2400"></div>
        <div className="absolute bottom-48 left-1/2 w-2 h-2 bg-pink-400 rounded-full animate-pulse animation-delay-3200"></div>
        
        {/* More nodes scattered around */}
        <div className="absolute top-1/4 left-1/5 w-2 h-2 bg-indigo-400 rounded-full animate-pulse animation-delay-900"></div>
        <div className="absolute top-1/3 right-1/5 w-3 h-3 bg-blue-400 rounded-full animate-pulse animation-delay-1700"></div>
        <div className="absolute bottom-1/4 right-1/6 w-2 h-2 bg-purple-400 rounded-full animate-pulse animation-delay-2800"></div>
        <div className="absolute bottom-1/3 left-1/5 w-3 h-3 bg-cyan-400 rounded-full animate-pulse animation-delay-3400"></div>
        
        {/* Neural Network Connections */}
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
          <defs>
            <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#EC4899" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          
          {/* Animated Neural Connections */}
          <path d="M 80 80 Q 120 60 160 80" stroke="url(#neuralGradient)" strokeWidth="1" fill="none" className="animate-dash">
            <animate attributeName="stroke-dasharray" values="0,100;100,0;0,100" dur="3s" repeatCount="indefinite" />
          </path>
          <path d="M 160 80 Q 200 100 240 80" stroke="url(#neuralGradient)" strokeWidth="1" fill="none" className="animate-dash">
            <animate attributeName="stroke-dasharray" values="0,100;100,0;0,100" dur="3s" repeatCount="indefinite" begin="0.5s" />
          </path>
          <path d="M 80 80 Q 120 100 160 120" stroke="url(#neuralGradient)" strokeWidth="1" fill="none" className="animate-dash">
            <animate attributeName="stroke-dasharray" values="0,100;100,0;0,100" dur="3s" repeatCount="indefinite" begin="1s" />
          </path>
          
          <path d="M 600 160 Q 640 140 680 160" stroke="url(#neuralGradient)" strokeWidth="1" fill="none" className="animate-dash">
            <animate attributeName="stroke-dasharray" values="0,100;100,0;0,100" dur="3s" repeatCount="indefinite" begin="1.5s" />
          </path>
          <path d="M 680 160 Q 720 180 760 160" stroke="url(#neuralGradient)" strokeWidth="1" fill="none" className="animate-dash">
            <animate attributeName="stroke-dasharray" values="0,100;100,0;0,100" dur="3s" repeatCount="indefinite" begin="2s" />
          </path>
          
          <path d="M 200 400 Q 240 380 280 400" stroke="url(#neuralGradient)" strokeWidth="1" fill="none" className="animate-dash">
            <animate attributeName="stroke-dasharray" values="0,100;100,0;0,100" dur="3s" repeatCount="indefinite" begin="0.75s" />
          </path>
          <path d="M 280 400 Q 320 420 360 400" stroke="url(#neuralGradient)" strokeWidth="1" fill="none" className="animate-dash">
            <animate attributeName="stroke-dasharray" values="0,100;100,0;0,100" dur="3s" repeatCount="indefinite" begin="1.25s" />
          </path>
          
          {/* More connections */}
          <path d="M 100 200 Q 140 180 180 200" stroke="url(#neuralGradient)" strokeWidth="1" fill="none" className="animate-dash">
            <animate attributeName="stroke-dasharray" values="0,100;100,0;0,100" dur="3s" repeatCount="indefinite" begin="0.25s" />
          </path>
          <path d="M 500 300 Q 540 280 580 300" stroke="url(#neuralGradient)" strokeWidth="1" fill="none" className="animate-dash">
            <animate attributeName="stroke-dasharray" values="0,100;100,0;0,100" dur="3s" repeatCount="indefinite" begin="0.8s" />
          </path>
          <path d="M 300 100 Q 340 80 380 100" stroke="url(#neuralGradient)" strokeWidth="1" fill="none" className="animate-dash">
            <animate attributeName="stroke-dasharray" values="0,100;100,0;0,100" dur="3s" repeatCount="indefinite" begin="1.1s" />
          </path>
        </svg>
        
        {/* Floating Data Particles */}
        <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-blue-300 rounded-full animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-purple-300 rounded-full animate-float animation-delay-1000"></div>
        <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-indigo-300 rounded-full animate-float animation-delay-2000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-pink-300 rounded-full animate-float animation-delay-3000"></div>
        
        {/* More particles */}
        <div className="absolute top-1/6 left-2/3 w-1 h-1 bg-cyan-300 rounded-full animate-float animation-delay-500"></div>
        <div className="absolute top-2/3 right-1/6 w-1.5 h-1.5 bg-blue-300 rounded-full animate-float animation-delay-1500"></div>
        <div className="absolute bottom-1/6 right-2/3 w-1 h-1 bg-purple-300 rounded-full animate-float animation-delay-2500"></div>
        <div className="absolute bottom-2/3 left-1/6 w-1.5 h-1.5 bg-pink-300 rounded-full animate-float animation-delay-3500"></div>
      </div>
      
      {/* Corner Badge */}
      <div className="absolute top-8 right-8 z-20">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm border border-blue-200 shadow-lg">
          <span className="text-sm font-medium text-blue-700">🚀 رائدون في حلول الذكاء الاصطناعي</span>
        </div>
      </div>
      
      {/* Small Title on the Right Side */}
      <div className="absolute top-1/2 right-8 transform -translate-y-1/2 z-20">
        <div className="text-right">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight">
            حلول الذكاء الاصطناعي
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mt-1">
              في الوطن العربي
            </span>
          </h1>
        </div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center" style={{ zIndex: 10 }}>
        <div className="max-w-5xl mx-auto">
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-slate-600 mb-12 leading-relaxed max-w-3xl mx-auto">
            نقدم حلول ذكية ومتطورة لتحويل أعمالك إلى المستقبل
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link href="/services" className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              <span className="relative z-10">استكشف خدماتنا</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link href="/book" className="px-8 py-4 bg-white text-slate-700 font-semibold rounded-xl border-2 border-slate-200 hover:border-blue-300 hover:text-blue-600 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              احجز استشارة مجانية
            </Link>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-slate-600">مشروع منجز</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">98%</div>
              <div className="text-slate-600">رضا العملاء</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">24/7</div>
              <div className="text-slate-600">دعم فني</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
