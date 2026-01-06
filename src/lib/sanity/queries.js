// Common GROQ query fragments
export const imageFragment = `
  {
    _type,
    asset->{
      _id,
      url,
      metadata {
        dimensions {
          width,
          height,
          aspectRatio
        },
        lqip
      }
    },
    alt,
    caption
  }
`;

export const seoFragment = `
  seo {
    metaTitle,
    metaDescription,
    shareTitle,
    shareDescription,
    shareGraphic
  }
`;

// Common queries
export const siteSettingsQuery = `
  *[_type == "siteSettings"][0] {
    title,
    description,
    url,
    ${seoFragment}
  }
`;

export const pageQuery = `
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    content,
    ${seoFragment}
  }
`;

export const allPagesQuery = `
  *[_type == "page"] {
    _id,
    title,
    slug,
    _updatedAt
  }
`;

export const projectListQuery = `
  *[_type == "project"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage${imageFragment},
    publishedAt,
    categories[]->{
      _id,
      title,
      slug
    }
  }
`;

export const projectQuery = `
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    body,
    excerpt,
    mainImage${imageFragment},
    publishedAt,
    categories[]->{
      _id,
      title,
      slug
    },
    ${seoFragment}
  }
`;

export const blogPostListQuery = `
  *[_type == "blogPost"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage${imageFragment},
    publishedAt,
    categories[]->{
      _id,
      title,
      slug
    }
  }
`;

export const blogPostQuery = `
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    body,
    excerpt,
    mainImage${imageFragment},
    publishedAt,
    author->{
      name,
      image${imageFragment},
      bio
    },
    categories[]->{
      _id,
      title,
      slug
    },
    ${seoFragment}
  }
`;

export const contactQuery = `
  *[_type == "contact"][0] {
    title,
    description,
    email,
    phone,
    socialLinks[] {
      platform,
      url,
      icon
    },
    address {
      street,
      city,
      state,
      postalCode,
      country
    },
    formEnabled,
    formFields[] {
      fieldName,
      fieldType,
      required,
      options,
      placeholder
    }
  }
`;
