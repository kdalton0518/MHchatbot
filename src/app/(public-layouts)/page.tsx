import Link from 'next/link'
import Image from 'next/image'
import { TopMenuBar } from '@/src/components/Sidebar/TopMenuBar'
import { buttonVariants } from '@/src/components/Base/Button'
import { siteConfig } from '@/src/config/site'

const socialPlatforms = [
  {
    name: 'Facebook',
    logo: '/socials/facebook.png',
    description: 'Social networking platform',
    users: '3B+',
    engagementRate: '3.8%',
    contentType: 'Posts, Stories, Groups',
  },
  {
    name: 'Instagram',
    logo: '/socials/instagram.png',
    description: 'Photo and video sharing social network',
    followers: '2.3B',
    engagementRate: '4.7%',
    contentType: 'Photos, Videos, Stories, Reels',
  },
  {
    name: 'TikTok',
    logo: '/socials/tiktok.png',
    description: 'Short-form video entertainment platform',
    followers: '1.7B',
    engagementRate: '5.9%',
    contentType: 'Short Videos, Live Streams',
  },
  {
    name: 'GitHub',
    logo: '/socials/github.png',
    description: 'Software development and version control platform',
    users: '100M+',
    engagementRate: '4.2%',
    contentType: 'Code, Issues, Pull Requests',
  },
  {
    name: 'Apple',
    logo: '/socials/apple.png',
    description: 'Technology company and digital ecosystem',
    marketCap: '$3T',
    userBase: '2B+',
    contentType: 'Apps, Services, Hardware',
  },
  {
    name: 'Microsoft',
    logo: '/socials/microsoft.png',
    description: 'Software and cloud computing leader',
    users: '1.5B+',
    marketShare: '75%',
    contentType: 'Software, Cloud, Gaming',
  },
  {
    name: 'Pinterest',
    logo: '/socials/pinterest.png',
    description: 'Visual discovery platform for inspiration',
    users: '450M+',
    engagementRate: '4.1%',
    contentType: 'Pins, Boards, Stories',
  },
  {
    name: 'LinkedIn',
    logo: '/socials/linkedin.png',
    description: 'Professional networking platform',
    users: '900M+',
    engagementRate: '3.5%',
    contentType: 'Posts, Jobs, Articles',
  },
  {
    name: 'YouTube',
    logo: '/socials/youtube.png',
    description: 'Video sharing and streaming platform',
    users: '2.7B',
    engagementRate: '4.8%',
    contentType: 'Videos, Shorts, Live',
  },
  {
    name: 'Reddit',
    logo: '/socials/reddit.png',
    description: 'Community-driven content platform',
    users: '500M+',
    engagementRate: '4.4%',
    contentType: 'Posts, Subreddits, AMAs',
  },
  {
    name: 'Twitter',
    logo: '/socials/twitter.png',
    description: 'Real-time microblogging platform',
    users: '450M+',
    engagementRate: '3.2%',
    contentType: 'Tweets, Spaces, Lists',
  },

  {
    name: 'Google',
    logo: '/socials/google.png',
    description: 'Search and technology services',
    users: '4B+',
    marketShare: '92%',
    contentType: 'Search, Apps, Services',
  },
]

export default function Home() {
  return (
    <>
      <TopMenuBar />
      <section className='container grid items-center gap-6 pb-8 pt-6 md:py-10'>
        <div className='flex max-w-[980px] flex-col items-start gap-2'>
          <h1 className='text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl'>
            Welcome to our Mental Health Counseling Chatbot
          </h1>
          <p className='text-muted-foreground max-w-[700px] text-lg'>
            Click on{' '}
            <Link href={'/apis'} className='font-bold text-primary hover:underline'>
              Documentation
            </Link>{' '}
            to see our Scraping APIs.
          </p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8'>
          {socialPlatforms.map((platform) => (
            <div
              key={platform.name}
              className='rounded-lg border p-6 hover:shadow-lg transition-shadow'
            >
              <div className='flex items-center gap-4 mb-4'>
                <Image
                  src={platform.logo}
                  alt={`${platform.name} logo`}
                  width={48}
                  height={48}
                  className='rounded-full'
                />
                <h3 className='text-xl font-bold'>{platform.name}</h3>
              </div>
              <p className='text-muted-foreground mb-4'>{platform.description}</p>
              <div className='space-y-2'>
                <div className='flex justify-between'>
                  <span className='font-medium'>Active Users:</span>
                  <span>{platform.followers}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='font-medium'>Engagement Rate:</span>
                  <span>{platform.engagementRate}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='font-medium'>Content Types:</span>
                  <span className='text-right'>{platform.contentType}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
