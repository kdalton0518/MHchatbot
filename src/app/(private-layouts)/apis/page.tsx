import ReactSwagger from '@/src/components/SwaggerDocumentation'
import { getApiDocs } from '@/src/lib/swagger'
import '@/src/styles/swagger.css'

export default async function Scrapers() {
  const spec = await getApiDocs()
  return (
    <div className='bg-gradient-to-br from-emerald-50 to-emerald-50 dark:from-gray-900 dark:to-gray-900 min-h-screen py-8 overflow-x-hidden'>
      <div className='container max-w-6xl mx-auto mb-20 pb-10'>
        <ReactSwagger spec={spec} />
      </div>
    </div>
  )
}
