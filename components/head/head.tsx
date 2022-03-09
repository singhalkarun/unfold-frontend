import Head from 'next/head'

export const Header = () => {
  const currentUrl = 'https://unfold.fun/'
  const previewImage = 'https://unfold.fun/images/illustration.gif'
  const siteName = 'UnFold'
  const pageTitle = 'UnFold Yourself'
  const description =
    'UnFold is an ecosystem of apps to help you improve your mental health.'
  const imageAlt = 'A happy person'

  return (
    <Head>
      <title>UnFold</title>
      <meta name='description' content={description} />
      <link rel='canonical' href={currentUrl} />
      <meta name='robots' content='index, follow' />
      <meta name='viewport' content='width=device-width,initial-scale=1.0' />
      <meta property='og:url' content={currentUrl} key='ogurl' />
      <meta property='og:image' content={previewImage} key='ogimage' />
      <meta property='og:site_name' content={siteName} key='ogsitename' />
      <meta property='og:title' content={pageTitle} key='ogtitle' />
      <meta property='og:description' content={description} key='ogdesc' />
      <meta property='og:image:alt' content={imageAlt} key='ogimagealt' />
    </Head>
  )
}
