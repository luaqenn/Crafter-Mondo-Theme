import { useApi } from '@/lib/hooks/useApi';
import { BACKEND_URL_WITH_WEBSITE_ID } from '../constants/base';
import { User } from '../types/user';
import { Category } from '../types/category';

export const useCategoryService = () => {
    const { post, get } = useApi({ baseUrl: BACKEND_URL_WITH_WEBSITE_ID });

    const getCategories = async (): Promise<Category[]> => {
        const response = await get<Category[]>('/categories', {}, true);
        return response.data;
    }

    const getCategory = async (category_id: string): Promise<Category> => {
        const response = await get<Category>(`/categories/${category_id}`, {}, true);
        return response.data;
    }

    return {
        getCategories,
        getCategory,
    };
}; 