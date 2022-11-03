// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function debounce(_node: HTMLElement, params: { [key: string]: any }) {
    let timer: NodeJS.Timeout;
    return {
        update() {
            clearTimeout(timer);
            timer = setTimeout(params.func, params.duration);
        },
        destroy() {
            clearTimeout(timer);
        }
    }
};