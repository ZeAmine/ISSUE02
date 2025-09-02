interface IMetadata {
  title?: string
  description?: string
  image?: { src: string } | null
}

export const useMetadata = ({ title = '', description = '', image = null }: IMetadata) => {
  const SITE_NAME = 'Boilerplate — '
  const route = useRoute()
  const canonicalPath = route.path

  const titleMeta = [
    {
      name: 'keywords',
      content: title
    },
    {
      property: 'og:title',
      hid: 'og_title',
      content: title
    },
    {
      name: 'twitter:title',
      hid: 'twitter_title',
      content: title
    }
  ]

  const descriptionMeta = [
    {
      name: 'description',
      hid: 'description',
      content: description
    },
    {
      property: 'og:description',
      hid: 'og_description',
      content: description
    },
    {
      property: 'og:image:alt',
      hid: 'og_image_alt',
      content: description
    },
    {
      name: 'twitter:description',
      hid: 'twitter_description',
      content: description
    },
    {
      name: 'twitter:image:alt',
      hid: 'twitter_image_alt',
      content: description
    }
  ]

  const imageMeta = [
    {
      property: 'og:image',
      hid: 'og_image',
      content: image?.src || '/images/share.jpg'
    },
    {
      property: 'og:image:secure_url',
      hid: 'og_image',
      content: image?.src || '/images/share.jpg'
    },
    {
      name: 'twitter:image:src',
      hid: 'twitter_image',
      content: image?.src || '/images/share.jpg'
    }
  ]

  useHead({
    title: `${SITE_NAME} ${title}`,
    meta: [
      ...(title ? titleMeta : []),
      ...(description ? descriptionMeta : []),
      ...(image ? imageMeta : [])
    ],
    link: [
      {
        rel: 'canonical',
        href: `https://alancohen.netlify.app${canonicalPath}`
      }
    ]
  })
}
