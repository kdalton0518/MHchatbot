import { getApiDocs } from '@/src/lib/swagger'

import ReactSwagger from '@/src/components/SwaggerDocumentation'

export default async function Scrapers() {
  const spec = await getApiDocs()
  return (
    <section className='container'>
      <ReactSwagger spec={spec} />
    </section>
  )
}
