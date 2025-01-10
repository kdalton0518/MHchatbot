import { TopMenuBar } from '@/src/components/Sidebar/TopMenuBar'
import Image from 'next/image'

const chatbotPlatforms = [
  {
    name: 'Replika',
    logo: '/chatbots/replika.png',
    description: 'Your compassionate AI companion for emotional well-being and personal growth',
    users: '10M+',
    rating: '4.8/5',
    features: [
      'Emotional Support',
      'Mindfulness Practice',
      'Daily Check-ins',
      'Personalized Growth Path',
    ],
    seasonal: 'Perfect for winter reflection and self-discovery',
    theme: 'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900',
    specialties: ['Anxiety Management', 'Depression Support', 'Self-Discovery'],
  },
  {
    name: 'Woebot',
    logo: '/chatbots/woebot.png',
    description: 'Evidence-based CBT companion helping you bloom into your best self',
    users: '5M+',
    rating: '4.7/5',
    features: ['CBT Techniques', 'Mood Tracking', 'Guided Journaling', 'Crisis Support'],
    seasonal: 'Spring-inspired growth and renewal',
    theme: 'bg-gradient-to-br from-green-100 to-green-200 dark:from-gray-800 dark:to-gray-900',
    specialties: ['CBT Therapy', 'Stress Management', 'Mental Health Education'],
  },
  {
    name: 'Wysa',
    logo: '/chatbots/wysa.png',
    description: 'Your AI wellness companion for emotional balance and mindful living',
    users: '3M+',
    rating: '4.6/5',
    features: ['Sleep Stories', 'Anxiety Tools', 'Meditation Sessions', 'Mood Patterns'],
    seasonal: 'Summer wellness and emotional brightness',
    theme: 'bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-800 dark:to-gray-900',
    specialties: ['Sleep Improvement', 'Anxiety Relief', 'Emotional Resilience'],
  },
  {
    name: 'Youper',
    logo: '/chatbots/youper.jpg',
    description: 'Personalized AI therapy for emotional health transformation',
    users: '2M+',
    rating: '4.9/5',
    features: ['Emotional Analysis', 'Guided Meditation', 'Progress Tracking', 'Therapy Sessions'],
    seasonal: 'Autumn transformation and inner peace',
    theme: 'bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-800 dark:to-gray-900',
    specialties: ['Emotional Intelligence', 'Personal Growth', 'Relationship Support'],
  },
  {
    name: 'Talkspace',
    logo: '/chatbots/talkspace.png',
    description: 'Professional therapy enhanced with AI-powered support system',
    users: '1M+',
    rating: '4.5/5',
    features: ['Licensed Therapists', 'Video Sessions', 'AI Support', 'Crisis Intervention'],
    seasonal: 'Year-round professional mental health care',
    theme: 'bg-gradient-to-br from-teal-50 to-cyan-100 dark:from-gray-800 dark:to-gray-900',
    specialties: ['Professional Counseling', 'Relationship Therapy', 'Trauma Support'],
  },
  {
    name: 'BetterHelp',
    logo: '/chatbots/betterhelp.png',
    description: 'Comprehensive mental wellness platform with integrated AI assistance',
    users: '2.5M+',
    rating: '4.8/5',
    features: ['24/7 Support', 'Video Counseling', 'Group Sessions', 'Wellness Workshops'],
    seasonal: 'Continuous support through all seasons',
    theme: 'bg-gradient-to-br from-rose-50 to-red-100 dark:from-gray-800 dark:to-gray-900',
    specialties: ['Depression Treatment', 'Anxiety Management', 'Life Coaching'],
  },
]

export default function Home() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-50 dark:from-gray-900 dark:to-gray-900'>
      <TopMenuBar />
      <main className='container mx-auto px-4 py-12'>
        <section className='text-center mb-16'>
          <h1 className='text-5xl font-bold bg-clip-text mb-6'>Mental Health Counseling Chatbot</h1>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
            Discover our curated collection of mental wellness companions, each designed to support
            your unique path to emotional well-being and personal growth.
          </p>
        </section>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {chatbotPlatforms.map((platform) => (
            <div
              key={platform.name}
              className={`rounded-2xl p-8 ${platform.theme} backdrop-blur-sm 
            border border-white/20 dark:border-gray-700 shadow-lg hover:shadow-2xl 
            transform hover:-translate-y-1 transition-all duration-300`}
            >
              <div className='flex items-center gap-6 mb-8'>
                <div className='relative'>
                  <Image
                    src={platform.logo}
                    alt={`${platform.name} logo`}
                    width={80}
                    height={80}
                    className='rounded-2xl shadow-md'
                  />
                  <div className='absolute -bottom-2 -right-2 bg-primary text-white text-xs px-2 py-1 rounded-full'>
                    {platform.rating}
                  </div>
                </div>
                <h3 className='text-2xl font-bold text-gray-800 dark:text-gray-100'>
                  {platform.name}
                </h3>
              </div>

              <p className='text-gray-700 dark:text-gray-300 mb-6 leading-relaxed'>
                {platform.description}
              </p>

              <div className='space-y-4'>
                <div className='bg-white/60 dark:bg-gray-800/60 rounded-xl p-4 backdrop-blur-sm'>
                  <h4 className='font-semibold text-primary dark:text-primary/90 mb-2'>
                    Key Features
                  </h4>
                  <ul className='list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300'>
                    {platform.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </div>

                <div className='flex items-center justify-between bg-white/60 dark:bg-gray-800/60 rounded-xl p-4'>
                  <span className='text-gray-600 dark:text-gray-400'>Active Users</span>
                  <span className='font-bold text-primary dark:text-primary/90'>
                    {platform.users}
                  </span>
                </div>

                <div className='bg-primary/10 dark:bg-primary/5 rounded-xl p-4 text-center text-sm text-primary dark:text-primary/90 font-medium'>
                  {platform.seasonal}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
