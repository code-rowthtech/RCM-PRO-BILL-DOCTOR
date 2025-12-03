import { useMemo } from 'react';
import { useSelector } from 'react-redux';

const useNotesTypes = () => {
    const store = useSelector((state) => state);
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

    return {
        options: selectOptions,
        isLoading,
        error: store?.getNoteCategoriesReducer?.error
    };
};

export default useNotesTypes;