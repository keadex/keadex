import { NextPage } from 'next'
import { generateStaticParamsFor, importPage } from 'nextra/pages'

import { useMDXComponents as getMDXComponents } from '../../../../../mdx-components'

type PageParams = {
  mdxPath: string[]
}

type PageProps = {
  params: Promise<PageParams>
}

export const generateStaticParams = async () => {
  let result = await generateStaticParamsFor('mdxPath')()
  result = result.map((staticParams) => {
    return {
      ...staticParams,
      lang: 'en',
    }
  })
  return result
}

export async function generateMetadata(props: PageProps) {
  const params = await props.params
  const { metadata } = await importPage(params.mdxPath)
  metadata.title = `${metadata.title} - Keadex`
  return metadata
}

const Wrapper = getMDXComponents().wrapper

const Page: NextPage<PageProps> = async (props) => {
  const params = await props.params
  const {
    default: MDXContent,
    toc,
    metadata,
    sourceCode,
  } = await importPage(params.mdxPath)
  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      <MDXContent {...props} params={params} />
    </Wrapper>
  )
}

export default Page
