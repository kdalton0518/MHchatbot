import TopMenuBar from '@/src/components/Sidebar/TopMenuBar'

export default function Home() {
  return (
    <>
      <TopMenuBar />
      <div className='container mx-auto py-8 max-w-md px-4'>
        <div className='mb-4'>
          <p className='text-justify text-base'>
            <strong>Welcome</strong> to the <strong>MHChatbot</strong>! Take control of your mental
            health with our 24/7 counseling chatbot. Whether you're feeling stressed, anxious, or
            just need someone to talk to, we're here to listen and support you anytime, anywhere.
            Get personalized coping strategies, emotional insights, and compassionate guidance—all
            in a safe, private, and judgment-free space. Your mental wellness is just a message
            away.
          </p>
          <h6 className='text-lg font-semibold mt-4 mb-2'>Features</h6>
          <hr className='border-gray-300' />
        </div>
      </div>
    </>
  )
}
