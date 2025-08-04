import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getNoteCategoriesAction } from 'redux/noteCategories/action';
import { loggedInUser } from 'helpers/loggedInUser';
import { SearchCache, sanitizeSearchTerm } from 'utils/searchUtils';

const useNotesTypes = (initialSearch = '', config = {}) => {
    const { debounceMs = 300, limit = 20, enableCache = true } = config;
    
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    
    const [search, setSearch] = useState(sanitizeSearchTerm(initialSearch));
    const [cache] = useState(() => new SearchCache());

    const clinicId = loggedInUser?.clinicId;
    const notesTypesData = store?.getNoteCategoriesReducer?.data;
    const isLoading = store?.getNoteCategoriesReducer?.loading;

    const selectOptions = useMemo(() => {
        if (!notesTypesData?.data) return [];
        return notesTypesData.data.map((note) => ({
            label: note?.title,
            value: note?._id,
            data: note
        }));
    }, [notesTypesData?.data]);

    const fetchNotesTypes = useCallback((searchTerm = '') => {
        if (!clinicId) return;

        const sanitized = sanitizeSearchTerm(searchTerm);
        const cacheKey = `${clinicId}-${sanitized}`;
        
        if (enableCache && !sanitized && cache.has(cacheKey)) return;

        const params = {
            search: sanitized,
            skip: 1,
            limit: sanitized ? limit : 10,
            clinicId: clinicId,
            active: true,
            noteType: '',
        };

        dispatch(getNoteCategoriesAction(params));
        
        if (enableCache && !sanitized) {
            cache.set(cacheKey, true);
        }
    }, [dispatch, clinicId, cache, enableCache, limit]);

    useEffect(() => {
        if (!clinicId) return;
        const timeoutId = setTimeout(() => {
            fetchNotesTypes(search);
        }, search ? debounceMs : 0);
        return () => clearTimeout(timeoutId);
    }, [search, fetchNotesTypes, clinicId, debounceMs]);

    useEffect(() => {
        if (clinicId && !notesTypesData?.data?.length && !isLoading) {
            fetchNotesTypes('');
        }
    }, [clinicId, notesTypesData?.data?.length, isLoading, fetchNotesTypes]);

    const handleSearch = useCallback((searchTerm) => {
        setSearch(sanitizeSearchTerm(searchTerm));
    }, []);

    const refresh = useCallback(() => {
        cache.clear();
        fetchNotesTypes(search);
    }, [fetchNotesTypes, search, cache]);

    return {
        options: selectOptions,
        isLoading,
        error: store?.getNoteCategoriesReducer?.error,
        handleSearch,
        refresh
    };
};

export default useNotesTypes;