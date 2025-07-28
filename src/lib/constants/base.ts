export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
export const WEBSITE_ID = process.env.NEXT_PUBLIC_WEBSITE_ID;
export const LICENSE_KEY = process.env.NEXT_PUBLIC_LICENCE_KEY;
export const BACKEND_URL_WITH_WEBSITE_ID = `${BACKEND_URL}/website/${WEBSITE_ID}`;
export const BACKEND_URL_WITH_WEBSITE_IDV2 = `${BACKEND_URL}/website/v2/${WEBSITE_ID}`;
