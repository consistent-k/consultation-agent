import { type RefObject, useEffect, useState } from 'react';

const useScrollToBottom = (scrollRef: RefObject<HTMLDivElement | null>) => {
    const [autoScroll, setAutoScroll] = useState(true);

    const scrollDomToBottom = () => {
        const dom = scrollRef.current;
        if (dom) {
            requestAnimationFrame(() => {
                setAutoScroll(true);
                dom.scrollTo({ top: dom.scrollHeight, behavior: 'smooth' });
            });
        }
    };

    // auto scroll on new content
    useEffect(() => {
        if (autoScroll) {
            scrollDomToBottom();
        }
    });

    return {
        scrollRef,
        autoScroll,
        setAutoScroll,
        scrollDomToBottom
    };
};

export default useScrollToBottom;
