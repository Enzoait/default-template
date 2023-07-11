
export const updateApplicationConfig = (payload) => ({
    type: 'UPDATE_APPLICATION_PROPERTIES_PAGE_TITLE',
    payload: payload,
});

export const addBase64imageToCache = (payload) => ({
    type: 'ADD_BASE64_IMAGE_TO_CACHE',
    payload: payload,
});

export const clearImagesCache = (payload) => ({
    type: 'CLEAR_IMAGE_CACHE',
    payload: {},
});
