import Script from 'next/script'

export const MailchimpScript = () => {
  return (
    <>
      <Script
        id='mcjs'
        dangerouslySetInnerHTML={{
          __html: `!function(c,h,i,m,p){m=c.createElement(h),p=c.getElementsByTagName(h)[0],m.async=1,m.src=i,p.parentNode.insertBefore(m,p)}(document,"script","https://chimpstatic.com/mcjs-connected/js/users/e58bb757020049cd10bd8eb1f/426844e371bc03ca7a893207a.js");`,
        }}
      ></Script>
    </>
  )
}
