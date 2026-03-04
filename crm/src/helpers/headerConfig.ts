export const headerConfig = (headers: any) => {
    try {
        headers.set('Authorization', `Bearer ${JSON.parse(localStorage.getItem('svcard_token') || '').access}`);
    } catch (e) {}
    return headers
}
