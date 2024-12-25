import { buttonVariants } from '@/src/components/Base/Button'
import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <div className='pt-6 w-full h-[90vh] flex flex-col items-center justify-center'>
      <div className='flex flex-row items-end gap-2 my-2'>
        <div className='text-2xl font-semibold'>404</div>
        <div>Not found</div>
      </div>
      <Link href='/' className={buttonVariants()}>
        Back to homepage
      </Link>
    </div>
  )
}
