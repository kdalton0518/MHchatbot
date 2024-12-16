import Link from 'next/link'

export function NamedLogoWithLink() {
  return (
    <Link href='/' className='flex flex-row items-center gap-3'>
      <div className='logo' />
    </Link>
  )
}
