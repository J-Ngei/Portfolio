import { useState, useEffect } from 'react';
import { client } from './client';

export function useSanityQuery(query, params = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        const result = await client.fetch(query, params);
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching data:', err);
          setError(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [query, JSON.stringify(params)]);

  return { data, error, loading };
}

export function useSanityDocument(documentType, slug) {
  const query = `*[_type == $documentType && slug.current == $slug][0]`;
  return useSanityQuery(query, { documentType, slug });
}

export function useSanityDocuments(documentType, options = {}) {
  const { limit, order = 'publishedAt desc', ...filters } = options;
  
  let query = `*[_type == $documentType`;
  
  // Add filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) {
      query += ` && ${key} == "${value}"`;
    }
  });
  
  query += `]`;
  
  // Add ordering
  if (order) {
    query += ` | order(${order})`;
  }
  
  // Add limit
  if (limit) {
    query += `[0...${limit}]`;
  }
  
  return useSanityQuery(query, { documentType });
}
